import { HoverableE } from "@akashic-extension/akashic-hover-plugin";

export class Button extends g.Sprite implements HoverableE {
	hoverable: boolean = true;
	hovered: g.Trigger<void> = new g.Trigger();
	unhovered: g.Trigger<void> = new g.Trigger();

	constructor(param: g.SpriteParameterObject) {
		super(param);
		this.hovered.add(this.onHovered, this);
		this.unhovered.add(this.offHovered, this);
	}

	onHovered() {
		this.opacity = 0.6;
		this.modified();
	}

	offHovered() {
		this.opacity = 1.0;
		this.modified();
	}

	disable() {
		this.hoverable = false;
		this.onHovered();
	}

	enable() {
		this.hoverable = true;
		this.offHovered();
	}

	destroy() {
		super.destroy();
		this.hovered.destroy();
		this.hovered = null!;
		this.unhovered.destroy();
		this.unhovered = null!;
	}
}
