import { SequentialScene, SequentialSceneParameter } from "./SequentialScene";
import { GameScoreManager } from "../helper/GameScoreManager";
import { ObjectFactory } from "../object/ObjectFactory";
import { AtsumaruManager } from "../helper/AtsumaruManager";
import { glyph_display_score } from "../data/glyph";

interface ResultSceneParameter extends SequentialSceneParameter {
	score: number;
}

interface ResultSceneFinishedParameter {
	replay: boolean;
}

export class ResultsScene extends SequentialScene {
	finished: g.Trigger<ResultSceneFinishedParameter>;

	private score: number;

	constructor(param: ResultSceneParameter) {
		super(param);

		this.score = param.score;
		const gameScoreManager = new GameScoreManager();
		gameScoreManager.setScore(param.score);

		this.loaded.addOnce(this.onLoaded, this);
	}

	private onLoaded() {
		// 終了してからスコアを表示するまでの時間
		const DURATION_ROLLING_SCORE = 1500;
		// 終了してからアツマール用のスコア送信ボタンを表示するまでの時間
		const DURATION_UNTIL_SHOWING_ATSUMARU = 3500;

		const factory = new ObjectFactory({scene: this});

		const font_display_score = new g.BitmapFont({
			src: this.assets.sprite_score,
			map: glyph_display_score,
			defaultGlyphWidth: 128,
			defaultGlyphHeight: 160
		});

		const scoreBoard = factory.create(
			"score_board",
			{
				font: font_display_score,
				duration: DURATION_ROLLING_SCORE,
				score: this.score
			}
		);
		this.append(scoreBoard);
		scoreBoard.startShuffle();

		this.setTimeout(() => {
			if (AtsumaruManager.isSupported) {
				const atsumaruManager = new AtsumaruManager();
				let processing = false;

				// アツマール環境であればスコアを自動送信
				atsumaruManager.setRecord(1, this.score);

				const replay = factory.create("button_replay");
				replay.pointUp.addOnce(() => {
					this.finished.fire({
						replay: true
					} as ResultSceneFinishedParameter);
				});

				const displayScore = factory.create("button_display_score");
				displayScore.pointUp.add(() => {
					if (processing) {
						return;
					}
					processing = true;
					atsumaruManager.display(1, err => {
						processing = false;
					});
				});

				this.append(replay);
				this.append(displayScore);
			} else {
				this.finished.fire({
					replay: false
				} as ResultSceneFinishedParameter);
			}
		}, DURATION_UNTIL_SHOWING_ATSUMARU);
	}
}
