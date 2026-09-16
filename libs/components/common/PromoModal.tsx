import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Dialog, IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import { useTranslation } from 'next-i18next';
import { GET_CARS } from '../../../apollo/user/query';
import { Car } from '../../types/car/car';
import { REACT_APP_API_URL } from '../../config';
import Countdown from './Countdown';
import Price from './Price';
import { discountPercent, isSaleActive } from '../../utils/sale';

const KEY = 'slv_promo_seen';

// Once per session: the hottest current deal, with its real countdown.
const PromoModal = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { data } = useQuery(GET_CARS, {
		fetchPolicy: 'cache-first',
		variables: { input: { page: 1, limit: 5, sort: 'carRank', direction: 'DESC', search: { carIsOnSale: true } } },
	});
	const deal: Car | undefined = (data?.getCars?.list ?? []).find((c: Car) => isSaleActive(c) && discountPercent(c) >= 5);

	useEffect(() => {
		if (!deal) return;
		try {
			if (sessionStorage.getItem(KEY) === '1') return;
		} catch {
			// ignore
		}
		const timer = setTimeout(() => setOpen(true), 14000);
		return () => clearTimeout(timer);
	}, [deal?._id]);

	const close = () => {
		setOpen(false);
		try {
			sessionStorage.setItem(KEY, '1');
		} catch {
			// ignore
		}
	};

	if (!deal) return null;
	return (
		<Dialog open={open} onClose={close} className="promo-modal" maxWidth="sm">
			<div className="promo-card">
				<IconButton className="close" onClick={close} aria-label="Close">
					<CloseIcon />
				</IconButton>
				<img src={deal.carImages?.[0] ? `${REACT_APP_API_URL}/${deal.carImages[0]}` : '/img/banner/header1.svg'} alt={deal.carTitle} />
				<div className="content">
					<span className="eyebrow">
						<BoltIcon fontSize="inherit" /> {t('Hot deal')} · -{discountPercent(deal)}%
					</span>
					<Typography className="title">{deal.carTitle}</Typography>
					<Typography component="div" className="price">
						<Price car={deal} />
					</Typography>
					<Countdown until={deal.carSaleExpiresAt} />
					<Button
						className="btn-primary"
						variant="contained"
						onClick={() => {
							close();
							router.push({ pathname: '/car/detail', query: { id: deal._id } });
						}}
					>
						{t('View deal')}
					</Button>
				</div>
			</div>
		</Dialog>
	);
};

export default PromoModal;
