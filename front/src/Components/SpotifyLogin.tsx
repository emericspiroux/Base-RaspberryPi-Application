import React, {Fragment, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserServices from '../Services/UserServices';
import _ from 'lodash'

import './SpotifyLogin.scss'

import IconNoWifi from '../Images/Icons/icon_noWifi.png'

import SocketServices from '../Services/SocketServices';
import Loader from './Common/Loader';
import { useHistory } from 'react-router-dom';
import useInternetConnection from './Common/Hooks/useInternetConnection';
import { checkSystemUpdate, performUpdate } from '../Modules/System';

const {isMobile} = require('react-device-detect')

function SpotifyLogin() {
  const error = useSelector((state) => _.get(state, "user.login.error.message"))
  const token = useSelector((state) => _.get(state, "user.token"))
  const history = useHistory()
  const loginUri = useSelector((state) => _.get(state, "user.login.uri"))
  const isLoading = useSelector((state) => _.get(state, "user.login.isLoading"))
  const hasWifi = useInternetConnection()
  const hasUpdate = useSelector((state:any) => _.get(state, "system.update.hasUpdate"))
  const dispatch = useDispatch()

  async function onLogin() {
    UserServices.shared.login()
  }

  useEffect(() => {
    dispatch(checkSystemUpdate())
  }, [])

  function onUpdate() {
    dispatch(performUpdate())
    history.push('/update')
  }

  useEffect(() => {
    if (loginUri) {
      SocketServices.shared.openKeyboard()
      window.location.href = loginUri
    }
  }, [loginUri])

  useEffect(() => {
    if (token && !isMobile) {
      history.push('/alarm')
    }
  }, [token])

  useEffect(() => {
      if (!isMobile)
        SocketServices.shared.addListennerLogin()
    return () => {
      if (!isMobile)
        SocketServices.shared.removeListennerLogin()
    }
  }, [isMobile])

  return (
    <div className="SpotifyLogin">
      {(isLoading || (isMobile && !hasWifi)) ? (
        <div>
          <Loader isBlock />
        </div>
      ) : (isMobile) ? (
        <button onClick={onLogin}>Connecter mon réveil</button>
      ) : (!hasWifi) ? (
        <Fragment>
          <img src={IconNoWifi} alt="no wifi" className="SpotifyLogin__img"/>
          <p className="SpotifyLogin__text">
            Ton réveil à besoin du wifi pour te réveiller en douceur avec Spotify !
          </p>
          <button onClick={() => history.push('/wifi')}>
            Connecter le wifi du réveil
          </button>
        </Fragment>
      ) : (
        <Fragment>
          <p className="SpotifyLogin__text">
            Pour connecter ton réveil, rend-toi sur l'url :
          </p>
          <div className="SpotifyLogin__loginUrl">
            {process.env.REACT_APP_BASEURL}
          </div>
          {(hasUpdate) && (
            <button className="l-top" onClick={onUpdate}>
              Mettre à jour
            </button>
          )}
        </Fragment>
      )}
      {error && (
        <p className="SpotifyLogin__error">{error}</p>
      )}
    </div>
  )
}

export default SpotifyLogin;
