import { compareVar } from '../../apollo/store';
import { COMPARE_LIMIT, clearCompare, loadCompare, removeCompare, toggleCompare } from './compare';

describe('compare tray state', () => {
	beforeEach(() => {
		window.localStorage.clear();
		compareVar([]);
	});

	it('adds, removes and persists ids', () => {
		expect(toggleCompare('a')).toBe(true);
		expect(toggleCompare('b')).toBe(true);
		expect(compareVar()).toEqual(['a', 'b']);
		removeCompare('a');
		expect(compareVar()).toEqual(['b']);
		compareVar([]);
		loadCompare();
		expect(compareVar()).toEqual(['b']);
	});

	it('caps the list and toggles off', () => {
		for (let i = 0; i < COMPARE_LIMIT; i++) expect(toggleCompare(`car${i}`)).toBe(true);
		expect(toggleCompare('overflow')).toBe(false);
		expect(compareVar()).toHaveLength(COMPARE_LIMIT);
		expect(toggleCompare('car0')).toBe(true);
		expect(compareVar()).not.toContain('car0');
		clearCompare();
		expect(compareVar()).toEqual([]);
	});
});
