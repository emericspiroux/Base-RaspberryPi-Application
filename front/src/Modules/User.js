import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'redux-axios-middleware';
import HttpService from '../Services/HttpService';
import UserServices from '../Services/UserServices';

const ECHANGE_CODE_TOKEN = 'ECHANGE_CODE_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const DELETE_TOKEN = 'DELETE_TOKEN';
const LOGIN_USER = 'LOGIN_USER';
const SET_TOKEN = 'SET_TOKEN';

function getExpirationDate(expiresIn) {
	const expirationDate = new Date();
	expirationDate.setSeconds(expirationDate.getSeconds() + (expiresIn / 4) * 3);
	return expirationDate;
}

export default (state = {}, action) => {
	const newState = { ...state };
	switch (action.type) {
		case SET_TOKEN:
		case ECHANGE_CODE_TOKEN + SUCCESS_SUFFIX:
			newState.token = action.payload;
			newState.token.expirationDate = getExpirationDate(newState.token.expires_in);
			newState.loginUrl = undefined;
			break;
		case LOGIN_USER:
			newState.login.error = undefined;
			newState.login.isLoading = true;
			break;
		case LOGIN_USER + ERROR_SUFFIX:
			newState.login.error = action.payload ? { message: 'Le serveur ne repond pas' } : null;
			newState.login.isLoading = false;
			break;
		case LOGIN_USER + SUCCESS_SUFFIX:
			newState.login.uri = action.payload;
			newState.login.isLoading = false;
			break;
		case REFRESH_TOKEN + SUCCESS_SUFFIX:
			newState.token = {
				...action.payload,
				refresh_token: newState.token && newState.token.refresh_token,
			};
			newState.token.expirationDate = getExpirationDate(newState.token.expires_in);
			break;
		case DELETE_TOKEN:
			newState.token = undefined;
			break;
		default:
			return newState;
	}
	return newState;
};

export const exchangeCode = (code) => {
	return {
		type: ECHANGE_CODE_TOKEN,
		payload: {
			request: {
				url: `/spotify/login/exchange?code=${code}`,
				method: HttpService.HttpMethods.GET,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, _, error }) => {
					dispatch({
						type: LOGIN_USER + ERROR_SUFFIX,
						payload: error,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const setToken = (token) => {
	return {
		type: SET_TOKEN,
		payload: token,
	};
};

export const refreshToken = (refreshToken) => async (dispatch) => {
	console.log('refreshToken -> refreshToken', refreshToken);
	return await dispatch({
		type: REFRESH_TOKEN,
		payload: {
			request: {
				url: `/spotify/login/refresh?refreshToken=${refreshToken}`,
				method: HttpService.HttpMethods.GET,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: () => {
					UserServices.shared.logout();
				},
			},
		},
	});
};

export const login = () => {
	return {
		type: LOGIN_USER,
		payload: {
			request: {
				url: `/spotify/login`,
				method: HttpService.HttpMethods.GET,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, _, error }) => {
					dispatch({
						type: action.type + ERROR_SUFFIX,
						payload: error.data,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const deleteToken = () => async (dispatch) => {
	return await dispatch({
		type: DELETE_TOKEN,
	});
};
