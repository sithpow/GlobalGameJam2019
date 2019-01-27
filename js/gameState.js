class GameState {
	constructor() {
		this.isWon = false;
		this.isLost = false;
		onPlanetClaimed.subscribe(this.checkState.bind(this));
	}

	checkState() {
		if (ai.player.planets.length == 0) {
			this.isWon = true;

			onDraw.subscribe(this.draw.bind(this));
		}
		if (mainPlayer.player.planets.length == 0) {
			this.isLost = true;
			onDraw.subscribe(this.draw.bind(this));
		}
	}

	stopGameMovement() {
		onPlanetSelectedGlobal.unsubscribe(mainPlayer.onSelected);
		planets.forEach(planet => {
			planet.targetPlanet = null;
			planet.selected = false;
		});
	}

	draw() {
		push();
		textSize(50);
		textAlign(CENTER, CENTER);
		if (this.isWon) {
			fill('mediumseagreen');
			text('You Won!', width / 2, height / 2);
		}
		if (this.isLost) {
			fill('salmon');
			text('You Lost', width / 2, height / 2);
		}
		pop();
	}
}