import React, { useEffect, useRef } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import './SpotifyAlarmLogs.scss'
import { getLogs } from '../../Modules/System'
import Loader from '../Common/Loader'

export default function SpotifyAlarmLogs() {
  const isLoading = useSelector((state:any) => _.get(state, "system.logs.isLoading", true))
  const logs = useSelector((state:any) => _.get(state, "system.logs.list"))
  const dispatch = useDispatch()
  const hasResults = Array.isArray(logs) && logs.length > 0
  const logContent = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    dispatch(getLogs())
  }, [])

  useEffect(() => {
    if (logContent.current) {
      logContent.current.scrollTop = logContent.current.scrollHeight
    }
  }, [logContent, logs])

  return (
    <div className="SpotifyAlarmLogs">
      <h2>Logs</h2>
      <div className={`SpotifyAlarmLogs__content ${isLoading || !hasResults ? "SpotifyAlarmLogs__content--loading" : "SpotifyAlarmLogs__content--logs"}`}>
        {isLoading ? (
          <Loader />
        ) : !hasResults ? (
          <div className="SpotifyAlarmLogs__content__empty">
            Aucun log disponible
          </div>
        ) : (
          <div className="SpotifyAlarmLogs__content__logs" ref={logContent}>
            {logs.map((e:string, index:number) => 
              <div className="SpotifyAlarmLogs__content__log" key={index}>
                {e}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}