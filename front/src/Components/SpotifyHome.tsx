import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash'

import './SpotifyHome.scss';
import SpotifyPlayer from './SpotifyPlayer/SpotifyPlayer';

import SpotifyAlarmOne from './SpotifyAlarm/SpotifyAlarmOne';
import SpotifyAlarmList from './SpotifyAlarm/SpotifyAlarmList';
import SpotifyAlarmButton from './SpotifyAlarm/SpotifyAlarmButton';
import SpotifyAlarmWindow from './SpotifyAlarm/SpotifyAlarmWindow';
import SpotifyAlarmSettings from './SpotifyAlarmSettings/SpotifyAlarmSettings';
import SpotifyAlarmLogs from './SpotifyAlarmSettings/SpotifyAlarmLogs';
import SpotifyAlarmLight from './SpotifyAlarmSettings/SpotifyAlarmLight';
import SocketServices from '../Services/SocketServices';

function SpotifyHome() {
  const location = useLocation()
  const token = useSelector((state) => _.get(state, "user.token"))
  const player = useSelector(state => _.get(state, "Spotify.player"))
  const history = useHistory()

  function onGoBack():string | undefined {
    if (location.pathname.match(new RegExp('^(/alarm/list)', "i"))) return '/alarm/list'
    return
  }

  useEffect(() => {
    if (!token)
      history.replace('/login')
  }, [token])

  useEffect(() => {
    if (window.onSpotifyWebPlaybackSDKReady && player) {
      SocketServices.shared.log.info('Initialize Player');
      player.connect()
    }
    return () => {
      if (player) {
        SocketServices.shared.log.info('Disconnect Player');
        player.disconnect()
      }
    }
  }, [player])

  return (
    <div className="SpotifyHome">
      <SpotifyPlayer/>
      <SpotifyAlarmButton/>
      <Route path={["/alarm/list", "/alarm/settings"]}>
        <SpotifyAlarmWindow closePath="/alarm" isBack={location.pathname !== '/alarm/list'} onGoBack={onGoBack}>
          <Switch> 
            <Route path="/alarm/list/one" component={SpotifyAlarmOne}/>
            <Route exact path="/alarm/settings" component={SpotifyAlarmSettings}/>
            <Route exact path="/alarm/settings/logs" component={SpotifyAlarmLogs}/>
            <Route exact path="/alarm/settings/light" component={SpotifyAlarmLight}/>
            <Route exact path="/alarm/list" component={SpotifyAlarmList}/>
          </Switch>
        </SpotifyAlarmWindow>
      </Route>
    </div>
  );
}

export default SpotifyHome;
