//Datascroll v 1.1.0
/*

SYNTAX:

<div class="panel" data-panel-twin=".panelTwin">
	<div class="animated" data-animation="{property = time:value, time:value, time:value}, {property = time:value, time:value}"  data-animation-easing="ease" data-animation-round="false" data-animation-target="#target">
		CONTENT
	</div>
</div>

*/

//TODO
// - panel defaults to self unless specified


var debug = true; 			// Enable various console.log commands as well as leaving the data attributes on elements in place.

var page = {
	currentY:0,						//current Y of the page
	scrollRatio:0,				//ratio to ensure top is 0 and bottom is 1
	height:0,							//height of the page in pixels
	resizeClock:0					//clock to run the resize method
};

//The master animations array
var animations = new Array();

//Array extension to remove blank values
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


var Animation = function(panel, el, target, start, end, duration, animationString, easing, round) {

	//The panel of the element
	this.panel = panel;

	//The element with the animation
	this.el = el;

	//The element to animate
	this.target = target;

	//The start of the animation (based on Y)
	this.start = start;

	//The end of the animation
	this.end = end;

	//The duration of the animation 
	this.duration = duration;

	if(animationString != '') {

		//Clean up the animation string
		var cleanAnimation = animationString.replace(/ /g,'').replace(/\)/g,') ').replace(/ \//g, '/').replace(/\s+$/, '');

		//The style attribute to animate
		this.animationAttribute = cleanAnimation.split('=').shift();

		//Set will-change for the target
		this.target.style.willChange = += this.animationAttribute;

		//Define the value type
		if(cleanAnimation.indexOf('(') !== -1) {
			this.animationValueType = 'function';
		} else {
			this.animationValueType = 'value';
		}

		//The JSON animation itself
		var keyframeArray = cleanAnimation.split('=').pop().split(/,+(?![^\(]*\))/g);
		var output = '';
		for(var i = 0; i < keyframeArray.length; i++) {
			var data = keyframeArray[i].split(':');

			if(this.animationValueType == 'value') {
				output += '{"time":"' + data[0] + '","value":"' + data[1] + '"}';
			} else {
				var values = '[';
				var functions = data[1].split(/ /g).clean('');
				for(var f = 0; f < functions.length; f++) {

					//function name
					values += '{"functionName":"';
					values += functions[f].match(/([a-zA-Z0-9])+/g)[0];

					//function values
					values += '","values":[';

					//make array of values
					var funcVals = functions[f].match(/\((.*?)\)/g)[0].replace(/[\(\)]/g, '').split(/,/g).clean('');
					for(var v = 0; v < funcVals.length; v++) {
						values += '"' + funcVals[v] + '"';
						if(v < funcVals.length - 1) {
							values += ',';
						}
					}
					values += ']}';
					if(f < functions.length - 1) {
						values += ',';
					}
				}
				values += ']';
				output += '{"time":"' + data[0] + '","values":' + values + ',"staticValue":"' + data[1] + '"}';
			}

			if(i < keyframeArray.length-1) {
				output += ',';
			}
		}
		this.animation = JSON.parse('{"keyframes":[' + output + ']}');

		//The animation easing function
		this.easing = easing;

		//Whether or not to round the values
		this.round = round;
	}

	//Whether we are before, during, or after the animation
	this.animationStatus = 'during';
	

	if(debug) {
		console.log(this);
	}

};

Animation.prototype.animationStart = function() {
	return this.start + this.animation.keyframes[0].time * this.duration;
};

Animation.prototype.animationEnd = function() {
	return this.start + this.animation.keyframes[this.animation.keyframes.length - 1].time * this.duration;
}

Animation.prototype.getUnits = function(searchString) {
	//cycle through all units possible
	var units = ['px', 'em', '%', 'deg', 'turn', 'vw', 'vh', 'vmin', 'vmax'];
	for(var u = 0; u < units.length; u++) {
		if(searchString.indexOf(units[u]) !== -1) {
			return units[u];
		}
	}
	
	//Apparently, there are no units
	return '';
}

Animation.prototype.render = function(y, src) {

	//Temporary State variable
	var s = 'during';
	if(y > this.start + this.animation.keyframes[this.animation.keyframes.length - 1].time * this.duration) {
		s = 'after';
	} else if(y < this.start + this.animation.keyframes[0].time * this.duration) {
		s = 'before';
	}

	//Either this is the first animation to render from init(), 
	//or we are rendering from update().
	if((src == 'init' && this.target.style[this.animationAttribute] == '') || src == 'update') {
		//If we've changed to before or after
		if(this.animationStatus != s && (s == 'before' || s == 'after')) {

				if(s == 'after') {

					//OnAfter
					if(this.animationValueType == 'value') {
						this.target.style[this.animationAttribute] = this.animation.keyframes[this.animation.keyframes.length - 1].value;
					} else {
						this.target.style[this.animationAttribute] = this.animation.keyframes[this.animation.keyframes.length - 1].staticValue;
					}

				} else {

					//OnBefore
					if(this.animationValueType == 'value') {
						this.target.style[this.animationAttribute] = this.animation.keyframes[0].value;
					} else {
						this.target.style[this.animationAttribute] = this.animation.keyframes[0].staticValue;
					}


				}

		} else {

			if(s != this.animationStatus) {
				//OnDuring
				
			}


			//Relative progress of the animation
			var p = (y - this.start) / this.duration,
					before = this.animation.keyframes[0],
					after = this.animation.keyframes[this.animation.keyframes.length - 1];


			for(var i = 0; i < this.animation.keyframes.length; i++) {
				var k = this.animation.keyframes[i];

				if(k.time == p) {		//We're at the exact time of the keyframe

					//Set the value to the keyframes value, end the function.
					if(this.animationValueType == 'value') {
						this.el.style[this.animationAttribute] = k.value;
					} else {
						this.el.style[this.animationAttribute] = k.staticValue;
					}
					return;

				} else { //We're not at the exact time of the keyframe
					if(k.time < p) {//We're before the keyframe
						if(parseFloat(k.time) > parseFloat(before.time)) {
								before = k;
							}
					} else {//We're after the keyframe
						if(parseFloat(k.time) < parseFloat(after.time)) {
							after = k;
						}
					}
				}
			}

			//There was no exact match, interpolate
			var kp = (p - before.time) / (after.time - before.time), val;

			//Adjust kp based on easing
			switch (this.easing) {
				case 'easeIn':
					kp = Math.pow(kp, 2);
					break;
				case 'easeOut':
					kp = -(Math.pow((kp-1), 2) -1);
					break;
				case 'ease':
					if ((kp/=0.5) < 1) { 
						kp = 0.5*Math.pow(kp,2); 
					} else {
						kp = -0.5 * ((kp-=2)*kp - 2);
					}	
					break;
			}

			var val = '';

			if(this.animationValueType == 'function') {

				//Loop through functions
				for(var v = 0; v < before.values.length; v++) {

					var bValue = before.values[v],
							aValue = after.values[v];

					//Add function name
					val += bValue.functionName + '(';

					

					//interpolate all values
					for(var w = 0; w < bValue.values.length; w++) {
						//calculate lerp value
						var tval = (parseFloat(bValue.values[w]) * (1 - kp) + parseFloat(aValue.values[w]) * kp);

						//round
						if(this.round) {
							tval = Math.round(tval);
						}

						//append to output with units
						val += tval + this.getUnits(bValue.values[w]);

						//if there are more values, add a comma
						if(w < bValue.values.length - 1) {
							val += ',';
						}
					}

					//close function
					val += ')';

					//if there are more functions, add a space
					if(v < before.values.length - 1) {
						val += ' ';
					}
				}
			} else {
				//Set the value to the interpolation between before and after
				val = (parseFloat(before.value) * (1 - kp) + parseFloat(after.value) * kp) + this.getUnits(before.value);
			}

			//Finally, set the value
			this.target.style[this.animationAttribute] = val;
		}
	}


	this.animationStatus = s;
}





function transformAnimation(p,a) {

	//Rect of the panel in question
	var r = p.getBoundingClientRect();

	//Start of the panel (when the top border comes in to the bottom of the screen)
	var t = ((r.top + window.pageYOffset) - window.innerHeight) / page.height * page.scrollRatio;

	//End of the panel (when the bottom border leaves the top of the screen)
	var b = (r.bottom + window.pageYOffset) / page.height * page.scrollRatio;

	//How tall the panel is in % of page height
	var h = b - t;

	//Set the start and duration of the animation object
	a.start = t;
	a.end = b;
	a.duration = h;
}


function generateAnimations(panel, el) {

	//If there is a twin specified, switch to that panel
	var t = panel.dataset.panelTwin;
	if(t) {
		panel = $(t);
	}

	//If there is a animation target specified, set it. Otherwise, default to the element.
	var target = el;
	if(el.dataset.animationTarget) {
		target = $(el.dataset.animationTarget);
	}

	//Split the animations into an array
	var elAnimations = (el.dataset.animation) ? el.dataset.animation.split(/,+(?![^\{]*\})/g) : '';

	//Create a unique animation object for each property to be animated, and add it to the array
	for(var i = 0; i < elAnimations.length; i++) {
		var animStr = elAnimations[i].replace('{','').replace('}','');
		var anim = new Animation(
			panel, //panel
			el, //element
			target, //target
			0, //start
			1, //end
			1, //duration
			animStr, //string of the animation 
			el.dataset.animationEasing || 'ease', //easing
			el.dataset.animationRound || false	//round
		);

		//Transform the animation into global page space
		transformAnimation(panel, anim);

		//Render the animation from the top of the page 
		//to ensure correct initialization
		anim.render(0, 'init');

		//Add animation to the array
		animations.push(anim);
	}

	//If not in debug mode, remove all of the animation attributes/class
	if(!debug) {
		el.removeAttribute('data-animation');
		el.removeAttribute('data-animation-easing');
		el.removeAttribute('data-animation-round');
		el.removeAttribute('data-animation-target');
		el.className = el.className.replace('animated', '');
	}


}


function initAnimations() {

	//Store the global height of the page, this will be changed when the window resizes
	page.height = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
	if(debug) {
		console.log('Page Height:', page.height);
	}
	//Set the scroll ratio to ensure top of page is 0% and bottom is 100%
	page.scrollRatio = (page.height) / ( page.height - window.innerHeight);
	if(debug) {
		console.log('Scroll Ratio:', page.scrollRatio);
	}

	//Store the current y for the page in %
	page.currentY = window.pageYOffset / page.height * page.scrollRatio;


	//Generate the animation objects that have panels
	$$('.panel').forEach(function(p) {
		$$('.animated', p).forEach(function(a) { 
			generateAnimations(p,a);
		});
	});

	//Render the animations from the correct pageY value
	//inside init() to avoid FOUC
	animations.forEach(function(a) {
		a.render(page.currentY, 'update');
	});

}


function updateAnimations() {

	//Store the current y for the page in %
	page.currentY = window.pageYOffset / page.height * page.scrollRatio;

	//Execute all animations
	for(var i = 0; i < animations.length; i++) {
		animations[i].render(page.currentY, 'update');
	}

	page.resizeClock = (page.resizeClock + 1) % 10;
	if(page.resizeCloc == 0) {
		resizeAnimations();
	}

}


function resizeAnimations() {

	//Store the height of the page based on the new height
	page.height = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );

	//recalculate the scroll ratio
	page.scrollRatio = (page.height) / ( page.height - window.innerHeight);

	//recalculate animation start and duration values
	animations.forEach(function(a) {
		transformAnimation(a.panel, a);
	});

}



var titleContainer;
var titleCanvas;
var titleCtx;
var titleParticleCount = 150;
var titleParticles = Array();

var Particle = function(size, velocityX, velocityY, positionX, positionY) {
	//Size
	this.size = size;

	//Velocity
	this.velocityX = velocityX;
	this.velocityY = velocityY;

	//Position
	this.positionX = positionX;
	this.positionY = positionY;
}

Particle.prototype.render = function(ctx) {
	//Move the Particle along the X axis
	this.positionX += this.velocityX;

	//If the particle has moved out of bounds, reverse the X velocity
	if(this.positionX > ctx.canvas.width + 10 || this.positionX < -10) {
		this.velocityX *= -1;
	}

	//Move the Particle along the Y axis
	this.positionY += this.velocityY;

	//If the particle has moved out of bounds, reverse the Y velocity
	if(this.positionY > ctx.canvas.height + 10 || this.positionY < -10) {
		this.velocityY *= -1;
	}

	//Draw the particle
	ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.arc(this.positionX, this.positionY, this.size, 0, 2 * Math.PI, false);
  ctx.fill();

};

Particle.prototype.connect = function(p, ctx) {
	//Calculate distance
	var dist = (this.positionX - p.positionX)*(this.positionX - p.positionX) + (this.positionY - p.positionY)*(this.positionY - p.positionY);

	var maxDist = 80000;
	if(dist < maxDist) {
		//Calculate opacity
		var o = (1 - dist / maxDist) * 0.3;

		//Draw the line
		ctx.beginPath();
		ctx.moveTo(this.positionX, this.positionY);
		ctx.lineTo(p.positionX, p.positionY);
		ctx.lineWidth = 1;
		ctx.strokeStyle='rgba(0,0,0,'+o+')';
		ctx.stroke();
	}

};


//Function to initialize the title canvas
function initCanvas() {

	//Title Canvas
	titleCanvas = $('#titleCanvas');

	//Calculate Width and Height of Canvas
	resizeCanvas();

	//Context
	titleCtx = titleCanvas.getContext('2d');

	//Populate particle Array
	for(var i = 0; i < titleParticleCount; i++) {
		titleParticles.push(new Particle(0.1, Math.random() - 0.5, Math.random() - 0.5, Math.random() * titleCanvas.width, Math.random() * titleCanvas.height));
	}
}

//Function to perform the update cycle
function updateCanvas() {

	//Do nothing if not visible
	if(titleCanvas.hasClass('a-after')) {
		return;
	}

	//Clear the canvas
	titleCtx.clearRect(0,0,titleCanvas.width,titleCanvas.height);

	//Render every particle
	for(var i = 0; i < titleParticleCount; i++) {
		titleParticles[i].render(titleCtx);
		//Render connections
		for(var j = i + 1; j < titleParticleCount; j++) {
			//Perform a rough calculation so that we dont run the distance formula on every particle pair
			if(Math.abs(titleParticles[i].positionX - titleParticles[j].positionX) < 160 || Math.abs(titleParticles[i].positionY - titleParticles[j].positionY) < 160) {
				//Render connection
				titleParticles[i].connect(titleParticles[j], titleCtx);
			}
		}
	}
}

//Function to update the dimensions of the canvas on window.resize
function resizeCanvas() {
	titleCanvas.width = window.innerWidth*2;
	titleCanvas.height = window.innerHeight*2;
}


//requestAnimationFrame shim/polyfill
window.requestAnimationFrame = ( function() {
 return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function( callback ) {
     window.setTimeout( callback, 1000 / 60 );
    };
})();

//Selector Functions
function $$(selector, context) {
	context = context || document;
	var elements = context.querySelectorAll(selector);
	return Array.prototype.slice.call(elements);
}

function $(selector, context) {
	context = context || document;
	return context.querySelector(selector);
}

//Element Prototypes
Element.prototype.hasClass = function(c) {
	return this.className.indexOf(c) !== -1;
}

//Application Master Functions
;(function() {

	// Page Load Function
	function load() {
		initAnimations();
		initScrollSnap();
		//initCanvas();

		requestAnimationFrame(update);
	}
	window.addEventListener('load', load, false);


	var fps = 0, now, lastUpdate = (new Date)*1;



	// Page Update Function 
	function update() {
		updateAnimations();
		updateScrollSnap();
		//updateCanvas();

		 var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
	  if (now!=lastUpdate){
	    fps += (thisFrameFPS - fps) / 50;
	    lastUpdate = now;
	  }

	  //$('#text').innerHTML = fps;

		requestAnimationFrame(update);
	}

	// Page Resize Function 
	function resize() {
		resizeAnimations();
		resizeScrollSnap();
		//resizeCanvas();
	}
	window.addEventListener('resize', resize, false);

	//Page Scroll Function
	function scroll() {
		scrollScrollSnap();
	}
	window.addEventListener('scroll', scroll, false);


})();

/*

//The world isn't ready for this yet. We'll save it until the world is ready for it. 



const defaults = {
	//System
	persist: false,
	backgroundColor: 'white',

	//Emitter
	emitterPosition: { x:0, y:0 },
	emitterSize: { x:10, y:10 },
	emitterShape: 'square',

	maxParticles:100,
	initParticles:10,
	spawnRate:1,

	particleLife:10,
	particleLifeRnd:1,

	particleSize: 2,
	particlesizeRnd: 1,

	particleVelocity: 5,
	particleVelocityRnd: 2,

	particleDirection:0,
	particleDirectionRnd:360
};


class ParticleSystem {
	constructor(canvas, args) {
		//Essentials
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;

		//Options
		this.persist = args.persist || defaults.persist;
		this.backgroundColor = args.backgroundColor || defaults.backgroundColor;

		//Arrays
		this.emitters = Array();
		this.attractors = Array();
		this.repulsors = Array();
	};

	//Adds an emitter to the emitter array
	AddEmitter(emitter) {
		this.emitters.push(emitter);
	};
	//Adds an attractor to the attractor array
	AddAttractor(attractor) {
		this.attractors.push(attractor);
	};
	//Adds a repulsor to the repulsor array
	AddReuplsor(repulsor) {
		this.repulsors.push(repulsor);
	};
}

class Emitter {
	constructor(args) {
		//Emitter Itself
		this.position = args.position || defaults.emitterPosition;
		this.size = args.size || defaults.emitterSize;
		this.maxParticles = args.maxParticles || defaults.maxParticles;
		this.initParticles = args.initParticles || defaults.initParticles;
		this.spawnRate = args.spawnRate || defaults.spawnRate;

		//Particle Behavior
		this.particleLife = args.particleLife || defaults.particleLife;
		this.particleLifeRnd = args.particleLifeRnd || defaults.particleLifeRnd;
		this.particleSize = args.particleSize || defaults.particleSize;
		this.particleSizeRnd = args.particleSizeRnd || defaults.particleSizeRnd;
		this.particleVelocity = args.particleVelocity || defaults.particleVelocity;
		this.particleVelocityRnd = args.particleVelocityRnd || defaults.particleVelocityRnd;
		this.particleDirection = args.particleDirection || defaults.particleDirection;
		this.particleDirectionRnd = args.particleDirectionRnd || defaults.particleDirectionRnd;

	}
}
*/


/*
	SYNTAX:		
		<div class="snap-point" data-snap-target="top" data-snap-margin="30">
			CONTENT
		</div>
*/

var snapPoints = new Array();
var target = null;
var targetDist;
var animationProgress = 0;
var animationState = 1; //1 = idle, 2 = pending, 3 = animating, 4 = done

var disableWidth = 400;
var disabled = false;

var lDate;
var deltaTime;

var scrolling = false;
var scrollTimer;


var SnapPoint = function(el) {

	//The element
	this.el = el;

	//margin for snapping
	this.snapMargin = parseFloat(this.el.dataset.snapMargin);

	//Point on the screen to track
	var rect = this.el.getBoundingClientRect();
	switch(this.el.dataset.snapTarget) {
		case 'top':
			this.snapTarget = window.pageYOffset + rect.top;
			break;
		case 'middle': 
			this.snapTarget = window.pageYOffset + rect.top + window.innerHeight * 0.5;
			break;
		case 'bottom':
			this.snapTarget = window.pageYOffset + rect.top + window.innerHeight;
			break;
	}
	
}


function initScrollSnap() {

	//Grab the height
	resizeScrollSnap();

	//setup for deltatime
	lDate = Date.now();

	//create the snapPoint objects
	$$('.snap-point').forEach(function(s) {
		snapPoints.push(new SnapPoint(s));
	});

}

function updateScrollSnap() {

	//calculate deltaTime
	deltaTime = (Date.now() - lDate) / 1000;

	if(target == null) {
		if(!scrolling) {
			//find a new target in the array
			snapPoints.forEach(function(p) {
				if(Math.abs(p.snapTarget - window.pageYOffset) < p.snapMargin) {
					target = p;
				}
			});
		}
	} else {
		//target acquired!
		if(animationState == 1) {
			if(!scrolling) {
				//set state to 2 (pending)
				setTimeout(function() {
					if(!scrolling) {

						//set state to 3 (ready!)
						animationState = 3;

						//set the inital target distance
						targetDist = target.snapTarget - window.pageYOffset;
					} else {
						//abort, go back to searching
						animationState = 1;
						target = null;
					}
				}, 100);
				//pending
				animationState = 2;
			} else {
				target = null;
			}
		}

		//ready to animate
		if(animationState == 3) {

			//increase animation progress
			animationProgress += deltaTime * 3;

			//apply easing
			var ap = animationProgress;
			ap = (Math.pow((ap-1), 3) +1);

			//scroll
			window.scrollTo(0, target.snapTarget - targetDist * (1 - ap));

			if(animationProgress >= 1) {//animation finished

				//lock to the endpoint just in case the math was a bit off
				window.scrollTo(0, target.snapTarget);

				//finished
				animationState = 4;
			}
		}
	}

	//for deltatime
	lDate = Date.now();

	//console.log('State: ' + animationState, 'Scrolling: ' + scrolling);

}

function resizeScrollSnap() {

	//update the target points of all of the snap points
	snapPoints.forEach(function(p) {
		
		//client rect of the element
		var rect = p.el.getBoundingClientRect();		

		//Point on the screen to track
		switch(p.el.dataset.snapTarget) {
			case 'top':
				p.snapTarget = window.pageYOffset + rect.top;
				break;
			case 'middle': 
				p.snapTarget = window.pageYOffset + rect.top + window.innerHeight * 0.5;
				break;
			case 'bottom':
				p.snapTarget = window.pageYOffset + rect.top + window.innerHeight;
				break;
		}
	});


}

function scrollScrollSnap() {

	if(animationState == 4) {//the animation is finished

		//set back to idle
		animationState = 1;

		//reset other parameters
		animationProgress = 0;
		target = null;
	}

	//we are indeed scrolling
	scrolling = true;

	//reset timer to check when we're not scrolling
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(function() { scrolling = false }, 100);
}
