import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';
import { GET_RECENT_ACTIVITY } from '../../../apollo/user/query';
import { REACT_APP_API_URL } from '../../config';
import { timeAgo } from '../../utils/format';

interface ActivityItem {
	type: string;
	title: string;
	subtitle?: string;
	carId?: string;
	image?: string;
	rating?: number;
	createdAt: string;
}

const SHOW_MS = 7000;
const GAP_MS = 22000;
const DISMISS_KEY = 'slv_proof_dismissed';

// Rotates through REAL recent activity (reservations, reviews, new listings).
// Nothing is fabricated: the list comes from the API and buyers stay anonymous.
const SocialProofToast = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [index, setIndex] = useState(-1);
	const [visible, setVisible] = useState(false);
	const [dismissed, setDismissed] = useState(true);
	const { data } = useQuery(GET_RECENT_ACTIVITY, { variables: { limit: 12 }, fetchPolicy: 'cache-first' });
	const items: ActivityItem[] = data?.getRecentActivity ?? [];

	useEffect(() => {
		try {
			setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1');
		} catch {
			setDismissed(false);
		}
	}, []);

	useEffect(() => {
		if (dismissed || !items.length) return;
		let showTimer: ReturnType<typeof setTimeout>;
		let hideTimer: ReturnType<typeof setTimeout>;
		let i = 0;
		const cycle = () => {
			setIndex(i % items.length);
			setVisible(true);
			hideTimer = setTimeout(() => setVisible(false), SHOW_MS);
			i += 1;
			showTimer = setTimeout(cycle, SHOW_MS + GAP_MS);
		};
		showTimer = setTimeout(cycle, 9000);
		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	}, [items.length, dismissed]);

	if (dismissed || index < 0 || !items[index]) return null;
	const item = items[index];

	const dismiss = () => {
		setDismissed(true);
		try {
			sessionStorage.setItem(DISMISS_KEY, '1');
		} catch {
			// ignore
		}
	};

	return (
		<div className={`social-proof ${visible ? 'show' : ''}`} role="status">
			<div className="body" onClick={() => item.carId && router.push({ pathname: '/car/detail', query: { id: item.carId } })}>
				{item.image ? <img src={`${REACT_APP_API_URL}/${item.image}`} alt="" /> : <div className="ph" />}
				<div>
					<span className="sub">{item.subtitle}</span>
					<b>{item.title}</b>
					<span className="time">
						{item.rating ? `${'★'.repeat(item.rating)} · ` : ''}
						{timeAgo(item.createdAt)}
					</span>
				</div>
			</div>
			<button className="close" onClick={dismiss} aria-label={t('Close') as string}>
				<CloseIcon fontSize="small" />
			</button>
		</div>
	);
};

export default SocialProofToast;
