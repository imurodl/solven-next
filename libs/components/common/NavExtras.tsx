import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Badge, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { CaretDown } from 'phosphor-react';
import { useTranslation } from 'next-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { CURRENCY_LIST, CURRENCY_SYMBOL, useCurrency } from '../../context/CurrencyContext';
import { activeOrderVar, socketVar, unreadMessagesVar, userVar } from '../../../apollo/store';
import { GET_MY_ACTIVE_ORDER, GET_UNREAD_MESSAGE_COUNT } from '../../../apollo/user/query';
import { ACTIVE_ORDER_STATUSES } from '../../enums/order.enum';

interface NavExtrasProps {
	compact?: boolean; // mobile: icons only
}

// Theme toggle, currency switcher, unread-messages badge and the active-order
// pill. Shared by Top (home) and TopBasic (inner pages), desktop and mobile.
const NavExtras = ({ compact = false }: NavExtrasProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const unread = useReactiveVar(unreadMessagesVar);
	const activeOrder = useReactiveVar(activeOrderVar);
	const { mode, toggleMode } = useThemeMode();
	const { currency, setCurrency } = useCurrency();
	const [currencyAnchor, setCurrencyAnchor] = useState<null | HTMLElement>(null);

	const { refetch: refetchUnread } = useQuery(GET_UNREAD_MESSAGE_COUNT, {
		skip: !user?._id,
		fetchPolicy: 'network-only',
		pollInterval: 60000,
		onCompleted: (data) => unreadMessagesVar(data?.getUnreadMessageCount ?? 0),
	});

	const { refetch: refetchOrder } = useQuery(GET_MY_ACTIVE_ORDER, {
		skip: !user?._id,
		fetchPolicy: 'network-only',
		onCompleted: (data) => {
			const o = data?.getMyActiveOrder;
			activeOrderVar(
				o && ACTIVE_ORDER_STATUSES.includes(o.orderStatus)
					? { _id: o._id, orderId: o.orderId, orderStatus: o.orderStatus, carTitle: o.carSnapshot?.carTitle }
					: null,
			);
		},
	});

	// Live updates: 'dm' and 'order' events are pushed by the gateway to the member.
	useEffect(() => {
		if (!socket || !user?._id) return;
		const onMessage = (msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data);
				if (data.event === 'dm') refetchUnread();
				if (data.event === 'order') refetchOrder();
			} catch {
				// ignore non-JSON frames
			}
		};
		socket.addEventListener('message', onMessage);
		return () => socket.removeEventListener('message', onMessage);
	}, [socket, user?._id, refetchUnread, refetchOrder]);

	useEffect(() => {
		if (!user?._id) {
			unreadMessagesVar(0);
			activeOrderVar(null);
		}
	}, [user?._id]);

	return (
		<div className={`nav-extras ${compact ? 'compact' : ''}`}>
			{user?._id && activeOrder && !compact && (
				<Link href={`/order/tracking?id=${activeOrder._id}`}>
					<div className="active-order-pill" title={activeOrder.carTitle}>
						<LocalShippingOutlinedIcon fontSize="small" />
						<span>{t(`order.status.${activeOrder.orderStatus}`)}</span>
					</div>
				</Link>
			)}
			{user?._id && (
				<Tooltip title={t('Messages') as string}>
					<IconButton
						size="small"
						className="nav-icon-btn"
						aria-label="Open messages"
						onClick={() => router.push({ pathname: '/mypage', query: { category: 'messages' } })}
					>
						<Badge color="error" badgeContent={unread} max={99} invisible={!unread}>
							<ChatBubbleOutlineIcon fontSize="small" />
						</Badge>
					</IconButton>
				</Tooltip>
			)}
			<Tooltip title={(mode === 'dark' ? t('Light mode') : t('Dark mode')) as string}>
				<IconButton size="small" className="nav-icon-btn" aria-label="Toggle dark mode" onClick={toggleMode}>
					{mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
				</IconButton>
			</Tooltip>
			<button className="btn-currency" onClick={(e) => setCurrencyAnchor(e.currentTarget)} aria-label="Change currency">
				<span>{CURRENCY_SYMBOL[currency]}</span>
				<CaretDown size={12} weight="fill" />
			</button>
			<Menu anchorEl={currencyAnchor} open={Boolean(currencyAnchor)} onClose={() => setCurrencyAnchor(null)}>
				{CURRENCY_LIST.map((c) => (
					<MenuItem
						key={c}
						selected={c === currency}
						onClick={() => {
							setCurrency(c);
							setCurrencyAnchor(null);
						}}
					>
						<span style={{ width: 44, display: 'inline-block' }}>{CURRENCY_SYMBOL[c]}</span> {c}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
};

export default NavExtras;
