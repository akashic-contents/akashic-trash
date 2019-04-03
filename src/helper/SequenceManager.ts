export class SequenceManager {
	private _funcs: (() => void)[] = [];

	add(func: () => void): void {
		this._funcs.push(func);
	}

	remove(func: () => void): void {
		this._funcs = this._funcs.filter(f => f !== func);
	}

	next(): void {
		const func = this._funcs.shift();
		if (func) {
			func();
		}
	}
}
