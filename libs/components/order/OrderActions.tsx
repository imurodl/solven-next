import React from 'react';
import { Button, Stack } from '@mui/material';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { userVar } from '../../../apollo/store';
import { Order } from '../../types/order/order';
import { OrderStatus } from '../../enums/order.enum';
import { MemberType } from '../../enums/member.enum';
import { CANCEL_ORDER, CONFIRM_ORDER, MARK_ORDER_DELIVERED, PAY_ORDER_DEPOSIT, REQUEST_RETURN, RESPOND_ORDER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface OrderActionsProps {
	order: Order;
	onChanged?: () => void;
	compact?: boolean;
}

// Role/status-aware action buttons for a deal. Server enforces every transition;
// this only decides what to show.
const OrderActions = ({ order, onChanged, compact = false }: OrderActionsProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const isBuyer = user._id === order.memberId;
	const isSeller = user._id === order.sellerId || user.memberType === MemberType.ADMIN;
	const s = order.orderStatus;

	const [respond] = useMutation(RESPOND_ORDER);
	const [pay] = useMutation(PAY_ORDER_DEPOSIT);
	const [deliver] = useMutation(MARK_ORDER_DELIVERED);
	const [confirm] = useMutation(CONFIRM_ORDER);
	const [cancel] = useMutation(CANCEL_ORDER);
	const [ret] = useMutation(REQUEST_RETURN);

	const run = async (fn: () => Promise<unknown>, successMsg: string) => {
		try {
			await fn();
			await sweetTopSmallSuccessAlert(successMsg, 1200);
			onChanged?.();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	const askReason = async (title: string): Promise<string | null> => {
		const res = await Swal.fire({
			title,
			input: 'textarea',
			inputAttributes: { maxlength: '500' },
			showCancelButton: true,
			confirmButtonText: t('Confirm') as string,
			cancelButtonText: t('Cancel') as string,
		});
		if (!res.isConfirmed) return null;
		return String(res.value || '');
	};

	const buttons: React.ReactNode[] = [];

	if (isSeller && s === OrderStatus.PENDING) {
		buttons.push(
			<Button key="accept" className="btn-primary" variant="contained" onClick={() => run(() => respond({ variables: { orderId: order._id, accept: true } }), t('Deal accepted'))}>
				{t('Accept')}
			</Button>,
			<Button
				key="decline"
				className="btn-outline danger"
				onClick={async () => {
					const reason = await askReason(t('Reason for declining'));
					if (reason === null) return;
					await run(() => respond({ variables: { orderId: order._id, accept: false, reason } }), t('Deal declined'));
				}}
			>
				{t('Decline')}
			</Button>,
		);
	}
	if (isBuyer && s === OrderStatus.ACCEPTED) {
		buttons.push(
			<Button key="pay" className="btn-primary" variant="contained" onClick={() => run(() => pay({ variables: { orderId: order._id } }), t('Deposit paid'))}>
				{t('Pay deposit')}
			</Button>,
		);
	}
	if (isSeller && s === OrderStatus.PAID) {
		buttons.push(
			<Button key="deliver" className="btn-primary" variant="contained" onClick={() => run(() => deliver({ variables: { orderId: order._id } }), t('Marked as ready'))}>
				{t('Mark as ready / delivered')}
			</Button>,
		);
	}
	if (isBuyer && s === OrderStatus.DELIVERED) {
		buttons.push(
			<Button
				key="confirm"
				className="btn-primary"
				variant="contained"
				onClick={async () => {
					const res = await Swal.fire({
						title: t('Confirm you received the car?') as string,
						text: t('This completes the deal and marks the car as sold.') as string,
						showCancelButton: true,
						confirmButtonText: t('Confirm') as string,
						cancelButtonText: t('Cancel') as string,
					});
					if (!res.isConfirmed) return;
					await run(() => confirm({ variables: { orderId: order._id } }), t('Deal completed'));
				}}
			>
				{t('Confirm receipt')}
			</Button>,
		);
	}
	const buyerCanCancel = isBuyer && [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(s);
	const sellerCanCancel = isSeller && !isBuyer && [OrderStatus.ACCEPTED, OrderStatus.PAID].includes(s);
	if (buyerCanCancel || sellerCanCancel) {
		buttons.push(
			<Button
				key="cancel"
				className="btn-outline danger"
				onClick={async () => {
					const reason = await askReason(t('Reason for cancelling'));
					if (reason === null) return;
					await run(() => cancel({ variables: { orderId: order._id, reason } }), t('Order cancelled'));
				}}
			>
				{t('Cancel order')}
			</Button>,
		);
	}
	if (isBuyer && s === OrderStatus.COMPLETED) {
		if (!order.reviewed) {
			buttons.push(
				<Button key="review" className="btn-primary" variant="contained" onClick={() => router.push({ pathname: '/car/detail', query: { id: order.carId } })}>
					{t('Write a review')}
				</Button>,
			);
		}
		const withinWindow = order.completedAt && Date.now() - new Date(order.completedAt).getTime() < 7 * 86400000;
		if (withinWindow) {
			buttons.push(
				<Button
					key="return"
					className="btn-outline"
					onClick={async () => {
						const reason = await askReason(t('Reason for return'));
						if (reason === null) return;
						await run(() => ret({ variables: { orderId: order._id, reason } }), t('Return requested'));
					}}
				>
					{t('Request return')}
				</Button>,
			);
		}
	}

	if (!buttons.length) return null;
	return (
		<Stack direction="row" spacing={1} flexWrap="wrap" className={`order-actions ${compact ? 'compact' : ''}`}>
			{buttons}
		</Stack>
	);
};

export default OrderActions;
