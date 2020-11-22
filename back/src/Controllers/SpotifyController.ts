import Axios, { AxiosResponse } from 'axios';
import { NextFunction, Request, Response, Router } from 'express';
import { MissingParameterControllerError } from './Errors/ControllerError';
import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import querystring from 'querystring';
import logguer from 'basic-log';
import { nextTick } from 'process';
import { AxiosControllerError } from './Errors/AxiosControllerError';

export default class SpotifyController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;
	scopes: string = process.env.SPOTIFY_SCOPES;
	publickey: string = process.env.SPOTIFY_PUBLICKEY;
	privatekey: string = process.env.SPOTIFY_PRIVATEKEY;
	redirectUri: string = `${process.env.FRONT_URI}/login/exchange`;
	loginBaseUrl: string = process.env.SPOTIFY_LOGIN_BASEURL;

	constructor() {
		super();
		this.baseRoute = {
			path: '/spotify',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/login', this.getLoginLink.bind(this));
		this.router.get('/login/exchange', this.exchangeCode.bind(this));
		this.router.get('/login/refresh', this.refreshToken.bind(this));
		return this.router;
	}

	private async getLoginLink(_, res: Response): Promise<void> {
		let redirectURI = `${this.loginBaseUrl}/authorize?response_type=code&client_id=${this.publickey}${
			this.scopes && `&scope=${encodeURIComponent(this.scopes)}`
		}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
		res.send(redirectURI);
	}

	private async exchangeCode(
		req: Request<undefined, { code: string }>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		let code = req.query.code as string;
		if (!code) throw new MissingParameterControllerError();
		try {
			let response = await Axios.post(
				`${this.loginBaseUrl}/api/token`,
				querystring.encode({
					grant_type: 'authorization_code',
					code,
					redirect_uri: this.redirectUri,
				}),
				{
					headers: {
						Authorization: `Basic ${Buffer.from(`${this.publickey}:${this.privatekey}`).toString('base64')}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			res.send(response.data);
		} catch (err) {
			next(new AxiosControllerError(err));
		}
	}

	private async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		let refreshToken = req.query.refreshToken as string;
		if (!refreshToken) throw new MissingParameterControllerError();
		try {
			let response = await Axios.post(
				`${this.loginBaseUrl}/api/token`,
				querystring.encode({
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
				}),
				{
					headers: {
						Authorization: `Basic ${Buffer.from(`${this.publickey}:${this.privatekey}`).toString('base64')}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			res.send(response.data);
		} catch (err) {
			next(new AxiosControllerError(err));
		}
	}
}
