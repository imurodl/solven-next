import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { light, dark } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import SEO from '../libs/components/SEO';
import ErrorBoundary from '../libs/components/ErrorBoundary';
import { DeviceContext } from '../libs/hooks/DeviceContext';
import { ThemeModeProvider, useThemeMode } from '../libs/context/ThemeContext';
import { CurrencyProvider } from '../libs/context/CurrencyContext';
import { loginWithTokens, restoreSession } from '../libs/auth';
import { sweetMixinErrorAlert } from '../libs/sweetAlert';
import Analytics from '../libs/components/common/Analytics';
import ErrorMonitoring from '../libs/components/common/ErrorMonitoring';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

// Private / transactional pages must not be indexed.
const NOINDEX_PATHS = new Set(['/account/join', '/checkout', '/mypage', '/order/tracking', '/_admin']);

const App = ({ Component, pageProps }: AppProps) => {
	const { mode } = useThemeMode();
	const theme = useMemo(() => createTheme((mode === 'dark' ? dark : light) as any), [mode]);
	const client = useApollo(pageProps.initialApolloState);
	const router = useRouter();

	// Restore the session once, then re-check whenever the tab regains focus
	// (another tab may have logged out, or the token may have expired meanwhile).
	useEffect(() => {
		restoreSession();
		const onVisible = () => {
			if (document.visibilityState === 'visible') restoreSession();
		};
		document.addEventListener('visibilitychange', onVisible);
		return () => document.removeEventListener('visibilitychange', onVisible);
	}, []);

	// OAuth redirects land with ?token=&refresh= (or ?error=). Consume once and strip.
	useEffect(() => {
		if (!router.isReady) return;
		const { token, refresh, error, ...rest } = router.query;
		if (typeof error === 'string' && error) {
			sweetMixinErrorAlert(error).then();
			router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
			return;
		}
		if (typeof token === 'string' && token) {
			loginWithTokens(token, typeof refresh === 'string' ? refresh : undefined).then(() => {
				router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
			});
		}
	}, [router.isReady, router.query.token, router.query.error]);

	const noindex = Array.from(NOINDEX_PATHS).some((p) => router.pathname.startsWith(p));

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<CurrencyProvider>
					<DeviceContext.Provider value={pageProps.deviceType}>
						<SEO noindex={noindex} />
						<Analytics />
						<ErrorMonitoring />
						<ErrorBoundary>
							<Component {...pageProps} />
						</ErrorBoundary>
					</DeviceContext.Provider>
				</CurrencyProvider>
			</ThemeProvider>
		</ApolloProvider>
	);
};

const AppWithTheme = (props: AppProps) => (
	<ThemeModeProvider>
		<App {...props} />
	</ThemeModeProvider>
);

export default appWithTranslation(AppWithTheme);
