import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'redux-axios-middleware';
import HttpService from '../Services/HttpService';

const GET_ALL_ALARMS = 'GET_ALL_ALARMS';
const SET_CURRENT_ALARM = 'SET_CURRENT_ALARM';
const ALARMS = 'ALARMS';
const DELETE_ALARM = 'DELETE_ALARM';
const RESET_DELETE_ALARM = 'RESET_DELETE_ALARM';
const SAVE_ALARM = 'SAVE_ALARM';
const RESET_SAVE_ALARM = 'RESET_SAVE_ALARM';

export default (state = {}, action) => {
	const newState = { ...state };
	switch (action.type) {
		case RESET_SAVE_ALARM:
			newState.save = undefined;
			return newState;
		case SAVE_ALARM:
			newState.save = newState.save || {};
			newState.save.isLoading = true;
			return newState;
		case SAVE_ALARM + SUCCESS_SUFFIX:
			newState.save = newState.save || {};
			newState.save.isSuccess = true;
			newState.save.isLoading = false;
			return newState;
		case SAVE_ALARM + ERROR_SUFFIX:
			newState.save = newState.save || {};
			newState.save.error = action.payload;
			newState.save.isLoading = false;
			return newState;
		case DELETE_ALARM:
			newState.deleting = newState.deleting || {};
			newState.deleting.isLoading = true;
			return newState;
		case DELETE_ALARM + SUCCESS_SUFFIX:
			newState.deleting = newState.deleting || {};
			newState.deleting.isDeleted = true;
			newState.deleting.isLoading = false;
			return newState;
		case DELETE_ALARM + ERROR_SUFFIX:
			newState.deleting = newState.deleting || {};
			newState.deleting.error = action.payload;
			newState.deleting.isLoading = false;
			return newState;
		case RESET_DELETE_ALARM:
			newState.deleting = undefined;
			return newState;
		case SET_CURRENT_ALARM:
			newState.current = action.payload.current;
			return newState;
		case GET_ALL_ALARMS:
			newState.isLoading = true;
			return newState;
		case GET_ALL_ALARMS + SUCCESS_SUFFIX:
			newState.list = action.payload;
			newState.isLoading = false;
			return newState;
		case ALARMS + ERROR_SUFFIX:
			newState.isLoading = false;
			return newState;
		default:
			return newState;
	}
};

export const getAll = () => {
	return {
		type: GET_ALL_ALARMS,
		payload: {
			request: {
				url: '/alarms',
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
						type: ALARMS + ERROR_SUFFIX,
						payload: error,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const deleteAlarm = (id) => {
	return {
		type: DELETE_ALARM,
		payload: {
			request: {
				url: `/alarms/${id}`,
				method: HttpService.HttpMethods.DELETE,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, _response, error }) => {
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

export const saveAlarm = (alarm, isUpdating) => {
	return {
		type: SAVE_ALARM,
		payload: {
			request: {
				url: isUpdating ? `/alarms/${alarm._id}` : `/alarms`,
				method: isUpdating ? HttpService.HttpMethods.PATCH : HttpService.HttpMethods.POST,
				data: alarm,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, _response, error }) => {
					console.log('saveAlarm -> error', error);
					console.log('saveAlarm -> _response', _response);
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

export const resetStateSave = () => {
	return {
		type: RESET_SAVE_ALARM,
	};
};

export const resetDeleteAlarm = () => {
	return {
		type: RESET_DELETE_ALARM,
	};
};

export const setCurrent = (current) => {
	return {
		type: SET_CURRENT_ALARM,
		payload: {
			current,
		},
	};
};

export const setCurrentDefault = () => {
	let currentDate = new Date();
	return {
		type: SET_CURRENT_ALARM,
		payload: {
			current: {
				min: currentDate.getMinutes(),
				hour: currentDate.getHours(),
				enabled: true,
				days: [0, 1, 2, 3, 4, 5, 6],
				play: {
					shuffle: true,
					volume: 1,
				},
			},
		},
	};
};
