import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

interface ThemeContextValue {
	mode: ThemeMode;
	toggleMode: () => void;
	setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', toggleMode: () => {}, setMode: () => {} });

// The no-flash script in _document.tsx applies data-theme before first paint;
// React only reads it back after mount so SSR markup stays deterministic.
const getAppliedMode = (): ThemeMode => {
	if (typeof document === 'undefined') return 'light';
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
	const [mode, setModeState] = useState<ThemeMode>('light');

	useEffect(() => {
		setModeState(getAppliedMode());
	}, []);

	const setMode = useCallback((next: ThemeMode) => {
		setModeState(next);
		try {
			localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {
			// storage may be unavailable (private mode)
		}
		document.documentElement.dataset.theme = next;
	}, []);

	const toggleMode = useCallback(() => setMode(getAppliedMode() === 'dark' ? 'light' : 'dark'), [setMode]);

	return <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeContext);
