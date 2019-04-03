export interface SpriteData {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const spriteMap: {[name: string]: SpriteData} = {
	// ごみ
	tissue: {
		x: 0,
		y: 0,
		width: 92,
		height: 83
	},
	apple: {
		x: 92,
		y: 0,
		width: 68,
		height: 106
	},
	orange: {
		x: 160,
		y: 0,
		width: 120,
		height: 88
	},
	can: {
		x: 280,
		y: 0,
		width: 75,
		height: 114
	},
	fish: {
		x: 355,
		y: 0,
		width: 132,
		height: 56
	},
	satsutaba: {
		x: 487,
		y: 0,
		width: 122,
		height: 106
	},
	kinkai: {
		x: 609,
		y: 0,
		width: 122,
		height: 106
	},

	// ゴミ箱
	dustbox_back: {
		x: 800,
		y: 0,
		width: 160,
		height: 190
	},
	dustbox_front: {
		x: 960,
		y: 0,
		width: 160,
		height: 190
	},

	crash: {
		x: 1120,
		y: 0,
		width: 210,
		height: 214
	},

	// くも
	spider_normal: {
		x: 1140,
		y: 230,
		width: 174,
		height: 134
	},
	spider_crashed: {
		x: 1314,
		y: 230,
		width: 174,
		height: 134
	},
	spider_love: {
		x: 1488,
		y: 230,
		width: 174,
		height: 134
	},
	spider_web: {
		x: 970,
		y: 950,
		width: 236,
		height: 206
	},
	spider_yarn: {
		x: 1300,
		y: 720,
		width: 32,
		height: 420
	},

	// クモ子
	kumoko: {
		x: 1662,
		y: 230,
		width: 168,
		height: 146
	},
	kumoko_love: {
		x: 1830,
		y: 230,
		width: 168,
		height: 146
	},

	// ハート
	heart: {
		x: 1360,
		y: 720,
		width: 240,
		height: 236
	},

	// ニコモバちゃん
	nicomoba_0: {
		x: 0,
		y: 380,
		width: 262,
		height: 340
	},
	nicomoba_1: {
		x: 261,
		y: 380,
		width: 262,
		height: 340
	},
	nicomoba_2: {
		x: 523,
		y: 380,
		width: 262,
		height: 340
	},
	nicomoba_3: {
		x: 785,
		y: 380,
		width: 262,
		height: 340
	},
	nicomoba_4: {
		x: 1047,
		y: 380,
		width: 262,
		height: 340
	},
	nicomoba_5: {
		x: 1309,
		y: 380,
		width: 262,
		height: 340
	},

	// その他
	tatami: {
		x: 0,
		y: 720,
		width: 1280,
		height: 214
	},
	kotatsu: {
		x: 502,
		y: 953,
		width: 467,
		height: 280
	},
	arrow: {
		x: 970,
		y: 1157,
		width: 276,
		height: 167
	},

	// ゴミ箱に入れろ！
	description: {
		x: 0,
		y: 200,
		width: 1104,
		height: 176
	},

	// よーい
	yoi: {
		x: 1360,
		y: 956,
		width: 764,
		height: 212
	},

	// スタート
	start: {
		x: 1331,
		y: 0,
		width: 764,
		height: 212
	},

	// 終了
	finish: {
		x: 0,
		y: 950,
		width: 500,
		height: 260
	},

	// score
	score: {
		x: 0,
		y: 1240,
		width: 570,
		height: 80
	},

	// time
	time_label: {
		x: 576,
		y: 1240,
		width: 157,
		height: 63
	},

	// キラキラ
	kirakira0: {
		x: 1570,
		y: 380,
		width: 215,
		height: 90
	},
	kirakira1: {
		x: 1785,
		y: 380,
		width: 215,
		height: 90
	}
};
