import '../../assets/styles.scss';
import '../pages.scss';
import './about.scss';
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
import Arrow from '../../components/icons/arrow/arrow';
import DropdownContainer from '../../components/icons/containers/dropdown/dropdown-container';

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

export const aboutCopy: Record<Language, AboutContent> = {
    en: {
        heading: 'Yngve Nykaas',
        subheading: 'Frontend-developer',
        paragraphs: [
            "My name is Yngve, and I'm a frontend developer. I have 13 years of work experience in social fields such as kindergarten and personal assistance, hold a vocational certificate in frontend, and have previously studied both electrical engineering and music pedagogy.",
            'When I earned my vocational certificate, the early focus was on HTML5, CSS, and JavaScript, and later we worked more with frameworks like React/Vite and WordPress/Content Management Systems, API integrations, testing with ESLint and Jest, and more efficient languages such as TypeScript and SCSS. I also took part in larger projects where we used Gantt and Kanban methods in GitHub Projects, and some of my tasks included troubleshooting and Search Engine Optimization. I have also been trained in Figma and Adobe XD, where I created flows and prototypes and developed strong UX/UI skills.',
            'At USN, where I studied electrical engineering, I learned backend languages like Python and C#. Python was mostly used to solve advanced math problems, while C# was used to build more practical programs that visualized results in a more user-friendly way.',
            'During this period I also helped found a music club that ran a rehearsal room and organized karaoke nights on a professional stage where we delivered Telemark’s best karaoke experiences (self-proclaimed).',
            "In my spare time I like learning new things in IT. I've started building small iOS apps in Swift, and I'm now testing Codex/AI to bring my ideas into reality. I get a lot of joy from seeing results and a dopamine kick when I troubleshoot the code Codex gives me. So I'm not just a coder, but also a creative soul who always wants to make something new.",
            "My experience from kindergarten has given me a playful style that I use whenever I get the chance. When I do something, I like to do it as well as possible, and if I lack competence in a task, I want to learn it.",
            "People who know me describe me as positive, outgoing, and very helpful, as well as witty and creative. At work I'm innovative, curious, solution-oriented, and adaptable, which makes me a good fit wherever I end up.",
            'When I prompted ChatGPT with this: “Based on how I have used you and what you know about me as a result, briefly explain how I come across to you.”, it replied: “You come across as a very action-oriented, curious, and creative person who always has a new project on the way — and who likes to get things done in a smart and structured way.” - ChatGPT about Yngve Nykås, 2025',
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
        subheading: 'Frontend-utvikler',
        paragraphs: [
            'Mitt navn er Yngve, og jeg er en frontend-utvikler. Jeg har 13 års arbeidserfaring innen sosiale bransjer som barnehage og BPA, har fagbrev i frontend, og har tidligere studert både elektroingeniørfag og musikkpedagogikk.',
            'Da jeg tok fagbrevet var det mye fokus på HTML5, CSS og JavaScript i starten, mens vi senere jobbet mer med rammeverk som React/Vite og WordPress/Content Management Systems, API-tilkoblinger, tester med ESLint og Jest, samt mer effektive språk som TypeScript og SCSS. Jeg var også med på større prosjekter der vi brukte arbeidsmetodene Gantt og Kanban i GitHub Projects, hvor noen av arbeidsoppgavene mine bestod blant annet av feilsøking og Search Engine Optimization. Har også fått opplæring i Figma og Adobe XD, der jeg har laget flows og prototyper, og tilegnet meg god UX/UI-kompetanse.',
            'Ved USN hvor jeg studerte elektroingeniør, lærte jeg backend-språk som Python og C#. Python ble mest brukt til å løse avanserte matteproblemer, mens C# ble brukt til å lage mer praktiske programmer som visualiserte resultater på en mer brukervennlig måte.',
            'I denne perioden var jeg også med på å stifte en musikklubb som driftet et bandrom og arrangerte karaoke-kvelder på en profesjonell scene hvor vi leverte Telemarks beste karaoke-opplevelser (selverklært).',
            'På fritiden liker jeg å lære nye ting innen IT. Jeg har begynt å lage små iOS-apper i Swift, og tester nå Codex/AI for å virkelig få ideene mine ut i virkeligheten. Jeg får mye glede av å se resultatene av arbeidet, og dopaminkick når jeg feilsøker koden som Codex gir meg. Så jeg er ikke bare en koder, men også en kreativ sjel som alltid har lyst til å skape noe nytt.',
            'Erfaringen min fra barnehage har gitt meg en leken stil som jeg bruker hver gang jeg får sjansen. Når jeg gjør noe, liker jeg å gjøre det så bra som mulig, og mangler jeg kompetanse i en oppgave, vil jeg gjerne lære det.',
            'Folk som kjenner meg, vil beskrive meg som positiv, utadvendt og svært hjelpsom, samtidig vittig og kreativ. I jobb er jeg innovativ, nysgjerrig, løsningsorientert og tilpasningsdyktig, som gjør at jeg passer godt inn uansett hvor jeg ender.',
            'Da jeg promptet ChatGPT dette: «Utifra det jeg har brukt deg til og det du vet om meg som et resultat, forklar kort hvordan jeg oppleves av deg.», svarte den: «Du virker som en svært handlekraftig, nysgjerrig og skapende person som alltid har et nytt prosjekt på vei – og som liker å få ting gjort på en smart og strukturert måte.» - ChatGPT om Yngve Nykås, 2025',
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
