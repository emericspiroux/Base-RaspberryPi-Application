import { Store } from 'redux';
import { exchangeCode, refreshToken, deleteToken, login } from '../Modules/User';

class UserServices {
	static shared: UserServices = new UserServices();
	private store?: Store;

	setStore(store: Store) {
		this.store = store;
	}

	get state() {
		let state = this.store!.getState();
		return state && state.user;
	}

	get isLoggued() {
		return !!this.getFullToken();
	}

	getFullToken() {
		return this.state.token;
	}

	getAccessToken() {
		let token = this.getFullToken();
		if (!token) return;
		return token.access_token;
	}

	async getValidAccessToken() {
		if (this.hasExpiredToken) return await this.updateToken();
		return this.getAccessToken();
	}

	get hasExpiredToken() {
		let token = this.getFullToken();
		if (!token) return true;
		return new Date(token.expirationDate) < new Date();
	}

	async updateToken() {
		let token = this.getFullToken();
		if (!token) return;
		await refreshToken(token.refresh_token)(this.store!.dispatch);
		return this.getAccessToken();
	}

	async exchangeCode(code: String) {
		this.store!.dispatch(exchangeCode(code));
	}

	async login() {
		this.store!.dispatch(login());
	}

	async logout() {
		await deleteToken()(this.store!.dispatch);
	}
}

export default UserServices;
