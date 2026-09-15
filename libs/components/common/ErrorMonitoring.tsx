import { useEffect } from 'react';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

// Lightweight client error reporting without a full SDK: forwards uncaught
// errors and rejections to Sentry's envelope endpoint. Inactive without a DSN.
const ErrorMonitoring = () => {
	useEffect(() => {
		if (!SENTRY_DSN) return;
		let endpoint: string | null = null;
		try {
			const url = new URL(SENTRY_DSN);
			const projectId = url.pathname.replace('/', '');
			endpoint = `${url.protocol}//${url.host}/api/${projectId}/store/?sentry_version=7&sentry_key=${url.username}`;
		} catch {
			return;
		}
		const send = (message: string, stack?: string) => {
			if (!endpoint) return;
			const body = {
				event_id: crypto.randomUUID?.().replace(/-/g, '') ?? String(Date.now()),
				timestamp: new Date().toISOString(),
				platform: 'javascript',
				level: 'error',
				environment: process.env.NODE_ENV,
				request: { url: window.location.href },
				exception: { values: [{ type: 'Error', value: message, stacktrace: stack ? { frames: [{ function: stack.slice(0, 500) }] } : undefined }] },
			};
			fetch(endpoint, { method: 'POST', body: JSON.stringify(body), keepalive: true }).catch(() => {});
		};
		const onError = (e: ErrorEvent) => send(e.message, e.error?.stack);
		const onRejection = (e: PromiseRejectionEvent) => send(String(e.reason?.message ?? e.reason), e.reason?.stack);
		window.addEventListener('error', onError);
		window.addEventListener('unhandledrejection', onRejection);
		return () => {
			window.removeEventListener('error', onError);
			window.removeEventListener('unhandledrejection', onRejection);
		};
	}, []);
	return null;
};

export default ErrorMonitoring;
