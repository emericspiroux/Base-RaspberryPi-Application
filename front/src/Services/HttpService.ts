import axios from 'axios';
import UserServices from './UserServices';
import UserService from './UserServices';

const HttpMethods = {
	GET: 'GET',
	POST: 'POST',
	DELETE: 'DELETE',
	PUT: 'PUT',
	PATCH: 'PATCH',
};

const axiosSpotify = axios.create({
	baseURL: process.env.REACT_APP_SPOTIFY_BASEURL,
});

const axiosAlarm = axios.create({
	baseURL: process.env.REACT_APP_BASEURL,
});

const configure = () => {
	axiosSpotify.interceptors.request.use(async (config) => {
		let token = UserService.shared.getAccessToken();
		if (UserService.shared.hasExpiredToken) token = await UserService.shared.updateToken();
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	});
	axiosSpotify.interceptors.response.use(async (response) => {
		if (response.status === 401) await UserServices.shared.logout();
		if (response.status !== 200) console.error(response.data);
		return response;
	});
	axiosAlarm.interceptors.response.use(async (response) => {
		if (response.status !== 200) console.error(response.data);
		return response;
	});
};

const getAxiosClients = () => ({
	Spotify: {
		client: axiosSpotify,
	},
	default: {
		client: axiosAlarm,
	},
});

export default {
	HttpMethods,
	configure,
	getAxiosClients,
};
