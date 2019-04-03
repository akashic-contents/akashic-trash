import { Timeline, Tween } from "@akashic-extension/akashic-timeline";

export interface ArrowParameter extends g.SpriteParameterObject {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
}

export class Arrow extends g.Sprite {
	private timeline: Timeline;
	private tween: Tween | null;
	private fromX: number;
	private fromY: number;
	private toX: number;
	private toY: number;

	constructor(param: ArrowParameter) {
		super(param);

		this.fromX = param.fromX;
		this.fromY = param.fromY;
		this.toX = param.toX;
		this.toY = param.toY;
		this.timeline = new Timeline(param.scene);
	}

	createTween() {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		this.tween = this.timeline.create(this, {modified: this.modified, loop: true})
		.to({
			angle: 0,
			opacity: 1,
			x: this.fromX,
			y: this.fromY
		}, 0)
		.to({
			angle: 10,
			opacity: 0,
			x: this.toX,
			y: this.toY
		}, 500)
		.wait(600);
	}
}
