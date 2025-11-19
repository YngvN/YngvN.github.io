import '../../assets/styles.scss';
import React from 'react';
import type { Language } from '../../types/language';

type AboutProps = {
    language: Language;
};

const aboutCopy: Record<Language, { heading: string; paragraphs: string[] }> = {
    en: {
        heading: 'About Me',
        paragraphs: [
            "Welcome to my personal website! I'm Yngve, a software developer with a passion for creating web applications.",
            'I specialize in front-end development and have experience working with various technologies including React, TypeScript, and SASS.',
            'In my free time, I enjoy contributing to open source projects and exploring new technologies.',
        ],
    },
    no: {
        heading: 'Om meg',
        paragraphs: [
            'Velkommen til nettsiden min! Jeg er Yngve, en utvikler som elsker å bygge moderne webløsninger.',
            'Jeg fokuserer på front-end og jobber mest med teknologier som React, TypeScript og SASS.',
            'På fritiden bidrar jeg til åpen kildekode og liker å teste ut nye verktøy.',
        ],
    },
};

const About: React.FC<AboutProps> = ({ language }) => {
    const { heading, paragraphs } = aboutCopy[language];
    return (
        <div className="container">
            <h1>{heading}</h1>
            {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    );
};

export default About;
