// Merge new translation keys into all locale files: node scripts/i18n-merge.mjs <keys.json>
// keys.json shape: { "Key": { "en": "...", "kr": "...", "ru": "...", "uz": "..." } }
import { readFileSync, writeFileSync } from 'node:fs';

const [, , file] = process.argv;
const incoming = JSON.parse(readFileSync(file, 'utf8'));
const locales = ['en', 'kr', 'ru', 'uz'];
let added = 0;
for (const loc of locales) {
	const path = `public/locales/${loc}/common.json`;
	const current = JSON.parse(readFileSync(path, 'utf8'));
	for (const [key, values] of Object.entries(incoming)) {
		if (current[key] === undefined) {
			current[key] = values[loc] ?? values.en ?? key;
			added++;
		}
	}
	writeFileSync(path, JSON.stringify(current, null, '\t') + '\n');
}
console.log(`added ${added} key/locale entries`);
