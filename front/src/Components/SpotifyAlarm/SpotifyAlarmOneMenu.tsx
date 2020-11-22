import React from 'react'
import _ from 'lodash'
import { useHistory, useLocation } from 'react-router-dom'

import './SpotifyAlarmOneMenu.scss'
import Loader from '../Common/Loader'

interface SpotifyAlarmOneMenuProps {
  onSave:(()=>void),
  onResetError: (()=>void),
  canSave:boolean,
  isLoading:boolean,
  hasError:boolean,
}

export default function SpotifyAlarmOneMenu(props:SpotifyAlarmOneMenuProps) {
  const history = useHistory()
  const location = useLocation()

  return (
    <div className="SpotifyAlarmOneMenu">
      {props.hasError ? (
        <div 
          className={`SpotifyAlarmOneMenu__button SpotifyAlarmOneMenu__button--error`} 
          onClick={() => props.onResetError()}
        />
      ) : props.isLoading ? (
        <Loader size="30px" borderWidth="5px" className="SpotifyAlarmOneMenu__loader"/>
      ) : (
        <div 
          className={`SpotifyAlarmOneMenu__button SpotifyAlarmOneMenu__button--save ${!props.canSave && "SpotifyAlarmOneMenu__button--save--disabled"}`} 
          onClick={() => props.canSave && props.onSave()}
        />
      )}

      <div 
        onClick={() =>history.push("/alarm/list/one")} 
        className={`SpotifyAlarmOneMenu__tab SpotifyAlarmOneMenu__tab--music ${location.pathname === "/alarm/list/one" && "SpotifyAlarmOneMenu__tab--selected"}`}
      />
      <div 
        onClick={() =>history.push("/alarm/list/one/clock")} 
        className={`SpotifyAlarmOneMenu__tab SpotifyAlarmOneMenu__tab--clock ${location.pathname === "/alarm/list/one/clock" && "SpotifyAlarmOneMenu__tab--selected"}`}
      />
      <div 
        onClick={() =>history.push("/alarm/list/one/settings")} 
        className={`SpotifyAlarmOneMenu__tab SpotifyAlarmOneMenu__tab--tools ${location.pathname === "/alarm/list/one/settings" && "SpotifyAlarmOneMenu__tab--selected"}`}
      />
    </div>
  )
}