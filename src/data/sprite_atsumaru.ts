export interface SpriteData {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const spriteAtsumaruMap: {[name: string]: SpriteData} = {
	// もう一度遊ぶ
	button_replay: {
		x: 0,
		y: 0,
		width: 490,
		height: 152
	},

	// スコアを見る
	button_display_score: {
		x: 490,
		y: 0,
		width: 490,
		height: 152
	}
};
