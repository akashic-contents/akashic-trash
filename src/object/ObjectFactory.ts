import * as b2 from "@akashic-extension/akashic-box2d";
import * as hover from "@akashic-extension/akashic-hover-plugin";

import { PysicalE } from "./PysicalE";
import { PysicalContainerE } from "./PysicalContainerE";
import { SpiderWeb } from "./physical/SpiderWeb";
import { Kotatsu } from "./physical/Kotatsu";
import { SpiderContainer } from "./physical/SpiderContainer";
import { Dustbox } from "./physical/Dustbox";
import { Wall } from "./physical/Wall";
import { Nicomoba } from "./sprite/Nicomoba";
import { ScoreLabel } from "./sprite/ScoreLabel";
import { Arrow } from "./sprite/Arrow";
import { VolatileLabel } from "./sprite/VolatileLabel";
import { Warning } from "./sprite/Warning";
import { Logo } from "./sprite/Logo";
import { Button } from "./sprite/Button";
import { ScoreBoard } from "./sprite/ScoreBoard";

import { GarbageParameter } from "./garbage/Garbage";
import { Tissue } from "./garbage/Tissue";
import { Can } from "./garbage/Can";
import { Fish } from "./garbage/Fish";
import { Apple } from "./garbage/Apple";
import { Orange } from "./garbage/Orange";
import { Satsutaba } from "./garbage/Satsutaba";
import { Kinkai } from "./garbage/Kinkai";
import { Kumoko } from "./garbage/Kumoko";

import { SpriteData, spriteMap } from "../data/sprite";
import { spriteAtsumaruMap } from "../data/sprite_atsumaru";
import { spriteScoreMap } from "../data/sprite_socre";
import { positionMap, PosisionData } from "../data/position";

export interface ObjectFactoryParameter {
	scene: g.Scene;
	box2d?: b2.Box2D;
}

export interface ObjectFactoryBaseCreateParameter {
	x?: number;
	y?: number;
}

export interface ObjectFactoryLabelCreateParameter extends ObjectFactoryFontCreateParameter {
	text: string;
}

export interface ObjectFactoryFontCreateParameter extends ObjectFactoryBaseCreateParameter {
	font: g.Font;
}

export interface ObjectFactoryVolatileScoreCreateParameter extends ObjectFactoryFontCreateParameter {
	score: number;
	duration: number;
}

export interface ObjectFactoryScoreBoardCreateParameter extends ObjectFactoryVolatileScoreCreateParameter {
	//
}

export interface ObjectFactoryPhysicalCreateParameter extends ObjectFactoryBaseCreateParameter {
	categoryBit?: number;
}

export interface ObjectFactoryButtonCreateParameter extends ObjectFactoryFontCreateParameter {
	textColor: string;
	backColor: string;
	fontSize: number;
}

export type ObjectFactoryCreateParameter =
	ObjectFactoryBaseCreateParameter |
	ObjectFactoryFontCreateParameter |
	ObjectFactoryPhysicalCreateParameter |
	ObjectFactoryVolatileScoreCreateParameter |
	ObjectFactoryLabelCreateParameter |
	ObjectFactoryButtonCreateParameter;

export class ObjectFactory {
	private scene: g.Scene;
	private box2d: b2.Box2D | undefined;

	constructor(param: ObjectFactoryParameter) {
		this.scene = param.scene;
		this.box2d = param.box2d;
	}

	resolveSprite(name: string): SpriteData {
		if (spriteAtsumaruMap[name]) {
			return spriteAtsumaruMap[name];
		}
		if (spriteScoreMap[name]) {
			return spriteScoreMap[name];
		}
		return spriteMap[name];
	}

	resolvePosition(name: string): PosisionData {
		return positionMap[name];
	}

	resolveAsset(name: string): g.ImageAsset {
		if (spriteAtsumaruMap[name]) {
			return this.scene.assets.sprite_atsumaru as g.ImageAsset;
		}
		if (spriteScoreMap[name]) {
			return this.scene.assets.sprite_score as g.ImageAsset;
		}
		return this.scene.assets.sprite as g.ImageAsset;
	}

	resolveAudio(name: string): g.AudioAsset {
		return this.scene.assets[name] as g.AudioAsset;
	}

	create(name: "spider"): SpiderContainer;
	create(name: "wall"): Wall;
	create(name: "dustbox"): Dustbox;
	create(name: "kotatsu"): Kotatsu;
	create(name: "spider_web"): SpiderWeb;
	create(name: "nicomoba"): Nicomoba;
	create(name: "tatami" | "dustbox_front" | "time_label"): g.Sprite;
	create(name: "crash" | "heart", param: ObjectFactoryBaseCreateParameter): g.Sprite;
	create(name: "score", param: ObjectFactoryFontCreateParameter): ScoreLabel;
	create(name: "arrow"): Arrow;
	create(name: "volatile_score", param: ObjectFactoryVolatileScoreCreateParameter): VolatileLabel;
	create(name: "warning"): Warning;
	create(name: "description" | "yoi" | "start" | "finish" | "finish_atsumaru" | "time_label"): Logo;
	create(name: "time", param: ObjectFactoryLabelCreateParameter): g.Label;
	create(name: "button_replay" | "button_display_score"): Button;
	create(name: "score_board", param: ObjectFactoryScoreBoardCreateParameter): ScoreBoard;

	create(name: string, param?: ObjectFactoryCreateParameter): PysicalE | PysicalContainerE | g.E {
		const scene = this.scene;
		const box2d = this.box2d;

		let obj: PysicalE | PysicalContainerE | g.E;

		if (name === "spider") {
			if (box2d == null) {
				throw new Error();
			}
			const data0 = this.resolveSprite("spider_normal");
			const data1 = this.resolveSprite("spider_crashed");
			const data2 = this.resolveSprite("spider_love");
			const data3 = this.resolveSprite("spider_yarn");
			const pos = this.resolvePosition("spider_fulcrum");

			obj = new SpiderContainer({
				scene,
				box2d,
				offsetX: pos.x,
				offsetY: pos.y,
				width: 100,
				height: 480,
				spiderSrc: scene.assets.sprite as g.ImageAsset,
				spiderSrcX: data0.x,
				spiderSrcY: data0.y,
				spiderSrcWidth: data0.width,
				spiderSrcHeight: data0.height,
				spiderCrashedSrcX: data1.x,
				spiderCrashedSrcY: data1.y,
				spiderCrashedSrcWidth: data1.width,
				spiderCrashedSrcHeight: data1.height,
				spiderLoveSrcX: data2.x,
				spiderLoveSrcY: data2.y,
				spiderLoveSrcWidth: data2.width,
				spiderLoveSrcHeight: data2.height,
				yarnSrc: scene.assets.sprite as g.ImageAsset,
				yarnSrcX: data3.x,
				yarnSrcY: data3.y,
				yarnSrcWidth: data3.width,
				yarnSrcHeight: data3.height,
				spiderWidth: data0.width,
				spiderHeight: data0.height
			});
		} else if (name === "wall") {
			if (box2d == null) {
				throw new Error();
			}
			obj = new Wall({
				scene,
				box2d
			});
		} else if (name === "dustbox") {
			if (box2d == null) {
				throw new Error();
			}
			const back = this.resolveSprite("dustbox_back");
			const pos = this.resolvePosition("dustbox");

			obj = new Dustbox({
				scene,
				box2d,
				src: scene.assets.sprite as g.ImageAsset,
				srcX: back.x,
				srcY: back.y,
				srcWidth: back.width,
				srcHeight: back.height,
				offsetX: pos.x,
				offsetY: pos.y
			});
		} else if (name === "kotatsu") {
			if (box2d == null) {
				throw new Error();
			}
			const data = this.resolveSprite("kotatsu");
			const pos = this.resolvePosition("kotatsu");
			const src = this.resolveAsset("kotatsu");

			obj = new Kotatsu({
				scene,
				box2d,
				src,
				width: data.width,
				height: data.height,
				x: pos.x,
				y: pos.y,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height
			});
		} else if (name === "spider_web") {
			if (box2d == null) {
				throw new Error();
			}
			const data = this.resolveSprite("spider_web");
			const pos = this.resolvePosition("spider_web");
			const src = this.resolveAsset("spider_web");

			obj = new SpiderWeb({
				scene,
				box2d,
				src,
				width: data.width,
				height: data.height,
				x: pos.x,
				y: pos.y,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height
			});
		} else if (name === "nicomoba") {
			const data0 = this.resolveSprite("nicomoba_0");
			const data1 = this.resolveSprite("nicomoba_1");
			const data2 = this.resolveSprite("nicomoba_2");
			const data3 = this.resolveSprite("nicomoba_3");
			const data4 = this.resolveSprite("nicomoba_4");
			const data5 = this.resolveSprite("nicomoba_5");

			const pos = this.resolvePosition("nicomoba");
			const src = this.resolveAsset("nicomoba");

			obj = new Nicomoba({
				scene,
				src,
				width: data0.width,
				height: data0.height,
				x: pos.x,
				y: pos.y,
				srcX: data0.x,
				srcY: data0.y,
				srcWidth: data0.width,
				srcHeight: data0.height,
				default: data0,
				throw: [
					data1
				],
				beHappy: [
					data2, data3, data4, data5
				]
			});
		} else if (name === "tatami") {
			const data = this.resolveSprite("tatami");
			const pos = this.resolvePosition("tatami");
			const src = this.resolveAsset("tatami");

			obj = new g.Sprite({
				scene,
				src,
				width: data.width,
				height: data.height,
				x: pos.x,
				y: pos.y,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height
			});
		} else if (name === "crash" || name === "heart") {
			if (!param) {
				throw Error();
			}

			const data = this.resolveSprite(name);
			const src = this.resolveAsset(name);

			obj = new g.Sprite({
				scene,
				src,
				width: data.width,
				height: data.height,
				x: param.x,
				y: param.y,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height
			});
		} else if (name === "score") {
			const p = param as ObjectFactoryFontCreateParameter;
			if (!p || p.font == null) {
				throw Error();
			}

			const data = this.resolveSprite("score");
			const src = this.resolveAsset("score");
			const pos = this.resolvePosition("score");

			obj = new ScoreLabel({
				scene,
				font: p.font,
				x: pos.x,
				y: pos.y,
				width: data.width,
				height: data.height,
				backSrc: src,
				backSrcX: data.x,
				backSrcY: data.y,
				backSrcWidth: data.width,
				backSrcHeight: data.height
			});
		} else if (name === "dustbox_front") {
			const front = this.resolveSprite("dustbox_front");
			const pos = this.resolvePosition("dustbox");
			const src = this.resolveAsset("dustbox");

			obj = new g.Sprite({
				scene,
				src,
				width: front.width,
				height: front.height,
				srcX: front.x,
				srcY: front.y,
				srcWidth: front.width,
				srcHeight: front.height,
				x: pos.x,
				y: pos.y
			});
		} else if (name === "arrow") {
			const front = this.resolveSprite("arrow");
			const src = this.resolveAsset("arrow");
			const pos_from = this.resolvePosition("arrow_from");
			const pos_to = this.resolvePosition("arrow_to");

			obj = new Arrow({
				scene,
				src,
				width: front.width,
				height: front.height,
				srcX: front.x,
				srcY: front.y,
				srcWidth: front.width,
				srcHeight: front.height,
				x: pos_from.x,
				y: pos_from.y,
				fromX: pos_from.x,
				fromY: pos_from.y,
				toX: pos_to.x,
				toY: pos_to.y
			});
		} else if (name === "volatile_score") {
			const p = param as ObjectFactoryVolatileScoreCreateParameter;
			obj = new VolatileLabel({
				scene,
				font: p.font,
				fontSize: 66,
				text: `${0 <= p.score ? "+" : ""}${p.score}`,
				duration: p.duration,
				x: p.x,
				y: p.y,
				byX: 0,
				byY: -30
			});
		} else if (name === "warning") {
			obj = new Warning({
				scene,
				width: this.scene.game.width,
				height: this.scene.game.height,
				cssColor: "#ff4300",
				interval: 1000
			});
		} else if (name === "description" || name === "yoi" || name === "start") {
			const data = this.resolveSprite(name);
			const src = this.resolveAsset(name);

			obj = new Logo({
				scene,
				src,
				x: (this.scene.game.width - data.width) / 2,
				y: (this.scene.game.height - data.height) / 2,
				width: this.scene.game.width,
				height: this.scene.game.height,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height,
				cssColor: "white",
				opacity: 0.3
			});
		} else if (name === "finish" || name === "finish_atsumaru") {
			const data = this.resolveSprite("finish");
			const pos = this.resolvePosition(name);
			const src = this.resolveAsset("finish");

			obj = new Logo({
				scene,
				src,
				x: pos.x,
				y: pos.y,
				width: this.scene.game.width,
				height: this.scene.game.height,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height,
				cssColor: "black",
				opacity: 0.7
			});
		} else if (name === "time_label") {
			const data = this.resolveSprite("time_label");
			const pos = this.resolvePosition("time_label");
			const src = this.resolveAsset("time_label");

			obj = new g.Sprite({
				scene,
				src,
				x: pos.x,
				y: pos.y,
				width: data.width,
				height: data.height,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height
			});
		} else if (name === "time") {
			const p = param as ObjectFactoryLabelCreateParameter;
			const pos = this.resolvePosition("time");

			obj = new g.Label({
				scene,
				text: p.text,
				font: p.font,
				fontSize: 66,
				textAlign: g.TextAlign.Right,
				x: pos.x,
				y: pos.y,
				width: 100,
				widthAutoAdjust: true
			});
		} else if (name === "button_replay" || name === "button_display_score") {
			const pos = this.resolvePosition(name);
			const data = this.resolveSprite(name);
			const src = this.resolveAsset(name);

			obj = new Button({
				scene,
				src,
				x: pos.x,
				y: pos.y,
				width: data.width,
				height: data.height,
				srcX: data.x,
				srcY: data.y,
				srcWidth: data.width,
				srcHeight: data.height,
				touchable: true,
				local: true
			});
		} else if (name === "score_board") {
			const p = param as ObjectFactoryScoreBoardCreateParameter;
			if (!p || p.font == null) {
				throw new Error();
			}

			const data0 = this.resolveSprite("score_board_frame");
			const data1 = this.resolveSprite("score_board_score_label");
			const data2 = this.resolveSprite("score_board_pt");

			const pos0 = this.resolvePosition("score_frame");
			const pos1 = this.resolvePosition("score_label");
			const pos2 = this.resolvePosition("score_value");
			const pos3 = this.resolvePosition("score_pt");

			const rollCountAudio = this.resolveAudio("se_roll_count");
			const rollCountFinishAudio = this.resolveAudio("se_roll_count_finish");

			if (pos0.width == null || pos0.height == null) {
				throw new Error();
			}
			if (pos2.width == null || pos2.height == null) {
				throw new Error();
			}

			const src = this.resolveAsset("score_board_frame");

			obj = new ScoreBoard({
				scene,
				x: pos0.x,
				y: pos0.y,
				width: pos0.width!,
				height: pos0.height!,

				score: p.score,
				duration: p.duration,
				scoreFont: p.font,

				rollCountAudio,
				rollCountFinishAudio,

				frameSrc: src,
				frameSrcX: data0.x,
				frameSrcY: data0.y,
				frameSrcWidth: data0.width,
				frameSrcHeight: data0.height,

				scoreLabelSrc: src,
				scoreLabelX: pos1.x,
				scoreLabelY: pos1.y,
				scoreLabelSrcX: data1.x,
				scoreLabelSrcY: data1.y,
				scoreLabelSrcWidth: data1.width,
				scoreLabelSrcHeight: data1.height,

				scoreValueX: pos2.x,
				scoreValueY: pos2.y,
				scoreValueWidth: pos2.width,
				scoreValueHeight: pos2.height,

				ptSrc: src,
				ptX: pos3.x,
				ptY: pos3.y,
				ptSrcX: data2.x,
				ptSrcY: data2.y,
				ptSrcWidth: data2.width,
				ptSrcHeight: data2.height
			});
		} else {
			throw new Error();
		}

		return obj;
	}

	createAsThrowable(name: "tissue", param: ObjectFactoryPhysicalCreateParameter): Tissue;
	createAsThrowable(name: "can", param: ObjectFactoryPhysicalCreateParameter): Can;
	createAsThrowable(name: "fish", param: ObjectFactoryPhysicalCreateParameter): Fish;
	createAsThrowable(name: "apple", param: ObjectFactoryPhysicalCreateParameter): Apple;
	createAsThrowable(name: "orange", param: ObjectFactoryPhysicalCreateParameter): Orange;
	createAsThrowable(name: "satsutaba", param: ObjectFactoryPhysicalCreateParameter): Satsutaba;
	createAsThrowable(name: "kinkai", param: ObjectFactoryPhysicalCreateParameter): Kinkai;
	createAsThrowable(name: "kumoko", param: ObjectFactoryPhysicalCreateParameter): Kumoko;

	createAsThrowable(name: string, param: ObjectFactoryPhysicalCreateParameter): PysicalE {
		if (this.box2d == null) {
			throw new Error();
		}

		const data = this.resolveSprite(name);
		const pos = this.resolvePosition("spawn");

		const base: GarbageParameter = {
			scene: this.scene,
			box2d: this.box2d,
			src: this.scene.assets.sprite,
			width: data.width,
			height: data.height,
			x: pos.x,
			y: pos.y - data.height / 2,
			srcX: data.x,
			srcY: data.y,
			srcWidth: data.width,
			srcHeight: data.height,
			categoryBit: param.categoryBit
		};

		let obj: PysicalE;
		if (name === "tissue") {
			base.se = this.resolveAudio("se_garbage_tissue");
			obj = new Tissue(base);
		} else if (name === "can") {
			base.se = this.resolveAudio("se_garbage_can");
			obj = new Can(base);
		} else if (name === "fish") {
			base.se = this.resolveAudio("se_garbage");
			obj = new Fish(base);
		} else if (name === "apple") {
			base.se = this.resolveAudio("se_garbage");
			obj = new Apple(base);
		} else if (name === "orange") {
			base.se = this.resolveAudio("se_garbage");
			obj = new Orange(base);
		} else if (name === "satsutaba") {
			base.se = this.resolveAudio("se_garbage");
			const kirakiraData = [
				this.resolveSprite("kirakira0"),
				this.resolveSprite("kirakira1")
			];
			obj = new Satsutaba({
				kirakiraData,
				...base
			});
		} else if (name === "kinkai") {
			base.se = this.resolveAudio("se_garbage");
			const kirakiraData = [
				this.resolveSprite("kirakira0"),
				this.resolveSprite("kirakira1")
			];
			obj = new Kinkai({
				kirakiraData,
				...base
			});
		} else if (name === "kumoko") {
			base.se = this.resolveAudio("se_garbage");
			const loveData = spriteMap["kumoko_love"];
			const defaultData = spriteMap["kumoko"];
			obj = new Kumoko({
				loveData,
				defaultData,
				...base
			});
		} else {
			throw new Error();
		}

		hover.Converter.asHoverable(obj.touchableRect);

		obj.touchableRect.pointUp.add(e => {
			if (this.box2d == null) {
				throw new Error();
			}

			let deltaX = e.startDelta.x;
			let deltaY = e.startDelta.y;

			const strength = deltaX * deltaX + deltaY * deltaY;
			const limit = 300000;

			// あまりに弱ければ投げない
			if (strength < 20 * 20 + 20 * 20) {
				return;
			}

			// あまりに強ければ弱くする
			if (limit < strength) {
				deltaX *= limit / strength;
				deltaY *= limit / strength;
			}

			obj.b2body.ApplyImpulse(
				this.box2d.vec2(deltaX / 700, deltaY / 700),
				this.box2d.vec2(
					obj.x + obj.width * (e.point.x / obj.touchableRect.width),
					obj.y + obj.height * (e.point.y / obj.touchableRect.height)
				)
			);

			obj.update.add(() => {
				if (!obj.b2body.IsAwake()) {
					obj.stopped.fire();
					obj.b2body.SetType(b2.BodyType.Static);
					hover.Converter.asUnhoverable(obj);
					return true;
				}
			});

			obj.throwed.fire();
			return true;
		});

		return obj;
	}

	asUnHoverable(e: PysicalE) {
		hover.Converter.asUnhoverable(e);
	}
}
