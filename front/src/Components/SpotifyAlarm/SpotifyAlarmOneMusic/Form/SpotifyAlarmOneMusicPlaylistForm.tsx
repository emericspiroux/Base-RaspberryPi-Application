import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlaylists } from '../../../../Modules/Spotify'
import _ from 'lodash'
import './SpotifyAlarmOneMusicPlaylistForm.scss'
import Loader from '../../../Common/Loader'
import SpotifyPlaylist from '../../../../Models/Spotify/Playlist'
import SpotifyAlarmOneMusicPlaylistsCarousel from './Components/SpotifyAlarmOneMusicPlaylistsCarousel'


interface SpotifyAlarmOneMusicPlaylistFormProps {
  className?: string,
  defaultValue: string,
  onChange: ((playlistId:string)=>void),
}

export default function SpotifyAlarmOneMusicPlaylistForm(props:SpotifyAlarmOneMusicPlaylistFormProps) {
  const dispatch = useDispatch()
  const {
    isLoading,
    list,
    error
  } = useSelector(state => ({
    isLoading:_.get(state, "Spotify.playlists.isLoading"),
    list:_.get(state, "Spotify.playlists.list"),
    error:_.get(state, "Spotify.playlists.error")
  }))

  useEffect(() => {
    dispatch(getPlaylists())
  }, [])

  function onChange(playlist:SpotifyPlaylist) {
    props.onChange(playlist.id)
  }

  return (
    <div 
      className={`SpotifyAlarmOneMusicPlaylistForm ${props.className}`}
    >
      {(isLoading || !(list && Array.isArray(list.items))) ? (
        <Loader size="20px" isBlock/>
      ) : (error) ? (
        <div className="SpotifyAlarmOneMusicPlaylistForm__error">
          Une erreur s'est produite avec spotify
        </div>
      ) : (
        <div className="SpotifyAlarmOneMusicPlaylistForm__container">
          <SpotifyAlarmOneMusicPlaylistsCarousel playlists={list.items} selectedId={props.defaultValue} onChange={onChange}/>
        </div>
      )}
    </div>
  )
}