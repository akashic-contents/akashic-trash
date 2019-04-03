import * as b2 from "@akashic-extension/akashic-box2d";
import { PysicalEParameter, PysicalE, PysicalECategoryBit } from "../PysicalE";

export interface SpiderParameter extends PysicalEParameter {
	//
}

export class Spider extends PysicalE {
	getMass() {
		return 100;
	}

	createBody() {
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Dynamic,
				fixedRotation: true
			}),
			this.box2d.createFixtureDef({
				density: this.calculateDensityFromMass(this.width * 0.95),
				friction: 1.,
				restitution: .91,
				shape: this.box2d.createCircleShape(this.width * 0.95),
				filter: {
					// NOTE: Wall (PysicalECategoryBit.E) とは当たり判定をなくす
					maskBits: PysicalECategoryBit.A | PysicalECategoryBit.B | PysicalECategoryBit.C | PysicalECategoryBit.D
				}
			})
		);
		return body.b2body;
	}
}
