import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../../libs/utils';
import { GET_ORDER_BY_ID } from '../../apollo/user/query';
import { socketVar, userVar } from '../../apollo/store';
import { Order } from '../../libs/types/order/order';
import { ACTIVE_ORDER_STATUSES, DeliveryMethod } from '../../libs/enums/order.enum';
import OrderTimeline from '../../libs/components/order/OrderTimeline';
import OrderActions from '../../libs/components/order/OrderActions';
import UserAvatar from '../../libs/components/common/UserAvatar';
import { useCurrency } from '../../libs/context/CurrencyContext';
import { REACT_APP_API_URL } from '../../libs/config';
import SEO from '../../libs/components/SEO';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: { deviceType: getDeviceType(req), ...(await serverSideTranslations(locale, ['common'])) },
});

const OrderTracking: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const { formatPrice } = useCurrency();
	const id = typeof router.query.id === 'string' ? router.query.id : '';

	const { data, loading, refetch, startPolling, stopPolling } = useQuery(GET_ORDER_BY_ID, {
		skip: !id || !user?._id,
		variables: { orderId: id },
		fetchPolicy: 'network-only',
	});
	const order: Order | undefined = data?.getOrderById;

	useEffect(() => {
		if (!router.isReady) return;
		if (!user?._id) router.replace({ pathname: '/account/join', query: { referrer: router.asPath } });
	}, [router.isReady, user?._id]);

	// Poll while the deal is in flight (demo auto-progression), plus WS push.
	useEffect(() => {
		if (order && ACTIVE_ORDER_STATUSES.includes(order.orderStatus)) startPolling(15000);
		else stopPolling();
		return () => stopPolling();
	}, [order?.orderStatus]);

	useEffect(() => {
		if (!socket) return;
		const onMessage = (msg: MessageEvent) => {
			try {
				const d = JSON.parse(msg.data);
				if (d.event === 'order' && d.payload?.orderId === id) refetch();
			} catch {
				// ignore
			}
		};
		socket.addEventListener('message', onMessage);
		return () => socket.removeEventListener('message', onMessage);
	}, [socket, id, refetch]);

	if (loading || !order) {
		return (
			<div id="order-tracking-page">
				<div className="container empty">{loading ? <CircularProgress /> : <Typography>{t('Order not found')}</Typography>}</div>
			</div>
		);
	}

	const isBuyer = user._id === order.memberId;
	const partner = isBuyer ? order.sellerData : order.memberData;

	return (
		<div id="order-tracking-page">
			<SEO title={`${t('Order')} ${order.orderId}`} noindex />
			<div className="container">
				<Stack className="tracking-head" direction={{ xs: 'column', md: 'row' }}>
					<div>
						<Typography className="order-id">
							{t('Order')} <b>{order.orderId}</b>
						</Typography>
						<Typography className="muted">
							{t('Placed')} {new Date(order.createdAt).toLocaleString()}
						</Typography>
					</div>
					<span className={`status-chip ${order.orderStatus.toLowerCase()}`}>{t(`order.status.${order.orderStatus}`)}</span>
				</Stack>

				<OrderTimeline order={order} />

				<Stack className="tracking-body" direction={{ xs: 'column', md: 'row' }}>
					<Stack className="tracking-main" spacing={2}>
						<div className="car-box" onClick={() => router.push({ pathname: '/car/detail', query: { id: order.carId } })}>
							<img src={order.carSnapshot.carImage ? `${REACT_APP_API_URL}/${order.carSnapshot.carImage}` : '/img/banner/header1.svg'} alt={order.carSnapshot.carTitle} />
							<div>
								<b>{order.carSnapshot.carTitle}</b>
								<span>
									{order.carSnapshot.manufacturedAt} · {order.carSnapshot.carMileage?.toLocaleString()} km
								</span>
							</div>
						</div>

						<div className="panel">
							<Typography className="panel-title">{t('Handover')}</Typography>
							<div className="kv">
								<span>{t('Method')}</span>
								<b>{order.deliveryMethod === DeliveryMethod.PICKUP ? t('Pick up from seller') : t('Delivery to my address')}</b>
								<span>{t('Contact')}</span>
								<b>
									{order.deliveryInfo.fullName} · {order.deliveryInfo.phone}
								</b>
								{order.deliveryInfo.address && (
									<>
										<span>{t('Address')}</span>
										<b>
											{order.deliveryInfo.address}, {order.deliveryInfo.city}
										</b>
									</>
								)}
								{order.deliveryInfo.note && (
									<>
										<span>{t('Note')}</span>
										<b>{order.deliveryInfo.note}</b>
									</>
								)}
								{order.cancelReason && (
									<>
										<span>{t('Cancel reason')}</span>
										<b>{order.cancelReason}</b>
									</>
								)}
								{order.returnReason && (
									<>
										<span>{t('Return reason')}</span>
										<b>{order.returnReason}</b>
									</>
								)}
							</div>
						</div>

						<OrderActions order={order} onChanged={() => refetch()} />
					</Stack>

					<Stack className="tracking-side" spacing={2}>
						<div className="panel">
							<Typography className="panel-title">{isBuyer ? t('Seller') : t('Buyer')}</Typography>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<UserAvatar image={partner?.memberImage} name={partner?.memberNick} size={48} />
								<div>
									<b>{partner?.memberFullName || partner?.memberNick}</b>
									{partner?.memberPhone && <span className="muted block">{partner.memberPhone}</span>}
								</div>
							</Stack>
							<Button className="btn-outline" sx={{ mt: 1.5 }} fullWidth onClick={() => router.push({ pathname: '/mypage', query: { category: 'messages' } })}>
								{t('Messages')}
							</Button>
						</div>
						<div className="panel totals">
							<div>
								<span>{t('Car price')}</span>
								<b>{formatPrice(order.carSnapshot.carPrice)}</b>
							</div>
							{order.orderDiscount > 0 && (
								<div className="discount">
									<span>
										{t('Coupon')} {order.orderCouponCode}
									</span>
									<b>-{formatPrice(order.orderDiscount)}</b>
								</div>
							)}
							<div>
								<span>{t('Total')}</span>
								<b>{formatPrice(order.orderTotal)}</b>
							</div>
							<div className="deposit">
								<span>{t('Deposit')}</span>
								<b>{formatPrice(order.orderDeposit)}</b>
							</div>
						</div>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(OrderTracking);
