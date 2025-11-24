import '../../assets/styles.scss';
import '../pages.scss';
import './resume.scss';
import React from 'react';
import type { Language } from '../../types/language';

type ResumeProps = {
    language: Language;
};

type ResumeItem = {
    id: string;
    title: string;
    institution?: string;
    start: string;
    end: string;
    description?: string;
};

type ResumeSection = {
    id: string;
    title: string;
    items: ResumeItem[];
};

type ResumeContent = {
    heading: string;
    intro: string;
    sections: ResumeSection[];
};

const currentMonthEnd = 'November 2025';

const educationItems: ResumeItem[] = [
    {
        id: 'fe-vocational',
        title: 'Fagbrev i Front End utvikling',
        institution: 'Noroff',
        start: 'August 2022',
        end: 'Mai 2025',
        description: 'Jobbet mye selvstendig under utdanningen og bidro i større interne prosjekter i andre året.',
    },
    {
        id: 'electrical-engineering',
        title: 'Elektro ingeniør',
        institution: 'Universitetet i Sør-øst Norge',
        start: 'August 2021',
        end: 'Mai 2022',
        description: 'Arbeidet med både hardware og software; fokuset på programmering (Python, C#, SQL) førte til bytte til utviklerstudier.',
    },
    {
        id: 'music-bachelor',
        title: 'Faglærer i musikk, Bachelor',
        institution: 'Høgskolen på Vestlandet, Campus Stord',
        start: 'August 2012',
        end: 'Februar 2017',
        description: 'Pedagogikk og didaktikk, samspill og prosjektarbeid som konserter og produksjoner.',
    }
];

const workItems: ResumeItem[] = [
    {
        id: 'ulvenparken',
        title: 'Barnehagemedarbeider',
        institution: 'Ulvenparken Barnehage',
        start: 'September 2025',
        end: currentMonthEnd,
        description: 'Arbeid med småbarn og vedlikehold av barnehagen.',
    },
    {
        id: 'gardstunet',
        title: 'Barnehageassistent',
        institution: 'Gårdstunet Barnehage',
        start: 'Januar 2025',
        end: currentMonthEnd,
        description: 'Fast over lengre periode, både pedagogisk arbeid og praktisk forbedring av barnehagen.',
    },
    {
        id: 'pvs-2024',
        title: 'Assistent (barnehage)',
        institution: 'Pedagogisk Vikarsentral AS',
        start: 'Mars 2024',
        end: currentMonthEnd,
        description: 'Jobbet i flere barnehager med ulike aldersgrupper og behov.',
    },
    {
        id: 'creer-omsorg',
        title: 'Helseinstitusjonsassistent',
        institution: 'Creer Omsorg AS',
        start: 'April 2021',
        end: 'Januar 2023',
        description: 'Turnusarbeid i bolig for utviklingshemmet person.',
    },
    {
        id: 'rishaven-short',
        title: 'Assistent (barnehage)',
        institution: 'Rishaven Menighetsbarnehage',
        start: 'Desember 2022',
        end: 'Desember 2022',
        description: 'Arbeidet med barn i ulike aldersgrupper og praktiske oppgaver.',
    },
    {
        id: 'lundetangen',
        title: 'Lydtekniker',
        institution: 'Lundetangen Pub Drift AS',
        start: 'Juli 2022',
        end: 'Oktober 2022',
        description: 'Lydtekniker og publikumsstøtte.',
    },
    {
        id: 'lundedalen',
        title: 'Assistent (barnehage)',
        institution: 'Lundedalen Barnehage',
        start: 'August 2020',
        end: 'Juni 2021',
        description: 'Arbeidet med ulike aldersgrupper.',
    },
    {
        id: 'rishaven-2020',
        title: 'Barnehageassistent',
        institution: 'Rishaven Menighetsbarnehage',
        start: 'August 2019',
        end: 'August 2020',
    },
    {
        id: 'pvs-2019',
        title: 'Barnehageassistent',
        institution: 'Pedagogisk Vikarsentral AS',
        start: 'Juni 2018',
        end: 'Juni 2019',
    },
    {
        id: 'steinspranget',
        title: 'Barnehagemedarbeider',
        institution: 'Steinspranget Barnehage',
        start: 'Januar 2018',
        end: 'Mai 2018',
    },
    {
        id: 'stord-kommune',
        title: 'Miljøassistent (helse- og sosialtjenester)',
        institution: 'Stord kommune Åsen bustader',
        start: 'Desember 2012',
        end: 'Desember 2017',
        description: 'Bolig for utviklingshemmede; musikk og aktiviteter for å berike hverdagen.',
    },
    {
        id: 'gjerpen',
        title: 'Lærer (grunnskole)',
        institution: 'Gjerpen barneskole',
        start: 'Februar 2014',
        end: 'Juni 2014',
    },
];

const otherItems: ResumeItem[] = [
    {
        id: 'fadder',
        title: 'Fadder',
        start: 'August 2013',
        end: 'November 2023',
        description: 'Bidro som fadder nesten hvert år i studieløpene.',
    },
    {
        id: 'studentraad',
        title: 'Studentrådsrepresentant',
        start: 'August 2012',
        end: 'Mai 2023',
        description: 'Representerte studenter gjennom flere utdanningsløp.',
    },
    {
        id: 'musikklubb',
        title: 'Stifter og leder for studentforening',
        start: 'August 2021',
        end: 'Mai 2022',
        description: 'Grunnla Musikklubben ved USN; anskaffet og driftet utstyr for over 100 000 kr.',
    },
    {
        id: 'festivo',
        title: 'Dirigent i Festivo',
        start: 'September 2016',
        end: 'September 2017',
        description: 'Dirigerte kor for utviklingshemmede.',
    },
    {
        id: 'styremedlem',
        title: 'Styremedlem i studentforening',
        start: 'Mars 2016',
        end: 'August 2017',
        description: 'Styremedlem i Studentsamskipnaden ved HVL.',
    },
];

const resumeCopy: Record<Language, ResumeContent> = {
    en: {
        heading: 'Résumé',
        intro: 'Education, experience, and roles across technology, education, and community.',
        sections: [
            { id: 'education', title: 'Education & Certifications', items: educationItems },
            { id: 'work', title: 'Work Experience', items: workItems },
            { id: 'other', title: 'Other Experience', items: otherItems },
        ],
    },
    no: {
        heading: 'CV',
        intro: 'Utdanning, arbeidserfaring og roller innen teknologi, utdanning og kultur.',
        sections: [
            { id: 'education', title: 'Utdanning og fagbrev', items: educationItems },
            { id: 'work', title: 'Arbeidserfaring', items: workItems },
            { id: 'other', title: 'Annen erfaring', items: otherItems },
        ],
    },
};

const Resume: React.FC<ResumeProps> = ({ language }) => {
    const { heading, intro, sections } = resumeCopy[language];

    return (
        <div className="container resume">
            <h1 className="page-heading">{heading}</h1>
            <p className="resume__intro">{intro}</p>

            <div className="resume__sections">
                {sections.map(({ id, title, items }) => (
                    <section key={id} className="resume-section">
                        <h2 className="resume-section__title">{title}</h2>
                        <div className="resume-section__list">
                            {items.map(({ id: itemId, title: itemTitle, institution, start, end, description }) => (
                                <article key={itemId} className="resume-card">
                                    <div className="resume-card__header">
                                        <div className="resume-card__title">{itemTitle}</div>
                                        <div className="resume-card__dates">{start} - {end}</div>
                                    </div>
                                    {institution && <div className="resume-card__institution">{institution}</div>}
                                    {description && <p className="resume-card__description">{description}</p>}
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
