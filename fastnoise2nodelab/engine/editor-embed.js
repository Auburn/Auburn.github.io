/*
 * editor-embed.js - the real FastNoise2 node editor (tools/NodeEditor, Magnum + ImGui + imnodes) inside a host page's canvas,
 * with no shared memory: no pthreads, no cross origin isolation, no service worker needed. Needs WebGL2, WebAssembly SIMD and blob workers.
 *
 *   const editor = await NodeEditorEmbed.create( {
 *       canvas,                  // in the document (not a shadow root), sized by the host's CSS with no border or padding of its own.
 *                                // Each create needs a fresh canvas: destroy() loses the GL context. Hidden (display: none) it must stay setActive( false )
 *       base: 'editor/',         // relative prefix of NodeEditor.js, NodeEditor.wasm, NodeEditorGen.wasm, NodeEditorGen-plain.wasm
 *       onReady( editor ) { },   // first frame drawn, same moment the promise resolves
 *       onChange( encoded ) { }, // the selected node's encoded tree changed: a value edit, a link, a new selection, a load
 *       onError( err ) { },      // err.code 'canvas' | 'webgl2' | 'wasm' | 'abort' | 'webgl-lost', the promise rejects too when it happens during create
 *       onCopy( text ) { },      // optional, "Copy Encoded Node Tree" and text copies, the page clipboard is also tried
 *       workers: 4,              // optional, generation pool size, default is hardwareConcurrency - 1 capped at 4
 *       graphOnly: false,        // optional, the graph alone filling the canvas, no Texture Output: for a host with its own preview
 *       dpr: 0                   // optional, device pixel ratio to render at, default window.devicePixelRatio
 *   } );
 *
 *   editor.loadEncoded( str )    // replace the graph with a tree: laid out, framed, all links made, root selected. false if it does not decode
 *   editor.getEncoded()          // encoded tree of the selected node, what the Texture Output shows. With an input unlinked: the last complete one
 *   editor.getGraph()            // { nodes: [ { id, name, x, y, w, h, selected, encoded, links: [ { member, kind, to } ] } ], zoom, pan, origin, popupOpen }
 *   editor.getNodeTypes()        // every registered node with its members, the node menu's content
 *   editor.resize( w, h, dpr )   // CSS pixels. dpr optional. A host laid out by CSS needs no call, a ResizeObserver follows the canvas
 *   editor.setActive( bool )     // false stops drawing, for a hidden tab
 *   editor.setMeshIso( iso, solidAbove ) // the mesh preview's Iso Surface and Solid Above Iso boxes, solidAbove defaults to true. The viewer can still change both, a tree's load touches neither
 *   editor.stats()              // { workers, queued, running, jobs, stale, respawns, nsPerSample }
 *   editor.destroy()
 *
 * Generation: the editor asks through Module.fneBridge (below), a pool of blob workers each running NodeEditorGen.wasm does the work
 * and pixels come back over postMessage. The main thread never generates, unless no worker can start at all.
 *
 * Touch: one finger is the left button, a long press is a right click (add node menu, node options), two fingers pan, a pinch zooms.
 */
( function( root )
{
    'use strict';

    // =============================================================================================================
    // Runs next to a NodeEditorGen.wasm instance. Serialised with toString() into the blob workers, so it must not
    // touch anything from the enclosing scope.
    // =============================================================================================================
    function coreFactory()
    {
        'use strict';
        const encoder = new TextEncoder();
        let x = null;

        // STANDALONE_WASM only imports stubs: emscripten_notify_memory_growth, and whatever WASI stub a later toolchain adds
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

        async function init( src )
        {
            const module = src instanceof WebAssembly.Module ? src : await WebAssembly.compile( src );
            x = ( await WebAssembly.instantiate( module, makeImports( module ) ) ).exports;
            if( x._initialize ) x._initialize();
        }

        function withCString( s, fn )
        {
            const bytes = encoder.encode( s ), p = x.malloc( bytes.length + 1 );
            const u8 = new Uint8Array( x.memory.buffer );
            u8.set( bytes, p ); u8[p + bytes.length] = 0;
            try { return fn( p ); } finally { x.free( p ); }
        }

        // Returns { ok, ms, data }. data is a fresh ArrayBuffer backed view the caller may transfer.
        function run( j )
        {
            return withCString( j.enc, enc =>
            {
                const t0 = performance.now();

                if( j.kind === 'rect' )
                {
                    const out = x.fnegenRect( enc, j.genType, j.x, j.y, j.w, j.h, j.ox, j.oy, j.oz, j.ow, j.scale, j.seed );
                    const ms = performance.now() - t0;
                    if( !out ) return { ok: false, ms };
                    if( j.timeOnly ) return { ok: true, ms };
                    return { ok: true, ms, data: new Uint8Array( x.memory.buffer, out, j.w * j.h * 4 ).slice() };
                }

                const out = x.fnegenChunk( enc, j.meshType, j.upAxis, j.x, j.y, j.z, j.scale, j.iso, j.hmul, j.seed, j.solidAboveIso );
                if( !out ) return { ok: false, ms: performance.now() - t0 };

                // MeshNoisePreview::GenChunkResult
                const u32 = new Uint32Array( x.memory.buffer, out, 8 ), f32 = new Float32Array( x.memory.buffer, out, 8 );
                const r = { ok: true, ms: performance.now() - t0, vertexCount: u32[2], indexCount: u32[3], min: f32[4], max: f32[5], minAir: f32[6], maxSolid: f32[7] };
                const bytes = u32[1] + u32[3] * 4;
                if( bytes ) r.data = new Uint8Array( x.memory.buffer, u32[0], bytes ).slice();
                x.fnegenChunkFree();
                return r;
            } );
        }

        return { init, run };
    }

    function workerMain( core )
    {
        'use strict';
        self.onmessage = async e =>
        {
            const m = e.data;
            if( m.t === 'init' )
            {
                try { await core.init( m.module || m.bytes ); self.postMessage( { t: 'ready' } ); }
                catch( err ) { self.postMessage( { t: 'fatal', message: String( err && err.message || err ) } ); }
                return;
            }
            try
            {
                const r = core.run( m.job );
                r.t = 'done'; r.id = m.id;
                self.postMessage( r, r.data ? [ r.data.buffer ] : [] );
            }
            catch( err )
            {
                // A trap can leave the heap in any state, the main thread replaces this worker
                self.postMessage( { t: 'error', id: m.id, message: String( err && err.message || err ), trapped: err instanceof WebAssembly.RuntimeError } );
            }
        };
        // A posted Module can fail to deserialize in some embeddings, the main thread then sends the bytes
        self.onmessageerror = () => self.postMessage( { t: 'needbytes' } );
    }

    // =============================================================================================================
    // Pool. Jobs run in priority order, lower first. A job has { pri, msg, done( result ), failed( message ) }
    // =============================================================================================================
    const HARD_CANCEL_MS = 1500; // A stale job that is still running after this long has its worker replaced

    class Pool
    {
        constructor( module, bytes, count )
        {
            this.module = module;
            this.bytes = bytes;
            this.queue = [];
            this.slots = [];
            this.jobs = 0; this.stale = 0; this.respawns = 0;
            this.reaper = null;
            this.inline = null;
            this.destroyed = false;
            this.blobUrl = URL.createObjectURL( new Blob( [ '(' + workerMain.toString() + ')((' + coreFactory.toString() + ')());' ], { type: 'text/javascript' } ) );
            for( let i = 0; i < count; i++ ) { const slot = {}; this.slots.push( slot ); this.spawn( slot ); }
        }

        get size() { return Math.max( 1, this.slots.length ); }
        get running() { return this.slots.filter( s => s.job ).length; }
        idle() { return !this.queue.length && !this.inlineArmed && this.slots.every( s => !s.job ); }

        spawn( slot )
        {
            slot.ready = false; slot.job = null;
            let worker;
            try { worker = new Worker( this.blobUrl ); }
            catch( err ) { this.workerFailed( slot, err ); return; }
            slot.worker = worker;
            worker.onmessage = e => this.onMessage( slot, e.data );
            worker.onerror = e => { e.preventDefault(); if( slot.ready ) this.jobError( slot, e.message || 'worker error', true ); else this.workerFailed( slot, e.message ); };
            try { worker.postMessage( { t: 'init', module: this.module } ); }
            catch( err ) { worker.postMessage( { t: 'init', bytes: this.bytes } ); }
        }

        // A slow preview beats none: with no worker at all, jobs run on the main thread one per task
        workerFailed( slot, reason )
        {
            if( slot.worker ) slot.worker.terminate();
            this.slots.splice( this.slots.indexOf( slot ), 1 );
            if( !this.slots.length && !this.inline )
            {
                console.warn( 'editor-embed: no worker could start, generating on the main thread:', reason );
                this.inline = coreFactory();
                this.inlineReady = this.inline.init( this.module ).then( () => this.pump() );
            }
        }

        onMessage( slot, m )
        {
            if( m.t === 'ready' ) { slot.ready = true; this.pump(); return; }
            if( m.t === 'needbytes' ) { slot.worker.postMessage( { t: 'init', bytes: this.bytes } ); return; }
            if( m.t === 'fatal' )
            {
                // Compiling in the worker can succeed where instantiating a posted Module does not
                if( !slot.triedBytes ) { slot.triedBytes = true; slot.worker.postMessage( { t: 'init', bytes: this.bytes } ); }
                else this.workerFailed( slot, m.message );
                return;
            }
            if( m.id !== slot.jobId ) return;
            if( m.t === 'error' ) { this.jobError( slot, m.message, m.trapped ); return; }
            const job = slot.job;
            slot.job = null;
            this.finish( job, m );
            this.pump();
        }

        finish( job, r )
        {
            if( job.cancelled ) this.stale++;
            else if( r.ok ) job.done( r );
            else if( job.failed ) job.failed( 'tree did not decode' );
        }

        jobError( slot, message, trapped )
        {
            const job = slot.job;
            slot.job = null;
            if( trapped ) { slot.worker.terminate(); this.respawns++; this.spawn( slot ); }
            if( job && !job.cancelled )
            {
                console.warn( 'editor-embed: generation failed:', message );
                if( job.failed ) job.failed( message );
            }
            this.pump();
        }

        submit( job )
        {
            job.seq = this.jobs++;
            this.queue.push( job );
            this.pump();
            return job;
        }

        nextJob()
        {
            let best = -1;
            for( let i = 0; i < this.queue.length; i++ )
            {
                const a = this.queue[i], b = this.queue[best];
                if( best < 0 || a.pri < b.pri || ( a.pri === b.pri && a.seq < b.seq ) ) best = i;
            }
            return best < 0 ? null : this.queue.splice( best, 1 )[0];
        }

        pump()
        {
            if( this.destroyed ) return;
            if( this.inline ) { this.pumpInline(); return; }
            for( const slot of this.slots )
            {
                if( !slot.ready || slot.job ) continue;
                const job = this.nextJob();
                if( !job ) return;
                slot.job = job;
                slot.jobId = job.seq + 1;
                job.started = performance.now();
                slot.worker.postMessage( { t: 'job', id: slot.jobId, job: job.msg } );
            }
        }

        pumpInline()
        {
            if( this.inlineArmed || !this.queue.length || !this.inlineReady ) return;
            this.inlineArmed = true;
            this.inlineReady.then( () => setTimeout( () =>
            {
                this.inlineArmed = false;
                const job = this.nextJob();
                if( !job || this.destroyed ) return;
                try { this.finish( job, this.inline.run( job.msg ) ); }
                catch( err ) { if( job.failed ) job.failed( String( err && err.message || err ) ); }
                this.pump();
            }, 0 ) );
        }

        // Queued jobs are dropped, a running one has its result ignored and is killed if it runs long
        cancel( predicate )
        {
            this.queue = this.queue.filter( j => !predicate( j ) );
            for( const slot of this.slots )
            {
                if( slot.job && predicate( slot.job ) ) { slot.job.cancelled = true; this.armReaper(); }
            }
        }

        // A job with a newer request waiting: its result is still shown when it finishes, but not after waiting this long for it
        armReaper()
        {
            if( this.reaper !== null || this.destroyed ) return;
            this.reaper = setTimeout( () =>
            {
                this.reaper = null;
                const now = performance.now();
                let waiting = false;
                for( const slot of this.slots )
                {
                    const job = slot.job;
                    if( !job || !( job.cancelled || job.superseded ) ) continue;
                    if( now - job.started < HARD_CANCEL_MS ) { waiting = true; continue; }
                    slot.job = null;
                    slot.worker.terminate();
                    this.respawns++;
                    this.spawn( slot );
                    if( job.cancelled ) this.stale++;
                    else if( job.killed ) job.killed();
                }
                if( waiting ) this.armReaper();
            }, 250 );
        }

        destroy()
        {
            this.destroyed = true;
            for( const slot of this.slots ) if( slot.worker ) slot.worker.terminate();
            this.slots = []; this.queue = [];
            if( this.reaper !== null ) clearTimeout( this.reaper );
            URL.revokeObjectURL( this.blobUrl );
        }
    }

    // =============================================================================================================
    // Module.fneBridge: what the C++ side (EmbedBridge.cpp) calls, and the scheduling of previews on the pool
    // =============================================================================================================
    const PRI_COARSE = 0, PRI_NODE = 1, PRI_TEXTURE = 2, PRI_EXPORT = 3, PRI_CHUNK = 4, PRI_BENCHMARK = 5;
    const COARSE_ABOVE_MS = 50;  // A texture estimated to take longer than this gets a low resolution pass first
    const FULL_PASS_QUIET_MS = 120; // and its full pass only starts once the requests stop coming
    const BAND_TARGET_MS = 12;
    const MAX_EXPORT_BYTES = 1.5e9;

    function makeBridge( embed, pool )
    {
        const nodeSlots = new Map();
        let nsPerSample = 100;
        let texture = null, coarseRunning = false, coarseNext = null, bandTimer = null;
        let chunkGroup = {};

        const copyToHeap = ( bytes, fn ) =>
        {
            const M = embed.module, p = M._malloc( bytes.length );
            if( !p ) { console.warn( 'editor-embed: out of memory' ); return; }
            M.HEAPU8.set( bytes, p );
            try { fn( p ); } finally { M._free( p ); }
        };

        const learn = ( ms, samples ) =>
        {
            if( samples > 0 && ms > 0 ) nsPerSample += ( ms * 1e6 / samples - nsPerSample ) * 0.5;
        };

        // ---- node previews: one job per node at a time, the latest request runs next --------------------------------
        function submitNodePreview( nodeId, slot, request )
        {
            slot.queued = request;
            request.job = pool.submit( {
                pri: PRI_NODE,
                group: 'node',
                msg: request.msg,
                done( r )
                {
                    if( texture && texture.enc === request.msg.enc ) learn( r.ms, request.msg.w * request.msg.h );
                    copyToHeap( r.data, p => embed.module._fneNodePreviewDone( nodeId, request.version, p, r.ms ) );
                    nodePreviewFinished( nodeId, slot );
                },
                failed() { nodePreviewFinished( nodeId, slot ); },
                killed() { nodePreviewFinished( nodeId, slot ); }
            } );
        }

        function nodePreviewFinished( nodeId, slot )
        {
            const next = slot.next;
            slot.queued = null; slot.next = null;
            if( next ) submitNodePreview( nodeId, slot, next );
            else nodeSlots.delete( nodeId );
        }

        function rectMsg( enc, genType, x, y, w, h, ox, oy, oz, ow, scale, seed, timeOnly )
        {
            return { kind: 'rect', enc, genType, x, y, w, h, ox, oy, oz, ow, scale, seed, timeOnly: !!timeOnly };
        }

        // ---- texture output: bands on the pool, assembled here. A slow tree shows a coarse pass while values are dragged --------------
        function startBands( r, pri, finished )
        {
            const rows = r.genType === 1 ? r.h : Math.max( 8, Math.min( 128, Math.round( BAND_TARGET_MS * 1e6 / nsPerSample / r.w ) ) );
            const stride = r.w * 4;
            r.pixels = null;
            r.remaining = Math.ceil( r.h / rows );
            for( let y = 0; y < r.h; y += rows )
            {
                const h = Math.min( rows, r.h - y ), row = y;
                pool.submit( {
                    pri,
                    group: r,
                    msg: rectMsg( r.enc, r.genType, 0, row, r.w, h, r.ox, r.oy, r.oz, r.ow, r.scale, r.seed ),
                    done( res )
                    {
                        learn( res.ms, r.w * h );
                        if( r.remaining === 1 && h === r.h ) { r.remaining = 0; finished( res.data ); return; } // One band, already the image
                        if( !r.pixels ) r.pixels = new Uint8Array( stride * r.h );
                        r.pixels.set( res.data, stride * row );
                        if( --r.remaining === 0 ) finished( r.pixels );
                    },
                    failed() { if( pri === PRI_EXPORT ) embed.module._fneExportDone( r.w, r.h, 0 ); }
                } );
            }
        }

        function submitCoarse( r, factor )
        {
            coarseRunning = true;
            const w = Math.max( 1, Math.ceil( r.w / factor ) ), h = Math.max( 1, Math.ceil( r.h / factor ) );
            const afterCoarse = () =>
            {
                coarseRunning = false;
                if( coarseNext ) { const next = coarseNext; coarseNext = null; submitCoarse( next.r, next.factor ); }
            };
            pool.submit( {
                pri: PRI_COARSE,
                group: 'coarse',
                msg: rectMsg( r.enc, r.genType, 0, 0, w, h, r.ox, r.oy, r.oz, r.ow, r.scale * r.w / w, r.seed ),
                done( res )
                {
                    learn( res.ms, w * h );
                    copyToHeap( res.data, p => embed.module._fneTextureDone( r.iter - 1, w, h, p ) );
                    afterCoarse();
                },
                failed: afterCoarse,
                killed: afterCoarse
            } );
        }

        function textureFullPass( r )
        {
            startBands( r, PRI_TEXTURE, pixels =>
            {
                if( texture === r ) copyToHeap( pixels, p => embed.module._fneTextureDone( r.iter, r.w, r.h, p ) );
            } );
        }

        function dropTexture()
        {
            if( texture ) { const old = texture; pool.cancel( j => j.group === old ); }
            clearTimeout( bandTimer );
            coarseNext = null;
            texture = null;
        }

        return {
            ready() { embed.onFirstFrame(); },
            changed( encoded ) { embed.onChanged( encoded ); },
            setClipboard( text ) { embed.onClipboard( text ); },
            workerCount() { return pool.size; },
            poolIdle() { return pool.idle(); },

            nodePreview( nodeId, version, enc, genType, scale, seed, size )
            {
                const half = size / -2 * scale;
                const request = { version, msg: rectMsg( enc, genType, 0, 0, size, size, half, half, 0, 0, scale, seed ) };
                let slot = nodeSlots.get( nodeId );
                if( !slot ) { slot = {}; nodeSlots.set( nodeId, slot ); }

                if( !slot.queued ) { submitNodePreview( nodeId, slot, request ); return; }

                if( slot.queued.job.started === undefined )
                {
                    // Still queued: swap the new tree in, keeping its place
                    slot.queued.job.msg = request.msg;
                    slot.queued.version = request.version;
                    return;
                }

                slot.next = request;
                slot.queued.job.superseded = true;
                pool.armReaper();
            },

            nodeBenchmark( nodeId, version, enc, genType, scale, seed, size )
            {
                const half = size / -2 * scale;
                pool.submit( {
                    pri: PRI_BENCHMARK,
                    group: 'bench',
                    msg: rectMsg( enc, genType, 0, 0, size, size, half, half, 0, 0, scale, seed, true ),
                    done( r ) { embed.module._fneNodePreviewDone( nodeId, version, 0, r.ms ); }
                } );
            },

            cancelNodePreviews()
            {
                pool.cancel( j => j.group === 'node' || j.group === 'bench' );
                nodeSlots.clear();
            },

            texture( iter, enc, genType, w, h, scale, seed, ox, oy, oz, ow )
            {
                dropTexture();
                const r = texture = { iter, enc, genType, w, h, scale, seed, ox, oy, oz, ow };
                const estimateMs = nsPerSample * w * h / 1e6 / pool.size;

                if( estimateMs <= COARSE_ABOVE_MS ) { textureFullPass( r ); return; }

                const factor = estimateMs > 400 ? 8 : 4;
                if( coarseRunning ) coarseNext = { r, factor };
                else submitCoarse( r, factor );
                bandTimer = setTimeout( () => { if( texture === r ) textureFullPass( r ); }, FULL_PASS_QUIET_MS );
            },

            cancelTexture() { dropTexture(); },

            exportTexture( enc, genType, w, h, scale, seed, ox, oy, oz, ow )
            {
                if( w * h * 4 > MAX_EXPORT_BYTES )
                {
                    console.warn( 'editor-embed: export too large for this page:', w, h );
                    embed.module._fneExportDone( w, h, 0 );
                    return;
                }
                const r = { enc, genType, w, h, scale, seed, ox, oy, oz, ow };
                startBands( r, PRI_EXPORT, pixels => copyToHeap( pixels, p => embed.module._fneExportDone( w, h, p ) ) );
            },

            chunk( genVersion, enc, meshType, upAxis, x, y, z, scale, iso, hmul, seed, solidAboveIso )
            {
                const group = chunkGroup;
                pool.submit( {
                    pri: PRI_CHUNK,
                    group,
                    msg: { kind: 'chunk', enc, meshType, upAxis, x, y, z, scale, iso, hmul, seed, solidAboveIso },
                    done( r )
                    {
                        const M = embed.module;
                        let p = 0;
                        if( r.data )
                        {
                            p = M._malloc( r.data.length ); // Freed by the mesh preview
                            if( !p ) { M._fneChunkDone( genVersion, x, y, z, 0, 0, 0, 0, 0, Infinity, -Infinity ); return; }
                            M.HEAPU8.set( r.data, p );
                        }
                        M._fneChunkDone( genVersion, x, y, z, p, r.vertexCount, r.indexCount, r.min, r.max, r.minAir, r.maxSolid );
                    },
                    failed() { embed.module._fneChunkDone( genVersion, x, y, z, 0, 0, 0, 0, 0, Infinity, -Infinity ); }
                } );
            },

            cancelChunks()
            {
                const old = chunkGroup;
                chunkGroup = {};
                pool.cancel( j => j.group === old );
            },

            stats() { return { nsPerSample }; }
        };
    }

    // =============================================================================================================
    // The object a host page holds
    // =============================================================================================================
    function loadScriptOnce( url )
    {
        if( root.NodeEditorModule ) return Promise.resolve();
        return new Promise( ( resolve, reject ) =>
        {
            const s = document.createElement( 'script' );
            s.src = url;
            s.onload = resolve;
            s.onerror = () => reject( new Error( 'could not load ' + url ) );
            document.head.appendChild( s );
        } );
    }

    async function fetchBytes( url )
    {
        const response = await fetch( url );
        if( !response.ok ) throw new Error( url + ': HTTP ' + response.status );
        return new Uint8Array( await response.arrayBuffer() );
    }

    function codedError( code, message )
    {
        const err = new Error( message );
        err.code = code;
        return err;
    }

    let nextCanvasId = 1;

    class Embed
    {
        constructor( opts )
        {
            this.opts = opts;
            this.canvas = opts.canvas;
            this.module = null;
            this.pool = null;
            this.bridge = null;
            this.listeners = [];
            this.observer = null;
            this.destroyed = false;
            this.isReady = false;
        }

        // ---- host API ----------------------------------------------------------------------------------------------
        loadEncoded( encoded )
        {
            const M = this.module, p = M.stringToNewUTF8( String( encoded ).trim() );
            try { return !!M._fneLoadEncoded( p ); } finally { M._free( p ); }
        }

        getEncoded() { const M = this.module; return M.UTF8ToString( M._fneGetEncoded() ); }
        getGraph() { const M = this.module; return JSON.parse( M.UTF8ToString( M._fneGetGraphJson() ) ); }
        getNodeTypes() { const M = this.module; return JSON.parse( M.UTF8ToString( M._fneGetNodeTypesJson() ) ); }

        resize( w, h, dpr )
        {
            if( w !== undefined ) this.canvas.style.width = w + 'px';
            if( h !== undefined ) this.canvas.style.height = h + 'px';
            if( dpr ) this.module.fneDpr = dpr;
            this.notifySize();
        }

        setActive( active ) { this.module._fneSetActive( active ? 1 : 0 ); }

        setMeshIso( iso, solidAbove = true ) { this.module._fneSetMeshIso( +iso || 0, solidAbove ? 1 : 0 ); }

        stats()
        {
            const p = this.pool;
            return { workers: p.size, queued: p.queue.length, running: p.running, jobs: p.jobs, stale: p.stale, respawns: p.respawns, nsPerSample: this.bridge.stats().nsPerSample };
        }

        destroy()
        {
            if( this.destroyed ) return;
            this.destroyed = true;
            for( const [ target, type, fn, options ] of this.listeners ) target.removeEventListener( type, fn, options );
            this.listeners = [];
            if( this.observer ) this.observer.disconnect();
            if( this.pool ) this.pool.destroy();
            if( this.module )
            {
                this.module._fneShutdown();
                const gl = this.module.fneContext || this.canvas.getContext( 'webgl2' );
                const lose = gl && gl.getExtension( 'WEBGL_lose_context' );
                if( lose ) lose.loseContext();
            }
            this.module = null;
        }

        // ---- wiring ------------------------------------------------------------------------------------------------
        listen( target, type, fn, options )
        {
            target.addEventListener( type, fn, options );
            this.listeners.push( [ target, type, fn, options ] );
        }

        // Magnum resizes on the window's resize event only
        notifySize()
        {
            const rect = this.canvas.getBoundingClientRect();
            if( !this.module || rect.width < 1 || rect.height < 1 ) return;
            window.dispatchEvent( new Event( 'resize' ) );
            this.module._fneWake();
        }

        // The canvas backing store follows the CSS size. If the CSS size follows the backing store, each resize would feed the next.
        pinCssSize()
        {
            const c = this.canvas, cssW = c.clientWidth, cssH = c.clientHeight, attrW = c.width, attrH = c.height;
            c.width = attrW + 37; c.height = attrH + 37;
            if( c.clientWidth !== cssW ) c.style.width = cssW + 'px';
            if( c.clientHeight !== cssH ) c.style.height = cssH + 'px';
            c.width = attrW; c.height = attrH;
        }

        wireInput()
        {
            const c = this.canvas;
            const wake = () => { if( this.module ) this.module._fneWake(); };

            c.style.outline = 'none';
            c.style.touchAction = 'none'; // A finger on the graph drags in the graph

            // Keys only arrive while the canvas has focus (keyboardListeningElement), so typing elsewhere in the page is never taken.
            // Focus comes from a press in the canvas and goes when the pointer leaves, so arrow keys and page up/down scroll the page again.
            if( c.tabIndex < 0 ) c.tabIndex = 0;
            this.listen( c, 'pointerdown', e =>
            {
                c.focus( { preventScroll: true } );
                // Without capture a drag that leaves the canvas never sees its button release
                if( e.pointerType === 'mouse' ) { try { c.setPointerCapture( e.pointerId ); } catch( err ) { /* Pointer already gone */ } }
                wake();
            } );
            this.listen( c, 'pointerleave', e =>
            {
                if( !e.buttons && document.activeElement === c && !this.module._fneWantsTextInput() ) c.blur();
            } );

            this.listen( c, 'contextmenu', e => e.preventDefault() ); // Right click is the add node menu
            this.listen( c, 'webglcontextlost', () => this.fail( 'webgl-lost', 'the WebGL context was lost, the editor needs a fresh canvas' ) );
            this.listen( c, 'dragstart', e => e.preventDefault() );

            // The browser's copy of a key event must not reach the host's own shortcuts while the editor has the keyboard
            this.listen( c, 'keydown', e => e.stopPropagation() );
            this.listen( c, 'keyup', e => e.stopPropagation() );

            // Ctrl+V: the keydown must keep its default, or there is no paste event at all. Magnum would prevent it, so it never sees the key.
            this.listen( c, 'keydown', e => { if( ( e.ctrlKey || e.metaKey ) && e.key.toLowerCase() === 'v' ) e.stopImmediatePropagation(); }, true );
            this.listen( document, 'paste', e =>
            {
                if( document.activeElement !== c || !this.module._fneWantsTextInput() ) return;
                const text = e.clipboardData && e.clipboardData.getData( 'text' );
                if( !text ) return;
                e.preventDefault();
                const M = this.module, p = M.stringToNewUTF8( text );
                M._fnePasteText( p );
                M._free( p );
            } );

            this.wireTouch( wake );

            // The editor sleeps when nothing changes
            for( const type of [ 'pointermove', 'pointerup', 'pointerenter', 'pointerleave', 'wheel', 'keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove', 'focus', 'blur' ] )
            {
                this.listen( c, type, wake, { passive: true } );
            }

            if( typeof ResizeObserver !== 'undefined' )
            {
                this.observer = new ResizeObserver( () => this.notifySize() );
                this.observer.observe( c );
            }
        }

        // Magnum makes one finger the left button and nothing else, and the graph needs the right button and the wheel.
        // So the editor never sees touches here: they become the mouse input a person with a mouse would have given.
        wireTouch( wake )
        {
            const c = this.canvas;
            const mouse = ( type, x, y, button, buttons ) => c.dispatchEvent( new MouseEvent( type, { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button, buttons } ) );
            const wheel = ( x, y, deltaY ) => c.dispatchEvent( new WheelEvent( 'wheel', { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, deltaY, deltaMode: 0 } ) );
            const LONG_PRESS_MS = 500, MOVE_SLOP = 8, PINCH_STEP = 1.3;

            let press = null, pan = null, longPress = null, hoverOff = null;

            const midpoint = t => ( { x: ( t[0].clientX + t[1].clientX ) / 2, y: ( t[0].clientY + t[1].clientY ) / 2, spread: Math.hypot( t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY ) } );

            const endPress = () =>
            {
                clearTimeout( longPress ); longPress = null;
                if( press && press.down ) mouse( 'mouseup', press.x, press.y, 0, 0 );
                press = null;
            };

            // ImGui only takes a press on what it saw hovered in an earlier frame, so the press waits for a frame after the move.
            const startPress = ( x, y ) =>
            {
                const p = press = { x, y, startX: x, startY: y, down: false };
                mouse( 'mousemove', x, y, 0, 0 );
                setTimeout( () => { if( press === p ) { p.down = true; mouse( 'mousedown', p.x, p.y, 0, 1 ); } }, 34 );
                longPress = setTimeout( () =>
                {
                    if( press !== p ) return;
                    if( p.down ) mouse( 'mouseup', p.x, p.y, 0, 0 );
                    press = null; longPress = null;
                    mouse( 'mousedown', p.x, p.y, 2, 2 );
                    setTimeout( () => mouse( 'mouseup', p.x, p.y, 2, 0 ), 34 );
                }, LONG_PRESS_MS );
            };

            this.listen( c, 'touchstart', e =>
            {
                e.preventDefault(); e.stopImmediatePropagation();
                clearTimeout( hoverOff );
                wake();
                if( e.touches.length === 1 && !pan ) { startPress( e.touches[0].clientX, e.touches[0].clientY ); return; }
                if( e.touches.length >= 2 && !pan )
                {
                    endPress();
                    const m = midpoint( e.touches );
                    pan = { x: m.x, y: m.y, spread: m.spread };
                    mouse( 'mousemove', m.x, m.y, 0, 0 );
                    setTimeout( () => { if( pan ) mouse( 'mousedown', pan.x, pan.y, 2, 2 ); pan && ( pan.down = true ); }, 34 );
                }
            }, { passive: false, capture: true } );

            this.listen( c, 'touchmove', e =>
            {
                e.preventDefault(); e.stopImmediatePropagation();
                wake();
                if( pan && e.touches.length >= 2 )
                {
                    const m = midpoint( e.touches );
                    pan.x = m.x; pan.y = m.y;
                    if( pan.down ) mouse( 'mousemove', m.x, m.y, 0, 2 );
                    if( m.spread > pan.spread * PINCH_STEP || m.spread < pan.spread / PINCH_STEP )
                    {
                        wheel( m.x, m.y, m.spread > pan.spread ? -100 : 100 );
                        pan.spread = m.spread;
                    }
                }
                else if( press && e.touches.length === 1 )
                {
                    press.x = e.touches[0].clientX; press.y = e.touches[0].clientY;
                    if( Math.hypot( press.x - press.startX, press.y - press.startY ) > MOVE_SLOP ) { clearTimeout( longPress ); longPress = null; }
                    mouse( 'mousemove', press.x, press.y, 0, press.down ? 1 : 0 );
                }
            }, { passive: false, capture: true } );

            const touchEnd = e =>
            {
                e.preventDefault(); e.stopImmediatePropagation();
                wake();
                if( pan )
                {
                    if( e.touches.length < 2 ) { if( pan.down ) mouse( 'mouseup', pan.x, pan.y, 2, 0 ); pan = null; }
                    return;
                }
                if( press && !press.down && e.type === 'touchend' )
                {
                    // A tap faster than the press delay
                    const p = press;
                    press = null;
                    clearTimeout( longPress ); longPress = null;
                    mouse( 'mousedown', p.x, p.y, 0, 1 );
                    setTimeout( () => mouse( 'mouseup', p.x, p.y, 0, 0 ), 34 );
                }
                else endPress();
                // No pointer stays behind on a touch screen: nothing should keep looking hovered
                hoverOff = setTimeout( () => mouse( 'mousemove', -10000, -10000, 0, 0 ), 120 );
            };
            this.listen( c, 'touchend', touchEnd, { passive: false, capture: true } );
            this.listen( c, 'touchcancel', touchEnd, { passive: false, capture: true } );
        }

        onChanged( encoded )
        {
            // Out of the frame: a host callback may call anything here, and an exception must not unwind through C++
            if( !this.opts.onChange || encoded === this.lastChanged ) return;
            this.lastChanged = encoded;
            queueMicrotask( () => { if( !this.destroyed ) this.opts.onChange( encoded ); } );
        }

        onClipboard( text )
        {
            if( this.opts.onCopy ) queueMicrotask( () => this.opts.onCopy( text ) );
            try
            {
                if( navigator.clipboard ) navigator.clipboard.writeText( text ).catch( () => { /* Denied in this frame */ } );
            }
            catch( err ) { /* Not allowed here, onCopy still has it */ }
        }

        onFirstFrame()
        {
            if( this.isReady ) return;
            this.isReady = true;
            this.resolveReady( this );
        }

        fail( code, message )
        {
            const err = codedError( code, message );
            if( this.opts.onError ) this.opts.onError( err );
            if( this.rejectReady ) this.rejectReady( err );
        }

        async start()
        {
            const opts = this.opts, c = this.canvas;
            const base = opts.base || '';

            if( !c || !c.isConnected ) throw codedError( 'canvas', 'the canvas must be in the document' );

            // Probed on a throwaway canvas: a canvas keeps the first context it hands out, and the attributes must be Magnum's
            if( !document.createElement( 'canvas' ).getContext( 'webgl2' ) ) throw codedError( 'webgl2', 'WebGL2 is not available in this frame' );

            if( !c.id ) c.id = 'fne-canvas-' + nextCanvasId++;
            this.pinCssSize();

            let genBytes, editorBytes, genModule;
            try
            {
                [ genBytes, editorBytes ] = await Promise.all( [ fetchBytes( base + 'NodeEditorGen.wasm' ), fetchBytes( base + 'NodeEditor.wasm' ) ] );
                // Relaxed SIMD is FastNoise's fastest configuration, not every engine takes it
                if( !WebAssembly.validate( genBytes ) ) genBytes = await fetchBytes( base + 'NodeEditorGen-plain.wasm' );
                genModule = await WebAssembly.compile( genBytes );
                await loadScriptOnce( base + 'NodeEditor.js' );
            }
            catch( err ) { throw codedError( 'wasm', String( err && err.message || err ) ); }

            const hc = navigator.hardwareConcurrency || 2;
            this.pool = new Pool( genModule, genBytes, opts.workers || Math.max( 1, Math.min( hc - 1, 4 ) ) );
            this.bridge = makeBridge( this, this.pool );

            const ready = new Promise( ( resolve, reject ) => { this.resolveReady = resolve; this.rejectReady = reject; } );

            this.wireInput();

            const moduleArg = {
                canvas: c,
                keyboardListeningElement: c,
                arguments: opts.graphOnly ? [ '--detached' ] : [],
                wasmBinary: editorBytes.buffer,
                locateFile: path => base + path,
                print: opts.print || ( text => console.debug( text ) ),
                printErr: opts.printErr || ( text => console.warn( text ) ),
                onAbort: what => this.fail( 'abort', 'the editor stopped: ' + what ),
                fneBridge: this.bridge,
                fneDpr: opts.dpr || 0
            };
            // MODULARIZE resolves after main() has run, too late for a first frame's callback, so the bridge needs embed.module earlier
            moduleArg.preRun = [ m => { this.module = m; } ];
            const moduleResult = root.NodeEditorModule( moduleArg );
            moduleResult.then( m => { this.module = m; }, err => this.fail( 'wasm', String( err && err.message || err ) ) );

            await ready;
            if( opts.onReady ) opts.onReady( this );
            return this;
        }
    }

    root.NodeEditorEmbed = {
        create( opts )
        {
            const embed = new Embed( opts );
            return embed.start().catch( err =>
            {
                embed.destroy();
                if( opts.onError && err.code !== 'abort' ) opts.onError( err );
                throw err;
            } );
        }
    };
} )( typeof self !== 'undefined' ? self : this );
