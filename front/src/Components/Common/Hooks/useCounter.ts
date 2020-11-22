import { useState } from 'react';

interface CounterOptions {
	min?: number;
	max: number;
	default: number;
	prefixZero?: boolean;
	step?: number;
	noCircular?: boolean;
}

export default function useCounter(options: CounterOptions) {
	const step = options.step || 1;
	const min = options.min || 0;
	const [counter, setCounter] = useState(defineDefault());

	function defineDefault(): number {
		if (options.default < min) return min;
		if (options.default > options.max) return options.max;
		return options.default;
	}

	const add = (): void => {
		if (counter + step > options.max) {
			if (options.noCircular) return setCounter(options.max);
			setCounter(min);
		} else {
			setCounter(counter + step);
		}
	};

	const minus = (): void => {
		if (counter - step < min) {
			if (options.noCircular) return setCounter(min);
			setCounter(options.max);
		} else {
			setCounter(counter - step);
		}
	};

	const reset = (): void => {
		setCounter(defineDefault());
	};

	let formattedNumber = String(counter);
	if (options.prefixZero) formattedNumber = ('0' + counter).slice(-2);

	return [
		formattedNumber,
		counter,
		add,
		minus,
		counter === options.max,
		counter === options.min,
		reset,
	] as const;
}
