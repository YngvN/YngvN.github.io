import '../../assets/styles.scss';
import '../pages.scss';
import './about.scss';
import React, { useEffect, useRef, useState } from 'react';
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
import megUtenBakgrunn from '../../assets/images/me/Meg_uten_bakgrunn.png';
import megUtenMeg from '../../assets/images/me/Meg_uten_meg.png';

type AboutProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};


const About: React.FC<AboutProps> = ({ language, onNavigate }) => {
    const { heading, subheading, paragraphs, buttons } = aboutCopy[language];
    const categoryInfo = aboutCategoryCopy[language];
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isScrollingRef = useRef(false);
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
        delete document.body.dataset.aboutBg;
        delete document.body.dataset.aboutSection;
        delete document.body.dataset.aboutActive;
    };

    const navigateTo = (page: PageName, direction: 'ltr' | 'rtl' = 'ltr') => {
        clearAboutBodyState();
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

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return undefined;
        }

        const getSnapTargets = () =>
            Array.from(container.querySelectorAll<HTMLElement>('.about-snap'));

        const setBodyScrollState = () => {
            const snapTargets = getSnapTargets();
            if (snapTargets.length === 0) {
                return;
            }

            const scrollTop = container.scrollTop;
            let currentIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            snapTargets.forEach((target, index) => {
                const distance = Math.abs(target.offsetTop - scrollTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    currentIndex = index;
                }
            });

            document.body.dataset.aboutBg = currentIndex % 2 === 0 ? 'background' : 'primary';
            document.body.dataset.aboutSection = String(currentIndex);
        };

        const handleWheel = (event: WheelEvent) => {
            if (isScrollingRef.current) {
                event.preventDefault();
                return;
            }

            const snapTargets = getSnapTargets();

            if (snapTargets.length === 0) {
                return;
            }

            const direction = event.deltaY > 0 ? 1 : -1;
            const scrollTop = container.scrollTop;
            let currentIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            snapTargets.forEach((target, index) => {
                const distance = Math.abs(target.offsetTop - scrollTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    currentIndex = index;
                }
            });

            const nextIndex = currentIndex + direction;
            const nextTarget = snapTargets[nextIndex];

            if (!nextTarget) {
                return;
            }

            event.preventDefault();
            isScrollingRef.current = true;
            container.scrollTo({ top: nextTarget.offsetTop, behavior: 'smooth' });

            window.setTimeout(() => {
                isScrollingRef.current = false;
            }, 500);
        };

        let isTicking = false;
        const handleScroll = () => {
            if (isTicking) {
                return;
            }

            isTicking = true;
            window.requestAnimationFrame(() => {
                setBodyScrollState();
                isTicking = false;
            });
        };

        setBodyScrollState();
        document.body.dataset.aboutActive = 'true';
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('scroll', handleScroll);
            clearAboutBodyState();
        };
    }, []);

    return (
        <div ref={containerRef} className="container page-container about-page">
            <PageNavigation currentPage="about" language={language} onNavigate={onNavigate} />
            {paragraphs.map((paragraph, index) => (
                <div className="about-paragraph about-snap" key={index}>
                    {index === 0 ? (
                        <>
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
                                <div className="about-hero-text">
                                    <h1 className="page-heading">{heading}</h1>
                                    <h2 className="page-subheading">{subheading}</h2>
                                </div>
                            </div>
                        </>
                    ) : null}
                    <p>{paragraph}</p>
                    {index === paragraphs.length - 1 ? (
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
                                            <div id={`${id}-content`} className={`dropdown-content${isOpen ? ' expanded' : ''}`} aria-live="polite">
                                                {renderCategoryContent(id)}
                                            </div>
                                        </section>
                                    );
                                })}
                            </DropdownContainer>
                        </>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default About;
