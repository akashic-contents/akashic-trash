import * as b2 from "@akashic-extension/akashic-box2d";
import { KirakiraGarbageParameter, KirakiraGarbage } from "./KirakiraGarbage";

export interface KinkaiParameter extends KirakiraGarbageParameter {
	//
}

export class Kinkai extends KirakiraGarbage {
	getScores() {
		return {
			floor: 0,
			dustbox: 10000,
			spider: 0
		};
	}

	getMass() {
		return 22.0;
	}

	createBody() {
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Dynamic
			}),
			this.box2d.createFixtureDef({
				density: this.calculateDensityFromMass(this.width * .9, this.height * .75),
				friction: .6,
				restitution: .001,
				shape: this.box2d.createRectShape(this.width * .9, this.height * .75),
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
