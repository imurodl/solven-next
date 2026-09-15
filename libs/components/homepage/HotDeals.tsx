import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Stack, Typography, Button } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { GET_CARS } from '../../../apollo/user/query';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import { Car } from '../../types/car/car';
import { REACT_APP_API_URL } from '../../config';
import Countdown from '../common/Countdown';
import Price from '../common/Price';
import { discountPercent, isSaleActive } from '../../utils/sale';
import { localizeCar } from '../../utils/localize';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// Homepage "Hot Deals": listings whose sale window is open, with live countdowns.
const HotDeals = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const device = useDeviceDetect();
	const { data, refetch } = useQuery(GET_CARS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 6, sort: 'carSaleExpiresAt', direction: 1, search: { carIsOnSale: true } } },
	});
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
	const deals: Car[] = (data?.getCars?.list ?? []).filter((c: Car) => isSaleActive(c));
	if (!deals.length) return null;

	const like = async (user: any, id: string) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetCar({ variables: { input: id } });
			await refetch();
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const [lead, ...rest] = deals;
	const leadTitle = localizeCar(lead, router.locale).title;

	return (
		<Stack className="hot-deals">
			<Stack className="container">
				<Stack direction="row" className="info-box" justifyContent="space-between" alignItems="flex-end">
					<div>
						<span className="eyebrow">
							<BoltIcon fontSize="inherit" /> {t('Limited time')}
						</span>
						<Typography className="section-title">{t('Hot Deals')}</Typography>
						<Typography className="section-subtitle">{t('Price drops that end soon — reserve before the timer runs out')}</Typography>
					</div>
					<Link href={{ pathname: '/car', query: { input: JSON.stringify({ page: 1, limit: 9, sort: 'carRank', direction: -1, search: { carIsOnSale: true } }) } }}>
						<span className="see-all">
							{t('All deals')} <EastIcon fontSize="inherit" />
						</span>
					</Link>
				</Stack>

				<Stack direction={device === 'mobile' ? 'column' : 'row'} className="deal-layout">
					<div className="deal-lead" onClick={() => router.push({ pathname: '/car/detail', query: { id: lead._id } })}>
						<img src={lead.carImages?.[0] ? `${REACT_APP_API_URL}/${lead.carImages[0]}` : '/img/banner/header1.svg'} alt={lead.carTitle} />
						<div className="overlay">
							<span className="pct">-{discountPercent(lead)}%</span>
							<Typography className="lead-title">{leadTitle}</Typography>
							<Typography component="div" className="lead-price">
								<Price car={lead} />
							</Typography>
							<Countdown until={lead.carSaleExpiresAt} />
							<Button className="btn-primary" variant="contained">
								{t('Reserve now')}
							</Button>
						</div>
					</div>
					<Stack className="deal-list">
						{rest.slice(0, 4).map((car) => (
							<div className="deal-row" key={car._id} onClick={() => router.push({ pathname: '/car/detail', query: { id: car._id } })}>
								<img src={car.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : '/img/banner/header1.svg'} alt={car.carTitle} />
								<div className="meta">
									<b>{localizeCar(car, router.locale).title}</b>
									<span className="muted">
										{car.manufacturedAt} · {car.carMileage?.toLocaleString()} km
									</span>
									<Price car={car} stacked />
								</div>
								<div className="timer">
									<span className="pct">-{discountPercent(car)}%</span>
									<Countdown until={car.carSaleExpiresAt} compact />
								</div>
							</div>
						))}
						{rest.length === 0 && (
							<div className="deal-row empty">
								<span className="muted">{t('More deals coming soon')}</span>
							</div>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default HotDeals;
