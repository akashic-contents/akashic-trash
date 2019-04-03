/**
 * 複数の Scene にまたがるオーディオを制御するクラス。
 */
export class AudioMManager {
	private assetMap: {[assetId: string]: g.AudioAsset} = {};
	private playerMap: {[assetId: string]: g.AudioPlayer} = {};

	add(asset: g.AudioAsset): void {
		this.assetMap[asset.id] = asset;
	}

	get(assetId: string): g.AudioAsset {
		const asset = this.assetMap[assetId];
		if (asset == null) {
			throw new Error();
		}
		return asset;
	}

	play(assetId: string): void {
		const asset = this.assetMap[assetId];
		if (asset == null) {
			throw new Error();
		}
		asset.play();
	}

	playBGM(assetId: string): g.AudioPlayer {
		const asset = this.assetMap[assetId];
		if (this.playerMap[assetId] != null) {
			this.playerMap[asset.id].stop();
		}
		this.playerMap[asset.id] = asset.play();
		return this.playerMap[asset.id];
	}

	stopBGM(assetId: string): void {
		this.playerMap[assetId].stop();
		delete this.playerMap[assetId];
	}

	isPlaying(assetId: string): boolean {
		return this.playerMap[assetId] != null;
	}
}
