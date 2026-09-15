import React, { useState } from 'react';
import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GET_MY_ORDERS, GET_SELLER_ORDERS } from '../../../apollo/user/query';
import { Order } from '../../types/order/order';
import { OrderStatus, ACTIVE_ORDER_STATUSES } from '../../enums/order.enum';
import { useCurrency } from '../../context/CurrencyContext';
import { REACT_APP_API_URL } from '../../config';
import OrderActions from '../order/OrderActions';
import UserAvatar from '../common/UserAvatar';
import { RowSkeleton } from '../common/Skeletons';
import { timeAgo } from '../../utils/format';

interface MyOrdersProps {
	mode?: 'buyer' | 'seller';
}

type Filter = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
const FILTERS: Filter[] = ['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
const LIMIT = 8;

// Buyer view ("My Orders") and seller view ("Deals" = incoming reservations).
const MyOrders = ({ mode = 'buyer' }: MyOrdersProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { formatPrice } = useCurrency();
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState<Filter>('ALL');

	const search =
		filter === 'ACTIVE'
			? { statusList: ACTIVE_ORDER_STATUSES }
			: filter === 'COMPLETED'
			? { statusList: [OrderStatus.COMPLETED, OrderStatus.RETURN_REQUESTED, OrderStatus.RETURNED] }
			: filter === 'CANCELLED'
			? { orderStatus: OrderStatus.CANCELLED }
			: {};

	const { data, loading, refetch } = useQuery(mode === 'seller' ? GET_SELLER_ORDERS : GET_MY_ORDERS, {
		variables: { input: { page, limit: LIMIT, search } },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
	});
	const payload = mode === 'seller' ? data?.getSellerOrders : data?.getMyOrders;
	const orders: Order[] = payload?.list ?? [];
	const total: number = payload?.metaCounter?.[0]?.total ?? 0;

	return (
		<div id="my-orders-page" className="mypage-panel">
			<Stack className="main-title-box">
				<Typography className="main-title">{mode === 'seller' ? t('Deals') : t('My Orders')}</Typography>
				<Typography className="sub-title">
					{mode === 'seller' ? t('Reservations buyers sent for your listings') : t('Your reservations and completed deals')}
				</Typography>
			</Stack>

			<Stack direction="row" className="filter-chips">
				{FILTERS.map((f) => (
					<button
						key={f}
						className={`chip ${filter === f ? 'active' : ''}`}
						onClick={() => {
							setFilter(f);
							setPage(1);
						}}
					>
						{t(`orders.filter.${f}`)}
					</button>
				))}
			</Stack>

			<Stack className="orders-list">
				{loading && orders.length === 0 && [1, 2, 3].map((i) => <RowSkeleton key={i} />)}
				{!loading && orders.length === 0 && (
					<Stack className="empty-box">
						<Typography>{mode === 'seller' ? t('No deals yet') : t('No orders yet')}</Typography>
						{mode === 'buyer' && (
							<Button className="btn-primary" variant="contained" onClick={() => router.push('/car')}>
								{t('Browse cars')}
							</Button>
						)}
					</Stack>
				)}
				{orders.map((order) => {
					const partner = mode === 'seller' ? order.memberData : order.sellerData;
					return (
						<Stack className="order-row slv-reveal" key={order._id}>
							<div className="order-car" onClick={() => router.push({ pathname: '/order/tracking', query: { id: order._id } })}>
								<img src={order.carSnapshot.carImage ? `${REACT_APP_API_URL}/${order.carSnapshot.carImage}` : '/img/banner/header1.svg'} alt={order.carSnapshot.carTitle} />
								<div className="meta">
									<b>{order.carSnapshot.carTitle}</b>
									<span className="muted">
										{order.orderId} · {timeAgo(order.createdAt)}
									</span>
									<Stack direction="row" alignItems="center" spacing={1} className="partner">
										<UserAvatar image={partner?.memberImage} name={partner?.memberNick} size={22} />
										<span className="muted">{partner?.memberNick}</span>
									</Stack>
								</div>
							</div>
							<div className="order-money">
								<b>{formatPrice(order.orderTotal)}</b>
								<span className="muted">
									{t('Deposit')} {formatPrice(order.orderDeposit)}
								</span>
							</div>
							<div className="order-state">
								<span className={`status-chip ${order.orderStatus.toLowerCase()}`}>{t(`order.status.${order.orderStatus}`)}</span>
								<OrderActions order={order} onChanged={() => refetch()} compact />
								<Button className="btn-text" onClick={() => router.push({ pathname: '/order/tracking', query: { id: order._id } })}>
									{t('Details')}
								</Button>
							</div>
						</Stack>
					);
				})}
			</Stack>

			{total > LIMIT && (
				<Stack className="pagination-config" alignItems="center">
					<Pagination page={page} count={Math.ceil(total / LIMIT)} onChange={(_, v) => setPage(v)} shape="rounded" />
				</Stack>
			)}
		</div>
	);
};

export default MyOrders;
