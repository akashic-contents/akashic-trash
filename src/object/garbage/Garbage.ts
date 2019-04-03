import { PysicalE, PysicalEParameter } from "../PysicalE";

export interface GarbageParameter extends PysicalEParameter {
	se?: g.AudioAsset;
	airResistance?: number;

	pysicalDiameter?: number;

	pysicalWidth?: number;
	pysicalHeight?: number;
}

export interface GarbageScores {
	floor: number;
	dustbox: number;
	spider: number;
}

export abstract class Garbage extends PysicalE {
	se: g.AudioAsset | undefined;

	constructor(param: GarbageParameter) {
		super(param);

		this.se = param.se;
	}

	abstract getScores(): GarbageScores;

	playSE(): g.AudioPlayer | null {
		return this.se != null ? this.se.play() : null;
	}
}
