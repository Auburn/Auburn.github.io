
//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_DATABUFFER_IMPLEMENTED="1";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_HTTPREQUEST_IMPLEMENTED="1";
CFG_BRL_STREAM_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CD="";
CFG_CONFIG="release";
CFG_HOST="winnt";
CFG_HTML5_WEBAUDIO_ENABLED="1";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MODPATH="";
CFG_MOJO_AUTO_SUSPEND_ENABLED="1";
CFG_MOJO_DRIVER_IMPLEMENTED="1";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_REFLECTION_FILTER="diddy.exception";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[FontL.png];type=image/png;width=546;height=64;\n[FontM.png];type=image/png;width=273;height=32;\n[FontS.png];type=image/png;width=143;height=17;\n[background.png];type=image/png;width=128;height=128;\n[blocks.png];type=image/png;width=3712;height=256;\n[cornerbuttons.png];type=image/png;width=1408;height=128;\n[editorkey.png];type=image/png;width=2688;height=128;\n[fonts/font2_P_1.png];type=image/png;width=1024;height=1024;\n[fonts/font_P_1.png];type=image/png;width=512;height=512;\n[fonts/font_large_P_1.png];type=image/png;width=1024;height=1024;\n[fonts/font_timer_P_1.png];type=image/png;width=256;height=128;\n[mapbuttons.png];type=image/png;width=1280;height=512;\n[menubuttons.png];type=image/png;width=768;height=1792;\n[misc.png];type=image/png;width=512;height=256;\n[player.png];type=image/png;width=1280;height=256;\n[solidblocks.png];type=image/png;width=1024;height=128;\n[transblocks.png];type=image/png;width=2048;height=256;\n[mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBDisplayMode( width,height ){
	this.width=width;
	this.height=height;
}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.GetDeviceWidth=function(){
	return 0;
}

BBGame.prototype.GetDeviceHeight=function(){
	return 0;
}

BBGame.prototype.SetDeviceWindow=function( width,height,flags ){
}

BBGame.prototype.GetDisplayModes=function(){
	return new Array();
}

BBGame.prototype.GetDesktopMode=function(){
	return null;
}

BBGame.prototype.SetSwapInterval=function( interval ){
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}


function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;
	if( this._suspended ) return;
	
	var game=this;
	var seq=game._timerSeq;
	
	var maxUpdates=4;
	var updateRate=this._updateRate;
	
	if( !updateRate ){

		var reqAnimFrame=(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame);
	
		if( reqAnimFrame ){
			function animate(){
				if( seq!=game._timerSeq ) return;
	
				game.UpdateGame();
				if( seq!=game._timerSeq ) return;
	
				reqAnimFrame( animate );
				game.RenderGame();
			}
			reqAnimFrame( animate );
			return;
		}
		
		maxUpdates=1;
		updateRate=60;
	}
	
	var updatePeriod=1000.0/updateRate;
	var nextUpdate=0;

	function timeElapsed(){
		if( seq!=game._timerSeq ) return;
		
		if( !nextUpdate ) nextUpdate=Date.now();
		
		for( var i=0;i<maxUpdates;++i ){
		
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			nextUpdate+=updatePeriod;
			var delay=nextUpdate-Date.now();
			
			if( delay>0 ){
				setTimeout( timeElapsed,delay );
				game.RenderGame();
				return;
			}
		}
		nextUpdate=0;
		setTimeout( timeElapsed,0 );
		game.RenderGame();
	}

	setTimeout( timeElapsed,0 );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

BBHtml5Game.prototype.GetDeviceWidth=function(){
	return this._canvas.width;
}

BBHtml5Game.prototype.GetDeviceHeight=function(){
	return this._canvas.height;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	BBGame.prototype.RenderGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var xscale=1;
	var yscale=1;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x*xscale;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y*yscale;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}
	
	canvas.onclick=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		eatEvent( e );
		return;
	}
	
	canvas.oncontextmenu=function( e ){
		return false;
	}
	
	canvas.ontouchstart=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		for( var i=0;i<256;++i ) game.KeyEvent( BBGameEvent.KeyUp,i );
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.updateSize=function(){
		xscale=canvas.width/canvas.clientWidth;
		yscale=canvas.height/canvas.clientHeight;
		game.RenderGame();
	}
	
	canvas.updateSize();
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}


function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}


// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

// ***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	game.IncLoading();

	var image=new Image();
	image.onload=function(){ game.DecLoading(); }
	image.onerror=function(){ game.DecLoading(); }
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

// ***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

// ***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
}

if( CFG_HTML5_WEBAUDIO_ENABLED=="1" && (window.AudioContext || window.webkitAudioContext) ){

//print( "Using WebAudio!" );

// ***** WebAudio *****

var wa=null;

// ***** WebAudio gxtkSample *****

var gxtkSample=function(){
	this.waBuffer=null;
	this.state=0;
}

gxtkSample.prototype.Load=function( path ){
	if( this.state ) return false;

	var req=new XMLHttpRequest();
	
	req.open( "get",BBGame.Game().PathToUrl( path ),true );
	req.responseType="arraybuffer";
	
	var abuf=this;
	
	req.onload=function(){
		wa.decodeAudioData( req.response,function( buffer ){
			//success!
			abuf.waBuffer=buffer;
			abuf.state=1;
		},function(){
			abuf.state=-1;
		} );
	}
	
	req.onerror=function(){
		abuf.state=-1;
	}
	
	req.send();
	
	this.state=2;
			
	return true;
}

gxtkSample.prototype.Discard=function(){
}

// ***** WebAudio gxtkChannel *****

var gxtkChannel=function(){
	this.buffer=null;
	this.flags=0;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.waSource=null;
	this.waPan=wa.create
	this.waGain=wa.createGain();
	this.waGain.connect( wa.destination );
	this.waPanner=wa.createPanner();
	this.waPanner.rolloffFactor=0;
	this.waPanner.panningModel="equalpower";
	this.waPanner.connect( this.waGain );
	this.startTime=0;
	this.offset=0;
	this.state=0;
}

// ***** WebAudio gxtkAudio *****

var gxtkAudio=function(){

	if( !wa ){
		window.AudioContext=window.AudioContext || window.webkitAudioContext;
		wa=new AudioContext();
	}
	
	this.okay=true;
	this.music=null;
	this.musicState=0;
	this.musicVolume=1;
	this.channels=new Array();
	for( var i=0;i<32;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.Suspend=function(){
	if( this.MusicState()==1 ) this.music.pause();
	for( var i=0;i<32;++i ){
		var chan=this.channels[i];
		if( chan.state!=1 ) continue;
		this.PauseChannel( i );
		chan.state=5;
	}
}

gxtkAudio.prototype.Resume=function(){
	if( this.MusicState()==1 ) this.music.play();
	for( var i=0;i<32;++i ){
		var chan=this.channels[i];
		if( chan.state!=5 ) continue;
		chan.state=2;
		this.ResumeChannel( i );
	}
}

gxtkAudio.prototype.LoadSample=function( path ){

	var sample=new gxtkSample();
	if( !sample.Load( BBHtml5Game.Html5Game().PathToUrl( path ) ) ) return null;
	
	return sample;
}

gxtkAudio.prototype.PlaySample=function( buffer,channel,flags ){

	if( buffer.state!=1 ) return;

	var chan=this.channels[channel];
	
	if( chan.state ){
		chan.waSource.onended=null
		chan.waSource.stop( 0 );
	}
	
	chan.buffer=buffer;
	chan.flags=flags;

	chan.waSource=wa.createBufferSource();
	chan.waSource.buffer=buffer.waBuffer;
	chan.waSource.playbackRate.value=chan.rate;
	chan.waSource.loop=(flags&1)!=0;
	chan.waSource.connect( chan.waPanner );
	
	chan.waSource.onended=function( e ){
		chan.waSource=null;
		chan.state=0;
	}

	chan.offset=0;	
	chan.startTime=wa.currentTime;
	chan.waSource.start( 0 );

	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){

	var chan=this.channels[channel];
	if( !chan.state ) return;
	
	if( chan.state==1 ){
		chan.waSource.onended=null;
		chan.waSource.stop( 0 );
		chan.waSource=null;
	}

	chan.state=0;
}

gxtkAudio.prototype.PauseChannel=function( channel ){

	var chan=this.channels[channel];
	if( chan.state!=1 ) return;
	
	chan.offset=(chan.offset+(wa.currentTime-chan.startTime)*chan.rate)%chan.buffer.waBuffer.duration;
	
	chan.waSource.onended=null;
	chan.waSource.stop( 0 );
	chan.waSource=null;
	
	chan.state=2;
}

gxtkAudio.prototype.ResumeChannel=function( channel ){

	var chan=this.channels[channel];
	if( chan.state!=2 ) return;
	
	chan.waSource=wa.createBufferSource();
	chan.waSource.buffer=chan.buffer.waBuffer;
	chan.waSource.playbackRate.value=chan.rate;
	chan.waSource.loop=(chan.flags&1)!=0;
	chan.waSource.connect( chan.waPanner );
	
	chan.waSource.onended=function( e ){
		chan.waSource=null;
		chan.state=0;
	}
	
	chan.startTime=wa.currentTime;
	chan.waSource.start( 0,chan.offset );

	chan.state=1;
}

gxtkAudio.prototype.ChannelState=function( channel ){
	return this.channels[channel].state & 3;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];

	chan.volume=volume;
	
	chan.waGain.gain.value=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];

	chan.pan=pan;
	
	var sin=Math.sin( pan*3.14159265359/2 );
	var cos=Math.cos( pan*3.14159265359/2 );
	
	chan.waPanner.setPosition( sin,0,-cos );
}

gxtkAudio.prototype.SetRate=function( channel,rate ){

	var chan=this.channels[channel];

	if( chan.state==1 ){
		//update offset for pause/resume
		var time=wa.currentTime;
		chan.offset=(chan.offset+(time-chan.startTime)*chan.rate)%chan.buffer.waBuffer.duration;
		chan.startTime=time;
	}

	chan.rate=rate;
	
	if( chan.waSource ) chan.waSource.playbackRate.value=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	if( this.musicState ) this.music.pause();
	this.music=new Audio( BBGame.Game().PathToUrl( path ) );
	this.music.loop=(flags&1)!=0;
	this.music.play();
	this.musicState=1;
}

gxtkAudio.prototype.StopMusic=function(){
	if( !this.musicState ) return;
	this.music.pause();
	this.music=null;
	this.musicState=0;
}

gxtkAudio.prototype.PauseMusic=function(){
	if( this.musicState!=1 ) return;
	this.music.pause();
	this.musicState=2;
}

gxtkAudio.prototype.ResumeMusic=function(){
	if( this.musicState!=2 ) return;
	this.music.play();
	this.musicState=1;
}

gxtkAudio.prototype.MusicState=function(){
	if( this.musicState==1 && this.music.ended && !this.music.loop ){
		this.music=null;
		this.musicState=0;
	}
	return this.musicState;
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.musicVolume=volume;
	if( this.musicState ) this.music.volume=volume;
}

}else{

//print( "Using OldAudio!" );

// ***** gxtkChannel class *****

var gxtkChannel=function(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

// ***** gxtkAudio class *****

var gxtkAudio=function(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ){
			if( chan.audio.ended && !chan.audio.loop ){
				chan.state=0;
			}else{
				chan.audio.pause();
				chan.state=3;
			}
		}
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==3 ){
			chan.audio.play();
			chan.state=1;
		}
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	if( chan.state==3 ) return 1;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

// ***** gxtkSample class *****

//function gxtkSample( audio ){
var gxtkSample=function( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
//			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
//				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}

}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBAsyncImageLoaderThread(){
	this._running=false;
}

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;

	thread._surface=null;
	thread._result=false;
	thread._running=true;

	var image=new Image();

	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread._result=true;
		thread._running=false;
	}
	
	image.onerror=function( e ){
		thread._running=false;
	}
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}

BBAsyncImageLoaderThread.prototype.IsRunning=function(){
	return this._running;
}



function BBAsyncSoundLoaderThread(){
	this._running=false;
}
  
if( CFG_HTML5_WEBAUDIO_ENABLED=="1" && (window.AudioContext || window.webkitAudioContext) ){

BBAsyncSoundLoaderThread.prototype.Start=function(){

	this._sample=null;
	if( !this._device.okay ) return;
	
	var thread=this;
	
	thread._sample=null;
	thread._result=false;
	thread._running=true;

	var req=new XMLHttpRequest();
	req.open( "get",BBGame.Game().PathToUrl( this._path ),true );
	req.responseType="arraybuffer";
	
	req.onload=function(){
		//load success!
		wa.decodeAudioData( req.response,function( buffer ){
			//decode success!
			thread._sample=new gxtkSample();
			thread._sample.waBuffer=buffer;
			thread._sample.state=1;
			thread._result=true;
			thread._running=false;
		},function(){	
			//decode fail!
			thread._running=false;
		} );
	}
	
	req.onerror=function(){
		//load fail!
		thread._running=false;
	}
	
	req.send();
}
	
}else{
 
BBAsyncSoundLoaderThread.prototype.Start=function(){

	this._sample=null;
	if( !this._device.okay ) return;
	
	var audio=new Audio();
	if( !audio ) return;
	
	var thread=this;
	
	thread._sample=null;
	thread._result=false;
	thread._running=true;

	audio.src=BBGame.Game().PathToUrl( this._path );
	audio.preload='auto';	
	
	var success=function( e ){
		thread._sample=new gxtkSample( audio );
		thread._result=true;
		thread._running=false;
		audio.removeEventListener( 'canplaythrough',success,false );
		audio.removeEventListener( 'error',error,false );
	}
	
	var error=function( e ){
		thread._running=false;
		audio.removeEventListener( 'canplaythrough',success,false );
		audio.removeEventListener( 'error',error,false );
	}
	
	audio.addEventListener( 'canplaythrough',success,false );
	audio.addEventListener( 'error',error,false );
	
	//voodoo fix for Chrome!
	var timer=setInterval( function(){ if( !thread._running ) clearInterval( timer ); },200 );
	
	audio.load();
}

}
  
BBAsyncSoundLoaderThread.prototype.IsRunning=function(){
	return this._running;
}


function BBDataBuffer(){
	this.arrayBuffer=null;
	this.length=0;
}

BBDataBuffer.tbuf=new ArrayBuffer(4);
BBDataBuffer.tbytes=new Int8Array( BBDataBuffer.tbuf );
BBDataBuffer.tshorts=new Int16Array( BBDataBuffer.tbuf );
BBDataBuffer.tints=new Int32Array( BBDataBuffer.tbuf );
BBDataBuffer.tfloats=new Float32Array( BBDataBuffer.tbuf );

BBDataBuffer.prototype._Init=function( buffer ){
	this.arrayBuffer=buffer;
	this.length=buffer.byteLength;
	this.bytes=new Int8Array( buffer );	
	this.shorts=new Int16Array( buffer,0,this.length/2 );	
	this.ints=new Int32Array( buffer,0,this.length/4 );	
	this.floats=new Float32Array( buffer,0,this.length/4 );
}

BBDataBuffer.prototype._New=function( length ){
	if( this.arrayBuffer ) return false;
	
	var buf=new ArrayBuffer( length );
	if( !buf ) return false;
	
	this._Init( buf );
	return true;
}

BBDataBuffer.prototype._Load=function( path ){
	if( this.arrayBuffer ) return false;
	
	var buf=BBGame.Game().LoadData( path );
	if( !buf ) return false;
	
	this._Init( buf );
	return true;
}

BBDataBuffer.prototype._LoadAsync=function( path,thread ){

	var buf=this;
	
	var xhr=new XMLHttpRequest();
	xhr.open( "GET",BBGame.Game().PathToUrl( path ),true );
	xhr.responseType="arraybuffer";
	
	xhr.onload=function(e){
		if( this.status==200 || this.status==0 ){
			buf._Init( xhr.response );
			thread.result=buf;
		}
		thread.running=false;
	}
	
	xhr.onerror=function(e){
		thread.running=false;
	}
	
	xhr.send();
}


BBDataBuffer.prototype.GetArrayBuffer=function(){
	return this.arrayBuffer;
}

BBDataBuffer.prototype.Length=function(){
	return this.length;
}

BBDataBuffer.prototype.Discard=function(){
	if( this.arrayBuffer ){
		this.arrayBuffer=null;
		this.length=0;
	}
}

BBDataBuffer.prototype.PokeByte=function( addr,value ){
	this.bytes[addr]=value;
}

BBDataBuffer.prototype.PokeShort=function( addr,value ){
	if( addr&1 ){
		BBDataBuffer.tshorts[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		return;
	}
	this.shorts[addr>>1]=value;
}

BBDataBuffer.prototype.PokeInt=function( addr,value ){
	if( addr&3 ){
		BBDataBuffer.tints[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		this.bytes[addr+2]=BBDataBuffer.tbytes[2];
		this.bytes[addr+3]=BBDataBuffer.tbytes[3];
		return;
	}
	this.ints[addr>>2]=value;
}

BBDataBuffer.prototype.PokeFloat=function( addr,value ){
	if( addr&3 ){
		BBDataBuffer.tfloats[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		this.bytes[addr+2]=BBDataBuffer.tbytes[2];
		this.bytes[addr+3]=BBDataBuffer.tbytes[3];
		return;
	}
	this.floats[addr>>2]=value;
}

BBDataBuffer.prototype.PeekByte=function( addr ){
	return this.bytes[addr];
}

BBDataBuffer.prototype.PeekShort=function( addr ){
	if( addr&1 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		return BBDataBuffer.tshorts[0];
	}
	return this.shorts[addr>>1];
}

BBDataBuffer.prototype.PeekInt=function( addr ){
	if( addr&3 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		BBDataBuffer.tbytes[2]=this.bytes[addr+2];
		BBDataBuffer.tbytes[3]=this.bytes[addr+3];
		return BBDataBuffer.tints[0];
	}
	return this.ints[addr>>2];
}

BBDataBuffer.prototype.PeekFloat=function( addr ){
	if( addr&3 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		BBDataBuffer.tbytes[2]=this.bytes[addr+2];
		BBDataBuffer.tbytes[3]=this.bytes[addr+3];
		return BBDataBuffer.tfloats[0];
	}
	return this.floats[addr>>2];
}


function BBStream(){
}

BBStream.prototype.Eof=function(){
	return 0;
}

BBStream.prototype.Close=function(){
}

BBStream.prototype.Length=function(){
	return 0;
}

BBStream.prototype.Position=function(){
	return 0;
}

BBStream.prototype.Seek=function( position ){
	return 0;
}

BBStream.prototype.Read=function( buffer,offset,count ){
	return 0;
}

BBStream.prototype.Write=function( buffer,offset,count ){
	return 0;
}

/*
Copyright (c) 2011 Steve Revill and Shane Woolcock
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var diddy = new Object();

var diddy_mouseWheelDelta = 0.0;

diddy.mouseZ = function() {
	var t = diddy_mouseWheelDelta;
	diddy_mouseWheelDelta = 0.0;
	return t;
}

diddy.mouseZInit = function() {
	var canvas=document.getElementById( "GameCanvas" );
	
	canvas.onmousewheel = function(e) {
		diddy_mouseWheelDelta += e.wheelDelta/120.0;
	}
}

diddy.systemMillisecs=function(){
	return new Date().getTime();
};

diddy.setGraphics=function(w, h)
{
	var canvas=document.getElementById( "GameCanvas" );
	canvas.width  = w;
	canvas.height = h;
	//return window.innerHeight;
}
diddy.setMouse=function(x, y)
{
}
diddy.showKeyboard=function()
{
}
diddy.launchBrowser=function(address, windowName)
{
	window.open(address, windowName);
}
diddy.launchEmail=function(email, subject, text)
{
	location.href="mailto:"+email+"&subject="+subject+"&body="+text+"";
}

diddy.startVibrate=function(millisecs)
{
}
diddy.stopVibrate=function()
{
}

diddy.startGps=function(){
}

diddy.getLatitiude=function(){
	return ""
}
diddy.getLongitude=function(){
	return ""
}
diddy.showAlertDialog=function(title, message)
{
}
diddy.getInputString=function()
{
	return "";
}
// Browser detect from http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

diddy.getBrowserName=function(){
	return BrowserDetect.browser;
};

diddy.getBrowserVersion=function(){
	return BrowserDetect.version;
};

diddy.getBrowserOS=function(){
	return BrowserDetect.OS;
};

diddy.seekMusic=function(timeMillis)
{
	if(bb_audio_device &&
		bb_audio_device.channels &&
		bb_audio_device.channels[32] &&
		bb_audio_device.channels[32].audio)
	{
		var audio = bb_audio_device.channels[32].audio;
		try {
			audio.currentTime = timeMillis/1000.0;
			return 1;
		} catch(e) {}
	}
	return 0;
};


function BBHttpRequest(){
	this.response = {
		text: '',
		status: -1,
		length: 0
	}
}

BBHttpRequest.prototype.Open=function( requestMethod, url ){
	if ( !this.xhr ) this.xhr=new XMLHttpRequest();

	//IE9
	if (window.XDomainRequest) {
		var location = document.createElement('a');
		location.href = url;

		if ( location.hostname !== window.location.hostname){
			if ( !('withCredentials' in this.xhr) && !(this.xhr instanceof XDomainRequest) ){
				this.xhr=new XDomainRequest();
			}
		} else if (this.xhr instanceof XDomainRequest) {
			this.xhr=new XMLHttpRequest();
		}
	}

	var request = this;

	if ( !this.xhr.onload ){
		this.xhr.onload=function(e){
			request.response.status=(e.target.status) ? e.target.status : 200;
			request.response.text=e.target.responseText;

			if ( request.response.length===0 ) {
				request.response.length=e.target.responseText.length;
			}
			
			request.running=false;
		}
	}

	if ( !this.xhr.onprogress ){
		this.xhr.onprogress=function(e){
			if (e.lengthComputable) request.response.length = e.loaded;
		}
	}

	if ( !this.xhr.onerror ){
		this.xhr.onerror=function(e){
			request.response.status=(e.target.status) ? e.target.status : 0;
			request.running=false;
		}
	}

	this.response.text='';
	this.response.status=-1;
	this.response.length=0;

	this.xhr.open( requestMethod, url );
}

BBHttpRequest.prototype.Discard=function(){
	if ( this.xhr ) this.xhr.abort();
	this.response=null;
	this.xhr=null;
}

BBHttpRequest.prototype.SetHeader=function( name, value ){
	if ( this.xhr && this.xhr.setRequestHeader ) this.xhr.setRequestHeader( name, value );
}

BBHttpRequest.prototype.Send=function(){
	this.data=this.encoding=null;
	this.Start();
}

BBHttpRequest.prototype.SendText=function( data, encoding ){
	this.data=data;
	this.encoding=encoding;
	this.Start();
}

BBHttpRequest.prototype.Start=function(){
	if ( this.xhr ){
		this.running=true;
		this.xhr.send( this.data );
	}
}

BBHttpRequest.prototype.BytesReceived=function(){
	return this.response.length;
}

BBHttpRequest.prototype.ResponseText=function(){
	return this.response.text;
}

BBHttpRequest.prototype.Status=function(){
	return this.response.status;
}

BBHttpRequest.prototype.IsRunning=function(){
	return this.running;
}

function c_BoolObject(){
	Object.call(this);
	this.m_value=false;
}
c_BoolObject.m_new=function(t_value){
	this.m_value=t_value;
	return this;
}
c_BoolObject.prototype.p_ToBool=function(){
	return this.m_value;
}
c_BoolObject.prototype.p_Equals=function(t_box){
	return this.m_value==t_box.m_value;
}
c_BoolObject.m_new2=function(){
	return this;
}
function c_IntObject(){
	Object.call(this);
	this.m_value=0;
}
c_IntObject.m_new=function(t_value){
	this.m_value=t_value;
	return this;
}
c_IntObject.m_new2=function(t_value){
	this.m_value=((t_value)|0);
	return this;
}
c_IntObject.prototype.p_ToInt=function(){
	return this.m_value;
}
c_IntObject.prototype.p_ToFloat=function(){
	return (this.m_value);
}
c_IntObject.prototype.p_ToString=function(){
	return String(this.m_value);
}
c_IntObject.prototype.p_Equals2=function(t_box){
	return this.m_value==t_box.m_value;
}
c_IntObject.prototype.p_Compare=function(t_box){
	return this.m_value-t_box.m_value;
}
c_IntObject.m_new3=function(){
	return this;
}
function c_FloatObject(){
	Object.call(this);
	this.m_value=.0;
}
c_FloatObject.m_new=function(t_value){
	this.m_value=(t_value);
	return this;
}
c_FloatObject.m_new2=function(t_value){
	this.m_value=t_value;
	return this;
}
c_FloatObject.prototype.p_ToInt=function(){
	return ((this.m_value)|0);
}
c_FloatObject.prototype.p_ToFloat=function(){
	return this.m_value;
}
c_FloatObject.prototype.p_ToString=function(){
	return String(this.m_value);
}
c_FloatObject.prototype.p_Equals3=function(t_box){
	return this.m_value==t_box.m_value;
}
c_FloatObject.prototype.p_Compare2=function(t_box){
	if(this.m_value<t_box.m_value){
		return -1;
	}
	return ((this.m_value>t_box.m_value)?1:0);
}
c_FloatObject.m_new3=function(){
	return this;
}
function c_StringObject(){
	Object.call(this);
	this.m_value="";
}
c_StringObject.m_new=function(t_value){
	this.m_value=String(t_value);
	return this;
}
c_StringObject.m_new2=function(t_value){
	this.m_value=String(t_value);
	return this;
}
c_StringObject.m_new3=function(t_value){
	this.m_value=t_value;
	return this;
}
c_StringObject.prototype.p_ToString=function(){
	return this.m_value;
}
c_StringObject.prototype.p_Equals4=function(t_box){
	return this.m_value==t_box.m_value;
}
c_StringObject.prototype.p_Compare3=function(t_box){
	return string_compare(this.m_value,t_box.m_value);
}
c_StringObject.m_new4=function(){
	return this;
}
function bb_boxes_BoxBool(t_value){
	return (c_BoolObject.m_new.call(new c_BoolObject,t_value));
}
function bb_boxes_BoxInt(t_value){
	return (c_IntObject.m_new.call(new c_IntObject,t_value));
}
function bb_boxes_BoxFloat(t_value){
	return (c_FloatObject.m_new2.call(new c_FloatObject,t_value));
}
function bb_boxes_BoxString(t_value){
	return (c_StringObject.m_new3.call(new c_StringObject,t_value));
}
function bb_boxes_UnboxBool(t_box){
	return object_downcast((t_box),c_BoolObject).m_value;
}
function bb_boxes_UnboxInt(t_box){
	return object_downcast((t_box),c_IntObject).m_value;
}
function bb_boxes_UnboxFloat(t_box){
	return object_downcast((t_box),c_FloatObject).m_value;
}
function bb_boxes_UnboxString(t_box){
	return object_downcast((t_box),c_StringObject).m_value;
}
function c_DiddyException(){
	ThrowableObject.call(this);
	this.m_message="";
	this.m_cause=null;
	this.m_type="";
	this.m_fullType="";
}
c_DiddyException.prototype=extend_class(ThrowableObject);
c_DiddyException.prototype.p_Message=function(){
	return this.m_message;
}
c_DiddyException.prototype.p_Message2=function(t_message){
	this.m_message=t_message;
}
c_DiddyException.prototype.p_Cause=function(){
	return this.m_cause;
}
c_DiddyException.prototype.p_Cause2=function(t_cause){
	if(t_cause==(this)){
		t_cause=null;
	}
	this.m_cause=t_cause;
}
c_DiddyException.prototype.p_Type=function(){
	return this.m_type;
}
c_DiddyException.prototype.p_FullType=function(){
	return this.m_fullType;
}
c_DiddyException.prototype.p_ToString2=function(t_recurse){
	var t_rv=this.m_type+": "+this.m_message;
	if(t_recurse){
		var t_depth=10;
		var t_current=this.m_cause;
		while(((t_current)!=null) && t_depth>0){
			if((object_downcast((t_current),c_DiddyException))!=null){
				t_rv=t_rv+("\nCaused by "+this.m_type+": "+object_downcast((t_current),c_DiddyException).m_message);
				t_current=object_downcast((t_current),c_DiddyException).m_cause;
				t_depth-=1;
			}else{
				t_rv=t_rv+"\nCaused by a non-Diddy exception.";
				t_current=null;
			}
		}
	}
	return t_rv;
}
c_DiddyException.m_new=function(t_message,t_cause){
	this.m_message=t_message;
	this.m_cause=t_cause;
	var t_ci=bb_reflection_GetClass2(this);
	if((t_ci)!=null){
		this.m_fullType=t_ci.p_Name();
	}else{
		this.m_fullType="diddy.exception.DiddyException";
	}
	if(this.m_fullType.indexOf(".")!=-1){
		this.m_type=this.m_fullType.slice(this.m_fullType.lastIndexOf(".")+1);
	}else{
		this.m_type=this.m_fullType;
	}
	return this;
}
function c_ClassInfo(){
	Object.call(this);
	this.m__name="";
	this.m__attrs=0;
	this.m__sclass=null;
	this.m__ifaces=[];
	this.m__rconsts=[];
	this.m__consts=[];
	this.m__rfields=[];
	this.m__fields=[];
	this.m__rglobals=[];
	this.m__globals=[];
	this.m__rmethods=[];
	this.m__methods=[];
	this.m__rfunctions=[];
	this.m__functions=[];
	this.m__ctors=[];
}
c_ClassInfo.prototype.p_Name=function(){
	return this.m__name;
}
c_ClassInfo.m_new=function(t_name,t_attrs,t_sclass,t_ifaces){
	this.m__name=t_name;
	this.m__attrs=t_attrs;
	this.m__sclass=t_sclass;
	this.m__ifaces=t_ifaces;
	return this;
}
c_ClassInfo.m_new2=function(){
	return this;
}
c_ClassInfo.prototype.p_Init=function(){
	return 0;
}
c_ClassInfo.prototype.p_InitR=function(){
	if((this.m__sclass)!=null){
		var t_consts=c_Stack.m_new2.call(new c_Stack,this.m__sclass.m__rconsts);
		var t_=this.m__consts;
		var t_2=0;
		while(t_2<t_.length){
			var t_t=t_[t_2];
			t_2=t_2+1;
			t_consts.p_Push(t_t);
		}
		this.m__rconsts=t_consts.p_ToArray();
		var t_fields=c_Stack2.m_new2.call(new c_Stack2,this.m__sclass.m__rfields);
		var t_3=this.m__fields;
		var t_4=0;
		while(t_4<t_3.length){
			var t_t2=t_3[t_4];
			t_4=t_4+1;
			t_fields.p_Push4(t_t2);
		}
		this.m__rfields=t_fields.p_ToArray();
		var t_globals=c_Stack3.m_new2.call(new c_Stack3,this.m__sclass.m__rglobals);
		var t_5=this.m__globals;
		var t_6=0;
		while(t_6<t_5.length){
			var t_t3=t_5[t_6];
			t_6=t_6+1;
			t_globals.p_Push7(t_t3);
		}
		this.m__rglobals=t_globals.p_ToArray();
		var t_methods=c_Stack4.m_new2.call(new c_Stack4,this.m__sclass.m__rmethods);
		var t_7=this.m__methods;
		var t_8=0;
		while(t_8<t_7.length){
			var t_t4=t_7[t_8];
			t_8=t_8+1;
			t_methods.p_Push10(t_t4);
		}
		this.m__rmethods=t_methods.p_ToArray();
		var t_functions=c_Stack5.m_new2.call(new c_Stack5,this.m__sclass.m__rfunctions);
		var t_9=this.m__functions;
		var t_10=0;
		while(t_10<t_9.length){
			var t_t5=t_9[t_10];
			t_10=t_10+1;
			t_functions.p_Push13(t_t5);
		}
		this.m__rfunctions=t_functions.p_ToArray();
	}else{
		this.m__rconsts=this.m__consts;
		this.m__rfields=this.m__fields;
		this.m__rglobals=this.m__globals;
		this.m__rmethods=this.m__methods;
		this.m__rfunctions=this.m__functions;
	}
	return 0;
}
function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	return this;
}
c_Map.prototype.p_Compare4=function(t_lhs,t_rhs){
}
c_Map.prototype.p_RotateLeft=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map.prototype.p_Set=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare4(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node.m_new.call(new c_Node,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare4(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map.prototype.p_Get=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap(){
	c_Map.call(this);
}
c_StringMap.prototype=extend_class(c_Map);
c_StringMap.m_new=function(){
	c_Map.m_new.call(this);
	return this;
}
c_StringMap.prototype.p_Compare4=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
var bb_reflection__classesMap=null;
var bb_reflection__classes=[];
function c_Node(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node.m_new2=function(){
	return this;
}
function bb_reflection_GetClass(t_name){
	if(!((bb_reflection__classesMap)!=null)){
		bb_reflection__classesMap=c_StringMap.m_new.call(new c_StringMap);
		var t_=bb_reflection__classes;
		var t_2=0;
		while(t_2<t_.length){
			var t_c=t_[t_2];
			t_2=t_2+1;
			var t_name2=t_c.p_Name();
			bb_reflection__classesMap.p_Set(t_name2,t_c);
			var t_i=t_name2.lastIndexOf(".");
			if(t_i==-1){
				continue;
			}
			t_name2=t_name2.slice(t_i+1);
			if(bb_reflection__classesMap.p_Contains(t_name2)){
				bb_reflection__classesMap.p_Set(t_name2,null);
			}else{
				bb_reflection__classesMap.p_Set(t_name2,t_c);
			}
		}
	}
	return bb_reflection__classesMap.p_Get(t_name);
}
function c__GetClass(){
	Object.call(this);
}
c__GetClass.prototype.p_GetClass=function(t_obj){
}
c__GetClass.m_new=function(){
	return this;
}
var bb_reflection__getClass=null;
function bb_reflection_GetClass2(t_obj){
	return bb_reflection__getClass.p_GetClass(t_obj);
}
function c_AssertException(){
	c_DiddyException.call(this);
}
c_AssertException.prototype=extend_class(c_DiddyException);
c_AssertException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_ConcurrentModificationException(){
	c_DiddyException.call(this);
}
c_ConcurrentModificationException.prototype=extend_class(c_DiddyException);
c_ConcurrentModificationException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_IndexOutOfBoundsException(){
	c_DiddyException.call(this);
}
c_IndexOutOfBoundsException.prototype=extend_class(c_DiddyException);
c_IndexOutOfBoundsException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_IllegalArgumentException(){
	c_DiddyException.call(this);
}
c_IllegalArgumentException.prototype=extend_class(c_DiddyException);
c_IllegalArgumentException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_XMLParseException(){
	c_DiddyException.call(this);
}
c_XMLParseException.prototype=extend_class(c_DiddyException);
c_XMLParseException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_UnsupportedOperationException(){
	c_DiddyException.call(this);
}
c_UnsupportedOperationException.prototype=extend_class(c_DiddyException);
c_UnsupportedOperationException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_FormatException(){
	c_DiddyException.call(this);
}
c_FormatException.prototype=extend_class(c_DiddyException);
c_FormatException.m_new=function(t_message,t_cause){
	c_DiddyException.m_new.call(this,t_message,t_cause);
	return this;
}
function c_R16(){
	c_ClassInfo.call(this);
}
c_R16.prototype=extend_class(c_ClassInfo);
c_R16.m_new=function(){
	c_ClassInfo.m_new.call(this,"monkey.lang.Object",1,null,[]);
	return this;
}
c_R16.prototype.p_Init=function(){
	this.p_InitR();
	return 0;
}
function c_R17(){
	c_ClassInfo.call(this);
}
c_R17.prototype=extend_class(c_ClassInfo);
c_R17.m_new=function(){
	c_ClassInfo.m_new.call(this,"monkey.boxes.BoolObject",0,bb_reflection__classes[0],[]);
	bb_reflection__boolClass=(this);
	return this;
}
c_R17.prototype.p_Init=function(){
	this.m__fields=new_object_array(1);
	this.m__fields[0]=(c_R18.m_new.call(new c_R18));
	this.m__methods=new_object_array(2);
	this.m__methods[0]=(c_R20.m_new.call(new c_R20));
	this.m__methods[1]=(c_R21.m_new.call(new c_R21));
	this.m__ctors=new_object_array(2);
	this.m__ctors[0]=(c_R19.m_new.call(new c_R19));
	this.m__ctors[1]=(c_R22.m_new.call(new c_R22));
	this.p_InitR();
	return 0;
}
var bb_reflection__boolClass=null;
function c_R23(){
	c_ClassInfo.call(this);
}
c_R23.prototype=extend_class(c_ClassInfo);
c_R23.m_new=function(){
	c_ClassInfo.m_new.call(this,"monkey.boxes.IntObject",0,bb_reflection__classes[0],[]);
	bb_reflection__intClass=(this);
	return this;
}
c_R23.prototype.p_Init=function(){
	this.m__fields=new_object_array(1);
	this.m__fields[0]=(c_R24.m_new.call(new c_R24));
	this.m__methods=new_object_array(5);
	this.m__methods[0]=(c_R27.m_new.call(new c_R27));
	this.m__methods[1]=(c_R28.m_new.call(new c_R28));
	this.m__methods[2]=(c_R29.m_new.call(new c_R29));
	this.m__methods[3]=(c_R30.m_new.call(new c_R30));
	this.m__methods[4]=(c_R31.m_new.call(new c_R31));
	this.m__ctors=new_object_array(3);
	this.m__ctors[0]=(c_R25.m_new.call(new c_R25));
	this.m__ctors[1]=(c_R26.m_new.call(new c_R26));
	this.m__ctors[2]=(c_R32.m_new.call(new c_R32));
	this.p_InitR();
	return 0;
}
var bb_reflection__intClass=null;
function c_R33(){
	c_ClassInfo.call(this);
}
c_R33.prototype=extend_class(c_ClassInfo);
c_R33.m_new=function(){
	c_ClassInfo.m_new.call(this,"monkey.boxes.FloatObject",0,bb_reflection__classes[0],[]);
	bb_reflection__floatClass=(this);
	return this;
}
c_R33.prototype.p_Init=function(){
	this.m__fields=new_object_array(1);
	this.m__fields[0]=(c_R34.m_new.call(new c_R34));
	this.m__methods=new_object_array(5);
	this.m__methods[0]=(c_R37.m_new.call(new c_R37));
	this.m__methods[1]=(c_R38.m_new.call(new c_R38));
	this.m__methods[2]=(c_R39.m_new.call(new c_R39));
	this.m__methods[3]=(c_R40.m_new.call(new c_R40));
	this.m__methods[4]=(c_R41.m_new.call(new c_R41));
	this.m__ctors=new_object_array(3);
	this.m__ctors[0]=(c_R35.m_new.call(new c_R35));
	this.m__ctors[1]=(c_R36.m_new.call(new c_R36));
	this.m__ctors[2]=(c_R42.m_new.call(new c_R42));
	this.p_InitR();
	return 0;
}
var bb_reflection__floatClass=null;
function c_R43(){
	c_ClassInfo.call(this);
}
c_R43.prototype=extend_class(c_ClassInfo);
c_R43.m_new=function(){
	c_ClassInfo.m_new.call(this,"monkey.boxes.StringObject",0,bb_reflection__classes[0],[]);
	bb_reflection__stringClass=(this);
	return this;
}
c_R43.prototype.p_Init=function(){
	this.m__fields=new_object_array(1);
	this.m__fields[0]=(c_R44.m_new.call(new c_R44));
	this.m__methods=new_object_array(3);
	this.m__methods[0]=(c_R48.m_new.call(new c_R48));
	this.m__methods[1]=(c_R49.m_new.call(new c_R49));
	this.m__methods[2]=(c_R50.m_new.call(new c_R50));
	this.m__ctors=new_object_array(4);
	this.m__ctors[0]=(c_R45.m_new.call(new c_R45));
	this.m__ctors[1]=(c_R46.m_new.call(new c_R46));
	this.m__ctors[2]=(c_R47.m_new.call(new c_R47));
	this.m__ctors[3]=(c_R51.m_new.call(new c_R51));
	this.p_InitR();
	return 0;
}
var bb_reflection__stringClass=null;
function c_R52(){
	c_ClassInfo.call(this);
}
c_R52.prototype=extend_class(c_ClassInfo);
c_R52.m_new=function(){
	c_ClassInfo.m_new.call(this,"monkey.lang.Throwable",33,bb_reflection__classes[0],[]);
	return this;
}
c_R52.prototype.p_Init=function(){
	this.p_InitR();
	return 0;
}
function c_R53(){
	c_ClassInfo.call(this);
}
c_R53.prototype=extend_class(c_ClassInfo);
c_R53.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.DiddyException",32,bb_reflection__classes[5],[]);
	return this;
}
c_R53.prototype.p_Init=function(){
	this.m__fields=new_object_array(4);
	this.m__fields[0]=(c_R54.m_new.call(new c_R54));
	this.m__fields[1]=(c_R55.m_new.call(new c_R55));
	this.m__fields[2]=(c_R56.m_new.call(new c_R56));
	this.m__fields[3]=(c_R57.m_new.call(new c_R57));
	this.m__methods=new_object_array(7);
	this.m__methods[0]=(c_R58.m_new.call(new c_R58));
	this.m__methods[1]=(c_R59.m_new.call(new c_R59));
	this.m__methods[2]=(c_R60.m_new.call(new c_R60));
	this.m__methods[3]=(c_R61.m_new.call(new c_R61));
	this.m__methods[4]=(c_R62.m_new.call(new c_R62));
	this.m__methods[5]=(c_R63.m_new.call(new c_R63));
	this.m__methods[6]=(c_R65.m_new.call(new c_R65));
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R64.m_new.call(new c_R64));
	this.p_InitR();
	return 0;
}
function c_R66(){
	c_ClassInfo.call(this);
}
c_R66.prototype=extend_class(c_ClassInfo);
c_R66.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.AssertException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R66.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R67.m_new.call(new c_R67));
	this.p_InitR();
	return 0;
}
function c_R68(){
	c_ClassInfo.call(this);
}
c_R68.prototype=extend_class(c_ClassInfo);
c_R68.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.ConcurrentModificationException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R68.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R69.m_new.call(new c_R69));
	this.p_InitR();
	return 0;
}
function c_R70(){
	c_ClassInfo.call(this);
}
c_R70.prototype=extend_class(c_ClassInfo);
c_R70.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.IndexOutOfBoundsException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R70.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R71.m_new.call(new c_R71));
	this.p_InitR();
	return 0;
}
function c_R72(){
	c_ClassInfo.call(this);
}
c_R72.prototype=extend_class(c_ClassInfo);
c_R72.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.IllegalArgumentException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R72.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R73.m_new.call(new c_R73));
	this.p_InitR();
	return 0;
}
function c_R74(){
	c_ClassInfo.call(this);
}
c_R74.prototype=extend_class(c_ClassInfo);
c_R74.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.XMLParseException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R74.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R75.m_new.call(new c_R75));
	this.p_InitR();
	return 0;
}
function c_R76(){
	c_ClassInfo.call(this);
}
c_R76.prototype=extend_class(c_ClassInfo);
c_R76.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.UnsupportedOperationException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R76.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R77.m_new.call(new c_R77));
	this.p_InitR();
	return 0;
}
function c_R78(){
	c_ClassInfo.call(this);
}
c_R78.prototype=extend_class(c_ClassInfo);
c_R78.m_new=function(){
	c_ClassInfo.m_new.call(this,"diddy.exception.FormatException",32,bb_reflection__classes[6],[]);
	return this;
}
c_R78.prototype.p_Init=function(){
	this.m__ctors=new_object_array(1);
	this.m__ctors[0]=(c_R79.m_new.call(new c_R79));
	this.p_InitR();
	return 0;
}
function c_FunctionInfo(){
	Object.call(this);
	this.m__name="";
	this.m__attrs=0;
	this.m__retType=null;
	this.m__argTypes=[];
}
c_FunctionInfo.m_new=function(t_name,t_attrs,t_retType,t_argTypes){
	this.m__name=t_name;
	this.m__attrs=t_attrs;
	this.m__retType=t_retType;
	this.m__argTypes=t_argTypes;
	return this;
}
c_FunctionInfo.m_new2=function(){
	return this;
}
var bb_reflection__functions=[];
function c_R4(){
	c_FunctionInfo.call(this);
}
c_R4.prototype=extend_class(c_FunctionInfo);
c_R4.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.BoxBool",0,bb_reflection__classes[0],[bb_reflection__boolClass]);
	return this;
}
function c_R5(){
	c_FunctionInfo.call(this);
}
c_R5.prototype=extend_class(c_FunctionInfo);
c_R5.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.BoxInt",0,bb_reflection__classes[0],[bb_reflection__intClass]);
	return this;
}
function c_R6(){
	c_FunctionInfo.call(this);
}
c_R6.prototype=extend_class(c_FunctionInfo);
c_R6.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.BoxFloat",0,bb_reflection__classes[0],[bb_reflection__floatClass]);
	return this;
}
function c_R7(){
	c_FunctionInfo.call(this);
}
c_R7.prototype=extend_class(c_FunctionInfo);
c_R7.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.BoxString",0,bb_reflection__classes[0],[bb_reflection__stringClass]);
	return this;
}
function c_R8(){
	c_FunctionInfo.call(this);
}
c_R8.prototype=extend_class(c_FunctionInfo);
c_R8.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.UnboxBool",0,bb_reflection__boolClass,[bb_reflection__classes[0]]);
	return this;
}
function c_R9(){
	c_FunctionInfo.call(this);
}
c_R9.prototype=extend_class(c_FunctionInfo);
c_R9.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.UnboxInt",0,bb_reflection__intClass,[bb_reflection__classes[0]]);
	return this;
}
function c_R10(){
	c_FunctionInfo.call(this);
}
c_R10.prototype=extend_class(c_FunctionInfo);
c_R10.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.UnboxFloat",0,bb_reflection__floatClass,[bb_reflection__classes[0]]);
	return this;
}
function c_R11(){
	c_FunctionInfo.call(this);
}
c_R11.prototype=extend_class(c_FunctionInfo);
c_R11.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.boxes.UnboxString",0,bb_reflection__stringClass,[bb_reflection__classes[0]]);
	return this;
}
function c_R12(){
	c_FunctionInfo.call(this);
}
c_R12.prototype=extend_class(c_FunctionInfo);
c_R12.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.lang.Print",1,bb_reflection__intClass,[bb_reflection__stringClass]);
	return this;
}
function c_R13(){
	c_FunctionInfo.call(this);
}
c_R13.prototype=extend_class(c_FunctionInfo);
c_R13.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.lang.Error",1,bb_reflection__intClass,[bb_reflection__stringClass]);
	return this;
}
function c_R14(){
	c_FunctionInfo.call(this);
}
c_R14.prototype=extend_class(c_FunctionInfo);
c_R14.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.lang.DebugLog",1,bb_reflection__intClass,[bb_reflection__stringClass]);
	return this;
}
function c_R15(){
	c_FunctionInfo.call(this);
}
c_R15.prototype=extend_class(c_FunctionInfo);
c_R15.m_new=function(){
	c_FunctionInfo.m_new.call(this,"monkey.lang.DebugStop",1,bb_reflection__intClass,[]);
	return this;
}
function c___GetClass(){
	c__GetClass.call(this);
}
c___GetClass.prototype=extend_class(c__GetClass);
c___GetClass.m_new=function(){
	c__GetClass.m_new.call(this);
	return this;
}
c___GetClass.prototype.p_GetClass=function(t_o){
	if(object_downcast((t_o),c_FormatException)!=null){
		return bb_reflection__classes[13];
	}
	if(object_downcast((t_o),c_UnsupportedOperationException)!=null){
		return bb_reflection__classes[12];
	}
	if(object_downcast((t_o),c_XMLParseException)!=null){
		return bb_reflection__classes[11];
	}
	if(object_downcast((t_o),c_IllegalArgumentException)!=null){
		return bb_reflection__classes[10];
	}
	if(object_downcast((t_o),c_IndexOutOfBoundsException)!=null){
		return bb_reflection__classes[9];
	}
	if(object_downcast((t_o),c_ConcurrentModificationException)!=null){
		return bb_reflection__classes[8];
	}
	if(object_downcast((t_o),c_AssertException)!=null){
		return bb_reflection__classes[7];
	}
	if(object_downcast((t_o),c_DiddyException)!=null){
		return bb_reflection__classes[6];
	}
	if(object_downcast((t_o),ThrowableObject)!=null){
		return bb_reflection__classes[5];
	}
	if(object_downcast((t_o),c_StringObject)!=null){
		return bb_reflection__classes[4];
	}
	if(object_downcast((t_o),c_FloatObject)!=null){
		return bb_reflection__classes[3];
	}
	if(object_downcast((t_o),c_IntObject)!=null){
		return bb_reflection__classes[2];
	}
	if(object_downcast((t_o),c_BoolObject)!=null){
		return bb_reflection__classes[1];
	}
	if(t_o!=null){
		return bb_reflection__classes[0];
	}
	return bb_reflection__unknownClass;
}
function bb_reflection___init(){
	bb_reflection__classes=new_object_array(14);
	bb_reflection__classes[0]=(c_R16.m_new.call(new c_R16));
	bb_reflection__classes[1]=(c_R17.m_new.call(new c_R17));
	bb_reflection__classes[2]=(c_R23.m_new.call(new c_R23));
	bb_reflection__classes[3]=(c_R33.m_new.call(new c_R33));
	bb_reflection__classes[4]=(c_R43.m_new.call(new c_R43));
	bb_reflection__classes[5]=(c_R52.m_new.call(new c_R52));
	bb_reflection__classes[6]=(c_R53.m_new.call(new c_R53));
	bb_reflection__classes[7]=(c_R66.m_new.call(new c_R66));
	bb_reflection__classes[8]=(c_R68.m_new.call(new c_R68));
	bb_reflection__classes[9]=(c_R70.m_new.call(new c_R70));
	bb_reflection__classes[10]=(c_R72.m_new.call(new c_R72));
	bb_reflection__classes[11]=(c_R74.m_new.call(new c_R74));
	bb_reflection__classes[12]=(c_R76.m_new.call(new c_R76));
	bb_reflection__classes[13]=(c_R78.m_new.call(new c_R78));
	bb_reflection__classes[0].p_Init();
	bb_reflection__classes[1].p_Init();
	bb_reflection__classes[2].p_Init();
	bb_reflection__classes[3].p_Init();
	bb_reflection__classes[4].p_Init();
	bb_reflection__classes[5].p_Init();
	bb_reflection__classes[6].p_Init();
	bb_reflection__classes[7].p_Init();
	bb_reflection__classes[8].p_Init();
	bb_reflection__classes[9].p_Init();
	bb_reflection__classes[10].p_Init();
	bb_reflection__classes[11].p_Init();
	bb_reflection__classes[12].p_Init();
	bb_reflection__classes[13].p_Init();
	bb_reflection__functions=new_object_array(12);
	bb_reflection__functions[0]=(c_R4.m_new.call(new c_R4));
	bb_reflection__functions[1]=(c_R5.m_new.call(new c_R5));
	bb_reflection__functions[2]=(c_R6.m_new.call(new c_R6));
	bb_reflection__functions[3]=(c_R7.m_new.call(new c_R7));
	bb_reflection__functions[4]=(c_R8.m_new.call(new c_R8));
	bb_reflection__functions[5]=(c_R9.m_new.call(new c_R9));
	bb_reflection__functions[6]=(c_R10.m_new.call(new c_R10));
	bb_reflection__functions[7]=(c_R11.m_new.call(new c_R11));
	bb_reflection__functions[8]=(c_R12.m_new.call(new c_R12));
	bb_reflection__functions[9]=(c_R13.m_new.call(new c_R13));
	bb_reflection__functions[10]=(c_R14.m_new.call(new c_R14));
	bb_reflection__functions[11]=(c_R15.m_new.call(new c_R15));
	bb_reflection__getClass=(c___GetClass.m_new.call(new c___GetClass));
	return 0;
}
var bb_reflection__init=0;
function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	if((bb_app__app)!=null){
		error("App has already been created");
	}
	bb_app__app=this;
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	bb_app__game.SetDelegate(bb_app__delegate);
	return this;
}
c_App.prototype.p_OnResize=function(){
	return 0;
}
c_App.prototype.p_OnCreate=function(){
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	return 0;
}
c_App.prototype.p_OnResume=function(){
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	return 0;
}
c_App.prototype.p_OnRender=function(){
	return 0;
}
c_App.prototype.p_OnClose=function(){
	bb_app_EndApp();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	this.p_OnClose();
	return 0;
}
function c_DiddyApp(){
	c_App.call(this);
	this.m_screens=null;
	this.m_exitScreen=null;
	this.m_loadingScreen=null;
	this.m_screenFade=null;
	this.m_images=null;
	this.m_sounds=null;
	this.m_inputCache=null;
	this.m_diddyMouse=null;
	this.m_virtualResOn=true;
	this.m_aspectRatioOn=false;
	this.m_aspectRatio=.0;
	this.m_deviceChanged=0;
	this.m_mouseX=0;
	this.m_mouseY=0;
	this.m_FPS=60;
	this.m_useFixedRateLogic=false;
	this.m_frameRate=200.0;
	this.m_ms=0.0;
	this.m_numTicks=.0;
	this.m_lastNumTicks=.0;
	this.m_lastTime=.0;
	this.m_multi=.0;
	this.m_heightBorder=.0;
	this.m_widthBorder=.0;
	this.m_vsx=.0;
	this.m_vsy=.0;
	this.m_vsw=.0;
	this.m_vsh=.0;
	this.m_virtualScaledW=.0;
	this.m_virtualScaledH=.0;
	this.m_virtualXOff=.0;
	this.m_virtualYOff=.0;
	this.m_autoCls=false;
	this.m_currentScreen=null;
	this.m_debugOn=false;
	this.m_musicFile="";
	this.m_musicOkay=0;
	this.m_musicVolume=100;
	this.m_mojoMusicVolume=1.0;
	this.m_soundVolume=100;
	this.m_drawFPSOn=false;
	this.m_mouseHit=0;
	this.m_debugKeyOn=false;
	this.m_debugKey=112;
	this.m_tmpMs=.0;
	this.m_maxMs=50;
	this.m_nextScreen=null;
}
c_DiddyApp.prototype=extend_class(c_App);
c_DiddyApp.m_new=function(){
	c_App.m_new.call(this);
	bb_framework_diddyGame=this;
	this.m_screens=c_Screens.m_new.call(new c_Screens);
	this.m_exitScreen=c_ExitScreen.m_new.call(new c_ExitScreen);
	this.m_loadingScreen=c_LoadingScreen.m_new.call(new c_LoadingScreen);
	this.m_screenFade=c_ScreenFade.m_new.call(new c_ScreenFade);
	this.m_images=c_ImageBank.m_new.call(new c_ImageBank);
	this.m_sounds=c_SoundBank.m_new.call(new c_SoundBank);
	this.m_inputCache=c_InputCache.m_new.call(new c_InputCache);
	this.m_diddyMouse=c_DiddyMouse.m_new.call(new c_DiddyMouse);
	return this;
}
c_DiddyApp.prototype.p_SetScreenSize=function(t_w,t_h,t_useAspectRatio){
	bb_framework_SCREEN_WIDTH=t_w;
	bb_framework_SCREEN_HEIGHT=t_h;
	bb_framework_SCREEN_WIDTH2=bb_framework_SCREEN_WIDTH/2.0;
	bb_framework_SCREEN_HEIGHT2=bb_framework_SCREEN_HEIGHT/2.0;
	bb_framework_SCREENX_RATIO=bb_framework_DEVICE_WIDTH/bb_framework_SCREEN_WIDTH;
	bb_framework_SCREENY_RATIO=bb_framework_DEVICE_HEIGHT/bb_framework_SCREEN_HEIGHT;
	if(bb_framework_SCREENX_RATIO!=1.0 || bb_framework_SCREENY_RATIO!=1.0){
		this.m_virtualResOn=true;
		this.m_aspectRatioOn=t_useAspectRatio;
		this.m_aspectRatio=t_h/t_w;
	}
	if((bb_app_DeviceWidth())!=bb_framework_SCREEN_WIDTH || (bb_app_DeviceHeight())!=bb_framework_SCREEN_HEIGHT){
		this.m_deviceChanged=1;
	}
}
c_DiddyApp.prototype.p_ResetFixedRateLogic=function(){
	this.m_ms=1000.0/this.m_frameRate;
	this.m_numTicks=0.0;
	this.m_lastNumTicks=1.0;
	this.m_lastTime=(bb_app_Millisecs());
	if(bb_framework_dt!=null){
		bb_framework_dt.m_delta=1.0;
	}
}
c_DiddyApp.prototype.p_Create=function(){
}
c_DiddyApp.prototype.p_OnCreate=function(){
	try{
		bb_framework_DEVICE_WIDTH=(bb_app_DeviceWidth());
		bb_framework_DEVICE_HEIGHT=(bb_app_DeviceHeight());
		this.p_SetScreenSize(bb_framework_DEVICE_WIDTH,bb_framework_DEVICE_HEIGHT,false);
		this.m_deviceChanged=1;
		this.m_mouseX=((bb_input_MouseX()/bb_framework_SCREENX_RATIO)|0);
		this.m_mouseY=((bb_input_MouseY()/bb_framework_SCREENY_RATIO)|0);
		bb_random_Seed=diddy.systemMillisecs();
		bb_framework_dt=c_DeltaTimer.m_new.call(new c_DeltaTimer,(this.m_FPS));
		bb_app_SetUpdateRate(this.m_FPS);
		c_Particle.m_Cache();
		if(this.m_useFixedRateLogic){
			this.p_ResetFixedRateLogic();
		}
		this.p_Create();
	}catch(_eek_){
		if(t_e=object_downcast(_eek_,c_DiddyException)){
			print(t_e.p_ToString2(true));
			error(t_e.p_ToString2(false));
		}else{
			throw _eek_;
		}
	}
	return 0;
}
c_DiddyApp.prototype.p_PerformVirtualResolution=function(){
	if(this.m_virtualResOn){
		bb_graphics_PushMatrix();
		if(this.m_aspectRatioOn){
			if((bb_app_DeviceWidth())!=bb_framework_DEVICE_WIDTH || (bb_app_DeviceHeight())!=bb_framework_DEVICE_HEIGHT || ((this.m_deviceChanged)!=0)){
				bb_framework_DEVICE_WIDTH=(bb_app_DeviceWidth());
				bb_framework_DEVICE_HEIGHT=(bb_app_DeviceHeight());
				this.m_deviceChanged=0;
				var t_deviceRatio=bb_framework_DEVICE_HEIGHT/bb_framework_DEVICE_WIDTH;
				if(t_deviceRatio>=this.m_aspectRatio){
					this.m_multi=bb_framework_DEVICE_WIDTH/bb_framework_SCREEN_WIDTH;
					this.m_heightBorder=(bb_framework_DEVICE_HEIGHT-bb_framework_SCREEN_HEIGHT*this.m_multi)*0.5;
					this.m_widthBorder=0.0;
				}else{
					this.m_multi=bb_framework_DEVICE_HEIGHT/bb_framework_SCREEN_HEIGHT;
					this.m_widthBorder=(bb_framework_DEVICE_WIDTH-bb_framework_SCREEN_WIDTH*this.m_multi)*0.5;
					this.m_heightBorder=0.0;
				}
				this.m_vsx=bb_math_Max2(0.0,this.m_widthBorder);
				this.m_vsy=bb_math_Max2(0.0,this.m_heightBorder);
				this.m_vsw=bb_math_Min2(bb_framework_DEVICE_WIDTH-this.m_widthBorder*2.0,bb_framework_DEVICE_WIDTH);
				this.m_vsh=bb_math_Min2(bb_framework_DEVICE_HEIGHT-this.m_heightBorder*2.0,bb_framework_DEVICE_HEIGHT);
				this.m_virtualScaledW=bb_framework_SCREEN_WIDTH*this.m_multi;
				this.m_virtualScaledH=bb_framework_SCREEN_HEIGHT*this.m_multi;
				this.m_virtualXOff=(bb_framework_DEVICE_WIDTH-this.m_virtualScaledW)*0.5;
				this.m_virtualYOff=(bb_framework_DEVICE_HEIGHT-this.m_virtualScaledH)*0.5;
				this.m_virtualXOff=this.m_virtualXOff/this.m_multi;
				this.m_virtualYOff=this.m_virtualYOff/this.m_multi;
			}
			bb_graphics_SetScissor(0.0,0.0,bb_framework_DEVICE_WIDTH,bb_framework_DEVICE_HEIGHT);
			bb_graphics_Cls(0.0,0.0,0.0);
			bb_graphics_SetScissor(this.m_vsx,this.m_vsy,this.m_vsw,this.m_vsh);
			bb_graphics_Scale(this.m_multi,this.m_multi);
			bb_graphics_Translate(this.m_virtualXOff,this.m_virtualYOff);
		}else{
			bb_graphics_Scale(bb_framework_SCREENX_RATIO,bb_framework_SCREENY_RATIO);
		}
	}
}
c_DiddyApp.prototype.p_OverrideRender=function(){
}
c_DiddyApp.prototype.p_DrawDebug=function(){
	bb_graphics_SetColor(255.0,255.0,255.0);
	c_FPSCounter.m_Draw(0,0,0.0,0.0);
	var t_y=10;
	var t_gap=14;
	if((this.m_currentScreen)!=null){
		bb_graphics_DrawText("Screen             = "+this.m_currentScreen.m_name,0.0,(t_y),0.0,0.0);
	}else{
		bb_graphics_DrawText("Screen             = null",0.0,(t_y),0.0,0.0);
	}
	t_y+=t_gap;
	bb_graphics_DrawText("Delta              = "+bb_functions_FormatNumber(bb_framework_dt.m_delta,2,0,0),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Frame Time         = "+String(bb_framework_dt.m_frametime),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Screen Width       = "+String(bb_framework_SCREEN_WIDTH),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Screen Height      = "+String(bb_framework_SCREEN_HEIGHT),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("VMouseX            = "+String(this.m_mouseX),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("VMouseY            = "+String(this.m_mouseY),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("MouseX             = "+String(bb_input_MouseX()),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("MouseY             = "+String(bb_input_MouseY()),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Music File         = "+this.m_musicFile,0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("MusicOkay          = "+String(this.m_musicOkay),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Music State        = "+String(bb_audio_MusicState()),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Music Volume       = "+String(this.m_musicVolume),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Mojo Music Volume  = "+String(this.m_mojoMusicVolume),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Sound Volume       = "+String(this.m_soundVolume),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Sound Channel      = "+String(c_SoundPlayer.m_channel),0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
	bb_graphics_DrawText("Back Screen Name   = "+this.m_currentScreen.m_backScreenName,0.0,(t_y),0.0,0.0);
	t_y+=t_gap;
}
c_DiddyApp.prototype.p_DrawFPS=function(){
	var t_oldcolor=bb_graphics_GetColor();
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_DrawText(String(c_FPSCounter.m_totalFPS),0.0,0.0,0.0,0.0);
	bb_graphics_SetColor(t_oldcolor[0],t_oldcolor[1],t_oldcolor[2]);
}
c_DiddyApp.prototype.p_OnRender=function(){
	try{
		c_FPSCounter.m_Update();
		this.p_PerformVirtualResolution();
		this.p_OverrideRender();
		if(this.m_autoCls){
			bb_graphics_Cls(0.0,0.0,0.0);
		}
		if((this.m_currentScreen)!=null){
			this.m_currentScreen.p_RenderBackgroundLayers();
			this.m_currentScreen.p_Render();
			this.m_currentScreen.p_RenderForegroundLayers();
		}
		if(this.m_virtualResOn){
			if(this.m_aspectRatioOn){
				bb_graphics_SetScissor(0.0,0.0,bb_framework_DEVICE_WIDTH,bb_framework_DEVICE_HEIGHT);
			}
			bb_graphics_PopMatrix();
		}
		if((this.m_currentScreen)!=null){
			this.m_currentScreen.p_ExtraRender();
			if(this.m_screenFade.m_active){
				this.m_screenFade.p_Render();
			}
			this.m_currentScreen.p_DebugRender();
		}
		if(this.m_debugOn){
			this.p_DrawDebug();
		}
		if(this.m_drawFPSOn){
			this.p_DrawFPS();
		}
		this.m_diddyMouse.p_Update2();
	}catch(_eek_){
		if(t_e=object_downcast(_eek_,c_DiddyException)){
			print(t_e.p_ToString2(true));
			error(t_e.p_ToString2(false));
		}else{
			throw _eek_;
		}
	}
	return 0;
}
c_DiddyApp.prototype.p_ReadInputs=function(){
	if(this.m_aspectRatioOn){
		var t_mouseOffsetX=bb_input_MouseX()-bb_framework_DEVICE_WIDTH*0.5;
		var t_x=t_mouseOffsetX/this.m_multi/1.0+bb_framework_SCREEN_WIDTH*0.5;
		this.m_mouseX=((t_x)|0);
		var t_mouseOffsetY=bb_input_MouseY()-bb_framework_DEVICE_HEIGHT*0.5;
		var t_y=t_mouseOffsetY/this.m_multi/1.0+bb_framework_SCREEN_HEIGHT*0.5;
		this.m_mouseY=((t_y)|0);
	}else{
		this.m_mouseX=((bb_input_MouseX()/bb_framework_SCREENX_RATIO)|0);
		this.m_mouseY=((bb_input_MouseY()/bb_framework_SCREENY_RATIO)|0);
	}
	this.m_mouseHit=bb_input_MouseHit(0);
	this.m_inputCache.p_ReadInput();
	if(!this.m_screenFade.m_active){
		this.m_inputCache.p_HandleEvents(this.m_currentScreen);
	}
	if(this.m_debugKeyOn){
		if((bb_input_KeyHit(this.m_debugKey))!=0){
			this.m_debugOn=!this.m_debugOn;
		}
	}
}
c_DiddyApp.prototype.p_OverrideUpdate=function(){
}
c_DiddyApp.prototype.p_SetMojoMusicVolume=function(t_volume){
	if(t_volume<0.0){
		t_volume=0.0;
	}
	if(t_volume>1.0){
		t_volume=1.0;
	}
	this.m_mojoMusicVolume=t_volume;
	bb_audio_SetMusicVolume(this.m_mojoMusicVolume);
}
c_DiddyApp.prototype.p_ResetDelta=function(){
	bb_framework_dt.m_currentticks=(bb_app_Millisecs());
	bb_framework_dt.m_lastticks=bb_framework_dt.m_currentticks;
}
c_DiddyApp.prototype.p_CalcAnimLength=function(t_ms){
	return (t_ms)/(1000.0/(this.m_FPS));
}
c_DiddyApp.prototype.p_MusicPlay=function(t_file,t_flags){
	this.m_musicFile=t_file;
	this.m_musicOkay=bb_audio_PlayMusic("music/"+this.m_musicFile,t_flags);
	if(this.m_musicOkay==-1){
		print("Error Playing Music - Music must be in the data\\music folder");
	}
}
c_DiddyApp.prototype.p_Update=function(t_fixedRateLogicDelta){
	bb_framework_dt.p_UpdateDelta();
	if(this.m_useFixedRateLogic){
		bb_framework_dt.m_delta=t_fixedRateLogicDelta;
	}
	if((c_TweenManager.m_DefaultManager)!=null){
		c_TweenManager.m_DefaultManager.p_Update(bb_framework_dt.m_frametime*0.001);
	}
	if(this.m_screenFade.m_active){
		this.m_screenFade.p_Update2();
	}
	if((this.m_currentScreen)!=null){
		if(!this.m_screenFade.m_active || this.m_screenFade.m_allowScreenUpdate && this.m_screenFade.m_active){
			this.m_currentScreen.p_Update2();
		}
	}
}
c_DiddyApp.prototype.p_OnUpdate=function(){
	try{
		this.p_ReadInputs();
		this.p_OverrideUpdate();
		if(this.m_useFixedRateLogic){
			var t_now=bb_app_Millisecs();
			if((t_now)<this.m_lastTime){
				this.m_numTicks=this.m_lastNumTicks;
			}else{
				this.m_tmpMs=(t_now)-this.m_lastTime;
				if(this.m_tmpMs>(this.m_maxMs)){
					this.m_tmpMs=(this.m_maxMs);
				}
				this.m_numTicks=this.m_tmpMs/this.m_ms;
			}
			this.m_lastTime=(t_now);
			this.m_lastNumTicks=this.m_numTicks;
			for(var t_i=1;(t_i)<=Math.floor(this.m_numTicks);t_i=t_i+1){
				this.p_Update(1.0);
			}
			var t_re=this.m_numTicks % 1.0;
			if(t_re>0.0){
				this.p_Update(t_re);
			}
		}else{
			this.p_Update(0.0);
		}
	}catch(_eek_){
		if(t_e=object_downcast(_eek_,c_DiddyException)){
			print(t_e.p_ToString2(true));
			error(t_e.p_ToString2(false));
		}else{
			throw _eek_;
		}
	}
	return 0;
}
c_DiddyApp.prototype.p_OnSuspend=function(){
	try{
		if((this.m_currentScreen)!=null){
			this.m_currentScreen.p_Suspend();
		}
	}catch(_eek_){
		if(t_e=object_downcast(_eek_,c_DiddyException)){
			print(t_e.p_ToString2(true));
			error(t_e.p_ToString2(false));
		}else{
			throw _eek_;
		}
	}
	return 0;
}
c_DiddyApp.prototype.p_OnResume=function(){
	try{
		bb_framework_dt.m_currentticks=(bb_app_Millisecs());
		bb_framework_dt.m_lastticks=bb_framework_dt.m_currentticks;
		if((this.m_currentScreen)!=null){
			this.m_currentScreen.p_Resume();
		}
	}catch(_eek_){
		if(t_e=object_downcast(_eek_,c_DiddyException)){
			print(t_e.p_ToString2(true));
			error(t_e.p_ToString2(false));
		}else{
			throw _eek_;
		}
	}
	return 0;
}
c_DiddyApp.prototype.p_OnBack=function(){
	try{
		if((this.m_currentScreen)!=null){
			this.m_currentScreen.p_Back(bb_framework_defaultFadeTime,false,false,true);
		}
	}catch(_eek_){
		if(t_e=object_downcast(_eek_,c_DiddyException)){
			print(t_e.p_ToString2(true));
			error(t_e.p_ToString2(false));
		}else{
			throw _eek_;
		}
	}
	return 0;
}
c_DiddyApp.prototype.p_Start=function(t_firstScreen,t_autoFadeIn,t_fadeInTime,t_fadeSound,t_fadeMusic){
	this.p_ResetDelta();
	t_firstScreen.m_autoFadeIn=t_autoFadeIn;
	if(t_autoFadeIn){
		t_firstScreen.m_autoFadeInTime=t_fadeInTime;
		t_firstScreen.m_autoFadeInSound=t_fadeSound;
		t_firstScreen.m_autoFadeInMusic=t_fadeMusic;
	}
	t_firstScreen.p_PreStart();
}
function c_MyApp(){
	c_DiddyApp.call(this);
}
c_MyApp.prototype=extend_class(c_DiddyApp);
c_MyApp.m_new=function(){
	c_DiddyApp.m_new.call(this);
	return this;
}
c_MyApp.prototype.p_Create=function(){
	bb_jumpblob_GAME=c_Game.m_new.call(new c_Game);
	this.p_Start((bb_jumpblob_GAME),true,bb_framework_defaultFadeTime,false,false);
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	this.m__graphics=(new gxtkGraphics);
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	bb_graphics_SetFont(null,32);
	this.m__audio=(new gxtkAudio);
	bb_audio_SetAudioDevice(this.m__audio);
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	bb_input_SetInputDevice(this.m__input);
	bb_app_ValidateDeviceWindow(false);
	bb_app_EnumDisplayModes();
	bb_app__app.p_OnCreate();
}
c_GameDelegate.prototype.SuspendGame=function(){
	bb_app__app.p_OnSuspend();
	this.m__audio.Suspend();
}
c_GameDelegate.prototype.ResumeGame=function(){
	this.m__audio.Resume();
	bb_app__app.p_OnResume();
}
c_GameDelegate.prototype.UpdateGame=function(){
	bb_app_ValidateDeviceWindow(true);
	this.m__input.p_BeginUpdate();
	bb_app__app.p_OnUpdate();
	this.m__input.p_EndUpdate();
}
c_GameDelegate.prototype.RenderGame=function(){
	bb_app_ValidateDeviceWindow(true);
	var t_mode=this.m__graphics.BeginRender();
	if((t_mode)!=0){
		bb_graphics_BeginRender();
	}
	if(t_mode==2){
		bb_app__app.p_OnLoading();
	}else{
		bb_app__app.p_OnRender();
	}
	if((t_mode)!=0){
		bb_graphics_EndRender();
	}
	this.m__graphics.EndRender();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	this.m__input.p_KeyEvent(t_event,t_data);
	if(t_event!=1){
		return;
	}
	var t_1=t_data;
	if(t_1==432){
		bb_app__app.p_OnClose();
	}else{
		if(t_1==416){
			bb_app__app.p_OnBack();
		}
	}
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	this.m__graphics.DiscardGraphics();
}
var bb_app__delegate=null;
var bb_app__game=null;
var bb_framework_diddyGame=null;
function c_Screen(){
	Object.call(this);
	this.m_name="";
	this.m_layers=null;
	this.m_backScreenName="";
	this.m_autoFadeIn=false;
	this.m_autoFadeInTime=50.0;
	this.m_autoFadeInSound=false;
	this.m_autoFadeInMusic=false;
	this.m_musicPath="";
	this.m_musicFlag=0;
}
c_Screen.m_new=function(t_name){
	this.m_name=t_name;
	return this;
}
c_Screen.prototype.p_RenderBackgroundLayers=function(){
	if((this.m_layers)!=null){
		var t_=this.m_layers.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_layer=t_.p_NextObject();
			if(t_layer.m_index>=0){
				return;
			}
			t_layer.p_Render2(0.0,0.0);
		}
	}
}
c_Screen.prototype.p_Render=function(){
}
c_Screen.prototype.p_RenderForegroundLayers=function(){
	if((this.m_layers)!=null){
		var t_=this.m_layers.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_layer=t_.p_NextObject();
			if(t_layer.m_index>=0){
				t_layer.p_Render2(0.0,0.0);
			}
		}
	}
}
c_Screen.prototype.p_ExtraRender=function(){
}
c_Screen.prototype.p_DebugRender=function(){
}
c_Screen.prototype.p_OnTouchHit=function(t_x,t_y,t_pointer){
}
c_Screen.prototype.p_OnTouchClick=function(t_x,t_y,t_pointer){
}
c_Screen.prototype.p_OnTouchFling=function(t_releaseX,t_releaseY,t_velocityX,t_velocityY,t_velocitySpeed,t_pointer){
}
c_Screen.prototype.p_OnTouchReleased=function(t_x,t_y,t_pointer){
}
c_Screen.prototype.p_OnTouchDragged=function(t_x,t_y,t_dx,t_dy,t_pointer){
}
c_Screen.prototype.p_OnTouchLongPress=function(t_x,t_y,t_pointer){
}
c_Screen.prototype.p_OnAnyKeyHit=function(){
}
c_Screen.prototype.p_OnKeyHit=function(t_key){
}
c_Screen.prototype.p_OnAnyKeyDown=function(){
}
c_Screen.prototype.p_OnKeyDown=function(t_key){
}
c_Screen.prototype.p_OnAnyKeyReleased=function(){
}
c_Screen.prototype.p_OnKeyReleased=function(t_key){
}
c_Screen.prototype.p_OnMouseHit=function(t_x,t_y,t_button){
}
c_Screen.prototype.p_OnMouseDown=function(t_x,t_y,t_button){
}
c_Screen.prototype.p_OnMouseReleased=function(t_x,t_y,t_button){
}
c_Screen.prototype.p_Kill=function(){
}
c_Screen.prototype.p_Load=function(){
}
c_Screen.prototype.p_Start2=function(){
}
c_Screen.prototype.p_PreStart=function(){
	bb_framework_diddyGame.m_screens.p_Set2(this.m_name,this);
	bb_framework_diddyGame.m_currentScreen=this;
	this.p_Load();
	var t_=bb_framework_diddyGame.m_images.p_Keys().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_key=t_.p_NextObject();
		var t_i=bb_framework_diddyGame.m_images.p_Get(t_key);
		if(t_i.m_preLoad && t_i.m_screenName.toUpperCase()==this.m_name.toUpperCase()){
			if(t_i.m_frames>1){
				t_i.p_LoadAnim(t_i.m_path,t_i.m_w,t_i.m_h,t_i.m_frames,null,t_i.m_midhandle,t_i.m_readPixels,t_i.m_maskRed,t_i.m_maskGreen,t_i.m_maskBlue,false,t_i.m_screenName);
			}else{
				t_i.p_Load2(t_i.m_path,t_i.m_midhandle,t_i.m_readPixels,t_i.m_maskRed,t_i.m_maskGreen,t_i.m_maskBlue,false,t_i.m_screenName);
			}
		}
	}
	var t_2=bb_framework_diddyGame.m_sounds.p_Keys().p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_key2=t_2.p_NextObject();
		var t_i2=bb_framework_diddyGame.m_sounds.p_Get(t_key2);
		if(t_i2.m_preLoad && t_i2.m_screenName.toUpperCase()==this.m_name.toUpperCase()){
			t_i2.p_Load3(t_i2.m_path,false,t_i2.m_screenName);
		}
	}
	bb_framework_diddyGame.p_ResetDelta();
	if(this.m_autoFadeIn){
		this.m_autoFadeIn=false;
		bb_framework_diddyGame.m_screenFade.p_Start3(this.m_autoFadeInTime,false,this.m_autoFadeInSound,this.m_autoFadeInMusic,bb_framework_diddyGame.m_screenFade.m_allowScreenUpdate);
	}
	if(this.m_musicPath!=""){
		bb_framework_diddyGame.p_MusicPlay(this.m_musicPath,this.m_musicFlag);
	}
	this.p_Start2();
}
c_Screen.prototype.p_PostFadeOut=function(){
	this.p_Kill();
	bb_framework_diddyGame.m_nextScreen.p_PreStart();
}
c_Screen.prototype.p_PostFadeIn=function(){
}
c_Screen.prototype.p_Update2=function(){
}
c_Screen.prototype.p_Suspend=function(){
}
c_Screen.prototype.p_Resume=function(){
}
c_Screen.prototype.p_FadeToScreen=function(t_screen,t_fadeTime,t_fadeSound,t_fadeMusic,t_allowScreenUpdate){
	if(bb_framework_diddyGame.m_screenFade.m_active){
		return;
	}
	if(!((t_screen)!=null)){
		t_screen=(bb_framework_diddyGame.m_exitScreen);
	}
	t_screen.m_autoFadeIn=true;
	t_screen.m_autoFadeInTime=t_fadeTime;
	t_screen.m_autoFadeInSound=t_fadeSound;
	t_screen.m_autoFadeInMusic=t_fadeMusic;
	bb_framework_diddyGame.m_nextScreen=t_screen;
	bb_framework_diddyGame.m_screenFade.p_Start3(t_fadeTime,true,t_fadeSound,t_fadeMusic,t_allowScreenUpdate);
}
c_Screen.prototype.p_Back=function(t_fadeTime,t_fadeSound,t_fadeMusic,t_allowScreenUpdate){
	if(this.m_backScreenName=="exit"){
		this.p_FadeToScreen(null,bb_framework_defaultFadeTime,false,false,true);
	}else{
		if((this.m_backScreenName).length!=0){
			var t_scr=bb_framework_diddyGame.m_screens.p_Find(this.m_backScreenName);
			if((t_scr)!=null){
				this.p_FadeToScreen(t_scr,t_fadeTime,t_fadeSound,t_fadeMusic,t_allowScreenUpdate);
			}
		}
	}
}
function c_Map2(){
	Object.call(this);
	this.m_root=null;
}
c_Map2.m_new=function(){
	return this;
}
c_Map2.prototype.p_Compare4=function(t_lhs,t_rhs){
}
c_Map2.prototype.p_RotateLeft2=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map2.prototype.p_RotateRight2=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map2.prototype.p_InsertFixup2=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft2(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight2(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight2(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft2(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map2.prototype.p_Set2=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare4(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node8.m_new.call(new c_Node8,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup2(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map2.prototype.p_Keys=function(){
	return c_MapKeys5.m_new.call(new c_MapKeys5,this);
}
c_Map2.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
c_Map2.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare4(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map2.prototype.p_Get=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap2(){
	c_Map2.call(this);
}
c_StringMap2.prototype=extend_class(c_Map2);
c_StringMap2.m_new=function(){
	c_Map2.m_new.call(this);
	return this;
}
c_StringMap2.prototype.p_Compare4=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Screens(){
	c_StringMap2.call(this);
}
c_Screens.prototype=extend_class(c_StringMap2);
c_Screens.m_new=function(){
	c_StringMap2.m_new.call(this);
	return this;
}
c_Screens.prototype.p_Set2=function(t_key,t_value){
	return c_Map2.prototype.p_Set2.call(this,t_key.toUpperCase(),t_value);
}
c_Screens.prototype.p_Find=function(t_name){
	t_name=t_name.toUpperCase();
	if(bb_framework_diddyGame.m_debugOn){
		var t_=this.p_Keys().p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_key=t_.p_NextObject();
			print(t_key+" is stored in the Screens map.");
		}
	}
	var t_i=this.p_Get(t_name);
	bb_assert_AssertNotNull((t_i),"Screen '"+t_name+"' not found in the Screens map");
	return t_i;
}
function c_ExitScreen(){
	c_Screen.call(this);
}
c_ExitScreen.prototype=extend_class(c_Screen);
c_ExitScreen.m_new=function(){
	c_Screen.m_new.call(this,"exit");
	return this;
}
c_ExitScreen.prototype.p_Start2=function(){
	bb_functions_ExitApp();
}
c_ExitScreen.prototype.p_Render=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
}
c_ExitScreen.prototype.p_Update2=function(){
}
function c_LoadingScreen(){
	c_Screen.call(this);
	this.m_loadingBar=null;
	this.m_finished=false;
	this.m_destination=null;
	this.m_rendering=false;
	this.m_image=null;
	this.m_loadingScreenDelegate=null;
}
c_LoadingScreen.prototype=extend_class(c_Screen);
c_LoadingScreen.m_new=function(){
	c_Screen.m_new.call(this,"");
	this.m_name="loading";
	this.m_loadingBar=c_LoadingBar.m_new.call(new c_LoadingBar);
	return this;
}
c_LoadingScreen.prototype.p_Start2=function(){
	this.m_finished=false;
	if(this.m_destination==null){
		error("Loading Screen Destination is null!");
	}
}
c_LoadingScreen.prototype.p_Render=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
	if(!bb_framework_diddyGame.m_screenFade.m_active){
		this.m_rendering=true;
	}
	bb_graphics_DrawImage(this.m_image,bb_framework_SCREEN_WIDTH2,bb_framework_SCREEN_HEIGHT2,0);
	this.m_loadingBar.p_Draw();
	if((this.m_loadingScreenDelegate)!=null){
		this.m_loadingScreenDelegate.p_Draw();
	}
}
c_LoadingScreen.prototype.p_Update2=function(){
	if(((this.m_loadingScreenDelegate)!=null) && this.m_rendering){
		this.m_loadingScreenDelegate.p_Load();
	}
	if((bb_input_KeyHit(32))!=0){
		this.m_loadingBar.p_Progress();
	}
	if(this.m_loadingBar.m_finished){
		this.p_FadeToScreen(this.m_destination,bb_framework_defaultFadeTime,false,false,true);
	}
}
function c_LoadingBar(){
	Object.call(this);
	this.m_emptyImage=null;
	this.m_x=0;
	this.m_y=0;
	this.m_fullImage=null;
	this.m_position=.0;
	this.m_finished=false;
}
c_LoadingBar.m_new=function(){
	return this;
}
c_LoadingBar.prototype.p_Draw=function(){
	bb_graphics_DrawImage(this.m_emptyImage,(this.m_x),(this.m_y),0);
	bb_graphics_DrawImageRect(this.m_fullImage,(this.m_x),(this.m_y),0,0,((this.m_position)|0),this.m_fullImage.p_Height(),0);
}
c_LoadingBar.prototype.p_Progress=function(){
	print("Please use LoadingScreen.Progress!");
}
function c_ScreenFade(){
	Object.call(this);
	this.m_active=false;
	this.m_ratio=0.0;
	this.m_counter=.0;
	this.m_fadeTime=.0;
	this.m_fadeMusic=false;
	this.m_fadeOut=false;
	this.m_fadeSound=false;
	this.m_allowScreenUpdate=true;
}
c_ScreenFade.m_new=function(){
	return this;
}
c_ScreenFade.prototype.p_Render=function(){
	if(!this.m_active){
		return;
	}
	bb_graphics_SetAlpha(1.0-this.m_ratio);
	bb_graphics_SetColor(0.0,0.0,0.0);
	bb_graphics_DrawRect(0.0,0.0,(bb_app_DeviceWidth()),(bb_app_DeviceHeight()));
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
}
c_ScreenFade.prototype.p_CalcRatio=function(){
	this.m_ratio=this.m_counter/this.m_fadeTime;
	if(this.m_ratio<0.0){
		this.m_ratio=0.0;
		if(this.m_fadeMusic){
			bb_framework_diddyGame.p_SetMojoMusicVolume(0.0);
		}
	}
	if(this.m_ratio>1.0){
		this.m_ratio=1.0;
		if(this.m_fadeMusic){
			bb_framework_diddyGame.p_SetMojoMusicVolume((bb_framework_diddyGame.m_musicVolume)/100.0);
		}
	}
	if(this.m_fadeOut){
		this.m_ratio=1.0-this.m_ratio;
	}
}
c_ScreenFade.prototype.p_Start3=function(t_fadeTime,t_fadeOut,t_fadeSound,t_fadeMusic,t_allowScreenUpdate){
	if(this.m_active){
		return;
	}
	bb_framework_diddyGame.p_ResetDelta();
	this.m_active=true;
	this.m_fadeTime=bb_framework_diddyGame.p_CalcAnimLength((t_fadeTime)|0);
	this.m_fadeOut=t_fadeOut;
	this.m_fadeMusic=t_fadeMusic;
	this.m_fadeSound=t_fadeSound;
	this.m_allowScreenUpdate=t_allowScreenUpdate;
	if(t_fadeOut){
		this.m_ratio=1.0;
	}else{
		this.m_ratio=0.0;
		if(this.m_fadeMusic){
			bb_framework_diddyGame.p_SetMojoMusicVolume(0.0);
		}
	}
	this.m_counter=0.0;
}
c_ScreenFade.prototype.p_Update2=function(){
	if(!this.m_active){
		return;
	}
	this.m_counter+=1.0*bb_framework_dt.m_delta;
	this.p_CalcRatio();
	if(this.m_fadeSound){
		for(var t_i=0;t_i<=31;t_i=t_i+1){
			bb_audio_SetChannelVolume(t_i,this.m_ratio*((bb_framework_diddyGame.m_soundVolume)/100.0));
		}
	}
	if(this.m_fadeMusic){
		bb_framework_diddyGame.p_SetMojoMusicVolume(this.m_ratio*((bb_framework_diddyGame.m_musicVolume)/100.0));
	}
	if(this.m_counter>this.m_fadeTime){
		bb_framework_diddyGame.p_ResetDelta();
		this.m_active=false;
		if(this.m_fadeOut){
			bb_framework_diddyGame.m_currentScreen.p_PostFadeOut();
		}else{
			bb_framework_diddyGame.m_currentScreen.p_PostFadeIn();
		}
	}
}
function c_GameImage(){
	Object.call(this);
	this.m_image=null;
	this.m_w=0;
	this.m_h=0;
	this.m_preLoad=false;
	this.m_offSetX=0;
	this.m_offSetY=0;
	this.m_screenName="";
	this.m_frames=0;
	this.m_path="";
	this.m_midhandle=false;
	this.m_readPixels=false;
	this.m_maskRed=0;
	this.m_maskGreen=0;
	this.m_maskBlue=0;
	this.m_name="";
	this.m_w2=.0;
	this.m_h2=.0;
	this.m_w4=.0;
	this.m_h4=.0;
	this.m_midhandled=0;
	this.m_pixels=[];
}
c_GameImage.prototype.p_Draw2=function(t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame,t_rounded){
	if(t_rounded){
		bb_graphics_DrawImage2(this.m_image,Math.floor(t_x+0.5),Math.floor(t_y+0.5),t_rotation,t_scaleX,t_scaleY,t_frame);
	}else{
		bb_graphics_DrawImage2(this.m_image,t_x+(this.m_offSetX),t_y+(this.m_offSetY),t_rotation,t_scaleX,t_scaleY,t_frame);
	}
}
c_GameImage.prototype.p_CalcSize=function(){
	if(this.m_image!=null){
		this.m_w=this.m_image.p_Width();
		this.m_h=this.m_image.p_Height();
		this.m_w2=((this.m_w/2)|0);
		this.m_h2=((this.m_h/2)|0);
		this.m_w4=((this.m_w/4)|0);
		this.m_h4=((this.m_h/4)|0);
	}
}
c_GameImage.prototype.p_MidHandle=function(t_midhandle){
	if(t_midhandle){
		this.m_image.p_SetHandle(this.m_w2,this.m_h2);
		this.m_midhandled=1;
	}else{
		this.m_image.p_SetHandle(0.0,0.0);
		this.m_midhandled=0;
	}
}
c_GameImage.prototype.p_MidHandle2=function(){
	return this.m_midhandled==1;
}
c_GameImage.prototype.p_SetMaskColor=function(t_r,t_g,t_b){
	this.m_maskRed=t_r;
	this.m_maskGreen=t_g;
	this.m_maskBlue=t_b;
}
c_GameImage.prototype.p_LoadAnim=function(t_file,t_w,t_h,t_total,t_tmpImage,t_midhandle,t_readPixels,t_maskRed,t_maskGreen,t_maskBlue,t_preLoad,t_screenName){
	this.m_name=bb_functions_StripAll(t_file.toUpperCase());
	this.m_path=t_file;
	this.m_midhandle=t_midhandle;
	this.m_preLoad=t_preLoad;
	this.m_screenName=t_screenName.toUpperCase();
	this.m_w=t_w;
	this.m_h=t_h;
	this.m_frames=t_total;
	if(!t_preLoad){
		this.m_image=bb_functions_LoadAnimBitmap(t_file,t_w,t_h,t_total,t_tmpImage);
		this.p_CalcSize();
		this.p_MidHandle(t_midhandle);
		this.m_pixels=new_number_array(this.m_image.p_Width()*this.m_image.p_Height());
		this.m_readPixels=t_readPixels;
	}
	this.p_SetMaskColor(t_maskRed,t_maskGreen,t_maskBlue);
}
c_GameImage.prototype.p_Load2=function(t_file,t_midhandle,t_readPixels,t_maskRed,t_maskGreen,t_maskBlue,t_preLoad,t_screenName){
	this.m_name=bb_functions_StripAll(t_file.toUpperCase());
	this.m_path=t_file;
	this.m_midhandle=t_midhandle;
	this.m_preLoad=t_preLoad;
	this.m_screenName=t_screenName.toUpperCase();
	if(!t_preLoad){
		this.m_image=bb_functions_LoadBitmap(t_file,0);
		this.p_CalcSize();
		this.p_MidHandle(t_midhandle);
		this.m_pixels=new_number_array(this.m_image.p_Width()*this.m_image.p_Height());
		this.m_readPixels=t_readPixels;
	}
	this.p_SetMaskColor(t_maskRed,t_maskGreen,t_maskBlue);
}
function c_Map3(){
	Object.call(this);
	this.m_root=null;
}
c_Map3.m_new=function(){
	return this;
}
c_Map3.prototype.p_Keys=function(){
	return c_MapKeys2.m_new.call(new c_MapKeys2,this);
}
c_Map3.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
c_Map3.prototype.p_Compare4=function(t_lhs,t_rhs){
}
c_Map3.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare4(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map3.prototype.p_Get=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap3(){
	c_Map3.call(this);
}
c_StringMap3.prototype=extend_class(c_Map3);
c_StringMap3.m_new=function(){
	c_Map3.m_new.call(this);
	return this;
}
c_StringMap3.prototype.p_Compare4=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_ImageBank(){
	c_StringMap3.call(this);
}
c_ImageBank.prototype=extend_class(c_StringMap3);
c_ImageBank.m_new=function(){
	c_StringMap3.m_new.call(this);
	return this;
}
c_ImageBank.prototype.p_Find=function(t_name){
	t_name=t_name.toUpperCase();
	if(bb_framework_diddyGame.m_debugOn){
		var t_=this.p_Keys().p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_key=t_.p_NextObject();
			var t_i=this.p_Get(t_key);
			if(!t_i.m_preLoad){
				print(t_key+" is stored in the image map.");
			}
		}
	}
	var t_i2=this.p_Get(t_name);
	bb_assert_AssertNotNull((t_i2),"Image '"+t_name+"' not found in the ImageBank");
	if(t_i2.m_preLoad && t_i2.m_image==null){
		bb_assert_AssertError("Image '"+t_name+"' not found in the ImageBank");
	}
	return t_i2;
}
function c_GameSound(){
	Object.call(this);
	this.m_preLoad=false;
	this.m_screenName="";
	this.m_path="";
	this.m_sound=null;
	this.m_name="";
}
c_GameSound.prototype.p_Load3=function(t_file,t_preLoad,t_screenName){
	this.m_path=t_file;
	this.m_preLoad=t_preLoad;
	this.m_screenName=t_screenName;
	if(!t_preLoad){
		if((t_file.indexOf(".wav")!=-1) || (t_file.indexOf(".ogg")!=-1) || (t_file.indexOf(".mp3")!=-1) || (t_file.indexOf(".m4a")!=-1) || (t_file.indexOf(".wma")!=-1)){
			this.m_sound=bb_functions_LoadSoundSample(c_SoundBank.m_path+t_file);
		}else{
			this.m_sound=bb_functions_LoadSoundSample(c_SoundBank.m_path+t_file+".wav");
		}
	}
	this.m_name=bb_functions_StripAll(t_file.toUpperCase());
}
function c_Map4(){
	Object.call(this);
	this.m_root=null;
}
c_Map4.m_new=function(){
	return this;
}
c_Map4.prototype.p_Keys=function(){
	return c_MapKeys4.m_new.call(new c_MapKeys4,this);
}
c_Map4.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
c_Map4.prototype.p_Compare4=function(t_lhs,t_rhs){
}
c_Map4.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare4(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map4.prototype.p_Get=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap4(){
	c_Map4.call(this);
}
c_StringMap4.prototype=extend_class(c_Map4);
c_StringMap4.m_new=function(){
	c_Map4.m_new.call(this);
	return this;
}
c_StringMap4.prototype.p_Compare4=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_SoundBank(){
	c_StringMap4.call(this);
}
c_SoundBank.prototype=extend_class(c_StringMap4);
c_SoundBank.m_new=function(){
	c_StringMap4.m_new.call(this);
	return this;
}
c_SoundBank.m_path="";
function c_InputCache(){
	Object.call(this);
	this.m_keyHitEnumerator=null;
	this.m_keyDownEnumerator=null;
	this.m_keyReleasedEnumerator=null;
	this.m_keyHitWrapper=null;
	this.m_keyDownWrapper=null;
	this.m_keyReleasedWrapper=null;
	this.m_touchData=new_object_array(32);
	this.m_monitorTouch=false;
	this.m_monitorMouse=false;
	this.m_touchDownCount=0;
	this.m_touchHitCount=0;
	this.m_touchReleasedCount=0;
	this.m_maxTouchDown=-1;
	this.m_maxTouchHit=-1;
	this.m_maxTouchReleased=-1;
	this.m_minTouchDown=-1;
	this.m_minTouchHit=-1;
	this.m_minTouchReleased=-1;
	this.m_touchHit=new_number_array(32);
	this.m_touchHitTime=new_number_array(32);
	this.m_touchDown=new_number_array(32);
	this.m_touchDownTime=new_number_array(32);
	this.m_touchReleasedTime=new_number_array(32);
	this.m_touchReleased=new_number_array(32);
	this.m_touchX=new_number_array(32);
	this.m_touchY=new_number_array(32);
	this.m_currentTouchDown=new_number_array(32);
	this.m_currentTouchHit=new_number_array(32);
	this.m_currentTouchReleased=new_number_array(32);
	this.m_mouseDownCount=0;
	this.m_mouseHitCount=0;
	this.m_mouseReleasedCount=0;
	this.m_mouseX=0;
	this.m_mouseY=0;
	this.m_mouseHit=new_number_array(3);
	this.m_mouseHitTime=new_number_array(3);
	this.m_mouseDown=new_number_array(3);
	this.m_mouseDownTime=new_number_array(3);
	this.m_mouseReleasedTime=new_number_array(3);
	this.m_mouseReleased=new_number_array(3);
	this.m_currentMouseDown=new_number_array(3);
	this.m_currentMouseHit=new_number_array(3);
	this.m_currentMouseReleased=new_number_array(3);
	this.m_keyDownCount=0;
	this.m_keyHitCount=0;
	this.m_keyReleasedCount=0;
	this.m_monitorKeyCount=0;
	this.m_monitorKey=new_bool_array(512);
	this.m_keyHit=new_number_array(512);
	this.m_keyHitTime=new_number_array(512);
	this.m_keyDown=new_number_array(512);
	this.m_keyDownTime=new_number_array(512);
	this.m_keyReleasedTime=new_number_array(512);
	this.m_keyReleased=new_number_array(512);
	this.m_currentKeysDown=new_number_array(512);
	this.m_currentKeysHit=new_number_array(512);
	this.m_currentKeysReleased=new_number_array(512);
	this.m_flingThreshold=250.0;
	this.m_longPressTime=800;
}
c_InputCache.m_new=function(){
	this.m_keyHitEnumerator=c_KeyEventEnumerator.m_new.call(new c_KeyEventEnumerator,this,3);
	this.m_keyDownEnumerator=c_KeyEventEnumerator.m_new.call(new c_KeyEventEnumerator,this,1);
	this.m_keyReleasedEnumerator=c_KeyEventEnumerator.m_new.call(new c_KeyEventEnumerator,this,2);
	this.m_keyHitWrapper=c_EnumWrapper.m_new.call(new c_EnumWrapper,this.m_keyHitEnumerator);
	this.m_keyDownWrapper=c_EnumWrapper.m_new.call(new c_EnumWrapper,this.m_keyDownEnumerator);
	this.m_keyReleasedWrapper=c_EnumWrapper.m_new.call(new c_EnumWrapper,this.m_keyReleasedEnumerator);
	for(var t_i=0;t_i<this.m_touchData.length;t_i=t_i+1){
		this.m_touchData[t_i]=c_TouchData.m_new.call(new c_TouchData);
	}
	this.m_monitorTouch=false;
	this.m_monitorMouse=true;
	return this;
}
c_InputCache.prototype.p_ReadInput=function(){
	var t_newval=0;
	var t_now=bb_app_Millisecs();
	if(this.m_monitorTouch){
		this.m_touchDownCount=0;
		this.m_touchHitCount=0;
		this.m_touchReleasedCount=0;
		this.m_maxTouchDown=-1;
		this.m_maxTouchHit=-1;
		this.m_maxTouchReleased=-1;
		this.m_minTouchDown=-1;
		this.m_minTouchHit=-1;
		this.m_minTouchReleased=-1;
		for(var t_i=0;t_i<32;t_i=t_i+1){
			t_newval=bb_input_TouchHit(t_i);
			if(!((this.m_touchHit[t_i])!=0) && ((t_newval)!=0)){
				this.m_touchHitTime[t_i]=t_now;
			}
			this.m_touchHit[t_i]=t_newval;
			t_newval=bb_input_TouchDown(t_i);
			if(((t_newval)!=0) && !((this.m_touchDown[t_i])!=0)){
				this.m_touchDownTime[t_i]=t_now;
			}
			if(((this.m_touchDown[t_i])!=0) && !((t_newval)!=0)){
				this.m_touchReleasedTime[t_i]=t_now;
				this.m_touchReleased[t_i]=1;
			}else{
				this.m_touchReleased[t_i]=0;
			}
			this.m_touchDown[t_i]=t_newval;
			this.m_touchX[t_i]=bb_input_TouchX(t_i);
			this.m_touchY[t_i]=bb_input_TouchY(t_i);
			if((this.m_touchDown[t_i])!=0){
				this.m_currentTouchDown[this.m_touchDownCount]=t_i;
				this.m_touchDownCount+=1;
				if(this.m_minTouchDown<0){
					this.m_minTouchDown=t_i;
				}
				this.m_maxTouchDown=t_i;
			}
			if((this.m_touchHit[t_i])!=0){
				this.m_currentTouchHit[this.m_touchHitCount]=t_i;
				this.m_touchHitCount+=1;
				if(this.m_minTouchHit<0){
					this.m_minTouchHit=t_i;
				}
				this.m_maxTouchHit=t_i;
			}
			if((this.m_touchReleased[t_i])!=0){
				this.m_currentTouchReleased[this.m_touchReleasedCount]=t_i;
				this.m_touchReleasedCount+=1;
				if(this.m_minTouchReleased<0){
					this.m_minTouchReleased=t_i;
				}
				this.m_maxTouchReleased=t_i;
			}
		}
	}
	if(this.m_monitorMouse){
		this.m_mouseDownCount=0;
		this.m_mouseHitCount=0;
		this.m_mouseReleasedCount=0;
		this.m_mouseX=bb_framework_diddyGame.m_mouseX;
		this.m_mouseY=bb_framework_diddyGame.m_mouseY;
		for(var t_i2=0;t_i2<3;t_i2=t_i2+1){
			t_newval=bb_input_MouseHit(t_i2);
			if(!((this.m_mouseHit[t_i2])!=0) && ((t_newval)!=0)){
				this.m_mouseHitTime[t_i2]=t_now;
			}
			this.m_mouseHit[t_i2]=t_newval;
			t_newval=bb_input_MouseDown(t_i2);
			if(((t_newval)!=0) && !((this.m_mouseDown[t_i2])!=0)){
				this.m_mouseDownTime[t_i2]=t_now;
			}
			if(((this.m_mouseDown[t_i2])!=0) && !((t_newval)!=0)){
				this.m_mouseReleasedTime[t_i2]=t_now;
				this.m_mouseReleased[t_i2]=1;
			}else{
				this.m_mouseReleased[t_i2]=0;
			}
			this.m_mouseDown[t_i2]=t_newval;
			if((this.m_mouseDown[t_i2])!=0){
				this.m_currentMouseDown[this.m_mouseDownCount]=t_i2;
				this.m_mouseDownCount+=1;
			}
			if((this.m_mouseHit[t_i2])!=0){
				this.m_currentMouseHit[this.m_mouseHitCount]=t_i2;
				this.m_mouseHitCount+=1;
			}
			if((this.m_mouseReleased[t_i2])!=0){
				this.m_currentMouseReleased[this.m_mouseReleasedCount]=t_i2;
				this.m_mouseReleasedCount+=1;
			}
		}
	}
	this.m_keyDownCount=0;
	this.m_keyHitCount=0;
	this.m_keyReleasedCount=0;
	if(this.m_monitorKeyCount>0){
		for(var t_i3=8;t_i3<=222;t_i3=t_i3+1){
			if(this.m_monitorKey[t_i3]){
				t_newval=bb_input_KeyHit(t_i3);
				if(!((this.m_keyHit[t_i3])!=0) && ((t_newval)!=0)){
					this.m_keyHitTime[t_i3]=t_now;
				}
				this.m_keyHit[t_i3]=t_newval;
				t_newval=bb_input_KeyDown(t_i3);
				if(((t_newval)!=0) && !((this.m_keyDown[t_i3])!=0)){
					this.m_keyDownTime[t_i3]=t_now;
				}
				if(((this.m_keyDown[t_i3])!=0) && !((t_newval)!=0)){
					this.m_keyReleasedTime[t_i3]=t_now;
					this.m_keyReleased[t_i3]=1;
				}else{
					this.m_keyReleased[t_i3]=0;
				}
				this.m_keyDown[t_i3]=t_newval;
				if((this.m_keyDown[t_i3])!=0){
					this.m_currentKeysDown[this.m_keyDownCount]=t_i3;
					this.m_keyDownCount+=1;
				}
				if((this.m_keyHit[t_i3])!=0){
					this.m_currentKeysHit[this.m_keyHitCount]=t_i3;
					this.m_keyHitCount+=1;
				}
				if((this.m_keyReleased[t_i3])!=0){
					this.m_currentKeysReleased[this.m_keyReleasedCount]=t_i3;
					this.m_keyReleasedCount+=1;
				}
			}
		}
	}
}
c_InputCache.prototype.p_HandleEvents=function(t_screen){
	for(var t_i=0;t_i<this.m_touchHitCount;t_i=t_i+1){
		var t_pointer=this.m_currentTouchHit[t_i];
		var t_x=((this.m_touchX[t_pointer])|0);
		var t_y=((this.m_touchY[t_pointer])|0);
		this.m_touchData[t_pointer].p_Reset(t_x,t_y);
		t_screen.p_OnTouchHit(t_x,t_y,t_pointer);
	}
	for(var t_i2=0;t_i2<this.m_touchReleasedCount;t_i2=t_i2+1){
		var t_pointer2=this.m_currentTouchReleased[t_i2];
		var t_x2=((this.m_touchX[t_pointer2])|0);
		var t_y2=((this.m_touchY[t_pointer2])|0);
		this.m_touchData[t_pointer2].p_Update3(t_x2,t_y2);
		if(!this.m_touchData[t_pointer2].m_movedTooFar && !this.m_touchData[t_pointer2].m_firedLongPress){
			t_screen.p_OnTouchClick(t_x2,t_y2,t_pointer2);
		}else{
			if(this.m_touchData[t_pointer2].m_touchVelocityX*this.m_touchData[t_pointer2].m_touchVelocityX+this.m_touchData[t_pointer2].m_touchVelocityY*this.m_touchData[t_pointer2].m_touchVelocityY>=this.m_flingThreshold*this.m_flingThreshold){
				t_screen.p_OnTouchFling(t_x2,t_y2,this.m_touchData[t_pointer2].m_touchVelocityX,this.m_touchData[t_pointer2].m_touchVelocityY,this.m_touchData[t_pointer2].m_touchVelocitySpeed,t_pointer2);
			}
		}
		t_screen.p_OnTouchReleased(t_x2,t_y2,t_pointer2);
	}
	for(var t_i3=0;t_i3<this.m_touchDownCount;t_i3=t_i3+1){
		var t_pointer3=this.m_currentTouchDown[t_i3];
		var t_x3=((this.m_touchX[t_pointer3])|0);
		var t_y3=((this.m_touchY[t_pointer3])|0);
		this.m_touchData[t_pointer3].p_Update3(t_x3,t_y3);
		t_screen.p_OnTouchDragged(t_x3,t_y3,this.m_touchData[t_pointer3].m_distanceMovedX,this.m_touchData[t_pointer3].m_distanceMovedY,t_pointer3);
		if(!this.m_touchData[t_pointer3].m_testedLongPress && bb_framework_dt.m_currentticks-(this.m_touchData[t_pointer3].m_firstTouchTime)>=(this.m_longPressTime)){
			this.m_touchData[t_pointer3].m_testedLongPress=true;
			if(!this.m_touchData[t_pointer3].m_movedTooFar){
				t_screen.p_OnTouchLongPress(t_x3,t_y3,t_pointer3);
				this.m_touchData[t_pointer3].m_firedLongPress=true;
			}
		}
	}
	if(this.m_keyHitCount>0){
		t_screen.p_OnAnyKeyHit();
	}
	for(var t_i4=0;t_i4<this.m_keyHitCount;t_i4=t_i4+1){
		var t_key=this.m_currentKeysHit[t_i4];
		t_screen.p_OnKeyHit(t_key);
	}
	if(this.m_keyDownCount>0){
		t_screen.p_OnAnyKeyDown();
	}
	for(var t_i5=0;t_i5<this.m_keyDownCount;t_i5=t_i5+1){
		var t_key2=this.m_currentKeysDown[t_i5];
		t_screen.p_OnKeyDown(t_key2);
	}
	if(this.m_keyReleasedCount>0){
		t_screen.p_OnAnyKeyReleased();
	}
	for(var t_i6=0;t_i6<this.m_keyReleasedCount;t_i6=t_i6+1){
		var t_key3=this.m_currentKeysReleased[t_i6];
		t_screen.p_OnKeyReleased(t_key3);
	}
	for(var t_i7=0;t_i7<this.m_mouseHitCount;t_i7=t_i7+1){
		var t_button=this.m_currentMouseHit[t_i7];
		var t_x4=this.m_mouseX;
		var t_y4=this.m_mouseY;
		t_screen.p_OnMouseHit(t_x4,t_y4,t_button);
	}
	for(var t_i8=0;t_i8<this.m_mouseDownCount;t_i8=t_i8+1){
		var t_button2=this.m_currentMouseDown[t_i8];
		var t_x5=this.m_mouseX;
		var t_y5=this.m_mouseY;
		t_screen.p_OnMouseDown(t_x5,t_y5,t_button2);
	}
	for(var t_i9=0;t_i9<this.m_mouseReleasedCount;t_i9=t_i9+1){
		var t_button3=this.m_currentMouseReleased[t_i9];
		var t_x6=this.m_mouseX;
		var t_y6=this.m_mouseY;
		t_screen.p_OnMouseReleased(t_x6,t_y6,t_button3);
	}
}
function c_InputEventEnumerator(){
	Object.call(this);
	this.m_ic=null;
	this.m_eventType=0;
}
c_InputEventEnumerator.m_new=function(t_ic,t_eventType){
	this.m_ic=t_ic;
	this.m_eventType=t_eventType;
	return this;
}
c_InputEventEnumerator.m_new2=function(){
	return this;
}
function c_KeyEventEnumerator(){
	c_InputEventEnumerator.call(this);
	this.m_event=null;
}
c_KeyEventEnumerator.prototype=extend_class(c_InputEventEnumerator);
c_KeyEventEnumerator.m_new=function(t_ic,t_eventType){
	c_InputEventEnumerator.m_new.call(this,t_ic,t_eventType);
	this.m_event=c_KeyEvent.m_new2.call(new c_KeyEvent);
	return this;
}
c_KeyEventEnumerator.m_new2=function(){
	c_InputEventEnumerator.m_new2.call(this);
	return this;
}
function c_InputEvent(){
	Object.call(this);
	this.m_eventType=0;
}
c_InputEvent.m_new=function(t_eventType){
	this.m_eventType=t_eventType;
	return this;
}
c_InputEvent.m_new2=function(){
	return this;
}
function c_KeyEvent(){
	c_InputEvent.call(this);
}
c_KeyEvent.prototype=extend_class(c_InputEvent);
c_KeyEvent.m_new=function(t_eventType){
	c_InputEvent.m_new.call(this,t_eventType);
	return this;
}
c_KeyEvent.m_new2=function(){
	c_InputEvent.m_new2.call(this);
	return this;
}
function c_EnumWrapper(){
	Object.call(this);
	this.m_wrappedEnum=null;
}
c_EnumWrapper.m_new=function(t_wrappedEnum){
	this.m_wrappedEnum=t_wrappedEnum;
	return this;
}
c_EnumWrapper.m_new2=function(){
	return this;
}
function c_TouchData(){
	Object.call(this);
	this.m_firstTouchX=0;
	this.m_firstTouchY=0;
	this.m_lastTouchX=0;
	this.m_lastTouchY=0;
	this.m_firstTouchTime=0;
	this.m_testedLongPress=false;
	this.m_firedLongPress=false;
	this.m_flingSamplesX=new_number_array(10);
	this.m_flingSamplesY=new_number_array(10);
	this.m_flingSamplesTime=new_number_array(10);
	this.m_flingSampleCount=0;
	this.m_flingSampleNext=0;
	this.m_movedTooFar=false;
	this.m_touchVelocityX=.0;
	this.m_touchVelocityY=.0;
	this.m_touchVelocitySpeed=.0;
	this.m_distanceMovedX=0;
	this.m_distanceMovedY=0;
}
c_TouchData.m_new=function(){
	return this;
}
c_TouchData.prototype.p_AddFlingSample=function(t_x,t_y){
	this.m_flingSamplesX[this.m_flingSampleNext]=t_x;
	this.m_flingSamplesY[this.m_flingSampleNext]=t_y;
	this.m_flingSamplesTime[this.m_flingSampleNext]=((bb_framework_dt.m_currentticks)|0);
	if(this.m_flingSampleCount<10){
		this.m_flingSampleCount+=1;
	}
	this.m_flingSampleNext+=1;
	if(this.m_flingSampleNext>=10){
		this.m_flingSampleNext=0;
	}
	var t_first=this.m_flingSampleNext-this.m_flingSampleCount;
	var t_last=this.m_flingSampleNext-1;
	while(t_first<0){
		t_first+=10;
	}
	while(t_last<0){
		t_last+=10;
	}
	if(this.m_flingSampleCount>0){
		var t_secs=(this.m_flingSamplesTime[t_last]-this.m_flingSamplesTime[t_first])/1000.0;
		this.m_touchVelocityX=(this.m_flingSamplesX[t_last]-this.m_flingSamplesX[t_first])/t_secs;
		this.m_touchVelocityY=(this.m_flingSamplesY[t_last]-this.m_flingSamplesY[t_first])/t_secs;
		this.m_touchVelocitySpeed=Math.sqrt(this.m_touchVelocityX*this.m_touchVelocityX+this.m_touchVelocityY*this.m_touchVelocityY);
	}
}
c_TouchData.prototype.p_Reset=function(t_x,t_y){
	this.m_firstTouchX=t_x;
	this.m_firstTouchY=t_y;
	this.m_lastTouchX=t_x;
	this.m_lastTouchY=t_y;
	this.m_firstTouchTime=((bb_framework_dt.m_currentticks)|0);
	this.m_testedLongPress=false;
	this.m_firedLongPress=false;
	for(var t_i=0;t_i<10;t_i=t_i+1){
		this.m_flingSamplesX[t_i]=0;
		this.m_flingSamplesY[t_i]=0;
		this.m_flingSamplesTime[t_i]=0;
	}
	this.m_flingSampleCount=0;
	this.m_flingSampleNext=0;
	this.m_movedTooFar=false;
	this.m_touchVelocityX=0.0;
	this.m_touchVelocityY=0.0;
	this.m_touchVelocitySpeed=0.0;
	this.p_AddFlingSample(t_x,t_y);
}
c_TouchData.prototype.p_Update3=function(t_x,t_y){
	this.m_distanceMovedX=t_x-this.m_lastTouchX;
	this.m_distanceMovedY=t_y-this.m_lastTouchY;
	this.m_lastTouchX=t_x;
	this.m_lastTouchY=t_y;
	this.p_AddFlingSample(t_x,t_y);
	if(!this.m_movedTooFar){
		var t_dx=t_x-this.m_firstTouchX;
		var t_dy=t_y-this.m_firstTouchY;
		if((t_dx*t_dx+t_dy*t_dy)>3600.0){
			this.m_movedTooFar=true;
		}
	}
}
function c_DiddyMouse(){
	Object.call(this);
	this.m_lastX=0;
	this.m_lastY=0;
}
c_DiddyMouse.m_new=function(){
	diddy.mouseZInit();
	return this;
}
c_DiddyMouse.prototype.p_Update2=function(){
	this.m_lastX=bb_framework_diddyGame.m_mouseX;
	this.m_lastY=bb_framework_diddyGame.m_mouseY;
}
function bbMain(){
	c_MyApp.m_new.call(new c_MyApp);
	return 0;
}
function c_ConstInfo(){
	Object.call(this);
}
function c_Stack(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack.m_new=function(){
	return this;
}
c_Stack.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack.prototype.p_Push=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack.prototype.p_Push2=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push(t_values[t_offset+t_i]);
	}
}
c_Stack.prototype.p_Push3=function(t_values,t_offset){
	this.p_Push2(t_values,t_offset,t_values.length-t_offset);
}
c_Stack.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_FieldInfo(){
	Object.call(this);
	this.m__name="";
	this.m__attrs=0;
	this.m__type=null;
}
c_FieldInfo.m_new=function(t_name,t_attrs,t_type){
	this.m__name=t_name;
	this.m__attrs=t_attrs;
	this.m__type=t_type;
	return this;
}
c_FieldInfo.m_new2=function(){
	return this;
}
function c_Stack2(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack2.m_new=function(){
	return this;
}
c_Stack2.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack2.prototype.p_Push4=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack2.prototype.p_Push5=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push4(t_values[t_offset+t_i]);
	}
}
c_Stack2.prototype.p_Push6=function(t_values,t_offset){
	this.p_Push5(t_values,t_offset,t_values.length-t_offset);
}
c_Stack2.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_GlobalInfo(){
	Object.call(this);
}
function c_Stack3(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack3.m_new=function(){
	return this;
}
c_Stack3.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack3.prototype.p_Push7=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack3.prototype.p_Push8=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push7(t_values[t_offset+t_i]);
	}
}
c_Stack3.prototype.p_Push9=function(t_values,t_offset){
	this.p_Push8(t_values,t_offset,t_values.length-t_offset);
}
c_Stack3.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_MethodInfo(){
	Object.call(this);
	this.m__name="";
	this.m__attrs=0;
	this.m__retType=null;
	this.m__argTypes=[];
}
c_MethodInfo.m_new=function(t_name,t_attrs,t_retType,t_argTypes){
	this.m__name=t_name;
	this.m__attrs=t_attrs;
	this.m__retType=t_retType;
	this.m__argTypes=t_argTypes;
	return this;
}
c_MethodInfo.m_new2=function(){
	return this;
}
function c_Stack4(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack4.m_new=function(){
	return this;
}
c_Stack4.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack4.prototype.p_Push10=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack4.prototype.p_Push11=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push10(t_values[t_offset+t_i]);
	}
}
c_Stack4.prototype.p_Push12=function(t_values,t_offset){
	this.p_Push11(t_values,t_offset,t_values.length-t_offset);
}
c_Stack4.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_Stack5(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack5.m_new=function(){
	return this;
}
c_Stack5.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack5.prototype.p_Push13=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack5.prototype.p_Push14=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push13(t_values[t_offset+t_i]);
	}
}
c_Stack5.prototype.p_Push15=function(t_values,t_offset){
	this.p_Push14(t_values,t_offset,t_values.length-t_offset);
}
c_Stack5.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_R18(){
	c_FieldInfo.call(this);
}
c_R18.prototype=extend_class(c_FieldInfo);
c_R18.m_new=function(){
	c_FieldInfo.m_new.call(this,"value",0,bb_reflection__boolClass);
	return this;
}
function c_R20(){
	c_MethodInfo.call(this);
}
c_R20.prototype=extend_class(c_MethodInfo);
c_R20.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToBool",0,bb_reflection__boolClass,[]);
	return this;
}
function c_R21(){
	c_MethodInfo.call(this);
}
c_R21.prototype=extend_class(c_MethodInfo);
c_R21.m_new=function(){
	c_MethodInfo.m_new.call(this,"Equals",0,bb_reflection__boolClass,[bb_reflection__classes[1]]);
	return this;
}
function c_R19(){
	c_FunctionInfo.call(this);
}
c_R19.prototype=extend_class(c_FunctionInfo);
c_R19.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[1],[bb_reflection__boolClass]);
	return this;
}
function c_R22(){
	c_FunctionInfo.call(this);
}
c_R22.prototype=extend_class(c_FunctionInfo);
c_R22.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[1],[]);
	return this;
}
function c_R24(){
	c_FieldInfo.call(this);
}
c_R24.prototype=extend_class(c_FieldInfo);
c_R24.m_new=function(){
	c_FieldInfo.m_new.call(this,"value",0,bb_reflection__intClass);
	return this;
}
function c_R27(){
	c_MethodInfo.call(this);
}
c_R27.prototype=extend_class(c_MethodInfo);
c_R27.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToInt",0,bb_reflection__intClass,[]);
	return this;
}
function c_R28(){
	c_MethodInfo.call(this);
}
c_R28.prototype=extend_class(c_MethodInfo);
c_R28.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToFloat",0,bb_reflection__floatClass,[]);
	return this;
}
function c_R29(){
	c_MethodInfo.call(this);
}
c_R29.prototype=extend_class(c_MethodInfo);
c_R29.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToString",0,bb_reflection__stringClass,[]);
	return this;
}
function c_R30(){
	c_MethodInfo.call(this);
}
c_R30.prototype=extend_class(c_MethodInfo);
c_R30.m_new=function(){
	c_MethodInfo.m_new.call(this,"Equals",0,bb_reflection__boolClass,[bb_reflection__classes[2]]);
	return this;
}
function c_R31(){
	c_MethodInfo.call(this);
}
c_R31.prototype=extend_class(c_MethodInfo);
c_R31.m_new=function(){
	c_MethodInfo.m_new.call(this,"Compare",0,bb_reflection__intClass,[bb_reflection__classes[2]]);
	return this;
}
function c_R25(){
	c_FunctionInfo.call(this);
}
c_R25.prototype=extend_class(c_FunctionInfo);
c_R25.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[2],[bb_reflection__intClass]);
	return this;
}
function c_R26(){
	c_FunctionInfo.call(this);
}
c_R26.prototype=extend_class(c_FunctionInfo);
c_R26.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[2],[bb_reflection__floatClass]);
	return this;
}
function c_R32(){
	c_FunctionInfo.call(this);
}
c_R32.prototype=extend_class(c_FunctionInfo);
c_R32.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[2],[]);
	return this;
}
function c_R34(){
	c_FieldInfo.call(this);
}
c_R34.prototype=extend_class(c_FieldInfo);
c_R34.m_new=function(){
	c_FieldInfo.m_new.call(this,"value",0,bb_reflection__floatClass);
	return this;
}
function c_R37(){
	c_MethodInfo.call(this);
}
c_R37.prototype=extend_class(c_MethodInfo);
c_R37.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToInt",0,bb_reflection__intClass,[]);
	return this;
}
function c_R38(){
	c_MethodInfo.call(this);
}
c_R38.prototype=extend_class(c_MethodInfo);
c_R38.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToFloat",0,bb_reflection__floatClass,[]);
	return this;
}
function c_R39(){
	c_MethodInfo.call(this);
}
c_R39.prototype=extend_class(c_MethodInfo);
c_R39.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToString",0,bb_reflection__stringClass,[]);
	return this;
}
function c_R40(){
	c_MethodInfo.call(this);
}
c_R40.prototype=extend_class(c_MethodInfo);
c_R40.m_new=function(){
	c_MethodInfo.m_new.call(this,"Equals",0,bb_reflection__boolClass,[bb_reflection__classes[3]]);
	return this;
}
function c_R41(){
	c_MethodInfo.call(this);
}
c_R41.prototype=extend_class(c_MethodInfo);
c_R41.m_new=function(){
	c_MethodInfo.m_new.call(this,"Compare",0,bb_reflection__intClass,[bb_reflection__classes[3]]);
	return this;
}
function c_R35(){
	c_FunctionInfo.call(this);
}
c_R35.prototype=extend_class(c_FunctionInfo);
c_R35.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[3],[bb_reflection__intClass]);
	return this;
}
function c_R36(){
	c_FunctionInfo.call(this);
}
c_R36.prototype=extend_class(c_FunctionInfo);
c_R36.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[3],[bb_reflection__floatClass]);
	return this;
}
function c_R42(){
	c_FunctionInfo.call(this);
}
c_R42.prototype=extend_class(c_FunctionInfo);
c_R42.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[3],[]);
	return this;
}
function c_R44(){
	c_FieldInfo.call(this);
}
c_R44.prototype=extend_class(c_FieldInfo);
c_R44.m_new=function(){
	c_FieldInfo.m_new.call(this,"value",0,bb_reflection__stringClass);
	return this;
}
function c_R48(){
	c_MethodInfo.call(this);
}
c_R48.prototype=extend_class(c_MethodInfo);
c_R48.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToString",0,bb_reflection__stringClass,[]);
	return this;
}
function c_R49(){
	c_MethodInfo.call(this);
}
c_R49.prototype=extend_class(c_MethodInfo);
c_R49.m_new=function(){
	c_MethodInfo.m_new.call(this,"Equals",0,bb_reflection__boolClass,[bb_reflection__classes[4]]);
	return this;
}
function c_R50(){
	c_MethodInfo.call(this);
}
c_R50.prototype=extend_class(c_MethodInfo);
c_R50.m_new=function(){
	c_MethodInfo.m_new.call(this,"Compare",0,bb_reflection__intClass,[bb_reflection__classes[4]]);
	return this;
}
function c_R45(){
	c_FunctionInfo.call(this);
}
c_R45.prototype=extend_class(c_FunctionInfo);
c_R45.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[4],[bb_reflection__intClass]);
	return this;
}
function c_R46(){
	c_FunctionInfo.call(this);
}
c_R46.prototype=extend_class(c_FunctionInfo);
c_R46.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[4],[bb_reflection__floatClass]);
	return this;
}
function c_R47(){
	c_FunctionInfo.call(this);
}
c_R47.prototype=extend_class(c_FunctionInfo);
c_R47.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[4],[bb_reflection__stringClass]);
	return this;
}
function c_R51(){
	c_FunctionInfo.call(this);
}
c_R51.prototype=extend_class(c_FunctionInfo);
c_R51.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[4],[]);
	return this;
}
function c_R54(){
	c_FieldInfo.call(this);
}
c_R54.prototype=extend_class(c_FieldInfo);
c_R54.m_new=function(){
	c_FieldInfo.m_new.call(this,"message",2,bb_reflection__stringClass);
	return this;
}
function c_R55(){
	c_FieldInfo.call(this);
}
c_R55.prototype=extend_class(c_FieldInfo);
c_R55.m_new=function(){
	c_FieldInfo.m_new.call(this,"cause",2,bb_reflection__classes[5]);
	return this;
}
function c_R56(){
	c_FieldInfo.call(this);
}
c_R56.prototype=extend_class(c_FieldInfo);
c_R56.m_new=function(){
	c_FieldInfo.m_new.call(this,"type",2,bb_reflection__stringClass);
	return this;
}
function c_R57(){
	c_FieldInfo.call(this);
}
c_R57.prototype=extend_class(c_FieldInfo);
c_R57.m_new=function(){
	c_FieldInfo.m_new.call(this,"fullType",2,bb_reflection__stringClass);
	return this;
}
function c_R58(){
	c_MethodInfo.call(this);
}
c_R58.prototype=extend_class(c_MethodInfo);
c_R58.m_new=function(){
	c_MethodInfo.m_new.call(this,"Message",8,bb_reflection__stringClass,[]);
	return this;
}
function c_R59(){
	c_MethodInfo.call(this);
}
c_R59.prototype=extend_class(c_MethodInfo);
c_R59.m_new=function(){
	c_MethodInfo.m_new.call(this,"Message",8,null,[bb_reflection__stringClass]);
	return this;
}
function c_R60(){
	c_MethodInfo.call(this);
}
c_R60.prototype=extend_class(c_MethodInfo);
c_R60.m_new=function(){
	c_MethodInfo.m_new.call(this,"Cause",8,bb_reflection__classes[5],[]);
	return this;
}
function c_R61(){
	c_MethodInfo.call(this);
}
c_R61.prototype=extend_class(c_MethodInfo);
c_R61.m_new=function(){
	c_MethodInfo.m_new.call(this,"Cause",8,null,[bb_reflection__classes[5]]);
	return this;
}
function c_R62(){
	c_MethodInfo.call(this);
}
c_R62.prototype=extend_class(c_MethodInfo);
c_R62.m_new=function(){
	c_MethodInfo.m_new.call(this,"Type",8,bb_reflection__stringClass,[]);
	return this;
}
function c_R63(){
	c_MethodInfo.call(this);
}
c_R63.prototype=extend_class(c_MethodInfo);
c_R63.m_new=function(){
	c_MethodInfo.m_new.call(this,"FullType",8,bb_reflection__stringClass,[]);
	return this;
}
function c_R65(){
	c_MethodInfo.call(this);
}
c_R65.prototype=extend_class(c_MethodInfo);
c_R65.m_new=function(){
	c_MethodInfo.m_new.call(this,"ToString",0,bb_reflection__stringClass,[bb_reflection__boolClass]);
	return this;
}
function c_R64(){
	c_FunctionInfo.call(this);
}
c_R64.prototype=extend_class(c_FunctionInfo);
c_R64.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[6],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R67(){
	c_FunctionInfo.call(this);
}
c_R67.prototype=extend_class(c_FunctionInfo);
c_R67.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[7],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R69(){
	c_FunctionInfo.call(this);
}
c_R69.prototype=extend_class(c_FunctionInfo);
c_R69.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[8],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R71(){
	c_FunctionInfo.call(this);
}
c_R71.prototype=extend_class(c_FunctionInfo);
c_R71.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[9],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R73(){
	c_FunctionInfo.call(this);
}
c_R73.prototype=extend_class(c_FunctionInfo);
c_R73.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[10],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R75(){
	c_FunctionInfo.call(this);
}
c_R75.prototype=extend_class(c_FunctionInfo);
c_R75.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[11],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R77(){
	c_FunctionInfo.call(this);
}
c_R77.prototype=extend_class(c_FunctionInfo);
c_R77.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[12],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_R79(){
	c_FunctionInfo.call(this);
}
c_R79.prototype=extend_class(c_FunctionInfo);
c_R79.m_new=function(){
	c_FunctionInfo.m_new.call(this,"new",0,bb_reflection__classes[13],[bb_reflection__stringClass,bb_reflection__classes[5]]);
	return this;
}
function c_UnknownClass(){
	c_ClassInfo.call(this);
}
c_UnknownClass.prototype=extend_class(c_ClassInfo);
c_UnknownClass.m_new=function(){
	c_ClassInfo.m_new.call(this,"?",0,null,[]);
	return this;
}
var bb_reflection__unknownClass=null;
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	bb_graphics_device=t_dev;
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	this.m_tx=t_tx;
	this.m_ty=t_ty;
	this.m_flags=this.m_flags&-2;
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	this.m_flags=t_iflags;
	if((this.m_flags&2)!=0){
		var t_=this.m_frames;
		var t_2=0;
		while(t_2<t_.length){
			var t_f=t_[t_2];
			t_2=t_2+1;
			t_f.m_x+=1;
		}
		this.m_width-=2;
	}
	if((this.m_flags&4)!=0){
		var t_3=this.m_frames;
		var t_4=0;
		while(t_4<t_3.length){
			var t_f2=t_3[t_4];
			t_4=t_4+1;
			t_f2.m_y+=1;
		}
		this.m_height-=2;
	}
	if((this.m_flags&1)!=0){
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	if(this.m_frames.length==1 && this.m_frames[0].m_x==0 && this.m_frames[0].m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		this.m_flags|=65536;
	}
	return 0;
}
c_Image.prototype.p_Init2=function(t_surf,t_nframes,t_iflags){
	if((this.m_surface)!=null){
		error("Image already initialized");
	}
	this.m_surface=t_surf;
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	this.m_height=this.m_surface.Height();
	this.m_frames=new_object_array(t_nframes);
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0);
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_Init3=function(t_surf,t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_src,t_srcx,t_srcy,t_srcw,t_srch){
	if((this.m_surface)!=null){
		error("Image already initialized");
	}
	this.m_surface=t_surf;
	this.m_source=t_src;
	this.m_width=t_iwidth;
	this.m_height=t_iheight;
	this.m_frames=new_object_array(t_nframes);
	var t_ix=t_x;
	var t_iy=t_y;
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		if(t_ix+this.m_width>t_srcw){
			t_ix=0;
			t_iy+=this.m_height;
		}
		if(t_ix+this.m_width>t_srcw || t_iy+this.m_height>t_srch){
			error("Image frame outside surface");
		}
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_ix+t_srcx,t_iy+t_srcy);
		t_ix+=this.m_width;
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_HandleX=function(){
	return this.m_tx;
}
c_Image.prototype.p_HandleY=function(){
	return this.m_ty;
}
c_Image.prototype.p_Width=function(){
	return this.m_width;
}
c_Image.prototype.p_Height=function(){
	return this.m_height;
}
c_Image.prototype.p_Frames=function(){
	return this.m_frames.length;
}
c_Image.prototype.p_GrabImage=function(t_x,t_y,t_width,t_height,t_nframes,t_flags){
	if(this.m_frames.length!=1){
		return null;
	}
	return (c_Image.m_new.call(new c_Image)).p_Init3(this.m_surface,t_x,t_y,t_width,t_height,t_nframes,t_flags,this,this.m_frames[0].m_x,this.m_frames[0].m_y,this.m_width,this.m_height);
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	if((this.m_matDirty)!=0){
		bb_graphics_renderDevice.SetMatrix(bb_graphics_context.m_ix,bb_graphics_context.m_iy,bb_graphics_context.m_jx,bb_graphics_context.m_jy,bb_graphics_context.m_tx,bb_graphics_context.m_ty);
		this.m_matDirty=0;
	}
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	var t_i=t_path.indexOf(":/",0);
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		return t_path;
	}
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		return t_path;
	}
	return "monkey://data/"+t_path;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	this.m_x=t_x;
	this.m_y=t_y;
	return this;
}
c_Frame.m_new2=function(){
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init2(t_surf,t_frameCount,t_flags);
	}
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init3(t_surf,0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags,null,0,0,t_surf.Width(),t_surf.Height());
	}
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	if(!((t_font)!=null)){
		if(!((bb_graphics_context.m_defaultFont)!=null)){
			bb_graphics_context.m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		t_font=bb_graphics_context.m_defaultFont;
		t_firstChar=32;
	}
	bb_graphics_context.m_font=t_font;
	bb_graphics_context.m_firstChar=t_firstChar;
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	bb_audio_device=t_dev;
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		this.m__joyStates[t_i]=c_JoyState.m_new.call(new c_JoyState);
	}
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		return;
	}
	this.m__keyHit[t_key]+=1;
	this.m__keyHitQueue[this.m__keyHitPut]=t_key;
	this.m__keyHitPut+=1;
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		var t_state=this.m__joyStates[t_i];
		if(!BBGame.Game().PollJoystick(t_i,t_state.m_joyx,t_state.m_joyy,t_state.m_joyz,t_state.m_buttons)){
			break;
		}
		for(var t_j=0;t_j<32;t_j=t_j+1){
			var t_key=256+t_i*32+t_j;
			if(t_state.m_buttons[t_j]){
				if(!this.m__keyDown[t_key]){
					this.m__keyDown[t_key]=true;
					this.p_PutKeyHit(t_key);
				}
			}else{
				this.m__keyDown[t_key]=false;
			}
		}
	}
}
c_InputDevice.prototype.p_EndUpdate=function(){
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		this.m__keyHit[this.m__keyHitQueue[t_i]]=0;
	}
	this.m__keyHitPut=0;
	this.m__charGet=0;
	this.m__charPut=0;
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	var t_1=t_event;
	if(t_1==1){
		if(!this.m__keyDown[t_data]){
			this.m__keyDown[t_data]=true;
			this.p_PutKeyHit(t_data);
			if(t_data==1){
				this.m__keyDown[384]=true;
				this.p_PutKeyHit(384);
			}else{
				if(t_data==384){
					this.m__keyDown[1]=true;
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		if(t_1==2){
			if(this.m__keyDown[t_data]){
				this.m__keyDown[t_data]=false;
				if(t_data==1){
					this.m__keyDown[384]=false;
				}else{
					if(t_data==384){
						this.m__keyDown[1]=false;
					}
				}
			}
		}else{
			if(t_1==3){
				if(this.m__charPut<this.m__charQueue.length){
					this.m__charQueue[this.m__charPut]=t_data;
					this.m__charPut+=1;
				}
			}
		}
	}
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	var t_2=t_event;
	if(t_2==4){
		this.p_KeyEvent(1,1+t_data);
	}else{
		if(t_2==5){
			this.p_KeyEvent(2,1+t_data);
			return;
		}else{
			if(t_2==6){
			}else{
				return;
			}
		}
	}
	this.m__mouseX=t_x;
	this.m__mouseY=t_y;
	this.m__touchX[0]=t_x;
	this.m__touchY[0]=t_y;
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	var t_3=t_event;
	if(t_3==7){
		this.p_KeyEvent(1,384+t_data);
	}else{
		if(t_3==8){
			this.p_KeyEvent(2,384+t_data);
			return;
		}else{
			if(t_3==9){
			}else{
				return;
			}
		}
	}
	this.m__touchX[t_data]=t_x;
	this.m__touchY[t_data]=t_y;
	if(t_data==0){
		this.m__mouseX=t_x;
		this.m__mouseY=t_y;
	}
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	var t_4=t_event;
	if(t_4==10){
	}else{
		return;
	}
	this.m__accelX=t_x;
	this.m__accelY=t_y;
	this.m__accelZ=t_z;
}
c_InputDevice.prototype.p_MouseX=function(){
	return this.m__mouseX;
}
c_InputDevice.prototype.p_MouseY=function(){
	return this.m__mouseY;
}
c_InputDevice.prototype.p_KeyHit=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyHit[t_key];
	}
	return 0;
}
c_InputDevice.prototype.p_KeyDown=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyDown[t_key];
	}
	return false;
}
c_InputDevice.prototype.p_TouchX=function(t_index){
	if(t_index>=0 && t_index<32){
		return this.m__touchX[t_index];
	}
	return 0.0;
}
c_InputDevice.prototype.p_TouchY=function(t_index){
	if(t_index>=0 && t_index<32){
		return this.m__touchY[t_index];
	}
	return 0.0;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	bb_input_device=t_dev;
	return 0;
}
var bb_app__devWidth=0;
var bb_app__devHeight=0;
function bb_app_ValidateDeviceWindow(t_notifyApp){
	var t_w=bb_app__game.GetDeviceWidth();
	var t_h=bb_app__game.GetDeviceHeight();
	if(t_w==bb_app__devWidth && t_h==bb_app__devHeight){
		return;
	}
	bb_app__devWidth=t_w;
	bb_app__devHeight=t_h;
	if(t_notifyApp){
		bb_app__app.p_OnResize();
	}
}
function c_DisplayMode(){
	Object.call(this);
	this.m__width=0;
	this.m__height=0;
}
c_DisplayMode.m_new=function(t_width,t_height){
	this.m__width=t_width;
	this.m__height=t_height;
	return this;
}
c_DisplayMode.m_new2=function(){
	return this;
}
function c_Map5(){
	Object.call(this);
	this.m_root=null;
}
c_Map5.m_new=function(){
	return this;
}
c_Map5.prototype.p_Compare5=function(t_lhs,t_rhs){
}
c_Map5.prototype.p_FindNode2=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare5(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map5.prototype.p_Contains2=function(t_key){
	return this.p_FindNode2(t_key)!=null;
}
c_Map5.prototype.p_RotateLeft3=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map5.prototype.p_RotateRight3=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map5.prototype.p_InsertFixup3=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft3(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight3(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight3(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft3(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map5.prototype.p_Set3=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare5(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node2.m_new.call(new c_Node2,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup3(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map5.prototype.p_Insert=function(t_key,t_value){
	return this.p_Set3(t_key,t_value);
}
function c_IntMap(){
	c_Map5.call(this);
}
c_IntMap.prototype=extend_class(c_Map5);
c_IntMap.m_new=function(){
	c_Map5.m_new.call(this);
	return this;
}
c_IntMap.prototype.p_Compare5=function(t_lhs,t_rhs){
	return t_lhs-t_rhs;
}
function c_Stack6(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack6.m_new=function(){
	return this;
}
c_Stack6.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack6.prototype.p_Push16=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack6.prototype.p_Push17=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push16(t_values[t_offset+t_i]);
	}
}
c_Stack6.prototype.p_Push18=function(t_values,t_offset){
	this.p_Push17(t_values,t_offset,t_values.length-t_offset);
}
c_Stack6.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_Node2(){
	Object.call(this);
	this.m_key=0;
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node2.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node2.m_new2=function(){
	return this;
}
var bb_app__displayModes=[];
var bb_app__desktopMode=null;
function bb_app_DeviceWidth(){
	return bb_app__devWidth;
}
function bb_app_DeviceHeight(){
	return bb_app__devHeight;
}
function bb_app_EnumDisplayModes(){
	var t_modes=bb_app__game.GetDisplayModes();
	var t_mmap=c_IntMap.m_new.call(new c_IntMap);
	var t_mstack=c_Stack6.m_new.call(new c_Stack6);
	for(var t_i=0;t_i<t_modes.length;t_i=t_i+1){
		var t_w=t_modes[t_i].width;
		var t_h=t_modes[t_i].height;
		var t_size=t_w<<16|t_h;
		if(t_mmap.p_Contains2(t_size)){
		}else{
			var t_mode=c_DisplayMode.m_new.call(new c_DisplayMode,t_modes[t_i].width,t_modes[t_i].height);
			t_mmap.p_Insert(t_size,t_mode);
			t_mstack.p_Push16(t_mode);
		}
	}
	bb_app__displayModes=t_mstack.p_ToArray();
	var t_mode2=bb_app__game.GetDesktopMode();
	if((t_mode2)!=null){
		bb_app__desktopMode=c_DisplayMode.m_new.call(new c_DisplayMode,t_mode2.width,t_mode2.height);
	}else{
		bb_app__desktopMode=c_DisplayMode.m_new.call(new c_DisplayMode,bb_app_DeviceWidth(),bb_app_DeviceHeight());
	}
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	bb_graphics_context.m_ix=t_ix;
	bb_graphics_context.m_iy=t_iy;
	bb_graphics_context.m_jx=t_jx;
	bb_graphics_context.m_jy=t_jy;
	bb_graphics_context.m_tx=t_tx;
	bb_graphics_context.m_ty=t_ty;
	bb_graphics_context.m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	bb_graphics_context.m_matDirty=1;
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	bb_graphics_SetMatrix(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	bb_graphics_context.m_color_r=t_r;
	bb_graphics_context.m_color_g=t_g;
	bb_graphics_context.m_color_b=t_b;
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	bb_graphics_context.m_alpha=t_alpha;
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	bb_graphics_context.m_blend=t_blend;
	bb_graphics_renderDevice.SetBlend(t_blend);
	return 0;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	bb_graphics_context.m_scissor_x=t_x;
	bb_graphics_context.m_scissor_y=t_y;
	bb_graphics_context.m_scissor_width=t_width;
	bb_graphics_context.m_scissor_height=t_height;
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	return 0;
}
function bb_graphics_BeginRender(){
	bb_graphics_renderDevice=bb_graphics_device;
	bb_graphics_context.m_matrixSp=0;
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetBlend(0);
	bb_graphics_SetScissor(0.0,0.0,(bb_app_DeviceWidth()),(bb_app_DeviceHeight()));
	return 0;
}
function bb_graphics_EndRender(){
	bb_graphics_renderDevice=null;
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	error("");
}
var bb_framework_DEVICE_WIDTH=0;
var bb_framework_DEVICE_HEIGHT=0;
var bb_framework_SCREEN_WIDTH=0;
var bb_framework_SCREEN_HEIGHT=0;
var bb_framework_SCREEN_WIDTH2=0;
var bb_framework_SCREEN_HEIGHT2=0;
var bb_framework_SCREENX_RATIO=0;
var bb_framework_SCREENY_RATIO=0;
function bb_input_MouseX(){
	return bb_input_device.p_MouseX();
}
function bb_input_MouseY(){
	return bb_input_device.p_MouseY();
}
var bb_random_Seed=0;
function c_DeltaTimer(){
	Object.call(this);
	this.m_targetfps=60.0;
	this.m_lastticks=.0;
	this.m_delta=.0;
	this.m_frametime=.0;
	this.m_currentticks=.0;
}
c_DeltaTimer.m_new=function(t_fps){
	this.m_targetfps=t_fps;
	this.m_lastticks=(bb_app_Millisecs());
	return this;
}
c_DeltaTimer.m_new2=function(){
	return this;
}
c_DeltaTimer.prototype.p_UpdateDelta=function(){
	this.m_currentticks=(bb_app_Millisecs());
	this.m_frametime=this.m_currentticks-this.m_lastticks;
	this.m_delta=this.m_frametime/(1000.0/this.m_targetfps);
	if(this.m_delta>5.0){
		if(bb_framework_diddyGame.m_debugOn){
			print("WARNING DELTA GREATER THAN 5!!! Reseting it to 1");
		}
		this.m_delta=1.0;
	}
	this.m_lastticks=this.m_currentticks;
}
function bb_app_Millisecs(){
	return bb_app__game.Millisecs();
}
var bb_framework_dt=null;
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	bb_app__updateRate=t_hertz;
	bb_app__game.SetUpdateRate(t_hertz);
}
function c_Sprite(){
	Object.call(this);
	this.m_image=null;
	this.m_x=.0;
	this.m_y=.0;
	this.m_alpha=1.0;
	this.m_hitBox=null;
	this.m_visible=true;
}
c_Sprite.prototype.p_SetHitBox=function(t_hitX,t_hitY,t_hitWidth,t_hitHeight){
	this.m_hitBox=c_HitBox.m_new.call(new c_HitBox,(t_hitX),(t_hitY),(t_hitWidth),(t_hitHeight));
}
c_Sprite.m_new=function(t_img,t_x,t_y){
	this.m_image=t_img;
	this.m_x=t_x;
	this.m_y=t_y;
	this.m_alpha=1.0;
	this.p_SetHitBox(((-t_img.m_image.p_HandleX())|0),((-t_img.m_image.p_HandleY())|0),t_img.m_w,t_img.m_h);
	this.m_visible=true;
	return this;
}
c_Sprite.m_new2=function(){
	return this;
}
function c_Particle(){
	c_Sprite.call(this);
}
c_Particle.prototype=extend_class(c_Sprite);
c_Particle.m_MAX_PARTICLES=0;
c_Particle.m_new=function(){
	c_Sprite.m_new2.call(this);
	return this;
}
c_Particle.m_particles=[];
c_Particle.m_Cache=function(){
	for(var t_i=0;t_i<=c_Particle.m_MAX_PARTICLES-1;t_i=t_i+1){
		c_Particle.m_particles[t_i]=c_Particle.m_new.call(new c_Particle);
	}
}
function c_HitBox(){
	Object.call(this);
	this.m_x=.0;
	this.m_y=.0;
	this.m_w=.0;
	this.m_h=.0;
}
c_HitBox.m_new=function(t_x,t_y,t_w,t_h){
	this.m_x=t_x;
	this.m_y=t_y;
	this.m_w=t_w;
	this.m_h=t_h;
	return this;
}
c_HitBox.m_new2=function(){
	return this;
}
function c_FPSCounter(){
	Object.call(this);
}
c_FPSCounter.m_startTime=0;
c_FPSCounter.m_fpsCount=0;
c_FPSCounter.m_totalFPS=0;
c_FPSCounter.m_Update=function(){
	if(bb_app_Millisecs()-c_FPSCounter.m_startTime>=1000){
		c_FPSCounter.m_totalFPS=c_FPSCounter.m_fpsCount;
		c_FPSCounter.m_fpsCount=0;
		c_FPSCounter.m_startTime=bb_app_Millisecs();
	}else{
		c_FPSCounter.m_fpsCount+=1;
	}
}
c_FPSCounter.m_Draw=function(t_x,t_y,t_ax,t_ay){
	bb_graphics_DrawText("FPS: "+String(c_FPSCounter.m_totalFPS),(t_x),(t_y),t_ax,t_ay);
}
function bb_graphics_PushMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp;
	if(t_sp==bb_graphics_context.m_matrixStack.length){
		bb_graphics_context.m_matrixStack=resize_number_array(bb_graphics_context.m_matrixStack,t_sp*2);
	}
	bb_graphics_context.m_matrixStack[t_sp+0]=bb_graphics_context.m_ix;
	bb_graphics_context.m_matrixStack[t_sp+1]=bb_graphics_context.m_iy;
	bb_graphics_context.m_matrixStack[t_sp+2]=bb_graphics_context.m_jx;
	bb_graphics_context.m_matrixStack[t_sp+3]=bb_graphics_context.m_jy;
	bb_graphics_context.m_matrixStack[t_sp+4]=bb_graphics_context.m_tx;
	bb_graphics_context.m_matrixStack[t_sp+5]=bb_graphics_context.m_ty;
	bb_graphics_context.m_matrixSp=t_sp+6;
	return 0;
}
function bb_math_Max(t_x,t_y){
	if(t_x>t_y){
		return t_x;
	}
	return t_y;
}
function bb_math_Max2(t_x,t_y){
	if(t_x>t_y){
		return t_x;
	}
	return t_y;
}
function bb_math_Min(t_x,t_y){
	if(t_x<t_y){
		return t_x;
	}
	return t_y;
}
function bb_math_Min2(t_x,t_y){
	if(t_x<t_y){
		return t_x;
	}
	return t_y;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	var t_ix2=t_ix*bb_graphics_context.m_ix+t_iy*bb_graphics_context.m_jx;
	var t_iy2=t_ix*bb_graphics_context.m_iy+t_iy*bb_graphics_context.m_jy;
	var t_jx2=t_jx*bb_graphics_context.m_ix+t_jy*bb_graphics_context.m_jx;
	var t_jy2=t_jx*bb_graphics_context.m_iy+t_jy*bb_graphics_context.m_jy;
	var t_tx2=t_tx*bb_graphics_context.m_ix+t_ty*bb_graphics_context.m_jx+bb_graphics_context.m_tx;
	var t_ty2=t_tx*bb_graphics_context.m_iy+t_ty*bb_graphics_context.m_jy+bb_graphics_context.m_ty;
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	return 0;
}
function bb_graphics_Transform2(t_m){
	bb_graphics_Transform(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	return 0;
}
function c_DiddyDataLayer(){
	Object.call(this);
	this.m_index=0;
	this.m_objects=c_DiddyDataObjects.m_new.call(new c_DiddyDataObjects);
	this.implments={c_IComparable:1};
}
c_DiddyDataLayer.prototype.p_Render2=function(t_xoffset,t_yoffset){
	var t_=this.m_objects.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_obj=t_.p_NextObject();
		if(t_obj.m_visible){
			t_obj.p_Render2(t_xoffset,t_yoffset);
		}
	}
}
function c_Stack7(){
	Object.call(this);
	this.m_length=0;
	this.m_data=[];
}
c_Stack7.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator.m_new.call(new c_Enumerator,this);
}
c_Stack7.m_NIL=null;
c_Stack7.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack7.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack7.prototype.p_Length2=function(){
	return this.m_length;
}
function c_DiddyStack(){
	c_Stack7.call(this);
	this.implments={c_IContainer:1};
}
c_DiddyStack.prototype=extend_class(c_Stack7);
function c_DiddyDataLayers(){
	c_DiddyStack.call(this);
	this.implments={c_IContainer:1};
}
c_DiddyDataLayers.prototype=extend_class(c_DiddyStack);
function c_Enumerator(){
	Object.call(this);
	this.m_stack=null;
	this.m_index=0;
}
c_Enumerator.m_new=function(t_stack){
	this.m_stack=t_stack;
	return this;
}
c_Enumerator.m_new2=function(){
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	return this.m_index<this.m_stack.p_Length2();
}
c_Enumerator.prototype.p_NextObject=function(){
	this.m_index+=1;
	return this.m_stack.m_data[this.m_index-1];
}
function c_DiddyDataObject(){
	Object.call(this);
	this.m_visible=true;
	this.m_imageName="";
	this.m_alpha=1.0;
	this.m_image=null;
	this.m_red=255;
	this.m_green=255;
	this.m_blue=255;
	this.m_x=.0;
	this.m_y=.0;
	this.m_rotation=.0;
	this.m_scaleX=.0;
	this.m_scaleY=.0;
}
c_DiddyDataObject.prototype.p_Render2=function(t_xoffset,t_yoffset){
	if(((this.m_imageName).length!=0) && this.m_visible && this.m_alpha>0.0){
		if(!((this.m_image)!=null)){
			this.m_image=bb_framework_diddyGame.m_images.p_Find(this.m_imageName);
		}
		if((this.m_image)!=null){
			bb_graphics_SetColor((this.m_red),(this.m_green),(this.m_blue));
			bb_graphics_SetAlpha(this.m_alpha);
			this.m_image.p_Draw2(this.m_x+t_xoffset,this.m_y+t_yoffset,this.m_rotation,this.m_scaleX,this.m_scaleY,0,false);
		}
	}
}
function c_Stack8(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack8.m_new=function(){
	return this;
}
c_Stack8.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack8.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator2.m_new.call(new c_Enumerator2,this);
}
c_Stack8.m_NIL=null;
c_Stack8.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack8.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack8.prototype.p_Length2=function(){
	return this.m_length;
}
c_Stack8.prototype.p_Push19=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack8.prototype.p_Push20=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push19(t_values[t_offset+t_i]);
	}
}
c_Stack8.prototype.p_Push21=function(t_values,t_offset){
	this.p_Push20(t_values,t_offset,t_values.length-t_offset);
}
function c_DiddyStack2(){
	c_Stack8.call(this);
	this.implments={c_IContainer2:1};
}
c_DiddyStack2.prototype=extend_class(c_Stack8);
c_DiddyStack2.m_new=function(){
	c_Stack8.m_new.call(this);
	return this;
}
c_DiddyStack2.m_new2=function(t_data){
	c_Stack8.m_new2.call(this,t_data);
	return this;
}
c_DiddyStack2.prototype.p_AddAll=function(t_src){
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.AddAll: Source Stack must not be null",null);
	}
	var t_=t_src.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_val=t_.p_NextObject();
		this.p_Push19(t_val);
	}
}
c_DiddyStack2.prototype.p_AddAll2=function(t_src){
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.AddAll: Source List must not be null",null);
	}
	var t_=t_src.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_val=t_.p_NextObject();
		this.p_Push19(t_val);
	}
}
c_DiddyStack2.prototype.p_AddAll3=function(t_src){
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.AddAll: Source Set must not be null",null);
	}
	var t_=t_src.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_val=t_.p_NextObject();
		this.p_Push19(t_val);
	}
}
c_DiddyStack2.m_new3=function(t_src){
	c_Stack8.m_new.call(this);
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.New: Source Stack must not be null",null);
	}
	this.p_AddAll(t_src);
	return this;
}
c_DiddyStack2.m_new4=function(t_src){
	c_Stack8.m_new.call(this);
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.New: Source List must not be null",null);
	}
	this.p_AddAll2(t_src);
	return this;
}
c_DiddyStack2.m_new5=function(t_src){
	c_Stack8.m_new.call(this);
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.New: Source Set must not be null",null);
	}
	this.p_AddAll3(t_src);
	return this;
}
function c_DiddyDataObjects(){
	c_DiddyStack2.call(this);
	this.implments={c_IContainer2:1};
}
c_DiddyDataObjects.prototype=extend_class(c_DiddyStack2);
c_DiddyDataObjects.m_new=function(){
	c_DiddyStack2.m_new.call(this);
	return this;
}
function c_Enumerator2(){
	Object.call(this);
	this.m_stack=null;
	this.m_index=0;
}
c_Enumerator2.m_new=function(t_stack){
	this.m_stack=t_stack;
	return this;
}
c_Enumerator2.m_new2=function(){
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	return this.m_index<this.m_stack.p_Length2();
}
c_Enumerator2.prototype.p_NextObject=function(){
	this.m_index+=1;
	return this.m_stack.m_data[this.m_index-1];
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator3.m_new.call(new c_Enumerator3,this);
}
function c_Enumerator3(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator3.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator3.m_new2=function(){
	return this;
}
c_Enumerator3.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator3.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Node3(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node3.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node3.m_new2=function(){
	return this;
}
function c_HeadNode(){
	c_Node3.call(this);
}
c_HeadNode.prototype=extend_class(c_Node3);
c_HeadNode.m_new=function(){
	c_Node3.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Set(){
	Object.call(this);
	this.m_map=null;
}
c_Set.prototype.p_ObjectEnumerator=function(){
	return this.m_map.p_Keys().p_ObjectEnumerator();
}
function c_KeyEnumerator(){
	Object.call(this);
	this.m_node=null;
}
c_KeyEnumerator.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_KeyEnumerator.m_new2=function(){
	return this;
}
c_KeyEnumerator.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_KeyEnumerator.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t.m_key;
}
function c_Map6(){
	Object.call(this);
	this.m_root=null;
}
c_Map6.prototype.p_Keys=function(){
	return c_MapKeys.m_new.call(new c_MapKeys,this);
}
c_Map6.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
function c_MapKeys(){
	Object.call(this);
	this.m_map=null;
}
c_MapKeys.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_MapKeys.m_new2=function(){
	return this;
}
c_MapKeys.prototype.p_ObjectEnumerator=function(){
	return c_KeyEnumerator.m_new.call(new c_KeyEnumerator,this.m_map.p_FirstNode());
}
function c_Node4(){
	Object.call(this);
	this.m_left=null;
	this.m_right=null;
	this.m_parent=null;
	this.m_key=null;
}
c_Node4.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
function c_MapKeys2(){
	Object.call(this);
	this.m_map=null;
}
c_MapKeys2.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_MapKeys2.m_new2=function(){
	return this;
}
c_MapKeys2.prototype.p_ObjectEnumerator=function(){
	return c_KeyEnumerator2.m_new.call(new c_KeyEnumerator2,this.m_map.p_FirstNode());
}
function c_KeyEnumerator2(){
	Object.call(this);
	this.m_node=null;
}
c_KeyEnumerator2.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_KeyEnumerator2.m_new2=function(){
	return this;
}
c_KeyEnumerator2.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_KeyEnumerator2.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t.m_key;
}
function c_Node5(){
	Object.call(this);
	this.m_left=null;
	this.m_right=null;
	this.m_parent=null;
	this.m_key="";
	this.m_value=null;
}
c_Node5.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
function bb_assert_AssertError(t_msg){
	throw c_AssertException.m_new.call(new c_AssertException,t_msg,null);
}
function bb_assert_AssertNotNull(t_val,t_msg){
	if(t_val==null){
		bb_assert_AssertError(t_msg);
	}
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_context.p_Validate();
	if((t_image.m_flags&65536)!=0){
		bb_graphics_renderDevice.DrawSurface(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty);
	}else{
		bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
	}
	return 0;
}
function bb_graphics_Rotate(t_angle){
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	return 0;
}
function bb_graphics_PopMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp-6;
	bb_graphics_SetMatrix(bb_graphics_context.m_matrixStack[t_sp+0],bb_graphics_context.m_matrixStack[t_sp+1],bb_graphics_context.m_matrixStack[t_sp+2],bb_graphics_context.m_matrixStack[t_sp+3],bb_graphics_context.m_matrixStack[t_sp+4],bb_graphics_context.m_matrixStack[t_sp+5]);
	bb_graphics_context.m_matrixSp=t_sp;
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_PushMatrix();
	bb_graphics_Translate(t_x,t_y);
	bb_graphics_Rotate(t_rotation);
	bb_graphics_Scale(t_scaleX,t_scaleY);
	bb_graphics_Translate(-t_image.m_tx,-t_image.m_ty);
	bb_graphics_context.p_Validate();
	if((t_image.m_flags&65536)!=0){
		bb_graphics_renderDevice.DrawSurface(t_image.m_surface,0.0,0.0);
	}else{
		bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,0.0,0.0,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
	}
	bb_graphics_PopMatrix();
	return 0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	return 0;
}
function bb_graphics_DrawText(t_text,t_x,t_y,t_xalign,t_yalign){
	if(!((bb_graphics_context.m_font)!=null)){
		return 0;
	}
	var t_w=bb_graphics_context.m_font.p_Width();
	var t_h=bb_graphics_context.m_font.p_Height();
	t_x-=Math.floor((t_w*t_text.length)*t_xalign);
	t_y-=Math.floor((t_h)*t_yalign);
	for(var t_i=0;t_i<t_text.length;t_i=t_i+1){
		var t_ch=t_text.charCodeAt(t_i)-bb_graphics_context.m_firstChar;
		if(t_ch>=0 && t_ch<bb_graphics_context.m_font.p_Frames()){
			bb_graphics_DrawImage(bb_graphics_context.m_font,t_x+(t_i*t_w),t_y,t_ch);
		}
	}
	return 0;
}
function bb_assert_Assert(t_val,t_msg){
	if(!t_val){
		bb_assert_AssertError(t_msg);
	}
}
function bb_functions_RSet(t_str,t_n,t_char){
	var t_rep="";
	for(var t_i=1;t_i<=t_n;t_i=t_i+1){
		t_rep=t_rep+t_char;
	}
	t_str=t_rep+t_str;
	return t_str.slice(t_str.length-t_n);
}
function bb_functions_FormatNumber(t_number,t_decimal,t_comma,t_padleft){
	bb_assert_Assert(t_decimal>-1 && t_comma>-1 && t_padleft>-1,"Negative numbers not allowed in FormatNumber()");
	var t_str=String(t_number);
	var t_dl=t_str.indexOf(".",0);
	if(t_decimal==0){
		t_decimal=-1;
	}
	t_str=t_str.slice(0,t_dl+t_decimal+1);
	if((t_comma)!=0){
		while(t_dl>t_comma){
			t_str=t_str.slice(0,t_dl-t_comma)+","+t_str.slice(t_dl-t_comma);
			t_dl-=t_comma;
		}
	}
	if((t_padleft)!=0){
		var t_paddedLength=t_padleft+t_decimal+1;
		if(t_paddedLength<t_str.length){
			t_str="Error";
		}
		t_str=bb_functions_RSet(t_str,t_paddedLength," ");
	}
	return t_str;
}
function bb_audio_MusicState(){
	return bb_audio_device.MusicState();
}
function c_SoundPlayer(){
	Object.call(this);
}
c_SoundPlayer.m_channel=0;
function bb_graphics_GetColor(){
	return [bb_graphics_context.m_color_r,bb_graphics_context.m_color_g,bb_graphics_context.m_color_b];
}
function bb_graphics_GetColor2(t_color){
	t_color[0]=bb_graphics_context.m_color_r;
	t_color[1]=bb_graphics_context.m_color_g;
	t_color[2]=bb_graphics_context.m_color_b;
	return 0;
}
function bb_input_MouseHit(t_button){
	return bb_input_device.p_KeyHit(1+t_button);
}
function bb_input_TouchHit(t_index){
	return bb_input_device.p_KeyHit(384+t_index);
}
function bb_input_TouchDown(t_index){
	return ((bb_input_device.p_KeyDown(384+t_index))?1:0);
}
function bb_input_TouchX(t_index){
	return bb_input_device.p_TouchX(t_index);
}
function bb_input_TouchY(t_index){
	return bb_input_device.p_TouchY(t_index);
}
function bb_input_MouseDown(t_button){
	return ((bb_input_device.p_KeyDown(1+t_button))?1:0);
}
function bb_input_KeyHit(t_key){
	return bb_input_device.p_KeyHit(t_key);
}
function bb_input_KeyDown(t_key){
	return ((bb_input_device.p_KeyDown(t_key))?1:0);
}
function c_TweenManager(){
	Object.call(this);
	this.m_objects=c_DiddyStack3.m_new.call(new c_DiddyStack3);
	this.m_isPaused=false;
}
c_TweenManager.m_new=function(){
	return this;
}
c_TweenManager.m_DefaultManager=null;
c_TweenManager.prototype.p_Update=function(t_delta){
	for(var t_i=this.m_objects.p_Count()-1;t_i>=0;t_i=t_i+-1){
		var t_obj=this.m_objects.p_Get2(t_i);
		if(t_obj.p_IsFinished() && t_obj.m_isAutoRemoveEnabled){
			this.m_objects.p_Remove(t_i);
			t_obj.p_Free();
		}
	}
	if(!this.m_isPaused){
		if(t_delta>=0.0){
			for(var t_i2=0;t_i2<this.m_objects.p_Count();t_i2=t_i2+1){
				this.m_objects.p_Get2(t_i2).p_Update(t_delta);
			}
		}else{
			for(var t_i3=this.m_objects.p_Count()-1;t_i3>=0;t_i3=t_i3+-1){
				this.m_objects.p_Get2(t_i3).p_Update(t_delta);
			}
		}
	}
}
function c_BaseTween(){
	Object.call(this);
	this.m_isFinished=false;
	this.m_isKilled=false;
	this.m_isAutoRemoveEnabled=false;
	this.m_isStarted=false;
	this.m_isPaused=false;
	this.m_deltaTime=.0;
	this.m_isInitialized=false;
	this.m_currentTime=.0;
	this.m_delay=.0;
	this.m_isIterationStep=false;
	this.m_currentStep=0;
	this.m_callback=null;
	this.m_callbackTriggers=0;
	this.m_repeatCnt=0;
	this.m_duration=.0;
	this.m_isYoyo=false;
	this.m_repeatDelay=.0;
	this.implments={c_IPoolable:1};
}
c_BaseTween.prototype.p_IsFinished=function(){
	return this.m_isFinished || this.m_isKilled;
}
c_BaseTween.prototype.p_Free=function(){
}
c_BaseTween.prototype.p_InitializeOverride=function(){
}
c_BaseTween.prototype.p_CallCallback=function(t_type){
	if(((this.m_callback)!=null) && (this.m_callbackTriggers&t_type)>0){
		this.m_callback.p_OnEvent(t_type,this);
	}
}
c_BaseTween.prototype.p_Initialize=function(){
	if(this.m_currentTime+this.m_deltaTime>=this.m_delay){
		this.p_InitializeOverride();
		this.m_isInitialized=true;
		this.m_isIterationStep=true;
		this.m_currentStep=0;
		this.m_deltaTime-=this.m_delay-this.m_currentTime;
		this.m_currentTime=0.0;
		this.p_CallCallback(1);
		this.p_CallCallback(2);
	}
}
c_BaseTween.prototype.p_UpdateOverride=function(t__step,t_lastStep,t_isIterationStep,t_delta){
}
c_BaseTween.prototype.p_TestRelaunch=function(){
	if(!this.m_isIterationStep && this.m_repeatCnt>=0 && this.m_currentStep<0 && this.m_currentTime+this.m_deltaTime>=0.0){
		this.m_isIterationStep=true;
		this.m_currentStep=0;
		var t_delta=-this.m_currentTime;
		this.m_deltaTime-=t_delta;
		this.m_currentTime=0.0;
		this.p_CallCallback(1);
		this.p_CallCallback(2);
		this.p_UpdateOverride(this.m_currentStep,this.m_currentStep-1,this.m_isIterationStep,t_delta);
	}else{
		if(!this.m_isIterationStep && this.m_repeatCnt>=0 && this.m_currentStep>this.m_repeatCnt*2 && this.m_currentTime+this.m_deltaTime<0.0){
			this.m_isIterationStep=true;
			this.m_currentStep=this.m_repeatCnt*2;
			var t_delta2=-this.m_currentTime;
			this.m_deltaTime-=t_delta2;
			this.m_currentTime=this.m_duration;
			this.p_CallCallback(16);
			this.p_CallCallback(32);
			this.p_UpdateOverride(this.m_currentStep,this.m_currentStep+1,this.m_isIterationStep,t_delta2);
		}
	}
}
c_BaseTween.prototype.p_IsValid=function(t__step){
	return t__step>=0 && t__step<=this.m_repeatCnt*2 || this.m_repeatCnt<0;
}
c_BaseTween.prototype.p_IsReverse=function(t__step){
	return this.m_isYoyo && bb_math_Abs(t__step % 4)==2;
}
c_BaseTween.prototype.p_ForceStartValues=function(){
}
c_BaseTween.prototype.p_ForceEndValues=function(){
}
c_BaseTween.prototype.p_UpdateStep=function(){
	while(this.p_IsValid(this.m_currentStep)){
		if(!this.m_isIterationStep && this.m_currentTime+this.m_deltaTime<=0.0){
			this.m_isIterationStep=true;
			this.m_currentStep-=1;
			var t_delta=-this.m_currentTime;
			this.m_deltaTime-=t_delta;
			this.m_currentTime=this.m_duration;
			if(this.p_IsReverse(this.m_currentStep)){
				this.p_ForceStartValues();
			}else{
				this.p_ForceEndValues();
			}
			this.p_CallCallback(32);
			this.p_UpdateOverride(this.m_currentStep,this.m_currentStep+1,this.m_isIterationStep,t_delta);
		}else{
			if(!this.m_isIterationStep && this.m_currentTime+this.m_deltaTime>=this.m_repeatDelay){
				this.m_isIterationStep=true;
				this.m_currentStep+=1;
				var t_delta2=this.m_repeatDelay-this.m_currentTime;
				this.m_deltaTime-=t_delta2;
				this.m_currentTime=0.0;
				if(this.p_IsReverse(this.m_currentStep)){
					this.p_ForceEndValues();
				}else{
					this.p_ForceStartValues();
				}
				this.p_CallCallback(2);
				this.p_UpdateOverride(this.m_currentStep,this.m_currentStep-1,this.m_isIterationStep,t_delta2);
			}else{
				if(this.m_isIterationStep && this.m_currentTime+this.m_deltaTime<0.0){
					this.m_isIterationStep=false;
					this.m_currentStep-=1;
					var t_delta3=-this.m_currentTime;
					this.m_deltaTime-=t_delta3;
					this.m_currentTime=0.0;
					this.p_UpdateOverride(this.m_currentStep,this.m_currentStep+1,this.m_isIterationStep,t_delta3);
					this.p_CallCallback(64);
					if(this.m_currentStep<0 && this.m_repeatCnt>=0){
						this.p_CallCallback(128);
					}else{
						this.m_currentTime=this.m_repeatDelay;
					}
				}else{
					if(this.m_isIterationStep && this.m_currentTime+this.m_deltaTime>this.m_duration){
						this.m_isIterationStep=false;
						this.m_currentStep+=1;
						var t_delta4=this.m_duration-this.m_currentTime;
						this.m_deltaTime-=t_delta4;
						this.m_currentTime=this.m_duration;
						this.p_UpdateOverride(this.m_currentStep,this.m_currentStep-1,this.m_isIterationStep,t_delta4);
						this.p_CallCallback(4);
						if(this.m_currentStep>this.m_repeatCnt*2 && this.m_repeatCnt>=0){
							this.p_CallCallback(8);
						}
						this.m_currentTime=0.0;
					}else{
						if(this.m_isIterationStep){
							var t_delta5=this.m_deltaTime;
							this.m_deltaTime-=t_delta5;
							this.m_currentTime+=t_delta5;
							this.p_UpdateOverride(this.m_currentStep,this.m_currentStep,this.m_isIterationStep,t_delta5);
							break;
						}else{
							var t_delta6=this.m_deltaTime;
							this.m_deltaTime-=t_delta6;
							this.m_currentTime+=t_delta6;
							break;
						}
					}
				}
			}
		}
	}
}
c_BaseTween.prototype.p_TestCompletion=function(){
	this.m_isFinished=this.m_repeatCnt>=0 && (this.m_currentStep>this.m_repeatCnt*2 || this.m_currentStep<0);
}
c_BaseTween.prototype.p_Update=function(t_delta){
	if(!this.m_isStarted || this.m_isPaused || this.m_isKilled){
		return;
	}
	this.m_deltaTime=t_delta;
	if(!this.m_isInitialized){
		this.p_Initialize();
	}
	if(this.m_isInitialized){
		this.p_TestRelaunch();
		this.p_UpdateStep();
		this.p_TestCompletion();
	}
	this.m_currentTime+=this.m_deltaTime;
	this.m_deltaTime=0.0;
}
function c_Stack9(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack9.m_new=function(){
	return this;
}
c_Stack9.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack9.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator4.m_new.call(new c_Enumerator4,this);
}
c_Stack9.m_NIL=null;
c_Stack9.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack9.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack9.prototype.p_Length2=function(){
	return this.m_length;
}
c_Stack9.prototype.p_Push22=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack9.prototype.p_Push23=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push22(t_values[t_offset+t_i]);
	}
}
c_Stack9.prototype.p_Push24=function(t_values,t_offset){
	this.p_Push23(t_values,t_offset,t_values.length-t_offset);
}
c_Stack9.prototype.p_Get2=function(t_index){
	return this.m_data[t_index];
}
c_Stack9.prototype.p_Remove=function(t_index){
	for(var t_i=t_index;t_i<this.m_length-1;t_i=t_i+1){
		this.m_data[t_i]=this.m_data[t_i+1];
	}
	this.m_length-=1;
	this.m_data[this.m_length]=c_Stack9.m_NIL;
}
function c_DiddyStack3(){
	c_Stack9.call(this);
	this.implments={c_IContainer3:1};
}
c_DiddyStack3.prototype=extend_class(c_Stack9);
c_DiddyStack3.m_new=function(){
	c_Stack9.m_new.call(this);
	return this;
}
c_DiddyStack3.m_new2=function(t_data){
	c_Stack9.m_new2.call(this,t_data);
	return this;
}
c_DiddyStack3.prototype.p_AddAll4=function(t_src){
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.AddAll: Source Stack must not be null",null);
	}
	var t_=t_src.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_val=t_.p_NextObject();
		this.p_Push22(t_val);
	}
}
c_DiddyStack3.prototype.p_AddAll5=function(t_src){
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.AddAll: Source List must not be null",null);
	}
	var t_=t_src.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_val=t_.p_NextObject();
		this.p_Push22(t_val);
	}
}
c_DiddyStack3.prototype.p_AddAll6=function(t_src){
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.AddAll: Source Set must not be null",null);
	}
	var t_=t_src.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_val=t_.p_NextObject();
		this.p_Push22(t_val);
	}
}
c_DiddyStack3.m_new3=function(t_src){
	c_Stack9.m_new.call(this);
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.New: Source Stack must not be null",null);
	}
	this.p_AddAll4(t_src);
	return this;
}
c_DiddyStack3.m_new4=function(t_src){
	c_Stack9.m_new.call(this);
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.New: Source List must not be null",null);
	}
	this.p_AddAll5(t_src);
	return this;
}
c_DiddyStack3.m_new5=function(t_src){
	c_Stack9.m_new.call(this);
	if(!((t_src)!=null)){
		throw c_IllegalArgumentException.m_new.call(new c_IllegalArgumentException,"DiddyStack.New: Source Set must not be null",null);
	}
	this.p_AddAll6(t_src);
	return this;
}
c_DiddyStack3.prototype.p_Count=function(){
	return this.p_Length2();
}
function c_Enumerator4(){
	Object.call(this);
	this.m_stack=null;
	this.m_index=0;
}
c_Enumerator4.m_new=function(t_stack){
	this.m_stack=t_stack;
	return this;
}
c_Enumerator4.m_new2=function(){
	return this;
}
c_Enumerator4.prototype.p_HasNext=function(){
	return this.m_index<this.m_stack.p_Length2();
}
c_Enumerator4.prototype.p_NextObject=function(){
	this.m_index+=1;
	return this.m_stack.m_data[this.m_index-1];
}
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator5.m_new.call(new c_Enumerator5,this);
}
function c_Enumerator5(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator5.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator5.m_new2=function(){
	return this;
}
c_Enumerator5.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator5.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Node6(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node6.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node6.m_new2=function(){
	return this;
}
function c_HeadNode2(){
	c_Node6.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node6);
c_HeadNode2.m_new=function(){
	c_Node6.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Set2(){
	Object.call(this);
	this.m_map=null;
}
c_Set2.prototype.p_ObjectEnumerator=function(){
	return this.m_map.p_Keys().p_ObjectEnumerator();
}
function c_KeyEnumerator3(){
	Object.call(this);
	this.m_node=null;
}
c_KeyEnumerator3.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_KeyEnumerator3.m_new2=function(){
	return this;
}
c_KeyEnumerator3.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_KeyEnumerator3.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t.m_key;
}
function c_Map7(){
	Object.call(this);
	this.m_root=null;
}
c_Map7.prototype.p_Keys=function(){
	return c_MapKeys3.m_new.call(new c_MapKeys3,this);
}
c_Map7.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
function c_MapKeys3(){
	Object.call(this);
	this.m_map=null;
}
c_MapKeys3.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_MapKeys3.m_new2=function(){
	return this;
}
c_MapKeys3.prototype.p_ObjectEnumerator=function(){
	return c_KeyEnumerator3.m_new.call(new c_KeyEnumerator3,this.m_map.p_FirstNode());
}
function c_Node7(){
	Object.call(this);
	this.m_left=null;
	this.m_right=null;
	this.m_parent=null;
	this.m_key=null;
}
c_Node7.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
function bb_math_Abs(t_x){
	if(t_x>=0){
		return t_x;
	}
	return -t_x;
}
function bb_math_Abs2(t_x){
	if(t_x>=0.0){
		return t_x;
	}
	return -t_x;
}
function bb_audio_SetMusicVolume(t_volume){
	bb_audio_device.SetMusicVolume(t_volume);
	return 0;
}
function bb_audio_SetChannelVolume(t_channel,t_volume){
	bb_audio_device.SetVolume(t_channel,t_volume);
	return 0;
}
function c_Node8(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node8.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node8.m_new2=function(){
	return this;
}
c_Node8.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
function bb_functions_StripExt(t_path){
	var t_i=t_path.lastIndexOf(".");
	if(t_i!=-1 && t_path.indexOf("/",t_i+1)==-1){
		return t_path.slice(0,t_i);
	}
	return t_path;
}
function bb_functions_StripDir(t_path){
	var t_i=t_path.lastIndexOf("/");
	if(t_i!=-1){
		return t_path.slice(t_i+1);
	}
	return t_path;
}
function bb_functions_StripAll(t_path){
	return bb_functions_StripDir(bb_functions_StripExt(t_path));
}
function bb_functions_LoadAnimBitmap(t_path,t_w,t_h,t_count,t_tmpImage){
	t_tmpImage=bb_graphics_LoadImage(t_path,1,c_Image.m_DefaultFlags);
	bb_assert_AssertNotNull((t_tmpImage),"Error loading bitmap "+t_path);
	var t_pointer=t_tmpImage.p_GrabImage(0,0,t_w,t_h,t_count,1);
	return t_pointer;
}
function bb_functions_LoadBitmap(t_path,t_flags){
	var t_pointer=bb_graphics_LoadImage(t_path,1,t_flags);
	bb_assert_AssertNotNull((t_pointer),"Error loading bitmap "+t_path);
	return t_pointer;
}
function c_MapKeys4(){
	Object.call(this);
	this.m_map=null;
}
c_MapKeys4.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_MapKeys4.m_new2=function(){
	return this;
}
c_MapKeys4.prototype.p_ObjectEnumerator=function(){
	return c_KeyEnumerator4.m_new.call(new c_KeyEnumerator4,this.m_map.p_FirstNode());
}
function c_KeyEnumerator4(){
	Object.call(this);
	this.m_node=null;
}
c_KeyEnumerator4.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_KeyEnumerator4.m_new2=function(){
	return this;
}
c_KeyEnumerator4.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_KeyEnumerator4.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t.m_key;
}
function c_Node9(){
	Object.call(this);
	this.m_left=null;
	this.m_right=null;
	this.m_parent=null;
	this.m_key="";
	this.m_value=null;
}
c_Node9.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
function c_Sound(){
	Object.call(this);
	this.m_sample=null;
}
c_Sound.m_new=function(t_sample){
	this.m_sample=t_sample;
	return this;
}
c_Sound.m_new2=function(){
	return this;
}
function bb_audio_LoadSound(t_path){
	var t_sample=bb_audio_device.LoadSample(bb_data_FixDataPath(t_path));
	if((t_sample)!=null){
		return c_Sound.m_new.call(new c_Sound,t_sample);
	}
	return null;
}
function bb_functions_LoadSoundSample(t_path){
	var t_pointer=bb_audio_LoadSound(t_path);
	bb_assert_AssertNotNull((t_pointer),"Error loading sound "+t_path);
	return t_pointer;
}
function bb_audio_PlayMusic(t_path,t_flags){
	return bb_audio_device.PlayMusic(bb_data_FixDataPath(t_path),t_flags);
}
var bb_framework_defaultFadeTime=0;
function c_MapKeys5(){
	Object.call(this);
	this.m_map=null;
}
c_MapKeys5.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_MapKeys5.m_new2=function(){
	return this;
}
c_MapKeys5.prototype.p_ObjectEnumerator=function(){
	return c_KeyEnumerator5.m_new.call(new c_KeyEnumerator5,this.m_map.p_FirstNode());
}
function c_KeyEnumerator5(){
	Object.call(this);
	this.m_node=null;
}
c_KeyEnumerator5.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_KeyEnumerator5.m_new2=function(){
	return this;
}
c_KeyEnumerator5.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_KeyEnumerator5.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t.m_key;
}
function c_Game(){
	c_Screen.call(this);
	this.m_blockList=[];
	this.m_gfxscale=1.0;
	this.m_menuscale=.0;
	this.m_menutitles=null;
	this.m_mapbuttons=null;
	this.m_blocksSolid=null;
	this.m_blocksTrans=null;
	this.m_player=null;
	this.m_cornerButtons=null;
	this.m_background=null;
	this.m_miscImages=null;
	this.m_font=null;
	this.m_fontLarge=null;
	this.m_fontTimer=null;
	this.m_gametimer=null;
	this.m_nextWorld=0;
	this.m_screenfade=null;
	this.m_fading=false;
	this.m_scene=0;
	this.m_currentWorld=-1;
	this.m_mapsTxt=new_string_array(1);
	this.m_currentMap=0;
	this.m_mapWidth=0;
	this.m_mapBak=[];
	this.m_map=[];
	this.m_mapStart=new_number_array(2);
	this.m_movementFreeze=false;
	this.m_pressed=false;
	this.m_buttons=[];
	this.m_mapHeight=0;
	this.m_mapData=[];
	this.m_validating=false;
	this.m_textInputStarted=false;
	this.m_author="";
	this.m_uploadStatus=-1;
	this.m_httpPost=null;
	this.m_Yscroll=.0;
	this.m_worldUserData=[];
	this.m_YscrollMax=.0;
	this.m_XmouseO=.0;
	this.m_YmouseO=.0;
	this.m_touchDragging=false;
	this.m_touchStartY=0;
	this.m_touchStartValue=0;
	this.m_touchStartLeft=false;
	this.m_selectedBlock=0;
	this.m_editing=false;
	this.m_bgX=.0;
	this.m_mapDeaths=0;
	this.m_finished=false;
	this.m_playerPortalTravel=0;
	this.m_mapChanged=false;
	this.m_mapX=.0;
	this.m_mapY=.0;
	this.m_mapXOld=.0;
	this.m_mapYOld=.0;
	this.m_bgY=.0;
	this.m_speedX=.0;
	this.m_speedY=.0;
	this.m_alive=true;
	this.m_Xoffset=.0;
	this.m_Yoffset=.0;
	this.m_touchstart=new_bool_array(32);
	this.m_touch=new_number_array(32);
	this.m_lasttouch=0;
	this.m_gravity=-.3;
	this.m_deathframe=0;
	this.m_ringAlpha=.7;
	this.m_ringPulse=.0;
	this.m_playerFrame=0;
	this.implments={c_IOnHttpRequestComplete:1};
}
c_Game.prototype=extend_class(c_Screen);
c_Game.m_new=function(){
	c_Screen.m_new.call(this,"");
	return this;
}
c_Game.prototype.p_ChangeScene=function(t_newscene,t_startalpha){
	this.m_screenfade=c_Fade.m_new.call(new c_Fade,t_newscene,t_startalpha);
	this.m_fading=true;
	return 0;
}
c_Game.prototype.p_Start2=function(){
	bb_app_SetUpdateRate(60);
	bb_jumpblob_WIDTH=bb_app_DeviceWidth();
	bb_jumpblob_HEIGHT=bb_app_DeviceHeight();
	if(bb_jumpblob_WIDTH<bb_jumpblob_HEIGHT){
		bb_jumpblob_WIDTH=bb_app_DeviceHeight();
		bb_jumpblob_HEIGHT=bb_app_DeviceWidth();
	}
	print(bb_app_LoadState());
	this.m_blockList=bb_extrafunctions_BlockList();
	this.m_gfxscale=(bb_jumpblob_WIDTH)/1280.0;
	this.m_menuscale=bb_math_Min2(this.m_gfxscale*0.75,1.0);
	this.m_menutitles=bb_graphics_LoadImage2("menubuttons.png",768,128,14,1);
	this.m_mapbuttons=bb_graphics_LoadImage2("mapbuttons.png",256,256,9,1);
	this.m_blocksSolid=bb_graphics_LoadImage2("solidblocks.png",128,128,8,1);
	this.m_blocksTrans=bb_graphics_LoadImage2("transblocks.png",128,128,27,1);
	this.m_player=bb_graphics_LoadImage2("player.png",128,128,19,c_Image.m_DefaultFlags);
	this.m_cornerButtons=bb_graphics_LoadImage2("cornerbuttons.png",128,128,11,c_Image.m_DefaultFlags);
	this.m_background=bb_graphics_LoadImage("background.png",1,c_Image.m_DefaultFlags);
	this.m_miscImages=bb_graphics_LoadImage("misc.png",2,1);
	this.m_font=c_BitmapFont.m_new2.call(new c_BitmapFont,"fonts/font2.txt");
	this.m_fontLarge=c_BitmapFont.m_new2.call(new c_BitmapFont,"fonts/font_large.txt");
	this.m_fontTimer=c_BitmapFont.m_new2.call(new c_BitmapFont,"fonts/font_timer.txt");
	this.m_gametimer=c_Timer.m_new.call(new c_Timer);
	this.m_gametimer.p_Update2();
	this.m_nextWorld=1;
	this.p_ChangeScene(1,96);
}
c_Game.prototype.p_MapString=function(){
	var t_mapPrint=bb_jumpblob_DigitExpand(this.m_mapWidth,3);
	if(this.m_mapBak.length==0){
		this.m_mapBak=bb_jumpblob_CopyArray(this.m_map);
	}
	for(var t_mapIndex=0;t_mapIndex<this.m_map.length;t_mapIndex=t_mapIndex+1){
		if(t_mapIndex==this.m_mapWidth*this.m_mapStart[1]+this.m_mapStart[0]){
			t_mapPrint=t_mapPrint+"*";
		}
		t_mapPrint=t_mapPrint+bb_extrafunctions_ToChar(this.m_mapBak[t_mapIndex]);
	}
	return t_mapPrint;
}
c_Game.prototype.p_SaveWorld=function(){
	if(this.m_currentWorld!=0){
		return;
	}
	var t_saveString="";
	if(this.m_mapsTxt.length<=this.m_currentMap){
		this.m_mapsTxt=resize_string_array(this.m_mapsTxt,this.m_currentMap+1);
	}
	for(var t_index=1;t_index<this.m_mapsTxt.length;t_index=t_index+1){
		if(t_index==this.m_currentMap){
			this.m_mapsTxt[t_index]=this.p_MapString();
			print("Map Saved");
		}
		t_saveString=t_saveString+this.m_mapsTxt[t_index];
		if(t_index<this.m_mapsTxt.length-1){
			t_saveString=t_saveString+" |";
		}
	}
	print("World Saved: "+t_saveString);
	bb_jumpblob_SetSaveState(0,t_saveString);
}
c_Game.prototype.p_Suspend=function(){
	if(this.m_scene>255){
		this.p_SaveWorld();
	}
}
c_Game.prototype.p_Back=function(t_fadeTime,t_fadeSound,t_fadeMusic,t_allowScreenUpdate){
	if(this.m_fading){
		return;
	}
	var t_3=this.m_scene;
	if(t_3==1){
		bb_functions_ExitApp();
	}else{
		if(t_3==10){
			this.p_ChangeScene(1,0);
		}else{
			if(t_3==11 || t_3==12 || t_3==15 || t_3==16 || t_3==20 || t_3==100){
				this.p_ChangeScene(10,0);
			}else{
				if(t_3==255 || t_3==256){
					this.m_movementFreeze=true;
					this.p_ChangeScene(10,0);
				}else{
					if(t_3==257){
						this.m_scene=256;
					}
				}
			}
		}
	}
}
c_Game.prototype.p_LoadMap=function(t_mapTxt){
	var t_mapBlocks="";
	t_mapBlocks=t_mapTxt.slice(3,t_mapTxt.length);
	var t_spawnIndex=t_mapBlocks.indexOf("*",0);
	t_mapBlocks=string_replace(t_mapBlocks,"*","");
	this.m_mapWidth=parseInt((t_mapTxt.slice(0,3)),10);
	this.m_mapHeight=((t_mapBlocks.length/this.m_mapWidth)|0);
	this.m_map=resize_number_array(this.m_map,this.m_mapWidth*this.m_mapHeight);
	this.m_mapData=resize_number_array(this.m_mapData,this.m_mapWidth*this.m_mapHeight);
	for(var t_index=0;t_index<t_mapBlocks.length;t_index=t_index+1){
		if(t_index==t_spawnIndex){
			this.m_mapStart[0]=t_index-this.m_mapWidth*((t_index/this.m_mapWidth)|0);
			this.m_mapStart[1]=((t_index/this.m_mapWidth)|0);
		}
		this.m_map[t_index]=bb_extrafunctions_ToDigit(t_mapBlocks.slice(t_index,t_index+1));
	}
	return 0;
}
c_Game.prototype.p_LoadMap2=function(t_mapno){
	this.m_currentMap=t_mapno;
	if(t_mapno<this.m_mapsTxt.length && t_mapno>0 && this.m_mapsTxt[t_mapno].length>0){
		print("Load map="+String(this.m_currentMap));
		this.p_LoadMap(this.m_mapsTxt[t_mapno]);
	}else{
		if(t_mapno<0 || this.m_currentWorld==0){
			var t_mapTxt=bb_jumpblob_DigitExpand(this.m_mapWidth,3);
			for(var t_y=0;t_y<this.m_mapHeight;t_y=t_y+1){
				for(var t_x=0;t_x<this.m_mapWidth;t_x=t_x+1){
					if(t_x==1 && t_y==this.m_mapHeight-2){
						t_mapTxt=t_mapTxt+"*";
					}
					if(t_x==0 || t_y==0 || t_x==this.m_mapWidth-1 || t_y==this.m_mapHeight-1){
						t_mapTxt=t_mapTxt+"1";
					}else{
						t_mapTxt=t_mapTxt+"0";
					}
				}
			}
			print("New map="+String(this.m_currentMap));
			this.p_LoadMap(t_mapTxt);
		}else{
			print("Default map");
			this.p_LoadMap(this.m_mapsTxt[0]);
		}
	}
	return 0;
}
c_Game.prototype.p_UploadWorld=function(){
	this.m_httpPost=c_HttpRequest.m_new2.call(new c_HttpRequest,"POST","http://jordanpeck.me/jumpblob/save_map.php",(this));
	this.m_httpPost.p_Send2("l="+String(this.m_currentMap)+"&s="+this.m_mapsTxt[this.m_currentMap]+"&d="+bb_jumpblob_Device()+"&a="+this.m_author,"application/x-www-form-urlencoded","utf8");
}
c_Game.prototype.p_LoadWorld=function(t_newWorld){
	this.m_currentWorld=t_newWorld;
	this.m_mapsTxt=new_string_array(1);
	this.m_mapsTxt[0]="0031111*01111";
	if(this.m_currentWorld>=3){
		this.m_worldUserData=new_number_array(1);
		this.m_worldUserData[0]=0;
		return;
	}
	var t_mapsTxtFile="";
	if(this.m_currentWorld!=0){
		t_mapsTxtFile=bb_app_LoadString("maps"+String(this.m_currentWorld)+".txt");
	}else{
		t_mapsTxtFile=bb_jumpblob_GetSaveState(0);
	}
	t_mapsTxtFile=string_replace(t_mapsTxtFile,"\n","|");
	var t_startIndex=0;
	var t_endIndex=-1;
	for(var t_index=0;t_index<t_mapsTxtFile.length;t_index=t_index+1){
		if(t_mapsTxtFile.slice(t_index,t_index+1)=="|"){
			t_startIndex=t_endIndex;
			t_endIndex=t_index;
			this.m_mapsTxt=resize_string_array(this.m_mapsTxt,this.m_mapsTxt.length+1);
			this.m_mapsTxt[this.m_mapsTxt.length-1]=t_mapsTxtFile.slice(t_startIndex+1,t_endIndex-1);
		}
	}
	if(t_mapsTxtFile.length>0){
		this.m_mapsTxt=resize_string_array(this.m_mapsTxt,this.m_mapsTxt.length+1);
		this.m_mapsTxt[this.m_mapsTxt.length-1]=t_mapsTxtFile.slice(t_endIndex+1,t_mapsTxtFile.length);
	}
	if(this.m_currentWorld!=0){
		var t_saveData=bb_jumpblob_GetSaveState(2).split("|");
		if(t_saveData.length<this.m_currentWorld || t_saveData[this.m_currentWorld-1]==""){
			this.m_worldUserData=new_number_array(1);
			this.m_worldUserData[0]=1;
		}else{
			var t_worldUserDataString=t_saveData[this.m_currentWorld-1].split(".");
			this.m_worldUserData=new_number_array(t_worldUserDataString.length);
			for(var t_index2=0;t_index2<t_worldUserDataString.length;t_index2=t_index2+1){
				this.m_worldUserData[t_index2]=parseInt((t_worldUserDataString[t_index2]),10);
			}
		}
		if(this.m_currentWorld==2){
			this.m_worldUserData[0]=100;
		}
	}else{
		this.m_worldUserData=new_number_array(0);
	}
}
c_Game.prototype.p_SaveWorldUserData=function(){
	if(this.m_currentWorld==0){
		return;
	}
	var t_saveData=bb_jumpblob_GetSaveState(2).split("|");
	var t_newSaveData="";
	for(var t_index=0;t_index<t_saveData.length;t_index=t_index+1){
		if(t_index+1==this.m_currentWorld){
			for(var t_index2=0;t_index2<this.m_worldUserData.length;t_index2=t_index2+1){
				t_newSaveData=t_newSaveData+String(this.m_worldUserData[t_index2]);
				if(t_index2<this.m_worldUserData.length-1){
					t_newSaveData=t_newSaveData+".";
				}
			}
		}else{
			t_newSaveData=t_newSaveData+t_saveData[t_index];
		}
		if(t_index<t_saveData.length-1){
			t_newSaveData=t_newSaveData+"|";
		}
	}
	bb_jumpblob_SetSaveState(2,t_newSaveData);
}
c_Game.prototype.p_ResetPlayer=function(){
	this.m_mapX=-10000.0+(bb_jumpblob_WIDTH)*.5-((this.m_mapStart[0])+.5)*64.0;
	this.m_mapY=-10000.0+(bb_jumpblob_HEIGHT)*.5-(this.m_mapStart[1]*64)-21.0;
	this.m_mapXOld=this.m_mapX;
	this.m_mapYOld=this.m_mapY;
	this.m_bgX=0.0;
	this.m_bgY=0.0;
	this.m_speedX=0.0;
	this.m_speedY=0.0;
	this.m_movementFreeze=true;
	this.m_alive=true;
	this.m_mapDeaths+=1;
	if(this.m_mapChanged==false){
		this.m_gametimer.p_Reset2();
		this.m_mapDeaths=0;
	}
	return 0;
}
c_Game.prototype.p_LoadScene=function(t_newscene,t_unload){
	if(t_unload){
		var t_1=this.m_scene;
		if(t_1==10 || t_1==20 || t_1==100){
			this.m_validating=false;
		}else{
			if(t_1==255){
				if(this.m_validating && t_newscene==100){
					t_newscene=20;
				}
			}else{
				if(t_1==256){
					this.p_SaveWorld();
					this.m_mapBak=new_number_array(0);
				}
			}
		}
	}
	this.m_scene=t_newscene;
	this.m_Yscroll=0.0;
	var t_2=t_newscene;
	if(t_2==1){
		this.m_buttons=resize_object_array(this.m_buttons,3);
		this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.4+(1.0-this.m_menuscale)*450.0)|0),384,128,10,1);
		this.m_buttons[1]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.4+(1.0-this.m_menuscale)*450.0+150.0)|0),384,128,1,2);
		this.m_buttons[2]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.4+(1.0-this.m_menuscale)*450.0+300.0)|0),384,128,10,3);
		this.m_bgX=64.0;
	}else{
		if(t_2==10){
			if(this.m_nextWorld!=this.m_currentWorld){
				this.p_LoadWorld(this.m_nextWorld);
			}
			var t_buttonsPerLine=6;
			var t_buttonsGap=(((bb_jumpblob_WIDTH)/this.m_gfxscale*0.64/(t_buttonsPerLine-1))|0);
			if(this.m_currentWorld==0){
				this.m_buttons=resize_object_array(this.m_buttons,this.m_mapsTxt.length);
				for(var t_index=0;t_index<this.m_buttons.length;t_index=t_index+1){
					var t_x=(((t_index % t_buttonsPerLine*t_buttonsGap)+(bb_jumpblob_WIDTH)/this.m_gfxscale*0.18)|0);
					var t_y=(((((t_index/t_buttonsPerLine)|0)*t_buttonsGap)+(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.25)|0);
					if(t_index==this.m_buttons.length-1){
						this.m_buttons[t_index]=bb_jumpblob_CreateButton(t_x,t_y,((128.0*this.m_gfxscale)|0),((128.0*this.m_gfxscale)|0),11,t_index+1);
					}else{
						this.m_buttons[t_index]=bb_jumpblob_CreateButton(t_x,t_y,((128.0*this.m_gfxscale)|0),((128.0*this.m_gfxscale)|0),12,t_index+1);
					}
					this.m_YscrollMax=bb_math_Max2((t_y+t_buttonsGap)-(bb_jumpblob_HEIGHT)/this.m_gfxscale,0.0);
				}
			}else{
				this.m_buttons=resize_object_array(this.m_buttons,this.m_mapsTxt.length+5);
				for(var t_index2=0;t_index2<this.m_buttons.length;t_index2=t_index2+1){
					var t_x2=(((t_index2 % t_buttonsPerLine*t_buttonsGap)+(bb_jumpblob_WIDTH)/this.m_gfxscale*0.18)|0);
					var t_y2=(((((t_index2/t_buttonsPerLine)|0)*t_buttonsGap)+(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.25)|0);
					if(t_index2<6){
						this.m_buttons[t_index2]=bb_jumpblob_CreateButton(t_x2,t_y2,((128.0*this.m_gfxscale)|0),((128.0*this.m_gfxscale)|0),10,t_index2+1);
					}else{
						this.m_buttons[t_index2]=bb_jumpblob_CreateButton(t_x2,t_y2,((128.0*this.m_gfxscale)|0),((128.0*this.m_gfxscale)|0),255,t_index2-5);
					}
					this.m_YscrollMax=bb_math_Max2((t_y2+t_buttonsGap)-(bb_jumpblob_HEIGHT)/this.m_gfxscale,0.0);
				}
			}
			this.m_bgX=64.0;
		}else{
			if(t_2==11){
				this.m_mapWidth=20;
				this.m_mapHeight=15;
				this.m_bgX=64.0;
				this.m_buttons=resize_object_array(this.m_buttons,1);
				this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.8/this.m_menuscale)|0),384,128,256,1);
			}else{
				if(t_2==12){
					this.m_buttons=resize_object_array(this.m_buttons,4);
					this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5/this.m_menuscale-225.0)|0),384,128,255,1);
					this.m_buttons[1]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5/this.m_menuscale-75.0)|0),384,128,256,10);
					this.m_buttons[2]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5/this.m_menuscale+75.0)|0),384,128,15,12);
					this.m_buttons[3]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5/this.m_menuscale+225.0)|0),384,128,11,11);
					this.m_bgX=64.0;
				}else{
					if(t_2==15){
						this.m_buttons=resize_object_array(this.m_buttons,1);
						this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.75/this.m_menuscale)|0),384,128,16,5);
						this.m_bgX=64.0;
					}else{
						if(t_2==16){
							this.m_buttons=resize_object_array(this.m_buttons,1);
							this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.75/this.m_menuscale)|0),384,128,255,1);
							this.m_author=bb_jumpblob_GetSaveState(3);
							if(this.m_author==""){
								this.m_author="user";
							}
							this.m_bgX=64.0;
						}else{
							if(t_2==20){
								this.m_buttons=resize_object_array(this.m_buttons,1);
								this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.75/this.m_menuscale)|0),384,128,1,13);
								this.m_uploadStatus=-1;
								this.p_UploadWorld();
								this.m_gametimer.p_Reset2();
								this.m_bgX=64.0;
							}else{
								if(t_2==100){
									if(this.m_currentMap==this.m_mapsTxt.length-1){
										this.m_buttons=resize_object_array(this.m_buttons,2);
										this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5+(1.0-this.m_menuscale)*450.0)|0),384,128,255,6);
										this.m_buttons[1]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5+(1.0-this.m_menuscale)*450.0+150.0)|0),384,128,1,7);
									}else{
										this.m_buttons=resize_object_array(this.m_buttons,3);
										this.m_buttons[0]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5+(1.0-this.m_menuscale)*450.0)|0),384,128,255,5);
										this.m_buttons[1]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5+(1.0-this.m_menuscale)*450.0+150.0)|0),384,128,255,6);
										this.m_buttons[2]=bb_jumpblob_CreateButton((((bb_jumpblob_WIDTH)*0.5/this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.5+(1.0-this.m_menuscale)*450.0+300.0)|0),384,128,1,7);
									}
									if(this.m_currentWorld!=0){
										if(this.m_currentMap>=this.m_worldUserData.length){
											this.m_worldUserData=resize_number_array(this.m_worldUserData,this.m_currentMap+1);
										}
										if(this.m_mapDeaths==0 && this.m_worldUserData[this.m_currentMap]!=1){
											this.m_worldUserData[this.m_currentMap]=1;
											var t_totalWorldAces=0;
											for(var t_i=1;t_i<this.m_worldUserData.length;t_i=t_i+1){
												if(this.m_worldUserData[t_i]==1){
													t_totalWorldAces+=1;
												}
											}
										}
										if(this.m_worldUserData[0]<this.m_currentMap+1){
											this.m_worldUserData[0]=this.m_currentMap+1;
										}
									}
									this.p_SaveWorldUserData();
									this.m_bgX=64.0;
								}else{
									if(t_2==255 || t_2==256){
										this.m_XmouseO=bb_input_MouseX();
										this.m_YmouseO=bb_input_MouseY();
										this.m_gametimer.p_Reset2();
										this.m_finished=false;
										this.m_selectedBlock=1;
										this.m_editing=false;
										this.m_playerPortalTravel=-1;
										this.m_mapDeaths=0;
										this.m_mapChanged=false;
										this.p_LoadMap2(this.m_currentMap);
										this.p_ResetPlayer();
										if(this.m_scene==256){
											this.m_mapBak=bb_jumpblob_CopyArray(this.m_map);
										}
									}else{
										if(t_2==257){
											this.m_buttons=resize_object_array(this.m_buttons,this.m_blockList.length);
											var t_buttonsPerLine2=8;
											var t_buttonsGap2=(((bb_jumpblob_WIDTH)/this.m_gfxscale*0.7/(t_buttonsPerLine2-1))|0);
											for(var t_index3=0;t_index3<this.m_buttons.length;t_index3=t_index3+1){
												var t_x3=(((t_index3 % t_buttonsPerLine2*t_buttonsGap2)+(bb_jumpblob_WIDTH)/this.m_gfxscale*0.15)|0);
												var t_y3=(((((t_index3/t_buttonsPerLine2)|0)*t_buttonsGap2)+(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.15)|0);
												this.m_buttons[t_index3]=bb_jumpblob_CreateButton(t_x3,t_y3,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0),0,this.m_blockList[t_index3]);
												this.m_YscrollMax=bb_math_Max2((t_y3+t_buttonsGap2)-(bb_jumpblob_HEIGHT)/this.m_gfxscale,0.0);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
c_Game.prototype.p_GetInput=function(){
	if((bb_input_KeyDown(37))!=0){
		return 1;
	}
	if((bb_input_KeyDown(39))!=0){
		return 2;
	}
	if(this.m_editing){
		return 0;
	}
	var t_shorttouch=2147483647;
	for(var t_i=0;t_i<=31;t_i=t_i+1){
		if(this.m_touchstart[t_i]!=true && ((bb_input_TouchDown(t_i))!=0)){
			this.m_touch[t_i]=bb_app_Millisecs();
			this.m_touchstart[t_i]=true;
		}else{
			if(this.m_touchstart[t_i]==true && !((bb_input_TouchDown(t_i))!=0)){
				this.m_touch[t_i]=0;
				this.m_touchstart[t_i]=false;
			}
		}
		if(bb_app_Millisecs()-this.m_touch[t_i]<=t_shorttouch){
			t_shorttouch=bb_app_Millisecs()-this.m_touch[t_i];
			this.m_lasttouch=t_i;
		}
	}
	if(true && ((bb_input_TouchDown(this.m_lasttouch))!=0)){
		if(bb_input_TouchX(this.m_lasttouch)<(bb_jumpblob_WIDTH)*.5){
			return 1;
		}else{
			return 2;
		}
	}
	return 0;
}
c_Game.prototype.p_KillPlayer=function(){
	this.m_alive=false;
	this.m_deathframe=0;
	return 0;
}
c_Game.prototype.p_Update2=function(){
	var t_4=this.m_scene;
	if(t_4==1 || t_4==12 || t_4==15 || t_4==100){
		var t_mx=((bb_input_TouchX(0))|0);
		var t_my=((bb_input_TouchY(0))|0);
		if(!((bb_input_TouchDown(0))!=0) && this.m_pressed){
			for(var t_index=0;t_index<this.m_buttons.length;t_index=t_index+1){
				if(bb_extrafunctions_PointInRect(t_mx,t_my,(((this.m_buttons[t_index].m_x)*this.m_menuscale-(this.m_buttons[t_index].m_width)*0.5*this.m_menuscale)|0),(((this.m_buttons[t_index].m_y)*this.m_menuscale-(this.m_buttons[t_index].m_height)*0.5*this.m_menuscale)|0),(((this.m_buttons[t_index].m_width)*this.m_menuscale)|0),(((this.m_buttons[t_index].m_height)*this.m_menuscale)|0)) && !this.m_fading){
					if(this.m_buttons[t_index].m_data==6){
						this.p_LoadMap2(this.m_currentMap);
					}
					if(this.m_buttons[t_index].m_data==5 && this.m_scene!=15){
						this.p_LoadMap2(this.m_currentMap+1);
					}
					if(this.m_buttons[t_index].m_scene==10 && this.m_scene==1){
						if(this.m_buttons[t_index].m_data==1 && this.m_currentWorld==0){
							this.m_nextWorld=1;
						}
						if(this.m_buttons[t_index].m_data==3){
							this.m_nextWorld=0;
						}
					}
					this.p_ChangeScene(this.m_buttons[t_index].m_scene,0);
					break;
				}
			}
			if(this.m_scene>=12 && this.m_scene<=15 && bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
				this.p_Back(bb_framework_defaultFadeTime,false,false,true);
			}
		}
		this.m_pressed=false;
		if((bb_input_TouchDown(0))!=0){
			this.m_pressed=true;
		}
	}else{
		if(t_4==16){
			var t_mx2=((bb_input_TouchX(0))|0);
			var t_my2=((bb_input_TouchY(0))|0);
			if(!((bb_input_TouchDown(0))!=0) && this.m_pressed){
				for(var t_index2=0;t_index2<this.m_buttons.length;t_index2=t_index2+1){
					if(bb_extrafunctions_PointInRect(t_mx2,t_my2,(((this.m_buttons[t_index2].m_x)*this.m_menuscale-(this.m_buttons[t_index2].m_width)*0.5*this.m_menuscale)|0),(((this.m_buttons[t_index2].m_y)*this.m_menuscale-(this.m_buttons[t_index2].m_height)*0.5*this.m_menuscale)|0),(((this.m_buttons[t_index2].m_width)*this.m_menuscale)|0),(((this.m_buttons[t_index2].m_height)*this.m_menuscale)|0)) && !this.m_fading){
						this.m_validating=true;
						this.p_ChangeScene(this.m_buttons[t_index2].m_scene,0);
						break;
					}
				}
				if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
					this.p_Back(bb_framework_defaultFadeTime,false,false,true);
				}
				if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((bb_jumpblob_WIDTH)*0.25*this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.2*this.m_menuscale)|0),(((bb_jumpblob_WIDTH)*0.5*this.m_menuscale)|0),(((bb_jumpblob_HEIGHT)*0.3*this.m_menuscale)|0))){
					this.m_textInputStarted=true;
					bb_nativeui_ShowInput("Enter author name",this.m_author,0);
				}
			}
			if(bb_nativeui_HasInputFinished() && this.m_textInputStarted){
				this.m_author=string_replace(bb_nativeui_GetInputValue(),",",".");
				bb_jumpblob_SetSaveState(3,this.m_author);
				this.m_textInputStarted=false;
			}
			this.m_pressed=false;
			if((bb_input_TouchDown(0))!=0){
				this.m_pressed=true;
			}
		}else{
			if(t_4==20){
				var t_mx3=((bb_input_TouchX(0))|0);
				var t_my3=((bb_input_TouchY(0))|0);
				if(!((bb_input_TouchDown(0))!=0) && this.m_pressed){
					for(var t_index3=0;t_index3<this.m_buttons.length;t_index3=t_index3+1){
						if(bb_extrafunctions_PointInRect(t_mx3,t_my3,(((this.m_buttons[t_index3].m_x)*this.m_menuscale-(this.m_buttons[t_index3].m_width)*0.5*this.m_menuscale)|0),(((this.m_buttons[t_index3].m_y)*this.m_menuscale-(this.m_buttons[t_index3].m_height)*0.5*this.m_menuscale)|0),(((this.m_buttons[t_index3].m_width)*this.m_menuscale)|0),(((this.m_buttons[t_index3].m_height)*this.m_menuscale)|0)) && !this.m_fading && this.m_uploadStatus==0){
							this.p_UploadWorld();
							this.m_gametimer.p_Reset2();
							this.m_uploadStatus=-1;
						}
					}
					if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
						this.p_Back(bb_framework_defaultFadeTime,false,false,true);
					}
				}
				if(this.m_uploadStatus==1 && !this.m_fading){
					bb_nativeui_ShowMessage("Upload Complete!","");
					this.p_ChangeScene(10,0);
				}
				this.m_gametimer.p_Update2();
				if(this.m_gametimer.m_sec==5 && this.m_uploadStatus==-1){
					this.m_uploadStatus=0;
				}
				this.m_pressed=false;
				if((bb_input_TouchDown(0))!=0){
					this.m_pressed=true;
				}
			}else{
				if(t_4==10){
					if(!((bb_input_TouchDown(0))!=0) && this.m_pressed){
						for(var t_index4=0;t_index4<this.m_buttons.length;t_index4=t_index4+1){
							if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((this.m_buttons[t_index4].m_x)*this.m_gfxscale-(this.m_buttons[t_index4].m_width)*0.5)|0),((((this.m_buttons[t_index4].m_y)-this.m_Yscroll)*this.m_gfxscale-(this.m_buttons[t_index4].m_height)*0.5)|0),this.m_buttons[t_index4].m_width,this.m_buttons[t_index4].m_height)){
								if(this.m_buttons[t_index4].m_scene!=10){
									if(this.m_currentWorld!=0 && this.m_buttons[t_index4].m_data>this.m_worldUserData[0]){
										continue;
									}
									this.m_currentMap=this.m_buttons[t_index4].m_data;
								}else{
									if(this.m_buttons[t_index4].m_data<=3){
										if(this.m_buttons[t_index4].m_data==this.m_currentWorld){
											break;
										}else{
											this.m_nextWorld=this.m_buttons[t_index4].m_data;
										}
									}else{
										break;
									}
								}
								this.p_ChangeScene(this.m_buttons[t_index4].m_scene,0);
								break;
							}
						}
					}
					if(!((bb_input_TouchDown(0))!=0) && this.m_pressed){
						if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
							this.p_Back(bb_framework_defaultFadeTime,false,false,true);
						}
					}
					if(this.m_pressed){
						if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((bb_jumpblob_WIDTH)-64.0*this.m_gfxscale)|0),0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
							this.m_Yscroll=bb_math_Clamp2(this.m_Yscroll-10.0,0.0,this.m_YscrollMax);
						}else{
							if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((bb_jumpblob_WIDTH)-64.0*this.m_gfxscale)|0),(((bb_jumpblob_HEIGHT)-64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
								this.m_Yscroll=bb_math_Clamp2(this.m_Yscroll+10.0,0.0,this.m_YscrollMax);
							}
						}
					}
					if(!((bb_input_TouchDown(0))!=0)){
						this.m_pressed=false;
					}
					if((bb_input_TouchHit(0))!=0){
						this.m_pressed=true;
					}
					if(((bb_input_TouchHit(1))!=0) || ((bb_input_MouseHit(1))!=0)){
						this.m_XmouseO=bb_input_TouchX(0);
						this.m_YmouseO=bb_input_TouchY(0);
					}
					if(((bb_input_TouchDown(0))!=0) && ((bb_input_TouchDown(1))!=0) || ((bb_input_MouseDown(1))!=0) || this.m_touchDragging){
						this.m_pressed=false;
						this.m_Yscroll=bb_math_Clamp2(this.m_Yscroll-(bb_input_TouchY(0)-this.m_YmouseO)/this.m_gfxscale,0.0,this.m_YscrollMax);
					}
				}else{
					if(t_4==11){
						if(((bb_input_TouchDown(0))!=0) && !this.m_pressed){
							this.m_touchStartY=((bb_input_TouchY(0))|0);
							if(bb_input_TouchX(0)<(bb_jumpblob_WIDTH)*0.5){
								this.m_touchStartValue=this.m_mapWidth;
								this.m_touchStartLeft=true;
							}else{
								this.m_touchStartValue=this.m_mapHeight;
								this.m_touchStartLeft=false;
							}
							for(var t_index5=0;t_index5<this.m_buttons.length;t_index5=t_index5+1){
								if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((this.m_buttons[t_index5].m_x)*this.m_menuscale-(this.m_buttons[t_index5].m_width)*.5*this.m_menuscale)|0),(((this.m_buttons[t_index5].m_y)*this.m_menuscale-(this.m_buttons[t_index5].m_height)*.5*this.m_menuscale)|0),(((this.m_buttons[t_index5].m_width)*this.m_menuscale)|0),(((this.m_buttons[t_index5].m_height)*this.m_menuscale)|0)) && !this.m_fading){
									if(this.m_currentMap<this.m_mapsTxt.length){
										this.m_mapsTxt[this.m_currentMap]="";
									}
									this.p_ChangeScene(this.m_buttons[t_index5].m_scene,0);
									break;
								}
							}
						}else{
							if(((bb_input_TouchDown(0))!=0) && this.m_pressed){
								if(this.m_touchStartLeft){
									this.m_mapWidth=bb_math_Clamp(this.m_touchStartValue-(((bb_input_TouchY(0)-(this.m_touchStartY))*0.01)|0),3,255);
								}else{
									this.m_mapHeight=bb_math_Clamp(this.m_touchStartValue-(((bb_input_TouchY(0)-(this.m_touchStartY))*0.01)|0),3,255);
								}
							}else{
								if(!((bb_input_TouchDown(0))!=0) && this.m_pressed){
									if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
										this.p_Back(bb_framework_defaultFadeTime,false,false,true);
									}
								}
							}
						}
						this.m_pressed=false;
						if((bb_input_TouchDown(0))!=0){
							this.m_pressed=true;
						}
					}else{
						if(t_4==255 || t_4==256 || t_4==257){
							if(this.m_scene==257 && !((bb_input_TouchDown(0))!=0) && this.m_pressed){
								for(var t_index6=0;t_index6<this.m_buttons.length;t_index6=t_index6+1){
									if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((this.m_buttons[t_index6].m_x)*this.m_gfxscale-(this.m_buttons[t_index6].m_width)*0.9)|0),((((this.m_buttons[t_index6].m_y)-this.m_Yscroll)*this.m_gfxscale-(this.m_buttons[t_index6].m_height)*0.9)|0),(((this.m_buttons[t_index6].m_width)*1.8)|0),(((this.m_buttons[t_index6].m_height)*1.8)|0))){
										this.m_selectedBlock=this.m_buttons[t_index6].m_data;
										break;
									}
								}
							}
							if(this.m_pressed && !((bb_input_TouchDown(0))!=0)){
								if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
									if(this.m_scene==256 && this.m_editing){
										this.p_LoadScene(257,false);
									}else{
										this.p_Back(bb_framework_defaultFadeTime,false,false,true);
									}
								}else{
									if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((bb_jumpblob_WIDTH)-64.0*this.m_gfxscale)|0),0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
										if(this.m_scene>=256){
											this.m_editing=!this.m_editing;
											this.m_scene=256;
											this.m_Xoffset=0.0;
											this.m_Yoffset=0.0;
											if(this.m_editing){
												if(this.m_mapBak.length>0){
													this.m_map=bb_jumpblob_CopyArray(this.m_mapBak);
												}
											}else{
												this.m_mapBak=bb_jumpblob_CopyArray(this.m_map);
												this.m_gametimer.p_Reset2();
											}
										}else{
											this.p_LoadScene(this.m_scene,true);
										}
									}else{
										if(this.m_scene==256 && this.m_editing){
											var t_mouseX=((((bb_input_TouchX(0)-0.5*(bb_jumpblob_WIDTH))/this.m_gfxscale-this.m_mapX-this.m_Xoffset+0.5*(bb_jumpblob_WIDTH)-10000.0)/64.0)|0);
											var t_mouseY=((((bb_input_TouchY(0)-0.5*(bb_jumpblob_HEIGHT))/this.m_gfxscale-this.m_mapY-this.m_Yoffset+0.5*(bb_jumpblob_HEIGHT)-10000.0)/64.0)|0);
											var t_mouseIndex=t_mouseX+this.m_mapWidth*t_mouseY;
											if(t_mouseX>=0 && t_mouseX<this.m_mapWidth && t_mouseY>=0 && t_mouseY<this.m_mapHeight && t_mouseIndex>=0 && t_mouseIndex<this.m_map.length){
												this.m_map[t_mouseIndex]=this.m_selectedBlock;
											}
										}else{
											if(this.m_scene==257){
												for(var t_index7=0;t_index7<this.m_buttons.length;t_index7=t_index7+1){
													if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((this.m_buttons[t_index7].m_x)*this.m_gfxscale-(this.m_buttons[t_index7].m_width)*0.9)|0),((((this.m_buttons[t_index7].m_y)-this.m_Yscroll)*this.m_gfxscale-(this.m_buttons[t_index7].m_height)*0.9)|0),(((this.m_buttons[t_index7].m_width)*1.8)|0),(((this.m_buttons[t_index7].m_height)*1.8)|0))){
														this.m_selectedBlock=this.m_buttons[t_index7].m_data;
														this.m_scene=256;
														break;
													}
												}
											}
										}
									}
								}
							}
							if(!((bb_input_TouchDown(0))!=0)){
								this.m_pressed=false;
							}
							if((bb_input_TouchHit(0))!=0){
								if(this.m_scene==257 || this.m_scene==256 && this.m_editing){
									this.m_pressed=true;
								}else{
									if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),0,0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0)) || bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((bb_jumpblob_WIDTH)-64.0*this.m_gfxscale)|0),0,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
										this.m_pressed=true;
									}
								}
							}
							if(this.m_editing && (((bb_input_TouchHit(1))!=0) || ((bb_input_MouseHit(1))!=0))){
								this.m_XmouseO=bb_input_TouchX(0);
								this.m_YmouseO=bb_input_TouchY(0);
							}
							if(this.m_editing && (((bb_input_TouchDown(0))!=0) && ((bb_input_TouchDown(1))!=0) || ((bb_input_MouseDown(1))!=0) || this.m_touchDragging)){
								this.m_pressed=false;
								if(this.m_scene==256){
									this.m_Xoffset+=(bb_input_TouchX(0)-this.m_XmouseO)/this.m_gfxscale;
									this.m_Yoffset+=(bb_input_TouchY(0)-this.m_YmouseO)/this.m_gfxscale;
								}else{
									this.m_Yscroll=bb_math_Clamp2(this.m_Yscroll-(bb_input_TouchY(0)-this.m_YmouseO)/this.m_gfxscale,0.0,this.m_YscrollMax);
								}
							}
							if(this.m_scene<=256){
								if(false && ((bb_input_MouseDown(0))!=0)){
									this.m_Xoffset+=bb_input_MouseX()-this.m_XmouseO;
									this.m_Yoffset+=bb_input_MouseY()-this.m_YmouseO;
								}
								this.m_XmouseO=bb_input_MouseX();
								this.m_YmouseO=bb_input_MouseY();
								if(!((bb_input_TouchDown(0))!=0) && !((bb_input_KeyDown(37))!=0) && !((bb_input_KeyDown(39))!=0)){
									this.m_movementFreeze=false;
								}
								if(!this.m_movementFreeze && !this.m_pressed){
									var t_5=this.p_GetInput();
									if(t_5==0){
										if(this.m_mapY==this.m_mapYOld){
											this.m_speedX=this.m_speedX*.93;
										}else{
											this.m_speedX=this.m_speedX*.98;
										}
									}else{
										if(t_5==1){
											if(bb_functions_Round(this.m_speedX)>=8){
												if(this.m_mapY==this.m_mapYOld){
													this.m_speedX=this.m_speedX*.93;
												}else{
													this.m_speedX=this.m_speedX*.98;
												}
											}else{
												this.m_speedX+=(8.0-this.m_speedX)*.08;
											}
										}else{
											if(t_5==2){
												if(bb_functions_Round(this.m_speedX)<=-8){
													if(this.m_mapY==this.m_mapYOld){
														this.m_speedX=this.m_speedX*.93;
													}else{
														this.m_speedX=this.m_speedX*.98;
													}
												}else{
													this.m_speedX+=(-8.0-this.m_speedX)*0.08;
												}
											}
										}
									}
								}
								if(this.m_speedY>this.m_gravity*35.0){
									this.m_speedY+=this.m_gravity;
									this.m_speedY=bb_math_Max2(this.m_speedY,this.m_gravity*35.0);
								}else{
									this.m_speedY-=this.m_gravity;
									this.m_speedY=bb_math_Min2(this.m_speedY,this.m_gravity*35.0);
								}
								this.m_mapXOld=this.m_mapX;
								this.m_mapYOld=this.m_mapY;
								var t_playerX=(((-this.m_mapX-(10000.0-(bb_jumpblob_WIDTH)*.5))/64.0)|0);
								var t_playerY=(((-this.m_mapY-(10000.0-(bb_jumpblob_HEIGHT)*.5))/64.0)|0);
								var t_playerIndex=t_playerX+this.m_mapWidth*t_playerY;
								var t_hit=false;
								if(this.m_map[t_playerIndex]<47 || this.m_map[t_playerIndex]>50){
									this.m_playerPortalTravel=0;
								}
								var t_6=this.m_map[t_playerIndex];
								if(t_6==1 || t_6==2 || t_6==3 || t_6==4 || t_6==5 || t_6==6 || t_6==7 || t_6==8 || t_6==9 || t_6==10 || t_6==11 || t_6==12 || t_6==13 || t_6==14 || t_6==15){
									this.p_ResetPlayer();
								}else{
									if(t_6==16 || t_6==-1){
										if(this.m_alive){
											this.p_KillPlayer();
										}
									}else{
										if(t_6==17 || t_6==45 || t_6==46){
											if(this.m_scene==255){
												if(this.m_map[t_playerIndex]==46){
													this.m_map[t_playerIndex]=44;
													this.m_mapChanged=true;
												}else{
													this.m_map[t_playerIndex]=0;
													this.m_mapChanged=true;
												}
												var t_goalsLeft=0;
												for(var t_index8=0;t_index8<this.m_map.length;t_index8=t_index8+1){
													if(this.m_map[t_index8]==17 || this.m_map[t_index8]==45 || this.m_map[t_index8]==46){
														t_goalsLeft+=1;
													}
												}
												if(t_goalsLeft==0){
													this.m_finished=true;
													this.p_ChangeScene(100,0);
												}
											}
										}else{
											if(t_6==18 || t_6==19 || t_6==20 || t_6==21){
												if(!this.m_editing){
													for(var t_indexUnlock=0;t_indexUnlock<this.m_map.length;t_indexUnlock=t_indexUnlock+1){
														if(this.m_map[t_indexUnlock]==this.m_map[t_playerIndex]-10){
															this.m_map[t_indexUnlock]=0;
														}
													}
													this.m_map[t_playerIndex]=0;
													this.m_mapChanged=true;
												}
											}else{
												if(t_6==22){
													if(this.m_scene==255){
														this.m_map[t_playerIndex]=23;
														this.m_mapChanged=true;
														this.m_mapStart[0]=t_playerX;
														this.m_mapStart[1]=t_playerY;
													}
												}else{
													if(t_6==47 || t_6==48 || t_6==49 || t_6==50){
														if(this.m_playerPortalTravel!=t_playerIndex){
															var t_matchingPortals=new_number_array(0);
															for(var t_index9=0;t_index9<this.m_map.length;t_index9=t_index9+1){
																if(this.m_map[t_index9]==this.m_map[t_playerIndex] && t_index9!=t_playerIndex){
																	t_matchingPortals=resize_number_array(t_matchingPortals,t_matchingPortals.length+1);
																	t_matchingPortals[t_matchingPortals.length-1]=t_index9;
																}
															}
															if(t_matchingPortals.length>0){
																var t_destPortal=t_matchingPortals[bb_functions_Rand(0,t_matchingPortals.length-1)];
																this.m_mapX=-10000.0+(bb_jumpblob_WIDTH)*0.5-((t_destPortal-this.m_mapWidth*((t_destPortal/this.m_mapWidth)|0))+0.5)*64.0;
																this.m_mapY=-10000.0+(bb_jumpblob_HEIGHT)*0.5-(((t_destPortal/this.m_mapWidth)|0)+0.5)*64.0;
																this.m_playerPortalTravel=t_destPortal;
															}
														}
													}else{
														if(t_6==24){
															if(this.m_speedY<8.62){
																this.m_speedY=8.62;
																this.m_mapData[t_playerIndex]=1.0;
															}
														}else{
															if(t_6==25){
																if(this.m_speedY<10.59){
																	this.m_speedY=10.56;
																	this.m_mapData[t_playerIndex]=1.0;
																}
															}else{
																if(t_6==26){
																	if(this.m_speedY<12.23){
																		this.m_speedY=12.23;
																		this.m_mapData[t_playerIndex]=1.0;
																	}
																}else{
																	if(t_6==27){
																		if(this.m_speedY<13.68){
																			this.m_speedY=13.68;
																			this.m_mapData[t_playerIndex]=1.0;
																		}
																	}else{
																		if(t_6==28){
																			if(this.m_speedX>-12.149999999999999){
																				this.m_speedX=-12.149999999999999;
																				this.m_mapData[t_playerIndex]=1.0;
																			}
																		}else{
																			if(t_6==29){
																				if(this.m_speedX>-15.450000000000001){
																					this.m_speedX=-15.450000000000001;
																					this.m_mapData[t_playerIndex]=1.0;
																				}
																			}else{
																				if(t_6==30){
																					if(this.m_speedX>-18.075000000000003){
																						this.m_speedX=-18.075000000000003;
																						this.m_mapData[t_playerIndex]=1.0;
																					}
																				}else{
																					if(t_6==31){
																						if(this.m_speedX>-20.399999999999999){
																							this.m_speedX=-20.399999999999999;
																							this.m_mapData[t_playerIndex]=1.0;
																						}
																					}else{
																						if(t_6==32){
																							if(this.m_speedY>-12.149999999999999){
																								this.m_speedY=-12.149999999999999;
																								this.m_mapData[t_playerIndex]=1.0;
																							}
																						}else{
																							if(t_6==33){
																								if(this.m_speedY>-15.450000000000001){
																									this.m_speedY=-15.450000000000001;
																									this.m_mapData[t_playerIndex]=1.0;
																								}
																							}else{
																								if(t_6==34){
																									if(this.m_speedY>-18.075000000000003){
																										this.m_speedY=-18.075000000000003;
																										this.m_mapData[t_playerIndex]=1.0;
																									}
																								}else{
																									if(t_6==35){
																										if(this.m_speedY>-20.399999999999999){
																											this.m_speedY=-20.399999999999999;
																											this.m_mapData[t_playerIndex]=1.0;
																										}
																									}else{
																										if(t_6==36){
																											if(this.m_speedX<12.149999999999999){
																												this.m_speedX=12.149999999999999;
																												this.m_mapData[t_playerIndex]=1.0;
																											}
																										}else{
																											if(t_6==37){
																												if(this.m_speedX<15.450000000000001){
																													this.m_speedX=15.450000000000001;
																													this.m_mapData[t_playerIndex]=1.0;
																												}
																											}else{
																												if(t_6==38){
																													if(this.m_speedX<18.075000000000003){
																														this.m_speedX=18.075000000000003;
																														this.m_mapData[t_playerIndex]=1.0;
																													}
																												}else{
																													if(t_6==39){
																														if(this.m_speedX<20.399999999999999){
																															this.m_speedX=20.399999999999999;
																															this.m_mapData[t_playerIndex]=1.0;
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
								if(this.m_alive){
									this.m_mapX+=this.m_speedX;
									this.m_mapY+=this.m_speedY;
								}
								t_playerX=(((-this.m_mapX-(10000.0-(bb_jumpblob_WIDTH)*.5))/64.0)|0);
								t_playerY=(((-this.m_mapY-(10000.0-(bb_jumpblob_HEIGHT)*.5))/64.0)|0);
								t_playerIndex=t_playerX+this.m_mapWidth*t_playerY;
								if(t_playerX<=0 || t_playerY<=0 || t_playerX>=this.m_mapWidth-1 || t_playerY>=this.m_mapHeight-1){
									this.p_ResetPlayer();
									t_playerX=(((-this.m_mapX-(10000.0-(bb_jumpblob_WIDTH)*.5))/64.0)|0);
									t_playerY=(((-this.m_mapY-(10000.0-(bb_jumpblob_HEIGHT)*.5))/64.0)|0);
									t_playerIndex=t_playerX+this.m_mapWidth*t_playerY;
								}
								if((this.m_map[t_playerIndex-this.m_mapWidth]>0 && this.m_map[t_playerIndex-this.m_mapWidth]<16 || this.m_map[t_playerIndex-this.m_mapWidth]==42) && (bb_jumpblob_HEIGHT)*.5-21.0<10000.0+this.m_mapY+(t_playerY*64)){
									if(this.m_map[t_playerIndex-this.m_mapWidth]==42){
										if(this.m_speedY>0.0){
											this.m_speedY=0.0;
											this.m_speedX=this.m_speedX*0.8;
										}
									}else{
										this.m_speedY=0.0;
										this.m_speedX=this.m_speedX*0.8;
									}
									if(this.m_speedY>=0.0){
										this.m_mapY+=(bb_jumpblob_HEIGHT)*.5-21.0-(10000.0+this.m_mapY+(t_playerY*64));
									}
									t_hit=true;
								}else{
									if((this.m_map[t_playerIndex+this.m_mapWidth]>0 && this.m_map[t_playerIndex+this.m_mapWidth]<16 || this.m_map[t_playerIndex+this.m_mapWidth]==40) && (bb_jumpblob_HEIGHT)*.5+21.0>10000.0+this.m_mapY+((t_playerY+1)*64)){
										var t_move=true;
										var t_7=this.m_map[t_playerIndex+this.m_mapWidth];
										if(t_7==2){
											this.m_speedY=8.101;
											this.m_mapData[t_playerIndex+this.m_mapWidth]=1.0;
											this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
										}else{
											if(t_7==3){
												this.m_speedY=10.253;
												this.m_mapData[t_playerIndex+this.m_mapWidth]=1.0;
												this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
											}else{
												if(t_7==4){
													this.m_speedY=12.0;
													this.m_mapData[t_playerIndex+this.m_mapWidth]=1.0;
													this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
												}else{
													if(t_7==5){
														this.m_speedY=13.5;
														this.m_mapData[t_playerIndex+this.m_mapWidth]=1.0;
														this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
													}else{
														if(t_7==40){
															if(-this.m_speedY>=(bb_jumpblob_HEIGHT)*0.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64))){
																this.m_speedY=0.0;
															}else{
																t_move=false;
															}
														}else{
															this.m_speedY=0.0;
														}
													}
												}
											}
										}
										if(this.m_speedY<=0.0 && t_move){
											this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
										}
										t_hit=true;
									}
								}
								if((this.m_map[t_playerIndex-1]>0 && this.m_map[t_playerIndex-1]<16 || this.m_map[t_playerIndex-1]==41) && (bb_jumpblob_WIDTH)*.5-21.0<10000.0+this.m_mapX+(t_playerX*64)){
									var t_move2=true;
									if(this.m_map[t_playerIndex-1]==41){
										if(-this.m_speedX<=(bb_jumpblob_WIDTH)*.5-21.0-(10000.0+this.m_mapX+(t_playerX*64))){
											this.m_speedX=0.0;
											this.m_speedY=this.m_speedY*.85;
										}else{
											t_move2=false;
										}
									}else{
										this.m_speedX=0.0;
										this.m_speedY=this.m_speedY*.85;
									}
									if(this.m_speedX>=0.0 && t_move2){
										this.m_mapX+=(bb_jumpblob_WIDTH)*.5-21.0-(10000.0+this.m_mapX+(t_playerX*64));
									}
									t_hit=true;
								}else{
									if((this.m_map[t_playerIndex+1]>0 && this.m_map[t_playerIndex+1]<16 || this.m_map[t_playerIndex+1]==43) && (bb_jumpblob_WIDTH)*.5+21.0>10000.0+this.m_mapX+((t_playerX+1)*64)){
										var t_move3=true;
										if(this.m_map[t_playerIndex+1]==43){
											if(-this.m_speedX>=(bb_jumpblob_WIDTH)*.5+21.0-(10000.0+this.m_mapX+((t_playerX+1)*64))){
												this.m_speedX=0.0;
												this.m_speedY=this.m_speedY*.85;
											}else{
												t_move3=false;
											}
										}else{
											this.m_speedX=0.0;
											this.m_speedY=this.m_speedY*.85;
										}
										if(this.m_speedX<=0.0 && t_move3){
											this.m_mapX+=(bb_jumpblob_WIDTH)*.5+21.0-(10000.0+this.m_mapX+((t_playerX+1)*64));
										}
										t_hit=true;
									}
								}
								if(!t_hit){
									if((this.m_map[t_playerIndex-this.m_mapWidth-1]>0 && this.m_map[t_playerIndex-this.m_mapWidth-1]<16 || this.m_map[t_playerIndex-this.m_mapWidth-1]==42 || this.m_map[t_playerIndex-this.m_mapWidth-1]==41) && (bb_jumpblob_WIDTH)*.5-21.0<10000.0+this.m_mapX+(t_playerX*64) && (bb_jumpblob_HEIGHT)*.5-21.0<10000.0+this.m_mapY+(t_playerY*64)){
										if(-((bb_jumpblob_HEIGHT)*.5+42.0-(10000.0+this.m_mapY+((t_playerY+1)*64)))<=-((bb_jumpblob_WIDTH)*.5+42.0-(10000.0+this.m_mapX+((t_playerX+1)*64)))){
											if(this.m_speedY>0.0){
												this.m_speedY=0.0;
											}
											if(this.m_speedY>=0.0){
												this.m_mapY+=(bb_jumpblob_HEIGHT)*.5-21.0-(10000.0+this.m_mapY+(t_playerY*64));
											}
										}else{
											if(this.m_speedX>0.0){
												this.m_speedX=0.0;
												this.m_speedY=this.m_speedY*.85;
											}
											if(this.m_speedX>=0.0){
												this.m_mapX+=(bb_jumpblob_WIDTH)*.5-21.0-(10000.0+this.m_mapX+(t_playerX*64));
											}
										}
									}else{
										if((this.m_map[t_playerIndex-this.m_mapWidth+1]>0 && this.m_map[t_playerIndex-this.m_mapWidth+1]<16 || this.m_map[t_playerIndex-this.m_mapWidth+1]==42 || this.m_map[t_playerIndex-this.m_mapWidth+1]==43) && (bb_jumpblob_WIDTH)*.5+21.0>10000.0+this.m_mapX+((t_playerX+1)*64) && (bb_jumpblob_HEIGHT)*.5-21.0<10000.0+this.m_mapY+(t_playerY*64)){
											if(-((bb_jumpblob_HEIGHT)*.5+42.0-(10000.0+this.m_mapY+((t_playerY+1)*64)))<=(bb_jumpblob_WIDTH)*.5+21.0-(10000.0+this.m_mapX+((t_playerX+1)*64))){
												if(this.m_speedY>0.0){
													this.m_speedY=0.0;
												}
												if(this.m_speedY>=0.0){
													this.m_mapY+=(bb_jumpblob_HEIGHT)*.5-21.0-(10000.0+this.m_mapY+(t_playerY*64));
												}
											}else{
												if(this.m_speedX<0.0){
													this.m_speedX=0.0;
													this.m_speedY=this.m_speedY*.85;
												}
												if(this.m_speedX<=0.0){
													this.m_mapX+=(bb_jumpblob_WIDTH)*.5+21.0-(10000.0+this.m_mapX+((t_playerX+1)*64));
												}
											}
										}else{
											if((this.m_map[t_playerIndex+this.m_mapWidth-1]>0 && this.m_map[t_playerIndex+this.m_mapWidth-1]<16 || this.m_map[t_playerIndex+this.m_mapWidth-1]==40 || this.m_map[t_playerIndex+this.m_mapWidth-1]==41) && (bb_jumpblob_WIDTH)*.5-21.0<10000.0+this.m_mapX+(t_playerX*64) && (bb_jumpblob_HEIGHT)*.5+21.0>10000.0+this.m_mapY+((t_playerY+1)*64)){
												if((bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64))<=-((bb_jumpblob_WIDTH)*.5+42.0-(10000.0+this.m_mapX+((t_playerX+1)*64)))){
													if(this.m_speedY<0.0){
														this.m_speedY=0.0;
													}
													if(this.m_speedY<=0.0){
														this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
													}
												}else{
													if(this.m_speedX>0.0){
														this.m_speedX=0.0;
														this.m_speedY=this.m_speedY*.85;
													}
													if(this.m_speedX>=0.0){
														this.m_mapX+=(bb_jumpblob_WIDTH)*.5-21.0-(10000.0+this.m_mapX+(t_playerX*64));
													}
												}
											}else{
												if((this.m_map[t_playerIndex+this.m_mapWidth+1]>0 && this.m_map[t_playerIndex+this.m_mapWidth+1]<16 || this.m_map[t_playerIndex+this.m_mapWidth+1]==40 || this.m_map[t_playerIndex+this.m_mapWidth+1]==43) && (bb_jumpblob_WIDTH)*.5+21.0>10000.0+this.m_mapX+((t_playerX+1)*64) && (bb_jumpblob_HEIGHT)*.5+21.0>10000.0+this.m_mapY+((t_playerY+1)*64)){
													if((bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64))<=(bb_jumpblob_WIDTH)*.5+21.0-(10000.0+this.m_mapX+((t_playerX+1)*64))){
														if(this.m_speedY<0.0){
															this.m_speedY=0.0;
														}
														if(this.m_speedY<=0.0){
															this.m_mapY+=(bb_jumpblob_HEIGHT)*.5+21.0-(10000.0+this.m_mapY+((t_playerY+1)*64));
														}
													}else{
														if(this.m_speedX<0.0){
															this.m_speedX=0.0;
															this.m_speedY=this.m_speedY*.85;
														}
														if(this.m_speedX<=0.0){
															this.m_mapX+=(bb_jumpblob_WIDTH)*.5+21.0-(10000.0+this.m_mapX+((t_playerX+1)*64));
														}
													}
												}
											}
										}
									}
								}
								this.m_bgX+=(this.m_mapX-this.m_mapXOld)*.35;
								this.m_bgY+=(this.m_mapY-this.m_mapYOld)*.35;
								if(this.m_bgX>128.0){
									this.m_bgX=this.m_bgX-128.0;
								}else{
									if(this.m_bgX<0.0){
										this.m_bgX=this.m_bgX+128.0;
									}
								}
								if(this.m_bgY>128.0){
									this.m_bgY=this.m_bgY-128.0;
								}else{
									if(this.m_bgY<0.0){
										this.m_bgY=this.m_bgY+128.0;
									}
								}
								if(!this.m_alive){
									this.m_deathframe+=1;
									if((((this.m_deathframe)*.3)|0)==7){
										this.p_ResetPlayer();
									}
								}
								if(!this.m_finished){
									this.m_gametimer.p_Update2();
								}
							}
						}
					}
				}
			}
		}
	}
	this.m_XmouseO=bb_input_MouseX();
	this.m_YmouseO=bb_input_MouseY();
	if(this.m_fading){
		var t_8=this.m_screenfade.p_Update2();
		if(t_8==1){
			this.p_LoadScene(this.m_screenfade.m_nextscene,true);
		}else{
			if(t_8==2){
				this.m_fading=false;
			}
		}
	}
	if((this.m_httpPost)!=null){
		bb_asyncevent_UpdateAsyncEvents();
	}
	this.m_touchDragging=false;
}
c_Game.prototype.p_OnTouchDragged=function(t_x,t_y,t_dx,t_dy,t_pointer){
	var t_tdx=t_x-bb_framework_diddyGame.m_inputCache.m_touchData[t_pointer].m_firstTouchX;
	var t_tdy=t_y-bb_framework_diddyGame.m_inputCache.m_touchData[t_pointer].m_firstTouchY;
	if(t_tdx*t_tdx+t_tdy*t_tdy>2000){
		this.m_touchDragging=true;
	}
}
c_Game.prototype.p_ButtonPressedFrame=function(t_left,t_top){
	if(!((bb_input_TouchDown(0))!=0)){
		return 0;
	}
	var t_x=0;
	var t_y=0;
	if(!t_left){
		t_x=(((bb_jumpblob_WIDTH)-64.0*this.m_gfxscale)|0);
	}
	if(!t_top){
		t_y=(((bb_jumpblob_HEIGHT)-64.0*this.m_gfxscale)|0);
	}
	if(bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),t_x,t_y,((64.0*this.m_gfxscale)|0),((64.0*this.m_gfxscale)|0))){
		return 6;
	}
	return 0;
}
c_Game.prototype.p_DrawImageOffset=function(t_image,t_x,t_y,t_frame,t_scale,t_rotation){
	t_x=t_x+(bb_jumpblob_WIDTH)*0.5/this.m_gfxscale-(bb_jumpblob_WIDTH)*0.5;
	t_y=t_y+(bb_jumpblob_HEIGHT)*0.5/this.m_gfxscale-(bb_jumpblob_HEIGHT)*0.5;
	bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scale,t_scale,t_frame);
	return 0;
}
c_Game.prototype.p_Render=function(){
	bb_graphics_Cls(255.0,255.0,255.0);
	bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
	for(var t_indexBGX=-1;t_indexBGX<=(((bb_jumpblob_WIDTH)/this.m_gfxscale/128.0)|0);t_indexBGX=t_indexBGX+1){
		for(var t_indexBGY=-1;t_indexBGY<=(((bb_jumpblob_HEIGHT)/this.m_gfxscale/128.0)|0);t_indexBGY=t_indexBGY+1){
			bb_graphics_DrawImage(this.m_background,(t_indexBGX*64*2+bb_functions_Round(this.m_bgX)),(t_indexBGY*64*2+bb_functions_Round(this.m_bgY)),0);
		}
	}
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	var t_9=this.m_scene;
	if(t_9==1){
		bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
		for(var t_index=0;t_index<this.m_buttons.length;t_index=t_index+1){
			bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index].m_x),(this.m_buttons[t_index].m_y),this.m_buttons[t_index].m_data);
		}
		bb_graphics_DrawImage(this.m_menutitles,(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.2/this.m_menuscale,0);
	}else{
		if(t_9==100){
			bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
			for(var t_index2=0;t_index2<this.m_buttons.length;t_index2=t_index2+1){
				bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index2].m_x),(this.m_buttons[t_index2].m_y),this.m_buttons[t_index2].m_data);
			}
			bb_graphics_DrawImage(this.m_menutitles,(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.15/this.m_menuscale,4);
			this.m_fontLarge.p_DrawText3(this.m_gametimer.m_time,(bb_jumpblob_WIDTH)/this.m_menuscale*0.5,(bb_jumpblob_HEIGHT)/this.m_menuscale*0.26,2);
			bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
			bb_graphics_Scale(this.m_gfxscale*0.5,this.m_gfxscale*0.5);
			bb_graphics_DrawImage(this.m_mapbuttons,(bb_jumpblob_WIDTH)/this.m_gfxscale*1.5,(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.45,3);
			this.m_fontLarge.p_DrawText3(String(bb_math_Abs(this.m_currentMap)),(bb_jumpblob_WIDTH)/this.m_gfxscale*1.5+6.0,(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.45-((this.m_fontLarge.p_GetFontHeight())*this.m_gfxscale*0.25+16.0/this.m_gfxscale),2);
			if(this.m_mapDeaths==0){
				bb_graphics_DrawImage2(this.m_miscImages,(bb_jumpblob_WIDTH)/this.m_gfxscale*0.5,(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.45-40.0,0.0,0.35,0.35,1);
				this.m_fontLarge.p_DrawText3("ACED",(bb_jumpblob_WIDTH)/this.m_gfxscale*0.5,(bb_jumpblob_HEIGHT)/this.m_gfxscale*0.45+10.0,2);
			}
		}else{
			if(t_9==10){
				bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
				bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
				bb_graphics_DrawImage2(this.m_cornerButtons,(bb_jumpblob_WIDTH)/this.m_gfxscale-64.0,0.0,0.0,0.5,0.5,4+this.p_ButtonPressedFrame(false,true));
				bb_graphics_DrawImage2(this.m_cornerButtons,(bb_jumpblob_WIDTH)/this.m_gfxscale-64.0,(bb_jumpblob_HEIGHT)/this.m_gfxscale,0.0,0.5,-0.5,4+this.p_ButtonPressedFrame(false,false));
				bb_graphics_Scale(0.5,0.5);
				var t_by=0;
				var t_frame=0;
				var t_fontHeight=(((this.m_fontLarge.p_GetFontHeight())*this.m_gfxscale*0.25+16.0/this.m_gfxscale)|0);
				for(var t_index3=0;t_index3<this.m_buttons.length;t_index3=t_index3+1){
					t_frame=0;
					if(((bb_input_TouchDown(0))!=0) && bb_extrafunctions_PointInRect(((bb_input_TouchX(0))|0),((bb_input_TouchY(0))|0),(((this.m_buttons[t_index3].m_x)*this.m_gfxscale-(this.m_buttons[t_index3].m_width)*0.5)|0),((((this.m_buttons[t_index3].m_y)-this.m_Yscroll)*this.m_gfxscale-(this.m_buttons[t_index3].m_height)*0.5)|0),this.m_buttons[t_index3].m_width,this.m_buttons[t_index3].m_height)){
						t_frame=5;
					}
					t_by=(((this.m_buttons[t_index3].m_y)-this.m_Yscroll)|0);
					if(this.m_buttons[t_index3].m_scene!=10){
						if(this.m_currentWorld==0 || this.m_buttons[t_index3].m_data<=this.m_worldUserData[0]){
							bb_graphics_DrawImage(this.m_mapbuttons,(this.m_buttons[t_index3].m_x*2),(t_by*2),this.m_currentWorld+t_frame);
							if(this.m_worldUserData.length>this.m_buttons[t_index3].m_data && ((this.m_worldUserData[this.m_buttons[t_index3].m_data])!=0)){
								bb_graphics_DrawImage2(this.m_miscImages,(this.m_buttons[t_index3].m_x*2)+(this.m_buttons[t_index3].m_width)*0.55/this.m_gfxscale,(t_by*2)+(this.m_buttons[t_index3].m_height)*0.55/this.m_gfxscale,0.0,0.25,0.25,1);
							}
						}else{
							bb_graphics_DrawImage(this.m_mapbuttons,(this.m_buttons[t_index3].m_x*2),(t_by*2),8);
						}
						if(this.m_buttons[t_index3].m_scene==11){
							this.m_fontLarge.p_DrawText3("NEW",(this.m_buttons[t_index3].m_x*2+6),(t_by*2-t_fontHeight),2);
						}else{
							this.m_fontLarge.p_DrawText3(String(this.m_buttons[t_index3].m_data),(this.m_buttons[t_index3].m_x*2+6),(t_by*2-t_fontHeight),2);
						}
					}else{
						if(this.m_buttons[t_index3].m_data<4){
							bb_graphics_DrawImage(this.m_mapbuttons,(this.m_buttons[t_index3].m_x*2),(t_by*2),this.m_buttons[t_index3].m_data+t_frame);
							if(this.m_buttons[t_index3].m_data==0){
								this.m_font.p_DrawText3("LEVEL",(this.m_buttons[t_index3].m_x*2+3),(t_by*2-t_fontHeight),2);
								this.m_font.p_DrawText3("EDITOR",(this.m_buttons[t_index3].m_x*2+3),(t_by*2),2);
							}
							if(this.m_buttons[t_index3].m_data==this.m_currentWorld){
								bb_graphics_DrawImage2(this.m_miscImages,(this.m_buttons[t_index3].m_x*2),(t_by*2),0.0,0.5,0.5,0);
							}
						}
					}
				}
				if(this.m_currentWorld>=3){
					this.m_fontLarge.p_DrawText3("COMING SOON...",(bb_jumpblob_WIDTH)/this.m_gfxscale*0.22*this.m_gfxscale,((bb_jumpblob_HEIGHT)/this.m_gfxscale*0.25+(bb_jumpblob_WIDTH)/this.m_gfxscale*0.18)*this.m_gfxscale,1);
				}
			}else{
				if(t_9==11){
					bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
					for(var t_index4=0;t_index4<this.m_buttons.length;t_index4=t_index4+1){
						bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index4].m_x),(this.m_buttons[t_index4].m_y),this.m_buttons[t_index4].m_data);
					}
					bb_graphics_DrawImage(this.m_menutitles,(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.15/this.m_menuscale,8);
					bb_graphics_DrawImage(this.m_menutitles,(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.4/this.m_menuscale,9);
					bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
					bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
					bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
					bb_graphics_Scale(0.7,0.7);
					this.m_fontLarge.p_DrawText3(String(this.m_mapWidth),(bb_jumpblob_WIDTH)/this.m_gfxscale/0.7*0.5-30.0,(bb_jumpblob_HEIGHT)/this.m_gfxscale/0.7*0.5,3);
					this.m_fontLarge.p_DrawText3(String(this.m_mapHeight),(bb_jumpblob_WIDTH)/this.m_gfxscale/0.7*0.5+36.0,(bb_jumpblob_HEIGHT)/this.m_gfxscale/0.7*0.5,1);
				}else{
					if(t_9==12){
						bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
						for(var t_index5=0;t_index5<this.m_buttons.length;t_index5=t_index5+1){
							bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index5].m_x),(this.m_buttons[t_index5].m_y),this.m_buttons[t_index5].m_data);
						}
						bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
						bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
						bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
					}else{
						if(t_9==15){
							bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
							for(var t_index6=0;t_index6<this.m_buttons.length;t_index6=t_index6+1){
								bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index6].m_x),(this.m_buttons[t_index6].m_y),this.m_buttons[t_index6].m_data);
							}
							this.m_font.p_DrawText3("Uploading your level gives you a chance to",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.21/this.m_menuscale,2);
							this.m_font.p_DrawText3("have it included as future content for this game.",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.21/this.m_menuscale+75.0,2);
							this.m_font.p_DrawText3("Before uploading, the level must be played and completed.",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.21/this.m_menuscale+190.0,2);
							this.m_font.p_DrawText3("Connection to the internet is required for uploading.",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.21/this.m_menuscale+265.0,2);
							bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
							bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
							bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
						}else{
							if(t_9==16){
								bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
								for(var t_index7=0;t_index7<this.m_buttons.length;t_index7=t_index7+1){
									bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index7].m_x),(this.m_buttons[t_index7].m_y),this.m_buttons[t_index7].m_data);
								}
								this.m_fontLarge.p_DrawText3("AUTHOR:",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.23/this.m_menuscale,2);
								this.m_font.p_DrawText3(this.m_author,(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.23/this.m_menuscale+190.0,2);
								bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
								bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
								bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
							}else{
								if(t_9==20){
									bb_graphics_Scale(this.m_menuscale,this.m_menuscale);
									for(var t_index8=0;t_index8<this.m_buttons.length;t_index8=t_index8+1){
										if(this.m_uploadStatus==0){
											bb_graphics_DrawImage(this.m_menutitles,(this.m_buttons[t_index8].m_x),(this.m_buttons[t_index8].m_y),this.m_buttons[t_index8].m_data);
										}
									}
									if(this.m_uploadStatus!=0){
										this.m_fontLarge.p_DrawText3("UPLOADING...",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.25/this.m_menuscale,2);
									}else{
										this.m_fontLarge.p_DrawText3("UPLOADING FAILED",(bb_jumpblob_WIDTH)*0.5/this.m_menuscale,(bb_jumpblob_HEIGHT)*0.25/this.m_menuscale,2);
									}
									bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
									bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
									bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
								}else{
									if(t_9==255 || t_9==256 || t_9==257){
										bb_graphics_Scale(this.m_gfxscale,this.m_gfxscale);
										var t_xMin=(((-(10000.0+this.m_mapX)-this.m_Xoffset-(bb_jumpblob_WIDTH)*0.5/this.m_gfxscale+(bb_jumpblob_WIDTH)*0.5)/64.0)|0);
										var t_xMax=(((-(10000.0+this.m_mapX)-this.m_Xoffset+(bb_jumpblob_WIDTH)*0.5/this.m_gfxscale+(bb_jumpblob_WIDTH)*0.5)/64.0)|0);
										var t_yMin=(((-(10000.0+this.m_mapY)-this.m_Yoffset-(bb_jumpblob_HEIGHT)*0.5/this.m_gfxscale+(bb_jumpblob_HEIGHT)*0.5)/64.0)|0);
										var t_yMax=(((-(10000.0+this.m_mapY)-this.m_Yoffset+(bb_jumpblob_HEIGHT)*0.5/this.m_gfxscale+(bb_jumpblob_HEIGHT)*0.5)/64.0)|0);
										var t_tileX=0;
										var t_tileY=0;
										var t_index9=0;
										for(var t_ix=bb_math_Clamp(t_xMin,0,this.m_mapWidth-1);t_ix<bb_math_Clamp(t_xMax,0,this.m_mapWidth-1)+1;t_ix=t_ix+1){
											for(var t_iy=bb_math_Clamp(t_yMin,0,this.m_mapHeight-1);t_iy<bb_math_Clamp(t_yMax,0,this.m_mapHeight-1)+1;t_iy=t_iy+1){
												t_index9=t_iy*this.m_mapWidth+t_ix;
												if(this.m_map[t_index9]==0){
													continue;
												}
												t_tileX=((10000.0+this.m_mapX+(t_ix*64)+this.m_Xoffset+32.0)|0);
												t_tileY=((10000.0+this.m_mapY+(t_iy*64)+this.m_Yoffset+32.0)|0);
												if(this.m_map[t_index9]<16){
													this.p_DrawImageOffset(this.m_blocksSolid,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(1),0.5,0.0);
												}
												var t_10=this.m_map[t_index9];
												if(t_10==1){
												}else{
													if(t_10==2 || t_10==3 || t_10==4 || t_10==5 || t_10==24 || t_10==25 || t_10==26 || t_10==27){
														this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,0.0);
														if(this.m_mapData[t_index9]>0.0){
															bb_graphics_SetAlpha(this.m_mapData[t_index9]);
															this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),4,0.5,0.0);
															bb_graphics_SetAlpha(1.0);
															this.m_mapData[t_index9]-=(1.02-this.m_mapData[t_index9])*0.2;
														}
													}else{
														if(t_10==28 || t_10==29 || t_10==30 || t_10==31){
															this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,270.0);
															if(this.m_mapData[t_index9]>0.0){
																bb_graphics_SetAlpha(this.m_mapData[t_index9]);
																this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),4,0.5,270.0);
																bb_graphics_SetAlpha(1.0);
																this.m_mapData[t_index9]-=(1.02-this.m_mapData[t_index9])*0.2;
															}
														}else{
															if(t_10==32 || t_10==33 || t_10==34 || t_10==35){
																this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,180.0);
																if(this.m_mapData[t_index9]>0.0){
																	bb_graphics_SetAlpha(this.m_mapData[t_index9]);
																	this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),4,0.5,180.0);
																	bb_graphics_SetAlpha(1.0);
																	this.m_mapData[t_index9]-=(1.02-this.m_mapData[t_index9])*0.2;
																}
															}else{
																if(t_10==36 || t_10==37 || t_10==38 || t_10==39){
																	this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,90.0);
																	if(this.m_mapData[t_index9]>0.0){
																		bb_graphics_SetAlpha(this.m_mapData[t_index9]);
																		this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),4,0.5,90.0);
																		bb_graphics_SetAlpha(1.0);
																		this.m_mapData[t_index9]-=(1.02-this.m_mapData[t_index9])*0.2;
																	}
																}else{
																	if(t_10==16){
																		bb_graphics_SetAlpha(this.m_ringAlpha);
																		this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(16),0.5,0.0);
																		bb_graphics_SetAlpha(1.0);
																	}else{
																		if(t_10==40 || t_10==41 || t_10==42 || t_10==43 || t_10==44){
																			this.p_DrawImageOffset(this.m_blocksSolid,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,0.0);
																		}else{
																			if(t_10==46){
																				this.p_DrawImageOffset(this.m_blocksSolid,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(44),0.5,0.0);
																				this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,0.0);
																			}else{
																				this.p_DrawImageOffset(this.m_blocksTrans,(t_tileX),(t_tileY),bb_extrafunctions_BlockFrame(this.m_map[t_index9]),0.5,0.0);
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
										this.m_ringPulse+=.01;
										if(this.m_ringPulse>=.6){
											this.m_ringPulse=0.0;
										}
										if(this.m_ringPulse<=.3){
											this.m_ringAlpha=0.7+this.m_ringPulse;
										}else{
											this.m_ringAlpha=1.3-this.m_ringPulse;
										}
										if(this.m_speedX>0.0){
											this.m_playerFrame=bb_math_Max(bb_functions_Round(6.0-this.m_speedX*0.8),0);
										}else{
											if(this.m_speedX<0.0){
												this.m_playerFrame=bb_math_Min(bb_functions_Round(6.0-this.m_speedX*0.8),12);
											}else{
												this.m_playerFrame=6;
											}
										}
										if(this.m_alive){
											this.p_DrawImageOffset(this.m_player,(bb_jumpblob_WIDTH)*0.5-32.0+this.m_Xoffset,(bb_jumpblob_HEIGHT)*0.5-32.0+this.m_Yoffset,this.m_playerFrame,0.5,0.0);
										}else{
											if((((this.m_deathframe)*.3)|0)<6){
												this.p_DrawImageOffset(this.m_player,(bb_jumpblob_WIDTH)*.5-32.0+this.m_Xoffset,(bb_jumpblob_HEIGHT)*.5-32.0+this.m_Yoffset,(((this.m_deathframe)*.3)|0)+13,0.5,0.0);
											}
										}
										if(this.m_scene>=256 && this.m_editing){
											this.m_font.p_DrawText3("EDITING",(bb_jumpblob_WIDTH)*0.5/this.m_gfxscale,-7.0/this.m_gfxscale,2);
										}else{
											this.m_fontTimer.p_DrawText3(this.m_gametimer.m_time,(bb_jumpblob_WIDTH)/this.m_gfxscale*0.5,0.0,2);
										}
										if(this.m_scene==257){
											bb_graphics_SetAlpha(0.7);
											bb_graphics_DrawRect(0.0,0.0,(bb_jumpblob_WIDTH)/this.m_gfxscale,(bb_jumpblob_HEIGHT)/this.m_gfxscale);
											bb_graphics_SetAlpha(1.0);
											var t_by2=0;
											for(var t_indexB=0;t_indexB<this.m_buttons.length;t_indexB=t_indexB+1){
												t_by2=(((this.m_buttons[t_indexB].m_y)-this.m_Yscroll)|0);
												if(this.m_buttons[t_indexB].m_data==this.m_selectedBlock){
													bb_graphics_DrawImage2(this.m_mapbuttons,(this.m_buttons[t_indexB].m_x),(t_by2),0.0,0.35,0.35,4);
												}
												if(this.m_buttons[t_indexB].m_data==0){
													continue;
												}else{
													if(this.m_buttons[t_indexB].m_data<16){
														bb_graphics_DrawImage2(this.m_blocksSolid,(this.m_buttons[t_indexB].m_x),(t_by2),0.0,0.5,0.5,bb_extrafunctions_BlockFrame(1));
													}
												}
												var t_11=this.m_buttons[t_indexB].m_data;
												if(t_11==1){
												}else{
													if(t_11==28 || t_11==29 || t_11==30 || t_11==31){
														bb_graphics_DrawImage2(this.m_blocksTrans,(this.m_buttons[t_indexB].m_x),(t_by2),270.0,0.5,0.5,bb_extrafunctions_BlockFrame(this.m_buttons[t_indexB].m_data));
													}else{
														if(t_11==32 || t_11==33 || t_11==34 || t_11==35){
															bb_graphics_DrawImage2(this.m_blocksTrans,(this.m_buttons[t_indexB].m_x),(t_by2),180.0,0.5,0.5,bb_extrafunctions_BlockFrame(this.m_buttons[t_indexB].m_data));
														}else{
															if(t_11==36 || t_11==37 || t_11==38 || t_11==39){
																bb_graphics_DrawImage2(this.m_blocksTrans,(this.m_buttons[t_indexB].m_x),(t_by2),90.0,0.5,0.5,bb_extrafunctions_BlockFrame(this.m_buttons[t_indexB].m_data));
															}else{
																if(t_11==40 || t_11==41 || t_11==42 || t_11==43 || t_11==44){
																	bb_graphics_DrawImage2(this.m_blocksSolid,(this.m_buttons[t_indexB].m_x),(t_by2),0.0,0.5,0.5,bb_extrafunctions_BlockFrame(this.m_buttons[t_indexB].m_data));
																}else{
																	if(t_11==46){
																		bb_graphics_DrawImage2(this.m_blocksSolid,(this.m_buttons[t_indexB].m_x),(t_by2),0.0,0.5,0.5,bb_extrafunctions_BlockFrame(44));
																		bb_graphics_DrawImage2(this.m_blocksTrans,(this.m_buttons[t_indexB].m_x),(t_by2),0.0,0.5,0.5,bb_extrafunctions_BlockFrame(this.m_buttons[t_indexB].m_data));
																	}else{
																		bb_graphics_DrawImage2(this.m_blocksTrans,(this.m_buttons[t_indexB].m_x),(t_by2),0.0,0.5,0.5,bb_extrafunctions_BlockFrame(this.m_buttons[t_indexB].m_data));
																	}
																}
															}
														}
													}
												}
											}
										}
										if(this.m_editing){
											if(this.m_scene==256){
												bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,3+this.p_ButtonPressedFrame(true,true));
											}else{
												bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,9);
											}
										}else{
											bb_graphics_DrawImage2(this.m_cornerButtons,0.0,0.0,0.0,0.5,0.5,1+this.p_ButtonPressedFrame(true,true));
										}
										if(this.m_scene>=256){
											if(this.m_editing){
												bb_graphics_DrawImage2(this.m_cornerButtons,(bb_jumpblob_WIDTH)/this.m_gfxscale-64.0,0.0,0.0,0.5,0.5,8);
											}else{
												bb_graphics_DrawImage2(this.m_cornerButtons,(bb_jumpblob_WIDTH)/this.m_gfxscale-64.0,0.0,0.0,0.5,0.5,2+this.p_ButtonPressedFrame(false,true));
											}
										}else{
											bb_graphics_DrawImage2(this.m_cornerButtons,(bb_jumpblob_WIDTH)/this.m_gfxscale-64.0,0.0,0.0,0.5,0.5,0+this.p_ButtonPressedFrame(false,true));
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(this.m_fading){
		bb_graphics_SetAlpha(this.m_screenfade.p_Fade());
		bb_graphics_DrawRect(0.0,0.0,Math.ceil((bb_jumpblob_WIDTH)/bb_graphics_GetMatrix()[0]),Math.ceil((bb_jumpblob_HEIGHT)/bb_graphics_GetMatrix()[0]));
	}
}
c_Game.prototype.p_OnHttpRequestComplete=function(t_req){
	print("UPLOAD: "+this.m_httpPost.p_ResponseText());
	if(this.m_httpPost.p_ResponseText()=="1"){
		this.m_uploadStatus=1;
	}else{
		this.m_uploadStatus=0;
	}
	this.m_httpPost=null;
}
var bb_jumpblob_GAME=null;
function bb_functions_ExitApp(){
	bb_app_EndApp();
}
function bb_graphics_DrawImageRect(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,-t_image.m_tx+t_x,-t_image.m_ty+t_y,t_srcX+t_f.m_x,t_srcY+t_f.m_y,t_srcWidth,t_srcHeight);
	return 0;
}
function bb_graphics_DrawImageRect2(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_rotation,t_scaleX,t_scaleY,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_PushMatrix();
	bb_graphics_Translate(t_x,t_y);
	bb_graphics_Rotate(t_rotation);
	bb_graphics_Scale(t_scaleX,t_scaleY);
	bb_graphics_Translate(-t_image.m_tx,-t_image.m_ty);
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,0.0,0.0,t_srcX+t_f.m_x,t_srcY+t_f.m_y,t_srcWidth,t_srcHeight);
	bb_graphics_PopMatrix();
	return 0;
}
function c_LoadingScreenDelegate(){
	Object.call(this);
}
c_LoadingScreenDelegate.prototype.p_Draw=function(){
}
c_LoadingScreenDelegate.prototype.p_Load=function(){
}
var bb_jumpblob_WIDTH=0;
var bb_jumpblob_HEIGHT=0;
function bb_app_LoadState(){
	return bb_app__game.LoadState();
}
function bb_extrafunctions_BlockList(){
	var t_blockList=[0,1,16,22,2,3,4,5,17,45,46,44,24,25,26,27,40,41,42,43,28,29,30,31,8,9,10,11,32,33,34,35,18,19,20,21,36,37,38,39,47,48,49,50];
	return t_blockList;
}
function c_BitmapFont(){
	Object.call(this);
	this.m_borderChars=[];
	this.m_faceChars=[];
	this.m_shadowChars=[];
	this.m_packedImages=[];
	this.m__drawShadow=true;
	this.m__kerning=null;
	this.m__drawBorder=true;
	this.implments={c_Font:1};
}
c_BitmapFont.prototype.p_LoadPacked=function(t_info,t_fontName,t_dynamicLoad){
	var t_header=t_info.slice(0,t_info.indexOf(",",0));
	var t_separator="";
	var t_2=t_header;
	if(t_2=="P1"){
		t_separator=".";
	}else{
		if(t_2=="P1.01"){
			t_separator="_P_";
		}
	}
	t_info=t_info.slice(t_info.indexOf(",",0)+1);
	this.m_borderChars=new_object_array(65536);
	this.m_faceChars=new_object_array(65536);
	this.m_shadowChars=new_object_array(65536);
	this.m_packedImages=new_object_array(256);
	var t_maxPacked=0;
	var t_maxChar=0;
	var t_prefixName=t_fontName;
	if(string_endswith(t_prefixName.toLowerCase(),".txt")){
		t_prefixName=t_prefixName.slice(0,-4);
	}
	var t_charList=t_info.split(";");
	var t_=t_charList;
	var t_3=0;
	while(t_3<t_.length){
		var t_chr=t_[t_3];
		t_3=t_3+1;
		var t_chrdata=t_chr.split(",");
		if(t_chrdata.length<2){
			break;
		}
		var t_char=null;
		var t_charIndex=parseInt((t_chrdata[0]),10);
		if(t_maxChar<t_charIndex){
			t_maxChar=t_charIndex;
		}
		var t_32=t_chrdata[1];
		if(t_32=="B"){
			this.m_borderChars[t_charIndex]=c_BitMapChar.m_new.call(new c_BitMapChar);
			t_char=this.m_borderChars[t_charIndex];
		}else{
			if(t_32=="F"){
				this.m_faceChars[t_charIndex]=c_BitMapChar.m_new.call(new c_BitMapChar);
				t_char=this.m_faceChars[t_charIndex];
			}else{
				if(t_32=="S"){
					this.m_shadowChars[t_charIndex]=c_BitMapChar.m_new.call(new c_BitMapChar);
					t_char=this.m_shadowChars[t_charIndex];
				}
			}
		}
		t_char.m_packedFontIndex=parseInt((t_chrdata[2]),10);
		if(this.m_packedImages[t_char.m_packedFontIndex]==null){
			this.m_packedImages[t_char.m_packedFontIndex]=bb_graphics_LoadImage(t_prefixName+t_separator+String(t_char.m_packedFontIndex)+".png",1,c_Image.m_DefaultFlags);
			if(t_maxPacked<t_char.m_packedFontIndex){
				t_maxPacked=t_char.m_packedFontIndex;
			}
		}
		t_char.m_packedPosition.m_x=(parseInt((t_chrdata[3]),10));
		t_char.m_packedPosition.m_y=(parseInt((t_chrdata[4]),10));
		t_char.m_packedSize.m_x=(parseInt((t_chrdata[5]),10));
		t_char.m_packedSize.m_y=(parseInt((t_chrdata[6]),10));
		t_char.m_drawingMetrics.m_drawingOffset.m_x=(parseInt((t_chrdata[8]),10));
		t_char.m_drawingMetrics.m_drawingOffset.m_y=(parseInt((t_chrdata[9]),10));
		t_char.m_drawingMetrics.m_drawingSize.m_x=(parseInt((t_chrdata[10]),10));
		t_char.m_drawingMetrics.m_drawingSize.m_y=(parseInt((t_chrdata[11]),10));
		t_char.m_drawingMetrics.m_drawingWidth=(parseInt((t_chrdata[12]),10));
	}
	this.m_borderChars=this.m_borderChars.slice(0,t_maxChar+1);
	this.m_faceChars=this.m_faceChars.slice(0,t_maxChar+1);
	this.m_shadowChars=this.m_shadowChars.slice(0,t_maxChar+1);
	this.m_packedImages=this.m_packedImages.slice(0,t_maxPacked+1);
	return 0;
}
c_BitmapFont.prototype.p_LoadFontData=function(t_Info,t_fontName,t_dynamicLoad){
	if(string_startswith(t_Info,"P1")){
		this.p_LoadPacked(t_Info,t_fontName,t_dynamicLoad);
		return 0;
	}
	var t_tokenStream=t_Info.split(",");
	var t_index=0;
	this.m_borderChars=new_object_array(65536);
	this.m_faceChars=new_object_array(65536);
	this.m_shadowChars=new_object_array(65536);
	var t_prefixName=t_fontName;
	if(string_endswith(t_prefixName.toLowerCase(),".txt")){
		t_prefixName=t_prefixName.slice(0,-4);
	}
	var t_char=0;
	while(t_index<t_tokenStream.length){
		var t_strChar=t_tokenStream[t_index];
		if(string_trim(t_strChar)==""){
			t_index+=1;
			break;
		}
		t_char=parseInt((t_strChar),10);
		t_index+=1;
		var t_kind=t_tokenStream[t_index];
		t_index+=1;
		var t_1=t_kind;
		if(t_1=="{BR"){
			t_index+=3;
			this.m_borderChars[t_char]=c_BitMapChar.m_new.call(new c_BitMapChar);
			this.m_borderChars[t_char].m_drawingMetrics.m_drawingOffset.m_x=(parseInt((t_tokenStream[t_index]),10));
			this.m_borderChars[t_char].m_drawingMetrics.m_drawingOffset.m_y=(parseInt((t_tokenStream[t_index+1]),10));
			this.m_borderChars[t_char].m_drawingMetrics.m_drawingSize.m_x=(parseInt((t_tokenStream[t_index+2]),10));
			this.m_borderChars[t_char].m_drawingMetrics.m_drawingSize.m_y=(parseInt((t_tokenStream[t_index+3]),10));
			this.m_borderChars[t_char].m_drawingMetrics.m_drawingWidth=(parseInt((t_tokenStream[t_index+4]),10));
			if(t_dynamicLoad==false){
				this.m_borderChars[t_char].m_image=bb_graphics_LoadImage(t_prefixName+"_BORDER_"+String(t_char)+".png",1,c_Image.m_DefaultFlags);
				this.m_borderChars[t_char].m_image.p_SetHandle(-this.m_borderChars[t_char].m_drawingMetrics.m_drawingOffset.m_x,-this.m_borderChars[t_char].m_drawingMetrics.m_drawingOffset.m_y);
			}else{
				this.m_borderChars[t_char].p_SetImageResourceName(t_prefixName+"_BORDER_"+String(t_char)+".png");
			}
			t_index+=5;
			t_index+=1;
		}else{
			if(t_1=="{SH"){
				t_index+=3;
				this.m_shadowChars[t_char]=c_BitMapChar.m_new.call(new c_BitMapChar);
				this.m_shadowChars[t_char].m_drawingMetrics.m_drawingOffset.m_x=(parseInt((t_tokenStream[t_index]),10));
				this.m_shadowChars[t_char].m_drawingMetrics.m_drawingOffset.m_y=(parseInt((t_tokenStream[t_index+1]),10));
				this.m_shadowChars[t_char].m_drawingMetrics.m_drawingSize.m_x=(parseInt((t_tokenStream[t_index+2]),10));
				this.m_shadowChars[t_char].m_drawingMetrics.m_drawingSize.m_y=(parseInt((t_tokenStream[t_index+3]),10));
				this.m_shadowChars[t_char].m_drawingMetrics.m_drawingWidth=(parseInt((t_tokenStream[t_index+4]),10));
				var t_filename=t_prefixName+"_SHADOW_"+String(t_char)+".png";
				if(t_dynamicLoad==false){
					this.m_shadowChars[t_char].m_image=bb_graphics_LoadImage(t_filename,1,c_Image.m_DefaultFlags);
					this.m_shadowChars[t_char].m_image.p_SetHandle(-this.m_shadowChars[t_char].m_drawingMetrics.m_drawingOffset.m_x,-this.m_shadowChars[t_char].m_drawingMetrics.m_drawingOffset.m_y);
				}else{
					this.m_shadowChars[t_char].p_SetImageResourceName(t_filename);
				}
				t_index+=5;
				t_index+=1;
			}else{
				if(t_1=="{FC"){
					t_index+=3;
					this.m_faceChars[t_char]=c_BitMapChar.m_new.call(new c_BitMapChar);
					this.m_faceChars[t_char].m_drawingMetrics.m_drawingOffset.m_x=(parseInt((t_tokenStream[t_index]),10));
					this.m_faceChars[t_char].m_drawingMetrics.m_drawingOffset.m_y=(parseInt((t_tokenStream[t_index+1]),10));
					this.m_faceChars[t_char].m_drawingMetrics.m_drawingSize.m_x=(parseInt((t_tokenStream[t_index+2]),10));
					this.m_faceChars[t_char].m_drawingMetrics.m_drawingSize.m_y=(parseInt((t_tokenStream[t_index+3]),10));
					this.m_faceChars[t_char].m_drawingMetrics.m_drawingWidth=(parseInt((t_tokenStream[t_index+4]),10));
					if(t_dynamicLoad==false){
						this.m_faceChars[t_char].m_image=bb_graphics_LoadImage(t_prefixName+"_"+String(t_char)+".png",1,c_Image.m_DefaultFlags);
						this.m_faceChars[t_char].m_image.p_SetHandle(-this.m_faceChars[t_char].m_drawingMetrics.m_drawingOffset.m_x,-this.m_faceChars[t_char].m_drawingMetrics.m_drawingOffset.m_y);
					}else{
						this.m_faceChars[t_char].p_SetImageResourceName(t_prefixName+"_"+String(t_char)+".png");
					}
					t_index+=5;
					t_index+=1;
				}else{
					print("Error loading font! Char = "+String(t_char));
				}
			}
		}
	}
	this.m_borderChars=this.m_borderChars.slice(0,t_char+1);
	this.m_faceChars=this.m_faceChars.slice(0,t_char+1);
	this.m_shadowChars=this.m_shadowChars.slice(0,t_char+1);
	return 0;
}
c_BitmapFont.m_new=function(t_fontDescriptionFilePath,t_dynamicLoad){
	var t_text=bb_app_LoadString(t_fontDescriptionFilePath);
	if(t_text==""){
		print("FONT "+t_fontDescriptionFilePath+" WAS NOT FOUND!!!");
	}
	this.p_LoadFontData(t_text,t_fontDescriptionFilePath,t_dynamicLoad);
	return this;
}
c_BitmapFont.m_new2=function(t_fontDescriptionFilePath){
	var t_text=bb_app_LoadString(t_fontDescriptionFilePath);
	if(t_text==""){
		print("FONT "+t_fontDescriptionFilePath+" WAS NOT FOUND!!!");
	}
	this.p_LoadFontData(t_text,t_fontDescriptionFilePath,true);
	return this;
}
c_BitmapFont.m_new3=function(){
	return this;
}
c_BitmapFont.prototype.p_DrawShadow=function(){
	return this.m__drawShadow;
}
c_BitmapFont.prototype.p_DrawShadow2=function(t_value){
	this.m__drawShadow=t_value;
	return 0;
}
c_BitmapFont.prototype.p_Kerning=function(){
	if(this.m__kerning==null){
		this.m__kerning=c_DrawingPoint.m_new2.call(new c_DrawingPoint);
	}
	return this.m__kerning;
}
c_BitmapFont.prototype.p_Kerning2=function(t_value){
	this.m__kerning=t_value;
}
c_BitmapFont.prototype.p_GetTxtWidth=function(t_text,t_fromChar,t_toChar,t_endOnCR){
	var t_twidth=.0;
	var t_MaxWidth=0.0;
	var t_char=0;
	var t_lastchar=0;
	for(var t_i=t_fromChar;t_i<=t_toChar;t_i=t_i+1){
		t_char=t_text.charCodeAt(t_i-1);
		if(t_char>=0 && t_char<this.m_faceChars.length && t_char!=10 && t_char!=13){
			if(this.m_faceChars[t_char]!=null){
				t_lastchar=t_char;
				t_twidth=t_twidth+this.m_faceChars[t_char].m_drawingMetrics.m_drawingWidth+this.p_Kerning().m_x;
			}
		}else{
			if(t_char==10){
				if(bb_math_Abs2(t_MaxWidth)<bb_math_Abs2(t_twidth)){
					t_MaxWidth=t_twidth-this.p_Kerning().m_x-this.m_faceChars[t_lastchar].m_drawingMetrics.m_drawingWidth+this.m_faceChars[t_lastchar].m_drawingMetrics.m_drawingSize.m_x;
				}
				t_twidth=0.0;
				t_lastchar=t_char;
				if(t_endOnCR){
					return t_MaxWidth;
				}
			}
		}
	}
	if(t_lastchar>=0 && t_lastchar<this.m_faceChars.length){
		if(t_lastchar==32){
		}else{
			if(this.m_faceChars[t_lastchar]!=null){
				t_twidth=t_twidth-this.m_faceChars[t_lastchar].m_drawingMetrics.m_drawingWidth;
				t_twidth=t_twidth+this.m_faceChars[t_lastchar].m_drawingMetrics.m_drawingSize.m_x;
			}
		}
	}
	if(bb_math_Abs2(t_MaxWidth)<bb_math_Abs2(t_twidth)){
		t_MaxWidth=t_twidth-this.p_Kerning().m_x;
	}
	return t_MaxWidth;
}
c_BitmapFont.prototype.p_GetTxtWidth2=function(t_text){
	return this.p_GetTxtWidth(t_text,1,t_text.length,false);
}
c_BitmapFont.prototype.p_DrawCharsText=function(t_text,t_x,t_y,t_target,t_align,t_startPos,t_endPos){
	var t_drx=t_x;
	var t_dry=t_y;
	var t_oldX=t_x;
	var t_xOffset=0;
	if(t_endPos==-1 || t_endPos>t_text.length){
		t_endPos=t_text.length;
	}
	if(t_align!=1){
		var t_lineSepPos=0;
		if(t_endPos!=-1){
			t_lineSepPos=t_endPos;
		}else{
			t_lineSepPos=t_text.indexOf("\n",t_startPos);
		}
		if(t_lineSepPos<0 || t_lineSepPos>t_endPos){
			t_lineSepPos=t_endPos;
		}
		var t_4=t_align;
		if(t_4==2){
			t_xOffset=((this.p_GetTxtWidth(t_text,t_startPos,t_lineSepPos,true)/2.0)|0);
		}else{
			if(t_4==3){
				t_xOffset=((this.p_GetTxtWidth(t_text,t_startPos,t_lineSepPos,true))|0);
			}
		}
	}
	for(var t_i=t_startPos;t_i<=t_endPos;t_i=t_i+1){
		var t_char=t_text.charCodeAt(t_i-1);
		if(t_char>=0 && t_char<=t_target.length){
			if(t_char==10){
				t_dry+=this.m_faceChars[32].m_drawingMetrics.m_drawingSize.m_y+this.p_Kerning().m_y;
				this.p_DrawCharsText(t_text,t_oldX,t_dry,t_target,t_align,t_i+1,t_endPos);
				return 0;
			}else{
				if(t_target[t_char]!=null){
					if(t_target[t_char].p_CharImageLoaded()==false){
						t_target[t_char].p_LoadCharImage();
					}
					if(t_target[t_char].m_image!=null){
						bb_graphics_DrawImage(t_target[t_char].m_image,t_drx-(t_xOffset),t_dry,0);
					}else{
						if(t_target[t_char].m_packedFontIndex>0){
							bb_graphics_DrawImageRect(this.m_packedImages[t_target[t_char].m_packedFontIndex],(-t_xOffset)+t_drx+t_target[t_char].m_drawingMetrics.m_drawingOffset.m_x,t_dry+t_target[t_char].m_drawingMetrics.m_drawingOffset.m_y,((t_target[t_char].m_packedPosition.m_x)|0),((t_target[t_char].m_packedPosition.m_y)|0),((t_target[t_char].m_packedSize.m_x)|0),((t_target[t_char].m_packedSize.m_y)|0),0);
						}
					}
					t_drx+=this.m_faceChars[t_char].m_drawingMetrics.m_drawingWidth+this.p_Kerning().m_x;
				}
			}
		}
	}
	return 0;
}
c_BitmapFont.prototype.p_DrawCharsText2=function(t_text,t_x,t_y,t_mode,t_align,t_init,t_ending){
	if(t_mode==1){
		this.p_DrawCharsText(t_text,t_x,t_y,this.m_borderChars,t_align,t_init,t_ending);
	}else{
		if(t_mode==0){
			this.p_DrawCharsText(t_text,t_x,t_y,this.m_faceChars,t_align,t_init,t_ending);
		}else{
			this.p_DrawCharsText(t_text,t_x,t_y,this.m_shadowChars,t_align,t_init,t_ending);
		}
	}
	return 0;
}
c_BitmapFont.prototype.p_DrawBorder=function(){
	return this.m__drawBorder;
}
c_BitmapFont.prototype.p_DrawBorder2=function(t_value){
	this.m__drawBorder=t_value;
	return 0;
}
c_BitmapFont.prototype.p_DrawText=function(t_text,t_x,t_y,t_align,t_initChar,t_endChar){
	if(this.p_DrawShadow()){
		this.p_DrawCharsText2(t_text,t_x,t_y,2,t_align,t_initChar,t_endChar);
	}
	if(this.p_DrawBorder()){
		this.p_DrawCharsText2(t_text,t_x,t_y,1,t_align,t_initChar,t_endChar);
	}
	this.p_DrawCharsText2(t_text,t_x,t_y,0,t_align,t_initChar,t_endChar);
	return 0;
}
c_BitmapFont.prototype.p_DrawText2=function(t_text,t_x,t_y){
	this.p_DrawText3(t_text,t_x,t_y,1);
	return 0;
}
c_BitmapFont.prototype.p_DrawText3=function(t_text,t_x,t_y,t_align){
	this.p_DrawText(t_text,t_x,t_y,t_align,1,-1);
	return 0;
}
c_BitmapFont.prototype.p_GetFontHeight=function(){
	if(this.m_faceChars[32]==null){
		return 0;
	}
	return ((this.m_faceChars[32].m_drawingMetrics.m_drawingSize.m_y)|0);
}
function bb_app_LoadString(t_path){
	return bb_app__game.LoadString(bb_data_FixDataPath(t_path));
}
function c_BitMapChar(){
	Object.call(this);
	this.m_packedFontIndex=0;
	this.m_packedPosition=c_DrawingPoint.m_new2.call(new c_DrawingPoint);
	this.m_packedSize=c_DrawingPoint.m_new2.call(new c_DrawingPoint);
	this.m_drawingMetrics=c_BitMapCharMetrics.m_new.call(new c_BitMapCharMetrics);
	this.m_image=null;
	this.m_imageResourceName="";
	this.m_imageResourceNameBackup="";
}
c_BitMapChar.m_new=function(){
	return this;
}
c_BitMapChar.prototype.p_SetImageResourceName=function(t_value){
	this.m_imageResourceName=t_value;
	return 0;
}
c_BitMapChar.prototype.p_CharImageLoaded=function(){
	if(this.m_image==null && this.m_imageResourceName!=""){
		return false;
	}else{
		return true;
	}
}
c_BitMapChar.prototype.p_LoadCharImage=function(){
	if(this.p_CharImageLoaded()==false){
		this.m_image=bb_graphics_LoadImage(this.m_imageResourceName,1,c_Image.m_DefaultFlags);
		this.m_image.p_SetHandle(-this.m_drawingMetrics.m_drawingOffset.m_x,-this.m_drawingMetrics.m_drawingOffset.m_y);
		this.m_imageResourceNameBackup=this.m_imageResourceName;
		this.m_imageResourceName="";
	}
	return 0;
}
function c_DrawingPoint(){
	Object.call(this);
	this.m_x=.0;
	this.m_y=.0;
}
c_DrawingPoint.m_new=function(t_x,t_y){
	this.m_x=t_x;
	this.m_y=t_y;
	return this;
}
c_DrawingPoint.m_new2=function(){
	return this;
}
function c_BitMapCharMetrics(){
	Object.call(this);
	this.m_drawingOffset=c_DrawingPoint.m_new2.call(new c_DrawingPoint);
	this.m_drawingSize=c_DrawingPoint.m_new2.call(new c_DrawingPoint);
	this.m_drawingWidth=.0;
}
c_BitMapCharMetrics.m_new=function(){
	return this;
}
function c_Timer(){
	Object.call(this);
	this.m_startmil=0;
	this.m_mil=0;
	this.m_sec=0;
	this.m_min=0;
	this.m_time="";
}
c_Timer.prototype.p_Reset2=function(){
	this.m_startmil=bb_app_Millisecs();
	return 0;
}
c_Timer.m_new=function(){
	this.p_Reset2();
	return this;
}
c_Timer.prototype.p_Update2=function(){
	var t_totalmil=((Math.floor((bb_app_Millisecs()-this.m_startmil)/10.0))|0);
	this.m_mil=(((t_totalmil)-Math.floor((t_totalmil)/100.0)*100.0)|0);
	this.m_sec=((Math.floor((t_totalmil)/100.0))|0);
	this.m_sec=(((this.m_sec)-Math.floor((this.m_sec)/60.0)*60.0)|0);
	this.m_min=((Math.floor((t_totalmil)/6000.0))|0);
	this.m_time=String(this.m_min)+":"+bb_jumpblob_DigitExpand(this.m_sec,2)+"."+bb_jumpblob_DigitExpand(this.m_mil,2);
	return 0;
}
function bb_extrafunctions_Str(t_data){
	return String(t_data);
}
function bb_jumpblob_DigitExpand(t_digit,t_newLength){
	var t_strdigit=bb_extrafunctions_Str(t_digit);
	while(t_strdigit.length<t_newLength){
		t_strdigit="0"+t_strdigit;
	}
	return t_strdigit;
}
function c_Fade(){
	Object.call(this);
	this.m_nextscene=0;
	this.m_alpha=0;
}
c_Fade.m_new=function(t_newscene,t_startalpha){
	this.m_nextscene=t_newscene;
	this.m_alpha=t_startalpha;
	return this;
}
c_Fade.m_new2=function(){
	return this;
}
c_Fade.prototype.p_Update2=function(){
	this.m_alpha+=4;
	if(this.m_alpha-4==100){
		return 1;
	}
	if(this.m_alpha-4==200){
		return 2;
	}else{
		return 0;
	}
}
c_Fade.prototype.p_Fade=function(){
	if(this.m_alpha<=100){
		return (this.m_alpha)*.01;
	}else{
		return (200-this.m_alpha)*.01;
	}
}
function bb_jumpblob_CopyArray(t_sourceArray){
	var t_newArray=new_number_array(t_sourceArray.length);
	for(var t_i=0;t_i<t_sourceArray.length;t_i=t_i+1){
		t_newArray[t_i]=t_sourceArray[t_i];
	}
	return t_newArray;
}
function bb_jumpblob_CopyArray2(t_sourceArray){
	var t_newArray=new_number_array(t_sourceArray.length);
	for(var t_i=0.0;t_i<(t_sourceArray.length);t_i=t_i+1.0){
		t_newArray[((t_i)|0)]=t_sourceArray[((t_i)|0)];
	}
	return t_newArray;
}
function bb_extrafunctions_ToChar(t_digit){
	var t_2=t_digit;
	if(t_2==0){
		return "0";
	}else{
		if(t_2==1){
			return "1";
		}else{
			if(t_2==2){
				return "2";
			}else{
				if(t_2==3){
					return "3";
				}else{
					if(t_2==4){
						return "4";
					}else{
						if(t_2==5){
							return "5";
						}else{
							if(t_2==6){
								return "6";
							}else{
								if(t_2==7){
									return "7";
								}else{
									if(t_2==8){
										return "8";
									}else{
										if(t_2==9){
											return "9";
										}else{
											if(t_2==10){
												return "a";
											}else{
												if(t_2==11){
													return "b";
												}else{
													if(t_2==12){
														return "c";
													}else{
														if(t_2==13){
															return "d";
														}else{
															if(t_2==14){
																return "e";
															}else{
																if(t_2==15){
																	return "f";
																}else{
																	if(t_2==16){
																		return "g";
																	}else{
																		if(t_2==17){
																			return "h";
																		}else{
																			if(t_2==18){
																				return "i";
																			}else{
																				if(t_2==19){
																					return "j";
																				}else{
																					if(t_2==20){
																						return "k";
																					}else{
																						if(t_2==21){
																							return "l";
																						}else{
																							if(t_2==22){
																								return "m";
																							}else{
																								if(t_2==23){
																									return "m";
																								}else{
																									if(t_2==24){
																										return "o";
																									}else{
																										if(t_2==25){
																											return "p";
																										}else{
																											if(t_2==26){
																												return "q";
																											}else{
																												if(t_2==27){
																													return "r";
																												}else{
																													if(t_2==28){
																														return "s";
																													}else{
																														if(t_2==29){
																															return "t";
																														}else{
																															if(t_2==30){
																																return "u";
																															}else{
																																if(t_2==31){
																																	return "v";
																																}else{
																																	if(t_2==32){
																																		return "w";
																																	}else{
																																		if(t_2==33){
																																			return "x";
																																		}else{
																																			if(t_2==34){
																																				return "y";
																																			}else{
																																				if(t_2==35){
																																					return "z";
																																				}else{
																																					if(t_2==36){
																																						return "A";
																																					}else{
																																						if(t_2==37){
																																							return "B";
																																						}else{
																																							if(t_2==38){
																																								return "C";
																																							}else{
																																								if(t_2==39){
																																									return "D";
																																								}else{
																																									if(t_2==40){
																																										return "E";
																																									}else{
																																										if(t_2==41){
																																											return "F";
																																										}else{
																																											if(t_2==42){
																																												return "G";
																																											}else{
																																												if(t_2==43){
																																													return "H";
																																												}else{
																																													if(t_2==44){
																																														return "I";
																																													}else{
																																														if(t_2==45){
																																															return "J";
																																														}else{
																																															if(t_2==46){
																																																return "K";
																																															}else{
																																																if(t_2==47){
																																																	return "L";
																																																}else{
																																																	if(t_2==48){
																																																		return "M";
																																																	}else{
																																																		if(t_2==49){
																																																			return "N";
																																																		}else{
																																																			if(t_2==50){
																																																				return "O";
																																																			}else{
																																																				if(t_2==51){
																																																					return "P";
																																																				}else{
																																																					if(t_2==52){
																																																						return "Q";
																																																					}else{
																																																						if(t_2==53){
																																																							return "R";
																																																						}else{
																																																							if(t_2==54){
																																																								return "S";
																																																							}else{
																																																								if(t_2==55){
																																																									return "T";
																																																								}else{
																																																									if(t_2==56){
																																																										return "U";
																																																									}else{
																																																										if(t_2==57){
																																																											return "V";
																																																										}else{
																																																											if(t_2==58){
																																																												return "W";
																																																											}else{
																																																												if(t_2==59){
																																																													return "X";
																																																												}else{
																																																													if(t_2==60){
																																																														return "Y";
																																																													}else{
																																																														if(t_2==61){
																																																															return "Z";
																																																														}else{
																																																															return "0";
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
function bb_app_SaveState(t_state){
	bb_app__game.SaveState(t_state);
}
function bb_jumpblob_SetSaveState(t_index,t_value){
	if(t_index<0){
		return;
	}
	var t_splitString=bb_app_LoadState().split(",");
	if(t_index>=t_splitString.length){
		t_splitString=resize_string_array(t_splitString,t_index+1);
	}
	t_splitString[t_index]=t_value;
	var t_newSaveState="";
	for(var t_splitIndex=0;t_splitIndex<t_splitString.length;t_splitIndex=t_splitIndex+1){
		t_newSaveState=t_newSaveState+t_splitString[t_splitIndex];
		if(t_splitIndex<t_splitString.length-1){
			t_newSaveState=t_newSaveState+",";
		}
	}
	bb_app_SaveState(t_newSaveState);
}
function c_Button(){
	Object.call(this);
	this.m_x=0;
	this.m_width=0;
	this.m_y=0;
	this.m_height=0;
	this.m_data=0;
	this.m_scene=0;
}
c_Button.m_new=function(){
	return this;
}
function bb_extrafunctions_PointInRect(t_pointx,t_pointy,t_x,t_y,t_width,t_height){
	if(t_pointx>=t_x && t_pointy>=t_y && t_pointx<t_x+t_width && t_pointy<t_y+t_height){
		return true;
	}else{
		return false;
	}
}
function bb_extrafunctions_ToDigit(t_character){
	var t_1=t_character;
	if(t_1=="0" || t_1=="1" || t_1=="2" || t_1=="3" || t_1=="4" || t_1=="5" || t_1=="6" || t_1=="7" || t_1=="8" || t_1=="9"){
		return parseInt((t_character),10);
	}else{
		if(t_1=="a"){
			return 10;
		}else{
			if(t_1=="b"){
				return 11;
			}else{
				if(t_1=="c"){
					return 12;
				}else{
					if(t_1=="d"){
						return 13;
					}else{
						if(t_1=="e"){
							return 14;
						}else{
							if(t_1=="f"){
								return 15;
							}else{
								if(t_1=="g"){
									return 16;
								}else{
									if(t_1=="h"){
										return 17;
									}else{
										if(t_1=="i"){
											return 18;
										}else{
											if(t_1=="j"){
												return 19;
											}else{
												if(t_1=="k"){
													return 20;
												}else{
													if(t_1=="l"){
														return 21;
													}else{
														if(t_1=="m"){
															return 22;
														}else{
															if(t_1=="n"){
																return 23;
															}else{
																if(t_1=="o"){
																	return 24;
																}else{
																	if(t_1=="p"){
																		return 25;
																	}else{
																		if(t_1=="q"){
																			return 26;
																		}else{
																			if(t_1=="r"){
																				return 27;
																			}else{
																				if(t_1=="s"){
																					return 28;
																				}else{
																					if(t_1=="t"){
																						return 29;
																					}else{
																						if(t_1=="u"){
																							return 30;
																						}else{
																							if(t_1=="v"){
																								return 31;
																							}else{
																								if(t_1=="w"){
																									return 32;
																								}else{
																									if(t_1=="x"){
																										return 33;
																									}else{
																										if(t_1=="y"){
																											return 34;
																										}else{
																											if(t_1=="z"){
																												return 35;
																											}else{
																												if(t_1=="A"){
																													return 36;
																												}else{
																													if(t_1=="B"){
																														return 37;
																													}else{
																														if(t_1=="C"){
																															return 38;
																														}else{
																															if(t_1=="D"){
																																return 39;
																															}else{
																																if(t_1=="E"){
																																	return 40;
																																}else{
																																	if(t_1=="F"){
																																		return 41;
																																	}else{
																																		if(t_1=="G"){
																																			return 42;
																																		}else{
																																			if(t_1=="H"){
																																				return 43;
																																			}else{
																																				if(t_1=="I"){
																																					return 44;
																																				}else{
																																					if(t_1=="J"){
																																						return 45;
																																					}else{
																																						if(t_1=="K"){
																																							return 46;
																																						}else{
																																							if(t_1=="L"){
																																								return 47;
																																							}else{
																																								if(t_1=="M"){
																																									return 48;
																																								}else{
																																									if(t_1=="N"){
																																										return 49;
																																									}else{
																																										if(t_1=="O"){
																																											return 50;
																																										}else{
																																											return 0;
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
function bb_nativeui_ShowInput(t_title,t_value,t_type){
}
function bb_nativeui_HasInputFinished(){
	return true;
}
function bb_nativeui_GetInputValue(){
	return "";
}
function c_HttpRequest(){
	Object.call(this);
	this.m__req=null;
	this.m__onComplete=null;
	this.implments={c_IAsyncEventSource:1};
}
c_HttpRequest.m_new=function(){
	return this;
}
c_HttpRequest.prototype.p_Open=function(t_req,t_url,t_onComplete){
	if(((this.m__req)!=null) && this.m__req.IsRunning()){
		error("HttpRequest in progress");
	}
	this.m__req=(new BBHttpRequest);
	this.m__onComplete=t_onComplete;
	this.m__req.Open(t_req,t_url);
}
c_HttpRequest.m_new2=function(t_req,t_url,t_onComplete){
	this.p_Open(t_req,t_url,t_onComplete);
	return this;
}
c_HttpRequest.prototype.p_Send=function(){
	if(!((this.m__req)!=null)){
		error("HttpRequest not open");
	}
	if(this.m__req.IsRunning()){
		error("HttpRequest in progress");
	}
	bb_asyncevent_AddAsyncEventSource(this);
	this.m__req.Send();
}
c_HttpRequest.prototype.p_Send2=function(t_data,t_mimeType,t_encoding){
	if(!((this.m__req)!=null)){
		error("HttpRequest not open");
	}
	if(this.m__req.IsRunning()){
		error("HttpRequest in progress");
	}
	if((t_mimeType).length!=0){
		this.m__req.SetHeader("Content-Type",t_mimeType);
	}
	bb_asyncevent_AddAsyncEventSource(this);
	this.m__req.SendText(t_data,t_encoding);
}
c_HttpRequest.prototype.p_UpdateAsyncEvents=function(){
	if(this.m__req.IsRunning()){
		return;
	}
	bb_asyncevent_RemoveAsyncEventSource(this);
	this.m__onComplete.p_OnHttpRequestComplete(this);
}
c_HttpRequest.prototype.p_ResponseText=function(){
	if(!((this.m__req)!=null)){
		error("HttpRequest not open");
	}
	return this.m__req.ResponseText();
}
function bb_jumpblob_GetSaveState(t_index){
	var t_splitString=bb_app_LoadState().split(",");
	if(t_index>=0 && t_index<t_splitString.length){
		return t_splitString[t_index];
	}
	return "";
}
function bb_uuid_deviceGetUUID(){
	return "NON_ANDROID/IOS";
}
function bb_jumpblob_Device(){
	var t_device=bb_jumpblob_GetSaveState(1);
	if(t_device.length==0){
		t_device=bb_uuid_deviceGetUUID();
		bb_jumpblob_SetSaveState(1,t_device);
	}
	return t_device;
}
function c_Stack10(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack10.m_new=function(){
	return this;
}
c_Stack10.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack10.prototype.p_Equals5=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_Stack10.prototype.p_Contains3=function(t_value){
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		if(this.p_Equals5(this.m_data[t_i],t_value)){
			return true;
		}
	}
	return false;
}
c_Stack10.prototype.p_Push25=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack10.prototype.p_Push26=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push25(t_values[t_offset+t_i]);
	}
}
c_Stack10.prototype.p_Push27=function(t_values,t_offset){
	this.p_Push26(t_values,t_offset,t_values.length-t_offset);
}
c_Stack10.m_NIL=null;
c_Stack10.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack10.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack10.prototype.p_Length2=function(){
	return this.m_length;
}
c_Stack10.prototype.p_Get2=function(t_index){
	return this.m_data[t_index];
}
c_Stack10.prototype.p_RemoveEach=function(t_value){
	var t_i=0;
	var t_j=this.m_length;
	while(t_i<this.m_length){
		if(!this.p_Equals5(this.m_data[t_i],t_value)){
			t_i+=1;
			continue;
		}
		var t_b=t_i;
		var t_e=t_i+1;
		while(t_e<this.m_length && this.p_Equals5(this.m_data[t_e],t_value)){
			t_e+=1;
		}
		while(t_e<this.m_length){
			this.m_data[t_b]=this.m_data[t_e];
			t_b+=1;
			t_e+=1;
		}
		this.m_length-=t_e-t_b;
		t_i+=1;
	}
	t_i=this.m_length;
	while(t_i<t_j){
		this.m_data[t_i]=c_Stack10.m_NIL;
		t_i+=1;
	}
}
var bb_asyncevent__sources=null;
function bb_asyncevent_AddAsyncEventSource(t_source){
	if(bb_asyncevent__sources.p_Contains3(t_source)){
		error("Async event source is already active");
	}
	bb_asyncevent__sources.p_Push25(t_source);
}
function bb_nativeui_ShowMessage(t_message,t_title){
}
function bb_math_Clamp(t_n,t_min,t_max){
	if(t_n<t_min){
		return t_min;
	}
	if(t_n>t_max){
		return t_max;
	}
	return t_n;
}
function bb_math_Clamp2(t_n,t_min,t_max){
	if(t_n<t_min){
		return t_min;
	}
	if(t_n>t_max){
		return t_max;
	}
	return t_n;
}
function bb_jumpblob_CreateButton(t_x,t_y,t_width,t_height,t_scene,t_data){
	var t_newbutton=c_Button.m_new.call(new c_Button);
	t_newbutton.m_x=t_x;
	t_newbutton.m_y=t_y;
	t_newbutton.m_width=t_width;
	t_newbutton.m_height=t_height;
	t_newbutton.m_scene=t_scene;
	t_newbutton.m_data=t_data;
	return t_newbutton;
}
function bb_functions_Round(t_flot){
	return ((Math.floor(t_flot+0.5))|0);
}
function bb_random_Rnd(){
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	return (bb_random_Seed>>8&16777215)/16777216.0;
}
function bb_random_Rnd2(t_low,t_high){
	return bb_random_Rnd3(t_high-t_low)+t_low;
}
function bb_random_Rnd3(t_range){
	return bb_random_Rnd()*t_range;
}
function bb_functions_Rand(t_low,t_high){
	var t_v=bb_random_Rnd2((t_low),(t_high));
	if(t_v<0.0){
		t_v-=1.0;
	}
	var t_vi=((t_v)|0);
	if(t_vi==t_low-1){
		t_vi=bb_math_Min(-1,t_high);
	}
	return t_vi;
}
var bb_asyncevent__current=null;
function bb_asyncevent_UpdateAsyncEvents(){
	if((bb_asyncevent__current)!=null){
		return 0;
	}
	var t_i=0;
	while(t_i<bb_asyncevent__sources.p_Length2()){
		bb_asyncevent__current=bb_asyncevent__sources.p_Get2(t_i);
		bb_asyncevent__current.p_UpdateAsyncEvents();
		if((bb_asyncevent__current)!=null){
			t_i+=1;
		}
	}
	bb_asyncevent__current=null;
	return 0;
}
function c_eDrawAlign(){
	Object.call(this);
}
function c_eDrawMode(){
	Object.call(this);
}
function bb_graphics_DrawLine(t_x1,t_y1,t_x2,t_y2){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawLine(t_x1,t_y1,t_x2,t_y2);
	return 0;
}
function bb_extrafunctions_BlockFrame(t_blockid){
	var t_3=t_blockid;
	if(t_3==1){
		return t_blockid;
	}else{
		if(t_3==2 || t_3==3 || t_3==4 || t_3==5){
			return t_blockid-2;
		}else{
			if(t_3==8 || t_3==9 || t_3==10 || t_3==11){
				return t_blockid+4;
			}else{
				if(t_3==24 || t_3==25 || t_3==26 || t_3==27 || t_3==28 || t_3==29 || t_3==30 || t_3==31 || t_3==32 || t_3==33 || t_3==34 || t_3==35 || t_3==36 || t_3==37 || t_3==38 || t_3==39){
					return t_blockid % 4;
				}else{
					if(t_3==16 || t_3==17){
						return t_blockid+6;
					}else{
						if(t_3==22 || t_3==23){
							return t_blockid+2;
						}else{
							if(t_3==18 || t_3==19 || t_3==20 || t_3==21){
								return t_blockid-10;
							}else{
								if(t_3==47 || t_3==48 || t_3==49 || t_3==50){
									return t_blockid-31;
								}else{
									if(t_3==40){
										return 7;
									}else{
										if(t_3==41){
											return 0;
										}else{
											if(t_3==42){
												return 5;
											}else{
												if(t_3==43){
													return 3;
												}else{
													if(t_3==44){
														return 2;
													}else{
														if(t_3==45){
															return 21;
														}else{
															if(t_3==46){
																return 20;
															}else{
																return 24;
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
function bb_graphics_GetMatrix(){
	return [bb_graphics_context.m_ix,bb_graphics_context.m_iy,bb_graphics_context.m_jx,bb_graphics_context.m_jy,bb_graphics_context.m_tx,bb_graphics_context.m_ty];
}
function bb_graphics_GetMatrix2(t_matrix){
	t_matrix[0]=bb_graphics_context.m_ix;
	t_matrix[1]=bb_graphics_context.m_iy;
	t_matrix[2]=bb_graphics_context.m_jx;
	t_matrix[3]=bb_graphics_context.m_jy;
	t_matrix[4]=bb_graphics_context.m_tx;
	t_matrix[5]=bb_graphics_context.m_ty;
	return 0;
}
function bb_asyncevent_RemoveAsyncEventSource(t_source){
	if(t_source==bb_asyncevent__current){
		bb_asyncevent__current=null;
	}
	bb_asyncevent__sources.p_RemoveEach(t_source);
}
function bbInit(){
	bb_reflection__classesMap=null;
	bb_reflection__classes=[];
	bb_reflection__getClass=null;
	bb_reflection__boolClass=null;
	bb_reflection__intClass=null;
	bb_reflection__floatClass=null;
	bb_reflection__stringClass=null;
	bb_reflection__functions=[];
	bb_reflection__init=bb_reflection___init();
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_framework_diddyGame=null;
	bb_reflection__unknownClass=(c_UnknownClass.m_new.call(new c_UnknownClass));
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_app__devWidth=0;
	bb_app__devHeight=0;
	bb_app__displayModes=[];
	bb_app__desktopMode=null;
	bb_graphics_renderDevice=null;
	bb_framework_DEVICE_WIDTH=.0;
	bb_framework_DEVICE_HEIGHT=.0;
	bb_framework_SCREEN_WIDTH=.0;
	bb_framework_SCREEN_HEIGHT=.0;
	bb_framework_SCREEN_WIDTH2=.0;
	bb_framework_SCREEN_HEIGHT2=.0;
	bb_framework_SCREENX_RATIO=1.0;
	bb_framework_SCREENY_RATIO=1.0;
	bb_random_Seed=1234;
	bb_framework_dt=null;
	bb_app__updateRate=0;
	c_Particle.m_MAX_PARTICLES=800;
	c_Particle.m_particles=new_object_array(c_Particle.m_MAX_PARTICLES);
	c_FPSCounter.m_startTime=0;
	c_FPSCounter.m_fpsCount=0;
	c_FPSCounter.m_totalFPS=0;
	c_Stack7.m_NIL=null;
	c_Stack8.m_NIL=null;
	c_SoundPlayer.m_channel=0;
	c_TweenManager.m_DefaultManager=c_TweenManager.m_new.call(new c_TweenManager);
	c_Stack9.m_NIL=null;
	c_SoundBank.m_path="sounds/";
	bb_framework_defaultFadeTime=600.0;
	bb_jumpblob_GAME=null;
	bb_jumpblob_WIDTH=0;
	bb_jumpblob_HEIGHT=0;
	bb_asyncevent__sources=c_Stack10.m_new.call(new c_Stack10);
	bb_asyncevent__current=null;
	c_Stack10.m_NIL=null;
}
//${TRANSCODE_END}
