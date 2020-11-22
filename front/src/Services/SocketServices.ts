import { Store } from 'redux';
import SocketIOClient from 'socket.io-client';
import { AlarmOptions } from '../Models/Alarm';
import { getPlaylistTracks, setIsFailedAlarm } from '../Modules/Spotify';
import { checkSystemUpdate } from '../Modules/System';
import { setToken } from '../Modules/User';

class SocketServices {
	static shared: SocketServices = new SocketServices();
	private store?: Store;
	private socketPrv: SocketIOClient.Socket;

	constructor() {
		this.socketPrv = SocketIOClient(process.env.REACT_APP_WEBSOCKET_URL || '', {});
	}

	get socket(): SocketIOClient.Socket {
		return this.socketPrv;
	}

	setStore(store: Store) {
		this.store = store;
	}

	get deviceId(): string {
		return this.state.Spotify.deviceId;
	}

	get state() {
		let state = this.store!.getState();
		return state;
	}

	addListennerCheckUpdate() {
		this.socketPrv.on('checkUpdate', () => {
			this.store!.dispatch(checkSystemUpdate());
		});
	}

	removeListennerCheckUpdate() {
		this.socketPrv.off('checkUpdate');
	}

	addListennerAlarm() {
		this.socketPrv.on('alarm', (alarmOptions: AlarmOptions) => {
			this.store!.dispatch(getPlaylistTracks(alarmOptions.playlistId, true, alarmOptions, true));
		});
	}

	addListennerLogin() {
		this.socketPrv.on('login', (token: any) => {
			this.store!.dispatch(setToken(token));
		});
	}

	addListennerFailedAlarm() {
		this.socketPrv.on('isFailedAlarm', () => {
			this.store!.dispatch(setIsFailedAlarm(true));
		});
	}

	removeListenerFailedAlarm() {
		this.socketPrv.off('isFailedAlarm');
	}

	removeListennerLogin() {
		this.socketPrv.off('login');
	}

	removeListennerAlarm() {
		this.socketPrv.off('alarm');
	}

	openKeyboard() {
		this.socketPrv.emit('openKeyboard');
	}

	closeKeyboard() {
		this.socketPrv.emit('closeKeyboard');
	}

	shutdown() {
		this.socketPrv.emit('shutdown');
	}

	wakeUpScreenSaver() {
		this.socketPrv.emit('wakeupscreensaver');
	}

	get log() {
		return {
			error: (text: string) => {
				this.socketPrv.emit('logError', text);
			},
			info: (text: string) => {
				this.socketPrv.emit('logInfo', text);
			},
		};
	}

	loginOtherDevices(token: any) {
		this.socketPrv.emit('login', token);
	}
}

export default SocketServices;
