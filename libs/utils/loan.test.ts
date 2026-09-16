import { monthlyPayment } from '../components/car/detail/LoanCalculator';

describe('monthlyPayment', () => {
	it('amortises a standard loan', () => {
		// 20,000 over 48 months at 5.9% APR -> about 468.6 per month
		expect(Math.round(monthlyPayment(20000, 5.9, 48))).toBe(469);
	});
	it('divides evenly at zero interest', () => {
		expect(monthlyPayment(12000, 0, 12)).toBe(1000);
	});
	it('returns zero for empty inputs', () => {
		expect(monthlyPayment(0, 5, 48)).toBe(0);
		expect(monthlyPayment(1000, 5, 0)).toBe(0);
	});
});
