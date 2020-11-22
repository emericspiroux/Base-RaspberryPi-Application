import React from 'react'
import { useHistory } from "react-router-dom"

import './SpotifyAlarmButton.scss'

export default function SpotifyAlarmButton() {
  let history = useHistory()
  return (
    <div className="SpotifyAlarmButton clickable" onClick={() => history.push('/alarm/list')} />
  )
}