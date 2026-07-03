import { buildCanonicalUrl } from './SEO';

describe('buildCanonicalUrl', () => {
	it('drops the bulky input filter param on list pages', () => {
		expect(buildCanonicalUrl('/car?input=%7B%22page%22%3A1%7D')).toBe('https://solven.uz/car/');
	});

	it('keeps the id param on car detail pages (trailing slash before query)', () => {
		expect(buildCanonicalUrl('/car/detail?id=abc123')).toBe('https://solven.uz/car/detail/?id=abc123');
	});

	it('keeps the agentId param on agent detail pages', () => {
		expect(buildCanonicalUrl('/agent/detail?agentId=xyz789')).toBe(
			'https://solven.uz/agent/detail/?agentId=xyz789',
		);
	});

	it('normalizes the root path to the domain root', () => {
		expect(buildCanonicalUrl('/')).toBe('https://solven.uz/');
	});

	it('strips hash fragments', () => {
		expect(buildCanonicalUrl('/help#faq')).toBe('https://solven.uz/help/');
	});

	it('drops input but keeps other params together', () => {
		expect(buildCanonicalUrl('/community?articleCategory=FREE&input=%7B%7D')).toBe(
			'https://solven.uz/community/?articleCategory=FREE',
		);
	});

	it('prefixes a non-default locale segment', () => {
		expect(buildCanonicalUrl('/car?input=%7B%7D', 'kr')).toBe('https://solven.uz/kr/car/');
	});
});
