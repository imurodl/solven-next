import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE_URL = 'https://solven.uz';
const SITE_NAME = 'Solven';
const DEFAULT_TITLE = 'Solven — Buy & Sell Cars in Korea';
const DEFAULT_DESCRIPTION =
	'Solven is a trusted car marketplace in South Korea. Browse new and used cars, compare prices, connect with verified agents, and find your perfect car.';
const DEFAULT_IMAGE = `${SITE_URL}/img/logo/solven.png`;

/**
 * Builds an absolute canonical URL from a path. Drops the bulky `input` filter
 * param (so list pages canonicalize to a clean URL) while keeping meaningful
 * identifiers like `id` / `agentId` / `articleCategory`.
 */
export const buildCanonicalUrl = (source: string): string => {
	const [pathOnly, queryString] = (source || '/').split('#')[0].split('?');
	let canonicalPath = pathOnly;
	if (queryString) {
		const params = new URLSearchParams(queryString);
		params.delete('input');
		const kept = params.toString();
		canonicalPath = kept ? `${pathOnly}?${kept}` : pathOnly;
	}
	return `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
};

interface SEOProps {
	title?: string;
	description?: string;
	image?: string;
	type?: 'website' | 'article' | 'product' | 'profile';
	noindex?: boolean;
	jsonLd?: Record<string, any> | Record<string, any>[];
	canonical?: string;
}

const SEO = ({ title, description, image, type = 'website', noindex = false, jsonLd, canonical }: SEOProps) => {
	const router = useRouter();
	const url = buildCanonicalUrl(canonical || router.asPath || '/');
	const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
	const desc = description || DEFAULT_DESCRIPTION;
	const img = image || DEFAULT_IMAGE;

	return (
		<Head>
			<title key="title">{fullTitle}</title>
			<meta name="description" content={desc} key="description" />
			<meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} key="robots" />
			<link rel="canonical" href={url} key="canonical" />

			<meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
			<meta property="og:type" content={type} key="og:type" />
			<meta property="og:title" content={fullTitle} key="og:title" />
			<meta property="og:description" content={desc} key="og:description" />
			<meta property="og:url" content={url} key="og:url" />
			<meta property="og:image" content={img} key="og:image" />

			<meta name="twitter:card" content="summary_large_image" key="twitter:card" />
			<meta name="twitter:title" content={fullTitle} key="twitter:title" />
			<meta name="twitter:description" content={desc} key="twitter:description" />
			<meta name="twitter:image" content={img} key="twitter:image" />

			{jsonLd && (
				<script
					type="application/ld+json"
					key="jsonld"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}
		</Head>
	);
};

export default SEO;
