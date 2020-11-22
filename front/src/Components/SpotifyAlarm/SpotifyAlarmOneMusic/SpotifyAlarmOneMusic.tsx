import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Alarm from '../../../Models/Alarm'
import { setCurrent } from '../../../Modules/Alarm'

import './SpotifyAlarmOneMusic.scss'
import SpotifyAlarmOneMusicPlaylistForm from './Form/SpotifyAlarmOneMusicPlaylistForm'
import SpotifyAlarmCheckboxForm from '../../Common/Forms/SpotifyAlarmCheckboxForm'

export default function SpotifyAlarmOneMusic() {
  const current = useSelector<unknown, Alarm>(state => _.get(state, "alarms.current"))
  const dispatch = useDispatch()

  function onChangePlaylist(playlistId:string) {
    let currentCpy = {...current}
    currentCpy.play = currentCpy.play || {}
    currentCpy.play.playlistId = playlistId
    dispatch(setCurrent(currentCpy))
  }

  function onChangeOptions(enabled:boolean) {
    let currentCpy = {...current}
    currentCpy.play = currentCpy.play || {}
    currentCpy.play.shuffle = enabled
    dispatch(setCurrent(currentCpy))
  }

  return (
    <div 
      className="SpotifyAlarmOneSettings" 
    >
      <SpotifyAlarmOneMusicPlaylistForm onChange={onChangePlaylist} defaultValue={current && current.play && current.play.playlistId} />
      <SpotifyAlarmCheckboxForm onChange={onChangeOptions} defaultValue={current && current.play && current.play.shuffle} label="Shuffle"/>
    </div>
  )
}