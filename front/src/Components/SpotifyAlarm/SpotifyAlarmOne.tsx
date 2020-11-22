import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Route, Switch, useHistory } from 'react-router-dom'

import Alarm from '../../Models/Alarm'
import { resetDeleteAlarm, resetStateSave, saveAlarm, setCurrent } from '../../Modules/Alarm'
import AlarmServices from '../../Services/AlarmServices'

import './SpotifyAlarmOne.scss'

import SpotifyAlarmOneMenu from './SpotifyAlarmOneMenu'
import SpotifyAlarmOneClock from './SpotifyAlarmOneClock/SpotifyAlarmOneClock'
import SpotifyAlarmOneSettings from './SpotifyAlarmOneSettings/SpotifyAlarmOneSettings'
import SpotifyAlarmOneMusic from './SpotifyAlarmOneMusic/SpotifyAlarmOneMusic'

//icon_wrench.png

export default function SpotifyAlarmOne() {
  const current = useSelector<unknown, Alarm>(state => _.get(state, "alarms.current"))
  const isDeleted = useSelector(state => _.get(state, "alarms.deleting.isDeleted"))
  const isLoading = useSelector(state => _.get(state, "alarms.save.isLoading"))
  const isSuccess = useSelector(state => _.get(state, "alarms.save.isSuccess"))
  const errors = useSelector(state => _.get(state, "alarms.save.errors"))
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    return () => {
      dispatch(setCurrent())
    }
  }, [dispatch])

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetStateSave())
      history.push('/alarm/list')
    }
  }, [isSuccess])

  useEffect(() => {
    if (isDeleted) {
      dispatch(resetDeleteAlarm())
      history.push('/alarm/list')
    }
  }, [isDeleted])

  function onSave() {
    dispatch(saveAlarm(current, current._id))
  }

  function canSave():boolean {
    return AlarmServices.checkValidity(current)
  }

  function onResetError() {
    dispatch(resetStateSave())
  }

  return (
    <div className="SpotifyAlarmOne">
      <SpotifyAlarmOneMenu 
        onSave={onSave} 
        canSave={canSave()} 
        isLoading={isLoading} 
        hasError={!!errors}
        onResetError={onResetError}
      />
      <Switch> 
        <Route exact path="/alarm/list/one" component={SpotifyAlarmOneMusic}/>
        <Route exact path="/alarm/list/one/clock" component={SpotifyAlarmOneClock}/>
        <Route exact path="/alarm/list/one/settings" component={SpotifyAlarmOneSettings}/>
      </Switch>
    </div>
  )
}