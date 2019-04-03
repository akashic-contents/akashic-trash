import { Timeline, Tween } from "@akashic-extension/akashic-timeline";

export interface VolatileLabelParameter extends g.LabelParameterObject {
	duration: number;
	byX: number;
	byY: number;
}

export class VolatileLabel extends g.Label {
	private timeline: Timeline;
	private tween: Tween | null;

	constructor(param: VolatileLabelParameter) {
		super(param);

		this.timeline = new Timeline(param.scene);
		this.createTween(param.duration, param.byX, param.byY);
	}

	createTween(duration: number, byX: number, byY: number) {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		const toX = this.x + byX;
		const toY = this.y + byY;
		this.tween = this.timeline.create(this, {modified: this.modified})
		.to({
			opacity: 1
		}, 0)
		.to({
			opacity: 0,
			x: toX,
			y: toY
		}, duration)
		.call(() => this.destroy());
	}
}
