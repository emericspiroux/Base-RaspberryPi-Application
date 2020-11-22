import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'redux-axios-middleware';
import HttpService from '../Services/HttpService';
import SpotifyServices from '../Services/SpotifyServices.ts';

const GET_PLAYLISTS = 'GET_PLAYLISTS';
const GET_PLAYLISTS_TRACKS = 'GET_PLAYLISTS_TRACKS';
const SPOTIFY_PLAYTRACKS = 'SPOTIFY_PLAYTRACKS';
const SPOTIFY_SHUFFLE = 'SPOTIFY_SHUFFLE';
const SET_SPOTIFY_DEVICEID = 'SET_SPOTIFY_DEVICEID';
const REMOVE_SPOTIFY_DEVICEID = 'REMOVE_SPOTIFY_DEVICEID';
const PLAY_PLAYLIST = 'PLAY_PLAYLIST';
const CLEAN_PLAY_PLAYLIST = 'CLEAN_PLAY_PLAYLIST';
const SET_PLAYER = 'SET_PLAYER';
const SET_PLAYERSTATE = 'SET_PLAYERSTATE';
const SPOTIFY_SET_ERROR = 'SPOTIFY_SET_ERROR';
const SET_IS_FAILED_ALARM = 'SET_IS_FAILED_ALARM';
const SET_FAILED_COUNT = 'SET__FAILED_COUNT';

export default (state = {}, action) => {
	const newState = { ...state };
	switch (action.type) {
		case SET_FAILED_COUNT:
			newState.failedCount = action.payload.failedCount;
			return newState;
		case SET_IS_FAILED_ALARM:
			newState.isFailedAlarm = action.payload.isFailed;
			return newState;
		case GET_PLAYLISTS_TRACKS + SUCCESS_SUFFIX:
			newState.playlistTracks = action.payload;
			return newState;
		case GET_PLAYLISTS:
			newState.playlists = newState.playlists || {};
			newState.playlists.isLoading = true;
			return newState;
		case GET_PLAYLISTS + SUCCESS_SUFFIX:
			newState.playlists = newState.playlists || {};
			newState.playlists.list = action.payload;
			newState.playlists.isLoading = false;
			return newState;
		case GET_PLAYLISTS + ERROR_SUFFIX:
			newState.playlists = newState.playlists || {};
			newState.playlists.error = action.payload;
			newState.playlists.isLoading = false;
			return newState;

		case PLAY_PLAYLIST + SUCCESS_SUFFIX:
			newState.playPlaylistTracksUri = SpotifyServices.extractTracksIds(
				action.payload,
				action.playOptions && action.playOptions.shuffle,
			);
			newState.playWithOptions = action.playOptions;
			return newState;

		case SPOTIFY_SET_ERROR:
			newState.hasError = action.payload.error;
			return newState;

		case CLEAN_PLAY_PLAYLIST:
			newState.playPlaylistTracksUri = undefined;
			newState.playWithOptions = undefined;
			return newState;
		case SET_SPOTIFY_DEVICEID:
			newState.deviceId = action.payload.deviceId;
			return newState;
		case REMOVE_SPOTIFY_DEVICEID:
			newState.deviceId = undefined;
			return newState;
		case SET_PLAYER:
			newState.player = action.payload.player;
			return newState;
		case SET_PLAYERSTATE:
			newState.playerState = action.payload.playerState;
			newState.isStopped = !action.payload.playerState;
			return newState;
		default:
			return state;
	}
};

export const setDeviceId = (deviceId) => {
	return {
		type: SET_SPOTIFY_DEVICEID,
		payload: {
			deviceId,
		},
	};
};

export const setSpotifyError = (error) => {
	return {
		type: SPOTIFY_SET_ERROR,
		payload: {
			error,
		},
	};
};

export const removeDeviceId = (deviceId) => {
	return {
		type: REMOVE_SPOTIFY_DEVICEID,
	};
};

export const getPlaylists = () => {
	return {
		type: GET_PLAYLISTS,
		payload: {
			client: 'Spotify',
			request: {
				url: '/v1/me/playlists',
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
			},
		},
	};
};

export const getPlaylistTracks = (id, play, playOptions, isAlarmFiring) => {
	return {
		type: play ? PLAY_PLAYLIST : GET_PLAYLISTS_TRACKS,
		payload: {
			client: 'Spotify',
			request: {
				url: `/v1/playlists/${id}/tracks`,
				method: HttpService.HttpMethods.GET,
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						playOptions,
						meta: { previousAction: action },
					});
				},
				onError: ({ action, dispatch, error }) => {
					dispatch(
						isAlarmFiring
							? setIsFailedAlarm(true)
							: {
									type: action.type + SUCCESS_SUFFIX,
									payload: {
										...error.data,
										isAlarmFiring,
									},
									playOptions,
									meta: { previousAction: action },
							  },
					);
				},
			},
		},
	};
};

export const playTracks = (deviceId, tracks, contextUri) => {
	return {
		type: SPOTIFY_PLAYTRACKS,
		payload: {
			client: 'Spotify',
			request: {
				url: `/v1/me/player/play?device_id=${deviceId}`,
				method: HttpService.HttpMethods.PUT,
				data: JSON.stringify({ uris: tracks, context_uri: contextUri }),
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
				onError: ({ _1, dispatch, _2 }) => {
					dispatch(setIsFailedAlarm(true));
				},
			},
		},
	};
};

export const setShuffle = (deviceId, isShuffle) => {
	return {
		type: SPOTIFY_SHUFFLE,
		payload: {
			client: 'Spotify',
			request: {
				url: `/v1/me/player/shuffle`,
				method: HttpService.HttpMethods.PUT,
				params: {
					state: isShuffle,
					deviceId,
				},
			},
			options: {
				onSuccess: ({ action, dispatch, response }) => {
					dispatch({
						type: action.type + SUCCESS_SUFFIX,
						payload: response.data,
						meta: { previousAction: action },
					});
				},
			},
		},
	};
};

export const cleanPlayPlaylistTracks = () => ({
	type: CLEAN_PLAY_PLAYLIST,
});

export const setPlayer = (player) => ({
	type: SET_PLAYER,
	payload: {
		player,
	},
});

export const setPlayerState = (playerState) => ({
	type: SET_PLAYERSTATE,
	payload: {
		playerState,
	},
});

export const setIsFailedAlarm = (isFailed) => {
	return {
		type: SET_IS_FAILED_ALARM,
		payload: {
			isFailed,
		},
	};
};

export const setFailedCount = (failedCount) => {
	return {
		type: SET_FAILED_COUNT,
		payload: {
			failedCount,
		},
	};
};
