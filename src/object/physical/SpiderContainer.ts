import * as b2 from "@akashic-extension/akashic-box2d";
import { Timeline, Tween } from "@akashic-extension/akashic-timeline";
import { PysicalContainerE, PysicalContainerEParameter } from "../PysicalContainerE";
import { Line } from "../sprite/Line";
import { PysicalECategoryBit } from "../PysicalE";
import { Spider } from "./Spider";

export interface SpiderContainerParameter extends PysicalContainerEParameter {
	width: number;
	height: number;

	spiderWidth: number;
	spiderHeight: number;

	spiderSrc: g.ImageAsset;
	spiderSrcX: number;
	spiderSrcY: number;
	spiderSrcWidth: number;
	spiderSrcHeight: number;

	spiderCrashedSrcX: number;
	spiderCrashedSrcY: number;
	spiderCrashedSrcWidth: number;
	spiderCrashedSrcHeight: number;

	spiderLoveSrcX: number;
	spiderLoveSrcY: number;
	spiderLoveSrcWidth: number;
	spiderLoveSrcHeight: number;

	yarnSrc: g.ImageAsset;
	yarnSrcX: number;
	yarnSrcY: number;
	yarnSrcWidth: number;
	yarnSrcHeight: number;
}

export class SpiderContainer extends PysicalContainerE {
	spider: Spider;

	private fulcrum: g.E;
	private yarn: Line;
	private joint: b2.Box2DWeb.Dynamics.Joints.b2DistanceJoint;

	private spiderSrcX: number;
	private spiderSrcY: number;
	private spiderSrcWidth: number;
	private spiderSrcHeight: number;

	private spiderCrashedSrcX: number;
	private spiderCrashedSrcY: number;
	private spiderCrashedSrcWidth: number;
	private spiderCrashedSrcHeight: number;

	private spiderLoveSrcX: number;
	private spiderLoveSrcY: number;
	private spiderLoveSrcWidth: number;
	private spiderLoveSrcHeight: number;

	private timeline: Timeline;
	private tween: Tween | null;
	private isAppeared: boolean = false;

	constructor(param: SpiderContainerParameter) {
		super(param);

		// this.appear() するまで非表示
		this.hide();

		const scene = param.scene;
		this.timeline = new Timeline(scene);

		this.spiderSrcX = param.spiderSrcX;
		this.spiderSrcY = param.spiderSrcY;
		this.spiderSrcWidth = param.spiderSrcWidth;
		this.spiderSrcHeight = param.spiderSrcHeight;

		this.spiderCrashedSrcX = param.spiderCrashedSrcX;
		this.spiderCrashedSrcY = param.spiderCrashedSrcY;
		this.spiderCrashedSrcWidth = param.spiderCrashedSrcWidth;
		this.spiderCrashedSrcHeight = param.spiderCrashedSrcHeight;

		this.spiderLoveSrcX = param.spiderLoveSrcX;
		this.spiderLoveSrcY = param.spiderLoveSrcY;
		this.spiderLoveSrcWidth = param.spiderLoveSrcWidth;
		this.spiderLoveSrcHeight = param.spiderLoveSrcHeight;

		const spider = new Spider({
			scene,
			box2d: param.box2d,
			src: param.spiderSrc,
			srcX: param.spiderSrcX,
			srcY: param.spiderSrcY,
			srcWidth: param.spiderSrcWidth,
			srcHeight: param.spiderSrcHeight,
			width: param.spiderWidth,
			height: param.spiderHeight,
			x: this.offsetX - param.spiderSrcWidth / 2,
			y: this.offsetY + param.height - param.spiderHeight / 2
		});
		this.spider = spider;

		const fulcrum = new g.FilledRect({
			scene,
			cssColor: "pink",
			width: 30,
			height: 30,
			x: this.offsetX,
			y: this.offsetY
		});
		this.fulcrum = fulcrum;

		const yarn = new Line({
			scene,
			src: param.yarnSrc,
			srcX: param.yarnSrcX,
			srcY: param.yarnSrcY,
			srcWidth: param.yarnSrcWidth,
			srcHeight: param.yarnSrcHeight,
			fromX: 0,
			fromY: 0,
			toX: 0,
			toY: 0,
			width: param.yarnSrcWidth,
			height: 0
		});
		this.yarn = yarn;

		this.append(yarn);
		this.append(spider);
		this.append(fulcrum);

		this.createJoint();
	}

	createJoint() {
		const spiderBody = this.spider.b2body;

		const fixtureDef = this.box2d.createFixtureDef({
			density: 1,
			friction: 1,
			restitution: .91,
			shape: this.box2d.createRectShape(this.fulcrum.width, this.fulcrum.height),
			filter: {
				// 他の物体と非干渉とする
				maskBits: PysicalECategoryBit.None
			}
		});

		const fulcrumBody = this.box2d.createBody(
			this.fulcrum,
			this.box2d.createBodyDef({
				type: b2.BodyType.Static
			}),
			fixtureDef
		);

		const jointDef = new b2.Box2DWeb.Dynamics.Joints.b2DistanceJointDef();
		jointDef.bodyA = fulcrumBody.b2body;
		jointDef.bodyB = spiderBody;
		jointDef.frequencyHz = .8;
		jointDef.dampingRatio = .9;
		jointDef.length = 0;

		const joint = this.box2d.world.CreateJoint(jointDef) as b2.Box2DWeb.Dynamics.Joints.b2DistanceJoint;
		this.joint = joint;
		this.createMovement(fulcrumBody);
	}

	createMovement(fulcrumBody: b2.Box2DOptions.EBody) {
		let isDown = false;

		this.yarn.opacity = 1;

		this.fulcrum.update.add(() => {
			if (isDown) {
				this.height += 2;
			} else {
				this.height -= 2;
			}
			if (!this.isAppeared) {
				return;
			}
			this.joint.SetLength(this.height / this.box2d.scale);
			fulcrumBody.b2body.SetPosition(this.box2d.vec2(this.fulcrum.x + this.fulcrum.width / 2, this.fulcrum.y + this.fulcrum.height / 2));
			this.fulcrum.modified();

			this.yarn.fromX = this.fulcrum.x + this.fulcrum.width / 2;
			this.yarn.fromY = this.fulcrum.y + this.fulcrum.height / 2;
			this.yarn.toX = this.spider.x + this.spider.width / 2;
			this.yarn.toY = this.spider.y + this.spider.height / 2;
			this.yarn.calculate();
		});

		this.scene.setInterval(() => {
			isDown = !isDown;
		}, 2000);
	}

	default() {
		if (this.tween != null) {
			this.timeline.remove(this.tween);
			this.tween = null;
		}
		this.spider.srcX = this.spiderSrcX;
		this.spider.srcY = this.spiderSrcY;
		this.spider.srcWidth = this.spiderSrcWidth;
		this.spider.srcHeight = this.spiderSrcHeight;
		this.spider.invalidate();
	}

	collided() {
		if (this.tween != null) {
			this.timeline.remove(this.tween);
		}
		this.tween = this.timeline.create(this.spider)
		.to({
			srcX: this.spiderCrashedSrcX,
			srcY: this.spiderCrashedSrcY,
			srcWidth: this.spiderCrashedSrcWidth,
			srcHeight: this.spiderCrashedSrcHeight
		}, 0)
		.call(() => this.spider.invalidate())
		.wait(1000)
		.call(() => this.default());
	}

	love() {
		if (this.tween != null) {
			this.timeline.remove(this.tween);
		}
		this.tween = this.timeline.create(this.spider)
		.to({
			srcX: this.spiderLoveSrcX,
			srcY: this.spiderLoveSrcY,
			srcWidth: this.spiderLoveSrcWidth,
			srcHeight: this.spiderLoveSrcHeight
		}, 0)
		.call(() => this.spider.invalidate())
		.wait(1000)
		.call(() => this.default());
	}

	appear() {
		this.isAppeared = true;
		this.show();
	}
}
