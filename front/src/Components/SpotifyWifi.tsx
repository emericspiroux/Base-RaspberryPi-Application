import React, {Fragment, useState, useEffect} from 'react';

import './SpotifyWifi.scss'

import useInternetConnection from './Common/Hooks/useInternetConnection';
import Loader from './Common/Loader';
import { useHistory } from 'react-router-dom';

function SpotifyWifi() {
  const hasWifi = useInternetConnection(false)
  const history = useHistory()
  const [isLoading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
  }

  useEffect(() => {
    if (!hasWifi)
      history.push('/login')
  }, [hasWifi, history])
  console.log("SpotifyWifi -> hasWifi", hasWifi)

  return (
    <div className="SpotifyWifi">
      {isLoading ? (
        <Fragment>
          <Loader />
          <p className="SpotifyLogin__text">Connection en cours...</p>
        </Fragment>
      ) : (
        <form onSubmit={onSubmit} className="SpotifyWifi__form">
          <h3 style={{marginTop: "0"}} className="SpotifyLogin__text">
            Wifi
          </h3>
          <input className="SpotifyWifi__input input--center" name="SSID" placeholder="SSID..." />
          <input className="SpotifyWifi__input input--center m-top" name="password" placeholder="Mot de passe..."/>
          <button className="l-top">Connecter</button>
        </form>
      )}
    </div>
  )
}

export default SpotifyWifi;
