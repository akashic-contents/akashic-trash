export interface SpriteData {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const spriteScoreMap: {[name: string]: SpriteData} = {
	// score
	score_board_score_label: {
		x: 0,
		y: 160,
		width: 320,
		height: 82
	},

	// pt
	score_board_pt: {
		x: 320,
		y: 160,
		width: 96,
		height: 90
	},

	// frame
	score_board_frame: {
		x: 416 + 4, // margin
		y: 160 + 4, // margin
		width: 160 - 8, // margin
		height: 160 - 8 // margin
	}
};
