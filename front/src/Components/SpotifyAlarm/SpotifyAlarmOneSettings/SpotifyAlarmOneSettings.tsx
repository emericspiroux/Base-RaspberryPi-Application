import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Alarm from '../../../Models/Alarm'
import { deleteAlarm, setCurrent } from '../../../Modules/Alarm'

import './SpotifyAlarmOneSettings.scss'
import SpotifyAlarmOneSettingsVolumeForm from '../../Common/Forms/SpotifyAlarmSliderForm'
import SpotifyAlarmDestructiveButton from '../../Common/Forms/SpotifyAlarmDestructiveButton'
import SpotifyAlarmCheckboxForm from '../../Common/Forms/SpotifyAlarmCheckboxForm'

import iconSoundMore from '../../../Images/Icons/icon_volumeMore.png'
import iconSoundLess from '../../../Images/Icons/icon_volumeLess.png'

export default function SpotifyAlarmOneSettings() {
  const current = useSelector<unknown, Alarm>(state => _.get(state, "alarms.current"))
  const deleting = useSelector(state => _.get(state, "alarms.deleting"))
  const dispatch = useDispatch()

  function onChangeVolume(volume:number) {
    let currentCpy = {...current}
    currentCpy.play = currentCpy.play || {}
    currentCpy.play.volume = volume
    dispatch(setCurrent(currentCpy))
  }

  function onChangeEnable(enable:boolean) {
    let currentCpy = {...current}
    currentCpy.enabled = enable
    dispatch(setCurrent(currentCpy))
  }

  function onDelete() {
    dispatch(deleteAlarm(current._id))
  }

  return (
    <div 
      className="SpotifyAlarmOneSettings" 
    >
      <SpotifyAlarmCheckboxForm onChange={onChangeEnable} defaultValue={current && current.enabled} label="Activer"/>
      <SpotifyAlarmOneSettingsVolumeForm 
        onChange={onChangeVolume} 
        defaultValue={_.get(current, "play.volume")} 
        backgroundImage={{
          minus:iconSoundLess,
          more:iconSoundMore
        }}
        options={{
          min: 0.05,
          max: 1,
          step: 0.1
        }}
        className="l-bottom"
      />
      <SpotifyAlarmDestructiveButton 
        canDelete={!!(current && current._id)} 
        onDelete={onDelete} 
        isLoading={deleting && deleting.isLoading} 
        hasError={!!(deleting && deleting.error)} 
        label={{
          text:"Supprimer",
          loading:"Suppression en cours..."
        }} 
      />
    </div>
  )
}