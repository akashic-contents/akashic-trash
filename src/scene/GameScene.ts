import * as b2 from "@akashic-extension/akashic-box2d";
import { SequentialScene, SequentialSceneParameter } from "./SequentialScene";
import { GameState } from "../helper/GameState";
import { GarbageManager } from "../helper/GarbageManager";
import { ContactManager } from "../helper/ContactManager";
import { AudioMManager } from "../helper/AudioManager";
import { GameScoreManager } from "../helper/GameScoreManager";
import { ObjectFactory } from "../object/ObjectFactory";
import { PysicalECategoryBit } from "../object/PysicalE";
import { Kumoko } from "../object/garbage/Kumoko";
import { glyph_game_score } from "../data/glyph";

const game = g.game;

interface GameSceneParameter extends SequentialSceneParameter {
	time: number;
	seed: number | null;
	difficulty: number;
}

export interface GameSceneFinishedParameter {
	score: number;
}

const enum GameDifficulty {
	Easy = "easy",
	Normal = "normal",
	Hard = "hard"
}

export class GameScene extends SequentialScene {
	protected audioManager: AudioMManager;

	private gameState: GameState;
	private box2d: b2.Box2D;
	private random: g.RandomGenerator;
	private difficulty: GameDifficulty; // tslint:disable-line
	private isSleep: boolean = false;

	constructor(param: GameSceneParameter) {
		super(param);

		const state = new GameState({
			scene: this,
			score: 0,
			time: param.time
		});

		const box2d = new b2.Box2D({
			gravity: [0, 9.8],
			scale: 250
		});

		this.gameState = state;
		this.box2d = box2d;
		this.random = param.seed != null ? new g.XorshiftRandomGenerator(param.seed) : this.game.random[0]!;

		let difficulty: GameDifficulty;
		if (param.difficulty <= 3) {
			difficulty = GameDifficulty.Easy;
		} else if (param.difficulty <= 7) {
			difficulty = GameDifficulty.Normal;
		} else {
			difficulty = GameDifficulty.Hard;
		}
		this.difficulty = difficulty;

		this.loaded.addOnce(this.onLoaded, this);
		this.update.add(this.onUpdate, this);
	}

	private onLoaded() {
		// ゴミがゴミ箱に入った際に表示されるスコアの表示時間
		const DURATION_SCORE_INTO_DUSTBOX = 600;
		// ゲーム開始後にロゴを見せる時間
		const DURATION_SHOWING_LOGO = 3000;
		// ゴミがクモにあたった時に表示する衝撃を表示する時間
		const DURATION_SHOWING_CRASH_TO_SPIDER = 300;
		// ゴミ箱に入ってから次のゴミを投げるまでの間隔
		const INTERVAL_INTO_DUSTBOX = 800;
		// "終了" の音声が流れ終わってからスコア表示の画面に移動するまでの時間
		const DURATION_SHOWING_FINISH = 1500;
		// ある条件下においてゴミが延々と止まらなかった際の上限時間
		const DURATION_FORCE_NEXT = 4000;
		// ゴミ箱に連続して入った際のボーナスの最大回数
		const NUMBER_BONUS_MAX = 10;

		const box2d = this.box2d;

		this.audioManager.add(this.assets.se_ready_start as g.AudioAsset);
		this.audioManager.add(this.assets.se_pon as g.AudioAsset);
		this.audioManager.add(this.assets.se_pii as g.AudioAsset);
		this.audioManager.add(this.assets.se_timeup as g.AudioAsset);
		this.audioManager.add(this.assets.se_in_dustbox as g.AudioAsset);
		this.audioManager.add(this.assets.se_spider as g.AudioAsset);
		this.audioManager.add(this.assets.se_spider_web as g.AudioAsset);
		this.audioManager.add(this.assets.se_start as g.AudioAsset);
		this.audioManager.add(this.assets.se_throwing as g.AudioAsset);
		this.audioManager.add(this.assets.se_fanfare as g.AudioAsset);
		this.audioManager.add(this.assets.se_bad as g.AudioAsset);

		const factory = new ObjectFactory({
			scene: this,
			box2d: this.box2d
		});

		const backLayer = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});
		const middleLayer = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});

		// 一番下から2番目
		const garbageLayerA = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});
		// 一番下から3番目
		const garbageLayerB = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});
		// 一番下から4番目
		const garbageLayerC = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});

		// 一番下
		const garbageLayerD = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});

		const topLayer = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});
		const frontmostLayer = new g.E({
			scene: this,
			width: this.game.width,
			height: this.game.height
		});

		this.append(backLayer);
		this.append(middleLayer);
		this.append(garbageLayerC);
		this.append(garbageLayerB);
		this.append(garbageLayerA);
		this.append(garbageLayerD);
		this.append(topLayer);
		this.append(frontmostLayer);

		const tatami = factory.create("tatami");
		const nicomoba = factory.create("nicomoba");
		const wall = factory.create("wall");
		const dustbox = factory.create("dustbox");
		const spider = factory.create("spider");
		const kotatsu = factory.create("kotatsu");
		const web = factory.create("spider_web");
		const dustbox_front = factory.create("dustbox_front");
		const warning = factory.create("warning");

		backLayer.append(tatami);
		backLayer.append(nicomoba);
		middleLayer.append(wall);
		middleLayer.append(dustbox);
		middleLayer.append(spider);
		middleLayer.append(kotatsu);
		middleLayer.append(web);
		topLayer.append(dustbox_front);
		frontmostLayer.append(warning);

		const description = factory.create("description");
		const yoi = factory.create("yoi");
		const start = factory.create("start");

		frontmostLayer.append(description);

		const arrow = factory.create("arrow");

		const contact = new ContactManager({
			box2d
		});

		const manager = new GarbageManager({
			scene: this,
			box2d,
			factory,
			width: 300,
			height: 48,
			offsetX: 30,
			offsetY: 40,
			hidden: true
		});
		topLayer.append(manager);

		const cate = [
			PysicalECategoryBit.A,
			PysicalECategoryBit.B,
			PysicalECategoryBit.C,
			PysicalECategoryBit.D
		];
		const names = [
			"tissue", "can", "fish", "apple", "orange"
		];
		const generate = (name = names[this.random.get(0, names.length - 1)]) => {
			const categoryBit = cate[this.random.get(0, cate.length - 1)];
			manager.enqueue({
				name,
				categoryBit
			});
		};

		// 投げるたびに増えるカウンタ
		let count = 0;
		// ゴミ箱入るたびに増えるカウンタ
		let countIntoDustbox = 0;
		// ゴミ箱入らないたびに増えるカウンタ
		let countNotIntoDustbox = 0;
		// ゴミ箱に入り続ける限り増えるカウンタ
		// 例外として、クモ子とぶつかった場合はリセットされず、加算もされない。
		let continuedCount = 0;
		// クモに当たってかつゴミ箱に入らなかった回数
		let collidedSpiderCount = 0;
		// ゴミ箱に入ったかどうかを保持する真偽値
		let inDustbox = false;

		// クモ子を出すかどうかを返す関数
		// 確率: 50% * ((クモに当たった＋ゴミ箱に入らなかった回数) / 投げた回数)
		const isGenerateKumoko: (crashedRate: number) => boolean = crashedRate => {
			const percent = Math.max(Math.min(0.5 * crashedRate, 1), 0) * 100;
			const random = this.random.get(0, 100);
			return random < percent;
		};

		if (this.difficulty === "hard") {
			spider.appear();
		}

		const dequeue = () => {
			if (0 < count) {
				if (count % 10 === 0 && isGenerateKumoko(collidedSpiderCount / 10)) {
					generate("kumoko");
				} else if (0 < countNotIntoDustbox && countNotIntoDustbox % 5 === 0) {
					if (this.random.get(0, 1) === 0) {
						generate("kinkai");
					} else {
						generate("satsutaba");
					}
				} else {
					generate();
				}
			} else {
				generate();
			}

			const obj = manager.dequeue();

			if (obj) {
				if (obj.categoryBit === cate[0]) {
					garbageLayerA.append(obj);
				} else if (obj.categoryBit === cate[1]) {
					garbageLayerB.append(obj);
				} else if (obj.categoryBit === cate[2]) {
					garbageLayerC.append(obj);
				} else if (obj.categoryBit === cate[3]) {
					garbageLayerD.append(obj);
				} else {
					garbageLayerA.append(obj);
				}

				const triggers: g.Trigger<void>[] = [];

				obj.throwed.addOnce(() => {
					nicomoba.throw();
					this.audioManager.play("se_throwing");

					// 投げたあとにコタツの当たり判定を削除する
					kotatsu.removeBody();

					// 指定秒経ったら強制的に停止
					this.setTimeout(() => {
						if (this.isSleep) {
							return;
						}
						obj.stopped.fire();
					}, DURATION_FORCE_NEXT);

					inDustbox = false;
				}, obj);
				obj.stopped.addOnce(() => {
					if (!inDustbox) {
						continuedCount = 0;
						countNotIntoDustbox += 1;
					}
					count += 1;

					// クモ子だったら削除
					if (obj instanceof Kumoko) {
						obj.remove();
					}

					// すべてのトリガを削除
					triggers.forEach(t => t.destroy());
					triggers.splice(0, triggers.length);

					// トリガを解放
					contact.removeCollidedTrigger(wall.wall, obj.b2body);
					contact.removeCollidedTrigger(dustbox.collisionBody, obj.b2body);
					contact.removeCollidedTrigger(spider.spider.b2body, obj.b2body);
					contact.removeCollidedTrigger(web.b2body, obj.b2body);
					contact.removeCollidedTrigger(kotatsu.b2body, obj.b2body);
					contact.removeCollidedTrigger(dustbox.dustboxBody.b2body, obj.b2body);

					// 次のゴミを出現させる
					dequeue();

					// コタツの当たり判定を復活する
					kotatsu.createBody();
				});

				// 壁または床に当たった
				const t1 = contact.createCollidedTrigger(wall.wall, obj.b2body);
				t1.add(() => {
					obj.playSE();
				});
				triggers.push(t1);

				// ゴミ箱に入った
				const t2 = contact.createCollidedTrigger(dustbox.collisionBody, obj.b2body);
				t2.addOnce(() => {
					continuedCount += 1;
					countIntoDustbox += 1;
					countNotIntoDustbox = 0;
					inDustbox = true;

					if (countIntoDustbox === 3) {
						if (this.difficulty === "normal") {
							spider.appear();
							this.audioManager.play("se_spider");
						}
					}

					let score: number;
					if (obj instanceof Kumoko) {
						this.audioManager.play("se_bad");
						score = obj.getScores().dustbox;
					} else {
						this.audioManager.play("se_in_dustbox");
						score = obj.getScores().dustbox * Math.min(continuedCount, NUMBER_BONUS_MAX);
					}

					if (!(obj instanceof Kumoko)) {
						nicomoba.beHappy();
					}
					topLayer.append(nicomoba);
					nicomoba.tweenEnded.addOnce(() => {
						backLayer.append(nicomoba);
					});
					const volatile = factory.create(
						"volatile_score",
						{
							font: font_time,
							duration: DURATION_SCORE_INTO_DUSTBOX,
							score,
							x: dustbox.offsetX - 100,
							y: dustbox.offsetY - 75
						}
					);
					topLayer.append(volatile);
					this.gameState.score = Math.max(this.gameState.score + score, 0);
				});
				triggers.push(t2);

				// クモにあたった
				const t3 = contact.createCollidedTrigger(spider.spider.b2body, obj.b2body);
				t3.addOnce(() => {
					let crash: g.Sprite;

					if (obj instanceof Kumoko) {
						this.audioManager.play("se_fanfare");
						// クモ子だったら喜ぶ
						nicomoba.beHappy();
						topLayer.append(nicomoba);
						nicomoba.tweenEnded.addOnce(() => {
							backLayer.append(nicomoba);
						});

						inDustbox = true;

						crash = factory.create(
							"heart",
							{
								x: (obj.x + spider.spider.x) / 2,
								y: (obj.y + spider.spider.y) / 2
							}
						);
						spider.love();
						obj.love(800);
						this.sleep(800, () => {
							obj.stopped.fire();
						});
					} else {
						this.audioManager.play("se_spider");
						crash = factory.create(
							"crash",
							{
								x: spider.spider.x,
								y: spider.spider.y
							}
						);
						spider.collided();

						// ゴミ箱に入らなかった場合のみ加算
						if (!inDustbox) {
							collidedSpiderCount += 1;
						}
					}
					backLayer.append(crash);

					const score = obj.getScores().spider;
					if (score !== 0) {
						const volatile = factory.create(
							"volatile_score",
							{
								font: font_time,
								duration: DURATION_SCORE_INTO_DUSTBOX,
								score,
								x: crash.x - 100,
								y: crash.y - 75
							}
						);
						topLayer.append(volatile);
						this.gameState.score = Math.max(this.gameState.score + score, 0);
					}

					this.setTimeout(() => {
						crash.destroy();
					}, DURATION_SHOWING_CRASH_TO_SPIDER);
				});
				triggers.push(t3);

				// クモの巣に引っかかった
				const t4 = contact.createCollidedTrigger(web.b2body, obj.b2body);
				t4.addOnce(() => {
					this.audioManager.play("se_spider_web");

					const pos = obj.b2body.GetPosition();

					// 1フレーム後に止まるようにする
					this.setTimeout(() => {
						const _pos = obj.b2body.GetPosition();
						obj.b2body.SetPosition(
							new b2.Box2DWeb.Common.Math.b2Vec2(
								(pos.x + _pos.x) / 2,
								(pos.y + _pos.y) / 2
							)
						);
						obj.b2body.SetType(b2.BodyType.Static);

						// 指定秒数後に次のゴミを投げれるようにする
						this.setTimeout(() => {
							obj.b2body.SetAwake(false);
							// 物理エンジンの世界からのみ削除する
							box2d.world.DestroyBody(obj.b2body);
						}, INTERVAL_INTO_DUSTBOX);
					}, 0);
				});
				triggers.push(t4);

				// コタツに当たった
				const t5 = contact.createCollidedTrigger(kotatsu.b2body, obj.b2body);
				t5.addOnce(() => {
					obj.playSE();
				});
				triggers.push(t5);

				// ゴミ箱に当たった
				const t6 = contact.createCollidedTrigger(dustbox.dustboxBody.b2body, obj.b2body);
				t6.addOnce(() => {
					obj.playSE();
				});
				triggers.push(t6);
			}

			return obj;
		};

		const font_time = new g.BitmapFont({
			src: this.assets.sprite,
			map: glyph_game_score,
			defaultGlyphWidth: 50,
			defaultGlyphHeight: 66 // NOTE: これがデフォルトのフォントサイズになる
		});

		const font_score = new g.BitmapFont({
			src: this.assets.sprite,
			map: glyph_game_score,
			defaultGlyphWidth: 50,
			defaultGlyphHeight: 66
		});

		const scoreLabel = factory.create(
			"score",
			{
				font: font_score
			}
		);
		frontmostLayer.append(scoreLabel);

		const time = factory.create(
			"time",
			{
				font: font_score,
				text: this.gameState.time + ""
			}
		);
		frontmostLayer.append(time);

		const timeLabel = factory.create("time_label");
		frontmostLayer.append(timeLabel);

		this.gameState.timeChanged.add(state => {
			time.text = state.time + " ";
			time.invalidate();

			if (state.time <= 10) {
				warning.warn();
			}

			if (0 < state.time && state.time <= 3) {
				this.audioManager.play("se_pon");
			}

			if (state.time <= 0) {
				this.audioManager.stopBGM("sample_hue");
				warning.stop();
				this.update.remove(this.onUpdate, this);

				const finish = factory.create("finish");
				frontmostLayer.append(finish);

				this.audioManager.play("se_pii");

				const pii = this.audioManager.get("se_pii");
				const timeup = this.audioManager.get("se_timeup");

				this.setTimeout(() => {
					this.audioManager.play("se_timeup");
				}, pii.duration - 300);

				this.setTimeout(() => {
					this.finished.fire({
						score: state.score
					} as GameSceneFinishedParameter);
				}, pii.duration + timeup.duration + DURATION_SHOWING_FINISH);

				this.gameState.stop();

				return true;
			}
		});

		const gameScoreManager = new GameScoreManager();

		// 最初に値を初期化
		gameScoreManager.setScore(0);

		this.gameState.scoreChanged.add(state => {
			const scoreDiff = state.score - scoreLabel.score;
			scoreLabel.increaseScore(scoreDiff);
			gameScoreManager.setScore(state.score);
		});

		this.stateChanged.addOnce(state => {
			if (state === g.SceneState.BeforeDestroyed) {
				this.box2d.destroy();
			}
		});

		this.setTimeout(() => {
			description.destroy();
			this.audioManager.play("se_ready_start");

			frontmostLayer.append(yoi);
			yoi.fadeIn(300);

			this.setTimeout(() => {
				yoi.destroy();

				frontmostLayer.append(start);
				this.setTimeout(() => {
					start.fadeOut(300);

					this.setTimeout(() => {
						start.destroy();
						topLayer.append(arrow);
						arrow.createTween();

						// 初回のみ投げたあとに矢印を消す
						const initObj = dequeue();
						if (initObj) {
							initObj.throwed.addOnce(() => {
								arrow.destroy();
							});
						}
						this.gameState.start();
					}, 200);
				}, 400);
			}, 800);
		}, DURATION_SHOWING_LOGO);
	}

	private sleep(duration: number, callback?: () => void) {
		this.isSleep = true;
		this.setTimeout(
			() => {
				this.isSleep = false;
				if (callback) {
					callback();
				}
			},
			duration
		);
	}

	private onUpdate(): void {
		if (!this.isSleep) {
			this.box2d.step(1 / game.fps);
		}
	}
}
