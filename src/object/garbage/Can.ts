import * as b2 from "@akashic-extension/akashic-box2d";
import { Garbage, GarbageParameter } from "./Garbage";

export interface CanParameter extends GarbageParameter {
	//
}

export class Can extends Garbage {
	getScores() {
		return {
			floor: 0,
			dustbox: 1000,
			spider: 0
		};
	}

	getMass() {
		return 12.5;
	}

	createBody() {
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Dynamic
			}),
			this.box2d.createFixtureDef({
				density: this.calculateDensityFromMass(this.width * .9, this.height * .9),
				friction: .5,
				restitution: .1,
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
}
