
import React from 'react'
import { useHistory } from 'react-router-dom'
import NumberToDay from '../../Lib/NumberToDay'
import Alarm from '../../Models/Alarm'

import './SpotifyAlarmElement.scss'

import alarmEnabled from '../../Images/Icons/icon_activatedAlarm.png'
import alarmDisabled from '../../Images/Icons/icon_noAlarm.png'
import { useDispatch } from 'react-redux'
import { setCurrent } from '../../Modules/Alarm'
import WeekDaysForm from '../Common/Forms/WeekDaysForm/WeekDaysForm'

interface SpotifyAlarmElementProps {
  className?: string,
  elementsPerPage:number,
  alarm:Alarm,
  onClick: ((alarm:Alarm) => void)
}

export default function SpotifyAlarmElement(props:SpotifyAlarmElementProps) {
  return (
    <div 
      className={`SpotifyAlarmElement ${props.className}`}
      style={{height: `${100/props.elementsPerPage}%`}}
      onClick={_=> props.onClick(props.alarm)}
    >
      <div className="SpotifyAlarmElement__text">
        <div className="SpotifyAlarmElement__text__day">
          <WeekDaysForm isSmall defaultValue={props.alarm.days}/>
        </div>
      </div>
      <div className="SpotifyAlarmElement__hour">
        {props.alarm.hour}:{('0' + props.alarm.min).slice(-2)}
      </div>
      <div className="SpotifyAlarmElement__enabler">
        {props.alarm.enabled ? (
          <img src={alarmEnabled} alt=""/>
        ) : (
          <img src={alarmDisabled} alt=""/>
        )}
      </div>
    </div>
  )
}