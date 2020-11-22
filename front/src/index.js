import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';
import HttpService from './Services/HttpService';
import StoreServices from './Services/StoreServices';
import UserServices from './Services/UserServices.ts';
import SocketServices from './Services/SocketServices';
import SpotifyServices from './Services/SpotifyServices';

const { store, persistor } = StoreServices.setup();
const history = StoreServices.browserHistory;

UserServices.shared.setStore(store);
SocketServices.shared.setStore(store);
SpotifyServices.shared.setStore(store);

ReactDOM.render(
	<React.StrictMode>
		<App {...{ store, history, persistor }} />
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
