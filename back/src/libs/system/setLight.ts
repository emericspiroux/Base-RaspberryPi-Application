import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';
import { getLight } from './getLight';

export function setLight(level: number): Promise<number> {
	if (process.env.NODE_ENV === 'development') {
		return new Promise(async (s) => {
			s(level);
		});
	}
	return new Promise(async (s) => {
		if (level > 255 || level < 1) {
			return s(await getLight());
		}
		exec(
			`echo ${level} > /sys/class/backlight/rpi_backlight/brightness`,
			async (err: ExecException, stdout: string) => {
				logguer.d('Debug -> getLight :', err, stdout);
				if (err) return s(await getLight());
				s(level);
			}
		);
	});
}
