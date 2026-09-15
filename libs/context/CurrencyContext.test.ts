import { formatCurrency } from './CurrencyContext';

const rates = { USD: 1, KRW: 1350, UZS: 12700, RUB: 90 };

describe('formatCurrency', () => {
	it('formats USD without conversion', () => {
		expect(formatCurrency(24990, 'USD', rates)).toBe('$24,990');
	});

	it('converts to KRW and RUB with locale separators', () => {
		expect(formatCurrency(10, 'KRW', rates)).toBe('₩13,500');
		expect(formatCurrency(10, 'RUB', rates)).toBe('900 ₽');
	});

	it('abbreviates large UZS amounts', () => {
		expect(formatCurrency(20000, 'UZS', rates)).toBe("254.0 mln so'm");
		expect(formatCurrency(1, 'UZS', rates)).toBe("13 ming so'm");
	});

	it('compact KRW uses 만원', () => {
		expect(formatCurrency(20000, 'KRW', rates, true)).toBe('2,700만원');
	});
});
