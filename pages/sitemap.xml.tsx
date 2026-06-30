import { GetServerSideProps } from 'next';

const SITE_URL = 'https://solven.uz';
const GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL || 'https://api.solven.uz/graphql';

const STATIC_ROUTES = ['/', '/car', '/agent', '/community', '/about', '/help'];
const ARTICLE_CATEGORIES = ['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'];

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

async function fetchCarUrls(): Promise<string[]> {
	const data = await gql(
		`query GetCars($input: CarsInquiry!) { getCars(input: $input) { list { _id } } }`,
		{ input: { page: 1, limit: 1000, sort: 'createdAt', direction: 'DESC', search: {} } },
	);
	return (data?.getCars?.list ?? []).map((c: any) => `/car/detail?id=${c._id}`);
}

async function fetchAgentUrls(): Promise<string[]> {
	const data = await gql(
		`query GetAgents($input: AgentsInquiry!) { getAgents(input: $input) { list { _id } } }`,
		{ input: { page: 1, limit: 1000, sort: 'createdAt', direction: 'DESC', search: {} } },
	);
	return (data?.getAgents?.list ?? []).map((a: any) => `/agent/detail?agentId=${a._id}`);
}

async function fetchArticleUrls(): Promise<string[]> {
	const results = await Promise.all(
		ARTICLE_CATEGORIES.map((articleCategory) =>
			gql(
				`query GetBoardArticles($input: BoardArticlesInquiry!) { getBoardArticles(input: $input) { list { _id } } }`,
				{ input: { page: 1, limit: 1000, sort: 'createdAt', direction: 'DESC', search: { articleCategory } } },
			),
		),
	);
	return results.flatMap((data) => (data?.getBoardArticles?.list ?? []).map((a: any) => `/community/detail?id=${a._id}`));
}

function buildSitemap(paths: string[]): string {
	const urls = paths
		.map((p) => `\t<url><loc>${SITE_URL}${p === '/' ? '' : p}</loc></url>`)
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const [cars, agents, articles] = await Promise.all([fetchCarUrls(), fetchAgentUrls(), fetchArticleUrls()]);
	const paths = [...STATIC_ROUTES, ...cars, ...agents, ...articles];

	res.setHeader('Content-Type', 'text/xml');
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
	res.write(buildSitemap(paths));
	res.end();

	return { props: {} };
};

export default Sitemap;
