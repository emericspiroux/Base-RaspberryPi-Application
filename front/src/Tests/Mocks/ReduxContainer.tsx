import React from 'react'
import { Provider } from "react-redux";


interface ReduxContainerProps {
  store:any,
  children:JSX.Element
}

export default function ReduxContainer(props:ReduxContainerProps) {
  return (
    <Provider store={props.store}>
      {props.children}
    </Provider>
  )
}