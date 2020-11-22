import { useLocation } from 'react-router-dom';

export default function useQueryParams(name: string): string | null {
	return new URLSearchParams(useLocation().search).get(name);
}
