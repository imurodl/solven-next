import React from 'react';
import { useQuery } from '@apollo/client';
import { Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslation } from 'next-i18next';
import { ESTIMATE_CAR_PRICE } from '../../../../apollo/user/query';
import { Car } from '../../../types/car/car';
import { effectivePrice } from '../../../utils/sale';
import { useCurrency } from '../../../context/CurrencyContext';

// "Fair price" badge: compares the asking price with comparable listings.
const PriceCheck = ({ car }: { car?: Car | null }) => {
	const { t } = useTranslation('common');
	const { formatPrice } = useCurrency();
	const { data } = useQuery(ESTIMATE_CAR_PRICE, {
		skip: !car?._id,
		fetchPolicy: 'cache-first',
		variables: {
			input: {
				carBrand: car?.carBrand,
				carModel: car?.carModel,
				manufacturedAt: car?.manufacturedAt,
				carMileage: car?.carMileage,
				carFuelType: car?.carFuelType,
				carType: car?.carType,
				askingPrice: car ? effectivePrice(car) : undefined,
			},
		},
	});
	const est = data?.estimateCarPrice;
	if (!est || !est.sampleSize || est.verdict === 'UNKNOWN') return null;

	const icon = est.verdict === 'GOOD_DEAL' ? <TrendingDownIcon /> : est.verdict === 'OVERPRICED' ? <TrendingUpIcon /> : <VerifiedIcon />;
	const label = t(`price.verdict.${est.verdict}`);
	return (
		<Tooltip title={`${est.reasoning} ${t('Estimated')}: ${formatPrice(est.estimate)} (${formatPrice(est.low)} – ${formatPrice(est.high)})`} arrow>
			<span className={`price-check ${String(est.verdict).toLowerCase()}`}>
				{icon}
				<span>{label}</span>
				<small>
					{t('Est.')} {formatPrice(est.estimate)}
				</small>
			</span>
		</Tooltip>
	);
};

export default PriceCheck;
