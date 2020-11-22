
import React, { useEffect } from 'react'
import useCounter from '../../../Common/Hooks/useCounter'
import './SpotifyAlarmOneSettingsVolumeForm.scss'


interface SpotifyAlarmOneSettingsVolumeFormProps {
  className?:string
  onChange:((volume:number)=>void),
  defaultValue?:number
}

export default function SpotifyAlarmOneSettingsVolumeForm(props:SpotifyAlarmOneSettingsVolumeFormProps) {
  const [_, volume, up, down, isMax, isMin] = useCounter({
    min: 0.05,
    max: 1,
    step: 0.1,
    default: props.defaultValue || 0.5,
    noCircular: true,
  })

  useEffect(() => {
    function onChange(volume:number) {
      props.onChange(volume)
    }
    onChange(volume)
  }, [volume])

  return (
    <div 
      className={`SpotifyAlarmOneSettingsVolumeForm ${props.className}`}
    >
        <div 
          onClick={() => down()} 
          className={`SpotifyAlarmOneSettingsVolumeForm__buttonWrapper ${isMin && "SpotifyAlarmOneSettingsVolumeForm__buttonWrapper--disabled"}`}
        >
          <div 
            className="SpotifyAlarmOneSettingsVolumeForm__buttonWrapper__button SpotifyAlarmOneSettingsVolumeForm__buttonWrapper__button--minus"
          />
        </div>
        <div
          className="SpotifyAlarmOneSettingsVolumeForm__progressBar"
        >
          <div 
            style={{width: `${volume * 100}%`}}
            className="SpotifyAlarmOneSettingsVolumeForm__progressBar__cursor"
          />
        </div>
        <div 
          onClick={() => up()}
          className={`SpotifyAlarmOneSettingsVolumeForm__buttonWrapper ${isMax && "SpotifyAlarmOneSettingsVolumeForm__buttonWrapper--disabled"}`}
        >
          <div 
            className="SpotifyAlarmOneSettingsVolumeForm__buttonWrapper__button SpotifyAlarmOneSettingsVolumeForm__buttonWrapper__button--more"
          />
        </div>
    </div>
  )
}