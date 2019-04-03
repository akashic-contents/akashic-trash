export class GameScoreManager {
	constructor() {
		if (g.game.vars.gameState == null) {
			g.game.vars.gameState = {};
		}
	}

	setScore(score: number) {
		g.game.vars.gameState.score = score;
	}
}
