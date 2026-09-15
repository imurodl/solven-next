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
