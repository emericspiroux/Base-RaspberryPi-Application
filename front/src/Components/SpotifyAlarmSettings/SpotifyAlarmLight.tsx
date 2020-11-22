import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import './SpotifyAlarmLight.scss'
import { getLight, setLight } from '../../Modules/System'

import iconMore from '../../Images/Icons/icon_more.png'
import iconMinus from '../../Images/Icons/icon_minus.png'
import SpotifyAlarmSliderForm from '../Common/Forms/SpotifyAlarmSliderForm'
import Loader from '../Common/Loader'

export default function SpotifyAlarmLight() {
  const dispatch = useDispatch()
  const lightLevel = useSelector((state) => _.get(state, "system.light.level"))
  const isLoading = useSelector((state) => _.get(state, "system.light.isLoading"))

  useEffect(() => {
    dispatch(getLight())
  }, [])

  function onChangeLight(level:number) {
    dispatch(setLight(level)) 
  }

  return (
    <div className="SpotifyAlarmLight">
      <h2>Luminosité</h2>
      <div className="SpotifyAlarmLight__content">
        {(isLoading) ? (
          <Loader isBlock/>
        ) : (
          <SpotifyAlarmSliderForm 
            backgroundImage={{
              minus: iconMinus,
              more: iconMore
            }}
            onChange={onChangeLight}
            options={{
              min:1,
              max:255,
              step: 10
            }}
            defaultValue={lightLevel}
          />
        )}
      </div>
    </div>
  )
}