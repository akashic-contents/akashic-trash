import { SequentialScene, SequentialSceneParameter } from "./SequentialScene";
import { GameParameter } from "../parameters";
import { AudioMManager } from "../helper/AudioManager";

interface TitleSceneParameter extends SequentialSceneParameter {
	//
}

interface COEMessage {
	type: "start";
	parameters: GameParameter;
}

export class TitleScene extends SequentialScene {
	protected audioManager: AudioMManager;
	private parameter: GameParameter;

	constructor(param: TitleSceneParameter) {
		super(param);

		this.parameter = {
			difficulty: 4,
			totalTimeLimit: 92
		};
		this.message.add(this.onMessage, this);
		this.loaded.addOnce(this.onLoaded, this);
	}

	private onLoaded() {
		const DURATION_SHOWING_LOGO = 5000;

		const back = new g.FilledRect({
			scene: this,
			cssColor: "white",
			width: this.game.width,
			height: this.game.height,
			opacity: 0.3
		});
		this.append(back);

		const titleAsset = this.assets.logo as g.ImageAsset;

		const title = new g.Sprite({
			scene: this,
			src: titleAsset,
			width: titleAsset.width,
			height: titleAsset.height,
			x: (this.game.width - titleAsset.width) / 2,
			y: (this.game.height - titleAsset.height) / 2
		});
		this.append(title);

		// 5秒後に自動実行
		this.setTimeout(() => {
			this.finished.fire(this.parameter);
		}, DURATION_SHOWING_LOGO);
	}

	private onMessage(message: g.MessageEvent) {
		const data = message.data as COEMessage;
		if (data.type === "start") {
			this.parameter = {
				difficulty: data.parameters.difficulty != null ? data.parameters.difficulty : this.parameter.difficulty,
				totalTimeLimit: data.parameters.totalTimeLimit != null ? data.parameters.totalTimeLimit : this.parameter.totalTimeLimit
			};
		}
	}
}
