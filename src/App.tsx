import { useEffect, useState } from 'react';
import './App.css';
import Nav from './nav/nav';
import Display from './display/display';
import type { PageName } from './types/pages';
import type { Language } from './types/language';
import type { Theme } from './types/theme';
import useThemeChanger from './utility/theme-changer';

const pageOptions: PageName[] = ['about', 'portfolio', 'resume', 'contact'];

const isPageName = (value: string): value is PageName => pageOptions.includes(value as PageName);

const getPageFromHash = (hash: string): PageName => {
  const normalized = hash.replace('#', '');
  return isPageName(normalized) ? normalized : 'about';
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>(() => getPageFromHash(window.location.hash));
  const [language, setLanguage] = useState<Language>('en');
  const { theme, toggleTheme } = useThemeChanger('light');

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash(window.location.hash);
      setCurrentPage(nextPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const targetHash = `#${currentPage}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [currentPage]);

  return (
    <div className="app-shell" data-theme={theme}>
      <Nav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <Display currentPage={currentPage} language={language} />
    </div>
  );
}

export default App;
