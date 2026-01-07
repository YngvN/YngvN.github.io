import { useEffect, useState } from 'react';
import './App.css';
import Nav from './nav/nav';
import Display from './display/display';
import type { PageName } from './types/pages';
import useThemeChanger from './utility/theme-changer';
import useLanguageChanger from './utility/language-changer';

const pageOptions: PageName[] = ['about', 'portfolio', 'resume', 'contact'];

const isPageName = (value: string): value is PageName => pageOptions.includes(value as PageName);

const getPageFromHash = (hash: string): PageName => {
  const normalized = hash.replace('#', '');
  return isPageName(normalized) ? normalized : 'about';
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>(() => getPageFromHash(window.location.hash));
  const [transitionDirection, setTransitionDirection] = useState<'ltr' | 'rtl'>('ltr');
  const { language, toggleLanguage } = useLanguageChanger('en');
  const { theme, toggleTheme } = useThemeChanger('light');

  const handleNavigate = (page: PageName, direction: 'ltr' | 'rtl' = 'ltr') => {
    setTransitionDirection(direction);
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash(window.location.hash);
      if (nextPage === currentPage) return;
      const currentIndex = pageOptions.indexOf(currentPage);
      const nextIndex = pageOptions.indexOf(nextPage);
      setTransitionDirection(nextIndex < currentIndex ? 'rtl' : 'ltr');
      setCurrentPage(nextPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  useEffect(() => {
    const targetHash = `#${currentPage}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [currentPage]);

  return (
    <div className="layout-shell" data-theme={theme}>
      <Nav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={toggleLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <div className="app-shell">
        <Display
          currentPage={currentPage}
          language={language}
          onNavigate={handleNavigate}
          transitionDirection={transitionDirection}
        />
      </div>
    </div>
  );
}

export default App;
