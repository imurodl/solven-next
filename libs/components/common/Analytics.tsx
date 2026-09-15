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

	return (
		<>
			{GA_MEASUREMENT_ID && (
				<>
					<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
					<Script id="ga4-init" strategy="afterInteractive">
						{`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_MEASUREMENT_ID}');window.gtag = gtag;`}
					</Script>
				</>
			)}
			{YANDEX_METRICA_ID && (
				<Script id="ym-init" strategy="afterInteractive">
					{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");window.ym(${YANDEX_METRICA_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });`}
				</Script>
			)}
		</>
	);
};

export default Analytics;
