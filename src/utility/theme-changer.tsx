import { useEffect, useState } from 'react';
import type { Theme } from '../types/theme';

export const useThemeChanger = (initialTheme: Theme = 'light') => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme, setTheme };
};

export default useThemeChanger;
