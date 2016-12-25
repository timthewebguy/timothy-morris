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
