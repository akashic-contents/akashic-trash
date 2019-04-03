import * as b2 from "@akashic-extension/akashic-box2d";
import { Timeline, Tween } from "@akashic-extension/akashic-timeline";
import { Garbage, GarbageParameter } from "./Garbage";
import { SpriteData } from "../../data/sprite";

export interface KumokoParameter extends GarbageParameter {
	defaultData: SpriteData;
	loveData: SpriteData;
}

export class Kumoko extends Garbage {
	tweenEnded: g.Trigger<void>;

	private timeline: Timeline;
	private tween: Tween | null;

	private loveData: SpriteData;
	private defaultData: SpriteData;

	constructor(param: KumokoParameter) {
		super(param);

		this.tweenEnded = new g.Trigger();
		this.timeline = new Timeline(param.scene);
		this.loveData = param.loveData;
		this.defaultData = param.defaultData;
	}

	getScores() {
		return {
			floor: 0,
			dustbox: -10000,
			spider: 10000
		};
	}

	getMass() {
		return 11.0;
	}

	createBody() {
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Dynamic,
				fixedRotation: true
			}),
			this.box2d.createFixtureDef({
				density: this.calculateDensityFromMass(this.width * .75),
				friction: .6,
				restitution: .001,
				shape: this.box2d.createCircleShape(this.width * .75),
				filter: {
					categoryBits: this.categoryBit,
					// ゴミ同士はぶつからないように
					groupIndex: -1
				}
			})
		);
		return body.b2body;
	}

	default() {
		const d = this.defaultData;
		this.srcX = d.x;
		this.srcY = d.y;
		this.srcWidth = d.width;
		this.srcHeight = d.height;
		this.invalidate();
	}

	love(duration: number) {
		if (this.tween) {
			this.tweenEnded.fire();
			this.timeline.remove(this.tween);
			this.tween = null;
		}
		const d = this.loveData;
		this.srcX = d.x;
		this.srcY = d.y;
		this.srcWidth = d.width;
		this.srcHeight = d.height;
		this.invalidate();
		this.tween = this.timeline.create(d)
		.wait(duration)
		.call(() => {
			this.tweenEnded.fire();
			this.tween = null;
			this.default();
		});
	}
}
