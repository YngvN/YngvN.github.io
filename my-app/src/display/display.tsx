import { useEffect, useState, type FC } from 'react';
import About from '../pages/about/about';
import Portfolio from '../pages/portfolio/portfolio';
import '../assets/styles.scss';
import type { PageName } from '../types/pages';

type DisplayProps = {
    currentPage: PageName;
};

const placeholder = (title: string, description: string) => (
    <div className="container">
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
);

const renderPage = (page: PageName) => {
    switch (page) {
        case 'about':
            return <About />;
        case 'portfolio':
            return <Portfolio />;
        case 'resume':
            return placeholder('Resume', 'A downloadable version of my resume will appear here soon.');
        case 'contact':
            return placeholder('Contact Me', 'Want to work together? Send me an email at yngve@example.com.');
        default:
            return <About />;
    }
};

const Display: FC<DisplayProps> = ({ currentPage }) => {
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
                        {renderPage(outgoingPage)}
                    </div>
                )}
                <div className={`page-card page-card--enter${outgoingPage ? ' animating' : ''}`}>
                    {renderPage(activePage)}
                </div>
            </div>
        </section>
    );
};

export default Display;
