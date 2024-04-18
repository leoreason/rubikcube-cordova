/*              ·~=≠≠x#≠≠=-                         ·=≈≠xxx≠≈~-·              
            ·~≠#%&$$$$&%x≈~·                        ~=≠#%$$$$$&%x≈-           
          ~x&$$$$$$$x~·  -%~                        #≈   -≈&$$$$$$$#≈·        
        =%$$$$$$$$$$-  -≠$$-                        x$%=·  x$$$$$$$$$&≠-      
      -%$$$$$$$$$$$$$%%$$$≈                         ·&$$&%&$$$$$$$$$$$$&≠     
     ·&$$$$$$$$$$$$$$$$$&=                           ·#$$$$$$$$$$$$$$$$$$≈    
     ≈$$$$$$$$$$$$$$$$$#-                              ≈&$$$$$$$$$$$$$$$$$    
     ≈$$$$$$$$$$$$$$$$$                                 ≈$$$$$$$$$$$$$$$$$    
     ·%$$$$$$$$$$$$$$$≈                                  &$$$$$$$$$$$$$$$=    
      ~#$$$$$$$$$$$$&≈                                   ·#$$$$$$$$$$$$&x     
      #%%%&&$$$$$&%≈-     =-   ·-=≈≈xxxxxx≠≠=~-·  -=       =x%$$$$$$&&%%&-    
      ≈$$&&%###≠~-       ·$&≈x%&$$$$$$$$$$$$$$$%#≠&$-        ·-≈###%&&$$%     
       #$$$$$$$x        ·≈$$$$$$$$$$$$$$$$$$$$$$$$$$%≈-        -$$$$$$$$~     
       ·x&$$&&%##≈-   ~x&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#=·  ·=x#%&&&$&%=      
         -%&$$$$$$$≠=%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&x≈%$$$$$$$&≈        
           -=≠x#%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%#≠=~·         
             ·~≠%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%≠=-·          
≈====≈≠≠≠xx#%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&%%#xx≠≠≈=≈
%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&%
 ··-=x%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%x=-·· 
       -≈#&$$$$$$$$$$$$$$$$$$$$&$$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$&#≈-       
          ·=%$$$$$$$$$$$$$$$$$$%=x%$$$$$$$$%≠~%$$$$$$$$$$$$$$$$$$%=·          
     ·-~≈≠x#%$$$$$$$$$$$$$$$$$$$x  -x$$$$≠·  x$$$$$$$$$$$$$$$$$$$%#x≠≈~-·     
   =≠&$$$$$%%%&$&%$$$$$$$$$$$$$$$%≠≠%$$$$%≠≠&$$$$$$$$$$$$$$$%&$&%%%$$$$$&≠~   
  -$&$&#≠==x&$$%%$$~~≠#&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&#≠~~$$%%$$&x==≠#%$%$=  
  ≈$$$~  ≈%$$#x&$$~    ·-=≠#%&&$$$$$$$$$$$$$$$$&%%#≠=-·    ~$$&x#$$%≈  -$$$x  
  ≠$$≠  #$$%-~%$#~           ··-~~==========~~-··           ~#$%~·%$$#  =$$#  
  ≠$%  ·$$#·-$&≈                                              ≠&$-·#$$·  #$#  
  ≈$=  ~$%  -$&                                                &$·  %$~  -$x  
  -&   ~$~   &≠                                                #%   ~$~   #=*/




/*


	TWIST NOTATION

	UPPERCASE = Clockwise to next 90 degree peg
	lowercase = Anticlockwise to next 90 degree peg



	FACE & SLICE ROTATION COMMANDS

	F	Front
	S 	Standing (rotate according to Front Face's orientation)
	B 	Back
	
	L 	Left
	M 	Middle (rotate according to Left Face's orientation)
	R 	Right
	
	U 	Up
	E 	Equator (rotate according to Up Face's orientation)
	D 	Down



	ENTIRE CUBE ROTATION COMMANDS
	
	X   Rotate entire cube according to Right Face's orientation
	Y   Rotate entire cube according to Up Face's orientation
	Z   Rotate entire cube according to Front Face's orientation



	NOTATION REFERENCES

	http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
	http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation


*/


function MyControls(){

	return function ( object, camera, domElement ) {
		var	mouse	 	 = new THREE.Vector2(),
			mouseStart	 = new THREE.Vector2(),
			twistonce	 = false;
			projector = new ERNO.Projector( object, domElement ),
			api = {
				enabled: true,
				domElement: domElement,
			};

		api.update = function(){
			return;
		};

		function translateviewcoor(x, y, vector){
			var view = api.domElement !== document ? api.domElement.getBoundingClientRect() : {
				left: 0,
				top: 0,
				width: window.innerWidth,
				height: window.innerHeight
			};
			return vector.set(
				(2*(x-view.left) - view.width) / view.width,
				(view.height - 2*(y-view.top)) / view.height
			);
		}

		function onmove(direction) {
			var direction = new THREE.Vector2( mouse.x-mouseStart.x, mouse.y-mouseStart.y);
			if (Math.abs(direction.x) < 0.1 && Math.abs(direction.y) < 0.1)
				return;
			if (Math.abs(direction.x) > Math.abs(direction.y))
			{
				d = direction.x * mouseStart.y;
				d = d / Math.abs(d);
				object.twist(d>0?"Y":"y")
			}else{
				d = direction.y * mouseStart.x;
				d = d / Math.abs(d);
				object.twist(d>0?"x":"X")
			}
			twistonce = true;
		}

		function mousedown( event ) {
			if (!api.enabled || event.which !== 1 )
				return;
			var x = ( event.touches && event.touches[0] || event ).clientX,
				y = ( event.touches && event.touches[0] || event ).clientY;
			if( projector.getIntersection( camera, x, y ) === null ){
				twistonce = false;
				translateviewcoor(x, y, mouseStart);
				api.domElement.removeEventListener( 'mousedown', mousedown );
				document.addEventListener( 'mousemove', mousemove );
				document.addEventListener( 'mouseup', mouseup );
			}
		}

		function mousemove( event ) {
			var x = ( event.touches && event.touches[0] || event ).clientX,
				y = ( event.touches && event.touches[0] || event ).clientY;
			if ( api.enabled && !twistonce){
				event.preventDefault();
				translateviewcoor(x, y, mouse);
				onmove();
			}
		}

		function mouseup( event ) {
			document.removeEventListener( 'mousemove', mousemove );
			document.removeEventListener( 'mouseup', mouseup );
			api.domElement.addEventListener( 'mousedown', mousedown );
		}

		function clearEventBubble(evt) { 
			if (evt.stopPropagation) { evt.stopPropagation(); }
			else { evt.cancelBubble = true; }
			if (evt.preventDefault) { evt.preventDefault(); }
			else { evt.returnValue = false; }
		}

		function touchstart( event ) {
			var x = ( event.touches && event.touches[0] || event ).clientX,
				y = ( event.touches && event.touches[0] || event ).clientY;

			if ( api.enabled && projector.getIntersection( camera, x, y) === null ){
				twistonce = false;
				translateviewcoor(x, y, mouseStart);
				api.domElement.removeEventListener( 'touchstart', touchstart);
				document.addEventListener( 'touchend', touchend );
				document.addEventListener( 'touchmove', touchmove );
			}
			clearEventBubble(event);
		}

		function touchmove( event ) {
			var x = ( event.touches && event.touches[0] || event ).clientX,
				y = ( event.touches && event.touches[0] || event ).clientY;
			if ( api.enabled && !twistonce){
				translateviewcoor(x, y, mouse);
				onmove();
			}
			clearEventBubble(event);
		}

		function touchend( event ) {
			document.removeEventListener( 'touchend', touchend );
			document.removeEventListener( 'touchmove', touchmove );
			api.domElement.addEventListener( 'touchstart', touchstart );
			clearEventBubble(event);
		}

		api.domElement.addEventListener( 'mousedown', mousedown );
		api.domElement.addEventListener( 'touchstart', touchstart, {passive: true});
		return api;
	};

}



$(document).ready( function(){ 
	var ua = navigator.userAgent,
		isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

	window.cube = new ERNO.Cube({
		hideInvisibleFaces: true,
		controls: MyControls(),
		twistDuration: 300,
		renderer: isIe ? ERNO.renderers.IeCSS3D : null
	});

	var container = document.getElementById( 'container' );
	container.appendChild( cube.domElement );

	var fixedOrientation = new THREE.Euler(  Math.PI * 0.15, - Math.PI * 0.15, 0 );
	cube.object3D.lookAt( cube.camera.position );
	cube.rotation.x += fixedOrientation.x;
	cube.rotation.y += fixedOrientation.y;
	cube.rotation.z += fixedOrientation.z;


	
	// The deviceMotion function provide some subtle mouse based motion
	// The effect can be used with the Freeform and Locked controls.
	// This could also integrate device orientation on mobile

	// var motion = deviceMotion( cube, container );

	// motion.decay = 0.1; 				// The drag effect
	// motion.range.x = Math.PI * 0.06;	// The range of rotation 
	// motion.range.y = Math.PI * 0.06;
	// motion.range.z = 0;
	// motion.paused = false;				// disables the effect

	console.log(window.cube);
	

})
