/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ['@mui/material', '@mui/icons-material', 'phosphor-react'],
	},
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'api.solven.uz', pathname: '/**' },
			{ protocol: 'https', hostname: 'solven.uz', pathname: '/**' },
			// local development against a local API
			{ protocol: 'http', hostname: 'localhost', pathname: '/**' },
			{ protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
			// OAuth avatars (Google / Telegram)
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
			{ protocol: 'https', hostname: 't.me', pathname: '/**' },
		],
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
