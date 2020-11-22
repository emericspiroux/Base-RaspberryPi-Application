import React from 'react'

import './SpotifyControlers.scss'

interface SpotifyControlersProps {
  onPlay?:(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  onPause?:(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  onNext?:(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  onPrevious?:(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  isPaused:boolean,
  canNext:boolean,
  canPrevious:boolean,
  isShuffle:boolean
}

export default function SpotifyControlers(props:SpotifyControlersProps = {
  onPlay:(() => {}),
  onPause:(() => {}),
  onNext:(() => {}),
  onPrevious:(() => {}),
  isPaused:false,
  canNext:false,
  canPrevious:false,
  isShuffle:false,
}) {
  return (
    <div className="SpotifyControlers">
      <div className="SpotifyControlers__buttonWrapper">
        <div 
          className={`SpotifyControlers__button SpotifyControlers__button--small SpotifyControlers__button--previous ${!props.canPrevious && "SpotifyControlers__button--disabled"}`}
          onClick={props.canPrevious ? props.onPrevious : undefined}
        />
        <div 
          className={`SpotifyControlers__button ${!props.isPaused ? "SpotifyControlers__button--pause" : "SpotifyControlers__button--play"}`}
          onClick={props.isPaused ? props.onPlay : props.onPause}
        />
        <div 
          className={`SpotifyControlers__button SpotifyControlers__button--small SpotifyControlers__button--next ${!props.canNext && "SpotifyControlers__button--disabled"}`}
          onClick={props.canNext ? props.onNext : undefined}
        />
      </div>
    </div>
  )
}