import '../../assets/styles.scss';
import '../pages.scss';
import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Language } from '../../types/language';
import type { PageName } from '../../types/pages';

type AboutProps = {
    language: Language;
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

type Technology =
    | 'vite'
    | 'react'
    | 'typescript'
    | 'sass'
    | 'html'
    | 'css'
    | 'javascript'
    | 'sql'
    | 'csharp'
    | 'python'
    | 'swift'
    | 'jest'
    | 'cypress'
    | 'bootstrap'
    | 'adobexd'
    | 'figma'
    | 'illustrator'
    | 'wordpress';

type DeveloperTile = {
    id: string;
    title: Record<Language, string>;
    technologies: Technology[];
};

const categoryDefinitions: CategoryDefinition[] = [
    { id: 'developer', defaultOpen: true },
    { id: 'musician', defaultOpen: false },
];

const aboutCopy: Record<Language, AboutContent> = {
    en: {
        heading: 'Yngve Nykaas',
        subheading: 'Educated frontend developer',
        paragraphs: [
            "Hello! I'm Yngve Nykås, a trained frontend developer with some experience on the backend side as well.",
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
        subheading: 'Utdannet frontendutvikler',
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
            description:
                'As a developer I have worked across frontend and backend through my studies. In electrical engineering the focus was mostly on servers and small programs, while in frontend it was more about design and testing. Swift is something I am experimenting with in my spare time.',
        },
        musician: {
            title: 'Musician',
            description: 'My creative outlet after work hours—writing, practicing, and performing music.',
        },
    },
    no: {
        developer: {
            title: 'Utvikler',
            description:
                'Som utvikler har jeg vært innom både frontend og backend, begge relatert til utdanning. På elektroingeniør var det mest fokus på servere og mindre programmer, mens på frontend var det mer design og testing. Swift prøver jeg meg på nå i fritiden.',
        },
        musician: {
            title: 'Musiker',
            description: 'Den kreative arenaen etter jobb – komponering, øving og opptredener.',
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

const technologyMeta: Record<
    Technology,
    { label: string; shorthand: string; background: string; color: string; logoUrl?: string }
> = {
    vite: { label: 'Vite', shorthand: 'V', background: 'linear-gradient(135deg,#FFEA83,#FFA800)', color: '#4c1d95', logoUrl: 'https://cdn.simpleicons.org/vite/646CFF' },
    react: { label: 'React', shorthand: '⚛︎', background: '#1f2937', color: '#61dafb', logoUrl: 'https://cdn.simpleicons.org/react/61DAFB' },
    typescript: { label: 'TypeScript', shorthand: 'TS', background: '#1f75cb', color: '#ffffff', logoUrl: 'https://cdn.simpleicons.org/typescript/3178C6' },
    sass: { label: 'Sass', shorthand: 'Sa', background: '#cf649a', color: '#ffffff', logoUrl: 'https://cdn.simpleicons.org/sass/CC6699' },
    html: { label: 'HTML5', shorthand: 'HTML', background: '#e34c26', color: '#ffffff', logoUrl: 'https://cdn.simpleicons.org/html5/E34F26' },
    css: { label: 'CSS', shorthand: 'CSS', background: '#1572b6', color: '#ffffff', logoUrl: 'https://cdn.simpleicons.org/css3/1572B6' },
    javascript: { label: 'JavaScript', shorthand: 'JS', background: '#f7df1e', color: '#1f2933', logoUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    sql: { label: 'SQL', shorthand: 'SQL', background: '#0f172a', color: '#38bdf8', logoUrl: 'https://cdn.simpleicons.org/postgresql/4169E1' },
    csharp: { label: 'C#', shorthand: 'C#', background: '#6f2dbd', color: '#f8fafc', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/csharp.svg' },
    python: { label: 'Python', shorthand: 'Py', background: 'linear-gradient(135deg,#306998,#ffd343)', color: '#0f172a', logoUrl: 'https://cdn.simpleicons.org/python/3776AB' },
    swift: { label: 'Swift', shorthand: 'Sw', background: '#f05138', color: '#fff7ed', logoUrl: 'https://cdn.simpleicons.org/swift/FA7343' },
    jest: { label: 'Jest', shorthand: 'Je', background: '#99425b', color: '#ffe4e6', logoUrl: 'https://cdn.simpleicons.org/jest/C21325' },
    cypress: { label: 'Cypress', shorthand: 'Cy', background: '#0f766e', color: '#ecfeff', logoUrl: 'https://cdn.simpleicons.org/cypress/69D3A7' },
    bootstrap: { label: 'Bootstrap', shorthand: 'B', background: '#563d7c', color: '#ede9fe', logoUrl: 'https://cdn.simpleicons.org/bootstrap/7952B3' },
    adobexd: { label: 'Adobe XD', shorthand: 'XD', background: '#470137', color: '#ff61f6', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobexd.svg' },
    figma: { label: 'Figma', shorthand: 'Fg', background: 'linear-gradient(135deg,#f24e1e,#a259ff)', color: '#fef2f2', logoUrl: 'https://cdn.simpleicons.org/figma/F24E1E' },
    illustrator: { label: 'Illustrator', shorthand: 'Ai', background: '#310', color: '#ff9a00', logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobeillustrator.svg' },
    wordpress: { label: 'WordPress', shorthand: 'W', background: '#21759b', color: '#ffffff', logoUrl: 'https://cdn.simpleicons.org/wordpress/21759B' },
};

const musicianCopy: Record<
    Language,
    {
        intro: string;
        instrumentsHeading: string;
        instruments: string[];
        highlightsHeading: string;
        highlights: string[];
    }
> = {
    en: {
        intro: 'I spend evenings writing and arranging songs, often blending acoustic textures with electronic elements.',
        instrumentsHeading: 'Instruments & Roles',
        instruments: ['Vocals', 'Electric & Acoustic Guitar', 'Bass', 'Synths', 'Keys', 'Programming'],
        highlightsHeading: 'Highlights',
        highlights: ['Studio sessions with local bands', 'Solo performances at Oslo venues', 'Sound design for indie games'],
    },
    no: {
        intro: 'På kveldstid skriver og arrangerer jeg musikk hvor jeg blander akustiske elementer med elektroniske uttrykk.',
        instrumentsHeading: 'Instrumenter og roller',
        instruments: ['Vokal', 'Elektrisk og akustisk gitar', 'Bass', 'Synther', 'Keys', 'Programmering'],
        highlightsHeading: 'Høydepunkter',
        highlights: ['Studiosesjoner med lokale band', 'Solokonserter på Oslo-scener', 'Lyddesign til indie-spill'],
    },
};

const TechLogo: React.FC<{ tech: Technology }> = ({ tech }) => {
    const meta = technologyMeta[tech];
    const [logoError, setLogoError] = useState(false);
    const showImage = Boolean(meta.logoUrl) && !logoError;
    const style = {
        '--logo-bg': meta.background,
        '--logo-color': meta.color,
    } as CSSProperties;

    return (
        <span className="tech-logo" style={style}>
            {showImage ? (
                <span className="tech-logo__badge tech-logo__badge--image" aria-hidden="true">
                    <img
                        src={meta.logoUrl}
                        loading="lazy"
                        alt=""
                        className="tech-logo__img"
                        onError={() => setLogoError(true)}
                    />
                </span>
            ) : (
                <span className="tech-logo__badge" aria-hidden="true">
                    {meta.shorthand}
                </span>
            )}
            <span className="tech-logo__label">{meta.label}</span>
        </span>
    );
};

const About: React.FC<AboutProps> = ({ language }) => {
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

    const navigateTo = (page: PageName) => {
        window.location.hash = `#${page}`;
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
                <div className="tech-tiles">
                    {developerTiles.map(({ id: tileId, title, technologies }) => (
                        <div className="tech-tile" key={tileId}>
                            <h3>{title[language]}</h3>
                            <div className="tech-logo-grid">
                                {technologies.map((tech) => (
                                    <TechLogo key={`${tileId}-${tech}`} tech={tech} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="musician-content">
                <p>{musicianContent.intro}</p>
                <div className="musician-columns">
                    <div>
                        <h3>{musicianContent.instrumentsHeading}</h3>
                        <ul>
                            {musicianContent.instruments.map((instrument) => (
                                <li key={instrument}>{instrument}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>{musicianContent.highlightsHeading}</h3>
                        <ul>
                            {musicianContent.highlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
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
