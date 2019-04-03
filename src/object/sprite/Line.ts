export interface LineParameter extends g.SpriteParameterObject {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
}

export class Line extends g.E {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;

	private sprite: g.Sprite;

	constructor(param: LineParameter) {
		super(param);

		this.fromX = param.fromX;
		this.fromY = param.fromY;
		this.toX = param.toX;
		this.toY = param.toY;

		const scene = param.scene;

		const sprite = new g.Sprite({
			scene,
			src: param.src,
			srcX: param.srcX,
			srcY: param.srcY,
			srcWidth: param.srcWidth,
			srcHeight: param.srcHeight,
			width: param.width,
			height: param.height
		});
		this.sprite = sprite;
		this.calculate();

		this.append(sprite);
	}

	calculate() {
		const angle = this.calculateAngle(this.fromX, this.fromY, this.toX, this.toY);
		const length = this.calculateLength(this.fromX, this.fromY, this.toX, this.toY);

		const obj = this.sprite;
		obj.height = length;
		obj.x = (this.fromX + this.toX) / 2 - obj.width / 2,
		obj.y = (this.fromY + this.toY) / 2 - length / 2,
		obj.angle = angle * 180 / Math.PI;
		obj.invalidate();
	}

	private calculateLength(fromX: number, fromY: number, toX: number, toY: number): number {
		return Math.pow(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2), 0.5);
	}

	private calculateAngle(fromX: number, fromY: number, toX: number, toY: number): number {
		return Math.atan((toX - fromX) / (fromY - toY));
	}
}
