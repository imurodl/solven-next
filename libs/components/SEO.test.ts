import { buildCanonicalUrl } from './SEO';

describe('buildCanonicalUrl', () => {
	it('drops the bulky input filter param on list pages', () => {
		expect(buildCanonicalUrl('/car?input=%7B%22page%22%3A1%7D')).toBe('https://solven.uz/car');
	});

	it('keeps the id param on car detail pages', () => {
		expect(buildCanonicalUrl('/car/detail?id=abc123')).toBe('https://solven.uz/car/detail?id=abc123');
	});

	it('keeps the agentId param on agent detail pages', () => {
		expect(buildCanonicalUrl('/agent/detail?agentId=xyz789')).toBe('https://solven.uz/agent/detail?agentId=xyz789');
	});

	it('normalizes the root path to the bare domain', () => {
		expect(buildCanonicalUrl('/')).toBe('https://solven.uz');
	});

	it('strips hash fragments', () => {
		expect(buildCanonicalUrl('/help#faq')).toBe('https://solven.uz/help');
	});

	it('drops input but keeps other params together', () => {
		expect(buildCanonicalUrl('/community?articleCategory=FREE&input=%7B%7D')).toBe(
			'https://solven.uz/community?articleCategory=FREE',
		);
	});
});
