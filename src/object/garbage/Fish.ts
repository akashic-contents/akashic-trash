import * as b2 from "@akashic-extension/akashic-box2d";
import { Garbage, GarbageParameter } from "./Garbage";

export interface FishParameter extends GarbageParameter {
	//
}

export class Fish extends Garbage {
	constructor(param: FishParameter) {
		super(param);

		this.update.add(this.onUpdate, this);
	}

	getScores() {
		return {
			floor: 0,
			dustbox: 1000,
			spider: 0
		};
	}

	getMass() {
		return 7.0;
	}

	createBody() {
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Dynamic
			}),
			this.box2d.createFixtureDef({
				density: this.calculateDensityFromMass(this.width * .9, this.height * .9),
				friction: .1,
				restitution: .001,
				shape: this.box2d.createRectShape(this.width * .9, this.height * .9),
				filter: {
					categoryBits: this.categoryBit,
					// ゴミ同士はぶつからないように
					groupIndex: -1
				}
			})
		);
		return body.b2body;
	}

	private onUpdate() {
		// 擬似空気抵抗
		this.b2body.SetLinearVelocity(
			new b2.Box2DWeb.Common.Math.b2Vec2(this.b2body.GetLinearVelocity().x * .91, this.b2body.GetLinearVelocity().y * .91)
		);
	}
}
