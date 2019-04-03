import * as b2 from "@akashic-extension/akashic-box2d";

export enum PysicalECategoryBit {
	None = 0b0000000000000000,
	All  = 0b1111111111111111,
	A    = 0b0000000000000010,
	B    = 0b0000000000000100,
	C    = 0b0000000000001000,
	D    = 0b0000000000010000,
	E    = 0b0000000000100000,
	F    = 0b0000000001000000,
	G    = 0b0000000010000000,
	H    = 0b0000000100000000,
	I    = 0b0000001000000000,
	J    = 0b0000010000000000,
	K    = 0b0000100000000000,
	L    = 0b0001000000000000,
	M    = 0b0010000000000000,
	N    = 0b0100000000000000,
	O    = 0b1000000000000000
}

export interface PysicalEParameter extends g.SpriteParameterObject {
	box2d: b2.Box2D;
	x: number;
	y: number;
	width: number;
	height: number;
	categoryBit?: number;
}

export abstract class PysicalE extends g.Sprite {
	b2body: b2.Box2DWeb.Dynamics.b2Body;
	touchableRect: g.E;
	se: g.AudioAsset | undefined;

	throwed: g.Trigger<PysicalE> = new g.Trigger();
	stopped: g.Trigger<void> = new g.Trigger();
	categoryBit: number | undefined;

	protected box2d: b2.Box2D;

	constructor(param: PysicalEParameter) {
		super(param);
		this.box2d = param.box2d;
		this.categoryBit = param.categoryBit;
		this.touchableRect = new g.E({
			scene: param.scene,
			width: param.width * 3,
			height: param.height * 3,
			x: -param.width,
			y: -param.height
		});
		this.append(this.touchableRect);

		this.b2body = this.createBody();
	}

	destroy() {
		super.destroy();
		this.throwed.destroy();
	}

	abstract getMass(): number;
	abstract createBody(): b2.Box2DWeb.Dynamics.b2Body;

	protected calculateDensityFromMass(diameter: number): number;
	protected calculateDensityFromMass(width: number, height: number): number;
	protected calculateDensityFromMass(width: number, height?: number): number {
		const mass = this.getMass();
		if (height == null) {
			const diameter = width;
			const area = Math.pow(diameter / 2, 2) * Math.PI;
			return mass / area;
		} else {
			return mass / (width * height);
		}
	}
}
