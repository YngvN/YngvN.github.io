import React from 'react';
import './page-navigation.scss';
import type { PageName } from '../../types/pages';
import type { Language } from '../../types/language';

type PageNavigationProps = {
    currentPage: PageName;
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

const pageOrder: PageName[] = ['about', 'portfolio', 'resume', 'contact'];

const pageLabels: Record<Language, Record<PageName, string>> = {
    en: {
        about: 'About Me',
        portfolio: 'Portfolio',
        resume: 'Resume',
        contact: 'Contact Me',
    },
    no: {
        about: 'Om meg',
        portfolio: 'Portefølje',
        resume: 'CV',
        contact: 'Kontakt meg',
    },
};

const PageNavigation: React.FC<PageNavigationProps> = ({ currentPage, language, onNavigate }) => {
    const currentIndex = pageOrder.indexOf(currentPage);
    const prevPage = pageOrder[(currentIndex - 1 + pageOrder.length) % pageOrder.length];
    const nextPage = pageOrder[(currentIndex + 1) % pageOrder.length];

    const navigateTo = (page: PageName, direction: 'ltr' | 'rtl') => {
        onNavigate?.(page, direction);
        if (!onNavigate) {
            window.location.hash = `#${page}`;
        }
    };

    return (
        <nav className="page-navigation" aria-label="Page navigation">
            <button
                type="button"
                className="page-nav__link page-nav__link--prev"
                onClick={() => navigateTo(prevPage, 'ltr')}
                aria-label={`Go to ${pageLabels[language][prevPage]}`}
            >
                <span className="page-nav__arrow" aria-hidden="true">
                    ←
                </span>
                <span className="page-nav__label">{pageLabels[language][prevPage]}</span>
            </button>
            <div className="page-nav__divider" aria-hidden="true" />
            <button
                type="button"
                className="page-nav__link page-nav__link--next"
                onClick={() => navigateTo(nextPage, 'rtl')}
                aria-label={`Go to ${pageLabels[language][nextPage]}`}
            >
                <span className="page-nav__label">{pageLabels[language][nextPage]}</span>
                <span className="page-nav__arrow" aria-hidden="true">
                    →
                </span>
            </button>
        </nav>
    );
};

export default PageNavigation;
