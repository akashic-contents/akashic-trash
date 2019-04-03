import { Timeline, Tween } from "@akashic-extension/akashic-timeline";

export interface WarningParameter extends g.FilledRectParameterObject {
	interval: 1000;
}

export class Warning extends g.FilledRect {
	private timeline: Timeline;
	private tween: Tween | null;
	private interval: number;

	constructor(param: WarningParameter) {
		super(param);

		this.timeline = new Timeline(param.scene);
		this.interval = param.interval;
		this.stop();
	}

	warn() {
		this.createTween();
	}

	stop() {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		this.opacity = 0;
	}

	private createTween() {
		this.stop();
		this.tween = this.timeline.create(this, {modified: this.modified, loop: true})
		.to({
			opacity: 0.4
		}, 0)
		.to({
			opacity: 0
		}, this.interval);
	}
}
