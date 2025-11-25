import '../../assets/styles.scss';
import '../pages.scss';
import React, { useState } from 'react';
import type { Language } from '../../types/language';
import type { PageName } from '../../types/pages';
import {
    TechLogoGrid,
    IconTagGrid,
    creativeItems,
} from '../../components/icons/icons';
import type { Technology } from '../../components/icons/icons';
import PageNavigation from '../../components/page-navigation/page-navigation';

type AboutProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type AboutContent = {
    heading: string;
    subheading: string;
    paragraphs: React.ReactNode[];
    buttons: { label: string; page: PageName; variant: 'primary' | 'secondary' }[];
};

type CategoryId = 'developer' | 'musician';

type CategoryDefinition = {
    id: CategoryId;
    defaultOpen: boolean;
};

type DeveloperTile = {
    id: string;
    title: Record<Language, string>;
    technologies: Technology[];
};

const categoryDefinitions: CategoryDefinition[] = [
    { id: 'developer', defaultOpen: false },
    { id: 'musician', defaultOpen: false },
];

const aboutCopy: Record<Language, AboutContent> = {
    en: {
        heading: 'Yngve Nykaas',
        subheading: 'Frontend developer',
        paragraphs: [
            "Hello! I'm Yngve Nykås, an educated frontend developer with some experience on the backend side as well.",
            'As a developer I love testing out new ideas to see what could be exciting to build next.',
            <>
                If you are curious you can view my{' '}
                <a className="about-link" href="#portfolio">
                    portfolio
                </a>{' '}
                here. You can also check out my{' '}
                <a className="about-link" href="#resume">
                    résumé
                </a>{' '}
                here.
            </>,
        ],
        buttons: [
            { label: 'View Portfolio', page: 'portfolio', variant: 'primary' },
            { label: 'View Résumé', page: 'resume', variant: 'secondary' },
        ],
    },
    no: {
        heading: 'Yngve Nykås',
        subheading: 'Frontendutvikler',
        paragraphs: [
            'Hallo! Jeg er Yngve Nykås, og jeg er en utdannet frontend utvikler med noe erfaring innenfor backend.',
            'Som utvikler liker jeg å prøve nye ting for å se hva som kan være kult å gjøre.',
            <>
                Om du er nysgjerrig kan du se{' '}
                <a className="about-link" href="#portfolio">
                    porteføljen min
                </a>{' '}
                her. Du kan også sjekke ut{' '}
                <a className="about-link" href="#resume">
                    CV-en min
                </a>{' '}
                her.
            </>,
        ],
        buttons: [
            { label: 'Se porteføljen', page: 'portfolio', variant: 'primary' },
            { label: 'Se CV-en', page: 'resume', variant: 'secondary' },
        ],
    },
};

const aboutCategoryCopy: Record<
    Language,
    Record<CategoryId, { title: string; description: string }>
> = {
    en: {
        developer: {
            title: 'Developer',
            description: 'My technical expertise and experience',
        },
        musician: {
            title: 'Creative Work',
            description:
                'Other work as a creative person',
        },
    },
    no: {
        developer: {
            title: 'Utvikler',
            description: 'Min tekniske kompetanse og erfaring',
        },
        musician: {
            title: 'Kreativt arbeid',
            description:
                'Annet arbeid som kreativ person',
        },
    },
};

const developerTiles: DeveloperTile[] = [
    {
        id: 'core-web',
        title: {
            en: 'Core Web Stack',
            no: 'Kjerne-teknologier',
        },
        technologies: ['javascript', 'typescript', 'html', 'css'],
    },
    {
        id: 'frameworks',
        title: {
            en: 'Frameworks & Platforms',
            no: 'Rammeverk og plattformer',
        },
        technologies: ['react', 'vite', 'wordpress', 'swift'],
    },
    {
        id: 'styling-design',
        title: {
            en: 'Styling & Design',
            no: 'Design og styling',
        },
        technologies: ['sass', 'bootstrap', 'figma', 'adobexd', 'illustrator'],
    },
    {
        id: 'backend-testing',
        title: {
            en: 'Back-end & Testing',
            no: 'Back-end og testing',
        },
        technologies: ['sql', 'csharp', 'python', 'jest', 'cypress'],
    },
];

const developerIntroCopy: Record<Language, string> = {
    en: 'As a developer I have worked across frontend and backend through my studies. In electrical engineering the focus was mostly on servers and small programs, while in frontend it was more about design and testing. Swift is something I am experimenting with in my spare time.',
    no: 'Som utvikler har jeg vært innom både frontend og backend, begge relatert til utdanning. På elektroingeniør var det mest fokus på servere og mindre programmer, mens på frontend var det mer design og testing. Swift prøver jeg meg på nå i fritiden.',
};

const musicianCopy: Record<
    Language,
    {
        intro: string;
    }
> = {
    en: {
        intro: 'I have been interested in music my entire life and have also studied it. That has given me skills across instruments and music tech. I have been on and off stage in larger and smaller projects, founded and led music clubs, produced music, and developed a playfulness that Oslohjelpa called “the best session they had been to in kindergarten.”',
    },
    no: {
        intro: 'Jeg har vært interessert musikk i hele livet mit, og har også studert musikk. Da har jeg opparbeidet kompetanse i diverse instrumenter og teknologier. Jeg har vært både på og av scenen i større og mindre prosjekter, stiftet og ledet musikklubber, produsert musikk, og utviklet en lekenhet som i følge Oslohjelpa var "Den beste samlingen de hadde vært på i barnehage".',
    },
};

const About: React.FC<AboutProps> = ({ language, onNavigate }) => {
    const { heading, subheading, paragraphs, buttons } = aboutCopy[language];
    const categoryInfo = aboutCategoryCopy[language];
    const musicianContent = musicianCopy[language];
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
            return (
                <div className="developer-content">
                    <p>{developerIntroCopy[language]}</p>
                    <div className="tech-tiles">
                        {developerTiles.map(({ id: tileId, title, technologies }) => (
                            <div className="tech-tile" key={tileId}>
                                <h3>{title[language]}</h3>
                                <TechLogoGrid technologies={technologies} keyPrefix={tileId} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="musician-content">
                <p>{musicianContent.intro}</p>
                <IconTagGrid items={creativeItems} className="creative-logo-grid" />
            </div>
        );
    };

    return (
        <div className="container page-container">
            <PageNavigation currentPage="about" language={language} />
            <h1 className="page-heading">{heading}</h1>
            <h2 className="page-subheading">{subheading}</h2>
            {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
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
            <div className="about-categories">
                {categoryDefinitions.map(({ id }) => {
                    const { title, description } = categoryInfo[id];
                    const isOpen = openSections[id];

                    return (
                        <section key={id} className={`about-category${isOpen ? ' open' : ''}`}>
                            <button
                                type="button"
                                className="category-toggle"
                                onClick={() => toggleSection(id)}
                                aria-expanded={isOpen}
                                aria-controls={`${id}-content`}
                            >
                                <div>
                                    <span className="category-title">{title}</span>
                                    <span className="category-description">{description}</span>
                                </div>
                                <span className="category-toggle__chevron" aria-hidden="true" />
                            </button>
                            <div id={`${id}-content`} className={`category-content${isOpen ? ' expanded' : ''}`} aria-live="polite">
                                {renderCategoryContent(id)}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default About;
