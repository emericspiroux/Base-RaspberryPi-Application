import _ from 'lodash';
import { Store } from 'redux';
import {
	setDeviceId,
	setFailedCount,
	setPlayer,
	setPlayerState,
	setSpotifyError,
} from '../Modules/Spotify';
import SocketServices from './SocketServices';
import UserServices from './UserServices';

class SpotifyServices {
	static shared: SpotifyServices = new SpotifyServices();
	private store?: Store;

	setStore(store: Store) {
		this.store = store;
	}

	get state() {
		let state = this.store!.getState();
		return state;
	}

	static extractTracksIds(playlistTracksResponse: any, shuffle: true): string[] {
		let tracks = _.get(playlistTracksResponse, 'items');
		if (!tracks) return [];
		let tracksId = tracks
			.map((trackElement: any) => _.get(trackElement, 'track.uri'))
			.filter((e: any) => e);
		if (shuffle) return SpotifyServices.applyShuffle(tracksId);
		return tracksId;
	}

	static applyShuffle(tracks: string[]): string[] {
		let tracksCpy = [...tracks];
		for (var i = tracksCpy.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = tracksCpy[i];
			tracksCpy[i] = tracksCpy[j];
			tracksCpy[j] = temp;
		}
		return tracksCpy;
	}

	// 	initPlayer() {
	// 		const player = new window.Spotify.Player({
	// 			name: process.env.NODE_ENV !== 'development' ? 'Réveil' : 'Dev Réveil',
	// 			getOAuthToken: async (cb: any) => {
	// 				cb(await UserServices.shared.getValidAccessToken());
	// 			},
	// 		});

	// 		const _1 = this.store?.dispatch(setPlayer(player));
	// 		SocketServices.shared.log.info('Initialize Player');

	// 		// Error handling
	// 		player.addListener('initialization_error', (error: any) => {
	// 			console.error(error, error.message, error.stack);
	// 			SocketServices.shared.log.error(error.message);
	// 			return this.store?.dispatch(
	// 				setSpotifyError(error || { message: 'Impossible de connecter le lecteur' }),
	// 			);
	// 		});
	// 		player.addListener('authentication_error', (error: any) => {
	// 			SocketServices.shared.log.error(error.message);
	// 			return this.store?.dispatch(
	// 				setSpotifyError(error || { message: 'Impossible de connecter le lecteur' }),
	// 			);
	// 		});
	// 		player.addListener('account_error', (error: any) => {
	// 			SocketServices.shared.log.error(error.message);
	// 			return this.store?.dispatch(
	// 				setSpotifyError(error || { message: 'Impossible de connecter le lecteur' }),
	// 			);
	// 		});
	// 		player.addListener('playback_error', (error: any) => {
	// 			const failedCount = _.get(this.state, 'Spotify.failedCount');
	// 			const _6 = this.store?.dispatch(setFailedCount(failedCount ? failedCount + 1 : 1));
	// 			SocketServices.shared.log.error(error.message);
	// 		});

	// 		// Playback status updates
	// 		player.addListener('player_state_changed', (state: any) => {
	// 			const _7 = this.store?.dispatch(setFailedCount(0));
	// 			const _8 = this.store?.dispatch(setPlayerState(state));
	// 		});

	// 		// Ready
	// 		player.addListener('ready', async (readyState: any) => {
	// 			SocketServices.shared.log.info(`Player Ready id number :${readyState.device_id}`);
	// 			setTimeout(() => {
	// 				if (!_.get(this.state, 'Spotify.deviceId')) {
	// 					const _9 = this.store?.dispatch(setSpotifyError(new Error('Impossible de se connecter')));
	// 				}
	// 			}, 15000);
	// 			try {
	// 				console.log('Set device id !');
	// 				const _10 = this.store?.dispatch(setDeviceId(readyState.device_id));
	// 				// TODO : SI il y a un problème à l'initialisation du player state c'est ici que ca se passe !
	// 				let state = await player.getCurrentState();
	// 				const _11 = this.store?.dispatch(setPlayerState(state)); // @ts-nocheck
	// 			} catch (err) {
	// 				console.log(err);
	// 			}
	// 		});

	// 		// Not Ready
	// 		player.addListener('not_ready', (readyState: any) => {
	// 			console.log('Device ID has gone offline', readyState.device_id);
	// 			if (!navigator.onLine) {
	// 				let _12 = this.store?.dispatch(setSpotifyError(new Error('Connexion internet interrompu')));
	// 			}
	// 			const _4 = this.store?.dispatch(setDeviceId());
	// 		});

	// 		// Connect to the player!
	// 		player.connect();
	// 	}
}

export default SpotifyServices;
