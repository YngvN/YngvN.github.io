import '../../assets/styles.scss';
import '../pages.scss';
import './resume.scss';
import React, { useState } from 'react';
import type { Language } from '../../types/language';
import PageNavigation from '../../components/page-navigation/page-navigation';
import type { PageName } from '../../types/pages';
import DropdownContainer from '../../components/icons/containers/dropdown/dropdown-container';
import Arrow from '../../components/icons/arrow/arrow';
import resumeCopyData from './resume.copy.json';

type ResumeProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type ResumeItem = {
    id: string;
    title: string;
    institution?: string;
    start: string;
    end: string;
    description?: string;
    skills?: string[];
};

type ResumeSection = {
    id: string;
    title: string;
    items: ResumeItem[];
};

type ResumeContent = {
    heading: string;
    subheading: string;
    summary: string;
    softSkillsHeading: string;
    softSkills: string[];
    hardSkillsHeading: string;
    hardSkills: string[];
    sections: ResumeSection[];
};

const resumeCopy = resumeCopyData as Record<Language, ResumeContent>;

const Resume: React.FC<ResumeProps> = ({ language, onNavigate }) => {
    const { heading, subheading, summary, softSkillsHeading, softSkills, hardSkillsHeading, hardSkills, sections } =
        resumeCopy[language];
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
        sections.reduce(
            (acc, { id }) => ({
                ...acc,
                [id]: false,
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
        <>
            <div className="page-navigation-wrapper">
                <PageNavigation currentPage="resume" language={language} onNavigate={onNavigate} />
            </div>
            <div className="container page-container resume">
                <h1 className="page-heading">{heading}</h1>
                <p className="resume__summary">{summary}</p>
                <div className="resume__skills">
                    <div className="resume__skills-group">
                        <h2 className="resume-section__title">{softSkillsHeading}</h2>
                        <ul className="resume__skills-list">
                            {softSkills.map((skill, idx) => (
                                <li key={idx} className="resume__skill">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="resume__skills-group">
                        <h2 className="resume-section__title">{hardSkillsHeading}</h2>
                        <ul className="resume__skills-list">
                            {hardSkills.map((skill, idx) => (
                                <li key={idx} className="resume__skill">
                                    {skill}
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
                                    <span className="dropdown-title resume-section__title">{title}</span>
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
                                        {items.map(
                                            ({ id: itemId, title: itemTitle, institution, start, end, description, skills }) => (
                                                <article key={itemId} className="resume-card">
                                                    <div className="resume-card__header">
                                                        <div className="resume-card__title-group">
                                                            <div className="resume-card__title">{itemTitle}</div>
                                                            {institution && (
                                                                <div className="resume-card__institution">{institution}</div>
                                                            )}
                                                        </div>
                                                        <div className="resume-card__dates">
                                                            {start} - {end}
                                                        </div>
                                                    </div>
                                                    {description && <p className="resume-card__description">{description}</p>}
                                                    {skills && (
                                                        <ul className="resume-card__skills">
                                                            {skills.map((skill) => (
                                                                <li key={skill} className="resume-card__skill">
                                                                    {skill}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </article>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </DropdownContainer>
            </div>
        </>
    );
};

export default Resume;
