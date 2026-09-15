import React from 'react';
import { useTranslation } from 'next-i18next';
import { Car } from '../../types/car/car';
import { discountPercent, isReserved, isSoldOut, isSaleActive } from '../../utils/sale';
import { CarCondition } from '../../enums/car.enum';

// Corner badges for every card variant: -N% (hot deal), NEW, RESERVED, SOLD.
const CarBadges = ({ car }: { car?: Partial<Car> | null }) => {
	const { t } = useTranslation('common');
	if (!car) return null;
	const pct = isSaleActive(car) ? discountPercent(car) : 0;
	return (
		<div className="car-badges">
			{pct > 0 && <span className="badge sale">-{pct}%</span>}
			{car.carCondition === CarCondition.NEW && <span className="badge new">{t('New')}</span>}
			{isReserved(car) && <span className="badge reserved">{t('Reserved')}</span>}
			{isSoldOut(car) && <span className="badge sold">{t('Sold')}</span>}
		</div>
	);
};

export default CarBadges;
