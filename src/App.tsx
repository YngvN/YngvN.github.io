import { useState } from 'react';
import './App.css';
import Nav from './nav/nav';
import Display from './display/display';
import type { PageName } from './types/pages';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('about');

  return (
    <div className="app-shell">
      <Nav currentPage={currentPage} onNavigate={setCurrentPage} />
      <Display currentPage={currentPage} />
    </div>
  );
}

export default App;
