import { formatterStr } from './utils';

describe('formatterStr', () => {
	it('formats a number with thousands separators', () => {
		expect(formatterStr(56800)).toBe('56,800');
	});

	it('formats large numbers', () => {
		expect(formatterStr(1500000)).toBe('1,500,000');
	});

	it('returns an empty string for zero', () => {
		expect(formatterStr(0)).toBe('');
	});

	it('returns an empty string for undefined', () => {
		expect(formatterStr(undefined)).toBe('');
	});
});
