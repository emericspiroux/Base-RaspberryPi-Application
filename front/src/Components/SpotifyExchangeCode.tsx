import React, {useEffect} from 'react';
import _ from 'lodash'
import {useSelector} from "react-redux";
import useQueryParams from './Common/Hooks/useQueryParams';
import UserServices from '../Services/UserServices';
import { useHistory } from 'react-router-dom';
import SocketServices from '../Services/SocketServices';

const { isMobile } = require('react-device-detect')

function SpotifyExchangeCode() {
	let code = useQueryParams('code')
	let token = useSelector((state) => _.get(state, "user.token"))
	let error = useSelector((state) => _.get(state, "user.login.error"))
	let history = useHistory()

	useEffect(() => {
		if (code)
			UserServices.shared.exchangeCode(code)
	}, [code])

	useEffect(() => {
		if (token && !isMobile) {
			SocketServices.shared.closeKeyboard()
			history.push('/alarm')
		}
		if (token && isMobile) {
			SocketServices.shared.loginOtherDevices(token)
			history.push('/login/mobile')
		}
	}, [token, history])

	useEffect(() => {
		if (error)
			history.push('/login')
	}, [error, history])

	return (
		<div>
			Loading...
		</div>
	);
}

export default SpotifyExchangeCode;
