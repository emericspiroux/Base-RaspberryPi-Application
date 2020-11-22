import React from 'react'
import _ from 'lodash'
import './SpotifyAlarmOneMusicPlaylistElement.scss'
import SpotifyPlaylist from '../../../../../Models/Spotify/Playlist'


interface SpotifyAlarmOneMusicPlaylistElementProps {
  className?: string,
  playlist: SpotifyPlaylist,
  diplayName: boolean,
  style?: React.CSSProperties
}

export default function SpotifyAlarmOneMusicPlaylistElement(props:SpotifyAlarmOneMusicPlaylistElementProps) {
  return (
    <div 
      className={`SpotifyAlarmOneMusicPlaylistElement ${props.className}`}
      style={props.style}
    >
        <div className="SpotifyAlarmOneMusicPlaylistElement__image">
          <img src={_.get(props.playlist, "images[0].url")} alt=""/>
        </div>
          <div className={`SpotifyAlarmOneMusicPlaylistElement__name ${props.diplayName && "SpotifyAlarmOneMusicPlaylistElement__name--display"}`}>
            {props.diplayName && props.playlist.name}
          </div>
    </div>
  )
}