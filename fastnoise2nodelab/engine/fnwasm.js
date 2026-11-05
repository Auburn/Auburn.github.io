/*
 * fnwasm.js - live FastNoise2 previews in the browser, no dependencies, no shared memory.
 *
 *   const fn = await FnWasm.create({ wasm: 'fnwasm.wasm' });     // fetched and compiled once, posted to the workers
 *   fn.nodes                                                     // every registered node, members ready for generated controls
 *   const tree = fn.parse( 'FractalFBm(Octaves=5, Source=Simplex(Feature Scale=60))' );
 *   fn.controls( tree )                                          // flat list: path, member, value, slider range, set( v )
 *   fn.toDsl( tree ); fn.encode( tree ); fn.decode( encoded ); fn.defaultDsl( 'FractalFBm' );
 *   const view = fn.view( canvas, { dsl, mode: '2d', shade: 'terrain', onStats, onError } );
 *   view.set( { dsl: newString } );                              // cancels in-flight tiles and re-renders
 *
 * View options
 *   dsl          tree DSL, or 'enc:<encoded node tree>'
 *   mode         '2d' | '3d' (slice) | 'tile' (seamless, 4D) | 'relief' (oblique lit terrain) | 'vol' (iso surface, canvas is the cube view)
 *   shade        'gray' | 'hillshade' | 'terrain' (hillshade with ramp, the fnlab look) | 'ramp' (no light)
 *   seed, scale  world units per pixel, as fnlab --scale. ox, oy are the world origin (fnlab's defaults)
 *   slice, sliceAxis ('xz' | 'xy')     3d mode. repeat: tile mode, draws the tile NxN so seams would show
 *   iso, steps, extent, z0             vol mode, see lab_render3d.h
 *   hscale       relief mode, vertical exaggeration in pixels of a 400 px tall canvas, default 90
 *   light        hillshade, terrain and relief: azimuth in degrees, default is the harness's fixed light. hscale and light recolour without generating
 *   range [lo, hi]                     fixed display range, default is the field's own min and max
 *   tileSize     number or 'auto'. progressive: true, false or 'auto' (a coarse pass first when a full pass would outlast a frame)
 *   interactive  true while a slider or pan drags: only a coarse pass, at most dragMax px (default 640) and about dragMs of work (default 24), so a large output stays responsive. Set false after release to refine
 *   onStats( { min, max, nsPerSample, wallMs, samples, final, width, height, passW, passH, progress, etaMs, ... } ), onError( err ); err.outOfMemory when a buffer could not be allocated
 *
 * The canvas may be any shape: view.resize( w, h ) sets the output size, drops every buffer of the old size and renders. fn.setWorkers( n ) changes the pool, tiles in hand finish first.
 *
 * Also: fn.render( canvas, opts ) one-shot promise; FnWasm.instantiate( bytesOrModule ) gives a synchronous Core for Node or a worker.
 * Workers come from a blob URL, falling back to this file when it was loaded by a script tag (or opts.workerUrl). workers: 0 runs on the main thread.
 */
( function( root )
{
    'use strict';

    // =============================================================================================================
    // Core: everything that runs next to a WASM instance. Serialised with toString() into blob workers, so it must
    // not touch anything from the enclosing scope.
    // =============================================================================================================
    function coreFactory()
    {
        'use strict';

        const FEATURE_WASM = 131072; // FastSIMD::FeatureSet::WASM, 1 << FeatureFlag::WASM
        const DIMS = [ 'X', 'Y', 'Z', 'W' ];
        const now = () => performance.now();

        function canon( s ) { return String( s ).replace( /[\s_]/g, '' ).toLowerCase(); }

        class DslError extends Error
        {
            constructor( message, pos, text )
            {
                super( pos === undefined ? message : message + ' (at ' + pos + ')' );
                this.name = 'DslError'; this.pos = pos; this.text = text;
            }
        }

        // Any function import is stubbed: the build only needs env.emscripten_notify_memory_growth today, and a later toolchain
        // adding a WASI stub should not break previews.
        function makeImports( module )
        {
            const imports = {};
            for( const imp of WebAssembly.Module.imports( module ) )
            {
                if( imp.kind !== 'function' ) throw new Error( 'unexpected import ' + imp.module + '.' + imp.name );
                ( imports[imp.module] = imports[imp.module] || {} )[imp.name] = imp.name === 'proc_exit'
                    ? code => { throw new Error( 'wasm exit ' + code ); }
                    : () => 0;
            }
            return imports;
        }

        async function instantiate( src )
        {
            const module = src instanceof WebAssembly.Module ? src : await WebAssembly.compile( src );
            return new Core( await WebAssembly.instantiate( module, makeImports( module ) ) );
        }

        class Core
        {
            constructor( instance )
            {
                // A plain copy of the exports, so one can be replaced: FastNoise_C's fnDeleteNodeRef only decrements the reference count
                // and never destroys the node (FastNoise_C.cpp, BumpNodeRefences), so every tree built through the C API would leak.
                // The shim's fnwasmDeleteNodeRef releases properly and stands in for it, for this file and for anything using core.x.
                const ex = instance.exports;
                this.x = Object.assign( {}, ex );
                if( ex.fnwasmDeleteNodeRef ) this.x.fnDeleteNodeRef = ex.fnwasmDeleteNodeRef;
                if( this.x._initialize ) this.x._initialize();
                this.mm = this.x.malloc( 8 );
                this.scratchPtr = 0; this.scratchBytes = 0;
                this.nodeCache = new Map();
                this._nodes = null;
                this._hf = null;
                this._dec = new TextDecoder(); this._enc = new TextEncoder();
            }

            // A memory grow detaches every view, so views are only taken through here, after any call that can allocate.
            f32() { const b = this.x.memory.buffer; if( !this._hf || this._hf.buffer !== b ) this._hf = new Float32Array( b ); return this._hf; }

            cstr( p )
            {
                const u8 = new Uint8Array( this.x.memory.buffer );
                let e = p; while( u8[e] ) e++;
                return this._dec.decode( u8.subarray( p, e ) );
            }

            withCString( s, fn )
            {
                const b = this._enc.encode( s ), p = this.x.malloc( b.length + 1 );
                const u8 = new Uint8Array( this.x.memory.buffer );
                u8.set( b, p ); u8[p + b.length] = 0;
                try { return fn( p ); } finally { this.x.free( p ); }
            }

            takeCString( p ) { const s = this.cstr( p ); this.x.free( p ); return s; }

            scratch( bytes )
            {
                if( bytes > this.scratchBytes )
                {
                    if( this.scratchPtr ) this.x.free( this.scratchPtr );
                    this.scratchPtr = this.x.malloc( bytes );
                    if( !this.scratchPtr ) { this.scratchBytes = 0; throw new Error( 'wasm out of memory' ); }
                    this.scratchBytes = bytes;
                }
                return this.scratchPtr;
            }

            activeFeatureSet( node ) { return this.x.fnGetActiveFeatureSet( node ); }

            // ---- metadata -------------------------------------------------------------------------------------------
            get nodes()
            {
                if( this._nodes ) return this._nodes;
                const x = this.x, s = p => this.cstr( p ), out = [];
                for( let id = 0, n = x.fnGetMetadataCount(); id < n; id++ )
                {
                    const members = [];
                    const named = ( name, d ) => ( { name, dim: d < 0 ? null : DIMS[d], label: d < 0 ? name : name + ' ' + DIMS[d] } );
                    for( let k = 0, c = x.fnGetMetadataVariableCount( id ); k < c; k++ )
                    {
                        const type = x.fnGetMetadataVariableType( id, k );
                        const m = named( s( x.fnGetMetadataVariableName( id, k ) ), x.fnGetMetadataVariableDimensionIdx( id, k ) );
                        m.kind = [ 'float', 'int', 'enum' ][type];
                        m.index = k;
                        m.description = s( x.fnGetMetadataVariableDescription( id, k ) );
                        m.speed = x.fnwasmGetVariableDragSpeed( id, k );
                        if( type === 0 )
                        {
                            m.default = x.fnGetMetadataVariableDefaultFloat( id, k );
                            m.min = x.fnGetMetadataVariableMinFloat( id, k );
                            m.max = x.fnGetMetadataVariableMaxFloat( id, k );
                        }
                        else
                        {
                            m.default = x.fnGetMetadataVariableDefaultIntEnum( id, k );
                            m.min = x.fnwasmGetVariableMinInt( id, k );
                            m.max = x.fnwasmGetVariableMaxInt( id, k );
                        }
                        if( type === 2 )
                        {
                            m.enum = [];
                            for( let e = 0, ec = x.fnGetMetadataEnumCount( id, k ); e < ec; e++ ) m.enum.push( s( x.fnGetMetadataEnumName( id, k, e ) ) );
                        }
                        members.push( m );
                    }
                    for( let k = 0, c = x.fnGetMetadataHybridCount( id ); k < c; k++ )
                    {
                        const m = named( s( x.fnGetMetadataHybridName( id, k ) ), x.fnGetMetadataHybridDimensionIdx( id, k ) );
                        m.kind = 'hybrid'; m.index = k;
                        m.description = s( x.fnGetMetadataHybridDescription( id, k ) );
                        m.default = x.fnGetMetadataHybridDefault( id, k );
                        m.speed = x.fnwasmGetHybridDragSpeed( id, k );
                        members.push( m );
                    }
                    for( let k = 0, c = x.fnGetMetadataNodeLookupCount( id ); k < c; k++ )
                    {
                        const m = named( s( x.fnGetMetadataNodeLookupName( id, k ) ), x.fnGetMetadataNodeLookupDimensionIdx( id, k ) );
                        m.kind = 'node'; m.index = k;
                        m.description = s( x.fnGetMetadataNodeLookupDescription( id, k ) );
                        members.push( m );
                    }
                    const groups = [];
                    for( let g = 0, gc = x.fnGetMetadataGroupCount( id ); g < gc; g++ ) groups.push( s( x.fnGetMetadataGroupName( id, g ) ) );

                    // First match wins, in fnlab's order: variables, hybrids, node lookups.
                    const byKey = new Map();
                    for( const m of members )
                    {
                        const c = canon( m.name ), keys = m.dim ? [ c + m.dim.toLowerCase(), m.dim.toLowerCase() + c ] : [ c ];
                        for( const key of keys ) if( !byKey.has( key ) ) byKey.set( key, m );
                    }
                    out.push( { id, name: s( x.fnGetMetadataName( id ) ), displayName: s( x.fnwasmGetNodeDisplayName( id, 0 ) ), description: s( x.fnGetMetadataDescription( id ) ), groups, members, byKey } );
                }
                this._byName = new Map( out.map( n => [ canon( n.name ), n ] ) );
                return this._nodes = out;
            }

            findNode( nameOrId )
            {
                const nodes = this.nodes;
                if( typeof nameOrId === 'number' ) return nodes[nameOrId] || null;
                if( nameOrId && nameOrId.members ) return nameOrId;
                return this._byName.get( canon( nameOrId ) ) || null;
            }

            // ---- DSL, ported from fnlab's parser. Result is a tree { meta, args: Map( member -> number | tree ) } --------
            parse( text )
            {
                const str = String( text );
                if( str.startsWith( 'enc:' ) ) return this.parse( this.decode( str.slice( 4 ).trim() ) );
                const core = this;
                let i = 0;
                const fail = msg => new DslError( msg, i, str );
                const isSpace = c => c === ' ' || c === '\t' || c === '\n' || c === '\r';
                const ws = () => { while( i < str.length && isSpace( str[i] ) ) i++; };
                const token = stop =>
                {
                    ws();
                    const b = i;
                    while( i < str.length && !stop.includes( str[i] ) ) i++;
                    let e = i;
                    while( e > b && isSpace( str[e - 1] ) ) e--;
                    return str.slice( b, e );
                };

                function parseNode()
                {
                    const name = token( '(,)' );
                    const meta = core.findNode( name );
                    if( !meta ) throw fail( name ? "unknown node '" + name + "'" : 'expected a node name' );
                    const tree = { meta, args: new Map() };
                    ws();
                    if( str[i] !== '(' ) return tree;
                    i++;
                    for( ;; )
                    {
                        ws();
                        if( i >= str.length ) throw fail( 'unterminated argument list' );
                        if( str[i] === ')' ) { i++; return tree; }
                        if( str[i] === ',' ) { i++; continue; }
                        const key = canon( token( '=,)' ) );
                        if( str[i] !== '=' ) throw fail( "expected = after '" + key + "'" );
                        i++;
                        applyArg( tree, key );
                    }
                }

                function applyArg( tree, key )
                {
                    const m = tree.meta.byKey.get( key );
                    if( !m ) throw fail( "node '" + tree.meta.name + "' has no member '" + key + "'" );
                    ws();
                    const save = i, val = token( ',)(' );
                    const numeric = val !== '' && !isNaN( Number( val ) );
                    const isNode = str[i] === '(' || ( !numeric && ( m.kind === 'node' || m.kind === 'hybrid' ) && core.findNode( val ) !== null );
                    if( isNode )
                    {
                        if( m.kind !== 'node' && m.kind !== 'hybrid' ) throw fail( "variable '" + m.label + "' cannot take a node" );
                        i = save;
                        tree.args.set( m, parseNode() );
                        return;
                    }
                    if( m.kind === 'node' ) throw fail( "source '" + m.label + "' needs a node" );
                    if( m.kind === 'enum' )
                    {
                        let ev = m.enum.findIndex( e => canon( e ) === canon( val ) );
                        if( ev < 0 && numeric ) ev = Math.trunc( Number( val ) );
                        if( ev < 0 || ev >= m.enum.length ) throw fail( "unknown enum value '" + val + "' for " + m.label + ' (' + m.enum.join( ', ' ) + ')' );
                        tree.args.set( m, ev );
                        return;
                    }
                    if( !numeric ) throw fail( "'" + val + "' is not a number, for " + m.label );
                    tree.args.set( m, m.kind === 'int' ? Math.trunc( Number( val ) ) : Number( val ) );
                }

                const tree = parseNode();
                ws();
                if( i !== str.length ) throw fail( 'trailing text' );
                return tree;
            }

            toDsl( tree )
            {
                const parts = [];
                for( const [ m, v ] of tree.args )
                {
                    const text = typeof v === 'object' ? this.toDsl( v )
                        : m.kind === 'enum' ? m.enum[v]
                        : String( +v.toPrecision( 7 ) );
                    parts.push( m.label + '=' + text );
                }
                return tree.meta.name + '(' + parts.join( ', ' ) + ')';
            }

            build( tree )
            {
                const x = this.x, meta = tree.meta;
                for( const m of meta.members ) if( m.kind === 'node' && !tree.args.has( m ) ) throw new DslError( meta.name + " needs a node for '" + m.label + "'" );
                const node = x.fnNewFromMetadata( meta.id, FEATURE_WASM );
                if( !node ) throw new DslError( 'cannot create ' + meta.name );
                try
                {
                    for( const [ m, v ] of tree.args )
                    {
                        if( typeof v === 'object' )
                        {
                            const child = this.build( v );
                            const ok = m.kind === 'node' ? x.fnSetNodeLookup( node, m.index, child ) : x.fnSetHybridNodeLookup( node, m.index, child );
                            x.fnDeleteNodeRef( child );
                            if( !ok ) throw new DslError( meta.name + " '" + m.label + "' does not accept " + v.meta.name );
                        }
                        else if( m.kind === 'float' ) x.fnSetVariableFloat( node, m.index, v );
                        else if( m.kind === 'hybrid' ) x.fnSetHybridFloat( node, m.index, v );
                        else x.fnSetVariableIntEnum( node, m.index, v );
                    }
                }
                catch( e ) { x.fnDeleteNodeRef( node ); throw e; }
                return node;
            }

            // Returns an owned node handle. DSL or 'enc:...'.
            buildString( str )
            {
                if( str.startsWith( 'enc:' ) )
                {
                    const node = this.withCString( str.slice( 4 ).trim(), p => this.x.fnNewFromEncodedNodeTree( p, FEATURE_WASM ) );
                    if( !node ) throw new DslError( 'bad encoded node tree' );
                    return node;
                }
                return this.build( this.parse( str ) );
            }

            validate( str ) { this.x.fnDeleteNodeRef( this.buildString( str ) ); }

            // Metadata::SerialiseNodeData through the shim's NodeData arena.
            encode( treeOrDsl )
            {
                const tree = typeof treeOrDsl === 'string' ? this.parse( treeOrDsl ) : treeOrDsl;
                const x = this.x;
                const rec = t =>
                {
                    const d = x.fnwasmDataNew( t.meta.id );
                    for( const [ m, v ] of t.args )
                    {
                        if( typeof v === 'object' ) ( m.kind === 'node' ? x.fnwasmDataSetNodeLookup : x.fnwasmDataSetHybridNode )( d, m.index, rec( v ) );
                        else if( m.kind === 'float' ) x.fnwasmDataSetVariableFloat( d, m.index, v );
                        else if( m.kind === 'hybrid' ) x.fnwasmDataSetHybridFloat( d, m.index, v );
                        else x.fnwasmDataSetVariableIntEnum( d, m.index, v );
                    }
                    return d;
                };
                try
                {
                    const p = x.fnwasmDataSerialise( rec( tree ) );
                    if( !p ) throw new DslError( 'cannot encode: a required source is missing' );
                    return this.takeCString( p );
                }
                finally { x.fnwasmDataClear(); }
            }

            decode( encoded )
            {
                const p = this.withCString( encoded, c => this.x.fnwasmEncodedToDsl( c ) );
                if( !p ) throw new DslError( 'bad encoded node tree' );
                return this.takeCString( p );
            }

            // Builds keep their node alive between tiles, since a drag renders many tiles of one string. Small LRU, several views share a worker.
            cachedNode( str )
            {
                const hit = this.nodeCache.get( str );
                if( hit ) { this.nodeCache.delete( str ); this.nodeCache.set( str, hit ); return hit; }
                const node = this.buildString( str );
                this.nodeCache.set( str, node );
                if( this.nodeCache.size > 8 )
                {
                    const oldest = this.nodeCache.keys().next().value;
                    this.x.fnDeleteNodeRef( this.nodeCache.get( oldest ) );
                    this.nodeCache.delete( oldest );
                }
                return node;
            }

            // ---- jobs: what a worker runs. Each returns { data, min, max, ms, samples } ---------------------------------
            runJob( j ) { return j.kind === 'vol' ? this.runVolume( j ) : this.runRect( j ); }

            // Lattice rect (gx, gy, gw, gh), one lattice cell is F pixels. World position = origin + index * F * step.
            runRect( j )
            {
                const x = this.x, node = this.cachedNode( j.dsl ), n = j.gw * j.gh, s = j.step * j.F;
                let ms;
                let out;
                if( j.mode === 'tile' ) { out = this.scratch( n * 20 ); ms = this.genTileRect( node, j, out, n ); }
                else
                {
                    out = this.scratch( n * 4 );
                    const t0 = now();
                    if( j.mode === '2d' )
                        x.fnGenUniformGrid2D( node, out, j.ox + j.gx * s, j.oy + j.gy * s, j.gw, j.gh, s, s, j.seed, this.mm );
                    else if( j.sliceAxis === 'xy' )
                        x.fnGenUniformGrid3D( node, out, j.ox + j.gx * s, j.oy + j.gy * s, j.slice, j.gw, j.gh, 1, s, s, 1, j.seed, this.mm );
                    else
                        x.fnGenUniformGrid3D( node, out, j.ox + j.gx * s, j.oy, j.slice + j.gy * s, j.gw, 1, j.gh, s, 1, s, j.seed, this.mm );
                    ms = now() - t0;
                }
                const hf = this.f32(), o = out >> 2;
                return { data: hf.slice( o, o + n ), min: hf[this.mm >> 2], max: hf[( this.mm >> 2 ) + 1], ms, samples: n };
            }

            // GenTileable2D's hypertorus mapping evaluated for one rect, so tileable output can be split across workers.
            genTileRect( node, j, out, n )
            {
                const pi2Recip = 0.15915493667;
                const xSizePi = Math.fround( j.W * pi2Recip ), ySizePi = Math.fround( j.H * pi2Recip );
                const xFreq = xSizePi * j.step, yFreq = ySizePi * j.step, xMul = 1 / xSizePi, yMul = 1 / ySizePi;
                const hf = this.f32(), o = out >> 2;
                for( let jj = 0, q = 0; jj < j.gh; jj++ )
                {
                    const yF = ( j.gy + jj ) * j.F * yMul, cy = Math.cos( yF ) * yFreq, sy = Math.sin( yF ) * yFreq;
                    for( let ii = 0; ii < j.gw; ii++, q++ )
                    {
                        const xF = ( j.gx + ii ) * j.F * xMul;
                        hf[o + n + q] = Math.cos( xF ) * xFreq;
                        hf[o + 2 * n + q] = cy;
                        hf[o + 3 * n + q] = Math.sin( xF ) * xFreq;
                        hf[o + 4 * n + q] = sy;
                    }
                }
                const t0 = now();
                this.x.fnGenPositionArray4D( node, out, n, out + 4 * n, out + 8 * n, out + 12 * n, out + 16 * n, 0, 0, 0, 0, j.seed, this.mm );
                return now() - t0;
            }

            // lab_render3d.h RenderVolume for image rows [j0, j1): fixed step lockstep march, bisection, central difference normals.
            runVolume( j )
            {
                const x = this.x, node = this.cachedNode( j.dsl );
                const { size, steps, iso, L, x0, y0, z0, j0, j1, seed } = j;
                const rows = j1 - j0, n = rows * size;

                let dx = 0.62, dy = -0.48, dz = 0.62;
                const dl = 1 / Math.sqrt( dx * dx + dy * dy + dz * dz );
                dx *= dl; dy *= dl; dz *= dl;
                const ux = 0.7071, uy = 0, uz = -0.7071;
                let vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
                if( vy > 0 ) { vx = -vx; vy = -vy; vz = -vz; }
                const cx = x0 + L / 2, cy = y0 + L / 2, cz = z0 + L / 2;
                const span = L * 1.78, rayLen = L * 2;

                const ox = new Float32Array( n ), oy = new Float32Array( n ), oz = new Float32Array( n ), tEnter = new Float32Array( n ), tExit = new Float32Array( n );
                const hitLo = new Float32Array( n ).fill( -1 ), hitHi = new Float32Array( n ).fill( -1 );
                const act = new Int32Array( n );
                let active = 0;
                const dirs = [ dx, dy, dz ], mins = [ x0, y0, z0 ];
                for( let jj = j0; jj < j1; jj++ )
                {
                    for( let i = 0; i < size; i++ )
                    {
                        const a = ( ( i + 0.5 ) / size - 0.5 ) * span, b = ( ( jj + 0.5 ) / size - 0.5 ) * span, k = ( jj - j0 ) * size + i;
                        ox[k] = cx + a * ux + b * vx - dx * rayLen; oy[k] = cy + a * uy + b * vy - dy * rayLen; oz[k] = cz + a * uz + b * vz - dz * rayLen;
                        let t0 = 0, t1 = 4 * L;
                        const o = [ ox[k], oy[k], oz[k] ];
                        for( let q = 0; q < 3; q++ )
                        {
                            let ta = ( mins[q] - o[q] ) / dirs[q], tb = ( mins[q] + L - o[q] ) / dirs[q];
                            if( ta > tb ) { const t = ta; ta = tb; tb = t; }
                            t0 = Math.max( t0, ta ); t1 = Math.min( t1, tb );
                        }
                        tEnter[k] = t0; tExit[k] = t1;
                        if( t0 < t1 ) act[active++] = k;
                    }
                }

                // Positions and results live in wasm memory: px | py | pz | out, n floats each.
                const ptr = this.scratch( n * 16 ), base = ptr >> 2;
                let hf = this.f32(), ms = 0, samples = 0, lo = Infinity, hi = -Infinity;
                const evalBatch = count =>
                {
                    const t0 = now();
                    x.fnGenPositionArray3D( node, ptr + n * 12, count, ptr, ptr + n * 4, ptr + n * 8, 0, 0, 0, seed, this.mm );
                    ms += now() - t0;
                    samples += count;
                    hf = this.f32();
                    lo = Math.min( lo, hf[this.mm >> 2] ); hi = Math.max( hi, hf[( this.mm >> 2 ) + 1] );
                };

                const dt = L * 1.74 / steps;
                for( let s = 0; s <= steps && active > 0; s++ )
                {
                    for( let q = 0; q < active; q++ )
                    {
                        const k = act[q], t = Math.min( tEnter[k] + s * dt, tExit[k] - 1e-5 );
                        hf[base + q] = ox[k] + dx * t; hf[base + n + q] = oy[k] + dy * t; hf[base + 2 * n + q] = oz[k] + dz * t;
                    }
                    evalBatch( active );
                    let w = 0;
                    for( let q = 0; q < active; q++ )
                    {
                        const k = act[q], t = tEnter[k] + s * dt;
                        if( hf[base + 3 * n + q] > iso ) { hitLo[k] = Math.max( tEnter[k], t - ( s ? dt : 0 ) ); hitHi[k] = Math.min( t, tExit[k] ); }
                        else if( t < tExit[k] ) act[w++] = k;
                    }
                    active = w;
                }

                const rgba = new Uint8ClampedArray( n * 4 );
                for( let k = 0; k < n; k++ ) { rgba[k * 4] = rgba[k * 4 + 1] = rgba[k * 4 + 2] = 30; rgba[k * 4 + 3] = 255; }

                const hits = [];
                for( let k = 0; k < n; k++ ) if( hitHi[k] >= 0 ) hits.push( k );
                const m = hits.length;
                if( m )
                {
                    for( let r = 0; r < 6; r++ )
                    {
                        for( let q = 0; q < m; q++ )
                        {
                            const k = hits[q], t = 0.5 * ( hitLo[k] + hitHi[k] );
                            hf[base + q] = ox[k] + dx * t; hf[base + n + q] = oy[k] + dy * t; hf[base + 2 * n + q] = oz[k] + dz * t;
                        }
                        evalBatch( m );
                        for( let q = 0; q < m; q++ )
                        {
                            const k = hits[q], t = 0.5 * ( hitLo[k] + hitHi[k] );
                            if( hf[base + 3 * n + q] > iso ) hitHi[k] = t; else hitLo[k] = t;
                        }
                    }

                    const e = L / size * 1.5;
                    const grad = [ new Float32Array( m ), new Float32Array( m ), new Float32Array( m ) ], plus = new Float32Array( m );
                    for( let ax = 0; ax < 3; ax++ )
                    {
                        for( let sgn = 1; sgn >= 0; sgn-- )
                        {
                            const dd = sgn ? e : -e;
                            for( let q = 0; q < m; q++ )
                            {
                                const k = hits[q], t = hitHi[k];
                                hf[base + q] = ox[k] + dx * t + ( ax === 0 ? dd : 0 );
                                hf[base + n + q] = oy[k] + dy * t + ( ax === 1 ? dd : 0 );
                                hf[base + 2 * n + q] = oz[k] + dz * t + ( ax === 2 ? dd : 0 );
                            }
                            evalBatch( m );
                            if( sgn ) for( let q = 0; q < m; q++ ) plus[q] = hf[base + 3 * n + q];
                            else for( let q = 0; q < m; q++ ) grad[ax][q] = -( plus[q] - hf[base + 3 * n + q] ); // outward = decreasing density
                        }
                    }

                    const lv = [ -0.45, 0.78, 0.43 ];
                    const u8 = v => { v = v * 255 + 0.5; return v < 0 ? 0 : v > 255 ? 255 : v | 0; };
                    const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
                    for( let q = 0; q < m; q++ )
                    {
                        const k = hits[q], len = Math.sqrt( grad[0][q] * grad[0][q] + grad[1][q] * grad[1][q] + grad[2][q] * grad[2][q] ) + 1e-12;
                        const nx = grad[0][q] / len, ny = grad[1][q] / len, nz = grad[2][q] / len;
                        const cap = hitHi[k] - tEnter[k] < L * 0.004;
                        const dif = clamp01( nx * lv[0] + ny * lv[1] + nz * lv[2] ), sky = 0.5 + 0.5 * ny;
                        const depth = clamp01( ( hitHi[k] - tEnter[k] ) / ( L * 1.1 ) );
                        let sh = ( 0.22 + 0.28 * sky + 0.62 * dif ) * ( 1 - 0.55 * depth );
                        if( cap ) sh = 0.82;
                        const cr = cap ? 214 : 196, cg = cap ? 120 : 190, cb = cap ? 84 : 178;
                        rgba[k * 4] = u8( cr / 255 * sh ); rgba[k * 4 + 1] = u8( cg / 255 * sh ); rgba[k * 4 + 2] = u8( cb / 255 * sh );
                    }
                }
                return { data: rgba, min: lo, max: hi, ms, samples };
            }
        }

        // ---- colour, matching lab_image.h -----------------------------------------------------------------------------
        const RAMP_KEYS = [ [ 0.00, 0.05, 0.12, 0.30 ], [ 0.28, 0.14, 0.36, 0.56 ], [ 0.34, 0.76, 0.71, 0.50 ], [ 0.42, 0.30, 0.52, 0.22 ], [ 0.62, 0.20, 0.38, 0.16 ], [ 0.78, 0.42, 0.36, 0.30 ], [ 0.90, 0.60, 0.58, 0.56 ], [ 1.00, 0.97, 0.97, 0.99 ] ];
        const u8 = v => { v = v * 255 + 0.5; return v < 0 ? 0 : v > 255 ? 255 : v | 0; };
        const RAMP_SIZE = 4096;
        let rampLut = null;
        function terrainRampLut()
        {
            if( rampLut ) return rampLut;
            rampLut = new Uint8Array( RAMP_SIZE * 3 );
            for( let q = 0; q < RAMP_SIZE; q++ )
            {
                const t = q / ( RAMP_SIZE - 1 );
                for( let i = 0; i < 7; i++ )
                {
                    if( t <= RAMP_KEYS[i + 1][0] )
                    {
                        const a = RAMP_KEYS[i], b = RAMP_KEYS[i + 1], f = ( t - a[0] ) / ( b[0] - a[0] );
                        for( let c = 0; c < 3; c++ ) rampLut[q * 3 + c] = u8( a[c + 1] + ( b[c + 1] - a[c + 1] ) * f );
                        break;
                    }
                }
            }
            return rampLut;
        }

        // Colours rect (sx, sy, sw, sh) of field f (fw x fh) into px32 (width pxW) at (dx0, dy0).
        // opts: shade, lo, hi, zsWidth (lab_image's f.w: the whole field's width, for the same relief at any tile), worldHeight, wrap (neighbours wrap at the field edges).
        function shadeRect( f, fw, fh, sx, sy, sw, sh, opts, px32, pxW, dx0, dy0 )
        {
            const lo = opts.lo, inv = 1 / Math.max( opts.hi - lo, 1e-20 ), shade = opts.shade;
            const MAGENTA = 0xffff00ff;
            if( shade === 'gray' || shade === 'ramp' )
            {
                const lut = shade === 'ramp' ? terrainRampLut() : null;
                for( let y = 0; y < sh; y++ )
                {
                    let src = ( sy + y ) * fw + sx, dst = ( dy0 + y ) * pxW + dx0;
                    for( let x = 0; x < sw; x++, src++, dst++ )
                    {
                        const v = f[src];
                        if( v !== v ) { px32[dst] = MAGENTA; continue; }
                        if( lut )
                        {
                            const t = ( v - lo ) * inv, q = ( t <= 0 ? 0 : t >= 1 ? RAMP_SIZE - 1 : t * ( RAMP_SIZE - 1 ) + 0.5 | 0 ) * 3;
                            px32[dst] = 0xff000000 | lut[q + 2] << 16 | lut[q + 1] << 8 | lut[q];
                        }
                        else
                        {
                            const g = u8( ( v - lo ) * inv );
                            px32[dst] = 0xff000000 | g << 16 | g << 8 | g;
                        }
                    }
                }
                return;
            }
            const lut = shade === 'terrain' ? terrainRampLut() : null;
            const zs = ( opts.worldHeight === undefined ? 0.16 : opts.worldHeight ) * opts.zsWidth * inv;
            const wrap = !!opts.wrap;
            // opts.light: azimuth in degrees, same elevation. Unset keeps lab_image.h's fixed light, which is azimuth 225.
            const az = opts.light === null || opts.light === undefined ? 225 : opts.light;
            const lx = Math.cos( az * Math.PI / 180 ) * 0.7778, ly = Math.sin( az * Math.PI / 180 ) * 0.7778, lz = 0.63;
            for( let yy = 0; yy < sh; yy++ )
            {
                const y = sy + yy;
                const ym = wrap ? ( y + fh - 1 ) % fh : ( y > 0 ? y - 1 : 0 ), yp = wrap ? ( y + 1 ) % fh : ( y < fh - 1 ? y + 1 : y );
                const yspan = wrap ? 2 : Math.max( yp - ym, 1 );
                const row = y * fw, rowM = ym * fw, rowP = yp * fw;
                let dst = ( dy0 + yy ) * pxW + dx0;
                for( let xx = 0; xx < sw; xx++, dst++ )
                {
                    const x = sx + xx;
                    const xm = wrap ? ( x + fw - 1 ) % fw : ( x > 0 ? x - 1 : 0 ), xp = wrap ? ( x + 1 ) % fw : ( x < fw - 1 ? x + 1 : x );
                    const xspan = wrap ? 2 : Math.max( xp - xm, 1 );
                    const dx = ( f[row + xp] - f[row + xm] ) * zs / xspan, dy = ( f[rowP + x] - f[rowM + x] ) * zs / yspan;
                    const nl = 1 / Math.sqrt( dx * dx + dy * dy + 1 );
                    let s = ( -dx * lx - dy * ly + lz ) * nl;
                    s = 0.25 + 0.95 * ( s < 0 ? 0 : s > 1 ? 1 : s );
                    let r = 205, g = 205, b = 205;
                    if( lut )
                    {
                        const t = ( f[row + x] - lo ) * inv, q = ( t <= 0 ? 0 : t >= 1 ? RAMP_SIZE - 1 : t * ( RAMP_SIZE - 1 ) + 0.5 | 0 ) * 3;
                        r = lut[q]; g = lut[q + 1]; b = lut[q + 2];
                    }
                    px32[dst] = 0xff000000 | u8( b / 255 * s ) << 16 | u8( g / 255 * s ) << 8 | u8( r / 255 * s );
                }
            }
        }

        return { Core, DslError, instantiate, makeImports, shadeRect, terrainRampLut, canon, FEATURE_WASM };
    }

    // =============================================================================================================
    // Worker: one wasm instance, jobs run one at a time. Also serialised with toString().
    // =============================================================================================================
    function workerMain( lib )
    {
        'use strict';
        let core = null;
        self.onmessage = async e =>
        {
            const m = e.data;
            if( m.t === 'init' )
            {
                try { core = await lib.instantiate( m.module || m.bytes ); self.postMessage( { t: 'ready' } ); }
                catch( err ) { self.postMessage( { t: 'fatal', message: String( err && err.message || err ) } ); }
                return;
            }
            try
            {
                const r = core.runJob( m.job );
                self.postMessage( { t: 'done', id: m.id, data: r.data, min: r.min, max: r.max, ms: r.ms, samples: r.samples, extra: r.extra }, [ r.data.buffer ] );
            }
            catch( err )
            {
                // A trap can leave the heap in any state, so the main thread replaces this worker.
                self.postMessage( { t: 'error', id: m.id, message: String( err && err.message || err ), trapped: err instanceof WebAssembly.RuntimeError } );
            }
        };
        // A posted Module can fail to deserialize in some embeddings; the main thread then sends the bytes.
        self.onmessageerror = () => self.postMessage( { t: 'needbytes' } );
    }

    const runningAsWorkerFile = typeof document === 'undefined' && typeof importScripts === 'function' && typeof self !== 'undefined';
    if( runningAsWorkerFile )
    {
        workerMain( coreFactory() );
        return;
    }

    // =============================================================================================================
    // Main thread: pool, views, engine
    // =============================================================================================================
    const lib = coreFactory();
    const scriptUrl = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : null;
    const clock = () => performance.now();

    function defaultWorkers()
    {
        const hc = typeof navigator !== 'undefined' && navigator.hardwareConcurrency || 2;
        return Math.max( 1, Math.min( hc - 1, 6 ) );
    }

    class Pool
    {
        constructor( engine, count, opts )
        {
            this.engine = engine;
            this.hardCancelMs = opts.hardCancelMs;
            this.sources = [];
            if( opts.workerUrl ) this.sources.push( opts.workerUrl );
            else
            {
                this.blobUrl = URL.createObjectURL( new Blob( [ '(' + workerMain.toString() + ')((' + coreFactory.toString() + ')());' ], { type: 'text/javascript' } ) );
                this.sources.push( this.blobUrl );
                if( scriptUrl ) this.sources.push( scriptUrl );
            }
            this.sourceIdx = 0;
            this.slots = [];
            this.views = [];
            this.rr = 0;
            this.nextId = 1;
            this.counters = { jobs: 0, stale: 0, respawns: 0 };
            this.inline = count === 0;
            this.inlineArmed = false;
            this.reaper = null;
            for( let i = 0; i < count; i++ ) { const slot = { worker: null, ready: false, job: null, jobId: 0 }; this.slots.push( slot ); this.spawn( slot ); }
        }

        get size() { return this.inline ? 1 : Math.max( 1, this.slots.filter( s => !s.retire ).length ); }

        spawn( slot )
        {
            slot.ready = false; slot.job = null;
            let worker;
            try { worker = new Worker( this.sources[this.sourceIdx] ); }
            catch( err ) { this.workerFailed( slot, err ); return; }
            slot.worker = worker;
            worker.onmessage = e => this.onMessage( slot, e.data );
            worker.onerror = e => { if( !slot.ready ) { e.preventDefault(); this.workerFailed( slot, e.message || e ); } else this.onJobError( slot, e.message || 'worker error', true ); };
            try { worker.postMessage( { t: 'init', module: this.engine.module } ); }
            catch( err ) { worker.postMessage( { t: 'init', bytes: this.engine.bytes } ); }
        }

        // Next worker source, or the main thread when none can start: a slow preview beats none.
        workerFailed( slot, reason )
        {
            if( slot.worker ) slot.worker.terminate();
            slot.worker = null;
            if( this.sourceIdx + 1 < this.sources.length )
            {
                this.sourceIdx++;
                this.spawn( slot );
                return;
            }
            this.slots.splice( this.slots.indexOf( slot ), 1 );
            if( !this.slots.length )
            {
                console.warn( 'fnwasm: no worker could start, rendering on the main thread:', reason );
                this.inline = true;
                this.pump();
            }
        }

        onMessage( slot, m )
        {
            if( m.t === 'ready' ) { slot.ready = true; this.pump(); return; }
            if( m.t === 'needbytes' )
            {
                if( this.engine.bytes ) slot.worker.postMessage( { t: 'init', bytes: this.engine.bytes } );
                else this.workerFailed( slot, 'worker cannot receive a compiled module' );
                return;
            }
            if( m.t === 'fatal' )
            {
                // Compiling in the worker can succeed where instantiating a posted Module does not. Only then give up on this source.
                if( !slot.triedBytes && this.engine.bytes ) { slot.triedBytes = true; slot.worker.postMessage( { t: 'init', bytes: this.engine.bytes } ); }
                else this.workerFailed( slot, m.message );
                return;
            }
            if( m.id !== slot.jobId ) return;
            if( m.t === 'error' ) { this.onJobError( slot, m.message, m.trapped ); return; }
            const job = slot.job;
            slot.job = null;
            if( slot.retire ) this.removeSlot( slot );
            if( job.gen === job.view.gen ) job.view.onResult( job, m ); else this.counters.stale++;
            this.pump();
        }

        onJobError( slot, message, trapped )
        {
            const job = slot.job;
            slot.job = null;
            if( slot.retire ) this.removeSlot( slot );
            else if( trapped ) { slot.worker.terminate(); this.counters.respawns++; this.spawn( slot ); }
            if( job && job.gen === job.view.gen ) job.view.onJobFailed( message );
            this.pump();
        }

        nextJob()
        {
            const n = this.views.length;
            for( let i = 0; i < n; i++ )
            {
                this.rr = ( this.rr + 1 ) % n;
                const job = this.views[this.rr].takeJob();
                if( job ) return job;
            }
            return null;
        }

        pump()
        {
            if( this.inline )
            {
                if( this.inlineArmed ) return;
                this.inlineArmed = true;
                setTimeout( () => this.runInline(), 0 );
                return;
            }
            for( const slot of this.slots )
            {
                if( !slot.ready || slot.job || slot.retire ) continue;
                const job = this.nextJob();
                if( !job ) return;
                slot.job = job;
                slot.jobId = this.nextId++;
                job.dispatched = clock();
                this.counters.jobs++;
                slot.worker.postMessage( { t: 'job', id: slot.jobId, job: job.msg } );
            }
        }

        runInline()
        {
            this.inlineArmed = false;
            const job = this.nextJob();
            if( !job ) return;
            this.counters.jobs++;
            try { job.view.onResult( job, this.engine.core.runJob( job.msg ) ); }
            catch( err ) { job.view.onJobFailed( String( err && err.message || err ) ); }
            this.pump();
        }

        // Stale tiles normally finish within a few ms. One that does not (a huge tree on a big tile) has its worker replaced.
        armReaper()
        {
            if( this.reaper !== null || !this.slots.length ) return;
            this.reaper = setTimeout( () =>
            {
                this.reaper = null;
                const t = clock();
                let waiting = false;
                for( const slot of this.slots )
                {
                    const job = slot.job;
                    if( !job || job.gen === job.view.gen ) continue;
                    if( t - job.dispatched >= this.hardCancelMs )
                    {
                        if( slot.retire ) { this.removeSlot( slot ); continue; }
                        slot.worker.terminate();
                        this.counters.respawns++;
                        this.spawn( slot );
                    }
                    else waiting = true;
                }
                if( waiting ) this.armReaper();
            }, this.hardCancelMs );
        }

        // More or fewer workers from now on. A worker with a tile in hand finishes that tile first, so nothing has to be queued again.
        resize( count )
        {
            if( this.inline || count < 1 ) return;
            let live = this.slots.filter( s => !s.retire );
            for( ; live.length < count; live = this.slots.filter( s => !s.retire ) )
            {
                const back = this.slots.find( s => s.retire );
                if( back ) { back.retire = false; continue; }
                const slot = { worker: null, ready: false, job: null, jobId: 0 };
                this.slots.push( slot );
                this.spawn( slot );
            }
            for( let i = live.length - 1; i >= count; i-- )
            {
                const slot = live[i];
                if( slot.job ) slot.retire = true;
                else this.removeSlot( slot );
            }
            this.pump();
        }

        removeSlot( slot )
        {
            if( slot.worker ) slot.worker.terminate();
            const i = this.slots.indexOf( slot );
            if( i >= 0 ) this.slots.splice( i, 1 );
        }

        destroy()
        {
            for( const slot of this.slots ) if( slot.worker ) slot.worker.terminate();
            this.slots = [];
            if( this.reaper !== null ) clearTimeout( this.reaper );
            if( this.blobUrl ) URL.revokeObjectURL( this.blobUrl );
        }
    }

    const COLOUR_KEYS = new Set( [ 'shade', 'worldHeight', 'range', 'hscale', 'light' ] );
    const VIEW_DEFAULTS = {
        dsl: 'Simplex()', mode: '2d', shade: 'terrain', seed: 1337, scale: 1, ox: 0.37, oy: 0.61,
        slice: 51.3, sliceAxis: 'xz', repeat: 1, worldHeight: 0.16, range: null,
        iso: 0, steps: 64, extent: 256, z0: 0.53, hscale: 90, light: null,
        tileSize: 'auto', progressive: 'auto', coarseFactor: 'auto', frameMs: 12, tileTargetMs: 8,
        interactive: false, dragMax: 640, dragMs: 24,
        onStats: null, onError: null
    };

    class View
    {
        constructor( engine, canvas, opts )
        {
            this.engine = engine;
            this.canvas = canvas;
            this.ctx = canvas.getContext( '2d', { alpha: false, willReadFrequently: true } );
            this.o = Object.assign( {}, VIEW_DEFAULTS, opts );
            this.gen = 0;
            this.queue = [];
            this.passes = [];
            this.buffers = {};
            this.complete = false;
            this.error = null;
            this.nsEstimate = 0;
            this.lastRange = null;
            this.lastStats = null;
            this.resolve = null;
            this.scheduled = null;
            this.flushArmed = false;
            this.counters = { renders: 0, finished: 0, cancelled: 0, draws: 0 };
            engine.pool.views.push( this );
            this.done = this.schedule();
        }

        // Merges options and re-renders. Only a display option changed: recolours what is there without generating.
        set( opts )
        {
            const changed = Object.keys( opts ).filter( k => opts[k] !== this.o[k] );
            Object.assign( this.o, opts );
            const render = changed.filter( k => k !== 'onStats' && k !== 'onError' );
            if( !render.length && !this.scheduled ) return this.complete ? Promise.resolve( this.lastStats ) : this.done;
            if( render.every( k => COLOUR_KEYS.has( k ) ) && this.complete && this.o.mode !== 'vol' )
            {
                this.recolour();
                return Promise.resolve( this.lastStats );
            }
            return this.done = this.schedule();
        }

        redraw() { return this.done = this.schedule(); }

        // Changes the output size and renders at it. Every buffer of the old size is dropped first, so a large one is free for the collector before the new one is taken.
        resize( w, h )
        {
            this.flush( true );
            this.stopJobs();
            this.releaseBuffers();
            this.canvas.width = w; this.canvas.height = h;
            return this.redraw();
        }

        releaseBuffers() { this.buffers = {}; this.finalPass = null; this.reliefImage = null; this.reliefPx = null; }

        cancel()
        {
            this.scheduled = null;
            this.stopJobs();
            this.settle( { cancelled: true } );
        }

        destroy()
        {
            this.cancel();
            const views = this.engine.pool.views, i = views.indexOf( this );
            if( i >= 0 ) views.splice( i, 1 );
        }

        // Calls in the same tick render once.
        schedule()
        {
            if( this.scheduled ) return this.scheduled;
            // Draw what has arrived before dropping it. Slider events come once a frame, just before animation frame callbacks,
            // so a drag would otherwise throw away every result before its flush and show nothing until the mouse stops.
            this.flush( true );
            this.stopJobs();
            return this.scheduled = new Promise( resolve =>
            {
                this.settle( { cancelled: true } );
                this.resolve = resolve;
                queueMicrotask( () => { if( this.scheduled ) { this.scheduled = null; this.start(); } } );
            } );
        }

        settle( result ) { if( this.resolve ) { const r = this.resolve; this.resolve = null; r( result ); } }

        stopJobs()
        {
            if( this.passes.length && !this.complete ) this.counters.cancelled++;
            this.gen++;
            this.queue.length = 0;
            this.passes = [];
            this.complete = false;
            const pool = this.engine.pool;
            if( pool.slots.some( s => s.job && s.job.view === this ) ) pool.armReaper();
        }

        start()
        {
            const o = this.o;
            try { this.engine.core.validate( o.dsl ); this.error = null; }
            catch( err )
            {
                this.error = err;
                if( o.onError ) o.onError( err );
                this.settle( { error: err.message } );
                return;
            }
            this.counters.renders++;
            this.t0 = clock();
            const W = this.canvas.width, H = this.canvas.height, workers = this.engine.pool.size, drag = !!o.interactive;
            const passes = [];
            try
            {
                if( o.mode === 'vol' )
                {
                    const size = Math.min( W, H );
                    // A ray costs about steps / 2 evaluations. Cost falls with F^3: fewer rays both ways, fewer steps.
                    let F = this.coarseFactor( this.nsEstimate * size * size * o.steps * 0.5 / workers / 1e6, 3, Math.min( 4, size >> 5 ) );
                    if( drag ) F = Math.max( F, Math.ceil( size / 256 ) );
                    if( F > 1 ) passes.push( this.newPass( F, Math.ceil( size / F ), Math.ceil( size / F ) ) );
                    if( !drag || F === 1 ) passes.push( this.newPass( 1, size, size ) );
                }
                else
                {
                    const rep = o.mode === 'tile' ? Math.max( 1, o.repeat | 0 ) : 1;
                    const fw = Math.floor( W / rep );
                    // A relief field is as deep as it is wide, as the harness renders it, whatever the canvas shows of it.
                    const fh = o.mode === 'relief' ? Math.max( fw, H ) : Math.floor( H / rep );
                    this.fullW = fw; this.fullH = fh;
                    let F = this.coarseFactor( this.nsEstimate * fw * fh / workers / 1e6, 2, Math.min( 16, Math.min( fw, fh ) >> 4 ) );
                    if( drag ) F = Math.max( F, Math.ceil( Math.max( fw, fh ) / o.dragMax ), Math.ceil( Math.sqrt( this.nsEstimate * fw * fh / workers / 1e6 / o.dragMs ) ) );
                    if( F > 1 ) passes.push( this.newPass( F, Math.ceil( fw / F ), Math.ceil( fh / F ) ) );
                    if( !drag || F === 1 ) passes.push( this.newPass( 1, fw, fh ) );
                }
            }
            catch( err ) { this.allocFailed( err ); return; }
            this.passes = passes;
            this.passIdx = 0;
            this.queuePass( passes[0] );
            this.engine.pool.pump();
        }

        allocFailed( err )
        {
            this.releaseBuffers();
            const e = new Error( 'not enough memory for ' + this.canvas.width + ' x ' + this.canvas.height + ': ' + ( err && err.message || err ) );
            e.outOfMemory = true;
            this.error = e;
            this.stopJobs();
            if( this.o.onError ) this.o.onError( e );
            this.settle( { error: e.message } );
        }

        // A full pass that outlasts a frame gets a coarse pass first, sized to fit in a frame: it is what a drag sees, since every event restarts the render.
        // Returns 1 for no coarse pass. costPower: how fast the cost falls with the factor.
        coarseFactor( fullMs, costPower, maxF )
        {
            const o = this.o, known = this.nsEstimate > 0;
            if( o.progressive === false || ( o.progressive !== true && known && fullMs <= o.frameMs ) ) return 1;
            const F = typeof o.coarseFactor === 'number' ? o.coarseFactor
                : known ? Math.ceil( Math.pow( fullMs / o.frameMs, 1 / costPower ) )
                : costPower === 2 ? 4 : 2;
            return Math.min( Math.max( F, 2 ), Math.max( maxF, 1 ) );
        }

        newPass( F, w, h )
        {
            // Buffers are kept per factor: a drag renders the same sizes over and over, and the canvas holds its own copy of what is on screen.
            // A relief draws into its own image, so it needs no per pass image: at 4096 px that is 64 MB less.
            const wantImg = this.o.mode !== 'relief';
            let buf = this.buffers[F];
            if( !buf || buf.w !== w || buf.h !== h || ( wantImg && !buf.img ) )
            {
                if( buf ) this.buffers[F] = null;   // free before the new one, when the old was large
                const img = wantImg ? new ImageData( w, h ) : null;
                buf = this.buffers[F] = { w, h, field: new Float32Array( w * h ), img, px32: img ? new Uint32Array( img.data.buffer ) : null, off: null, offCtx: null };
            }
            return { F, w, h, field: buf.field, img: buf.img, px32: buf.px32, buf, remaining: 0, total: 0, lo: Infinity, hi: -Infinity, ms: 0, samples: 0, dirty: [], drawLo: 0, drawHi: 0, drawn: false };
        }

        tileEdge( pass )
        {
            const o = this.o, maxDim = Math.max( pass.w, pass.h ), n = this.engine.pool.size;
            if( typeof o.tileSize === 'number' ) return o.tileSize;
            let edge = this.nsEstimate ? Math.sqrt( o.tileTargetMs * 1e6 / this.nsEstimate ) : 64;
            edge = Math.min( edge, 256, Math.ceil( maxDim / Math.ceil( Math.sqrt( 2 * n ) ) ) );
            return Math.max( 16, Math.round( edge / 8 ) * 8 );
        }

        queuePass( pass )
        {
            const o = this.o, gen = this.gen, jobs = [];
            if( o.mode === 'vol' )
            {
                // More bands at large sizes: progress moves, and a cancelled band finishes sooner.
                const bands = Math.min( pass.h, Math.max( 4, this.engine.pool.size * 2, Math.ceil( pass.h / 48 ) ) );
                const common = { kind: 'vol', dsl: o.dsl, seed: o.seed, x0: o.ox, y0: o.oy, z0: o.z0, L: o.extent * o.scale, iso: o.iso, size: pass.w, steps: Math.ceil( o.steps / pass.F ) };
                for( let b = 0; b < bands; b++ )
                {
                    const j0 = Math.floor( b * pass.h / bands ), j1 = Math.floor( ( b + 1 ) * pass.h / bands );
                    if( j1 > j0 ) jobs.push( { view: this, gen, pass, tx: 0, ty: j0, tw: pass.w, th: j1 - j0, gx: 0, gy: j0, gw: pass.w, gh: j1 - j0, msg: Object.assign( { j0, j1 }, common ) } );
                }
                jobs.reverse(); // takeJob pops from the end, so top rows first
            }
            else
            {
                const wrap = o.mode === 'tile', border = o.shade === 'hillshade' || o.shade === 'terrain' ? 1 : 0;
                const edge = this.tileEdge( pass );
                for( let ty = 0; ty < pass.h; ty += edge )
                {
                    for( let tx = 0; tx < pass.w; tx += edge )
                    {
                        const tw = Math.min( edge, pass.w - tx ), th = Math.min( edge, pass.h - ty );
                        const gx = wrap ? tx - border : Math.max( tx - border, 0 ), gy = wrap ? ty - border : Math.max( ty - border, 0 );
                        const gw = ( wrap ? tx + tw + border : Math.min( tx + tw + border, pass.w ) ) - gx;
                        const gh = ( wrap ? ty + th + border : Math.min( ty + th + border, pass.h ) ) - gy;
                        jobs.push( { view: this, gen, pass, tx, ty, tw, th, gx, gy, gw, gh, msg: {
                            kind: 'rect', mode: o.mode === 'relief' ? '2d' : o.mode, dsl: o.dsl, seed: o.seed, ox: o.ox, oy: o.oy, step: o.scale, F: pass.F, gx, gy, gw, gh,
                            W: this.fullW, H: this.fullH, slice: o.slice, sliceAxis: o.sliceAxis } } );
                    }
                }
                // Nearest the centre first; takeJob pops from the end.
                const cx = pass.w / 2, cy = pass.h / 2, dist = j => Math.hypot( j.tx + j.tw / 2 - cx, j.ty + j.th / 2 - cy );
                jobs.sort( ( a, b ) => dist( b ) - dist( a ) );
            }
            pass.remaining = pass.total = jobs.length;
            this.queue = jobs;
        }

        takeJob() { return this.queue.length ? this.queue.pop() : null; }

        onJobFailed( message )
        {
            const err = new Error( message );
            this.error = err;
            this.stopJobs();
            if( this.o.onError ) this.o.onError( err );
            this.settle( { error: message } );
        }

        onResult( job, r )
        {
            const pass = job.pass;
            pass.ms += r.ms; pass.samples += r.samples;
            if( r.min < pass.lo ) pass.lo = r.min;
            if( r.max > pass.hi ) pass.hi = r.max;
            this.nsEstimate = pass.ms * 1e6 / pass.samples;
            pass.remaining--;
            job.data = r.data;
            if( this.o.mode !== 'vol' )
            {
                // Interior only: the border belongs to the neighbouring tile.
                const f = pass.field, data = r.data;
                for( let y = 0; y < job.th; y++ )
                {
                    const from = ( job.ty - job.gy + y ) * job.gw + ( job.tx - job.gx );
                    f.set( data.subarray( from, from + job.tw ), ( job.ty + y ) * pass.w + job.tx );
                }
            }
            pass.dirty.push( job );
            pass.computeMs = clock() - this.t0;
            // The last tile of a pass draws at once. Partial passes wait for a frame, so a burst of tiles is coloured together.
            if( pass.remaining === 0 ) this.flush();
            else this.armFlush();
        }

        // Drawing is batched to the frame rate. A hidden page has no animation frames, hence the timer.
        armFlush()
        {
            if( this.flushArmed ) return;
            this.flushArmed = true;
            let timer = 0;
            const run = () => { if( !this.flushArmed ) return; clearTimeout( timer ); this.flushArmed = false; this.flush(); };
            timer = setTimeout( run, 40 );
            if( typeof requestAnimationFrame === 'function' ) requestAnimationFrame( run );
        }

        shadeOpts( pass, lo, hi )
        {
            const o = this.o;
            return { shade: o.shade, lo, hi, zsWidth: pass.w, worldHeight: o.worldHeight, wrap: o.mode === 'tile', light: o.light };
        }

        flush( stopping )
        {
            try { this.flushPasses( stopping ); }
            catch( err ) { if( err instanceof RangeError ) this.allocFailed( err ); else throw err; }
        }

        flushPasses( stopping )
        {
            const o = this.o;
            let finished = null, advance = false;
            for( const pass of this.passes )
            {
                if( !pass.dirty.length ) continue;
                const fixed = o.range;
                this.counters.draws++;
                if( o.mode === 'vol' )
                {
                    for( const job of pass.dirty )
                    {
                        pass.img.data.set( job.data, job.ty * pass.w * 4 );
                        this.put( pass, job.tx, job.ty, job.tw, job.th );
                    }
                }
                else if( o.mode === 'relief' )
                {
                    if( pass.remaining === 0 ) this.drawRelief( pass );
                }
                else if( pass.remaining === 0 )
                {
                    // Pass complete: one colouring of the whole field with its true range replaces any per-tile work.
                    const lo = fixed ? fixed[0] : pass.lo, hi = fixed ? fixed[1] : pass.hi;
                    lib.shadeRect( pass.field, pass.w, pass.h, 0, 0, pass.w, pass.h, this.shadeOpts( pass, lo, hi ), pass.px32, pass.w, 0, 0 );
                    this.put( pass, 0, 0, pass.w, pass.h );
                }
                else
                {
                    if( !pass.drawn )
                    {
                        // Display range while tiles arrive: fixed, else the last render's, else whatever this pass has seen.
                        const r = fixed || this.lastRange || [ pass.lo, pass.hi ];
                        pass.drawLo = r[0]; pass.drawHi = r[1];
                        pass.drawn = true;
                    }
                    const so = this.shadeOpts( pass, pass.drawLo, pass.drawHi );
                    so.wrap = false; // the tile's own border holds the neighbours
                    for( const job of pass.dirty )
                    {
                        lib.shadeRect( job.data, job.gw, job.gh, job.tx - job.gx, job.ty - job.gy, job.tw, job.th, so, pass.px32, pass.w, job.tx, job.ty );
                        this.put( pass, job.tx, job.ty, job.tw, job.th );
                    }
                }
                pass.dirty.length = 0;
                if( pass.remaining === 0 )
                {
                    if( !o.range && o.mode !== 'vol' ) this.lastRange = [ pass.lo, pass.hi ];
                    if( pass === this.passes[this.passes.length - 1] ) finished = pass;
                    else advance = true;
                }
                this.report( pass, pass === this.passes[this.passes.length - 1] && pass.remaining === 0 );
            }
            if( finished ) { this.complete = true; this.finalPass = finished; this.counters.finished++; this.settle( this.lastStats ); }
            else if( advance && !stopping )
            {
                this.passIdx++;
                this.queuePass( this.passes[this.passIdx] );
                this.engine.pool.pump();
            }
        }

        // Pixels of the pass image to the canvas. The full pass in non-repeat mode goes straight in; the rest needs scaling.
        put( pass, x, y, w, h )
        {
            const F = pass.F, rep = this.o.mode === 'tile' ? Math.max( 1, this.o.repeat | 0 ) : 1;
            if( F === 1 && rep === 1 ) { this.ctx.putImageData( pass.img, 0, 0, x, y, w, h ); return; }
            const buf = pass.buf;
            if( !buf.off )
            {
                buf.off = document.createElement( 'canvas' );
                buf.off.width = pass.w; buf.off.height = pass.h;
                buf.offCtx = buf.off.getContext( '2d', { willReadFrequently: true } );
            }
            buf.offCtx.putImageData( pass.img, 0, 0, x, y, w, h );
            this.ctx.imageSmoothingEnabled = false;
            for( let ry = 0; ry < rep; ry++ )
                for( let rx = 0; rx < rep; rx++ )
                    this.ctx.drawImage( buf.off, x, y, w, h, ( x + rx * pass.w ) * F, ( y + ry * pass.h ) * F, w * F, h * F );
        }

        // Work in a pass, in samples: a volume ray costs about steps / 2 evaluations.
        passCost( pass ) { return pass.w * pass.h * ( this.o.mode === 'vol' ? Math.ceil( this.o.steps / pass.F ) * 0.5 : 1 ); }

        report( pass, final )
        {
            // Across every pass still planned. A pass in progress counts by its share of tiles.
            let total = 0, done = 0;
            for( const p of this.passes )
            {
                const c = this.passCost( p );
                total += c;
                if( p.total ) done += c * ( p.total - p.remaining ) / p.total;
            }
            const ns = pass.samples ? pass.ms * 1e6 / pass.samples : 0, workers = this.engine.pool.size;
            const stats = {
                min: pass.lo, max: pass.hi, samples: pass.samples, cpuMs: pass.ms,
                nsPerSample: ns,
                wallMs: clock() - this.t0, computeMs: pass.computeMs,
                tilesDone: pass.total - pass.remaining, tilesTotal: pass.total,
                factor: pass.F, final, workers,
                width: this.canvas.width, height: this.canvas.height, passW: pass.w, passH: pass.h,
                progress: total ? done / total : 1, etaMs: ( total - done ) * ns / workers / 1e6,
                interactive: !!this.o.interactive
            };
            this.lastStats = stats;
            if( this.o.onStats ) this.o.onStats( stats );
        }

        recolour()
        {
            const pass = this.finalPass, o = this.o;
            if( !pass ) return;
            if( o.mode === 'relief' ) { this.drawRelief( pass ); return; }
            const lo = o.range ? o.range[0] : pass.lo, hi = o.range ? o.range[1] : pass.hi;
            lib.shadeRect( pass.field, pass.w, pass.h, 0, 0, pass.w, pass.h, this.shadeOpts( pass, lo, hi ), pass.px32, pass.w, 0, 0 );
            this.put( pass, 0, 0, pass.w, pass.h );
        }

        // lab_render3d.h RenderRelief: painter's algorithm from the nearest row back, over a sky gradient. Low end is the field's 1st percentile, as the harness.
        // o.hscale is the vertical exaggeration in pixels of a 400 px tall canvas, so the look does not change with the size. o.light is an azimuth in degrees; unset keeps the harness's light.
        drawRelief( pass )
        {
            const W = this.canvas.width, H = this.canvas.height, f = pass.field, fw = pass.w, fh = pass.h, o = this.o;
            if( !this.reliefImage || this.reliefImage.width !== W || this.reliefImage.height !== H )
            {
                this.reliefImage = null;
                this.reliefImage = new ImageData( W, H );
                this.reliefPx = new Uint32Array( this.reliefImage.data.buffer );
            }
            const px = this.reliefPx, lut = lib.terrainRampLut(), RS = lut.length / 3;
            const u8 = v => { v = v * 255 + 0.5; return v < 0 ? 0 : v > 255 ? 255 : v | 0; };
            for( let y = 0; y < H; y++ )
            {
                const s = 1 - y / H, c = 0xff000000 | u8( 0.68 + 0.27 * s ) << 16 | u8( 0.55 + 0.33 * s ) << 8 | u8( 0.45 + 0.35 * s );
                px.fill( c, y * W, ( y + 1 ) * W );
            }
            let lo, hi;
            if( o.range ) { lo = o.range[0]; hi = o.range[1]; }
            else
            {
                const sample = [], stride = Math.max( 1, Math.floor( f.length / 20000 ) );
                for( let i = 0; i < f.length; i += stride ) if( f[i] === f[i] ) sample.push( f[i] );
                sample.sort( ( a, b ) => a - b );
                lo = sample.length ? sample[Math.floor( sample.length * 0.01 )] : 0;
                hi = pass.hi;
            }
            const az = o.light === null || o.light === undefined ? null : o.light * Math.PI / 180;
            const lx = az === null ? -0.6 : Math.cos( az ) * 0.781, ly = az === null ? -0.5 : Math.sin( az ) * 0.781, lz = 0.62;
            const inv = 1 / Math.max( hi - lo, 1e-20 ), heightPx = o.hscale * H / 400;
            const zs = heightPx * inv / ( W / fw ) * 0.9, top = new Int32Array( W ).fill( H );
            const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
            for( let r = fh - 2; r >= 1; r-- )
            {
                const depth = r / fh, persp = 0.62 + 0.38 * depth, rowY = H * ( 0.28 + 0.72 * depth * ( 0.55 + 0.45 * depth ) ), fog = 0.55 + 0.45 * depth, row = r * fw;
                for( let x = 0; x < W; x++ )
                {
                    const u = ( x / W - 0.5 ) / persp + 0.5;
                    if( u < 0.002 || u > 0.998 ) continue;
                    let fx = u * fw | 0; fx = fx < 1 ? 1 : fx > fw - 2 ? fw - 2 : fx;
                    const v = f[row + fx];
                    if( v !== v ) continue;
                    let sy = rowY - ( v - lo ) * inv * heightPx * persp | 0;
                    if( sy >= top[x] ) continue;
                    if( sy < 0 ) sy = 0;
                    const dx = ( f[row + fx + 1] - f[row + fx - 1] ) * 0.5 * zs, dy = ( f[row + fw + fx] - f[row - fw + fx] ) * 0.5 * zs;
                    const nl = 1 / Math.sqrt( dx * dx + dy * dy + 1 );
                    const shade = 0.28 + 0.95 * clamp01( ( -dx * lx - dy * ly + lz ) * nl );
                    const t = ( v - lo ) * inv, q = ( t <= 0 ? 0 : t >= 1 ? RS - 1 : t * ( RS - 1 ) + 0.5 | 0 ) * 3;
                    const out = 0xff000000 | u8( lut[q + 2] / 255 * shade * fog + 0.82 * ( 1 - fog ) ) << 16 | u8( lut[q + 1] / 255 * shade * fog + 0.70 * ( 1 - fog ) ) << 8 | u8( lut[q] / 255 * shade * fog + 0.62 * ( 1 - fog ) );
                    if( r === fh - 2 ) { const skirt = 0xff000000 | 30 << 16 | 34 << 8 | 38; for( let y = sy; y < H; y++ ) px[y * W + x] = skirt; }
                    else for( let y = sy; y < top[x]; y++ ) px[y * W + x] = out;
                    top[x] = sy;
                }
            }
            this.ctx.putImageData( this.reliefImage, 0, 0 );
        }
    }

    // Slider hints. Metadata only has real ranges for a few members, so the rest come from the default and the UI drag speed.
    function sliderRange( member, current )
    {
        const def = member.default, speed = member.speed || 0.02;
        let min, max;
        if( member.max > member.min ) { min = member.min; max = member.max; }
        else
        {
            const span = Math.max( Math.abs( def ) * 1.5, speed * 100 );
            min = def > 0 ? 0 : def - span;
            max = def + span;
            if( member.min ) min = member.min;
        }
        if( current !== undefined && typeof current === 'number' )
        {
            if( current < min ) min = current;
            if( current > max ) max = current;
        }
        return { min, max, step: member.kind === 'int' ? 1 : speed };
    }

    class Engine
    {
        constructor( core, module, bytes, opts )
        {
            this.core = core;
            this.module = module;
            this.bytes = bytes;
            this.opts = opts;
            this.workerCount = opts.workers === undefined ? defaultWorkers() : opts.workers;
            this._pool = null;
        }

        // Started on first use, so a page that only reads metadata stays light.
        get pool() { return this._pool || ( this._pool = new Pool( this, this.workerCount, this.opts ) ); }
        setWorkers( n ) { this.workerCount = n; if( this._pool ) this._pool.resize( n ); }
        get nodes() { return this.core.nodes; }
        findNode( nameOrId ) { return this.core.findNode( nameOrId ); }
        parse( dsl ) { return this.core.parse( dsl ); }
        toDsl( tree ) { return this.core.toDsl( tree ); }
        encode( treeOrDsl ) { return this.core.encode( treeOrDsl ); }
        decode( encoded ) { return this.core.decode( encoded ); }
        validate( dsl ) { this.core.validate( dsl ); }
        sliderRange( member, current ) { return sliderRange( member, current ); }

        // Flat list of controls for a tree, nested nodes included. control.set( v ) edits the tree; then call toDsl( tree ) and view.set( { dsl } ).
        controls( tree, prefix = '' )
        {
            const out = [];
            for( const m of tree.meta.members )
            {
                const v = tree.args.get( m ), path = prefix + m.label;
                if( v && typeof v === 'object' )
                {
                    out.push( { path, label: m.label, kind: m.kind, member: m, owner: tree, node: v } );
                    out.push( ...this.controls( v, path + '.' ) );
                    continue;
                }
                if( m.kind === 'node' ) { out.push( { path, label: m.label, kind: 'node', member: m, owner: tree, node: null } ); continue; }
                const value = v === undefined ? m.default : v;
                const ctl = { path, label: m.label, kind: m.kind, member: m, owner: tree, value, slider: m.kind === 'enum' ? null : sliderRange( m, value ) };
                ctl.set = val =>
                {
                    if( m.kind === 'enum' && typeof val === 'string' ) val = m.enum.indexOf( val );
                    if( m.kind === 'int' || m.kind === 'enum' ) val = Math.trunc( val );
                    ctl.value = val;
                    if( val === m.default ) tree.args.delete( m ); else tree.args.set( m, val );
                };
                out.push( ctl );
            }
            return out;
        }

        // A runnable string for any node: required sources get the simplest node their setter accepts, so new nodes work with no list to update.
        defaultDsl( nameOrId, depth = 0 )
        {
            const meta = this.findNode( nameOrId );
            if( !meta || depth > 3 ) return null;
            const parts = [];
            for( const m of meta.members )
            {
                if( m.kind !== 'node' ) continue;
                let chosen = null;
                for( const cand of this.defaultCandidates() )
                {
                    if( cand === meta || !this.accepts( meta, m, cand ) ) continue;
                    chosen = this.defaultDsl( cand, depth + 1 );
                    if( chosen ) break;
                }
                if( !chosen ) return null;
                parts.push( m.label + '=' + chosen );
            }
            return meta.name + '(' + parts.join( ', ' ) + ')';
        }

        defaultCandidates()
        {
            const hasSource = n => n.members.some( m => m.kind === 'node' );
            const simplex = this.findNode( 'Simplex' );
            return [ simplex ].concat( this.nodes.filter( n => n !== simplex && !hasSource( n ) ), this.nodes.filter( hasSource ) ).filter( Boolean );
        }

        accepts( meta, member, cand )
        {
            const x = this.core.x, a = x.fnNewFromMetadata( meta.id, lib.FEATURE_WASM ), b = x.fnNewFromMetadata( cand.id, lib.FEATURE_WASM );
            const ok = x.fnSetNodeLookup( a, member.index, b );
            x.fnDeleteNodeRef( b ); x.fnDeleteNodeRef( a );
            return !!ok;
        }

        view( canvas, opts ) { return new View( this, canvas, opts ); }

        // One-shot: resolves with the final stats (or { error } / { cancelled }).
        render( canvas, opts )
        {
            const v = new View( this, canvas, opts );
            return v.done.then( r => { v.destroy(); return r; } );
        }

        destroy() { if( this._pool ) this._pool.destroy(); this._pool = null; }
    }

    async function loadBytes( src )
    {
        if( typeof src !== 'string' && !( typeof URL !== 'undefined' && src instanceof URL ) ) return src;
        const res = await fetch( src );
        if( !res.ok ) throw new Error( 'fetch ' + src + ': ' + res.status );
        return res.arrayBuffer();
    }

    // opts.wasm: URL, bytes, compiled Module, or a list tried in order until one validates on this engine (fast relaxed build first, plain SIMD128 next).
    async function create( opts )
    {
        const o = Object.assign( { wasm: 'fnwasm.wasm', hardCancelMs: 400 }, opts );
        let module = null, bytes = null;
        if( o.wasm instanceof WebAssembly.Module ) module = o.wasm;
        else
        {
            for( const src of Array.isArray( o.wasm ) ? o.wasm : [ o.wasm ] )
            {
                const b = await loadBytes( src );
                if( WebAssembly.validate( b ) ) { bytes = b; break; }
            }
            if( !bytes ) throw new Error( 'no module validates on this engine (SIMD128 missing?)' );
            module = await WebAssembly.compile( bytes );
        }
        const core = await lib.instantiate( module );
        return new Engine( core, module, bytes, o );
    }

    const api = { create, instantiate: lib.instantiate, shadeRect: lib.shadeRect, sliderRange, DslError: lib.DslError, canon: lib.canon, FEATURE_WASM: lib.FEATURE_WASM, Engine };
    // For protoengine.js, which runs its own module on this pool and these views: worker code is rebuilt around a different core.
    api.internals = { lib, Pool, View, loadBytes, coreSource: coreFactory.toString(), workerSource: workerMain.toString() };
    if( typeof module === 'object' && module.exports ) module.exports = api;
    else root.FnWasm = api;
} )( typeof globalThis !== 'undefined' ? globalThis : this );
