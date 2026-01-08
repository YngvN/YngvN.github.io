import '../../assets/styles.scss';
import '../pages.scss';
import React from 'react';
import type { Language } from '../../types/language';
import type { Technology } from '../../components/icons/icons-data';
import { TechLogoGrid } from '../../components/icons/icons';
import PageNavigation from '../../components/page-navigation/page-navigation';
import type { PageName } from '../../types/pages';
import portfolioCopyData from './portfolio.copy.json';

type PortfolioProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type Project = {
    liveUrl: string;
    repoUrl?: string;
    id: string;
    name: string;
    tag: string;
    stack: Technology[];
    description: string;
};

type PortfolioCopy = {
    heading: string;
    subheading: string;
    intro: string;
    projects: Project[];
    viewLive: string;
    viewRepo: string;
};

const portfolioCopy = portfolioCopyData as Record<Language, PortfolioCopy>;

const Portfolio: React.FC<PortfolioProps> = ({ language, onNavigate }) => {
    const { heading, subheading, intro, projects, viewLive, viewRepo } = portfolioCopy[language];

    return (
        <>
            <div className="page-navigation-wrapper">
                <PageNavigation currentPage="portfolio" language={language} onNavigate={onNavigate} />
            </div>
            <div className="container page-container portfolio">
                <h1 className="page-heading">{heading}</h1>
                <div className="portfolio__intro">
                    <div>
                        <h2 className="page-subheading">{subheading}</h2>
                        <p className="portfolio__lede">{intro}</p>
                    </div>

                </div>

                <div className="portfolio__grid">
                    {projects.map(({ id, name, tag, stack, description, liveUrl, repoUrl }) => (
                        <article className="project-card surface-card" key={id}>
                            <div className="project-card__top">
                                <h3 className="project-card__title">{name}</h3>
                                <span className="project-card__tag">{tag}</span>
                            </div>
                            <p className="project-card__description">{description}</p>
                            <div className="project-card__stack">

                                <TechLogoGrid technologies={stack} keyPrefix={id} />
                            </div>
                            <div className="project-card__links">
                                <a className="btn btn-primary btn-sm" href={liveUrl} target="_blank" rel="noopener noreferrer">
                                    {viewLive}
                                </a>
                                {repoUrl ? (
                                    <a className="btn btn-secondary btn-sm" href={repoUrl} target="_blank" rel="noopener noreferrer">
                                        {viewRepo}
                                    </a>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Portfolio;
