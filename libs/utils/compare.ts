import { compareVar } from '../../apollo/store';

const KEY = 'solven-compare';
export const COMPARE_LIMIT = 3;

export const loadCompare = () => {
	try {
		const raw = typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null;
		const ids = raw ? (JSON.parse(raw) as string[]) : [];
		compareVar(Array.isArray(ids) ? ids.slice(0, COMPARE_LIMIT) : []);
	} catch {
		compareVar([]);
	}
};

const persist = (ids: string[]) => {
	compareVar(ids);
	try {
		window.localStorage.setItem(KEY, JSON.stringify(ids));
	} catch {}
};

// Returns false when the list is full and the id was not added.
export const toggleCompare = (id: string): boolean => {
	const ids = compareVar();
	if (ids.includes(id)) {
		persist(ids.filter((x) => x !== id));
		return true;
	}
	if (ids.length >= COMPARE_LIMIT) return false;
	persist([...ids, id]);
	return true;
};

export const removeCompare = (id: string) => persist(compareVar().filter((x) => x !== id));
export const clearCompare = () => persist([]);
