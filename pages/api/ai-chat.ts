import type { NextApiRequest, NextApiResponse } from 'next';

// Catalog-grounded car shopping assistant. Keys never reach the browser: the
// route talks to Groq (primary) or Gemini (fallback) server-side and only hands
// back text + real listing ids. Rate-limited per IP per day.
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const GQL_URL = process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3007/graphql';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007';

const LANG_NAME: Record<string, string> = { uz: 'Uzbek (Latin script)', en: 'English', ru: 'Russian', kr: 'Korean' };
const DAILY_LIMIT = Number(process.env.AI_CHAT_DAILY_LIMIT) || 10;

const rateMap = new Map<string, { count: number; day: string }>();
let rateMapDay = new Date().toISOString().slice(0, 10);

function checkRateLimit(ip: string): boolean {
	const day = new Date().toISOString().slice(0, 10);
	if (day !== rateMapDay) {
		rateMap.clear();
		rateMapDay = day;
	}
	const rec = rateMap.get(ip);
	if (!rec || rec.day !== day) {
		rateMap.set(ip, { count: 1, day });
		return true;
	}
	if (rec.count >= DAILY_LIMIT) return false;
	rec.count += 1;
	return true;
}

const LIMIT_MSG: Record<string, string> = {
	uz: "Bugungi AI suhbat chegarasiga yetdingiz. Ertaga yana urinib ko'ring.",
	en: "You've reached today's AI chat limit. Please come back tomorrow.",
	ru: 'Вы достигли дневного лимита AI-чата. Возвращайтесь завтра.',
	kr: '오늘 AI 채팅 한도에 도달했어요. 내일 다시 이용해 주세요.',
};

interface CatalogCar {
	_id: string;
	carTitle: string;
	carBrand: string;
	carModel: string;
	carType?: string;
	carFuelType?: string;
	carTransmission?: string;
	carColor?: string;
	carLocation?: string;
	manufacturedAt?: number;
	carMileage?: number;
	carSeats?: number;
	carPrice: number;
	carSalePrice?: number;
	carIsOnSale?: boolean;
	carSaleStartsAt?: string;
	carSaleExpiresAt?: string;
	carImages?: string[];
	carRating?: number;
	carReviews?: number;
	carTranslations?: Record<string, { title?: string }>;
}

const localizedTitle = (c: CatalogCar, locale: string): string => c.carTranslations?.[locale]?.title?.trim() || c.carTitle;

const saleActive = (c: CatalogCar): boolean => {
	if (!c.carIsOnSale || !c.carSalePrice) return false;
	const now = Date.now();
	if (c.carSaleStartsAt && new Date(c.carSaleStartsAt).getTime() > now) return false;
	if (c.carSaleExpiresAt && new Date(c.carSaleExpiresAt).getTime() <= now) return false;
	return true;
};

async function fetchCatalog(): Promise<CatalogCar[]> {
	const query = `query { getCars(input:{ page:1, limit:80, sort:"carRank", direction:DESC, search:{} }) {
		list { _id carTitle carBrand carModel carType carFuelType carTransmission carColor carLocation manufacturedAt carMileage carSeats carPrice carSalePrice carIsOnSale carSaleStartsAt carSaleExpiresAt carImages carRating carReviews
			carTranslations { en{title} kr{title} ru{title} uz{title} } } } }`;
	try {
		const r = await fetch(GQL_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
		const d = await r.json();
		return d?.data?.getCars?.list || [];
	} catch {
		return [];
	}
}

interface AiAction {
	label: string;
	href: string;
}

const ALLOWED_HREFS = ['/car', '/service', '/community', '/agent', '/help', '/mypage', '/checkout', '/account/join', '/ai-finder', '/about'];

const cleanActions = (raw: unknown): AiAction[] =>
	(Array.isArray(raw) ? raw : [])
		.filter((a) => a && typeof a.label === 'string' && typeof a.href === 'string' && ALLOWED_HREFS.some((h) => a.href.startsWith(h)))
		.slice(0, 3)
		.map((a) => ({ label: String(a.label).slice(0, 40), href: String(a.href).slice(0, 200) }));

interface AiReply {
	reply: string;
	carIds: string[];
	actions: AiAction[];
}

const parseReply = (raw: string): AiReply => {
	const parsed = JSON.parse(raw);
	return {
		reply: typeof parsed.reply === 'string' ? parsed.reply : '',
		carIds: Array.isArray(parsed.carIds) ? parsed.carIds.map(String) : [],
		actions: cleanActions(parsed.actions),
	};
};

async function askGroq(systemPrompt: string, history: { role: string; content: string }[]): Promise<AiReply> {
	const messages = [{ role: 'system', content: systemPrompt }, ...history.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))];
	const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
		body: JSON.stringify({ model: GROQ_MODEL, messages, response_format: { type: 'json_object' }, temperature: 0.5, reasoning_effort: 'low' }),
	});
	if (!r.ok) throw new Error(`Groq ${r.status}: ${(await r.text()).slice(0, 150)}`);
	const data = await r.json();
	return parseReply(data.choices[0].message.content);
}

async function askGemini(systemPrompt: string, history: { role: string; content: string }[]): Promise<AiReply> {
	const contents = [
		{ role: 'user', parts: [{ text: systemPrompt }] },
		{ role: 'model', parts: [{ text: 'OK' }] },
		...history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
	];
	const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contents, generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } }),
	});
	if (!r.ok) throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 150)}`);
	const data = await r.json();
	return parseReply(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
	if (!GROQ_API_KEY && !GEMINI_API_KEY) return res.status(503).json({ error: 'AI is not configured', configured: false });

	const { messages, locale } = req.body as { messages: { role: string; content: string }[]; locale: string };
	const lang = LANG_NAME[locale] || 'English';

	if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) return res.status(400).json({ error: 'Invalid messages' });
	for (const m of messages) if (typeof m?.content !== 'string' || m.content.length > 1000) return res.status(400).json({ error: 'Message too long' });

	const ip = (req.headers['x-real-ip'] as string) || ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
	if (!checkRateLimit(ip)) return res.status(200).json({ reply: LIMIT_MSG[locale] || LIMIT_MSG.en, cars: [], actions: [], limited: true });

	try {
		const catalog = await fetchCatalog();
		const catalogText = catalog
			.map(
				(c) =>
					`- id:${c._id} | ${c.manufacturedAt} ${c.carBrand} ${c.carModel} — ${localizedTitle(c, locale)} | body:${c.carType} | fuel:${c.carFuelType} | gearbox:${c.carTransmission} | colour:${c.carColor} | km:${c.carMileage} | seats:${c.carSeats} | city:${c.carLocation} | price:$${saleActive(c) ? c.carSalePrice : c.carPrice}${saleActive(c) ? ' (HOT DEAL)' : ''}${c.carReviews ? ` | rating:${c.carRating}/5 (${c.carReviews})` : ''}`,
			)
			.join('\n');

		const systemPrompt = `You are Solven's expert car-buying assistant for a used-car marketplace in South Korea (buyers are often Uzbek, Russian and Korean speakers). You know cars like a seasoned dealer: reliability, running costs, fuel types, family needs, resale value.
Always answer ONLY in ${lang}, warm and concise, like a knowledgeable friend — never a sales pitch.

CURRENT LISTINGS (the ONLY cars that exist; never invent cars, prices or ids):
${catalogText || '(no listings)'}

HOW TO HELP:
1. Understand the buyer: budget, family size, city driving vs highway, fuel preference, automatic/manual, brand loyalty, new vs used.
2. Reason like an expert: e.g. hybrids/LPG for taxi-like mileage, SUVs with 7 seats for families, EVs for Seoul commuters, low-km recent years for reliability. Mention a concrete trade-off when useful.
3. Recommend 1-3 listings that GENUINELY fit; put their EXACT ids in "carIds". If nothing fits, say so and suggest what to look for. Cards are shown separately: do not repeat prices or ids in the text.
4. When the user needs a section rather than a car, guide them with an action button. Site map:
- "/car" browse & filter all listings (you may append ?input=... no — just link "/car")
- "/ai-finder" find a car from a photo
- "/service" mechanics and repair work showcase (use for "repair / mechanic / inspection / service")
- "/community" articles and tips
- "/agent" dealers / sellers
- "/help" FAQ, notices, terms
- "/mypage" the user's orders, messages, favorites, listings
- "/account/join" log in / sign up / become a seller
- "/about" about Solven
Deal flow you can explain: a buyer reserves a car with a 5% deposit, the seller accepts, handover happens, then the buyer confirms and can review.

Return ONLY JSON: {"reply": "...", "carIds": ["id1"], "actions": [{"label": "...", "href": "/..."}]} — actions only when they truly help (max 2), label in ${lang}.`;

		const cleanHistory = messages.filter((m) => m?.content && m.content.trim());
		let result: AiReply;
		if (GROQ_API_KEY) {
			try {
				result = await askGroq(systemPrompt, cleanHistory);
			} catch (err) {
				if (!GEMINI_API_KEY) throw err;
				result = await askGemini(systemPrompt, cleanHistory);
			}
		} else {
			result = await askGemini(systemPrompt, cleanHistory);
		}

		const byId = new Map(catalog.map((c) => [c._id, c]));
		const cars = result.carIds
			.map((id) => byId.get(id))
			.filter((c): c is CatalogCar => !!c)
			.slice(0, 3)
			.map((c) => ({
				_id: c._id,
				title: localizedTitle(c, locale),
				subtitle: `${c.manufacturedAt} · ${Number(c.carMileage || 0).toLocaleString('en-US')} km · ${c.carFuelType}`,
				price: saleActive(c) ? c.carSalePrice : c.carPrice,
				originalPrice: saleActive(c) ? c.carPrice : null,
				image: c.carImages?.[0] ? `${API_URL}/${c.carImages[0]}` : '',
			}));

		return res.status(200).json({ reply: result.reply || '...', cars, actions: result.actions });
	} catch (error: any) {
		console.error('AI chat error:', error?.message);
		return res.status(500).json({ error: 'AI is temporarily unavailable' });
	}
}
