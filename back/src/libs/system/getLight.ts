import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';

export function getLight(): Promise<number> {
	if (process.env.NODE_ENV === 'development') {
		return new Promise((s) => {
			s(100);
		});
	}
	return new Promise((s, f) =>
		exec('cat /sys/class/backlight/rpi_backlight/brightness', (err: ExecException, stdout: string) => {
			logguer.d('Debug -> getLight :', err);
			if (err) return f(err);
			s(Number(stdout));
		})
	);
}
