import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import SEO from '../libs/components/SEO';
import ErrorBoundary from '../libs/components/ErrorBoundary';
import { DeviceContext } from '../libs/hooks/DeviceContext';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	const [theme, setTheme] = useState(createTheme(light as any));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<DeviceContext.Provider value={pageProps.deviceType}>
					<SEO />
					<ErrorBoundary>
						<Component {...pageProps} />
					</ErrorBoundary>
				</DeviceContext.Provider>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
