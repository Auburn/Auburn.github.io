/*
 * protoengine.js - live previews of the scalar prototypes in protos.wasm, on fnwasm.js's worker pool, tiles, cancelling and shading. Load fnwasm.js first.
 *
 *   const pe = await ProtoEngine.create( { wasm: 'protos.wasm', index: 'proto_index.json' } );
 *   pe.protos                                  // [ { key, name } ] everything in the module
 *   pe.index.ideas['erosion-filter']           // proto, params, presets, has3d, ns2, ns3, status, view hints: window, iso, sliceY, hscale (see proto_index.mjs)
 *   const view = pe.view( canvas, { idea: 'erosion-filter', mode: '2d', shade: 'terrain', onStats, onError, onParams } );
 *   view.set( { params: { oct: 3 } } );        // merged into the current params, cancels in-flight tiles, coarse pass first
 *   view.set( { idea: 'tile-domain' } );       // or { proto: 't_tile_domain', params: {...} } which replaces the params
 *   onParams( controls )                       // called after every change of prototype or params: what it reads now, ready for sliders
 *
 * View options, beyond fnwasm.js's shade, seed, range, worldHeight, onStats, onError:
 *   mode         '2d' | '3d' (slice) | 'vol' (iso surface) | 'relief' (oblique lit terrain, lab_render3d.h). No 'tile': prototypes have no 4D form.
 *   window       world units across the canvas, default 8 as in the harness. ox, oy: world origin, the harness's 0.37, 0.61
 *   sliceY, slice, sliceAxis   3d mode: x, sliceY, slice + j as Eval3( x, y, z ) for 'xz'; default sliceY = oy + 3.3, slice = 1.13, the harness sheet's panel
 *   volWindow, iso, steps, z0  vol mode. Cube side default 4, steps 64 (the harness's 160 is too slow for a live view).
 *   hscale       relief mode, vertical exaggeration in pixels of a 400 px tall canvas, default 90, as the harness
 *   budgetMs     no finer pass is started when its estimate from the last pass would end after this long, default 8000. onStats then has budgetStopped: true. Infinity always finishes.
 *   firstPassMs  the first pass is sized to take about this long, default 40. tileTargetMs: tile size, default 16
 *
 * Stats are fnwasm.js's plus budgetStopped and levels (the planned pass factors). Every change restarts from a pass the machine can do at once, then each finer
 * level replaces it (128, 256, 512 px for a typical prototype on a 512 canvas). Cancel drops the queue; a stale tile running over hardCancelMs (default 200) gets its worker replaced.
 *
 * Also: pe.core, a synchronous core on the main thread (ProtoEngine.instantiate gives one in Node): core.grid2, core.gridXZ, core.batch3, core.readParams.
 * pe.controls( reads, params, hints ) makes the slider list by hand; pe.probe( dsl ) gets the reads. A prototype is named by a string: 'key' or 'key|a=1,b=2'.
 */
( function( root )
{
    'use strict';
    const FnWasm = root.FnWasm || ( typeof require === 'function' ? require( './fnwasm.js' ) : null );
    if( !FnWasm || !FnWasm.internals ) throw new Error( 'protoengine.js needs fnwasm.js' );
    const { lib, Pool, View, loadBytes, coreSource, workerSource } = FnWasm.internals;

    // =============================================================================================================
    // Runs next to a WASM instance. Serialised with toString() into blob workers, so it only touches what it is given.
    // =============================================================================================================
    function protoFactory( lib )
    {
        'use strict';
        const now = () => performance.now();

        function parseString( str )
        {
            const bar = str.indexOf( '|' ), key = bar < 0 ? str : str.slice( 0, bar ), params = [];
            if( bar >= 0 && bar + 1 < str.length )
            {
                for( const kv of str.slice( bar + 1 ).split( ',' ) )
                {
                    const eq = kv.indexOf( '=' ), v = Number( kv.slice( eq + 1 ) );
                    if( eq <= 0 || !isFinite( v ) ) throw new lib.DslError( "bad param '" + kv + "'" );
                    params.push( [ kv.slice( 0, eq ), v ] );
                }
            }
            return { key, params };
        }

        class ProtoCore extends lib.Core
        {
            constructor( instance )
            {
                super( instance );
                const x = this.x;
                this.keys = new Map();
                this.list = [];
                for( let i = 0, n = x.protoCount(); i < n; i++ )
                {
                    const key = this.cstr( x.protoKey( i ) );
                    this.keys.set( key, i );
                    this.list.push( { key, name: this.cstr( x.protoName( i ) ) } );
                }
                // Everything mutable is restored on a change of prototype, params or seed, see protoStateStart in proto_api.cpp. Just above the malloc in the base class.
                this.stateStart = x.protoStateStart();
                this.state = new Uint8Array( x.memory.buffer.slice( this.stateStart, x.protoStateEnd() ) );
                this.active = null;
                this.restores = 0;

                // FastNoise's C API shape, so the base class's runRect and runVolume work unchanged.
                x.fnGenUniformGrid2D = ( node, out, x0, y0, w, h, sx, sy, seed, mm ) => x.protoRect2( out, x0, y0, sx, sy, w, h, seed, mm );
                x.fnGenUniformGrid3D = ( node, out, x0, y0, z0, w, h, d, sx, sy, sz, seed, mm ) => x.protoRect3( out, x0, y0, z0, w, h, d, sx, sy, sz, seed, mm );
                x.fnGenPositionArray3D = ( node, out, n, xs, ys, zs, ox, oy, oz, seed, mm ) => x.protoBatch3( out, xs, ys, zs, n, seed, mm );
                x.fnDeleteNodeRef = () => {};
            }

            validate( str )
            {
                const { key } = parseString( str );
                if( !this.keys.has( key ) ) throw new lib.DslError( "no prototype '" + key + "'" );
            }
            cachedNode() { return 1; }  // what runs was chosen by activate
            buildString() { return 1; }

            // dim: Eval2 and Eval3 also start fresh from each other, as they do natively on new threads. A few prototypes keep a thread_local in one that the other reads.
            activate( str, seed, dim )
            {
                const id = str + '#' + seed + '#' + dim;
                if( this.active === id ) return;
                this.validate( str );
                const x = this.x, { key, params } = parseString( str );
                new Uint8Array( x.memory.buffer ).set( this.state, this.stateStart );
                this.restores++;
                this.scratchPtr = 0; this.scratchBytes = 0;   // the restored heap no longer has it
                x.protoSelect( this.keys.get( key ) );
                for( const [ k, v ] of params ) this.withCString( k, c => x.protoSetParam( c, v ) );
                this.active = id;
            }

            runJob( j )
            {
                if( j.kind === 'probe' ) return this.runProbe( j );
                this.activate( j.dsl, j.seed, j.kind === 'rect' && j.mode === '2d' ? 2 : 3 );
                return super.runJob( j );
            }

            // ---- direct use, for Node and tests: copies of the results ---------------------------------------------------
            grid2( str, seed, x0, y0, step, w, h = w )
            {
                this.activate( str, seed, 2 );
                const out = this.scratch( w * h * 4 );
                this.x.protoRect2( out, x0, y0, step, step, w, h, seed, this.mm );
                return this.f32().slice( out >> 2, ( out >> 2 ) + w * h );
            }
            gridXZ( str, seed, x0, y, z0, step, w, h = w )
            {
                this.activate( str, seed, 3 );
                const out = this.scratch( w * h * 4 );
                this.x.protoRect3( out, x0, y, z0, w, 1, h, step, 1, step, seed, this.mm );
                return this.f32().slice( out >> 2, ( out >> 2 ) + w * h );
            }
            batch3( str, seed, xs, ys, zs )
            {
                this.activate( str, seed, 3 );
                const n = xs.length, ptr = this.scratch( n * 16 ), b = ptr >> 2;
                const hf = this.f32();
                hf.set( xs, b ); hf.set( ys, b + n ); hf.set( zs, b + 2 * n );
                this.x.protoBatch3( ptr + 12 * n, ptr, ptr + 4 * n, ptr + 8 * n, n, seed, this.mm );
                return this.f32().slice( b + 3 * n, b + 4 * n );
            }

            // What the prototype reads with these params: a fresh start, so a cache built once reads again, then a small grid in both dimensions.
            readParams( str, seed = 1337, window = 8, ox = 0.37, oy = 0.61 )
            {
                this.active = null;
                this.activate( str, seed, 'probe' );
                const x = this.x, n = 16, step = window / n, out = this.scratch( n * n * 4 );
                const t0 = now();
                x.protoRect2( out, ox, oy, step, step, n, n, seed, this.mm );
                x.protoRect3( out, ox, oy + 3.3, 1.13, n, 1, n, step, 1, step, seed, this.mm );
                const ms = now() - t0, reads = [];
                this.active = null;
                for( let i = 0, c = x.protoReadCount(); i < c; i++ )
                    reads.push( { key: this.cstr( x.protoReadKey( i ) ), default: x.protoReadDefault( i ), int: !!x.protoReadIsInt( i ) } );
                return { reads, ms, samples: 2 * n * n };
            }
            runProbe( j )
            {
                const r = this.readParams( j.dsl, j.seed, j.window, j.ox, j.oy );
                return { data: new Float32Array( 0 ), min: 0, max: 0, ms: r.ms, samples: r.samples, extra: r.reads };
            }
        }

        function instantiateCore( module )
        {
            const imports = lib.makeImports( module );
            let memory = null;
            // Nothing prints at run time today. If something does, a 0 from a bare stub would make musl retry the write forever.
            const wasi = imports.wasi_snapshot_preview1;
            if( wasi && wasi.fd_write ) wasi.fd_write = ( fd, iov, count, written ) =>
            {
                const h = new Uint32Array( memory.buffer );
                let total = 0;
                for( let i = 0; i < count; i++ ) total += h[( iov >> 2 ) + i * 2 + 1];
                h[written >> 2] = total;
                return 0;
            };
            return WebAssembly.instantiate( module, imports ).then( instance =>
            {
                memory = instance.exports.memory;
                return new ProtoCore( instance );
            } );
        }

        async function instantiate( src )
        {
            return instantiateCore( src instanceof WebAssembly.Module ? src : await WebAssembly.compile( src ) );
        }

        return { instantiate, ProtoCore, parseString };
    }

    const plib = protoFactory( lib );
    const clock = () => performance.now();

    function dslOf( key, params )
    {
        const names = Object.keys( params || {} ).sort();
        return names.length ? key + '|' + names.map( k => k + '=' + params[k] ).join( ',' ) : key;
    }

    // ---- sliders ---------------------------------------------------------------------------------------------------------
    const MODE_LIKE = /^(c?mode|wmode|kind|shape|prof|profile|kern|kernel|layout|metric|type|form|fam|family|src|source|out|output|path|pat|pattern|rule|fold|root|bond|diag|method)\d*$/i;

    function niceStep( span )
    {
        const raw = span / 200, mag = Math.pow( 10, Math.floor( Math.log10( raw ) ) ), f = raw / mag;
        return ( f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10 ) * mag;
    }

    // Ranges from the default: 0 to 3x for floats, the source's own comparisons (hint) for ints when the build found any.
    function sliderOf( read, value, hint )
    {
        const d = read.default;
        let min, max, step, modeLike = false;
        if( read.int )
        {
            modeLike = MODE_LIKE.test( read.key ) || ( !!hint && hint.max - hint.min <= 1 );
            if( modeLike ) { min = hint ? Math.min( hint.min, d ) : Math.min( 0, d ); max = hint ? Math.max( hint.max, d ) : Math.max( d, 7 ); }
            else
            {
                min = d < 0 ? d * 3 : ( hint ? Math.min( hint.min, d, 0 ) : 0 );
                max = Math.max( d * 3, d + 3, hint ? hint.max : 0 );
            }
            step = 1;
        }
        else
        {
            if( d > 0 ) { min = 0; max = d * 3; }
            else if( d < 0 ) { min = d * 3; max = 0; }
            else { min = 0; max = 1; }
            step = niceStep( max - min );
        }
        if( value < min ) min = value;
        if( value > max ) max = value;
        if( !read.int && ( value !== d ) && Math.abs( value ) * 1.5 > max && value > 0 ) max = value * 1.5;   // room above a preset far past the default
        return { min, max, step, modeLike };
    }

    // ---- the view ---------------------------------------------------------------------------------------------------------
    const PROTO_DEFAULTS = {
        window: 8, volWindow: 4, sliceY: null, slice: 1.13, steps: 64, hscale: 90, iso: 0, z0: 0.53, ox: 0.37, oy: 0.61, seed: 1337, mode: '2d', shade: 'terrain',
        budgetMs: 8000, firstPassMs: 40, tileTargetMs: 16, progressive: true, onParams: null
    };
    const UNKNOWN_NS = 20000;   // until the index or a result says otherwise: a slow prototype should not stall its first pass

    class ProtoView extends View
    {
        constructor( engine, canvas, opts )
        {
            const o = Object.assign( {}, PROTO_DEFAULTS );
            const expanded = engine.expand( opts, {} );
            Object.assign( o, opts, expanded.opts );
            super( engine, canvas, o );
            this.protoKey = expanded.key;
            this.params = expanded.params;
            this.nsEstimate = expanded.ns;
            this.budgetStopped = false;
            this.levels = [];
            this.reliefImage = null;
            engine.reportParams( this );
        }

        // { idea } or { proto, params } replace the prototype, { params } merges into the current params; the rest is as fnwasm.js.
        set( opts )
        {
            const expanded = this.engine.expand( opts, this );
            const merged = Object.assign( {}, opts, expanded.opts );
            delete merged.idea; delete merged.proto; delete merged.params;
            this.protoKey = expanded.key;
            this.params = expanded.params;
            const dslChanged = merged.dsl !== undefined && merged.dsl !== this.o.dsl;
            if( dslChanged )
            {
                this.lastRange = null;
                if( expanded.protoChanged ) this.nsEstimate = expanded.ns;
            }
            const r = super.set( merged );
            if( dslChanged ) this.engine.reportParams( this );
            return r;
        }

        start()
        {
            const o = this.o, engine = this.engine;
            try
            {
                engine.core.validate( o.dsl );
                if( o.mode === 'tile' ) throw new FnWasm.DslError( 'prototypes have no 4D form, so no tile mode' );
                this.error = null;
            }
            catch( err )
            {
                this.error = err;
                if( o.onError ) o.onError( err );
                this.settle( { error: err.message } );
                return;
            }
            this.counters.renders++;
            // A restart right after the last one is a drag: a first pass that fits a frame shows every step, at a coarser level.
            const dragging = this.t0 !== undefined && clock() - this.t0 < 120, firstMs = dragging ? Math.min( o.firstPassMs, o.frameMs ) : o.firstPassMs;
            this.t0 = clock();
            this.budgetStopped = false;
            const W = this.canvas.width, H = this.canvas.height, workers = engine.pool.size, ns = this.nsEstimate || UNKNOWN_NS, drag = !!o.interactive;
            o.scale = o.window / W;
            // A relief field is as deep as it is wide, as the harness renders it, whatever the canvas shows of it.
            const fieldH = o.mode === 'relief' ? Math.max( W, H ) : H;
            this.fullW = W; this.fullH = fieldH;
            const vol = o.mode === 'vol', size = vol ? Math.min( W, H ) : 0;
            const passSize = F => vol ? [ Math.ceil( size / F ), Math.ceil( size / F ) ] : [ Math.ceil( W / F ), Math.ceil( fieldH / F ) ];
            // A ray costs about steps / 2 evaluations.
            const passMs = F => { const [ w, h ] = passSize( F ); return ns * w * h * ( vol ? Math.ceil( o.steps / F ) * 0.5 : 1 ) / workers / 1e6; };
            const maxF = Math.max( 1, 1 << Math.floor( Math.log2( Math.max( 1, Math.min( W, fieldH ) / 32 ) ) ) );
            const dragEdge = F => Math.max( ...passSize( F ) ) > ( vol ? 256 : o.dragMax );

            let F = 1;
            if( o.progressive !== false ) while( F < maxF && ( passMs( F ) > ( drag ? o.dragMs : firstMs ) || ( drag && dragEdge( F ) ) ) ) F *= 2;
            const factors = [];
            for( ; F >= 1; F /= 2 ) { factors.push( F ); if( drag ) break; }   // onResult cuts this short by the measured cost, the estimate here can be for other params
            this.levels = factors;
            try { this.passes = factors.map( f => { const [ w, h ] = passSize( f ); return this.newPass( f, w, h ); } ); }
            catch( err ) { this.allocFailed( err ); return; }
            this.passIdx = 0;
            this.queuePass( this.passes[0] );
            engine.pool.pump();
        }

        tileEdge( pass )
        {
            const o = this.o, n = this.engine.pool.size, ns = this.nsEstimate || UNKNOWN_NS;
            let edge = Math.sqrt( o.tileTargetMs * 1e6 / ns );
            edge = Math.min( edge, 256, Math.ceil( Math.max( pass.w, pass.h ) / Math.ceil( Math.sqrt( 2 * n ) ) ) );
            return Math.max( 12, Math.round( edge / 4 ) * 4 );
        }

        queuePass( pass )
        {
            const o = this.o;
            pass.tStart = clock();
            if( o.mode === 'vol' )
            {
                // Rays per band so a band takes about a tile's time. A band cannot be interrupted, cancelling replaces the worker.
                const gen = this.gen, steps = Math.ceil( o.steps / pass.F ), jobs = [], ns = this.nsEstimate || UNKNOWN_NS;
                const perRowMs = ns * pass.w * steps * 0.5 / 1e6;
                const rows = Math.max( 1, Math.min( Math.ceil( pass.h / Math.max( 2, this.engine.pool.size ) ), Math.round( o.tileTargetMs * 4 / perRowMs ) ) );
                const common = { kind: 'vol', dsl: o.dsl, seed: o.seed, x0: o.ox, y0: o.oy, z0: o.z0, L: o.volWindow, iso: o.iso, size: pass.w, steps };
                for( let j0 = 0; j0 < pass.h; j0 += rows )
                {
                    const j1 = Math.min( j0 + rows, pass.h );
                    jobs.push( { view: this, gen, pass, tx: 0, ty: j0, tw: pass.w, th: j1 - j0, gx: 0, gy: j0, gw: pass.w, gh: j1 - j0, msg: Object.assign( { j0, j1 }, common ) } );
                }
                jobs.reverse();
                pass.remaining = pass.total = jobs.length;
                this.queue = jobs;
                return;
            }
            super.queuePass( pass );
            for( const job of this.queue )
            {
                if( o.mode === 'relief' ) job.msg.mode = '2d';
                else if( o.mode === '3d' && o.sliceAxis !== 'xy' ) job.msg.oy = o.sliceY === null ? o.oy + 3.3 : o.sliceY;
            }
        }

        // The pass about to finish tells what the next will cost: 4x per level in 2D, 8x in a volume (rays both ways, and steps).
        onResult( job, r )
        {
            const pass = job.pass;
            if( pass.remaining === 1 && pass !== this.passes[this.passes.length - 1] )
            {
                const idx = this.passes.indexOf( pass ), next = this.passes[idx + 1], ratio = Math.pow( pass.F / next.F, this.o.mode === 'vol' ? 3 : 2 );
                const t = clock();
                if( ( t - this.t0 ) + ( t - pass.tStart ) * ratio > this.o.budgetMs )
                {
                    this.passes.length = idx + 1;
                    this.budgetStopped = true;
                }
            }
            super.onResult( job, r );
        }

        report( pass, final )
        {
            const cb = this.o.onStats;
            this.o.onStats = null;   // the base class calls it, and the stats are not complete until after that
            super.report( pass, final );
            this.o.onStats = cb;
            const s = this.lastStats;
            s.budgetStopped = this.budgetStopped;
            s.levels = this.levels;
            if( cb ) cb( s );
        }
    }

    // ---- the engine ---------------------------------------------------------------------------------------------------------
    // Runs its probes on the pool as a view with no canvas, one at a time, newest wins for each caller.
    class ProbeClient
    {
        constructor( engine ) { this.engine = engine; this.gen = 0; this.waiting = []; this.current = null; }
        add( msg ) { return new Promise( ( resolve, reject ) => { this.waiting.push( { msg, resolve, reject } ); this.engine.pool.pump(); } ); }
        takeJob()
        {
            if( this.current || !this.waiting.length ) return null;
            const w = this.waiting.shift();
            this.current = w;
            return { view: this, gen: this.gen, msg: w.msg, waiter: w };
        }
        onResult( job, r ) { this.current = null; job.waiter.resolve( r.extra ); this.engine.pool.pump(); }
        onJobFailed( message ) { const w = this.current; this.current = null; if( w ) w.reject( new Error( message ) ); this.engine.pool.pump(); }
    }

    class ProtoEngine extends FnWasm.Engine
    {
        constructor( core, module, bytes, opts, index )
        {
            super( core, module, bytes, opts );
            this.index = index || { ideas: {}, protos: {} };
            this.protos = core.list;
            this.prober = null;
        }

        // Same worker loop, around this file's core.
        get pool()
        {
            if( !this._pool )
            {
                if( !this.opts.workerUrl )
                {
                    this.opts.workerUrl = this.workerBlob = URL.createObjectURL( new Blob(
                        [ '(' + workerSource + ')((' + protoFactory.toString() + ')((' + coreSource + ')()));' ], { type: 'text/javascript' } ) );
                }
                this._pool = new Pool( this, this.workerCount, this.opts );
                this.prober = new ProbeClient( this );
                this._pool.views.push( this.prober );
            }
            return this._pool;
        }
        get nodes() { return this.protos; }

        dsl( key, params ) { return dslOf( key, params ); }

        // Turns { idea } / { proto, params } / { params } into the view's dsl and related options, with what the index knows.
        expand( opts, current )
        {
            const out = { opts: {}, key: current.protoKey, params: current.params || {}, ns: 0, protoChanged: false };
            let ideaNs = 0;
            if( opts.idea !== undefined )
            {
                const e = this.index.ideas[opts.idea];
                if( !e ) throw new Error( "no idea '" + opts.idea + "' in the index" );
                out.key = e.proto; out.params = Object.assign( {}, e.params );
                out.protoChanged = out.key !== current.protoKey;
                const hint = e.view || {};
                if( opts.window === undefined ) out.opts.window = hint.window || 8;
                if( opts.iso === undefined ) out.opts.iso = hint.iso !== undefined ? hint.iso : 0;
                if( opts.sliceY === undefined ) out.opts.sliceY = hint.sliceY !== undefined ? hint.sliceY : null;
                if( opts.hscale === undefined ) out.opts.hscale = hint.hscale || 90;
                ideaNs = e.ns2;
            }
            else if( opts.proto !== undefined )
            {
                out.protoChanged = opts.proto !== current.protoKey;
                out.key = opts.proto; out.params = Object.assign( {}, opts.params );
            }
            else if( opts.params !== undefined ) out.params = Object.assign( {}, current.params, opts.params );
            if( out.key !== undefined && ( opts.idea !== undefined || opts.proto !== undefined || opts.params !== undefined ) ) out.opts.dsl = dslOf( out.key, out.params );
            else if( opts.dsl !== undefined )
            {
                const parsed = plib.parseString( opts.dsl );
                out.protoChanged = parsed.key !== current.protoKey;
                out.key = parsed.key; out.params = {};
                for( const [ k, v ] of parsed.params ) out.params[k] = v;
                out.opts.dsl = opts.dsl;
            }
            const info = out.key && this.index.protos && this.index.protos[out.key];
            out.ns = ideaNs || ( info && info.ns2 ) || 0;
            return out;
        }

        // Promise of the reads for a prototype string, measured in a worker. [ { key, default, int } ]
        probe( dsl, seed = 1337, window = 8 )
        {
            this.pool;
            return this.prober.add( { kind: 'probe', dsl, seed, window, ox: 0.37, oy: 0.61 } );
        }

        // Slider list for reads: key, label, int, default, value, min, max, step, modeLike. set: a param is only sent once moved, some prototypes test for its presence.
        controls( reads, params, hints )
        {
            return reads.map( r =>
            {
                const value = params && params[r.key] !== undefined ? params[r.key] : r.default, hint = hints && hints[r.key];
                return Object.assign( { key: r.key, label: r.key, int: r.int, default: r.default, value, isSet: !!params && params[r.key] !== undefined }, sliderOf( r, value, hint ) );
            } );
        }

        reportParams( view )
        {
            if( !view.o.onParams ) return;
            const dsl = view.o.dsl, ticket = view.probeTicket = ( view.probeTicket || 0 ) + 1;
            this.probe( dsl, view.o.seed, view.o.window ).then( reads =>
            {
                if( ticket !== view.probeTicket ) return;
                const info = this.index.protos && this.index.protos[view.protoKey];
                if( view.o.onParams ) view.o.onParams( this.controls( reads, view.params, info && info.int_hints ), reads );
            } ).catch( err => { if( view.o.onError ) view.o.onError( err ); } );
        }

        view( canvas, opts ) { return new ProtoView( this, canvas, opts ); }
        render( canvas, opts ) { const v = this.view( canvas, opts ); return v.done.then( r => { v.destroy(); return r; } ); }

        destroy()
        {
            super.destroy();
            if( this.workerBlob ) { URL.revokeObjectURL( this.workerBlob ); this.workerBlob = null; this.opts.workerUrl = undefined; }
        }
    }

    async function create( opts )
    {
        const o = Object.assign( { wasm: 'protos.wasm', index: 'proto_index.json', hardCancelMs: 200 }, opts );
        let module = null, bytes = null;
        if( o.wasm instanceof WebAssembly.Module ) module = o.wasm;
        else
        {
            bytes = await loadBytes( o.wasm );
            if( !WebAssembly.validate( bytes ) ) throw new Error( 'protos.wasm does not validate on this engine' );
            module = await WebAssembly.compile( bytes );
        }
        let index = o.index;
        if( typeof index === 'string' )
        {
            const res = await fetch( index );
            index = res.ok ? await res.json() : null;
        }
        const core = await plib.instantiate( module );
        return new ProtoEngine( core, module, bytes, o, index );
    }

    const api = { create, instantiate: plib.instantiate, dsl: dslOf, sliderOf, ProtoEngine, ProtoView };
    if( typeof module === 'object' && module.exports ) module.exports = api;
    else root.ProtoEngine = api;
} )( typeof globalThis !== 'undefined' ? globalThis : this );
