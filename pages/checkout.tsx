import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Box, Button, Stack, TextField, Typography, ToggleButton, ToggleButtonGroup, CircularProgress } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../libs/utils';
import { GET_CAR, GET_ORDER_QUOTE } from '../apollo/user/query';
import { CREATE_ORDER } from '../apollo/user/mutation';
import { userVar } from '../apollo/store';
import { Car } from '../libs/types/car/car';
import { DeliveryMethod } from '../libs/enums/order.enum';
import { useCurrency } from '../libs/context/CurrencyContext';
import { REACT_APP_API_URL } from '../libs/config';
import { isPurchasable } from '../libs/utils/sale';
import { sweetErrorHandling, sweetMixinErrorAlert } from '../libs/sweetAlert';
import { hydrateProfile } from '../libs/auth';
import SEO from '../libs/components/SEO';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: { deviceType: getDeviceType(req), ...(await serverSideTranslations(locale, ['common'])) },
});

const STEPS = ['Handover', 'Deposit', 'Confirm'];

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

// 3-step deal checkout: handover details -> deposit (mock payment) -> confirm.
// All money math comes from the server (getOrderQuote / createOrder).
const Checkout: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { formatPrice } = useCurrency();
	const carId = typeof router.query.carId === 'string' ? router.query.carId : '';
	const [step, setStep] = useState(0);
	const [method, setMethod] = useState<DeliveryMethod>(DeliveryMethod.PICKUP);
	const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', note: '' });
	const [coupon, setCoupon] = useState('');
	const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(undefined);
	const [card, setCard] = useState({ number: '', holder: '', expiry: '', cvv: '' });
	const [placed, setPlaced] = useState<{ _id: string; orderId: string } | null>(null);

	const { data: carData, loading: carLoading } = useQuery(GET_CAR, { skip: !carId, variables: { input: carId }, fetchPolicy: 'network-only' });
	const car: Car | undefined = carData?.getCar;

	const [loadQuote, { data: quoteData, loading: quoteLoading }] = useLazyQuery(GET_ORDER_QUOTE, { fetchPolicy: 'network-only' });
	const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER);
	const quote = quoteData?.getOrderQuote;

	useEffect(() => {
		if (!router.isReady) return;
		if (!user?._id) {
			router.replace({ pathname: '/account/join', query: { referrer: router.asPath } });
			return;
		}
		hydrateProfile();
	}, [router.isReady, user?._id]);

	useEffect(() => {
		setForm((f) => ({ ...f, fullName: f.fullName || user.memberFullName || user.memberNick || '', phone: f.phone || user.memberPhone || '' }));
	}, [user.memberFullName, user.memberNick, user.memberPhone]);

	useEffect(() => {
		if (carId && user?._id) loadQuote({ variables: { carId, couponCode: appliedCoupon } });
	}, [carId, user?._id, appliedCoupon]);

	const step1Valid = useMemo(() => {
		if (form.fullName.trim().length < 2 || form.phone.trim().length < 7) return false;
		if (method === DeliveryMethod.DELIVERY && (form.address.trim().length < 3 || form.city.trim().length < 2)) return false;
		return true;
	}, [form, method]);

	const cardValid = card.number.replace(/\s/g, '').length === 16 && card.holder.trim().length >= 2 && /^\d{2}\/\d{2}$/.test(card.expiry) && /^\d{3,4}$/.test(card.cvv);

	const applyCoupon = async () => {
		const code = coupon.trim().toUpperCase();
		setAppliedCoupon(code || undefined);
	};

	const placeOrder = async () => {
		try {
			if (!car) return;
			const res = await createOrder({
				variables: {
					input: {
						carId: car._id,
						deliveryMethod: method,
						deliveryInfo: {
							fullName: form.fullName.trim(),
							phone: form.phone.trim(),
							address: method === DeliveryMethod.DELIVERY ? form.address.trim() : undefined,
							city: form.city.trim() || undefined,
							note: form.note.trim() || undefined,
						},
						couponCode: quote?.couponCode || undefined,
					},
				},
			});
			setPlaced({ _id: res.data.createOrder._id, orderId: res.data.createOrder.orderId });
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (!carId) {
		return (
			<div id="checkout-page">
				<div className="container empty">
					<Typography className="empty-title">{t('No car selected')}</Typography>
					<Button className="btn-primary" variant="contained" onClick={() => router.push('/car')}>
						{t('Browse cars')}
					</Button>
				</div>
			</div>
		);
	}

	if (carLoading || !car) {
		return (
			<div id="checkout-page">
				<div className="container empty">
					<CircularProgress />
				</div>
			</div>
		);
	}

	if (placed) {
		return (
			<div id="checkout-page">
				<SEO title={t('Checkout') as string} noindex />
				<div className="container success">
					<CheckCircleIcon className="success-icon" />
					<Typography className="success-title">{t('Your reservation request is in')}</Typography>
					<Typography className="success-sub">
						{t('Order')} <b>{placed.orderId}</b> — {t('the seller will accept it shortly, then you can pay the deposit.')}
					</Typography>
					<Stack direction="row" spacing={1.5} justifyContent="center">
						<Button className="btn-primary" variant="contained" onClick={() => router.push({ pathname: '/order/tracking', query: { id: placed._id } })}>
							{t('Track order')}
						</Button>
						<Button className="btn-outline" onClick={() => router.push('/car')}>
							{t('Continue browsing')}
						</Button>
					</Stack>
				</div>
			</div>
		);
	}

	const purchasable = isPurchasable(car) && car.memberId !== user._id;

	return (
		<div id="checkout-page">
			<SEO title={t('Checkout') as string} noindex />
			<div className="container">
				<Stack className="checkout-steps" direction="row">
					{STEPS.map((label, i) => (
						<div key={label} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
							<span className="num">{i < step ? <CheckCircleIcon fontSize="small" /> : i + 1}</span>
							<span className="label">{t(label)}</span>
						</div>
					))}
				</Stack>

				<Stack className="checkout-body" direction={{ xs: 'column', md: 'row' }}>
					<Stack className="checkout-main">
						{!purchasable && (
							<Box className="notice error">{car.memberId === user._id ? t('You cannot order your own listing') : t('This car is not available for purchase')}</Box>
						)}

						{step === 0 && (
							<Stack className="panel" spacing={2}>
								<Typography className="panel-title">{t('How do you want to receive the car?')}</Typography>
								<ToggleButtonGroup exclusive value={method} onChange={(_, v) => v && setMethod(v)} className="method-toggle">
									<ToggleButton value={DeliveryMethod.PICKUP}>
										<StorefrontOutlinedIcon /> {t('Pick up from seller')}
									</ToggleButton>
									<ToggleButton value={DeliveryMethod.DELIVERY}>
										<LocalShippingOutlinedIcon /> {t('Delivery to my address')}
									</ToggleButton>
								</ToggleButtonGroup>
								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
									<TextField label={t('Full name')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} fullWidth required />
									<TextField label={t('Phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth required />
								</Stack>
								{method === DeliveryMethod.DELIVERY && (
									<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
										<TextField label={t('Address')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} fullWidth required />
										<TextField label={t('City')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} fullWidth required />
									</Stack>
								)}
								{method === DeliveryMethod.PICKUP && (
									<TextField label={t('City (optional)')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} fullWidth />
								)}
								<TextField label={t('Note to seller (optional)')} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} multiline minRows={2} fullWidth />
								<Stack direction="row" justifyContent="flex-end">
									<Button className="btn-primary" variant="contained" disabled={!step1Valid || !purchasable} onClick={() => setStep(1)}>
										{t('Continue')}
									</Button>
								</Stack>
							</Stack>
						)}

						{step === 1 && (
							<Stack className="panel" spacing={2}>
								<Typography className="panel-title">{t('Reservation deposit')}</Typography>
								<Box className="notice info">
									<LockOutlinedIcon fontSize="small" /> {t('checkout.depositNote')}
								</Box>
								<Stack direction="row" spacing={1} className="coupon-row">
									<TextField label={t('Coupon code')} value={coupon} onChange={(e) => setCoupon(e.target.value)} size="small" fullWidth />
									<Button className="btn-outline" onClick={applyCoupon} disabled={quoteLoading}>
										{t('Apply')}
									</Button>
								</Stack>
								{quote?.couponMessage && <Typography className={`coupon-msg ${quote.couponCode ? 'ok' : 'bad'}`}>{quote.couponMessage}</Typography>}
								<Typography className="panel-subtitle">{t('Card details (demo — no charge is made)')}</Typography>
								<TextField label={t('Card number')} value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} inputProps={{ inputMode: 'numeric' }} fullWidth />
								<TextField label={t('Card holder')} value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} fullWidth />
								<Stack direction="row" spacing={2}>
									<TextField label="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value.replace(/[^\d/]/g, '').slice(0, 5) })} fullWidth />
									<TextField label="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} type="password" fullWidth />
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Button className="btn-outline" onClick={() => setStep(0)}>
										{t('Back')}
									</Button>
									<Button className="btn-primary" variant="contained" disabled={!cardValid} onClick={() => setStep(2)}>
										{t('Review order')}
									</Button>
								</Stack>
							</Stack>
						)}

						{step === 2 && (
							<Stack className="panel" spacing={2}>
								<Typography className="panel-title">{t('Confirm your reservation')}</Typography>
								<div className="confirm-grid">
									<span>{t('Handover')}</span>
									<b>{method === DeliveryMethod.PICKUP ? t('Pick up from seller') : `${form.address}, ${form.city}`}</b>
									<span>{t('Contact')}</span>
									<b>
										{form.fullName} · {form.phone}
									</b>
									<span>{t('Card')}</span>
									<b>•••• {card.number.replace(/\s/g, '').slice(-4)}</b>
								</div>
								<Box className="notice info">{t('checkout.flowNote')}</Box>
								<Stack direction="row" justifyContent="space-between">
									<Button className="btn-outline" onClick={() => setStep(1)}>
										{t('Back')}
									</Button>
									<Button className="btn-primary" variant="contained" disabled={creating || !purchasable} onClick={placeOrder}>
										{creating ? t('Placing...') : t('Place reservation')}
									</Button>
								</Stack>
							</Stack>
						)}
					</Stack>

					<Stack className="checkout-summary">
						<div className="car-box" onClick={() => router.push({ pathname: '/car/detail', query: { id: car._id } })}>
							<img src={car.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : '/img/banner/header1.svg'} alt={car.carTitle} />
							<div>
								<b>{car.carTitle}</b>
								<span>
									{car.manufacturedAt} · {car.carMileage?.toLocaleString()} km · {car.carFuelType}
								</span>
							</div>
						</div>
						<div className="totals">
							<div>
								<span>{t('Car price')}</span>
								<b>{quote ? formatPrice(quote.carPrice) : '…'}</b>
							</div>
							{quote?.discountAmount > 0 && (
								<div className="discount">
									<span>
										{t('Coupon')} {quote.couponCode}
									</span>
									<b>-{formatPrice(quote.discountAmount)}</b>
								</div>
							)}
							<div>
								<span>{t('Total')}</span>
								<b>{quote ? formatPrice(quote.orderTotal) : '…'}</b>
							</div>
							<div className="deposit">
								<span>
									{t('Deposit due now')} ({Math.round((quote?.depositRate ?? 0.05) * 100)}%)
								</span>
								<b>{quote ? formatPrice(quote.orderDeposit) : '…'}</b>
							</div>
							<p className="muted">{t('checkout.balanceNote')}</p>
						</div>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(Checkout);
