import { Box2D } from "@akashic-extension/akashic-box2d";
import { Timeline } from "@akashic-extension/akashic-timeline";
import { PysicalContainerE, PysicalContainerEParameter } from "../object/PysicalContainerE";
import { ObjectFactory } from "../object/ObjectFactory";
import { Garbage } from "../object/garbage/Garbage";

export interface GarbageManagerParameter extends PysicalContainerEParameter {
	scene: g.Scene;
	box2d: Box2D;
	factory: ObjectFactory;
}

export interface GarbageManagerEnqueueParameter {
	name: string;
	categoryBit: number;
}

export class GarbageManager extends PysicalContainerE {
	private params: [GarbageManagerEnqueueParameter, g.E][];
	private back: g.FilledRect;
	private factory: ObjectFactory;
	private timeline: Timeline;

	constructor(param: GarbageManagerParameter) {
		super(param);

		this.params = [];
		this.factory = param.factory;
		this.back = new g.FilledRect({
			scene: param.scene,
			cssColor: "pink",
			width: this.width,
			height: this.height,
			x: param.offsetX,
			y: param.offsetY
		});
		this.timeline = new Timeline(this.scene);
		this.append(this.back);
	}

	enqueue(param: GarbageManagerEnqueueParameter) {
		this.params.push([param, this.createIcon(param.name)]);
		this.updateIcons(true);
	}

	dequeue(): Garbage | null {
		const queue = this.params.shift();
		if (queue) {
			const g = this.factory.createAsThrowable(
				queue[0].name as any,
				{
					categoryBit: queue[0].categoryBit
				}
			);
			g.opacity = 0;
			g.modified();
			this.timeline.create(g, {modified: g.modified})
			.to({opacity: 1}, 500);

			queue[1].destroy();

			this.updateIcons(true);
			return g;
		}
		return null;
	}

	private createIcon(name: string) {
		const data = this.factory.resolveSprite(name);
		const src = this.factory.resolveAsset(name);
		const icon = new g.Sprite({
			scene: this.scene,
			src,
			width: 32,
			height: 32,
			srcX: data.x,
			srcY: data.y,
			srcWidth: data.width,
			srcHeight: data.height
		});
		this.back.append(icon);

		return icon;
	}

	private updateIcons(anim?: boolean) {
		let offsetX = 8;
		for (let i = 0; i < this.params.length; i++) {
			const icon = this.params[i]![1];
			if (anim) {
				this.timeline.create(icon, { modified: icon.modified }).to({x: offsetX}, 100);
			} else {
				icon.x = offsetX;
				icon.modified();
			}
			offsetX += 32 + 8;
		}
		// this.back.width = offsetX;
		// this.back.modified();
	}
}
