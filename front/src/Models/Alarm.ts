export default interface Alarm {
	_id: string;
	enabled: boolean;
	name: string;
	min: number;
	hour: number;
	days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;
	play: AlarmOptions;
}

export interface AlarmOptions {
	volume: number;
	shuffle: boolean;
	playlistId: string;
}
