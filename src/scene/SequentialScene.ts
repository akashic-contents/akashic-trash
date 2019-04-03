import { AudioMManager } from "../helper/AudioManager";

export interface SequentialSceneParameter extends g.SceneParameterObject {
	audioManager?: AudioMManager;
}

export class SequentialScene extends g.Scene {
	finished: g.Trigger<any> = new g.Trigger();
	protected audioManager: AudioMManager | undefined;

	constructor(param: SequentialSceneParameter) {
		super(param);
		this.audioManager = param.audioManager;
	}
}
