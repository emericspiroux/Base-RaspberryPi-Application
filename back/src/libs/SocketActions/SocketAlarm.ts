import { IAlarmPlay } from '../../Models/Alarms';
import SocketServeur from '../../Serveur/Sockets/SockerServeur';
import logger from 'basic-log';

export default class SocketAlarm {
	static fireAlarm(play: IAlarmPlay) {
		logger.d('SocketAlarm -> fireAlarm -> play', play);
		SocketServeur.shared.io.emit('alarm', play);
	}

	static fireTestFailedAlarm() {
		logger.d('SocketAlarm -> fireTestFailedAlarm');
		SocketServeur.shared.io.emit('isFailedAlarm');
	}
}
