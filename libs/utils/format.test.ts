import { formatDate, toSiteTime } from './format';

describe('formatDate', () => {
	it('renders the site timezone regardless of the process TZ', () => {
		// 2026-05-26T16:30Z is already 27 May in Seoul.
		expect(formatDate('2026-05-26T16:30:00.000Z', 'dd.MM.yy HH:mm')).toBe('27.05.26 01:30');
		expect(formatDate('2026-05-26T16:30:00.000Z', 'MMMM')).toBe('May');
		expect(formatDate('2026-05-26T16:30:00.000Z', 'dd')).toBe('27');
	});

	it('is empty for missing or invalid input', () => {
		expect(formatDate(undefined, 'dd')).toBe('');
		expect(formatDate('not a date', 'dd')).toBe('');
	});

	it('shifts by the Seoul offset', () => {
		const shifted = toSiteTime('2026-01-01T00:00:00.000Z');
		expect(shifted.getHours()).toBe(9);
		expect(shifted.getDate()).toBe(1);
	});
});
