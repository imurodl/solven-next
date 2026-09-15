import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { API_AUTH_URL } from '../../config';
import { getJwtToken, loginWithTokens } from '../../auth';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface Providers {
	google: boolean;
	telegram: boolean;
	telegramBot?: string;
}

interface OAuthButtonsProps {
	mode?: 'login' | 'link';
	onLinked?: () => void;
	linked?: { google?: boolean; telegram?: boolean };
	referrer?: string;
}

declare global {
	interface Window {
		onTelegramAuth?: (user: Record<string, unknown>) => void;
	}
}

// Google (redirect) and Telegram (login widget) buttons. In "link" mode the
// same buttons attach the provider to the signed-in account.
const OAuthButtons = ({ mode = 'login', onLinked, linked, referrer }: OAuthButtonsProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [providers, setProviders] = useState<Providers | null>(null);
	const tgRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch(`${API_AUTH_URL}/auth/providers`)
			.then((r) => r.json())
			.then((p) => setProviders(p))
			.catch(() => setProviders({ google: false, telegram: false }));
	}, []);

	// Telegram widget: injects an iframe button that calls window.onTelegramAuth.
	useEffect(() => {
		if (!providers?.telegram || !providers.telegramBot || !tgRef.current) return;
		if (mode === 'link' && linked?.telegram) return;
		window.onTelegramAuth = async (user) => {
			try {
				const endpoint = mode === 'link' ? `${API_AUTH_URL}/auth/link/telegram` : `${API_AUTH_URL}/auth/telegram`;
				const res = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', ...(mode === 'link' ? { Authorization: `Bearer ${getJwtToken()}` } : {}) },
					body: JSON.stringify(user),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data?.message || 'Telegram login failed');
				await loginWithTokens(data.token, data.refresh);
				if (mode === 'link') {
					await sweetTopSmallSuccessAlert(t('Telegram linked'), 1200);
					onLinked?.();
				} else {
					window.location.href = referrer || '/';
				}
			} catch (err: any) {
				await sweetMixinErrorAlert(err.message);
			}
		};
		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-widget.js?22';
		script.async = true;
		script.setAttribute('data-telegram-login', providers.telegramBot);
		script.setAttribute('data-size', 'large');
		script.setAttribute('data-radius', '10');
		script.setAttribute('data-onauth', 'onTelegramAuth(user)');
		script.setAttribute('data-request-access', 'write');
		tgRef.current.innerHTML = '';
		tgRef.current.appendChild(script);
		return () => {
			window.onTelegramAuth = undefined;
		};
	}, [providers, mode, linked?.telegram]);

	if (!providers || (!providers.google && !providers.telegram)) return null;

	const googleHref =
		mode === 'link' ? `${API_AUTH_URL}/auth/link/google?token=${encodeURIComponent(getJwtToken())}` : `${API_AUTH_URL}/auth/google`;

	return (
		<Stack className="oauth-buttons" spacing={1.5}>
			{mode === 'login' && (
				<Typography className="divider-text">
					<span>{t('or continue with')}</span>
				</Typography>
			)}
			{providers.google && (
				<Button className="oauth-btn google" href={googleHref} fullWidth disabled={mode === 'link' && linked?.google}>
					<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
						<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6C12.3 13.6 17.7 9.5 24 9.5z" />
						<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
						<path fill="#FBBC05" d="M10.4 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.7l7.8-6z" />
						<path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.4-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-7.9 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6C6.5 42.6 14.6 48 24 48z" />
					</svg>
					{mode === 'link' ? (linked?.google ? t('Google linked') : t('Link Google')) : t('Continue with Google')}
				</Button>
			)}
			{providers.telegram && providers.telegramBot && (
				<div className="telegram-slot">
					{mode === 'link' && linked?.telegram ? (
						<Button className="oauth-btn telegram" disabled fullWidth>
							{t('Telegram linked')}
						</Button>
					) : (
						<div ref={tgRef} className="telegram-widget" />
					)}
				</div>
			)}
		</Stack>
	);
};

export default OAuthButtons;
