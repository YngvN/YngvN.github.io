import { useState } from 'react';
import type { Language } from '../types/language';

// Simple language state hook mirroring the logic from the language toggle.
const useLanguageChanger = (initialLanguage: Language = 'en') => {
    const [language, setLanguage] = useState<Language>(initialLanguage);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'no' : 'en'));
    };

    return { language, setLanguage, toggleLanguage };
};

export default useLanguageChanger;
