import React, {Fragment, useEffect} from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash'

import './SpotifyUpdateLoader.scss'
import Loader from './Common/Loader';
import { useHistory } from 'react-router-dom';

import iconWarning from '../Images/Icons/icon_warning.png'

function SpotifyUpdateLoader() {
  const isLoading = useSelector((state:any) => _.get(state, "system.update.isLoading"))
  const history = useHistory()

  async function onBack() {
    history.go(-1)
  }

  return (
    <div className="SpotifyUpdateLoader">
      {(isLoading) ? (
        <div>
          <Loader isBlock />
          <p className="SpotifyUpdateLoader__text">
            Mise à jour en cours, ne pas éteindre le réveil...
          </p>
        </div>
      ) : (
        <Fragment>
          <img src={iconWarning} alt="no wifi" className="SpotifyUpdateLoader__img"/>
          <p className="SpotifyUpdateLoader__text">
            Un erreur s'est produite pendant la mise à jour.
          </p>
          <button className="l-top" onClick={onBack}>
            Retour
          </button>
        </Fragment>
      )}
    </div>
  )
}

export default SpotifyUpdateLoader;
