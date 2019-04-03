import { Timeline, Tween } from "@akashic-extension/akashic-timeline";
import { SpriteData } from "../../data/sprite";

export interface NicomobaParameter extends g.SpriteParameterObject {
	default: SpriteData;
	throw: SpriteData[];
	beHappy: SpriteData[];
}

export class Nicomoba extends g.Sprite {
	tweenEnded: g.Trigger<void>;

	private timeline: Timeline;
	private tween: Tween | null;

	private defaultData: SpriteData;
	private throwData: SpriteData[];
	private beHappyData: SpriteData[];

	constructor(param: NicomobaParameter) {
		super(param);

		this.tweenEnded = new g.Trigger();
		this.timeline = new Timeline(param.scene);
		this.defaultData = param.default;
		this.throwData = param.throw;
		this.beHappyData = param.beHappy;
	}

	default() {
		if (this.tween) {
			this.tweenEnded.fire();
			this.timeline.remove(this.tween);
			this.tween = null;
		}
		const d = this.defaultData;
		this.srcX = d.x;
		this.srcY = d.y;
		this.srcWidth = d.width;
		this.srcHeight = d.height;
		this.invalidate();
	}

	throw() {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		this.tween = this.throwData.reduce(
			(data, c) => {
				return data.to({
					srcX: c.x,
					srcY: c.y,
					srcWidth: c.width,
					srcHeight: c.height
				}, 0).wait(1000);
			},
			this.timeline.create(this, { modified: this.invalidate })
		).call(() => {
			this.tweenEnded.fire();
			this.tween = null;
			this.default();
		});
	}

	beHappy() {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		this.tween = this.beHappyData.reduce(
			(data, c) => {
				return data.to({
					srcX: c.x,
					srcY: c.y,
					srcWidth: c.width,
					srcHeight: c.height
				}, 0).wait(150);
			},
			this.timeline.create(this, { modified: this.invalidate })
		).wait(500).call(() => {
			this.tweenEnded.fire();
			this.tween = null;
			this.default();
		});
	}
}
