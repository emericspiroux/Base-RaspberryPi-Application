import { NextFunction, Request, Response, Router } from 'express';
import SocketAlarm from '../libs/SocketActions/SocketAlarm';
import SocketSystem from '../libs/SocketActions/SocketSystem';

import AlarmModel from '../Models/Alarms';
import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import { AlarmValidation } from './validations/AlarmValidations';
import { idParamsValidation } from './validations/ControllerValidations';
import FormErrorMiddleware from './validations/FormErrorMiddleware';

export default class AlarmController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/alarms',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/', this.getAlarms);
		this.router.post('/', AlarmValidation, FormErrorMiddleware, this.setAlarm);
		this.router.post('/test/failed', this.testFailedAlarm);
		this.router.patch('/:id', idParamsValidation, AlarmValidation, FormErrorMiddleware, this.updateAlarm);
		this.router.delete('/:id', idParamsValidation, FormErrorMiddleware, this.removeAlarms);
		return this.router;
	}

	private async getAlarms(req: Request, res: Response): Promise<void> {
		res.send(await AlarmModel.getAll());
	}

	private async removeAlarms(req: Request, res: Response): Promise<void> {
		await AlarmModel.deleting(req.agenda, req.params.id);
		res.send({ success: true });
	}

	private async setAlarm(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(
				await AlarmModel.adding(req.agenda, req.body.enabled, req.body.hour, req.body.min, req.body.days, req.body.play)
			);
		} catch (err) {
			next(err);
		}
	}

	private async testFailedAlarm(_: Request, res: Response): Promise<void> {
		SocketAlarm.fireTestFailedAlarm();
		res.send({ success: true });
	}

	private async updateAlarm(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(
				await AlarmModel.updating(
					req.agenda,
					req.params.id,
					req.body.enabled,
					req.body.hour,
					req.body.min,
					req.body.days,
					req.body.play
				)
			);
		} catch (err) {
			next(err);
		}
	}
}
