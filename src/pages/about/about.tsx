import '../../assets/styles.scss';
import '../pages.scss';
import './about.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../../types/language';
import type { PageName } from '../../types/pages';
import PageNavigation from '../../components/page-navigation/page-navigation';
import Arrow from '../../components/icons/arrow/arrow';
import DropdownContainer from '../../components/icons/containers/dropdown/dropdown-container';
import type { Technology } from '../../components/icons/icons-data';
import aboutCopyData from './about.copy.json';
import { categoryDefinitions, type CategoryId } from './data/about-categories';
import DeveloperContent from './components/developer-content';
import MusicianContent from './components/musician-content';
import megUtenBakgrunn from '../../assets/images/me/Meg_uten_bakgrunn.png';
import megUtenMeg from '../../assets/images/me/Meg_uten_meg.png';
import useScrollSnapTouch from '../../utility/scroll-snap-touch';
import useScrollSnapMousewheel from '../../utility/scroll-snap-mousewheel';

type AboutProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type LinkParagraph = {
    prefix: string;
    links: { label: string; href: string; suffix: string }[];
};

type QuoteParagraph = {
    prefix: string;
    quote: string;
    suffix: string;
};

type AboutCopy = {
    pageHeading: string;
    heading: string;
    subheading: string;
    paragraphs: Array<string | QuoteParagraph>;
    linkParagraph: LinkParagraph;
    buttons: { label: string; page: PageName; variant: 'primary' | 'secondary' }[];
    categories: Record<CategoryId, { title: string; description: string }>;
    developerIntro: string;
    musicianIntro: string;
    developerTiles: { id: string; title: string; technologies: Technology[] }[];
};

const aboutCopy = aboutCopyData as Record<Language, AboutCopy>;

const About: React.FC<AboutProps> = ({ language, onNavigate }) => {
    const {
        pageHeading,
        heading,
        subheading,
        paragraphs,
        linkParagraph,
        buttons,
        categories,
        developerIntro,
        musicianIntro,
        developerTiles,
    } = aboutCopy[language];
    const categoryInfo = categories;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const paragraphBlocks: Array<string | LinkParagraph | QuoteParagraph> = [...paragraphs, linkParagraph];
    const [openSections, setOpenSections] = useState<Record<CategoryId, boolean>>(() =>
        categoryDefinitions.reduce(
            (acc, category) => ({
                ...acc,
                [category.id]: category.defaultOpen,
            }),
            {} as Record<CategoryId, boolean>,
        ),
    );

    const clearAboutBodyState = () => {
        document.body.removeAttribute('data-about-bg');
        document.body.removeAttribute('data-about-section');
        document.body.removeAttribute('data-about-active');
    };

    const navigateTo = (page: PageName, direction: 'ltr' | 'rtl' = 'ltr') => {
        clearAboutBodyState();
        onNavigate?.(page, direction);
        if (!onNavigate) {
            window.location.assign(`#${page}`);
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
            return <DeveloperContent intro={developerIntro} tiles={developerTiles} />;
        }

        return <MusicianContent intro={musicianIntro} />;
    };

    const handleIndexChange = useCallback((currentIndex: number) => {
        document.body.setAttribute('data-about-bg', currentIndex % 2 === 0 ? 'background' : 'primary');
        document.body.setAttribute('data-about-section', String(currentIndex));
    }, []);

    useScrollSnapTouch({
        containerRef,
        snapSelector: '.about-snap',
        onIndexChange: handleIndexChange,
    });

    useScrollSnapMousewheel({
        containerRef,
        snapSelector: '.about-snap',
        onIndexChange: handleIndexChange,
    });

    useEffect(() => {
        document.body.setAttribute('data-about-active', 'true');
        return () => {
            clearAboutBodyState();
        };
    }, []);

    return (
        <>
            <div className="page-navigation-wrapper">
                <PageNavigation currentPage="about" language={language} onNavigate={onNavigate} />
            </div>
            <div ref={containerRef} className="container page-container about-page">
                <h1 className="page-heading">{pageHeading}</h1>
                {paragraphBlocks.map((paragraph, index) => {
                    const isLinkParagraph = typeof paragraph !== 'string' && 'links' in paragraph;
                    const isQuoteParagraph = typeof paragraph !== 'string' && 'quote' in paragraph;

                    return (
                        <div className="about-paragraph about-snap" key={index}>
                            {index === 0 ? (
                                <div className="about-hero-container">
                                    <div className="about-hero-visual" aria-hidden="true">
                                        <img
                                            className="about-hero-layer about-hero-layer--back"
                                            src={megUtenMeg}
                                            alt=""
                                        />
                                        <img
                                            className="about-hero-layer about-hero-layer--front"
                                            src={megUtenBakgrunn}
                                            alt=""
                                        />
                                    </div>
                                    <div className="about-hero-text">

                                        <h2 className="hero-name">{heading}</h2>
                                        <h3 className="page-subheading">{subheading}</h3>
                                    </div>
                                </div>
                            ) : null}
                            <p>
                                {isLinkParagraph ? (
                                    <>
                                        {paragraph.prefix}
                                        {paragraph.links.map((link, linkIndex) => (
                                            <React.Fragment key={`${link.href}-${linkIndex}`}>
                                                <a className="about-link" href={link.href}>
                                                    {link.label}
                                                </a>
                                                {link.suffix}
                                            </React.Fragment>
                                        ))}
                                    </>
                                ) : isQuoteParagraph ? (
                                    <>
                                        {paragraph.prefix}
                                        <span className="about-quote">{paragraph.quote}</span>
                                        <span className="about-quote-source">{paragraph.suffix}</span>
                                    </>
                                ) : (
                                    paragraph
                                )}
                            </p>
                            {index === paragraphBlocks.length - 1 ? (
                                <>
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
                                                    <div
                                                        id={`${id}-content`}
                                                        className={`dropdown-content${isOpen ? ' expanded' : ''}`}
                                                        aria-live="polite"
                                                    >
                                                        {renderCategoryContent(id)}
                                                    </div>
                                                </section>
                                            );
                                        })}
                                    </DropdownContainer>
                                </>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default About;
