import '../../assets/styles.scss';
import '../pages.scss';
import './resume.scss';
import React from 'react';
import type { Language } from '../../types/language';

type ResumeProps = {
    language: Language;
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
    skillsHeading: Localized;
    skills: Localized[];
    sections: ResumeSection[];
};

const currentMonthEnd: Localized = { en: 'November 2025', no: 'November 2025' };

const educationItems: ResumeItem[] = [
    {
        id: 'fe-vocational',
        title: { en: 'Vocational degree in Front End development', no: 'Fagbrev i Front End utvikling' },
        institution: { en: 'Noroff', no: 'Noroff' },
        start: { en: 'August 2022', no: 'August 2022' },
        end: { en: 'May 2025', no: 'Mai 2025' },
        description: {
            en: 'Independent study and contributions to larger internal projects in the second year.',
            no: 'Jobbet mye selvstendig og bidro i større interne prosjekter i andre året.',
        },
    },
    {
        id: 'electrical-engineering',
        title: { en: 'Electrical Engineering', no: 'Elektro ingeniør' },
        institution: { en: 'University of South-Eastern Norway', no: 'Universitetet i Sør-øst Norge' },
        start: { en: 'August 2021', no: 'August 2021' },
        end: { en: 'May 2022', no: 'Mai 2022' },
        description: {
            en: 'Worked with hardware and software; interest in programming (Python, C#, SQL) led to switching to development studies.',
            no: 'Arbeidet med både hardware og software; fokuset på programmering (Python, C#, SQL) førte til bytte til utviklerstudier.',
        },
    },
    {
        id: 'music-bachelor',
        title: { en: 'Bachelor: Music Education', no: 'Faglærer i musikk, Bachelor' },
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
        description: { en: 'Mentor/buddy in nearly every study program over the years.', no: 'Bidro som fadder nesten hvert år i studieløpene.' },
    },
    {
        id: 'studentraad',
        title: { en: 'Student council representative', no: 'Studentrådsrepresentant' },
        start: { en: 'August 2012', no: 'August 2012' },
        end: { en: 'May 2023', no: 'Mai 2023' },
        description: { en: 'Represented students across multiple study programs.', no: 'Representerte studenter gjennom flere utdanningsløp.' },
    },
    {
        id: 'musikklubb',
        title: { en: 'Founder and leader of student club', no: 'Stifter og leder for studentforening' },
        start: { en: 'August 2021', no: 'August 2021' },
        end: { en: 'May 2022', no: 'Mai 2022' },
        description: { en: 'Founded the Music Club at USN; sourced and managed equipment worth over 100,000 NOK.', no: 'Grunnla Musikklubben ved USN; anskaffet og driftet utstyr for over 100 000 kr.' },
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
    { id: 'other', title: { en: 'Other Experience', no: 'Annen erfaring' }, items: otherItems },
];

const resumeCopy: ResumeContent = {
    heading: { en: 'Résumé', no: 'CV' },
    summary: {
        en: 'As an employee I am solution-oriented and patient, with the end result in focus. I observe and learn from my surroundings to fit in and collaborate well with any team, leaning on their strengths. I enjoy unorthodox and creative solutions but work well with other preferences too.',
        no: 'Som arbeidstaker er jeg løsningsorientert og tålmodig, med sluttresultatet som fokus. Jeg prøver å observere og lære fra omgivelsene mine for å kunne passe inn og jobbe bra med team som jeg blir plassert i, og jobbe ut ifra deres styrker. Jeg liker uortodokse og kreative løsninger, men jobber fint med andre sine ønsker om de heller vil gjøre noe annet.',
    },
    skillsHeading: { en: 'Skills', no: 'Evner' },
    skills: [
        { en: 'Patient', no: 'Tålmodig' },
        { en: 'Solution-oriented', no: 'Løsningsorientert' },
        { en: 'Humorous', no: 'Humoristisk' },
        { en: 'Curious', no: 'Nysgjerrig' },
        { en: 'Creative', no: 'Kreativ' },
        { en: 'Engaged', no: 'Engasjert' },
    ],
    sections: resumeSections,
};

const Resume: React.FC<ResumeProps> = ({ language }) => {
    const { heading, summary, skillsHeading, skills, sections } = resumeCopy;

    return (
        <div className="container page-container resume">
            <h1 className="page-heading">{heading[language]}</h1>
            <p className="resume__summary">{summary[language]}</p>
            <div className="resume__skills">
                <h2 className="resume-section__title">{skillsHeading[language]}</h2>
                <ul className="resume__skills-list">
                    {skills.map((skill, idx) => (
                        <li key={idx} className="resume__skill">
                            {skill[language]}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="resume__sections">
                {sections.map(({ id, title, items }) => (
                    <section key={id} className="resume-section">
                        <h2 className="resume-section__title">{title[language]}</h2>
                        <div className="resume-section__list">
                            {items.map(({ id: itemId, title: itemTitle, institution, start, end, description }) => (
                                <article key={itemId} className="resume-card">
                                    <div className="resume-card__header">
                                        <div className="resume-card__title">{itemTitle[language]}</div>
                                        <div className="resume-card__dates">
                                            {start[language]} - {end[language]}
                                        </div>
                                    </div>
                                    {institution && <div className="resume-card__institution">{institution[language]}</div>}
                                    {description && <p className="resume-card__description">{description[language]}</p>}
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Resume;
