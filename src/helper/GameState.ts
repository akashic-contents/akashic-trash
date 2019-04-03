export interface GameStateParameter {
	scene: g.Scene;
	score: number;
	time: number;
}

export class GameState {
	scoreChanged: g.Trigger<GameState> = new g.Trigger();
	timeChanged: g.Trigger<GameState> = new g.Trigger();

	private _scene: g.Scene;
	private _score: number;
	private _time: number;

	private _timer: g.TimerIdentifier | null;

	get score(): number {
		return this._score;
	}

	set score(score: number) {
		this._score = score;
		this.scoreChanged.fire(this);
	}

	get time(): number {
		return this._time;
	}

	set time(time: number) {
		this._time = time;
		this.timeChanged.fire(this);
	}

	constructor(param: GameStateParameter) {
		this._scene = param.scene;
		this._score = param.score;
		this._time = param.time;
	}

	start() {
		this._timer = this._scene.setInterval(() => this.onFrame(), 1000);
	}

	stop() {
		if (this._timer) {
			this._scene.clearInterval(this._timer);
			this._timer = null;
		}
	}

	private onFrame() {
		this.time -= 1;
	}
}
