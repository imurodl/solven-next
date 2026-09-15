import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface CountdownProps {
	until?: Date | string | null;
	compact?: boolean;
	onExpire?: () => void;
}

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

// Live d/h/m/s until a hot deal ends. Renders nothing once expired.
const Countdown = ({ until, compact = false, onExpire }: CountdownProps) => {
	const { t } = useTranslation('common');
	const [now, setNow] = useState<number>(() => Date.now());

	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	if (!until) return null;
	const end = new Date(until).getTime();
	const diff = end - now;
	if (diff <= 0) {
		onExpire?.();
		return null;
	}
	const d = Math.floor(diff / 86400000);
	const h = Math.floor((diff % 86400000) / 3600000);
	const m = Math.floor((diff % 3600000) / 60000);
	const s = Math.floor((diff % 60000) / 1000);

	if (compact) {
		return (
			<span className="slv-countdown compact">
				{d > 0 ? `${d}d ` : ''}
				{pad(h)}:{pad(m)}:{pad(s)}
			</span>
		);
	}
	return (
		<div className="slv-countdown">
			{[
				[d, t('Days')],
				[h, t('Hours')],
				[m, t('Minutes')],
				[s, t('Seconds')],
			].map(([v, label], i) => (
				<React.Fragment key={String(label)}>
					<div className="unit">
						<b>{pad(Number(v))}</b>
						<span>{label}</span>
					</div>
					{i < 3 && <i className="sep">:</i>}
				</React.Fragment>
			))}
		</div>
	);
};

export default Countdown;
