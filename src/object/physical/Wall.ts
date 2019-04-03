import * as b2 from "@akashic-extension/akashic-box2d";
import { PysicalContainerE, PysicalContainerEParameter } from "../PysicalContainerE";
import { PysicalECategoryBit } from "../PysicalE";

export class Wall extends PysicalContainerE {
	wall: b2.Box2DWeb.Dynamics.b2Body;

	constructor(param: PysicalContainerEParameter) {
		super(param);

		const scene = param.scene;
		const box2d = param.box2d;
		const game = scene.game;

		const height = 40;

		/// base
		const bottom = new g.FilledRect({
			scene,
			cssColor: "black",
			width: game.width,
			height,
			y: game.height,
			hidden: true
		});
		this.append(bottom);

		const bottomBody = box2d.createBody(
			bottom,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .7,
				restitution: .1,
				shape: box2d.createRectShape(bottom.width, bottom.height),
				filter: {
					maskBits: PysicalECategoryBit.All
				}
			})
		);

		/// 1
		const bottomA = new g.FilledRect({
			scene,
			cssColor: "black",
			width: game.width - 231,
			height,
			y: game.height - height,
			hidden: true
		});
		this.append(bottomA);

		box2d.createBody(
			bottomA,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .5,
				restitution: .1,
				shape: box2d.createRectShape(bottomA.width, bottomA.height),
				filter: {
					categoryBits: PysicalECategoryBit.A,
					maskBits: PysicalECategoryBit.A
				}
			})
		);

		/// 2
		const bottomB = new g.FilledRect({
			scene,
			cssColor: "gray",
			width: game.width - 231,
			height,
			y: game.height - height * 2,
			hidden: true
		});
		this.append(bottomB);

		box2d.createBody(
			bottomB,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .7,
				restitution: .1,
				shape: box2d.createRectShape(bottomB.width, bottomB.height),
				filter: {
					categoryBits: PysicalECategoryBit.B,
					maskBits: PysicalECategoryBit.B
				}
			})
		);

		/// 3
		const bottomC = new g.FilledRect({
			scene,
			cssColor: "white",
			width: game.width - 231,
			height,
			y: game.height - height * 3,
			hidden: true
		});
		this.append(bottomC);

		box2d.createBody(
			bottomC,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .7,
				restitution: .1,
				shape: box2d.createRectShape(bottomC.width, bottomC.height),
				filter: {
					categoryBits: PysicalECategoryBit.C,
					maskBits: PysicalECategoryBit.C
				}
			})
		);

		const up = new g.FilledRect({
			scene,
			cssColor: "black",
			width: game.width,
			height: 10,
			y: -10
		});
		this.append(up);

		box2d.createBody(
			up,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .7,
				restitution: .8,
				shape: box2d.createRectShape(up.width, up.height),
				filter: {
					categoryBits: PysicalECategoryBit.E
				}
			})
		);

		const left = new g.FilledRect({
			scene,
			cssColor: "black",
			width: 10,
			height: game.height,
			x: -10
		});
		this.append(left);

		box2d.createBody(
			left,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .7,
				restitution: .8,
				shape: box2d.createRectShape(left.width, left.height),
				filter: {
					categoryBits: PysicalECategoryBit.All
				}
			})
		);

		const right = new g.FilledRect({
			scene,
			cssColor: "black",
			width: 10,
			height: game.height,
			x: game.width
		});
		this.append(right);

		box2d.createBody(
			right,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "wall"
			}),
			box2d.createFixtureDef({
				density: 1,
				friction: .7,
				restitution: .8,
				shape: box2d.createRectShape(right.width, right.height),
				filter: {
					categoryBits: PysicalECategoryBit.All
				}
			})
		);

		this.wall = bottomBody.b2body;
	}
}
