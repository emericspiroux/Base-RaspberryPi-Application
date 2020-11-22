import React, {useRef, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom"
import { setIsFailedAlarm } from '../../Modules/Spotify'
import useClock from '../Common/Hooks/useClock'
import useReferredState from '../Common/Hooks/useReferredState'

import './SpotifyFailedAlarm.scss'

export default function SpotifyFailedAlarm() {
  const clock = useClock()
  const player = useRef() as React.MutableRefObject<HTMLVideoElement>
  const history = useHistory()
  const dispatch = useDispatch()

  function onClose() {
    history.push('/alarm')
  }


  useEffect(() => {
    dispatch(setIsFailedAlarm(false))
    setTimeout(() => {
      player.current.play()
    }, 1000)
  }, [])


  return (
    <div className="SpotifyFailedAlarm">
      <video ref={player} className="SpotifyFailedAlarm__player" autoPlay loop>

        <source src={`${process.env.REACT_APP_BASEURL}/assets/default.mp4`}
              type="video/mp4"/>

        Désolé mais la video n'est pas prise en charge...
      </video>
      <div className="SpotifyFailedAlarm__container SpotifyFailedAlarm__container--top">
        <div className="SpotifyFailedAlarm__container__text">
          Un problème s'est produit pendant le lancement de ton réveil
        </div>
      </div>
      <div className="SpotifyFailedAlarm__container  SpotifyFailedAlarm__container--bottom">
        <div className="SpotifyFailedAlarm__container__clockWrapper">
          <div className="SpotifyFailedAlarm__container__clockWrapper__clock">
            {clock}
          </div>
          <button className="SpotifyFailedAlarm__container__clockWrapper__close" onClick={onClose}/>
        </div>
      </div>
    </div>
  )
}