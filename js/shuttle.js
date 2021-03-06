class Shuttle {
	constructor(owner, destination, x, y) {
		/**@type {Player} */
		this.owner = owner;
		/**@type {Planet} */
		this.destination = destination;
		/**@type {Number} */
		this.x = x;
		/**@type {Number} */
		this.y = y;
		/**@type {Number} */
		this.maxVelocity = 2.5;
		/**@type {Number} */
		this.velocity = 0;
		/**@type {Number} */
		this.acceleration = 0.04;

		this.slope;
		this.attemptedShot = false;

		this.onUpdatePosition = onUpdatePosition.subscribe(this.updatePosition.bind(this));
		this.onDraw = onDraw.subscribe(this.draw.bind(this));
	}
	updatePosition() {
		if (this.velocity < this.maxVelocity) {
			this.velocity += this.acceleration;
		}
		let slope = atan((this.destination.y - this.y) / (this.destination.x - this.x));
		this.slope = slope * 180 / PI;
		let dX = cos(slope) * this.velocity;
		let dY = sin(slope) * this.velocity;
		if (this.x > this.destination.x) {
			dX *= -1;
			dY *= -1;
			this.slope -= 90;
		} else {
			this.slope += 90;
		}
		this.x += dX;
		this.y += dY;

		if (!this.attempedShot && this.destination.owner != this.owner && this.destination.satellites.length > 0) {
			if (this.approachingSatellites()) {
				let isShot = false;
				this.attemtedShot = true;
				this.destination.satellites.filter(_ => Math.random() < .01).forEach(s => {
					s.shoot(this);
					isShot = true;
				});
				if (isShot) {
					onUpdatePosition.unsubscribe(this.onUpdatePosition);
					onDraw.unsubscribe(this.onDraw);
					new Explosion(this, false);
					return;
				}
			}
		}

		if (this.hasArrived()) {
			onUpdatePosition.unsubscribe(this.onUpdatePosition);
			onDraw.unsubscribe(this.onDraw);
			this.destination.receiveShuttle(this);
		}
	}

	approachingSatellites() {
		return dist(this.x, this.y, this.destination.x, this.destination.y) < this.destination.diameter * 1.5;
	}

	hasArrived() {
		return dist(this.x, this.y, this.destination.x, this.destination.y) < this.destination.diameter / 2;
	}



	draw() {
		push();
		imageMode(CENTER);
		angleMode(DEGREES);
		translate(this.x, this.y);
		rotate(this.slope);
		image(this.owner.shuttleIMG, 0, 0, 20, 20);
		angleMode(RADIANS);
		pop();
	}
}
