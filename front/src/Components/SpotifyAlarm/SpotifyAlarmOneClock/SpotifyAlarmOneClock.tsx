import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import Alarm from '../../../Models/Alarm'
import { setCurrent } from '../../../Modules/Alarm'
import SpotifyAlarmOneClockHourForm from './Forms/SpotifyAlarmOneClockHourForm'
import SpotifyAlarmOneClockWeekDaysForm from '../../Common/Forms/WeekDaysForm/WeekDaysForm'

import './SpotifyAlarmOneClock.scss'

export default function SpotifyAlarmOneClock() {
  const current = useSelector<unknown, Alarm>(state => _.get(state, "alarms.current"))
  const dispatch = useDispatch()

  function setHour(hours:number, minutes:number) {
    let currentCopy = {...current}
    currentCopy.hour = hours
    currentCopy.min = minutes
    dispatch(setCurrent(currentCopy))
  }

  function setWeekDays(days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>) {
    let currentCopy = {...current}
    currentCopy.days = days
    dispatch(setCurrent(currentCopy))
  }

  return (
    <div 
      className="SpotifyAlarmOneClock" 
    >
      <SpotifyAlarmOneClockHourForm onChange={setHour} defaultValue={{hours: current && current.hour, minutes: current && current.min}}/>
      <SpotifyAlarmOneClockWeekDaysForm className="m-top" onChange={setWeekDays} defaultValue={current && current.days}/>
    </div>
  )
}