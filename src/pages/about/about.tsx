import '../../assets/styles.scss';
import '../pages.scss';
import './about.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../../types/language';
import type { PageName } from '../../types/pages';
import PageNavigation from '../../components/page-navigation/page-navigation';
import aboutCopyData from './about.copy.json';
import { categoryDefinitions, type CategoryId } from './data/about-categories';
import DeveloperContent from './components/developer-content';
import MusicianContent from './components/musician-content';
import AboutHero from './components/about-hero';
import AboutParagraph from './components/about-paragraph';
import AboutActions from './components/about-actions';
import megUtenBakgrunn from '../../assets/images/me/Meg_uten_bakgrunn.png';
import megUtenMeg from '../../assets/images/me/Meg_uten_meg.png';
import useScrollSnapTouch from '../../utility/scroll-snap-touch';
import useScrollSnapMousewheel from '../../utility/scroll-snap-mousewheel';
import type { AboutCopy, LinkParagraph, QuoteParagraph } from './types';

type AboutProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
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
        setOpenSections((prev) => {
            const nextState = (Object.keys(prev) as CategoryId[]).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: false,
                }),
                {} as Record<CategoryId, boolean>,
            );
            nextState[id] = !prev[id];
            return nextState;
        });
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
                    return (
                        <div className="about-paragraph about-snap" key={index}>
                            {index === 0 ? (
                                <AboutHero
                                    heading={heading}
                                    subheading={subheading}
                                    backgroundImageSrc={megUtenMeg}
                                    foregroundImageSrc={megUtenBakgrunn}
                                />
                            ) : null}
                            <AboutParagraph paragraph={paragraph} />
                            {index === paragraphBlocks.length - 1 ? (
                                <AboutActions
                                    buttons={buttons}
                                    onNavigateTo={navigateTo}
                                    categoryInfo={categoryInfo}
                                    openSections={openSections}
                                    onToggleSection={toggleSection}
                                    renderCategoryContent={renderCategoryContent}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default About;
