import React, { useEffect, useState } from 'react';
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
	telegramBotId?: string;
}

interface OAuthButtonsProps {
	mode?: 'login' | 'link';
	onLinked?: () => void;
	linked?: { google?: boolean; telegram?: boolean };
	referrer?: string;
}

declare global {
	interface Window {
		Telegram?: {
			Login?: {
				auth: (options: { bot_id: string; request_access?: string; lang?: string }, callback: (user: Record<string, unknown> | false) => void) => void;
			};
		};
	}
}

const TELEGRAM_WIDGET_SRC = 'https://telegram.org/js/telegram-widget.js?22';

// Loads Telegram's widget script once, without the data-* attributes: the
// embedded button would eval its data-onauth handler, which the CSP forbids,
// so the popup API (Telegram.Login.auth) is used from our own button instead.
const loadTelegramWidget = (): Promise<void> =>
	new Promise((resolve, reject) => {
		if (window.Telegram?.Login) return resolve();
		const existing = document.querySelector<HTMLScriptElement>(`script[src="${TELEGRAM_WIDGET_SRC}"]`);
		const script = existing ?? document.createElement('script');
		script.addEventListener('load', () => resolve());
		script.addEventListener('error', () => reject(new Error('Telegram widget failed to load')));
		if (!existing) {
			script.src = TELEGRAM_WIDGET_SRC;
			script.async = true;
			document.head.appendChild(script);
		}
	});

// Google (redirect) and Telegram (popup) buttons. In "link" mode the same
// buttons attach the provider to the signed-in account.
const OAuthButtons = ({ mode = 'login', onLinked, linked, referrer }: OAuthButtonsProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [providers, setProviders] = useState<Providers | null>(null);

	useEffect(() => {
		fetch(`${API_AUTH_URL}/auth/providers`)
			.then((r) => r.json())
			.then((p) => setProviders(p))
			.catch(() => setProviders({ google: false, telegram: false }));
	}, []);

	const [tgBusy, setTgBusy] = useState(false);

	const telegramLogin = async () => {
		if (!providers?.telegramBotId || tgBusy) return;
		setTgBusy(true);
		try {
			await loadTelegramWidget();
			window.Telegram?.Login?.auth({ bot_id: providers.telegramBotId, request_access: 'write', lang: router.locale }, async (user) => {
				try {
					if (!user) return;
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
				} finally {
					setTgBusy(false);
				}
			});
		} catch (err: any) {
			setTgBusy(false);
			await sweetMixinErrorAlert(err.message);
		}
	};

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
			{providers.telegram && providers.telegramBotId && (
				<Button className="oauth-btn telegram" onClick={telegramLogin} fullWidth disabled={tgBusy || (mode === 'link' && linked?.telegram)}>
					<svg width="18" height="18" viewBox="0 0 240 240" aria-hidden="true">
						<circle cx="120" cy="120" r="120" fill="#2AABEE" />
						<path
							fill="#fff"
							d="M54 118c35-15 58-25 70-30 33-14 40-16 45-16 1 0 3 0 5 2 1 1 1 3 1 4v3c-2 19-10 65-14 86-2 9-5 12-8 12-7 1-12-4-19-9l-27-18c-12-8-4-13 3-20 2-2 33-30 33-33v-1h-1c-1 0-24 15-69 45-7 5-13 7-18 7-6 0-17-3-26-6-10-3-18-5-17-11 0-3 5-6 13-9z"
						/>
					</svg>
					{mode === 'link' ? (linked?.telegram ? t('Telegram linked') : t('Link Telegram')) : t('Continue with Telegram')}
				</Button>
			)}
		</Stack>
	);
};

export default OAuthButtons;
