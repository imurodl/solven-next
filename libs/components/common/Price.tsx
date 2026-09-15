import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { activeSalePrice, discountPercent } from '../../utils/sale';
import { Car } from '../../types/car/car';

interface PriceProps {
	car?: Partial<Car> | null;
	amount?: number; // plain amount when no car context
	className?: string;
	stacked?: boolean; // original above sale price
	showBadge?: boolean;
	compact?: boolean;
}

// Currency-aware, sale-aware price. Renders the struck-through original when a
// hot deal is active so every card/detail page shows the same thing.
const Price = ({ car, amount, className = '', stacked = false, showBadge = false, compact = false }: PriceProps) => {
	const { formatPrice } = useCurrency();
	if (!car) return <span className={`slv-price ${className}`}>{formatPrice(amount, { compact })}</span>;
	const sale = activeSalePrice(car);
	if (!sale) return <span className={`slv-price ${className}`}>{formatPrice(car.carPrice, { compact })}</span>;
	const pct = discountPercent(car);
	return (
		<span className={`slv-price on-sale ${stacked ? 'stacked' : ''} ${className}`}>
			<s className="original">{formatPrice(car.carPrice, { compact })}</s>
			<span className="sale">{formatPrice(sale, { compact })}</span>
			{showBadge && pct > 0 && <span className="pct">-{pct}%</span>}
		</span>
	);
};

export default Price;
