import '../../assets/styles.scss';
import '../pages.scss';
import './about.scss';
import React, { useState } from 'react';
import type { Language } from '../../types/language';
import type { PageName } from '../../types/pages';
import PageNavigation from '../../components/page-navigation/page-navigation';
import Arrow from '../../components/icons/arrow/arrow';
import DropdownContainer from '../../components/icons/containers/dropdown/dropdown-container';
import { aboutCopy } from './data/about-copy';
import {
    aboutCategoryCopy,
    categoryDefinitions,
    type CategoryId,
} from './data/about-categories';
import DeveloperContent from './components/developer-content';
import MusicianContent from './components/musician-content';

type AboutProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};


const About: React.FC<AboutProps> = ({ language, onNavigate }) => {
    const { heading, subheading, paragraphs, buttons } = aboutCopy[language];
    const categoryInfo = aboutCategoryCopy[language];
    const [openSections, setOpenSections] = useState<Record<CategoryId, boolean>>(() =>
        categoryDefinitions.reduce(
            (acc, category) => ({
                ...acc,
                [category.id]: category.defaultOpen,
            }),
            {} as Record<CategoryId, boolean>,
        ),
    );

    const navigateTo = (page: PageName, direction: 'ltr' | 'rtl' = 'ltr') => {
        onNavigate?.(page, direction);
        if (!onNavigate) {
            window.location.hash = `#${page}`;
        }
    };

    const toggleSection = (id: CategoryId) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const renderCategoryContent = (id: CategoryId) => {
        if (id === 'developer') {
            return <DeveloperContent language={language} />;
        }

        return <MusicianContent language={language} />;
    };

    return (
        <div className="container page-container">
            <PageNavigation currentPage="about" language={language} onNavigate={onNavigate} />
            <h1 className="page-heading">{heading}</h1>
            <h2 className="page-subheading">{subheading}</h2>
            {paragraphs.map((paragraph, index) => (
                <div className="about-paragraph" key={index}>
                    <p>{paragraph}</p>
                </div>
            ))}
            <div className="about-cta">
                {buttons.map(({ label, page, variant }) => (
                    <button
                        key={page}
                        type="button"
                        className={`btn btn-${variant === 'primary' ? 'primary' : 'secondary'}`}
                        onClick={() => navigateTo(page)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <DropdownContainer>
                {categoryDefinitions.map(({ id }) => {
                    const { title, description } = categoryInfo[id];
                    const isOpen = openSections[id];

                    return (
                        <section key={id} className={`dropdown-panel container${isOpen ? ' open' : ''}`}>
                            <button
                                type="button"
                                className="dropdown-toggle"
                                onClick={() => toggleSection(id)}
                                aria-expanded={isOpen}
                                aria-controls={`${id}-content`}
                            >
                                <div>
                                    <span className="dropdown-title">{title}</span>
                                    <span className="dropdown-description">{description}</span>
                                </div>
                                <Arrow
                                    direction="down"
                                    open={isOpen}
                                    size="sm"
                                    className="dropdown-toggle__chevron"
                                />
                            </button>
                            <div id={`${id}-content`} className={`dropdown-content${isOpen ? ' expanded' : ''}`} aria-live="polite">
                                {renderCategoryContent(id)}
                            </div>
                        </section>
                    );
                })}
            </DropdownContainer>
        </div>
    );
};

export default About;
