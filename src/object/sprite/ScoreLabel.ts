export interface ScoreLabelParameter extends g.EParameterObject {
	width: number;
	height: number;
	font: g.Font;

	backSrc: g.ImageAsset;
	backSrcX: number;
	backSrcY: number;
	backSrcWidth: number;
	backSrcHeight: number;
}

export class ScoreLabel extends g.E {
	score: number;

	private MAX_SCORE: number = 999999;
	private label: g.Label;
	private currentScore: number;
	private addedScoreAtOnce: number;

	constructor(param: ScoreLabelParameter) {
		super(param);

		const scene = param.scene;
		this.score = 0;
		this.currentScore = 0;
		this.addedScoreAtOnce = 0;

		const back = new g.Sprite({
			scene,
			src: param.backSrc,
			width: param.backSrcWidth,
			height: param.backSrcHeight,
			srcX: param.backSrcX,
			srcY: param.backSrcY,
			srcWidth: param.backSrcWidth,
			srcHeight: param.backSrcHeight
		});
		this.append(back);

		// NOTE:
		// $ -> pt
		// # -> 穴埋め用の 0
		const label = new g.Label({
			scene,
			text: "0$",
			font: param.font,
			fontSize: 66,
			x: 237,
			width: param.width - 237,
			textAlign: g.TextAlign.Right,
			widthAutoAdjust: false
		});

		this.label = label;
		this.updateLabel();

		this.append(label);
		label.y = (this.height - label.height) / 2;
	}

	increaseScore(score: number) {
		this.score += score;
		this.addedScoreAtOnce = Math.ceil(score / 11); // TODO: 11 はハードコード
		this.update.add(this._updateLabel, this);
	}

	private updateLabel() {
		// カンスト防止
		const text = ("#######" + Math.min(this.currentScore, this.MAX_SCORE)).slice(-6);
		this.label.text = text + "$";
		this.label.invalidate();
	}

	private _updateLabel() {
		this.currentScore = Math.min(this.currentScore + this.addedScoreAtOnce, this.score);
		this.updateLabel();
		return this.currentScore === this.score;
	}
}
