import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

import './SpotifyAlarmList.scss'

import { getAll, setCurrent, setCurrentDefault } from '../../Modules/Alarm'
import Loader from '../Common/Loader'

import arrowBottom from '../../Images/Icons/icon_arrowBottom.png'
import SpotifyAlarmElement from './SpotifyAlarmElement'
import { useHistory } from 'react-router-dom'
import Alarm from '../../Models/Alarm'
import { setPlayerState } from '../../Modules/Spotify'

const elementsPerPage = 3

export default function SpotifyPlayerList() {
  const dispatch = useDispatch()
  const alarms = useSelector((state) => _.get(state, "alarms.list"))
  const isLoading = useSelector((state) => _.get(state, "alarms.isLoading"))
  const playerState = useSelector((state) => _.get(state, "Spotify.playerState"))
  const player = useSelector((state) => _.get(state, "Spotify.player"))
  const hasUpdate = useSelector((state:any) => _.get(state, "system.update.hasUpdate"))
  const history = useHistory()
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(elementsPerPage)

  useEffect(() => {
    dispatch(getAll())
  }, [dispatch])

  function goTop() {
    if (isTop()) return
    setStart(start - 1)
    setEnd(end - 1)
  }

  function goDown() {
    if (isBottom() || noPagination()) return
    setStart(start + 1)
    setEnd(end + 1)
  }

  function isTop() {
    return start === 0
  }

  function noPagination() {
    return Array.isArray(alarms) && alarms.length < end
  }

  function isBottom() {
    return (
        end - 1 === (
                  (Array.isArray(alarms) && alarms.length)
                  || elementsPerPage
                )
    )
  }

  async function stopPlayer() {
    await player.pause()
    setTimeout(() => {
      dispatch(setPlayerState())
    }, 500)
  }

  function onSelect(current:Alarm) {
    dispatch(setCurrent(current))
    history.push(`/alarm/list/one`)
  }

  function newAlarm() {
    dispatch(setCurrentDefault())
    history.push('/alarm/list/one')
  }

  return (
    <div className="SpotifyAlarmList">
    {(isLoading) ? (
      <Loader isBlock size="40px"/>
    ) : (
      <Fragment>
        <div 
          className={`SpotifyAlarmList__goTop ${isTop() && "SpotifyAlarmList__go--disabled"}`}
          onClick={goTop}
        >
          <img src={arrowBottom} alt=""/>
        </div>
        <div className="SpotifyAlarmList__listWrapper">
          {Array.isArray(alarms) && alarms.slice(start, end).map((alarm, index) => 
            <SpotifyAlarmElement onClick={onSelect} key={index} elementsPerPage={elementsPerPage} alarm={alarm} className="clickable"/>
          )}
          <div 
            className="SpotifyAlarmList__listWrapper__add clickable" 
            style={{height: `${100/elementsPerPage}%`}}
            onClick={newAlarm}
          >
            <div className="SpotifyAlarmList__listWrapper__add__button" />
            <div>
              Ajouter une alarme
            </div>
          </div>
        </div>
        <div 
          className={`SpotifyAlarmList__goBottom ${(isBottom() || noPagination()) && "SpotifyAlarmList__go--disabled"}`}
          onClick={goDown}
        >
          <img src={arrowBottom} alt=""/>
        </div>
      </Fragment>
    )}
    {playerState && (
      <div className="SpotifyAlarmList__button SpotifyAlarmList__button--stop" onClick={stopPlayer}/>
    )}
    <div className={`SpotifyAlarmList__button SpotifyAlarmList__button--settings ${hasUpdate && ("SpotifyAlarmList__button--settings--hasUpdate")}`} onClick={() => history.push('/alarm/settings')} />
    </div>
  )
}