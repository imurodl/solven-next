import { activeSalePrice, discountPercent, effectivePrice, isSaleActive } from './sale';

const now = new Date('2026-09-15T00:00:00Z').getTime();
const day = 86400000;

describe('sale helpers', () => {
	const base = { carPrice: 20000, carSalePrice: 17000, carIsOnSale: true };

	it('is active inside the window and inactive outside', () => {
		expect(isSaleActive({ ...base, carSaleStartsAt: new Date(now - day), carSaleExpiresAt: new Date(now + day) }, now)).toBe(true);
		expect(isSaleActive({ ...base, carSaleStartsAt: new Date(now + day) }, now)).toBe(false);
		expect(isSaleActive({ ...base, carSaleExpiresAt: new Date(now - 1) }, now)).toBe(false);
		expect(isSaleActive({ ...base, carIsOnSale: false }, now)).toBe(false);
	});

	it('treats a missing start date as started', () => {
		expect(isSaleActive({ ...base, carSaleExpiresAt: new Date(now + day) }, now)).toBe(true);
	});

	it('derives sale price, effective price and discount', () => {
		const car = { ...base, carSaleExpiresAt: new Date(Date.now() + day) };
		expect(activeSalePrice(car)).toBe(17000);
		expect(effectivePrice(car)).toBe(17000);
		expect(discountPercent(car)).toBe(15);
		expect(effectivePrice({ carPrice: 20000 })).toBe(20000);
		expect(discountPercent({ carPrice: 20000 })).toBe(0);
	});
});
