import { format } from 'date-fns';

// Compact counters for cards: 1234 -> 1.2k, 1500000 -> 1.5M
export const compactCount = (n: number | undefined | null): string => {
	const v = Number(n ?? 0);
	if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
	if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
	return String(v);
};

export const timeAgo = (date: string | Date | undefined, now = Date.now()): string => {
	if (!date) return '';
	const diff = Math.max(0, now - new Date(date).getTime());
	const m = Math.floor(diff / 60000);
	if (m < 1) return 'just now';
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d}d ago`;
	const mo = Math.floor(d / 30);
	if (mo < 12) return `${mo}mo ago`;
	return `${Math.floor(mo / 12)}y ago`;
};

// Dates are rendered in the site's timezone on both server and client, so SSR
// output hydrates cleanly whatever the visitor's or the container's TZ is.
export const SITE_TIME_ZONE = 'Asia/Seoul';

const zonedParts = new Intl.DateTimeFormat('en-US', {
	timeZone: SITE_TIME_ZONE,
	hourCycle: 'h23',
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
});

// A Date whose local getters return the wall-clock time in SITE_TIME_ZONE.
export const toSiteTime = (value: string | number | Date): Date => {
	const date = new Date(value);
	const p: Record<string, number> = {};
	for (const { type, value: v } of zonedParts.formatToParts(date)) if (type !== 'literal') p[type] = Number(v);
	return new Date(p.year, p.month - 1, p.day, p.hour, p.minute, p.second, date.getMilliseconds());
};

export const formatDate = (value: string | number | Date | undefined | null, pattern: string): string => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return format(toSiteTime(date), pattern);
};
