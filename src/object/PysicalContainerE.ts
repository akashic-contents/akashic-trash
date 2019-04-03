import * as b2 from "@akashic-extension/akashic-box2d";

export interface PysicalContainerEParameter extends g.EParameterObject {
	box2d: b2.Box2D;
	offsetX?: number;
	offsetY?: number;
	x?: 0;
	y?: 0;
}

/**
 * 物理演算用コンテナエンティティ。
 * x: 0, y:0 の固定のみサポート
 */
export class PysicalContainerE extends g.E {
	offsetX: number;
	offsetY: number;
	protected box2d: b2.Box2D;

	constructor(param: PysicalContainerEParameter) {
		super(param);
		this.box2d = param.box2d;
		this.offsetX = param.offsetX != null ? param.offsetX : 0;
		this.offsetY = param.offsetY != null ? param.offsetY : 0;
	}
}
