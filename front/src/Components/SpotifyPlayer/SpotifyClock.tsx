import React from 'react'
import useClock from '../Common/Hooks/useClock'

import './SpotifyClock.scss'

interface SpotifyClockProps {
  isPlayState:boolean,
  className:string,
  coverImg?:string
}

export default function SpotifyClock(props:SpotifyClockProps) {
  let clock = useClock()
  let date = useClock({format: "dddd Do MMMM"})
  return (
    <div className={`SpotifyClock ${props.className}`}>
      <div className={`SpotifyClock__coverWrapper ${props.coverImg && "SpotifyClock__coverWrapper--open"}`}>
        <img src={props.coverImg} alt=""/>
      </div>
      <div className={`SpotifyClock__textWrapper ${props.isPlayState && "SpotifyClock__textWrapper--play"}`}>
        <div className="SpotifyClock__textWrapper__time">
          {clock}
        </div>
        <div className="SpotifyClock__textWrapper__date">
          {date}
        </div>
      </div>
    </div>
  )
}