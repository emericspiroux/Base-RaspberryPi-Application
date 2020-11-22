import React from 'react';

export default function useReferredState<T>(initialValue: any) {
	const [state, setState] = React.useState(initialValue);
	const reference = React.useRef<T>(state);

	const setReferredState = (value: T) => {
		reference.current = value;
		setState(value);
	};

	return [reference, setReferredState] as const;
}
