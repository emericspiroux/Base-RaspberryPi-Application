import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Spotify from './Spotify';
import User from './User';
import alarms from './Alarm';
import system from './System';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistConfig = {
	key: 'root',
	storage: storage,
	whitelist: ['user'],
};

const userConfig = {
	key: 'user',
	storage: storage,
	whitelist: ['token'],
};

const rootReducer = combineReducers({
	Spotify,
	alarms,
	system,
	routing: routerReducer,
	user: persistReducer(userConfig, User),
});

export default persistReducer(persistConfig, rootReducer);

export const defaultStates = {
	user: {
		login: {},
	},
};
