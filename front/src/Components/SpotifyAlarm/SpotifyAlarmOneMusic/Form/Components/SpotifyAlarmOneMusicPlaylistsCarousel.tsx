import React, { useEffect } from 'react'
import './SpotifyAlarmOneMusicPlaylistsCarousel.scss'
import SpotifyPlaylist from '../../../../../Models/Spotify/Playlist'
import SpotifyAlarmOneMusicPlaylistElement from './SpotifyAlarmOneMusicPlaylistElement'
import useCounter from '../../../../Common/Hooks/useCounter'


interface SpotifyAlarmOneMusicPlaylistsCarouselProps {
  className?: string,
  playlists: SpotifyPlaylist[],
  selectedId?: string,
  onChange: ((playlist:SpotifyPlaylist) => void)
}

export default function SpotifyAlarmOneMusicPlaylistsCarousel(props:SpotifyAlarmOneMusicPlaylistsCarouselProps) {
  const [_,
		elementDisplayedIndex,
		goRight,
		goLeft
  ] = useCounter({
    max: props.playlists.length - 1,
    default: props.selectedId && props.playlists.length > 0 ? getDefaultPosition() : 0
  })

  function getDefaultPosition() {
    return props.playlists.findIndex((playlist)=>playlist.id === props.selectedId)
  }

  useEffect(() => {
    function onChange() {
      props.onChange(props.playlists[elementDisplayedIndex])
    }
    onChange()
  }, [elementDisplayedIndex])

  return (
    <div 
      className={`SpotifyAlarmOneMusicPlaylistsCarousel ${props.className}`}
    >
          <div className="SpotifyAlarmOneMusicPlaylistsCarousel__button SpotifyAlarmOneMusicPlaylistsCarousel__button--left" onClick={goLeft}/>
          <div className="SpotifyAlarmOneMusicPlaylistsCarousel__playlistDisplayWrapper__container">
            <div className="SpotifyAlarmOneMusicPlaylistsCarousel__playlistDisplayWrapper" style={{
              transform: `translate(calc(50% + ${-103 - (elementDisplayedIndex * 19.5)}px))`
            }}>
                {props.playlists.map((playlist:SpotifyPlaylist, index:number) =>
                  <SpotifyAlarmOneMusicPlaylistElement 
                    key={index}
                    playlist={playlist}
                    className={`
                      SpotifyAlarmOneMusicPlaylistsCarousel__playlistDisplayWrapper__element 
                      ${elementDisplayedIndex < index && "SpotifyAlarmOneMusicPlaylistsCarousel__playlistDisplayWrapper__element--before"}
                      ${elementDisplayedIndex === index && "SpotifyAlarmOneMusicPlaylistsCarousel__playlistDisplayWrapper__element--current"}
                      ${elementDisplayedIndex > index && "SpotifyAlarmOneMusicPlaylistsCarousel__playlistDisplayWrapper__element--after"}
                    `}
                    diplayName={elementDisplayedIndex === index}
                    style={{zIndex: elementDisplayedIndex < index ? props.playlists.length - index : index}}
                  />
                )}
            </div>
          </div>
          <div className="SpotifyAlarmOneMusicPlaylistsCarousel__button SpotifyAlarmOneMusicPlaylistsCarousel__button--right" onClick={goRight}/>
    </div>
  )
}