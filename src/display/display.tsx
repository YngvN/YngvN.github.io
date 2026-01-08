import { useEffect, useState, type FC } from 'react';
import About from '../pages/about/about';
import Portfolio from '../pages/portfolio/portfolio';
import Resume from '../pages/resume/resume';
import Contact from '../pages/contact/contact';
import '../assets/styles.scss';
import './page-display.scss';
import type { PageName } from '../types/pages';
import type { Language } from '../types/language';

type DisplayProps = {
    currentPage: PageName;
    language: Language;
    transitionDirection: 'ltr' | 'rtl';
    onNavigate: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

const renderPage = (page: PageName, language: Language, onNavigate: DisplayProps['onNavigate']) => {
    switch (page) {
        case 'about':
            return <About language={language} onNavigate={onNavigate} />;
        case 'portfolio':
            return <Portfolio language={language} onNavigate={onNavigate} />;
        case 'resume':
            return <Resume language={language} onNavigate={onNavigate} />;
        case 'contact':
            return <Contact language={language} onNavigate={onNavigate} />;
        default:
            return <About language={language} onNavigate={onNavigate} />;
    }
};

const Display: FC<DisplayProps> = ({ currentPage, language, transitionDirection, onNavigate }) => {
    const [activePage, setActivePage] = useState<PageName>(currentPage);
    const [outgoingPage, setOutgoingPage] = useState<PageName | null>(null);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (currentPage === activePage) return;
        setOutgoingPage(activePage);
        setActivePage(currentPage);
    }, [currentPage, activePage]);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        if (!outgoingPage) return;
        const root = document.documentElement;
        root.classList.add('page-transitioning');
        document.body.classList.add('page-transitioning');
        const timer = window.setTimeout(() => {
            root.classList.remove('page-transitioning');
            document.body.classList.remove('page-transitioning');
            setOutgoingPage(null);
        }, 450);
        return () => {
            window.clearTimeout(timer);
            root.classList.remove('page-transitioning');
            document.body.classList.remove('page-transitioning');
        };
    }, [outgoingPage]);

    return (
        <section className="page-display">
            <div className="page-stack">
                {outgoingPage && (
                    <div className={`page-card page-card--exit${transitionDirection === 'rtl' ? ' rtl' : ''}`}>
                        <div className="language-fade" key={`${outgoingPage}-${language}`}>
                            {renderPage(outgoingPage, language, onNavigate)}
                        </div>
                    </div>
                )}
                <div className={`page-card page-card--enter${outgoingPage ? ' animating' : ''}${transitionDirection === 'rtl' ? ' rtl' : ''}`}>
                    <div className="language-fade" key={`${activePage}-${language}`}>
                        {renderPage(activePage, language, onNavigate)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Display;
