// Submit fresh URLs to IndexNow (Bing, Yandex, Naver, Seznam): node scripts/indexnow.mjs
// Requires INDEXNOW_KEY and the matching public/<key>.txt file (see README of the key file).
import { readFileSync } from 'node:fs';

const SITE = 'https://solven.uz';
const KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
	console.error('INDEXNOW_KEY is not set');
	process.exit(1);
}

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).slice(0, 10000);
const body = { host: 'solven.uz', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls };
const res = await fetch('https://api.indexnow.org/indexnow', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json; charset=utf-8' },
	body: JSON.stringify(body),
});
console.log(`IndexNow: ${res.status} for ${urls.length} urls`);
try {
	readFileSync(`public/${KEY}.txt`);
} catch {
	console.warn(`public/${KEY}.txt is missing — create it containing the key`);
}
