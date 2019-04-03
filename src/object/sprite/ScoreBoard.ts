export interface ScoreBoardParameter extends g.EParameterObject {
	score: number;
	duration: number;
	scoreFont: g.Font;

	rollCountAudio: g.AudioAsset;
	rollCountFinishAudio: g.AudioAsset;

	frameSrc: g.ImageAsset;
	frameSrcX: number;
	frameSrcY: number;
	frameSrcWidth: number;
	frameSrcHeight: number;

	scoreLabelSrc: g.ImageAsset;
	scoreLabelX: number;
	scoreLabelY: number;
	scoreLabelSrcX: number;
	scoreLabelSrcY: number;
	scoreLabelSrcWidth: number;
	scoreLabelSrcHeight: number;

	scoreValueX: number;
	scoreValueY: number;
	scoreValueWidth: number;
	scoreValueHeight: number;

	ptSrc: g.ImageAsset;
	ptX: number;
	ptY: number;
	ptSrcX: number;
	ptSrcY: number;
	ptSrcWidth: number;
	ptSrcHeight: number;
}

export class ScoreBoard extends g.E {
	score: number;
	private scoreValueLabel: g.Label;
	private duration: number;
	private rollCountAudio: g.AudioAsset;
	private rollCountFinishAudio: g.AudioAsset;

	constructor(param: ScoreBoardParameter) {
		super(param);

		const scene = param.scene;

		const frameSrcPiece = g.game.resourceFactory.createTrimmedSurface(param.frameSrc.asSurface(), {
			x: param.frameSrcX,
			y: param.frameSrcY,
			width: param.frameSrcWidth,
			height: param.frameSrcHeight
		});

		const ninepatch = new g.NinePatchSurfaceEffector(g.game, ((frameSrcPiece.width / 2) | 0) - 1);
		const frameSrc = ninepatch.render(frameSrcPiece, this.width, this.height);
		frameSrcPiece.destroy();

		const frame = new g.Sprite({
			scene,
			src: frameSrc,
			width: param.width,
			height: param.height,
			srcWidth: frameSrc.width,
			srcHeight: frameSrc.height
		});
		this.append(frame);

		const scoreLabel = new g.Sprite({
			scene,
			src: param.scoreLabelSrc,
			srcX: param.scoreLabelSrcX,
			srcY: param.scoreLabelSrcY,
			srcWidth: param.scoreLabelSrcWidth,
			srcHeight: param.scoreLabelSrcHeight,
			width: param.scoreLabelSrcWidth,
			height: param.scoreLabelSrcHeight,
			x: param.scoreLabelX,
			y: param.scoreLabelY
		});
		this.append(scoreLabel);

		const pt = new g.Sprite({
			scene,
			src: param.ptSrc,
			srcX: param.ptSrcX,
			srcY: param.ptSrcY,
			srcWidth: param.ptSrcWidth,
			srcHeight: param.ptSrcHeight,
			width: param.ptSrcWidth,
			height: param.ptSrcHeight,
			x: param.ptX,
			y: param.ptY
		});
		this.append(pt);

		const scoreValueLabel = new g.Label({
			scene,
			font: param.scoreFont,
			text: "",
			fontSize: param.scoreFont.size,
			x: param.scoreValueX,
			y: param.scoreValueY,
			widthAutoAdjust: false,
			textAlign: g.TextAlign.Right,
			width: param.scoreValueWidth,
			height: param.scoreValueHeight
		});
		this.append(scoreValueLabel);

		this.score = Math.min(param.score, 99999); // カンスト
		this.scoreValueLabel = scoreValueLabel;
		this.rollCountAudio = param.rollCountAudio;
		this.rollCountFinishAudio = param.rollCountFinishAudio;
		this.duration = param.duration;
	}

	startShuffle(): void {
		const label = this.scoreValueLabel;
		const rollCountAudio = this.rollCountAudio.play();

		const frame = this.duration / (1000 / this.game().fps);
		let count = 0;

		label.update.add(() => {
			if (frame <= count) {
				label.text = this.score + "";
				label.invalidate();
				rollCountAudio.stop();
				this.rollCountFinishAudio.play();
				return true;
			}
			count++;
			label.text = g.game.random.get(0, 99999) + "";
			label.invalidate();
		});
	}
}
