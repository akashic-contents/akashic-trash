import { Timeline, Tween } from "@akashic-extension/akashic-timeline";
import { GarbageParameter, Garbage } from "./Garbage";
import { SpriteData } from "../../data/sprite";

export interface KirakiraGarbageParameter extends GarbageParameter {
	kirakiraData: SpriteData[];
}

export abstract class KirakiraGarbage extends Garbage {
	private timeline: Timeline;
	private tween: Tween | null;
	private kirakiraData: SpriteData[];
	private kirakira: g.Sprite;

	constructor(param: KirakiraGarbageParameter) {
		super(param);

		this.timeline = new Timeline(param.scene);
		this.kirakiraData = param.kirakiraData;

		this.update.add(this.onUpdate, this);

		// TODO: いつかちゃんとする
		this.update.addOnce(() => {
			this.start();
		});
		this.stopped.addOnce(() => {
			this.stop();
		});
	}

	start() {
		const d = this.kirakiraData[0];

		if (!this.kirakira) {
			this.kirakira = new g.Sprite({
				scene: this.scene,
				src: this.surface,
				x: this.x + (this.width - d.width) / 2,
				y: this.y + (this.height - d.height) / 2,
				width: d.width,
				height: d.height,
				srcX: d.x,
				srcY: d.y,
				srcWidth: d.width,
				srcHeight: d.height
			});
		}

		const parent = this.parent;
		const s = this.kirakira;
		parent.append(s);

		this.tween = this.kirakiraData.reduce(
			(data, c) => {
				return data.to({
					srcX: c.x,
					srcY: c.y,
					srcWidth: c.width,
					srcHeight: c.height
				}, 0).wait(500);
			},
			this.timeline.create(s, { modified: s.invalidate, loop: true })
		);
	}

	stop() {
		if (this.tween) {
			this.timeline.remove(this.tween);
			this.tween = null;
		}
		this.kirakira.destroy();
	}

	protected onUpdate() {
		if (this.kirakira) {
			this.kirakira.x = this.x + (this.width - this.kirakira.width) / 2;
			this.kirakira.y = this.y + (this.height - this.kirakira.height) / 2;
			this.kirakira.modified();
		}
	}
}
