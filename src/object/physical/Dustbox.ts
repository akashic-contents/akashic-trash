import * as b2 from "@akashic-extension/akashic-box2d";
import { PysicalContainerEParameter, PysicalContainerE } from "../PysicalContainerE";
import { PysicalECategoryBit } from "../PysicalE";

export interface DustboxParameter extends PysicalContainerEParameter {
	src: g.ImageAsset;
	srcX: number;
	srcY: number;
	srcWidth: number;
	srcHeight: number;
}

export class Dustbox extends PysicalContainerE {
	collisionBody: b2.Box2DWeb.Dynamics.b2Body;
	dustboxBody: b2.Box2DOptions.EBody;

	private dustbox: g.Sprite;

	constructor(param: DustboxParameter) {
		super(param);

		const scene = param.scene;

		const dustbox = new g.Sprite({
			scene,
			src: param.src,
			srcX: param.srcX,
			srcY: param.srcY,
			srcWidth: param.srcWidth,
			srcHeight: param.srcHeight,
			width: param.srcWidth,
			height: param.srcHeight,
			x: this.offsetX,
			y: this.offsetY
		});
		this.dustbox = dustbox;

		this.append(dustbox);
		this.createBody();
	}

	createBody() {
		const box2d = this.box2d;

		const rect = [
			// 横
			160,
			// 縦
			190
		];

		const polygons = [
			// 左上
			8, 34,
			// 左下
			24, 164,
			// 右上
			152, 34,
			// 左下
			136, 164
		];

		this.dustboxBody = box2d.createBody(
			this.dustbox,
			box2d.createBodyDef({
				type: b2.BodyType.Static,
				userData: "dustbox"
			}),
			[
				// 左
				box2d.createFixtureDef({
					density: .5,
					friction: .1,
					restitution: .001,
					shape: box2d.createPolygonShape([
						box2d.vec2(polygons[0] - rect[0] / 2, polygons[1] - rect[1] / 2),
						box2d.vec2(polygons[0] - rect[0] / 2 + 1, polygons[1] - rect[1] / 2),
						box2d.vec2(polygons[2] - rect[0] / 2 + 1, polygons[3] - rect[1] / 2),
						box2d.vec2(polygons[2] - rect[0] / 2, polygons[3] - rect[1] / 2)
					]),
					filter: {
						categoryBits: PysicalECategoryBit.All
					}
				}),
				// 右
				box2d.createFixtureDef({
					density: .5,
					friction: .1,
					restitution: .001,
					shape: box2d.createPolygonShape([
						box2d.vec2(polygons[4] - rect[0] / 2, polygons[5] - rect[1] / 2),
						box2d.vec2(polygons[4] - rect[0] / 2 + 1, polygons[5] - rect[1] / 2),
						box2d.vec2(polygons[6] - rect[0] / 2 + 1, polygons[7] - rect[1] / 2),
						box2d.vec2(polygons[6] - rect[0] / 2, polygons[7] - rect[1] / 2)
					]),
					filter: {
						categoryBits: PysicalECategoryBit.All
					}
				}),
				// 下
				box2d.createFixtureDef({
					density: .5,
					friction: .8,
					restitution: .001,
					shape: box2d.createPolygonShape([
						box2d.vec2(polygons[2] - rect[0] / 2, polygons[3] - rect[1] / 2),
						box2d.vec2(polygons[6] - rect[0] / 2, polygons[3] - rect[1] / 2),
						box2d.vec2(polygons[6] - rect[0] / 2, polygons[7] - rect[1] / 2 + 1),
						box2d.vec2(polygons[2] - rect[0] / 2, polygons[7] - rect[1] / 2 + 1)
					]),
					filter: {
						categoryBits: PysicalECategoryBit.All
					}
				})
			]
		);

		// ゴミ箱に入ったときの当たり判定用
		const bottom = new g.FilledRect({
			scene: this.scene,
			cssColor: "pink",
			width: 10,
			height: 10,
			x: this.offsetX + this.dustbox.width / 2 - 5,
			y: this.offsetY + this.dustbox.height / 2 - 5
		});
		this.append(bottom);

		const def = box2d.createFixtureDef({
			density: .1,
			friction: 1,
			restitution: .1,
			shape: box2d.createRectShape(bottom.width, bottom.height),
			filter: {
				categoryBits: PysicalECategoryBit.All
			}
		});
		def.isSensor = true;

		const body = box2d.createBody(
			bottom,
			box2d.createBodyDef({
				type: b2.BodyType.Static
			}),
			def
		);

		this.collisionBody = body.b2body;
	}
}
