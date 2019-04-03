import * as b2 from "@akashic-extension/akashic-box2d";
import { PysicalEParameter, PysicalE } from "../PysicalE";

export interface SpiderWebParameter extends PysicalEParameter {
	//
}

export class SpiderWeb extends PysicalE {

	getMass() {
		return 0;
	}

	createBody() {
		const def = this.box2d.createFixtureDef({
			density: 1,
			friction: 1,
			restitution: 1,
			// 当たり判定を少しだけゆるくする
			shape: this.box2d.createPolygonShape([
				this.box2d.vec2(-this.width / 2, -this.height / 2),
				this.box2d.vec2(this.width / 2, -this.height / 2),
				this.box2d.vec2(this.width / 2, this.height / 2),
				this.box2d.vec2(this.width / 4, this.height / 4)
			])
		});
		// ぶつからないけど検知するようにする
		def.isSensor = true;
		const body = this.box2d.createBody(
			this,
			this.box2d.createBodyDef({
				type: b2.BodyType.Static
			}),
			def
		);
		return body.b2body;
	}
}
