
import React, { useEffect, useState } from 'react'
import useCounter from '../Hooks/useCounter'
import './SpotifyAlarmDestructiveButton.scss'


interface SpotifyAlarmDestructiveButtonTextProps {
  text: string,
  loading: string
}

interface SpotifyAlarmDestructiveButtonProps {
  className?: string
  canDelete?: boolean,
  isLoading?: boolean,
  hasError?: boolean,
  onDelete?: (()=>void),
  label?: SpotifyAlarmDestructiveButtonTextProps,
  style?: React.CSSProperties
}

export default function SpotifyAlarmDestructiveButton(props:SpotifyAlarmDestructiveButtonProps 
    = {label: {
      text: "Supprimer",
      loading: "Suppression en cours...",
    }}
  ) {
  const [_, acceptanceCount, up, _2, _3, _4, reset] = useCounter({
    max: 2,
    default: 0,
    noCircular: true,
  })
  
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  function onDelete() {
    if (timeoutId)
      clearTimeout(timeoutId)
    if (acceptanceCount >= 2)
      return props.onDelete && props.onDelete()
    up()
    setTimeoutId(setTimeout(() => {
      reset()
    }, 3000))
  }

  function getDisplayText():string | undefined {
    switch (acceptanceCount) {
      case 1 :
      case 2 :
        return `Appuie encore ${3 - acceptanceCount} fois`
      default:
        return props.label?.text
    }
  }

  return (
    <button 
      style={props.style}
      className={`SpotifyAlarmDestructiveButton ${(!props.canDelete || props.isLoading) && "SpotifyAlarmDestructiveButton--disabled"} ${props.className}`}
      onClick={() => props.canDelete && onDelete()}
    >
      {props.isLoading ? props.label?.loading : getDisplayText()}
    </button>
  )
}