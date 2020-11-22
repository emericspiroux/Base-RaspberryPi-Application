
import React, { useEffect } from 'react'
import useCounter from '../Hooks/useCounter'
import './SpotifyAlarmSliderForm.scss'


interface SpotifyAlarmSliderFormProps {
  className?:string
  onChange:((volume:number)=>void),
  defaultValue?:number,
  backgroundImage: {
    minus:string,
    more:string,
  },
  options?: {
    min:number,
    max: number,
    step: number
  }
}

const SpotifyAlarmSliderFormDefaultProps: SpotifyAlarmSliderFormProps = {
  onChange: (() => {}),
  backgroundImage: {
    minus:"",
    more:""
  },
  options: {
    min: 0.05,
    max: 1,
    step: 0.1
  }
}

export default function SpotifyAlarmSliderForm(props:SpotifyAlarmSliderFormProps = SpotifyAlarmSliderFormDefaultProps) {
  const [_, value, up, down, isMax, isMin] = useCounter({
    min: props.options?.min,
    max: props.options?.max || 100,
    step: props.options?.step,
    default: props.defaultValue || 0.5,
    noCircular: true,
  })

  useEffect(() => {
    function onChange(value:number) {
      props.onChange(value)
    }
    onChange(value)
  }, [value])

  function percent(value:number) {
    return (value/(props.options?.max || 100)) * 100
  }

  return (
    <div 
      className={`SpotifyAlarmSliderForm ${props.className}`}
    >
        <div 
          onClick={() => down()} 
          className={`SpotifyAlarmSliderForm__buttonWrapper ${isMin && "SpotifyAlarmSliderForm__buttonWrapper--disabled"}`}
        >
          <div 
            className="SpotifyAlarmSliderForm__buttonWrapper__button"
            style={{backgroundImage: `url(${props.backgroundImage.minus})`}}
          />
        </div>
        <div
          className="SpotifyAlarmSliderForm__progressBar"
        >
          <div 
            style={{width: `${percent(value)}%`}}
            className="SpotifyAlarmSliderForm__progressBar__cursor"
          />
        </div>
        <div 
          onClick={() => up()}
          className={`SpotifyAlarmSliderForm__buttonWrapper ${isMax && "SpotifyAlarmSliderForm__buttonWrapper--disabled"}`}
        >
          <div 
            className="SpotifyAlarmSliderForm__buttonWrapper__button"
            style={{backgroundImage: `url(${props.backgroundImage.more})`}}
          />
        </div>
    </div>
  )
}