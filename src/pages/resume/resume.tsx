import '../../assets/styles.scss';
import '../pages.scss';
import './resume.scss';
import React, { useEffect, useRef, useState } from 'react';
import type { Language } from '../../types/language';
import PageNavigation from '../../components/page-navigation/page-navigation';
import type { PageName } from '../../types/pages';
import resumeCopyData from './resume.copy.json';
import ResumeSkills from './components/resume-skills';
import ResumeChosen from './components/resume-chosen';
import ResumeSections from './components/resume-sections';
import type { ResumeContent, ResumeItem } from './types';
import resumeEnglishPdf from '../../assets/CV/CV-Yngve_Nykaas-EN.pdf';
import resumeNorwegianPdf from '../../assets/CV/CV-Yngve_Nykås-NO.pdf';

type ResumeProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

const resumeCopy = resumeCopyData as Record<Language, ResumeContent>;

const Resume: React.FC<ResumeProps> = ({ language, onNavigate }) => {
    const {
        heading,
        summary,
        downloadResumeLabel,
        downloadEnglishLabel,
        downloadNorwegianLabel,
        softSkillsHeading,
        softSkills,
        hardSkillsHeading,
        hardSkills,
        sections,
    } = resumeCopy[language];
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
        sections.reduce(
            (acc, { id }) => ({
                ...acc,
                [id]: false,
            }),
            {} as Record<string, boolean>,
        ),
    );
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const downloadRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!showDownloadOptions) {
            return;
        }

        const handleDocumentPointerDown = (event: PointerEvent) => {
            if (!downloadRef.current) {
                return;
            }

            if (!downloadRef.current.contains(event.target as Node)) {
                setShowDownloadOptions(false);
            }
        };

        const handleScroll = () => {
            setShowDownloadOptions(false);
        };

        document.addEventListener('pointerdown', handleDocumentPointerDown);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('pointerdown', handleDocumentPointerDown);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showDownloadOptions]);

    const toggleSection = (id: string) => {
        setOpenSections((prev) => {
            const nextState = Object.keys(prev).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: false,
                }),
                {} as Record<string, boolean>,
            );
            nextState[id] = !prev[id];
            return nextState;
        });
    };

    const handleSectionClick = (id: string) => {
        if (openSections[id]) {
            toggleSection(id);
        }
    };

    const chosenBlocks = sections
        .map(({ id, chosenTitle, chosenItemIds, items }) => {
            const chosenIds = chosenItemIds ?? [];
            const chosenItems = chosenIds.length > 0 ? items.filter((item) => chosenIds.includes(item.id)) : [];

            if (chosenItems.length === 0 || !chosenTitle) {
                return null;
            }

            return {
                id,
                chosenTitle,
                items: chosenItems,
            };
        })
        .filter((block): block is { id: string; chosenTitle: string; items: ResumeItem[] } => Boolean(block));

    const dropdownSections = sections.filter(({ id }) => id !== 'work');

    return (
        <>
            <div className="page-navigation-wrapper">
                <PageNavigation currentPage="resume" language={language} onNavigate={onNavigate} />
            </div>
            <div className="container page-container resume">
                <h1 className="page-heading">{heading}</h1>
                <p className="resume__summary">{summary}</p>
                <div className="resume__download-container" ref={downloadRef}>
                    <button
                        type="button"
                        className={`btn resume__download-button${showDownloadOptions ? ' is-hidden' : ''}`}
                        onClick={() => setShowDownloadOptions((prev) => !prev)}
                    >
                        {downloadResumeLabel}
                    </button>
                    <div className={`resume__download-options${showDownloadOptions ? ' is-open' : ''}`}>
                        <span className="resume__download-label">{downloadResumeLabel}</span>
                        <div className="resume__download-buttons">
                            <a className='btn btn-download' href={resumeEnglishPdf} download onClick={() => setShowDownloadOptions(false)}>
                                {downloadEnglishLabel}
                            </a>
                            <a className='btn btn-download' href={resumeNorwegianPdf} download onClick={() => setShowDownloadOptions(false)}>
                                {downloadNorwegianLabel}
                            </a>
                        </div>
                    </div>
                </div>
                <ResumeSkills
                    softSkillsHeading={softSkillsHeading}
                    softSkills={softSkills}
                    hardSkillsHeading={hardSkillsHeading}
                    hardSkills={hardSkills}
                />

                {chosenBlocks.length > 0 ? <ResumeChosen blocks={chosenBlocks} /> : null}

                <ResumeSections
                    sections={dropdownSections}
                    openSections={openSections}
                    onToggleSection={toggleSection}
                    onSectionClick={handleSectionClick}
                />
            </div>
        </>
    );
};

export default Resume;
