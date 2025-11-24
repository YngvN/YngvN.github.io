import { useEffect, useState, type FC } from 'react';
import About from '../pages/about/about';
import Portfolio from '../pages/portfolio/portfolio';
import Resume from '../pages/resume/resume';
import Contact from '../pages/contact/contact';
import '../assets/styles.scss';
import type { PageName } from '../types/pages';
import type { Language } from '../types/language';

type DisplayProps = {
    currentPage: PageName;
    language: Language;
};

const placeholder = (title: string, description: string) => (
    <div className="container">
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
);

const placeholderCopy: Record<'contact', Record<Language, { title: string; description: string }>> = {};

const renderPage = (page: PageName, language: Language) => {
    switch (page) {
        case 'about':
            return <About language={language} />;
        case 'portfolio':
            return <Portfolio language={language} />;
        case 'resume':
            return <Resume language={language} />;
        case 'contact':
            return <Contact />;
        default:
            return <About language={language} />;
    }
};

const Display: FC<DisplayProps> = ({ currentPage, language }) => {
    const [activePage, setActivePage] = useState<PageName>(currentPage);
    const [outgoingPage, setOutgoingPage] = useState<PageName | null>(null);

    useEffect(() => {
        if (currentPage === activePage) return;
        setOutgoingPage(activePage);
        setActivePage(currentPage);
    }, [currentPage, activePage]);

    useEffect(() => {
        if (!outgoingPage) return;
        const timer = window.setTimeout(() => setOutgoingPage(null), 400);
        return () => window.clearTimeout(timer);
    }, [outgoingPage]);

    return (
        <section className="page-display">
            <div className="page-stack">
                {outgoingPage && (
                    <div className="page-card page-card--exit">
                        <div className="language-fade" key={`${outgoingPage}-${language}`}>
                            {renderPage(outgoingPage, language)}
                        </div>
                    </div>
                )}
                <div className={`page-card page-card--enter${outgoingPage ? ' animating' : ''}`}>
                    <div className="language-fade" key={`${activePage}-${language}`}>
                        {renderPage(activePage, language)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Display;
