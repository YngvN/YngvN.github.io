import { useEffect, useState } from 'react';
import './App.css';
import Nav from './nav/nav';
import Display from './display/display';
import type { PageName } from './types/pages';
import type { Language } from './types/language';
import ThemeToggle from './components/theme-toggle';
import type { Theme } from './types/theme';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('about');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <Nav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        language={language}
        onLanguageChange={setLanguage}
      />
      <Display currentPage={currentPage} language={language} />
    </div>
  );
}

export default App;
