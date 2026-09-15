export interface T {
	[key: string]: any;
}

export interface TranslatedText {
	title?: string;
	desc?: string;
}

export interface Translations {
	en?: TranslatedText;
	kr?: TranslatedText;
	ru?: TranslatedText;
	uz?: TranslatedText;
}
