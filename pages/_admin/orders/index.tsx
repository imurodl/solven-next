import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Box, Button, Chip, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminTable, { Column } from '../../../libs/components/admin/shared/AdminTable';
import { GET_ALL_ORDERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_ORDER_STATUS_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Order } from '../../../libs/types/order/order';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { sweetErrorHandlingForAdmin, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../../libs/config';

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
	PENDING: 'warning',
	ACCEPTED: 'info',
	PAID: 'info',
	DELIVERED: 'info',
	COMPLETED: 'success',
	CANCELLED: 'error',
	RETURN_REQUESTED: 'error',
	RETURNED: 'default',
};

const AdminOrders: NextPage = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [status, setStatus] = useState<string>('');
	const { data, loading, refetch } = useQuery(GET_ALL_ORDERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: { page: page + 1, limit: rowsPerPage, search: status ? { orderStatus: status } : {} } },
	});
	const [updateStatus] = useMutation(UPDATE_ORDER_STATUS_BY_ADMIN);
	const orders: Order[] = data?.getAllOrdersByAdmin?.list ?? [];
	const total: number = data?.getAllOrdersByAdmin?.metaCounter?.[0]?.total ?? 0;

	const changeStatus = async (order: Order, next: OrderStatus) => {
		try {
			const res = await Swal.fire({
				title: `Set ${order.orderId} to ${next}?`,
				input: next === OrderStatus.CANCELLED ? 'textarea' : undefined,
				inputPlaceholder: 'Reason (optional)',
				showCancelButton: true,
			});
			if (!res.isConfirmed) return;
			await updateStatus({ variables: { input: { _id: order._id, orderStatus: next, reason: res.value || undefined } } });
			await refetch();
			await sweetMixinSuccessAlert('Order updated');
		} catch (err) {
			await sweetErrorHandlingForAdmin(err);
		}
	};

	const columns: Column<Order>[] = [
		{ key: 'id', label: 'Order', width: 150, render: (o) => <b>{o.orderId}</b> },
		{
			key: 'car',
			label: 'Car',
			render: (o) => (
				<Stack direction="row" spacing={1} alignItems="center">
					{o.carSnapshot.carImage && <img src={`${REACT_APP_API_URL}/${o.carSnapshot.carImage}`} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
					<span>{o.carSnapshot.carTitle}</span>
				</Stack>
			),
		},
		{ key: 'buyer', label: 'Buyer', render: (o) => o.memberData?.memberNick ?? '-' },
		{ key: 'seller', label: 'Seller', render: (o) => o.sellerData?.memberNick ?? '-' },
		{ key: 'total', label: 'Total / Deposit', render: (o) => `$${o.orderTotal.toLocaleString()} / $${o.orderDeposit.toLocaleString()}` },
		{ key: 'method', label: 'Handover', render: (o) => `${o.deliveryMethod}${o.deliveryInfo?.city ? ` · ${o.deliveryInfo.city}` : ''}` },
		{ key: 'status', label: 'Status', render: (o) => <Chip size="small" label={o.orderStatus} color={STATUS_COLORS[o.orderStatus] || 'default'} /> },
		{ key: 'date', label: 'Created', render: (o) => new Date(o.createdAt).toLocaleDateString() },
		{
			key: 'actions',
			label: 'Set status',
			width: 180,
			render: (o) => (
				<Select size="small" value="" displayEmpty onChange={(e) => e.target.value && changeStatus(o, e.target.value as OrderStatus)} sx={{ minWidth: 150 }}>
					<MenuItem value="">Change...</MenuItem>
					{Object.values(OrderStatus)
						.filter((s) => s !== o.orderStatus)
						.map((s) => (
							<MenuItem key={s} value={s}>
								{s}
							</MenuItem>
						))}
				</Select>
			),
		},
	];

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Orders</Typography>
				<Stack direction="row" spacing={1} alignItems="center">
					<Select size="small" value={status} displayEmpty onChange={(e) => { setStatus(String(e.target.value)); setPage(0); }} sx={{ minWidth: 180 }}>
						<MenuItem value="">All statuses</MenuItem>
						{Object.values(OrderStatus).map((s) => (
							<MenuItem key={s} value={s}>
								{s}
							</MenuItem>
						))}
					</Select>
					<Button variant="outlined" onClick={() => refetch()}>
						Refresh
					</Button>
				</Stack>
			</Box>
			<AdminTable columns={columns} rows={orders} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }} loading={loading} rowKey={(o) => o._id} emptyText="No orders" />
		</Box>
	);
};

export default withAdminLayout(AdminOrders);
