<template>
    <canvas ref="canvas" class="sparks-canvas"></canvas>
</template>

<script>
class Particle {

	constructor(context) {
		this.context   = context;
		this.x         = this.generateRandomInteger(0, context.width);
		this.y         = this.generateRandomInteger(0, context.height);
		this.color     = this.generateColor();
		this.direction = this.generateRandomDirection();
		this.speed     = this.generateRandomSpeed();
		this.size      = this.generateRandomSize();
    }

    move() {
		this.direction += Math.random() * 0.1 - 0.05;
		this.x += Math.cos(this.direction) * this.speed;
		this.y += Math.sin(this.direction) * this.speed;

		if (this.x < -this.size) {
			this.x = this.context.width + this.size;
        } else if (this.x > this.context.width + this.size) {
			this.x = -this.size;
		}

		if (this.y < -this.size) {
			this.y = this.context.height + this.size;
        } else if (this.y > this.context.height + this.size) {
			this.y = -this.size;
        }
    }

	generateRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generateColor() {
		const r   = this.generateRandomInteger(150, 255);
		const g   = this.generateRandomInteger(50, r);
		const b   = this.generateRandomInteger(0, Math.min(r, g));
		const a   = this.generateRandomAlpha();

		return { r, g, b, a };
    }

    generateRandomAlpha() {
        return Math.random() * 0.5 + 0.2;
    }

    generateRandomDirection() {
        return Math.random() * Math.PI / 2 - (Math.PI / 4 * 3);
    }

    generateRandomSpeed() {
        return Math.random() * 3;
    }

	generateRandomSize() {
		return this.generateRandomInteger(3, 10);
    }

    get css() {
		const {r, g, b, a } = this.color;

		return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

}

export default {
	data: () => ({
        enabled: window.innerWidth >= 768
    }),
	mounted() {
		if (!this.enabled) {
			return;
        }

		const { canvas } = this.$refs;

        const context = canvas.getContext('2d');
        const particles = [];

		const resetCanvasSize = () => {
			const { offsetWidth: width, offsetHeight: height } = canvas.parentNode;
			canvas.width  = width;
			canvas.height = height;
			context.filter = 'blur(2px)';
		};

        const resetCanvas = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
		};

        const draw = () => {
            resetCanvas();
			particles.forEach((particle) => {
				particle.move();
				context.beginPath();
				context.fillStyle = particle.css;
				context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			});
			window.requestAnimationFrame(draw);
		};

		resetCanvasSize();
        resetCanvas();
        particles.push(...[...new Array(10).keys()].map(() => {
			return new Particle(canvas);
		}));
		window.requestAnimationFrame(draw);
        window.addEventListener('resize', resetCanvasSize);
    }
};
</script>

<style lang="scss" scoped>
    .sparks-canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
