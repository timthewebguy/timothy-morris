
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
