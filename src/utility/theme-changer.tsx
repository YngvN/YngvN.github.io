import { useEffect, useState } from 'react';
import type { Theme } from '../types/theme';

export const useThemeChanger = (initialTheme: Theme = 'light') => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

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

    useEffect(() => {
        document.body.dataset.theme = theme;
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

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme, setTheme };
};

export default useThemeChanger;
