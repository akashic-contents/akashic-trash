import { Timeline, Tween } from "@akashic-extension/akashic-timeline";

export interface LogoParameter extends g.SpriteParameterObject {
	x: number;
	y: number;
	width: number;
	height: number;
	srcWidth: number;
	srcHeight: number;
	cssColor: string;
	opacity: number;
}

export class Logo extends g.E {
	private timeline: Timeline;
	private tween: Tween | null;

	// private back: g.FilledRect;
	private logo: g.Sprite;

	constructor(param: LogoParameter) {
		super({
			scene: param.scene,
			width: param.width,
			height: param.height
		});

		this.timeline = new Timeline(param.scene);

		const back = new g.FilledRect({
			scene: param.scene,
			cssColor: param.cssColor,
			width: param.width,
			height: param.height,
			opacity: param.opacity,
			touchable: true // すべてのタッチイベントを吸収する
		});
		this.append(back);
		// this.back = back;

		const logo = new g.Sprite({
			scene: param.scene,
			src: param.src,
			srcX: param.srcX,
			srcY: param.srcY,
			srcWidth: param.srcWidth,
			srcHeight: param.srcHeight,
			x: param.x,
			y: param.y,
			width: param.srcWidth,
			height: param.srcHeight
		});
		this.append(logo);
		this.logo = logo;
	}

	fadeIn(duration: number) {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		const logo = this.logo;
		logo.opacity = 0;
		logo.scale(0);
		logo.show();
		this.tween = this.timeline.create(logo, {modified: logo.modified})
		.to({opacity: 1}, duration)
		.con()
		.scaleTo(1, 1, duration);
	}

	fadeOut(duration: number) {
		if (this.tween) {
			this.timeline.remove(this.tween);
		}
		const logo = this.logo;
		logo.opacity = 1;
		logo.scale(1);
		logo.show();
		this.tween = this.timeline.create(logo, {modified: logo.modified})
		.to({opacity: 0}, duration)
		.con()
		.scaleTo(2, 2, duration);
	}
}
