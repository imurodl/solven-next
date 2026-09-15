import React from 'react';
import { useTranslation } from 'next-i18next';
import { OrderStatus } from '../../enums/order.enum';
import { Order } from '../../types/order/order';

const MAIN_STEPS: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PAID, OrderStatus.DELIVERED, OrderStatus.COMPLETED];

const TERMINAL: Partial<Record<OrderStatus, string>> = {
	[OrderStatus.CANCELLED]: 'cancelled',
	[OrderStatus.RETURN_REQUESTED]: 'returned',
	[OrderStatus.RETURNED]: 'returned',
};

// Horizontal progress of a deal. Terminal states (cancelled / returned) are
// shown as a coloured banner instead of a step.
const OrderTimeline = ({ order }: { order: Order }) => {
	const { t } = useTranslation('common');
	const terminal = TERMINAL[order.orderStatus];
	const currentIndex = MAIN_STEPS.indexOf(order.orderStatus);
	const dates: Partial<Record<OrderStatus, string | undefined>> = {
		[OrderStatus.PENDING]: order.createdAt,
		[OrderStatus.ACCEPTED]: order.acceptedAt,
		[OrderStatus.PAID]: order.paidAt,
		[OrderStatus.DELIVERED]: order.deliveredAt,
		[OrderStatus.COMPLETED]: order.completedAt,
	};

	return (
		<div className="order-timeline">
			{terminal && <div className={`terminal ${terminal}`}>{t(`order.status.${order.orderStatus}`)}</div>}
			<div className={`steps ${terminal ? 'dimmed' : ''}`}>
				{MAIN_STEPS.map((s, i) => {
					const done = currentIndex > i || order.orderStatus === OrderStatus.COMPLETED || (terminal === 'returned' && i <= 4);
					const active = currentIndex === i && !terminal;
					const when = dates[s];
					return (
						<div key={s} className={`step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
							<span className="dot" />
							<span className="label">{t(`order.step.${s}`)}</span>
							{when && <span className="when">{new Date(when).toLocaleDateString()}</span>}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default OrderTimeline;
