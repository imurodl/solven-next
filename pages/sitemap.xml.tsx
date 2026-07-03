import { GetServerSideProps } from 'next';
import { SITE_URL, toCanonicalPath, localeUrl, alternateLinks } from '../libs/seo';
import { GRAPHQL_URL } from '../libs/config';

const ARTICLE_CATEGORIES = ['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'];

interface Entry {
	path: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
	alternates?: boolean;
}

const STATIC_ENTRIES: Entry[] = [
	{ path: '/', changefreq: 'daily', priority: '1.0', alternates: true },
	{ path: '/car', changefreq: 'daily', priority: '0.9', alternates: true },
	{ path: '/agent', changefreq: 'weekly', priority: '0.8', alternates: true },
	{ path: '/community', changefreq: 'daily', priority: '0.7', alternates: true },
	{ path: '/about', changefreq: 'monthly', priority: '0.5', alternates: true },
	{ path: '/help', changefreq: 'monthly', priority: '0.5', alternates: true },
];

async function gql(query: string, variables: Record<string, any>): Promise<any> {
	try {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, variables }),
		});
		const json = await res.json();
		return json?.data ?? null;
	} catch {
		return null;
	}
}

const isoDate = (v: any): string | undefined => {
	if (!v) return undefined;
	const d = new Date(v);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
};

async function fetchCarEntries(): Promise<Entry[]> {
	const data = await gql(
		`query GetCars($input: CarsInquiry!) { getCars(input: $input) { list { _id updatedAt createdAt } } }`,
		{ input: { page: 1, limit: 1000, sort: 'createdAt', direction: 'DESC', search: {} } },
	);
	return (data?.getCars?.list ?? []).map((c: any) => ({
		path: `/car/detail?id=${c._id}`,
		lastmod: isoDate(c.updatedAt || c.createdAt),
		changefreq: 'weekly',
		priority: '0.6',
	}));
}

async function fetchAgentEntries(): Promise<Entry[]> {
	const data = await gql(
		`query GetAgents($input: AgentsInquiry!) { getAgents(input: $input) { list { _id updatedAt createdAt } } }`,
		{ input: { page: 1, limit: 1000, sort: 'createdAt', direction: 'DESC', search: {} } },
	);
	return (data?.getAgents?.list ?? []).map((a: any) => ({
		path: `/agent/detail?agentId=${a._id}`,
		lastmod: isoDate(a.updatedAt || a.createdAt),
		changefreq: 'weekly',
		priority: '0.5',
	}));
}

async function fetchArticleEntries(): Promise<Entry[]> {
	const results = await Promise.all(
		ARTICLE_CATEGORIES.map((articleCategory) =>
			gql(
				`query GetBoardArticles($input: BoardArticlesInquiry!) { getBoardArticles(input: $input) { list { _id updatedAt createdAt } } }`,
				{ input: { page: 1, limit: 1000, sort: 'createdAt', direction: 'DESC', search: { articleCategory } } },
			),
		),
	);
	return results.flatMap((data) =>
		(data?.getBoardArticles?.list ?? []).map((a: any) => ({
			path: `/community/detail?id=${a._id}`,
			lastmod: isoDate(a.updatedAt || a.createdAt),
			changefreq: 'weekly',
			priority: '0.5',
		})),
	);
}

const xmlEscape = (s: string): string =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderUrl(entry: Entry): string {
	const canonicalPath = toCanonicalPath(entry.path);
	const loc = xmlEscape(localeUrl(canonicalPath, 'en'));
	const parts = [`\t\t<loc>${loc}</loc>`];
	if (entry.lastmod) parts.push(`\t\t<lastmod>${entry.lastmod}</lastmod>`);
	if (entry.changefreq) parts.push(`\t\t<changefreq>${entry.changefreq}</changefreq>`);
	if (entry.priority) parts.push(`\t\t<priority>${entry.priority}</priority>`);
	if (entry.alternates) {
		for (const alt of alternateLinks(canonicalPath)) {
			parts.push(
				`\t\t<xhtml:link rel="alternate" hreflang="${alt.hrefLang}" href="${xmlEscape(alt.href)}" />`,
			);
		}
	}
	return `\t<url>\n${parts.join('\n')}\n\t</url>`;
}

function buildSitemap(entries: Entry[]): string {
	const urls = entries.map(renderUrl).join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;
}

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const [cars, agents, articles] = await Promise.all([
		fetchCarEntries(),
		fetchAgentEntries(),
		fetchArticleEntries(),
	]);
	const entries: Entry[] = [...STATIC_ENTRIES, ...cars, ...agents, ...articles];

	res.setHeader('Content-Type', 'text/xml');
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
	res.write(buildSitemap(entries));
	res.end();

	return { props: {} };
};

export default Sitemap;
