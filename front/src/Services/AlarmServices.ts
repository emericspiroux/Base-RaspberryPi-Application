import Alarm from '../Models/Alarm';

class AlarmServices {
	static checkValidity(alarm: Alarm): boolean {
		if (
			!alarm ||
			!(Array.isArray(alarm.days) && alarm.days.length > 0) ||
			alarm.hour === undefined ||
			alarm.min === undefined ||
			!alarm.play ||
			!alarm.play.playlistId ||
			!alarm.play.volume
		)
			return false;
		return true;
	}
}

export default AlarmServices;
