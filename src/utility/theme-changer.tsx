import { useEffect, useState } from 'react';
import type { Theme } from '../types/theme';

type ThemePreference = Theme | 'system';

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const normalizeThemeColor = (color: string) => {
    const trimmed = color.trim();
    if (trimmed.startsWith('#')) {
        return trimmed;
    }

    const match = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i);
    if (!match) {
        return trimmed;
    }

    const [, r, g, b, a] = match;
    const alpha = a === undefined ? 1 : Number(a);
    const toHex = (value: string) => Number(value).toString(16).padStart(2, '0');
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    if (alpha >= 1) {
        return hex;
    }
    const alphaHex = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0');
    return `${hex}${alphaHex}`;
};

const updateThemeColor = () => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
        return;
    }

    requestAnimationFrame(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        meta.setAttribute('content', normalizeThemeColor(bodyStyle.backgroundColor));
    });
};

export const useThemeChanger = (initialTheme: ThemePreference = 'system') => {
    const [theme, setTheme] = useState<Theme>(
        initialTheme === 'system' ? getSystemTheme() : initialTheme,
    );

    useEffect(() => {
        document.body.dataset.theme = theme;
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        updateThemeColor();

        const observer = new MutationObserver(() => {
            updateThemeColor();
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme', 'data-about-active', 'data-about-bg'],
        });

        return () => {
            observer.disconnect();
        };
    }, [theme]);

    useEffect(() => {
        if (initialTheme !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setTheme(event.matches ? 'dark' : 'light');
        };

        handleChange(media);

        const legacyMedia = media as MediaQueryList & {
            addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
            removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
        };

        if (typeof legacyMedia.addEventListener === 'function') {
            legacyMedia.addEventListener('change', handleChange);
            return () => legacyMedia.removeEventListener('change', handleChange);
        }

        if (typeof legacyMedia.addListener === 'function') {
            legacyMedia.addListener(handleChange);
            return () => legacyMedia.removeListener?.(handleChange);
        }
    }, [initialTheme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme, setTheme };
};

export default useThemeChanger;
