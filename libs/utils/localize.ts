import { Translations } from '../types/common';

// Pick the machine-translated copy for the active locale, falling back to the
// source text when the translation is missing or empty.
const pick = (translations: Translations | undefined, locale: string | undefined, field: 'title' | 'desc', fallback?: string) => {
	const key = (locale || 'en') as keyof Translations;
	const value = translations?.[key]?.[field];
	return value && value.trim() ? value : fallback ?? '';
};

export const localizeCar = (car: { carTitle?: string; carDesc?: string; carTranslations?: Translations } | null | undefined, locale?: string) => ({
	title: pick(car?.carTranslations, locale, 'title', car?.carTitle),
	desc: pick(car?.carTranslations, locale, 'desc', car?.carDesc),
});

export const localizeArticle = (
	article: { articleTitle?: string; articleContent?: string; articleTranslations?: Translations } | null | undefined,
	locale?: string,
) => ({
	title: pick(article?.articleTranslations, locale, 'title', article?.articleTitle),
	content: pick(article?.articleTranslations, locale, 'desc', article?.articleContent),
});

export const localizeNotice = (
	notice: { noticeTitle?: string; noticeContent?: string; noticeTranslations?: Translations } | null | undefined,
	locale?: string,
) => ({
	title: pick(notice?.noticeTranslations, locale, 'title', notice?.noticeTitle),
	content: pick(notice?.noticeTranslations, locale, 'desc', notice?.noticeContent),
});

export const localizeService = (
	job: { serviceTitle?: string; serviceDesc?: string; serviceTranslations?: Translations } | null | undefined,
	locale?: string,
) => ({
	title: pick(job?.serviceTranslations, locale, 'title', job?.serviceTitle),
	desc: pick(job?.serviceTranslations, locale, 'desc', job?.serviceDesc),
});
