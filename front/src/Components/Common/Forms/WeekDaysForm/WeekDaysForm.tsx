import React, { useEffect } from 'react'
import useWeekDaysSelector from '../../Hooks/useWeekDaysSelector'
import './WeekDaysForm.scss'


interface WeekDaysFormProps {
  className?:string,
  onChange?:((days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>)=>void),
  defaultValue?:Array<0 | 1 | 2 | 3 | 4 | 5 | 6>
  isSmall?: boolean
}

export default function WeekDaysForm(props:WeekDaysFormProps) {
  const [daysLabel, days, toggleDay] = useWeekDaysSelector({
    default: props.defaultValue
  })
  
    useEffect(() => {
      if (props.onChange)
        props.onChange!(days)
    }, [days])

  return (
    <div 
      className={`WeekDaysForm ${props.className}`}
    >
      {Object.keys(daysLabel).map((key, index) =>
        <div 
          key={index}
          className="WeekDaysForm__selector"
          onClick={_=>props.onChange && toggleDay(daysLabel[key].index)}
        >
          <div 
            className={`WeekDaysForm__selector__checkbox ${props.isSmall && "WeekDaysForm__selector__checkbox--small"}`}
          >
            {daysLabel[key].isSelected && (
              <div className="WeekDaysForm__selector__checkbox__dot" />
            )}
          </div>
          <div 
            className={`WeekDaysForm__selector__label ${props.isSmall && "WeekDaysForm__selector__label--small"}`}

          >
            {key}
          </div>
        </div>
      )}
    </div>
  )
}