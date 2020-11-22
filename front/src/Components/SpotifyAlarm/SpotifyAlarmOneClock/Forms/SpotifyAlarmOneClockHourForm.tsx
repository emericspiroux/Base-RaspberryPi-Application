import React, { useEffect } from 'react'
import useCounter from '../../../Common/Hooks/useCounter'
import './SpotifyAlarmOneClockHourForm.scss'


interface SpotifyAlarmOneClockHourFormProps {
  className?:string
  onChange:((hours:number, minutes:number)=>void),
  defaultValue?:{hours:number | undefined, minutes:number | undefined}
}

export default function SpotifyAlarmOneClockHourForm(props:SpotifyAlarmOneClockHourFormProps) {
  const [hoursString, hours, addHour, minusHour] = useCounter({
    min: 0, 
    max: 23, 
    default: (() => props.defaultValue && props.defaultValue.hours !== undefined ? props.defaultValue.hours : (new Date()).getHours())()
  })
  const [minutesString, minutes, addMinutes, minusMinutes] = useCounter({
    min: 0, 
    max: 59, 
    default:(() => props.defaultValue && props.defaultValue.minutes !== undefined ? props.defaultValue.minutes : (new Date()).getMinutes())(), 
    prefixZero: true
  })

  useEffect(() => {
    props.onChange(hours, minutes)
  }, [hours, minutes])

  return (
    <div 
      className={`SpotifyAlarmOneClockHourForm ${props.className}`}
    >
      <div className="SpotifyAlarmOneClockHourForm__clock">
        <div 
          onClick={() => addHour()} 
          className="SpotifyAlarmOneClockHourForm__clock__button SpotifyAlarmOneClockHourForm__clock__button--top"
        />
          <div
            className="SpotifyAlarmOneClockHourForm__clock__text"
          >
            {hoursString || "00"}
          </div>
        <div 
          onClick={() => minusHour()} 
          className="SpotifyAlarmOneClockHourForm__clock__button SpotifyAlarmOneClockHourForm__clock__button--bottom"
        />
      </div> 
      <div className="SpotifyAlarmOneClockHourForm__clock">
        <div 
          onClick={() => addMinutes()} 
          className="SpotifyAlarmOneClockHourForm__clock__button SpotifyAlarmOneClockHourForm__clock__button--top"
        />
        <div
          className="SpotifyAlarmOneClockHourForm__clock__text"
        >
          {minutesString || "00"}
        </div>
        <div 
          onClick={() => minusMinutes()} 
          className="SpotifyAlarmOneClockHourForm__clock__button SpotifyAlarmOneClockHourForm__clock__button--bottom"
        />
      </div>
    </div>
  )
}