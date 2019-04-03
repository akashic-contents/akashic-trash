export interface PosisionData {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

export const positionMap: {[name: string]: PosisionData} = {
	// ゴミ箱
	dustbox: {
		x: 1010,
		y: 430
	},

	// くもの支点
	spider_fulcrum: {
		x: 830,
		y: -200
	},

	// くもの巣
	spider_web: {
		x: 1280 - 236,
		y: 0
	},

	// ゴミの出現位置
	spawn: {
		x: 324 - 30,
		y: 320
	},

	// score
	score: {
		x: 685,
		y: 616
	},

	// ニコモバちゃん
	nicomoba: {
		x: 50 - 30,
		y: 247
	},

	// 矢印
	arrow_from: {
		x: 400 - 30,
		y: 230
	},
	// 矢印: 最終的な位置
	arrow_to: {
		x: 500 - 30,
		y: 200
	},

	// その他
	tatami: {
		x: 0,
		y: 720 - 214
	},
	kotatsu: {
		x: 150 - 30,
		y: 390
	},

	// 残り時間
	time_label: {
		x: 24,
		y: 25
	},
	time: {
		x: 188,
		y: 25
	},

	// 終了ロゴ
	finish: {
		x: 390,
		y: 230
	},
	finish_atsumaru: {
		x: 390,
		y: 170
	},

	// 各種ボタン
	button_replay: {
		x: 120,
		y: 488
	},
	button_display_score: {
		x: 670,
		y: 488
	},

	// スコア枠
	score_frame: {
		x: 192,
		y: 140,
		width: 896,
		height: 336
	},

	// スコア枠内の "score" (相対座標)
	score_label: {
		x: 288,
		y: 26
	},

	score_value: {
		x: 0,
		y: 130,
		width: 736,
		height: 128
	},

	// スコア枠内の "pt" (相対座標)
	score_pt: {
		x: 756,
		y: 206
	}
};
