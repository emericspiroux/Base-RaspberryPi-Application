import React from 'react';
import ReactDOM from 'react-dom';
import { getQueriesForElement, render } from '@testing-library/react';
import SpotifyLogin from '../../Components/SpotifyLogin';
import ReduxContainer from '../Mocks/ReduxContainer';
import StoreServices from '../../Services/StoreServices';
import Sinon, { createSandbox } from 'sinon';
import * as DeviceDetect from 'react-device-detect'
import { shallow, ShallowWrapper } from 'enzyme';

describe('Testing SpotifyLogin', () => {
  let spotifyLogin:ShallowWrapper;
  let sandbox = createSandbox()

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it("should display Button login if not mobile", () => {
    const {store} = StoreServices.setup();
    let spotifyLogin = shallow(
      <ReduxContainer store={store}>
        <SpotifyLogin />
      </ReduxContainer>
    )
    sandbox.stub(DeviceDetect, "isMobile").value(false);
    spotifyLogin.render()
    expect(spotifyLogin.text).toEqual("Se connecter")
  })

  it("should display specific Button login if mobile", () => {
    const {store} = StoreServices.setup();
    
    let spotifyLogin = shallow(
      <ReduxContainer store={store}>
        <SpotifyLogin />
      </ReduxContainer>
    )
    sandbox.stub(DeviceDetect, "isMobile").value(true);
    expect(spotifyLogin.text).toEqual("Connecter mon réveil")
  })
})
