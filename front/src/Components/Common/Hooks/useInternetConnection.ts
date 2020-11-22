import { useEffect } from 'react';
import useReferredState from './useReferredState';

export default function useInternetConnection(init: boolean = false) {
	const [isOnline, setOnline] = useReferredState<boolean>(init);

	useEffect(() => {
		window.addEventListener('online', windowEventWifi);
		window.addEventListener('offline', windowEventWifi);
		windowEventWifi();
		return () => {
			window.removeEventListener('online', windowEventWifi);
			window.removeEventListener('offline', windowEventWifi);
		};
	}, []);

	function windowEventWifi() {
		let isOnline = navigator.onLine;
		updateIndicator(isOnline);
	}

	function updateIndicator(hasWifi: boolean) {
		setOnline(hasWifi);
	}

	return isOnline;
}
