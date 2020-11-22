import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/fr';

interface useClockOptions {
	format?: string;
	language?: string;
}

const getTime = (format: string | undefined) => {
	return moment().format(format);
};

export default function useClock(
	clockOptions: useClockOptions = { format: 'HH[:]mm', language: 'fr' },
) {
	const [clock, setClock] = useState(getTime(clockOptions.format));
	moment.locale(clockOptions.language);
	useEffect(() => {
		let interval = setInterval(() => {
			setClock(getTime(clockOptions.format));
		}, 1000);
		return () => clearTimeout(interval);
	}, [setClock, clockOptions.format]);
	return clock;
}
