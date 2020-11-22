import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { useHistory } from "react-router-dom"

import './SpotifyAlarmWindow.scss'

interface SpotifyAlarmWindowProps {
  closePath:string;
  children:React.ReactChild;
  isBack?:boolean;
  onGoBack?:(()=>string | undefined);
}

export default function SpotifyAlarmWindow(props:SpotifyAlarmWindowProps) {
  const history = useHistory()
  const [isClosing, setIsClosing] = useState(false)

  function onClose() {
    setIsClosing(true)
    setTimeout(() => {
      history.push(props.closePath)
    }, 400)
  }

  function onBack() {
    if (props.onGoBack) {
      let pathname = props.onGoBack()
      if (pathname) return history.push(pathname)
    }
    history.go(-1)
  }

  return (
    <div className={`SpotifyAlarmWindow ${isClosing && "SpotifyAlarmWindow--closing"}`}>
      {(props.isBack) ? (
        <div className="SpotifyAlarmWindow__button SpotifyAlarmWindow__button--back" onClick={onBack}/>
      ) : (
        <div className="SpotifyAlarmWindow__button SpotifyAlarmWindow__button--close" onClick={onClose}/>
      )}
      
      {props.children}
    </div>
  ) 
}

SpotifyAlarmWindow.propTypes = {
  closePath:PropTypes.string.isRequired,
}