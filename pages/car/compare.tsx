import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { Button, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../../libs/utils';
import { GET_CAR } from '../../apollo/user/query';
import { compareVar } from '../../apollo/store';
import { clearCompare, loadCompare, removeCompare } from '../../libs/utils/compare';
import { Car } from '../../libs/types/car/car';
import { REACT_APP_API_URL } from '../../libs/config';
import { useCurrency } from '../../libs/context/CurrencyContext';
import { effectivePrice, isSaleActive } from '../../libs/utils/sale';
import { CarOptions } from '../../libs/enums/car.enum';
import SEO from '../../libs/components/SEO';
import { localizeCar } from '../../libs/utils/localize';
import { monthlyPayment } from '../../libs/components/car/detail/LoanCalculator';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: { deviceType: getDeviceType(req), ...(await serverSideTranslations(locale, ['common'])) },
});

const OPTION_LABELS: Record<string, string> = {
	[CarOptions.HEATED_SEATS]: 'Heated seats', [CarOptions.VENTILATED_SEATS]: 'Ventilated seats', [CarOptions.POWER_SEATS]: 'Power seats',
	[CarOptions.LEATHER_SEATS]: 'Leather seats', [CarOptions.HEATED_STEERING]: 'Heated steering', [CarOptions.SMART_KEY]: 'Smart key',
	[CarOptions.CRUISE_CONTROL]: 'Cruise control', [CarOptions.NAVIGATION]: 'Navigation', [CarOptions.PARKING_SENSOR_REAR]: 'Rear parking sensor',
	[CarOptions.PARKING_SENSOR_FRONT]: 'Front parking sensor', [CarOptions.REAR_CAMERA]: 'Rear camera', [CarOptions.CAMERA_360]: '360 camera',
	[CarOptions.SUNROOF]: 'Sunroof', [CarOptions.BLACK_BOX]: 'Dashcam', [CarOptions.LANE_KEEP_ASSIST]: 'Lane keep assist',
	[CarOptions.BLIND_SPOT_WARNING]: 'Blind spot warning', [CarOptions.AUTO_BRAKING]: 'Auto braking', [CarOptions.TWO_KEYS]: 'Two keys', [CarOptions.NON_SMOKER]: 'Non-smoker',
};

// Side-by-side spec table for up to three listings picked from the cards.
const ComparePage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { formatPrice } = useCurrency();
	const ids = useReactiveVar(compareVar);

	useEffect(() => {
		loadCompare();
	}, []);

	// One getCar per id; the list is at most three cars.
	const client = useApolloClient();
	const [fetched, setFetched] = useState<Record<string, Car | null>>({});
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const todo = ids.filter((id) => !(id in fetched));
		if (!todo.length) return;
		setLoading(true);
		Promise.all(
			todo.map((id) =>
				client
					.query({ query: GET_CAR, variables: { input: id }, fetchPolicy: 'cache-first' })
					.then((r) => [id, r.data?.getCar ?? null] as const)
					.catch(() => [id, null] as const),
			),
		).then((pairs) => {
			setFetched((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
			setLoading(false);
		});
	}, [ids, fetched, client]);
	const cars: Car[] = ids.map((id) => fetched[id]).filter((c): c is Car => !!c);
	const missing = ids.filter((id) => id in fetched && !fetched[id]);

	const rows: { label: string; render: (c: Car) => React.ReactNode }[] = [
		{ label: t('Price'), render: (c) => <b className={isSaleActive(c) ? 'sale' : ''}>{formatPrice(effectivePrice(c))}</b> },
		{ label: t('Monthly (20% down, 48 mo)'), render: (c) => formatPrice(Math.round(monthlyPayment(effectivePrice(c) * 0.8, 5.9, 48))) },
		{ label: t('Year'), render: (c) => c.manufacturedAt },
		{ label: t('Mileage'), render: (c) => `${c.carMileage?.toLocaleString()} km` },
		{ label: t('Fuel'), render: (c) => c.carFuelType },
		{ label: t('Transmission'), render: (c) => c.carTransmission },
		{ label: t('Body'), render: (c) => c.carType },
		{ label: t('Seats'), render: (c) => c.carSeats },
		{ label: t('Colour'), render: (c) => c.carColor },
		{ label: t('Condition'), render: (c) => c.carCondition || 'USED' },
		{ label: t('Location'), render: (c) => c.carLocation },
		{ label: t('Rating'), render: (c) => (c.carReviews ? `${(c.carRating ?? 0).toFixed(1)} (${c.carReviews})` : '-') },
		{ label: t('Seller'), render: (c) => c.memberData?.memberFullName || c.memberData?.memberNick || '-' },
	];
	const optionKeys = (Object.keys(OPTION_LABELS) as CarOptions[]).filter((k) => cars.some((c) => c.carOptions?.includes(k)));

	return (
		<Stack id="compare-page">
			<SEO title="Compare cars" noindex />
			<Stack className="container">
				<Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} className="head">
					<div>
						<Typography className="page-title">{t('Compare cars')}</Typography>
						<Typography className="muted">{t('Pick up to 3 cars from the listings using the compare icon.')}</Typography>
					</div>
					<Stack direction="row" spacing={1}>
						<Button className="btn-outline" onClick={() => router.push('/car')}>
							{t('Add more')}
						</Button>
						{ids.length > 0 && (
							<Button className="btn-outline" onClick={clearCompare}>
								{t('Clear all')}
							</Button>
						)}
					</Stack>
				</Stack>
				{!ids.length ? (
					<Typography className="muted empty">{t('Nothing to compare yet.')}</Typography>
				) : loading && !cars.length ? (
					<Typography className="muted empty">{t('Loading...')}</Typography>
				) : (
					<div className="compare-scroll">
						<table className="compare-table">
							<thead>
								<tr>
									<th />
									{cars.map((c) => (
										<th key={c._id}>
											<div className="car-head">
												<button className="remove" onClick={() => removeCompare(c._id)} aria-label={t('Remove') as string}>
													<CloseIcon fontSize="small" />
												</button>
												<Link href={`/car/detail?id=${c._id}`}>
													<img src={`${REACT_APP_API_URL}/${c.carImages?.[0]}`} alt={c.carTitle} />
													<span className="title">{localizeCar(c, router.locale).title}</span>
												</Link>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rows.map((row) => (
									<tr key={row.label}>
										<th>{row.label}</th>
										{cars.map((c) => (
											<td key={c._id}>{row.render(c)}</td>
										))}
									</tr>
								))}
								{optionKeys.map((k) => (
									<tr key={k} className="option-row">
										<th>{t(OPTION_LABELS[k])}</th>
										{cars.map((c) => (
											<td key={c._id}>{c.carOptions?.includes(k) ? <CheckIcon className="yes" fontSize="small" /> : <span className="no">-</span>}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
						{missing.length > 0 && (
							<Typography className="muted hint">{t('{{n}} selected listing(s) are no longer available.', { n: missing.length })}</Typography>
						)}
					</div>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(ComparePage);
