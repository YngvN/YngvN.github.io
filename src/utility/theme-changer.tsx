import { useEffect, useState } from 'react';
import type { Theme } from '../types/theme';

export const useThemeChanger = (initialTheme: Theme = 'light') => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    const updateThemeColor = () => {
        const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (!meta) {
            return;
        }

        const bodyStyle = window.getComputedStyle(document.body);
        meta.setAttribute('content', bodyStyle.backgroundColor);
    };

    useEffect(() => {
        document.body.dataset.theme = theme;
        updateThemeColor();
    }, [theme]);

    useEffect(() => {
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
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme, setTheme };
};

export default useThemeChanger;
