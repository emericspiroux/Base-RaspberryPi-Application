import Agenda from 'agenda';
import { IAlarm } from '../../Models/Alarms';
import IJobsDefine from '../Types/IJobsDefine';
import AlarmEventNamesEnum from './AlarmEventNames.enum';
import _ from 'lodash';
import logguer from 'basic-log';
import SocketAlarm from '../../libs/SocketActions/SocketAlarm';

export default class AlarmJobs implements IJobsDefine {
	definitions(): { [key: string]: (job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) => void } {
		let arrayOfDefinitions: {
			[key: string]: (job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) => void;
		} = {};
		arrayOfDefinitions[AlarmEventNamesEnum.alarm] = this.alarmDefine;
		return arrayOfDefinitions;
	}

	private alarmDefine(job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) {
		if (!_.get(job, 'attrs.data')) return logguer.d('[JOB] No data found'); //TODO EXECUTE LOCAL MUSIC
		let alarm = job.attrs.data as IAlarm;
		if (!alarm.enabled) return logguer.d('[JOB] Alarm not enabled');
		if (!_.get(alarm, 'play.playlistId')) return logguer.d('[JOB] No playlist found');
		SocketAlarm.fireAlarm(alarm.play);
		done();
	}
}
