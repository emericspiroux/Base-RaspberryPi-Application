import React from 'react';
import { useHistory } from 'react-router-dom';

import './SpotifyLogin.scss'

function SpotifyLoggedMobile() {
  const history = useHistory()
  return (
    <div className="SpotifyLogin">
      <div className="SpotifyLogin__text">
        Tu es connecté, bon réveille en musique !
      </div>
      <div className="l-top">
        <button onClick={() => history.push('/login')} className="green base">Retour</button>
      </div>
    </div>
  )
}

export default SpotifyLoggedMobile;
