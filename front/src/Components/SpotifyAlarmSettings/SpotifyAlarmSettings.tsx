import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import SocketServices from '../../Services/SocketServices'
import UserServices from '../../Services/UserServices'
import { Link, useHistory } from 'react-router-dom'
import packageJSON from '../../../package.json'
import SpotifyAlarmDestructiveButton from '../Common/Forms/SpotifyAlarmDestructiveButton'

import './SpotifyAlarmSettings.scss'
import { checkSystemUpdate, performUpdate } from '../../Modules/System'

export default function SpotifyAlarmSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingUpdate = useSelector((state:any) => _.get(state, "system.update.isLoading"))
  const hasUpdate = useSelector((state:any) => _.get(state, "system.update.hasUpdate"))
  const [isLoadingLogout, setIsLoadingLoggout] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkSystemUpdate())
  }, [])

  function onDelete() {
    SocketServices.shared.shutdown()
    setIsLoading(true)
  }

  function onLogout() {
    UserServices.shared.logout()
    setIsLoadingLoggout(true)
    history.push('/login')
  }

  function doUpdate() {
    dispatch(performUpdate())
    history.push('/update')
  }

  return (
    <div className="SpotifyAlarmSettings">
      <h2>Paramètres</h2>
      <div className="SpotifyAlarmSettings__content">
        <SpotifyAlarmDestructiveButton style={{backgroundColor:"#357cfb"}} onDelete={onLogout} isLoading={isLoadingLogout} canDelete={!isLoadingUpdate} label={{
          text:"Se déconnecter",
          loading:"Déconnexion...",
        }}/>
        {(hasUpdate) && (
          <SpotifyAlarmDestructiveButton style={{backgroundColor:"#357cfb"}} onDelete={doUpdate} isLoading={isLoadingUpdate} canDelete label={{
            text:"Mettre à jour",
            loading:"Mise à jour en cours",
          }}/>
        )}
        <SpotifyAlarmDestructiveButton onDelete={onDelete} isLoading={isLoading} canDelete={!isLoadingUpdate} label={{
          text:"Éteindre",
          loading:"Arrêt en cours",
        }}/>
        <div className="SpotifyAlarmSettings__version">
          Version {packageJSON.version} - <Link to="/alarm/settings/logs" className="SpotifyAlarmSettings__version__logs">logs</Link>
        </div>
      </div>
      <div className={`SpotifyAlarmSettings__button SpotifyAlarmSettings__button--light`} onClick={() => history.push('/alarm/settings/light')} />
    </div>
  )
}