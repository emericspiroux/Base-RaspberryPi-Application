import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'redux-axios-middleware';
import HttpService from '../Services/HttpService';

const CHECK_SYSTEM_UPDATE = 'CHECK_SYSTEM_UPDATE';
const PERFORM_SYSTEM_UPDATE = 'PERFORM_SYSTEM_UPDATE';
const GET_SYSTEM_LOGS = 'GET_SYSTEM_LOGS';
const GET_SYSTEM_LIGHT = 'GET_SYSTEM_LIGHT';
const SET_SYSTEM_LIGHT = 'SET_SYSTEM_LIGHT';

export default (state = {}, action) => {
	const newState = { ...state };
	switch (action.type) {
		case GET_SYSTEM_LIGHT:
			newState.light = newState.light || {};
			newState.light.isLoading = true;
			return newState;
		case GET_SYSTEM_LIGHT + SUCCESS_SUFFIX:
			newState.light = newState.light || {};
			newState.light.level = action.payload.level;
			newState.light.isLoading = false;
			return newState;
		case GET_SYSTEM_LOGS:
			newState.logs = newState.logs || {};
			newState.logs.isLoading = true;
			break;
		case GET_SYSTEM_LOGS + ERROR_SUFFIX:
			newState.logs = newState.logs || {};
			newState.logs.isLoading = false;
			break;
		case GET_SYSTEM_LOGS + SUCCESS_SUFFIX:
			newState.logs = newState.logs || {};
			newState.logs.list = action.payload;
			newState.logs.isLoading = false;
			break;
		case CHECK_SYSTEM_UPDATE + SUCCESS_SUFFIX:
			newState.update = newState.update || {};
			newState.update.hasUpdate = action.payload.hasUpdate;
			break;
		case PERFORM_SYSTEM_UPDATE:
			newState.update = newState.update || {};
			newState.update.isLoading = true;
			break;
		case PERFORM_SYSTEM_UPDATE + ERROR_SUFFIX:
			newState.update = newState.update || {};
			newState.update.isLoading = false;
			break;
		default:
			return newState;
	}
	return newState;
};

export const checkSystemUpdate = () => {
	return {
		type: CHECK_SYSTEM_UPDATE,
		payload: {
			request: {
				url: `/system/update`,
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
						payload: error,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const performUpdate = () => {
	return {
		type: PERFORM_SYSTEM_UPDATE,
		payload: {
			request: {
				url: `/system/update`,
				method: HttpService.HttpMethods.POST,
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
						payload: error,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const getLogs = () => {
	return {
		type: GET_SYSTEM_LOGS,
		payload: {
			request: {
				url: `/system/logs`,
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
						payload: error,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const getLight = () => {
	return {
		type: GET_SYSTEM_LIGHT,
		payload: {
			request: {
				url: `/system/light`,
				method: HttpService.HttpMethods.GET,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: GET_SYSTEM_LIGHT + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, _, error }) => {
					dispatch({
						type: GET_SYSTEM_LIGHT + SUCCESS_SUFFIX,
						payload: error.data,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const setLight = (level) => {
	return {
		type: SET_SYSTEM_LIGHT,
		payload: {
			request: {
				url: `/system/light`,
				method: HttpService.HttpMethods.POST,
				data: {
					level,
				},
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: GET_SYSTEM_LIGHT + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, _, error }) => {
					dispatch({
						type: GET_SYSTEM_LIGHT + SUCCESS_SUFFIX,
						payload: error.data,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};
