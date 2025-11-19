import { useEffect, useState, type FC } from 'react';
import About from '../pages/about/about';
import Portfolio from '../pages/portfolio/portfolio';
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

const placeholderCopy: Record<'resume' | 'contact', Record<Language, { title: string; description: string }>> = {
    resume: {
        en: {
            title: 'Resume',
            description: 'A downloadable version of my resume will appear here soon.',
        },
        no: {
            title: 'CV',
            description: 'En nedlastbar versjon av CV-en min kommer snart.',
        },
    },
    contact: {
        en: {
            title: 'Contact Me',
            description: 'Want to work together? Send me an email at yngve@example.com.',
        },
        no: {
            title: 'Kontakt meg',
            description: 'Vil du samarbeide? Send meg en e-post på yngve@example.com.',
        },
    },
};

const renderPage = (page: PageName, language: Language) => {
    switch (page) {
        case 'about':
            return <About language={language} />;
        case 'portfolio':
            return <Portfolio language={language} />;
        case 'resume':
            return placeholder(placeholderCopy.resume[language].title, placeholderCopy.resume[language].description);
        case 'contact':
            return placeholder(placeholderCopy.contact[language].title, placeholderCopy.contact[language].description);
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
