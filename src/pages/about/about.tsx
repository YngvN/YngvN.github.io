import '../../assets/styles.scss';
import React from 'react';
import type { Language } from '../../types/language';
import type { PageName } from '../../types/pages';

type AboutProps = {
    language: Language;
};

type AboutContent = {
    heading: string;
    paragraphs: React.ReactNode[];
    buttons: { label: string; page: PageName; variant: 'primary' | 'secondary' }[];
};

const aboutCopy: Record<Language, AboutContent> = {
    en: {
        heading: 'About Me',
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
        heading: 'Om meg',
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

const About: React.FC<AboutProps> = ({ language }) => {
    const { heading, paragraphs, buttons } = aboutCopy[language];

    const navigateTo = (page: PageName) => {
        window.location.hash = `#${page}`;
    };

    return (
        <div className="container">
            <h1>{heading}</h1>
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
        </div>
    );
};

export default About;
