import ControllerError from './ControllerError';

export class AxiosControllerError extends ControllerError {
	constructor(ErrorResponse: Error) {
		super(400, ErrorResponse.message, ErrorResponse.stack);
	}
}
