import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Box, Button, Chip, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useMutation, useQuery } from '@apollo/client';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminTable, { Column } from '../../../libs/components/admin/shared/AdminTable';
import { GET_ALL_COUPONS_BY_ADMIN } from '../../../apollo/admin/query';
import { CREATE_COUPON, UPDATE_COUPON_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Coupon } from '../../../libs/types/coupon/coupon';
import { CouponStatus, CouponType } from '../../../libs/enums/coupon.enum';
import { sweetErrorHandlingForAdmin, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';

const AdminCoupons: NextPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({ couponCode: '', couponType: CouponType.PERCENT, couponValue: '10', maxUses: '0', minOrderAmount: '0', validUntil: '' });
	const { data, loading, refetch } = useQuery(GET_ALL_COUPONS_BY_ADMIN, { fetchPolicy: 'network-only' });
	const [createCoupon] = useMutation(CREATE_COUPON);
	const [updateCoupon] = useMutation(UPDATE_COUPON_BY_ADMIN);
	const coupons: Coupon[] = data?.getAllCouponsByAdmin ?? [];

	const submit = async () => {
		try {
			await createCoupon({
				variables: {
					input: {
						couponCode: form.couponCode.trim().toUpperCase(),
						couponType: form.couponType,
						couponValue: Number(form.couponValue),
						maxUses: Number(form.maxUses) || 0,
						minOrderAmount: Number(form.minOrderAmount) || 0,
						validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : undefined,
					},
				},
			});
			setShowForm(false);
			setForm({ couponCode: '', couponType: CouponType.PERCENT, couponValue: '10', maxUses: '0', minOrderAmount: '0', validUntil: '' });
			await refetch();
			await sweetMixinSuccessAlert('Coupon created');
		} catch (err) {
			await sweetErrorHandlingForAdmin(err);
		}
	};

	const toggle = async (c: Coupon) => {
		try {
			await updateCoupon({ variables: { input: { _id: c._id, couponStatus: c.couponStatus === CouponStatus.ACTIVE ? CouponStatus.PAUSED : CouponStatus.ACTIVE } } });
			await refetch();
		} catch (err) {
			await sweetErrorHandlingForAdmin(err);
		}
	};

	const columns: Column<Coupon>[] = [
		{ key: 'code', label: 'Code', render: (c) => <b>{c.couponCode}</b> },
		{ key: 'value', label: 'Discount', render: (c) => (c.couponType === CouponType.PERCENT ? `${c.couponValue}%` : `$${c.couponValue}`) },
		{ key: 'uses', label: 'Uses', render: (c) => `${c.usedCount} / ${c.maxUses || '∞'}` },
		{ key: 'min', label: 'Min order', render: (c) => (c.minOrderAmount ? `$${c.minOrderAmount.toLocaleString()}` : '-') },
		{ key: 'until', label: 'Valid until', render: (c) => (c.validUntil ? new Date(c.validUntil).toLocaleDateString() : '-') },
		{ key: 'status', label: 'Status', render: (c) => <Chip size="small" label={c.couponStatus} color={c.couponStatus === CouponStatus.ACTIVE ? 'success' : 'default'} /> },
		{
			key: 'actions',
			label: '',
			render: (c) => (
				<Button size="small" variant="outlined" onClick={() => toggle(c)}>
					{c.couponStatus === CouponStatus.ACTIVE ? 'Pause' : 'Activate'}
				</Button>
			),
		},
	];

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Coupons</Typography>
				{!showForm && (
					<Button className="btn_add" variant={'contained'} size={'medium'} onClick={() => setShowForm(true)}>
						<AddRoundedIcon sx={{ mr: '8px' }} />
						ADD COUPON
					</Button>
				)}
			</Box>
			{showForm && (
				<Stack className="admin-form" direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 3, p: 2, background: 'var(--surface)', borderRadius: 2, gap: 2 }}>
					<TextField label="Code" size="small" value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })} />
					<Select size="small" value={form.couponType} onChange={(e) => setForm({ ...form, couponType: e.target.value as CouponType })}>
						<MenuItem value={CouponType.PERCENT}>Percent</MenuItem>
						<MenuItem value={CouponType.FIXED}>Fixed (USD)</MenuItem>
					</Select>
					<TextField label="Value" size="small" type="number" value={form.couponValue} onChange={(e) => setForm({ ...form, couponValue: e.target.value })} />
					<TextField label="Max uses (0 = unlimited)" size="small" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
					<TextField label="Min order (USD)" size="small" type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
					<TextField label="Valid until" size="small" type="date" InputLabelProps={{ shrink: true }} value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
					<Button variant="contained" onClick={submit} disabled={form.couponCode.trim().length < 3 || !Number(form.couponValue)}>
						Create
					</Button>
					<Button variant="text" onClick={() => setShowForm(false)}>
						Cancel
					</Button>
				</Stack>
			)}
			<AdminTable columns={columns} rows={coupons} total={coupons.length} page={0} rowsPerPage={100} onPageChange={() => {}} onRowsPerPageChange={() => {}} loading={loading} rowKey={(c) => c._id} emptyText="No coupons" />
		</Box>
	);
};

export default withAdminLayout(AdminCoupons);
