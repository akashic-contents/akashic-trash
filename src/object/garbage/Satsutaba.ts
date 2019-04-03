import * as b2 from "@akashic-extension/akashic-box2d";
import { KirakiraGarbage, KirakiraGarbageParameter } from "./KirakiraGarbage";

export interface SatsutabaParameter extends KirakiraGarbageParameter {
	//
}

export class Satsutaba extends KirakiraGarbage {

	constructor(param: SatsutabaParameter) {
		super(param);

		this.update.add(this.onUpdate, this);
	}

	getScores() {
		return {
			floor: 0,
			dustbox: 5000,
			spider: 0
		};
	}

	getMass() {
		return 9.6;
	}

	createBody() {
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Dynamic
			}),
			this.box2d.createFixtureDef({
				density: this.calculateDensityFromMass(this.width * .9, this.height * .75),
				friction: .5,
				restitution: .1,
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

	protected onUpdate() {
		super.onUpdate();
		// 擬似空気抵抗
		this.b2body.SetLinearVelocity(
			new b2.Box2DWeb.Common.Math.b2Vec2(this.b2body.GetLinearVelocity().x * .95, this.b2body.GetLinearVelocity().y * .95)
		);
	}
}
