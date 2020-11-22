import { Response, Router } from 'express';
import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import SocketServeur from '../Serveur/Sockets/SockerServeur';
import logguer from 'basic-log';
import SocketAlarm from '../libs/SocketActions/SocketAlarm';

export default class SocketController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/socket',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/test', this.testSocket.bind(this));
		this.router.delete('/test', this.eraseTestSocket.bind(this));
		this.router.get('/test/alarm', this.alarmTest.bind(this));
		return this.router;
	}

	private testSocket(_, res: Response) {
		SocketServeur.shared.io.emit('test', { message: 'Testing successfull' });
		res.send({ success: true });
	}

	private eraseTestSocket(_, res: Response) {
		SocketServeur.shared.io.emit('delete-test');
		res.send({ success: true });
	}

	private alarmTest(_, res: Response) {
		SocketAlarm.fireAlarm({
			playlistId: '52q0AQY7noIJTMSSFhKmxk',
			shuffle: true,
			volume: 1,
		});
		res.send({ success: true });
	}
}
