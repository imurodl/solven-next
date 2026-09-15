import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';

export type Currency = 'USD' | 'KRW' | 'UZS' | 'RUB';

type Rates = Record<Currency, number>;

// Default currency follows the UI language; a manual choice is remembered per language.
export const LOCALE_CURRENCY: Record<string, Currency> = { en: 'USD', kr: 'KRW', uz: 'UZS', ru: 'RUB' };
export const CURRENCY_LIST: Currency[] = ['USD', 'KRW', 'UZS', 'RUB'];
export const CURRENCY_SYMBOL: Record<Currency, string> = { USD: '$', KRW: '₩', UZS: "so'm", RUB: '₽' };

interface CurrencyContextType {
	currency: Currency;
	setCurrency: (c: Currency) => void;
	formatPrice: (usdAmount: number | undefined | null, opts?: { compact?: boolean }) => string;
	convert: (usdAmount: number) => number;
	rates: Rates;
}

const DEFAULT_RATES: Rates = { USD: 1, KRW: 1350, UZS: 12700, RUB: 90 };
const STORAGE_KEY = 'slv_currency';
const RATES_CACHE_KEY = 'slv_rates_cache';
const RATES_TTL = 60 * 60 * 1000;
const DEFAULT_CURRENCY: Currency = 'USD';

// All listing prices are stored in USD; the switcher only changes presentation.
export function formatCurrency(usdAmount: number, currency: Currency, rates: Rates, compact = false): string {
	const converted = Math.round(usdAmount * rates[currency]);
	switch (currency) {
		case 'KRW':
			if (compact && converted >= 10_000) return `${(converted / 10_000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`;
			return `₩${converted.toLocaleString('ko-KR')}`;
		case 'RUB':
			return `${converted.toLocaleString('ru-RU')} ₽`;
		case 'UZS':
			if (converted >= 1_000_000_000) return `${(converted / 1_000_000_000).toFixed(1)} mlrd so'm`;
			if (converted >= 1_000_000) return `${(converted / 1_000_000).toFixed(1)} mln so'm`;
			if (converted >= 1_000) return `${Math.round(converted / 1_000)} ming so'm`;
			return `${converted} so'm`;
		default:
			return `$${Math.round(usdAmount).toLocaleString('en-US')}`;
	}
}

// Usable without a provider (tests, isolated renders): plain USD.
const CurrencyContext = createContext<CurrencyContextType>({
	currency: DEFAULT_CURRENCY,
	setCurrency: () => {},
	formatPrice: (usd, opts) => (usd === undefined || usd === null ? '' : formatCurrency(Number(usd), DEFAULT_CURRENCY, DEFAULT_RATES, opts?.compact)),
	convert: (n) => n,
	rates: DEFAULT_RATES,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const locale = router.locale ?? router.defaultLocale ?? 'en';
	const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
	const [rates, setRates] = useState<Rates>(DEFAULT_RATES);

	useEffect(() => {
		const localeCurrency = LOCALE_CURRENCY[locale] ?? DEFAULT_CURRENCY;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw) as { locale: string; currency: Currency };
				if (saved?.locale === locale && CURRENCY_LIST.includes(saved.currency)) {
					setCurrencyState(saved.currency);
					return;
				}
			}
		} catch {
			// ignore
		}
		setCurrencyState(localeCurrency);
	}, [locale]);

	useEffect(() => {
		try {
			const cached = localStorage.getItem(RATES_CACHE_KEY);
			if (cached) {
				const { timestamp, data } = JSON.parse(cached);
				const complete = CURRENCY_LIST.every((c) => typeof data?.[c] === 'number');
				if (complete && Date.now() - timestamp < RATES_TTL) {
					setRates(data);
					return;
				}
			}
		} catch {
			// ignore
		}
		fetch('https://open.er-api.com/v6/latest/USD')
			.then((r) => r.json())
			.then((data) => {
				if (!data?.rates) return;
				const fresh: Rates = {
					USD: 1,
					KRW: data.rates.KRW ?? DEFAULT_RATES.KRW,
					UZS: data.rates.UZS ?? DEFAULT_RATES.UZS,
					RUB: data.rates.RUB ?? DEFAULT_RATES.RUB,
				};
				setRates(fresh);
				try {
					localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: fresh }));
				} catch {
					// ignore
				}
			})
			.catch(() => {});
	}, []);

	const setCurrency = useCallback(
		(c: Currency) => {
			setCurrencyState(c);
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, currency: c }));
			} catch {
				// ignore
			}
		},
		[locale],
	);

	const convert = useCallback((usdAmount: number) => Math.round(usdAmount * rates[currency]), [currency, rates]);

	const formatPrice = useCallback(
		(usdAmount: number | undefined | null, opts?: { compact?: boolean }): string => {
			if (usdAmount === undefined || usdAmount === null || Number.isNaN(Number(usdAmount))) return '';
			return formatCurrency(Number(usdAmount), currency, rates, opts?.compact);
		},
		[currency, rates],
	);

	return (
		<CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convert, rates }}>{children}</CurrencyContext.Provider>
	);
}

export const useCurrency = () => useContext(CurrencyContext);
