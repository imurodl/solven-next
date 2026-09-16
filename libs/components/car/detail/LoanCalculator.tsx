import React, { useMemo, useState } from 'react';
import { Slider, Stack, Typography } from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { useTranslation } from 'next-i18next';
import { Car } from '../../../types/car/car';
import { effectivePrice } from '../../../utils/sale';
import { useCurrency } from '../../../context/CurrencyContext';

// Monthly payment estimate: standard amortised loan on the effective price.
export const monthlyPayment = (principal: number, annualRate: number, months: number) => {
	if (principal <= 0 || months <= 0) return 0;
	const r = annualRate / 100 / 12;
	if (r === 0) return principal / months;
	return (principal * r) / (1 - Math.pow(1 + r, -months));
};

const LoanCalculator = ({ car }: { car?: Car | null }) => {
	const { t } = useTranslation('common');
	const { formatPrice } = useCurrency();
	const [downPct, setDownPct] = useState(20);
	const [rate, setRate] = useState(5.9);
	const [months, setMonths] = useState(48);
	const price = car ? effectivePrice(car) : 0;
	const principal = price * (1 - downPct / 100);
	const monthly = useMemo(() => monthlyPayment(principal, rate, months), [principal, rate, months]);
	const totalInterest = monthly * months - principal;
	if (!price) return null;

	return (
		<Stack className="loan-calculator">
			<Typography className="loan-title">
				<CalculateOutlinedIcon fontSize="inherit" /> {t('Loan calculator')}
			</Typography>
			<Stack className="loan-row">
				<span>
					{t('Down payment')} <b>{downPct}%</b> ({formatPrice(price * (downPct / 100))})
				</span>
				<Slider size="small" value={downPct} min={0} max={80} step={5} onChange={(_, v) => setDownPct(v as number)} aria-label={t('Down payment') as string} />
			</Stack>
			<Stack className="loan-row">
				<span>
					{t('Interest rate')} <b>{rate.toFixed(1)}%</b> APR
				</span>
				<Slider size="small" value={rate} min={0} max={15} step={0.1} onChange={(_, v) => setRate(v as number)} aria-label={t('Interest rate') as string} />
			</Stack>
			<Stack className="loan-row">
				<span>
					{t('Term')} <b>{months} {t('months')}</b>
				</span>
				<Slider size="small" value={months} min={12} max={84} step={12} marks onChange={(_, v) => setMonths(v as number)} aria-label={t('Term') as string} />
			</Stack>
			<Stack className="loan-result" direction="row" justifyContent="space-between" alignItems="baseline">
				<span className="muted">{t('Estimated monthly')}</span>
				<b className="monthly">{formatPrice(Math.round(monthly))}</b>
			</Stack>
			<Typography className="muted hint">
				{t('Total interest')}: {formatPrice(Math.round(Math.max(0, totalInterest)))} · {t('Estimate only; your bank sets the final rate.')}
			</Typography>
		</Stack>
	);
};

export default LoanCalculator;
