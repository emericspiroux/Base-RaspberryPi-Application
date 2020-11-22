import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

import './SpotifyPlayer.scss'

import { setDeviceId, playTracks, cleanPlayPlaylistTracks, setSpotifyError, setPlayer, setFailedCount, setPlayerState } from '../../Modules/Spotify'
import SocketServices from '../../Services/SocketServices'
import SpotifyClock from './SpotifyClock'
import Loader from '../Common/Loader'
import SpotifyControlers from './SpotifyControlers'

import {AlarmOptions} from '../../Models/Alarm'
import { useHistory } from 'react-router-dom'
import { setIsFailedAlarm } from '../../Modules/Spotify'
import UserServices from '../../Services/UserServices'
import useInternetConnection from '../Common/Hooks/useInternetConnection'

const Script:any = require('react-load-script')

function SpotifyPlayer() {
  const history = useHistory()
  const dispatch = useDispatch()
  const isInternetConnected = useInternetConnection()

  const [canPlayAlarm, setCanPlayAlarm] = useState(false)

  const playPlaylistTracksUri = useSelector<unknown, string>(state => _.get(state, "Spotify.playPlaylistTracksUri"))
  const playWithOptions = useSelector<unknown, AlarmOptions>(state => _.get(state, "Spotify.playWithOptions"))
  const deviceId = useSelector(state => _.get(state, "Spotify.deviceId"))
  const player = useSelector(state => _.get(state, "Spotify.player"))
  const playerState = useSelector(state => _.get(state, "Spotify.playerState"))

  const playerError = useSelector(state => _.get(state, "Spotify.hasError"))
  const isFailedAlarm = useSelector(state => _.get(state, "Spotify.isFailedAlarm"))

  const failedCount = useSelector(state => _.get(state, "Spotify.failedCount", 0))


  useEffect(() => {
    SocketServices.shared.addListennerFailedAlarm()
    SocketServices.shared.addListennerAlarm()
    return () => {
      SocketServices.shared.removeListenerFailedAlarm()
      SocketServices.shared.removeListennerAlarm()
    }
  }, [])

  useEffect(() => {
    if (failedCount > 4) {
      dispatch(setIsFailedAlarm(true))
    }
  }, [failedCount])


  useEffect(() => {
    if (isFailedAlarm) {
      history.push('/failed/alarm')
    }
  }, [isFailedAlarm])

  useEffect(() => {
    if (playPlaylistTracksUri && deviceId && canPlayAlarm) {
      dispatch(playTracks(deviceId, playPlaylistTracksUri))
      dispatch(cleanPlayPlaylistTracks())
      setCanPlayAlarm(false)
    }
  }, [playPlaylistTracksUri, deviceId, canPlayAlarm])

  useEffect(() => {
    if (playWithOptions && player && deviceId) {
        player.setVolume(playWithOptions.volume)
        setCanPlayAlarm(true)
    }
  }, [playWithOptions, player, deviceId])

  useEffect(() => {
    if (playerState && !playerState.paused)
      SocketServices.shared.wakeUpScreenSaver()
  }, [playerState])

  useEffect(() => {
    if (!isInternetConnected.current)
      dispatch(setSpotifyError(new Error("Connexion internet interrompu")));
    else
      dispatch(setSpotifyError());
  }, [isInternetConnected.current])

  function initPlayer() {
    const player = new window.Spotify.Player({
      name: process.env.NODE_ENV === 'development' ? "Dev' Réveil" : 'Réveil',
      getOAuthToken: async (cb: any) => {
        let token = UserServices.shared.getAccessToken();
        SocketServices.shared.log.info(`Player want to get token...`)
        SocketServices.shared.log.info(`Token expiration: ${UserServices.shared.hasExpiredToken}`)
		    if (UserServices.shared.hasExpiredToken) {
          token = await UserServices.shared.updateToken();
          SocketServices.shared.log.info(`has new token after refresh: ${!!token}`)
        }
        cb(token);
      },
    });

    // Error handling
    player.addListener('initialization_error', (error: any) => {
      console.error(error, error.message, error.stack);
      SocketServices.shared.log.error(error.message);
      dispatch(setSpotifyError(error || {message:"Impossible de connecter le lecteur"}));
    });
    player.addListener('authentication_error', (error: any) => {
      SocketServices.shared.log.error(error.message);
      dispatch(setSpotifyError(error || {message:"Impossible de connecter le lecteur"}));
    });
    player.addListener('account_error', (error: any) => {
      SocketServices.shared.log.error(error.message);
      dispatch(setSpotifyError(error || {message:"Impossible de connecter le lecteur"}));
    });
    player.addListener('playback_error', (error: any) => {
      dispatch(setFailedCount(failedCount.current + 1))
      SocketServices.shared.log.error(error.message);
    });

    // Playback status updates
    player.addListener('player_state_changed', (state: any) => {
      dispatch(setFailedCount(0))
      dispatch(setPlayerState(state))
    });

    // Ready
    player.addListener('ready', async (readyState: any) => {
      SocketServices.shared.log.info('Player Ready');
      dispatch(setSpotifyError());
      try {
        dispatch(setDeviceId(readyState.device_id));
        let state = await player.getCurrentState();
        dispatch(setPlayerState(state));
      } catch (err) {
        console.log(err);
      }
    });

    // Not Ready
    player.addListener('not_ready', (readyState: any) => {
      SocketServices.shared.log.error(`Go offline not_ready`)
      console.log('Device ID has gone offline', readyState.device_id);
      if (!isInternetConnected.current)
        dispatch(setSpotifyError(new Error("Connexion internet interrompu")));
      dispatch(setDeviceId());
    });

    dispatch(setPlayer(player));
  }

  function handleLoad() {
    window.onSpotifyWebPlaybackSDKReady = initPlayer
  }

  function reloadPlayer() {
    dispatch(setSpotifyError())
    dispatch(setDeviceId())
    player.disconnect()
    initPlayer()
  }

  function onResume() {
    try {
      player.resume()
    } catch (err) {
      SocketServices.shared.log.error(`On resume : ${err}`)
    }
  }

  function onPause() {
    try {
      player.pause()
    } catch (err) {
      SocketServices.shared.log.error(`On pause : ${err}`)
    }
  }

  function onNext() {
    try {
      player.nextTrack()
    } catch (err) {
      SocketServices.shared.log.error(`On next : ${err}`)
    }
  }

  function onPrevious() {
    try {
      player.previousTrack()
    } catch (err) {
      SocketServices.shared.log.error(`On previous : ${err}`)
    }
  }

  return (
    <div className="SpotifyPlayer">
      <Script
        url="https://sdk.scdn.co/spotify-player.js"
        onCreate={handleLoad}
      />
      <SpotifyClock 
        className="l-bottom" 
        isPlayState={!!playerState || !deviceId || playerError}
        coverImg={_.get(playerState, "track_window.current_track.album.images[0].url")}
      />
      {(playerError) ? (
        <div className="l-top SpotifyPlayer__error">
          {isInternetConnected.current ? (
            <Fragment>
              <button className="base green" onClick={reloadPlayer}>Recharger le lecteur</button>
              <p className="SpotifyLogin__error">{playerError.message}</p>
            </Fragment>
          ) : (
            <Fragment>
              <button className="base green" onClick={_=> history.push('/wifi')} disabled>Reconnecter le wifi</button>
              <p className="SpotifyLogin__error">{playerError.message}</p>
            </Fragment>
          )}
        </div>
      ) : (deviceId && playerState) ? (
        <SpotifyControlers 
          isPaused={playerState.paused}
          isShuffle={_.get(playerState, "shuffle")}
          canNext={!(_.get(playerState, "disallows.skipping_next"))}
          canPrevious={!(_.get(playerState, "disallows.skipping_prev"))}
          onPause={onPause} 
          onPlay={onResume}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      ) : !deviceId && (
        <div className="SpotifyPlayer__notReady">
          Chargement du lecteur
          <Loader 
            style={{marginTop: "6px"}}
            size="15px" 
            borderWidth="2px" 
            isBlock
          /> 
        </div>
      )}
    </div>
  )
}

export default SpotifyPlayer