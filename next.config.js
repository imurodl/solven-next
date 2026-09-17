const crypto = require('crypto');
const { THEME_BOOT_SCRIPT } = require('./libs/security/inline-scripts');

const isProd = process.env.NODE_ENV === 'production';
const sha256 = (source) => `'sha256-${crypto.createHash('sha256').update(source).digest('base64')}'`;

// Origins of the API this build talks to (GraphQL, uploads, WebSocket).
const apiOrigins = [process.env.REACT_APP_API_URL, process.env.REACT_APP_API_GRAPHQL_URL, process.env.REACT_APP_API_WS]
	.filter(Boolean)
	.map((url) => {
		try {
			return new URL(url).origin;
		} catch {
			return null;
		}
	})
	.filter((origin, i, all) => origin && all.indexOf(origin) === i);

// Content-Security-Policy for solven.uz. Third parties that must keep working:
// Google Analytics + Yandex Metrica (public/analytics.js), the Telegram login
// widget (script + iframe), Google Fonts, model-viewer's Draco/Basis decoders
// (gstatic, wasm, blob workers), Toast UI article embeds (YouTube iframes,
// images from anywhere), Sentry envelopes and the exchange-rate API. Inline
// styles stay allowed for emotion/MUI; the only inline script is hashed.
const CSP = [
	"default-src 'self'",
	[
		"script-src 'self'",
		sha256(THEME_BOOT_SCRIPT),
		"'wasm-unsafe-eval'",
		'https://www.googletagmanager.com https://mc.yandex.ru https://mc.yandex.com https://telegram.org https://www.gstatic.com',
		isProd ? '' : "'unsafe-eval' 'unsafe-inline'",
	].join(' '),
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
	"font-src 'self' data: https://fonts.gstatic.com",
	["img-src 'self' data: blob: https:", ...apiOrigins].join(' '),
	["media-src 'self' blob: https:", ...apiOrigins].join(' '),
	[
		"connect-src 'self' https://api.solven.uz wss://api.solven.uz wss://solven.uz",
		...apiOrigins,
		'https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com',
		'https://mc.yandex.ru https://mc.yandex.com https://*.sentry.io https://open.er-api.com https://www.gstatic.com https://cdn.jsdelivr.net',
		isProd ? '' : 'http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:*',
	].join(' '),
	'frame-src https://oauth.telegram.org https://www.youtube.com https://www.youtube-nocookie.com https://mc.yandex.ru https://mc.yandex.com',
	"worker-src 'self' blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'self'",
]
	.map((d) => d.trim())
	.join('; ');

const SECURITY_HEADERS = [
	{ key: 'Content-Security-Policy', value: CSP },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
	...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }] : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	async headers() {
		return [{ source: '/:path*', headers: SECURITY_HEADERS }];
	},
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
