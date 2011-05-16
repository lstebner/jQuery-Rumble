(function($){
	/**
	* Copyright (c) Luke Stebner 2011 - lukestebner.com - luke.stebner@gmail.com
	*
	* jQuery Rumble Plugin
	*
	* This plugin creates a "rumble" effect on whatever element it is called on. A rumble
	* is a few shakes back and forth, great for grabbing a users attention to a flash message
	* or errors during form validation.
	*
	* Options:
	*	- distance: The number of pixels to move on each shake (default: 4)
	*	- shakes: The number of shakes to do (default: 3)
	* 	- Speed: The number of milliseconds to make each shake last (default: 100)
	*	- autoStart: Shake immediately or wait (default: true)
	* 	- onComplete: Callback for when rumble is complete
	* 	- axis: The axis to shake on (default: 'x')
	*	- shrinkDistance: If the shake distance should decrease throughout the rumble
	*			- This is feature is hard to notice on quick, short shakes. But for
	*			  wider shakes, it makes it a little smoother. An easing of sorts.
	*	- rumbleClass: The class to add to the element while it's rumbling (default: 'rumbling')
	* 	- position: How to position the rumbling element (default: 'relative')
	* 			- *must be 'absolute' or 'relative' or the CSS animations may not work properly
	*
	* Methods:
	*	- rumble: Do the rumble
	*	- stop: Kill the rumble
	*/
	$.fn.rumble = function(opts, args){
		if (!opts){ opts = {}; }
		var $self = this;

		var defaults = {
			distance: 4,
			shakes: 3,
			speed: 100,
			autoStart: true,
			onComplete: null,
			axis: 'x',
			shrinkDistance: false,
			rumbleClass: 'rumbling',
			position: 'relative'
		};

		var settings = this.data('rumble');

		var methods = {
			//initialize
			init: function(){
				settings = defaults;
				settings.origin = $self.position();
				
				methods.updateSettings(opts);
				
				//animation won't work right if the element isn't positioned correctly
				var pos = $self.css('position');
				if (pos != 'relative' || pos != 'absolute'){
					$self.css('position', settings.position);
				}
				
				//start the rumble immediately?
				if (settings.autoStart){
					methods.rumble();
				}
				
				return $self;
			},
			//update settings data
			updateSettings: function(opts){
				settings = $.extend(settings, opts);
				$self.data('rumble', settings);
			},
			//do rumble
			rumble: function(args){
				if (args){
					methods.updateSettings(args);
				}
				
				var dest = 0;
				var animateTo = {};
				
				//add class to signify it's currently rumbling
				$self.addClass( settings.rumbleClass );
				
				//go through the desired number of shakes
				for (var i = 0; i < settings.shakes; i++){
					//build the destination string for the animation
					if (i % 2 == 0){
						dest = '+=';
					}
					else{
						dest = '-=';
					}
					
					//if it's the first shake, we are starting in the middle, so we calculate to move
					//the desired distance
					if (i == 0){
						dest += settings.distance.toString() + 'px';
					}
					//for all of the other shakes, we need to move back to origin and then beyond, so
					//we calculate 2x the desired distance
					else{
						dest += (settings.distance * 2).toString() + 'px';
					}
					
					//set destination based on movement requested axis
					if (settings.axis == 'y'){
						animateTo = { top: dest };
					}
					else{
						animateTo = { left: dest };
					}
					
					//apply the animation
					$self.animate( animateTo, {
						queue:true,
						duration: settings.speed
					} );
					
					//check to see if shake distance should shrink after each shake
					if (settings.shrinkDistance && settings.distance > 1){
						settings.distance--;
					}
				} // end for settings.shakes
				
				//after all the shakes, we will need to return to the origin position so calculate here
				//how to get back there
				if (dest.charAt(0) == '+'){
					dest = '-=';
				}
				else{
					dest = '+=';
				}
				dest += settings.distance.toString() + 'px';
			
				//set destination based on requested axis movement
				if (settings.axis == 'y'){
					animateTo = { top:dest };
				}
				else{
					animateTo = { left:dest };
				}
				
				//apply the final animation
				$self.animate( animateTo, {
					queue: true,
					duration: settings.speed,
					complete: function(){
						if ( settings.onComplete ){
							settings.onComplete();
						}
						
						$self.position( settings.origin );
						$self.removeClass( settings.rumbleClass );
					}
				} );
				
				return $self;
			},
			//force stop
			stop: function(){
				//return to origin position if needed
				if ($self.position != $self.origin){
					$self.position( settings.origin );
				}
				
				//make sure class is gone
				$self.removeClass( settings.rumbleClass );
				
				//kill all hanging animations
				$self.stop( true );
				
				return $self;
			}
		};

		if (typeof(opts) == 'string'){
			if (opts in methods){
				return methods[opts](args);
			}
			
			return $self;
		}
		
		return methods.init();
	}
})( jQuery );