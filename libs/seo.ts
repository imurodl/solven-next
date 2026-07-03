export const SITE_URL = 'https://solven.uz';
export const SITE_NAME = 'Solven';
export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'kr', 'ru', 'uz'] as const;
export const DEFAULT_IMAGE = `${SITE_URL}/img/logo/solven.png`;
export const LOGO_URL = `${SITE_URL}/img/logo/solven.png`;

// App locale codes -> BCP-47 language tags. Note: `kr` is the country segment
// used in routing, but the language is Korean, whose ISO code is `ko`.
export const HREFLANG_MAP: Record<string, string> = { en: 'en', kr: 'ko', ru: 'ru', uz: 'uz' };
export const OG_LOCALE_MAP: Record<string, string> = {
	en: 'en_US',
	kr: 'ko_KR',
	ru: 'ru_RU',
	uz: 'uz_UZ',
};

/**
 * Normalises a raw path (`router.asPath` or an explicit canonical) into a clean
 * canonical path: strips the hash, drops the bulky `input` filter param, and
 * applies a trailing slash to match the site's `trailingSlash: true` config
 * (the slash is placed before any query string).
 */
export const toCanonicalPath = (source: string): string => {
	const [pathOnly, queryString] = (source || '/').split('#')[0].split('?');
	let path = pathOnly || '/';
	let query = '';
	if (queryString) {
		const params = new URLSearchParams(queryString);
		params.delete('input');
		query = params.toString();
	}
	if (path !== '/' && !path.endsWith('/')) path += '/';
	return query ? `${path}?${query}` : path;
};

/** Prefixes a canonical path with the site origin and (non-default) locale segment. */
export const localeUrl = (canonicalPath: string, locale: string): string => {
	const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
	return `${SITE_URL}${prefix}${canonicalPath}`;
};

/** hreflang alternates for every locale plus x-default (pointing at the default locale). */
export const alternateLinks = (canonicalPath: string): { hrefLang: string; href: string }[] => {
	const links = LOCALES.map((loc) => ({ hrefLang: HREFLANG_MAP[loc], href: localeUrl(canonicalPath, loc) }));
	links.push({ hrefLang: 'x-default', href: localeUrl(canonicalPath, DEFAULT_LOCALE) });
	return links;
};

/** ---------- JSON-LD builders ---------- */

export const organizationJsonLd = () => ({
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': `${SITE_URL}/#organization`,
	name: SITE_NAME,
	url: SITE_URL,
	logo: { '@type': 'ImageObject', url: LOGO_URL },
	description:
		'Solven is a trusted car marketplace in South Korea for buying and selling new and used cars with verified agents.',
});

export const websiteJsonLd = () => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': `${SITE_URL}/#website`,
	name: SITE_NAME,
	url: SITE_URL,
	publisher: { '@id': `${SITE_URL}/#organization` },
	inLanguage: ['en', 'ko', 'ru', 'uz'],
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: items.map((it, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: it.name,
		item: `${SITE_URL}${it.path}`,
	})),
});

export const vehicleJsonLd = (car: any, imageUrl?: string) => {
	if (!car) return null;
	const url = `${SITE_URL}/car/detail/?id=${car._id}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'Car',
		name: car.carTitle,
		...(car.carDesc ? { description: String(car.carDesc).slice(0, 300) } : {}),
		...(car.carBrand ? { brand: { '@type': 'Brand', name: car.carBrand } } : {}),
		...(car.carModel ? { model: car.carModel } : {}),
		...(car.manufacturedAt ? { vehicleModelDate: String(car.manufacturedAt) } : {}),
		...(car.carMileage != null
			? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: car.carMileage, unitCode: 'SMI' } }
			: {}),
		...(car.carColor ? { color: car.carColor } : {}),
		...(car.carFuelType ? { fuelType: car.carFuelType } : {}),
		...(car.carType ? { bodyType: car.carType } : {}),
		...(imageUrl ? { image: imageUrl } : {}),
		url,
		itemCondition: 'https://schema.org/UsedCondition',
		offers: {
			'@type': 'Offer',
			price: car.carPrice,
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock',
			url,
			itemCondition: 'https://schema.org/UsedCondition',
			seller: { '@id': `${SITE_URL}/#organization` },
		},
	};
};

export const personJsonLd = (agent: any, imageUrl?: string) => {
	if (!agent) return null;
	const name = agent.memberFullName || agent.memberNick;
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name,
		...(imageUrl ? { image: imageUrl } : {}),
		...(agent.memberDesc ? { description: String(agent.memberDesc).slice(0, 300) } : {}),
		jobTitle: 'Car Agent',
		worksFor: { '@id': `${SITE_URL}/#organization` },
		url: `${SITE_URL}/agent/detail/?agentId=${agent._id}`,
	};
};

export const articleJsonLd = (article: any, opts: { image?: string; plain?: string; author?: string } = {}) => {
	if (!article) return null;
	const url = `${SITE_URL}/community/detail/?id=${article._id}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: String(article.articleTitle || '').slice(0, 110),
		...(opts.plain ? { description: opts.plain.slice(0, 200) } : {}),
		...(opts.image ? { image: opts.image } : {}),
		...(article.articleCategory ? { articleSection: article.articleCategory } : {}),
		...(opts.author ? { author: { '@type': 'Person', name: opts.author } } : {}),
		...(article.createdAt ? { datePublished: new Date(article.createdAt).toISOString() } : {}),
		...(article.updatedAt ? { dateModified: new Date(article.updatedAt).toISOString() } : {}),
		publisher: { '@id': `${SITE_URL}/#organization` },
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
	};
};

export const collectionPageJsonLd = (name: string, path: string, description?: string) => ({
	'@context': 'https://schema.org',
	'@type': 'CollectionPage',
	name,
	url: `${SITE_URL}${path}`,
	...(description ? { description } : {}),
	isPartOf: { '@id': `${SITE_URL}/#website` },
});
