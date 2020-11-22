import React, { useEffect, useState } from 'react'
import './SpotifyAlarmCheckboxForm.scss'


interface SpotifyAlarmCheckboxFormProps {
  className?:string
  onChange:((enable:boolean)=>void),
  defaultValue?:boolean,
  label:string
}

export default function SpotifyAlarmCheckboxForm(props:SpotifyAlarmCheckboxFormProps) {
  const [enable, setEnable] = useState(props.defaultValue || false)

  useEffect(() => {
    function onChange(enable:boolean) {
      props.onChange(enable)
    }
    onChange(enable)
  }, [enable])

  
  return (
    <div 
      className={`SpotifyAlarmCheckboxForm ${props.className}`}
    >
        <div className="SpotifyAlarmCheckboxForm__label">
          {props.label}
        </div>
        <div className="SpotifyAlarmCheckboxForm__checkBoxWrapper">
          <div className="SpotifyAlarmCheckboxForm__checkBoxWrapper__checkbox" onClick={()=>setEnable(!enable)}>
            <div className={`SpotifyAlarmCheckboxForm__checkBoxWrapper__checkbox__toggle ${enable && "SpotifyAlarmCheckboxForm__checkBoxWrapper__checkbox__toggle--enable"}`}>
                <div className="SpotifyAlarmCheckboxForm__checkBoxWrapper__checkbox__toggle__background"/>
                <div className="SpotifyAlarmCheckboxForm__checkBoxWrapper__checkbox__toggle__pin"/>
            </div>
          </div>
        </div>
    </div>
  )
}