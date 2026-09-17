import React, { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const YANDEX_METRICA_ID = process.env.NEXT_PUBLIC_YM_ID || '';

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
		ym?: (id: number, action: string, params?: Record<string, unknown>) => void;
	}
}

// Nothing loads unless an ID is configured, so local/staging stays untracked.
const Analytics = () => {
	const router = useRouter();

	useEffect(() => {
		if (!GA_MEASUREMENT_ID && !YANDEX_METRICA_ID) return;
		const handleRouteChange = (url: string) => {
			if (GA_MEASUREMENT_ID && typeof window.gtag === 'function') window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
			if (YANDEX_METRICA_ID && typeof window.ym === 'function') window.ym(Number(YANDEX_METRICA_ID), 'hit', { title: url });
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => router.events.off('routeChangeComplete', handleRouteChange);
	}, [router.events]);

	if (!GA_MEASUREMENT_ID && !YANDEX_METRICA_ID) return null;

	return <Script src="/analytics.js" strategy="afterInteractive" data-ga={GA_MEASUREMENT_ID || undefined} data-ym={YANDEX_METRICA_ID || undefined} />;
};

export default Analytics;
