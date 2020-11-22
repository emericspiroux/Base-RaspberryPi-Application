import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import _ from 'lodash'

import SocketService from './Services/SocketServices'

import './Types/index.d.ts'

import './Components/Common/Styles/index.scss';

import SpotifyHome from "./Components/SpotifyHome";
import PrivateRoute from "./Routes/PrivateRoute";
import SpotifyLogin from "./Components/SpotifyLogin";
import SpotifyExchangeCode from "./Components/SpotifyExchangeCode";
import SpotifyLoggedMobile from "./Components/SpotifyLoggedMobile";
import SpotifyWifi from './Components/SpotifyWifi'
import SpotifyUpdateLoader from "./Components/SpotifyUpdateLoader";
import SpotifyFailedAlarm from "./Components/SpotifyPlayer/SpotifyFailedAlarm";

export default function App(props:any) {
  const [response] = useState("");

  useEffect(() => {
    SocketService.shared.addListennerCheckUpdate()
    return () => {
      SocketService.shared.removeListennerCheckUpdate()
    }
  }, [])

  return (
    <Provider store={props.store}>
      <PersistGate loading={null} persistor={props.persistor}>
        <BrowserRouter >
          <div style={{height:"100vh", overflow: "hidden"}}>
            {response && (
              <div>
                {response}
              </div>
            )}
            <Switch>
              <Route exact path="/update" component={SpotifyUpdateLoader} />
              <Route exact path="/failed/alarm" component={SpotifyFailedAlarm} />
              <PrivateRoute path="/alarm" component={SpotifyHome} />
              <PrivateRoute exact path="/login/mobile" component={SpotifyLoggedMobile} />
              <Route exact path="/login" component={SpotifyLogin} />
              <Route exact path="/wifi" component={SpotifyWifi} />
              <Route exact path="/login/exchange" component={SpotifyExchangeCode} />
              <Route render={_=><Redirect exact to="/login" />} />
            </Switch>
          </div>
        </BrowserRouter> 
      </PersistGate>
    </Provider>
  )
};

App.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  store: PropTypes.objectOf(PropTypes.any).isRequired,
  persistor: PropTypes.objectOf(PropTypes.any).isRequired
};