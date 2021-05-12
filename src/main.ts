import { GameScene } from "./scene/GameScene";
import { SequenceManager } from "./helper/SequenceManager";
import { TitleScene } from "./scene/TitleScene";
import { ResultsScene } from "./scene/ResultScene";
import { GameParameter } from "./parameters";
import { AudioMManager } from "./helper/AudioManager";

const game = g.game;
const sequence = new SequenceManager();
const audioManager = new AudioMManager();

function main(args: g.GameMainParameterObject) {
	audioManager.add(game.assets.sample_hue as g.AudioAsset);

	const titleScene = new TitleScene({
		game,
		assetIds: [
			"logo"
		],
		audioManager
	});

	sequence.add(() => {
		playBGM();
		game.pushScene(titleScene);
	});

	titleScene.finished.addOnce((parameter: GameParameter) => {
		const gameScene = createGameScene(parameter);
		sequence.add(() => game.replaceScene(gameScene));
		sequence.next();
	});
	sequence.next();

	return;
}

function createGameScene(parameter: GameParameter): GameScene {
	playBGM();
	const gameScene = new GameScene({
		game,
		audioManager,
		assetIds: [
			"sprite",
			"se_ready_start",
			"se_pon",
			"se_pii",
			"se_timeup",
			"se_garbage",
			"se_garbage_can",
			"se_garbage_tissue",
			"se_in_dustbox",
			"se_spider",
			"se_spider_web",
			"se_start",
			"se_throwing",
			"se_fanfare",
			"se_bad"
		],
		time: parameter.totalTimeLimit - 22,
		seed: parameter.randomSeed != null ? parameter.randomSeed : null,
		difficulty: parameter.difficulty != null ? parameter.difficulty : 1
	});
	gameScene.finished.addOnce(gameSceneParameter => {
		const resultScene = new ResultsScene({
			game,
			score: gameSceneParameter.score,
			assetIds: [
				"sprite_atsumaru",
				"sprite_score",
				"se_roll_count",
				"se_roll_count_finish"
			]
		});

		resultScene.finished.addOnce(resultSceneParameter => {
			if (resultSceneParameter.replay) {
				sequence.add(() => game.replaceScene(createGameScene(parameter)));
				sequence.next();
			} else {
				// TODO
			}
		});

		game.replaceScene(resultScene);
	});

	return gameScene;
}

function playBGM() {
	if (!audioManager.isPlaying("sample_hue")) {
		audioManager.playBGM("sample_hue");
	}
}

module.exports = main;
