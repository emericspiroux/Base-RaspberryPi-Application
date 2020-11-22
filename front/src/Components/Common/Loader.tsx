import React from 'react'

import './Loader.scss'

interface LoaderProps {
  size?:string
  borderWidth?:string
  isBlock?:boolean,
  className?:string,
  style?:React.CSSProperties
}

const defaultLoaderSize = "30px"
const defaultLoaderBorderWidth = "5px"

export default function Loader(props:LoaderProps) {

  let style:React.CSSProperties = {
    display: props.isBlock ? "block" : "inline-block",
    margin: props.isBlock ? "auto" : "",
    width:props.size || defaultLoaderSize, 
    height:props.size || defaultLoaderSize, 
    borderWidth: props.borderWidth || defaultLoaderBorderWidth
  }

  if (props.style)
    style = {...style, ...props.style}

  return (
    <div 
      className={`Loader ${props.className}`}
      style={style}
    />
  )
}