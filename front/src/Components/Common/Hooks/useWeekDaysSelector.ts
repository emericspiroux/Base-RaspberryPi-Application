import { useState, useEffect } from 'react';

interface CounterOptions {
	default?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;
	long?: boolean;
}

type dayType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function useWeekDaysSelector(options?: CounterOptions) {
	const [days, setdays] = useState((options && options.default) || []);

	useEffect(() => {
		setdays((options && options.default) || []);
	}, [options && options.default]);

	function add(day: dayType): void {
		let daysCopy = [...days];
		if (isSelected(day)) return;
		daysCopy.push(day);
		setdays(daysCopy);
	}

	function remove(day: dayType): void {
		let daysCopy = [...days];
		daysCopy = daysCopy.filter((dayCopy) => dayCopy !== day);
		setdays(daysCopy);
	}

	function isSelected(day: dayType): boolean {
		return days.indexOf(day) !== -1;
	}

	function toggleDay(day: dayType): void {
		if (isSelected(day)) {
			return remove(day);
		}
		return add(day);
	}

	function selectShort(long: string, short: string): string {
		if (options && options.long) return long;
		return short;
	}

	const label: { [key: string]: { index: dayType; isSelected: boolean } } = {
		[selectShort('Lundi', 'Lun.')]: {
			index: 1,
			isSelected: isSelected(1),
		},
		[selectShort('Mardi', 'Mar.')]: {
			index: 2,
			isSelected: isSelected(2),
		},
		[selectShort('Mercredi', 'Mer.')]: {
			index: 3,
			isSelected: isSelected(3),
		},
		[selectShort('Jeudi', 'Jeu.')]: {
			index: 4,
			isSelected: isSelected(4),
		},
		[selectShort('Vendredi', 'Ven.')]: {
			index: 5,
			isSelected: isSelected(5),
		},
		[selectShort('Samedi', 'Sam.')]: {
			index: 6,
			isSelected: isSelected(6),
		},
		[selectShort('Dimanche', 'Dim.')]: {
			index: 0,
			isSelected: isSelected(0),
		},
	};

	return [label, days, toggleDay] as const;
}
