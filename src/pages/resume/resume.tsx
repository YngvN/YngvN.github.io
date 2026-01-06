import '../../assets/styles.scss';
import '../pages.scss';
import './resume.scss';
import React, { useState } from 'react';
import type { Language } from '../../types/language';
import PageNavigation from '../../components/page-navigation/page-navigation';
import type { PageName } from '../../types/pages';
import { aboutCopy } from '../about/data/about-copy';
import DropdownContainer from '../../components/icons/containers/dropdown/dropdown-container';
import Arrow from '../../components/icons/arrow/arrow';

type ResumeProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type Localized = { en: string; no: string };

type ResumeItem = {
    id: string;
    title: Localized;
    institution?: Localized;
    start: Localized;
    end: Localized;
    description?: Localized;
};

type ResumeSection = {
    id: string;
    title: Localized;
    items: ResumeItem[];
};

type ResumeContent = {
    heading: Localized;
    summary: Localized;
    softSkillsHeading: Localized;
    softSkills: Localized[];
    hardSkillsHeading: Localized;
    hardSkills: Localized[];
    sections: ResumeSection[];
};

const currentMonthEnd: Localized = { en: 'November 2025', no: 'November 2025' };

const educationItems: ResumeItem[] = [
    {
        id: 'fe-vocational',
        title: { en: 'Vocational degree in Frontend development', no: 'Fagbrev i Frontend utvikling' },
        institution: { en: 'Noroff', no: 'Noroff' },
        start: { en: 'August 2022', no: 'August 2022' },
        end: { en: 'May 2025', no: 'Mai 2025' },
        description: {
            en: 'Worked independently throughout the program, joined larger internal projects in the second year with a focus on SEO. Learned prototyping with XD and Figma, project methodology such as Gantt, and worked with frameworks like React and Bootstrap.',
            no: 'Jobbet mye selvstendig under utdanningen, var med på større interne prosjekter i andre året, med fokus på SEO. Lærte om prototyper med XD og Figma, arbeidsmetodikk som Gantt, og jobbet med rammeverk som React og Bootstrap.',
        },
    },
    {
        id: 'electrical-engineering',
        title: { en: 'Electrical Engineering DNF', no: 'Elektro ingeniør I/F' },
        institution: { en: 'University of South-Eastern Norway', no: 'Universitetet i Sør-øst Norge' },
        start: { en: 'August 2021', no: 'August 2021' },
        end: { en: 'May 2022', no: 'Mai 2022' },
        description: {
            en: 'Worked with hardware and software. Liked programming more than imaginary numbers, so I switched to development studies. Learned Python, C#, and SQL programming.',
            no: 'Jobbet med både hardware og software. Likte programmering mer enn imaginære tall, så byttet til utvikler-utdanning. Her lærte jeg om Python, C#, og SQL programmering.',
        },
    },
    {
        id: 'music-bachelor',
        title: { en: 'Music Teacher DNF', no: 'Faglærer i musikk I/F' },
        institution: { en: 'Western Norway University of Applied Sciences (Stord)', no: 'Høgskolen på Vestlandet, Campus Stord' },
        start: { en: 'August 2012', no: 'August 2012' },
        end: { en: 'February 2017', no: 'Februar 2017' },
        description: {
            en: 'Pedagogy, didactics, ensemble work, and larger productions such as concerts.',
            no: 'Pedagogikk og didaktikk, samspill og prosjektarbeid som konserter og produksjoner.',
        },
    },
];

const workItems: ResumeItem[] = [
    {
        id: 'ulvenparken',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Ulvenparken Barnehage', no: 'Ulvenparken Barnehage' },
        start: { en: 'September 2025', no: 'September 2025' },
        end: currentMonthEnd,
        description: { en: 'Worked with toddlers and facility upkeep.', no: 'Arbeid med småbarn og vedlikehold av barnehagen.' },
    },
    {
        id: 'gardstunet',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Gårdstunet Barnehage', no: 'Gårdstunet Barnehage' },
        start: { en: 'January 2025', no: 'Januar 2025' },
        end: currentMonthEnd,
        description: {
            en: 'Long-term role covering pedagogy and practical improvements at the kindergarten.',
            no: 'Fast over lengre periode, både pedagogisk arbeid og praktisk forbedring av barnehagen.',
        },
    },
    {
        id: 'pvs-2024',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Pedagogisk Vikarsentral AS', no: 'Pedagogisk Vikarsentral AS' },
        start: { en: 'March 2024', no: 'Mars 2024' },
        end: currentMonthEnd,
        description: { en: 'Worked across multiple kindergartens with varied age groups and needs.', no: 'Jobbet i flere barnehager med ulike aldersgrupper og behov.' },
    },
    {
        id: 'creer-omsorg',
        title: { en: 'Care assistant', no: 'Helseinstitusjonsassistent' },
        institution: { en: 'Creer Omsorg AS', no: 'Creer Omsorg AS' },
        start: { en: 'April 2021', no: 'April 2021' },
        end: { en: 'January 2023', no: 'Januar 2023' },
        description: { en: 'Rotational care in a residence for a person with developmental disabilities.', no: 'Turnusarbeid i bolig for utviklingshemmet person.' },
    },
    {
        id: 'rishaven-short',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Rishaven Menighetsbarnehage', no: 'Rishaven Menighetsbarnehage' },
        start: { en: 'December 2022', no: 'Desember 2022' },
        end: { en: 'December 2022', no: 'Desember 2022' },
        description: { en: 'Worked with children of varied ages and practical tasks.', no: 'Arbeidet med barn i ulike aldersgrupper og praktiske oppgaver.' },
    },
    {
        id: 'lundetangen',
        title: { en: 'Barkeeper / Sound tech', no: 'Barkeeper' },
        institution: { en: 'Lundetangen Pub Drift AS', no: 'Lundetangen Pub Drift AS' },
        start: { en: 'July 2022', no: 'Juli 2022' },
        end: { en: 'October 2022', no: 'Oktober 2022' },
        description: { en: 'Sound tech and audience support.', no: 'Lydtekniker og publikumsstøtte.' },
    },
    {
        id: 'lundedalen',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Lundedalen Barnehage', no: 'Lundedalen Barnehage' },
        start: { en: 'August 2020', no: 'August 2020' },
        end: { en: 'June 2021', no: 'Juni 2021' },
        description: { en: 'Worked with various age groups.', no: 'Arbeidet med ulike aldersgrupper.' },
    },
    {
        id: 'rishaven-2020',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Rishaven Menighetsbarnehage', no: 'Rishaven Menighetsbarnehage' },
        start: { en: 'August 2019', no: 'August 2019' },
        end: { en: 'August 2020', no: 'August 2020' },
    },
    {
        id: 'pvs-2019',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Pedagogisk Vikarsentral AS', no: 'Pedagogisk Vikarsentral AS' },
        start: { en: 'June 2018', no: 'Juni 2018' },
        end: { en: 'June 2019', no: 'Juni 2019' },
    },
    {
        id: 'steinspranget',
        title: { en: 'Childcare worker', no: 'Barnehageassistent' },
        institution: { en: 'Steinspranget Barnehage', no: 'Steinspranget Barnehage' },
        start: { en: 'January 2018', no: 'Januar 2018' },
        end: { en: 'May 2018', no: 'Mai 2018' },
    },
    {
        id: 'stord-kommune',
        title: { en: 'Support worker (care services)', no: 'Miljøassistent (helse- og sosialtjenester)' },
        institution: { en: 'Stord kommune Åsen bustader', no: 'Stord kommune Åsen bustader' },
        start: { en: 'December 2012', no: 'Desember 2012' },
        end: { en: 'December 2017', no: 'Desember 2017' },
        description: { en: 'Residence for people with disabilities; music and activities to enrich daily life.', no: 'Bolig for utviklingshemmede; musikk og aktiviteter for å berike hverdagen.' },
    },
    {
        id: 'gjerpen',
        title: { en: 'Primary school teacher', no: 'Lærer (grunnskole)' },
        institution: { en: 'Gjerpen barneskole', no: 'Gjerpen barneskole' },
        start: { en: 'February 2014', no: 'Februar 2014' },
        end: { en: 'June 2014', no: 'Juni 2014' },
    },
];

const otherItems: ResumeItem[] = [
    {
        id: 'fadder',
        title: { en: 'Student mentor (Fadder)', no: 'Fadder' },
        start: { en: 'August 2013', no: 'August 2013' },
        end: { en: 'November 2023', no: 'November 2023' },
        description: {
            en: 'Served as a mentor almost every year I studied, often chosen as the student council representative; heard from several students that they wished they had me as a mentor.',
            no: 'Var fadder nesten hvert år jeg har studert, og ble nesten alltid valgt som studentrådsrepresentant. Fikk tilbakemeldinger på at flere ønsket at de hadde meg som fadder.',
        },
    },
    {
        id: 'studentraad',
        title: { en: 'Student council representative', no: 'Studentrådsrepresentant' },
        start: { en: 'August 2012', no: 'August 2012' },
        end: { en: 'May 2023', no: 'Mai 2023' },
        description: {
            en: 'Elected to represent students across multiple study programs, ensuring their feedback reached faculty and administration.',
            no: 'Valgt til å representere studenter i flere studieløp, og sørget for at tilbakemeldinger nådde faglærere og administrasjon.',
        },
    },
    {
        id: 'musikklubb',
        title: { en: 'Founder and leader of student club', no: 'Stifter og leder for studentforening' },
        start: { en: 'August 2021', no: 'August 2021' },
        end: { en: 'May 2022', no: 'Mai 2022' },
        description: {
            en: 'Founded the Music Club at USN. Procured and managed equipment worth over 100,000 NOK, and ran karaoke nights on a professional stage while coordinating stage crews and audiences of 400+.',
            no: 'Grunnla Musikklubben ved USN. Anskaffet og driftet utstyr for over 100 000 kr, samt drev karaokekvelder på profesjonell scene hvor jeg koordinerte scenearbeidere og publikum på over 400 personer.',
        },
    },
    {
        id: 'festivo',
        title: { en: 'Conductor in Festivo', no: 'Dirigent i Festivo' },
        start: { en: 'September 2016', no: 'September 2016' },
        end: { en: 'September 2017', no: 'September 2017' },
        description: { en: 'Conducted a choir for people with developmental disabilities.', no: 'Dirigerte kor for utviklingshemmede.' },
    },
    {
        id: 'styremedlem',
        title: { en: 'Board member in student association', no: 'Styremedlem i studentforening' },
        start: { en: 'March 2016', no: 'Mars 2016' },
        end: { en: 'August 2017', no: 'August 2017' },
        description: { en: 'Board member in the student welfare organization at HVL.', no: 'Styremedlem i Studentsamskipnaden ved HVL.' },
    },
];

const resumeSections: ResumeSection[] = [
    { id: 'education', title: { en: 'Education & Certifications', no: 'Utdanning og fagbrev' }, items: educationItems },
    { id: 'work', title: { en: 'Work Experience', no: 'Arbeidserfaring' }, items: workItems },
    { id: 'other', title: { en: 'Volunteer work', no: 'Verv/Frivillig' }, items: otherItems },
];

const resumeCopy: ResumeContent = {
    heading: { en: 'Résumé', no: 'CV' },
    summary: {
        en: 'I hold a vocational certificate in frontend development and studied electrical engineering at USN. I also have 13 years of experience in social roles that I now want to use in new projects. I am driven by trying new technologies, creating innovative solutions, and debugging what Codex helps me with. As a person I am solution-oriented, handle pressure well, and can take a leadership role when needed. Even though I lack directly relevant work experience, I am eager to learn and curious about most things.',
        no: 'Jeg har fagbrev innen frontend-utvikling, samt studert elektro-ingeniør ved USN. I tillegg har jeg 13 års arbeidserfaring innenfor sosiale jobber som jeg nå vil bruke i nye prosjekter. Det som driver meg er å prøve nye teknologier, lage innovative løsninger, og feilsøke det Codex hjelper meg med. Som person er jeg løsningsorientert, klarer å jobbe under press, og kan ta en lederrolle når det trengs. Selv om jeg mangler relevant jobberfaring, er jeg lærevillig og nysgjerrig på det meste.',
    },
    softSkillsHeading: { en: 'Soft Skills', no: 'Personlige egenskaper' },
    softSkills: [
        { en: 'Solution-oriented', no: 'Løsnings-orientert' },
        { en: 'Results-driven', no: 'Resultat-styrt' },
        { en: 'Structured', no: 'Strukturert' },
        { en: 'Creative', no: 'Kreativ' },
        { en: 'Patient', no: 'Tålmodig' },
        { en: 'Eager to learn', no: 'Lærevillig' },
        { en: 'Curious', no: 'Nysgjerrig' },
        { en: 'Engaged', no: 'Engasjert' },
    ],
    hardSkillsHeading: { en: 'Hard Skills', no: 'Ferdigheter' },
    hardSkills: [
        { en: 'Debugging', no: 'Feilsøking' },
        { en: 'HTML5', no: 'HTML5' },
        { en: 'JavaScript', no: 'JavaScript' },
        { en: 'SCSS', no: 'SCSS' },
        { en: 'TypeScript', no: 'TypeScript' },
        { en: 'Vite', no: 'Vite' },
        { en: 'React', no: 'React' },
        { en: 'Swift', no: 'Swift' },
        { en: 'Codex', no: 'Codex' },
        { en: 'VS Code', no: 'VSC' },
        { en: 'Xcode', no: 'Xcode' },
        { en: 'Kanban', no: 'KanBan' },
    ],
    sections: resumeSections,
};

const Resume: React.FC<ResumeProps> = ({ language, onNavigate }) => {
    const { heading, subheading } = aboutCopy[language];
    const { summary, softSkillsHeading, softSkills, hardSkillsHeading, hardSkills, sections } = resumeCopy;
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
        resumeSections.reduce(
            (acc, { id }) => ({
                ...acc,
                [id]: true,
            }),
            {} as Record<string, boolean>,
        ),
    );

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSectionClick = (id: string) => {
        if (openSections[id]) {
            toggleSection(id);
        }
    };

    return (
        <div className="container page-container resume">
            <PageNavigation currentPage="resume" language={language} onNavigate={onNavigate} />
            <h1 className="page-heading">{heading}</h1>
            <h2 className="page-subheading">{subheading}</h2>
            <p className="resume__summary">{summary[language]}</p>
            <div className="resume__skills">
                <div className="resume__skills-group">
                    <h2 className="resume-section__title">{softSkillsHeading[language]}</h2>
                    <ul className="resume__skills-list">
                        {softSkills.map((skill, idx) => (
                            <li key={idx} className="resume__skill">
                                {skill[language]}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="resume__skills-group">
                    <h2 className="resume-section__title">{hardSkillsHeading[language]}</h2>
                    <ul className="resume__skills-list">
                        {hardSkills.map((skill, idx) => (
                            <li key={idx} className="resume__skill">
                                {skill[language]}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <DropdownContainer className="resume__sections">
                {sections.map(({ id, title, items }) => {
                    const isOpen = openSections[id];

                    return (
                        <section
                            key={id}
                            className={`dropdown-panel resume-section${isOpen ? ' open' : ''}`}
                            onClick={() => handleSectionClick(id)}
                        >
                            <button
                                type="button"
                                className="dropdown-toggle"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleSection(id);
                                }}
                                aria-expanded={isOpen}
                                aria-controls={`${id}-content`}
                            >
                                <div>
                                    <span className="dropdown-title resume-section__title">{title[language]}</span>
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
                                <div className="resume-section__list">
                                    {items.map(({ id: itemId, title: itemTitle, institution, start, end, description }) => (
                                        <article key={itemId} className="resume-card">
                                            <div className="resume-card__header">
                                                <div className="resume-card__title-group">
                                                    <div className="resume-card__title">{itemTitle[language]}</div>
                                                    {institution && (
                                                        <div className="resume-card__institution">{institution[language]}</div>
                                                    )}
                                                </div>
                                                <div className="resume-card__dates">
                                                    {start[language]} - {end[language]}
                                                </div>
                                            </div>
                                            {description && <p className="resume-card__description">{description[language]}</p>}
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </DropdownContainer>
        </div>
    );
};

export default Resume;
