// @see https://atsumaru.github.io/api-references/scoreboard/

interface Window {
	gScriptContainer?: any;
	RPGAtsumaru: {
		experimental: {
			scoreboards: {
				setRecord: (boardId: ScoreBoardID, score: number) => Promise<void>;
				display: (boardId: ScoreBoardID) => Promise<void>;
				getRecords: (boardId: ScoreBoardID) => Promise<ScoreboardData>;
			}
		}
	};
}

export type ScoreBoardID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ScoreboardData {
	boardId: number;
	boardName: string;
	myRecord?: {
		rank: number;
		score: number;
		isNewRecord: boolean;
	};
	myBestRecord?: {
		rank: number;
		userName: string;
		score: number;
	};
	ranking: {
		rank: number;
		userName: string;
		score: number;
	}[];
}

declare const window: Window;

export class AtsumaruManager {
	static isSupported: boolean = (typeof window !== "undefined") && (window.gScriptContainer != null || (window.RPGAtsumaru != null));

	setRecord(boardId: ScoreBoardID, score: number, callback?: (err?: any) => void): void {
		if (!AtsumaruManager.isSupported) {
			if (callback) callback(new Error("Not a atsumaru environment"));
			return;
		}
		if (
			typeof window === "undefined" ||
			!window.RPGAtsumaru ||
			!window.RPGAtsumaru.experimental ||
			!window.RPGAtsumaru.experimental.scoreboards ||
			!window.RPGAtsumaru.experimental.scoreboards.setRecord
		) {
			if (callback) callback(new Error("Not a atsumaru environment"));
			return;
		}
		window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId, score).then(() => callback ? callback() : null).catch(e => callback ? callback(e) : null);
	}

	display(boardId: ScoreBoardID, callback?: (err?: any) => void): void {
		if (!AtsumaruManager.isSupported) {
			if (callback) callback(new Error("Not a atsumaru environment"));
			return;
		}
		if (
			typeof window === "undefined" ||
			!window.RPGAtsumaru ||
			!window.RPGAtsumaru.experimental ||
			!window.RPGAtsumaru.experimental.scoreboards ||
			!window.RPGAtsumaru.experimental.scoreboards.display
		) {
			if (callback) callback(new Error("Not a atsumaru environment"));
			return;
		}
		window.RPGAtsumaru.experimental.scoreboards.display(boardId).then(() => callback ? callback() : null).catch(e => callback ? callback(e) : null);
	}

	getRecords(boardId: ScoreBoardID, callback: (err?: any, data?: ScoreboardData) => void): void {
		if (!AtsumaruManager.isSupported) {
			if (callback) callback(new Error("Not a atsumaru environment"));
			return;
		}
		if (
			typeof window === "undefined" ||
			!window.RPGAtsumaru ||
			!window.RPGAtsumaru.experimental ||
			!window.RPGAtsumaru.experimental.scoreboards ||
			!window.RPGAtsumaru.experimental.scoreboards.getRecords) {
			if (callback) callback(new Error("Not a atsumaru environment"));
			return;
		}
		window.RPGAtsumaru.experimental.scoreboards.getRecords(boardId).then(data => callback(null, data)).catch(e => callback(e));
	}
}
