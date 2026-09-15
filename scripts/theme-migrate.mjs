// One-off migration: replace hardcoded colours in SCSS with theme tokens.
// Context-aware: the same literal maps differently for backgrounds vs text.
// Run once (`node scripts/theme-migrate.mjs`), review the diff, commit.
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('scss/{pc,mobile}/**/*.scss').concat(globSync('scss/app.scss'));

const norm = (hex) => {
	let h = hex.toLowerCase();
	if (/^#[0-9a-f]{3}$/.test(h)) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
	return h;
};

// literal -> { bg, text, border } token (null = leave literal)
const MAP = {
	'#ffffff': { bg: 'var(--surface)', text: null, border: 'var(--surface)' },
	white: { bg: 'var(--surface)', text: null, border: 'var(--surface)' },
	'#fafafa': { bg: 'var(--surface-2)', text: null, border: 'var(--border-soft)' },
	'#f4f6f8': { bg: 'var(--bg-muted)', text: null, border: null },
	'#f6f6f6': { bg: 'var(--bg-muted)', text: null, border: null },
	'#f3f4f6': { bg: 'var(--bg-muted)', text: null, border: 'var(--border-soft)' },
	'#f9fafb': { bg: 'var(--bg-muted)', text: null, border: null },
	'#f8fafc': { bg: 'var(--bg-muted)', text: null, border: null },
	'#f1f5f9': { bg: 'var(--bg-muted)', text: null, border: 'var(--border-soft)' },
	'#f8f9fc': { bg: 'var(--bg-warm)', text: null, border: null },
	'#f8f9fa': { bg: 'var(--bg-warm)', text: null, border: null },
	'#f5f5f5': { bg: 'var(--bg-muted)', text: null, border: 'var(--border-soft)' },
	'#f4f5f5': { bg: 'var(--bg-muted)', text: null, border: null },
	'#f0f0f0': { bg: 'var(--bg-muted)', text: null, border: 'var(--border-soft)' },
	'#eeeeee': { bg: 'var(--bg-strong)', text: null, border: 'var(--border-soft)' },
	'#e9e9e9': { bg: 'var(--bg-strong)', text: null, border: 'var(--border-soft)' },
	'#e5e7eb': { bg: 'var(--bg-strong)', text: null, border: 'var(--border-soft)' },
	'#e0e0e0': { bg: 'var(--bg-strong)', text: null, border: 'var(--border)' },
	'#dddddd': { bg: 'var(--bg-strong)', text: null, border: 'var(--border)' },
	'#d1d5db': { bg: 'var(--bg-strong)', text: 'var(--text-4)', border: 'var(--border)' },
	'#cbd5e1': { bg: 'var(--bg-strong)', text: 'var(--text-4)', border: 'var(--border)' },
	'#bdbdbd': { bg: 'var(--bg-strong)', text: 'var(--text-4)', border: 'var(--border)' },
	'#aaaaaa': { bg: null, text: 'var(--text-4)', border: 'var(--border)' },
	'#9ca3af': { bg: null, text: 'var(--text-3)', border: 'var(--border)' },
	'#94a3b8': { bg: null, text: 'var(--text-3)', border: 'var(--border)' },
	'#999999': { bg: null, text: 'var(--text-3)', border: 'var(--border)' },
	'#888888': { bg: null, text: 'var(--text-3)', border: null },
	'#818181': { bg: null, text: 'var(--text-3)', border: null },
	'#757575': { bg: null, text: 'var(--text-2)', border: null },
	'#717171': { bg: null, text: 'var(--text-2)', border: null },
	'#6b7280': { bg: null, text: 'var(--text-2)', border: 'var(--text-2)' },
	'#666666': { bg: null, text: 'var(--text-2)', border: null },
	'#616161': { bg: null, text: 'var(--text-2)', border: null },
	'#64748b': { bg: null, text: 'var(--text-2)', border: null },
	'#4b5563': { bg: null, text: 'var(--text-2)', border: null },
	'#374151': { bg: null, text: 'var(--text-1)', border: null },
	'#333333': { bg: null, text: 'var(--text-1)', border: null },
	'#1f2937': { bg: 'var(--bg-inverse)', text: 'var(--text-1)', border: null },
	'#212121': { bg: 'var(--bg-inverse)', text: 'var(--text-1)', border: null },
	'#1a1a1a': { bg: 'var(--bg-inverse)', text: 'var(--text-1)', border: null },
	'#181a20': { bg: 'var(--dark-section)', text: 'var(--text-1)', border: 'var(--border-dark)' },
	'#050b20': { bg: 'var(--dark-section)', text: 'var(--text-1)', border: 'var(--border-dark)' },
	'#000000': { bg: null, text: 'var(--text-1)', border: 'var(--border-dark)' },
	black: { bg: null, text: 'var(--text-1)', border: 'var(--border-dark)' },
	'#1e40af': { bg: 'var(--primary)', text: 'var(--primary)', border: 'var(--primary)' },
	'#1e3a8a': { bg: 'var(--primary-dark)', text: 'var(--primary-dark)', border: 'var(--primary-dark)' },
	'#3b4bdf': { bg: 'var(--primary-2)', text: 'var(--primary-2)', border: 'var(--primary-2)' },
	'#405ff2': { bg: 'var(--accent)', text: 'var(--accent)', border: 'var(--accent)' },
	'#ef4444': { bg: 'var(--danger)', text: 'var(--danger)', border: 'var(--danger)' },
	'#ed5858': { bg: 'var(--danger)', text: 'var(--danger)', border: 'var(--danger)' },
	'#229a16': { bg: 'var(--success)', text: 'var(--success)', border: 'var(--success)' },
	'#f57c00': { bg: 'var(--warning)', text: 'var(--warning)', border: 'var(--warning)' },
};

const PROP_KIND = (prop) => {
	const p = prop.trim().toLowerCase();
	if (/^(background|background-color)$/.test(p)) return 'bg';
	if (/^(border|border-top|border-bottom|border-left|border-right|border-color|outline|outline-color|box-shadow)$/.test(p)) return 'border';
	if (/^(color|fill|stroke|caret-color|-webkit-text-fill-color)$/.test(p)) return 'text';
	if (/^(background-image|filter|opacity|transform|font.*|width|height|margin.*|padding.*)$/.test(p)) return null;
	return null;
};

let total = 0;
for (const file of files) {
	const src = readFileSync(file, 'utf8');
	// Only touch declarations `prop: value;` — leave selectors, mixins, comments alone.
	const out = src.replace(/^(\s*)([a-z-]+)\s*:\s*([^;{}]+);/gim, (m, indent, prop, value) => {
		const kind = PROP_KIND(prop);
		if (!kind) return m;
		if (/url\(|gradient\(/i.test(value)) return m;
		const next = value.replace(/#[0-9a-f]{3}(?:[0-9a-f]{3})?\b|(?<![\w$-])(?:white|black)\b/gi, (lit) => {
			const key = lit.startsWith('#') ? norm(lit) : lit.toLowerCase();
			const entry = MAP[key];
			if (!entry) return lit;
			const token = entry[kind];
			if (!token) return lit;
			total++;
			return token;
		});
		return `${indent}${prop}: ${next};`;
	});
	if (out !== src) writeFileSync(file, out);
}
console.log(`replaced ${total} colour literals in ${files.length} files`);
