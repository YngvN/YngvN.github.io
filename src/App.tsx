import { useState } from 'react';
import './App.css';
import Nav from './nav/nav';
import Display from './display/display';
import type { PageName } from './types/pages';
import type { Language } from './types/language';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('about');
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="app-shell">
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
