import logguer from 'basic-log';
import { exec } from 'child_process';
import SocketServeur from '../../Serveur/Sockets/SockerServeur';

export default class SocketSystem {
	static init(listener: SocketIO.Server) {
		SocketSystem.registerKeyboardEvent(listener);
		SocketSystem.registerShutdown(listener);
		SocketSystem.registerLogin(listener);
		SocketSystem.log(listener);
		SocketSystem.registerWakeUpScreenSaver(listener);
	}

	static registerKeyboardEvent(listener: SocketIO.Server) {
		listener.on('openKeyboard', () => {
			logguer.d('SocketSystem -> open keyboard');
		});

		listener.on('closeKeyboard', () => {
			logguer.d('SocketSystem -> close keyboard');
		});
	}

	static registerShutdown(listener: SocketIO.Server) {
		listener.on('shutdown', () => {
			logguer.d('SocketSystem -> shutdown');
			if (process.env.NODE_ENV !== 'developpement') exec('poweroff');
		});
	}

	static registerWakeUpScreenSaver(listener: SocketIO.Server) {
		listener.on('wakeupscreensaver', () => {
			logguer.d('SocketSystem -> wakeupscreensaver');
			if (process.env.NODE_ENV !== 'developpement') exec('XAUTHORITY=~pi/.Xauthority DISPLAY=:0 xset s reset');
		});
	}

	static registerLogin(listener: SocketIO.Server) {
		listener.on('login', (token) => {
			logguer.d('SocketSystem -> registerLogin -> token', token);
			SocketServeur.shared.io.emit('login', token);
		});
	}

	static log(listener: SocketIO.Server) {
		listener.on('logError', (log) => {
			logguer.e('SocketSystem -> log -> Error :', log);
		});

		listener.on('logInfo', (log) => {
			logguer.i('SocketSystem -> log -> Info :', log);
		});
	}

	static fireCheckUpdate() {
		logguer.d('SocketAlarm -> fireCheckUpdate');
		SocketServeur.shared.io.emit('checkUpdate');
	}
}
