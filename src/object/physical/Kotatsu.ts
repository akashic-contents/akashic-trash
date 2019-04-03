import * as b2 from "@akashic-extension/akashic-box2d";
import { PysicalEParameter, PysicalE, PysicalECategoryBit } from "../PysicalE";

export interface KotatsuParameter extends PysicalEParameter {
	//
}

export class Kotatsu extends PysicalE {
	private body: b2.Box2DOptions.EBody;

	getMass() {
		return 0;
	}

	createBody() {
		if (this.body) {
			this.removeBody();
		}

		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Static
			}),
			this.box2d.createFixtureDef({
				density: .1,
				friction: .5,
				restitution: .1,
				shape: this.box2d.createPolygonShape([
					this.box2d.vec2(-this.width / 2 + 80, -this.height / 2 + 50),
					this.box2d.vec2(this.width / 2 - 80, -this.height / 2 + 50),
					this.box2d.vec2(this.width / 2 - 80, -this.height / 2 + 60),
					this.box2d.vec2(-this.width / 2 + 80, -this.height / 2 + 60)
				]),
				filter: {
					categoryBits: PysicalECategoryBit.All
				}
			})
		);
		this.body = body;

		return body.b2body;
	}

	removeBody() {
		this.box2d.removeBody(this.body);
	}
}
