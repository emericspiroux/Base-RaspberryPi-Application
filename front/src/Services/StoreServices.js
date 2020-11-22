import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { multiClientMiddleware } from 'redux-axios-middleware';
import logger from 'redux-logger';
import rootReducer, { defaultStates } from '../Modules';
import HttpService from './HttpService';
import { persistStore } from 'redux-persist';

const browserHistory = createBrowserHistory();
const setup = () => {
	const enhancers = [];

	HttpService.configure();

	const middleware = [
		thunk,
		routerMiddleware(browserHistory),
		multiClientMiddleware(HttpService.getAxiosClients()),
	];

	if (process.env.REACT_APP_REDUX_LOG === 'true') {
		enhancers.push(applyMiddleware(logger));
	}

	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const composedEnhancers = composeEnhancers(applyMiddleware(...middleware), ...enhancers);
	let store = createStore(rootReducer, defaultStates, composedEnhancers);
	let persistor = persistStore(store);

	return {
		store,
		persistor,
	};
};

export default {
	browserHistory,
	setup,
};
