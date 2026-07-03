import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
	SITE_URL,
	SITE_NAME,
	DEFAULT_LOCALE,
	DEFAULT_IMAGE,
	OG_LOCALE_MAP,
	toCanonicalPath,
	localeUrl,
	alternateLinks,
} from '../seo';

const DEFAULT_TITLE = 'Solven — Buy & Sell Cars in Korea';
const DEFAULT_DESCRIPTION =
	'Solven is a trusted car marketplace in South Korea. Browse new and used cars, compare prices, connect with verified agents, and find your perfect car.';

/** Absolute canonical URL for the current locale, trailing-slash + input-stripped. */
export const buildCanonicalUrl = (source: string, locale: string = DEFAULT_LOCALE): string =>
	localeUrl(toCanonicalPath(source), locale);

interface SEOProps {
	title?: string;
	description?: string;
	image?: string;
	imageAlt?: string;
	type?: 'website' | 'article' | 'product' | 'profile';
	noindex?: boolean;
	jsonLd?: Record<string, any> | Record<string, any>[];
	canonical?: string;
	publishedTime?: string;
	modifiedTime?: string;
	section?: string;
	author?: string;
}

const SEO = ({
	title,
	description,
	image,
	imageAlt,
	type = 'website',
	noindex = false,
	jsonLd,
	canonical,
	publishedTime,
	modifiedTime,
	section,
	author,
}: SEOProps) => {
	const router = useRouter();
	const currentLocale = router.locale || DEFAULT_LOCALE;
	const canonicalPath = toCanonicalPath(canonical || router.asPath || '/');
	const url = localeUrl(canonicalPath, currentLocale);
	const alternates = alternateLinks(canonicalPath);

	const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
	const desc = description || DEFAULT_DESCRIPTION;
	const img = image || DEFAULT_IMAGE;
	const imgAlt = imageAlt || fullTitle;
	const ogLocale = OG_LOCALE_MAP[currentLocale] || 'en_US';

	return (
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" key="viewport" />
			<title key="title">{fullTitle}</title>
			<meta name="description" content={desc} key="description" />
			<meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} key="robots" />
			<meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} key="googlebot" />
			<link rel="canonical" href={url} key="canonical" />

			{alternates.map((alt) => (
				<link rel="alternate" hrefLang={alt.hrefLang} href={alt.href} key={`alt-${alt.hrefLang}`} />
			))}

			<meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
			<meta property="og:type" content={type} key="og:type" />
			<meta property="og:title" content={fullTitle} key="og:title" />
			<meta property="og:description" content={desc} key="og:description" />
			<meta property="og:url" content={url} key="og:url" />
			<meta property="og:image" content={img} key="og:image" />
			<meta property="og:image:alt" content={imgAlt} key="og:image:alt" />
			<meta property="og:locale" content={ogLocale} key="og:locale" />
			{Object.entries(OG_LOCALE_MAP)
				.filter(([loc]) => loc !== currentLocale)
				.map(([loc, val]) => (
					<meta property="og:locale:alternate" content={val} key={`og:locale:alt-${loc}`} />
				))}

			{type === 'article' && publishedTime && (
				<meta property="article:published_time" content={publishedTime} key="article:published_time" />
			)}
			{type === 'article' && modifiedTime && (
				<meta property="article:modified_time" content={modifiedTime} key="article:modified_time" />
			)}
			{type === 'article' && section && (
				<meta property="article:section" content={section} key="article:section" />
			)}
			{type === 'article' && author && <meta property="article:author" content={author} key="article:author" />}

			<meta name="twitter:card" content="summary_large_image" key="twitter:card" />
			<meta name="twitter:title" content={fullTitle} key="twitter:title" />
			<meta name="twitter:description" content={desc} key="twitter:description" />
			<meta name="twitter:image" content={img} key="twitter:image" />
			<meta name="twitter:image:alt" content={imgAlt} key="twitter:image:alt" />

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
