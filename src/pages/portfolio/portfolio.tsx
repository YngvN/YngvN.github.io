import '../../assets/styles.scss';
import '../pages.scss';
import React from 'react';
import type { Language } from '../../types/language';
import type { Technology } from '../../components/icons/icons';
import { TechLogoGrid } from '../../components/icons/icons';
import PageNavigation from '../../components/page-navigation/page-navigation';
import type { PageName } from '../../types/pages';

type PortfolioProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type Project = {
    liveUrl: string;
    repoUrl: string;
    id: string;
    name: string;
    tag: string;
    stack: Technology[];
    description: string;
};

const portfolioCopy: Record<
    Language,
    { heading: string; subheading: string; intro: string; projects: Project[]; stackLabel: string; eyebrow: string; viewLive: string; viewRepo: string }
> = {
    en: {
        heading: 'Portfolio',
        subheading: 'Chosen work',
        intro: 'Some of my work from studies, own projects, and experiments.',
        stackLabel: 'Tech stack',
        eyebrow: 'Selected work',
        viewLive: 'Live site',
        viewRepo: 'Repository',
        projects: [
            {
                id: 'personal-site',
                name: 'YngvN.github.io',
                tag: 'Portfolio',
                stack: ['react', 'typescript', 'sass', 'vite'],
                liveUrl: 'https://yngvn.github.io/#about',
                repoUrl: 'https://github.com/YngvN/YngvN.github.io',
                description:
                    'This site—built with a lean React + TypeScript stack to showcase work, writing, and experiments.',
            },
            {
                id: 'home-page-react',
                name: 'Interactive Home Page',
                tag: 'Landing experience',
                stack: ['react', 'typescript', 'sass', 'bootstrap', 'wordpress'],
                liveUrl: 'https://github.com/YngvN/home-page-react',
                repoUrl: 'https://github.com/YngvN/home-page-react',
                description:
                    'Animated landing page with playful backgrounds and an interactive avatar that follows the cursor.',
            },
            {
                id: 'holidaze',
                name: 'Holidaze',
                tag: 'Booking platform',
                stack: ['react', 'typescript', 'sass'],
                liveUrl: 'https://holidaze2025.netlify.app/',
                repoUrl: 'https://github.com/YngvN/project-exam-2-resit',
                description:
                    'Accommodation booking experience with listings, host tools, and responsive UI tuned for travelers.',
            },
            {
                id: 'auction-home',
                name: 'Auction Home',
                tag: 'Marketplace',
                stack: ['react', 'typescript', 'sass'],
                liveUrl: 'https://app.netlify.com/projects/auctionhome/overview',
                repoUrl: 'https://github.com/YngvN/semester-project-2-resit',
                description: 'Auction marketplace with authenticated bidding, listing creation, and modern UI polish.',
            },
            {
                id: 'store-thingy',
                name: 'Store Thingy',
                tag: 'E-commerce',
                stack: ['react', 'typescript', 'sass'],
                liveUrl: 'https://storethingy.netlify.app/',
                repoUrl: 'https://github.com/YngvN/javascript-frameworks-ca',
                description: 'Headless storefront with product browsing, cart interactions, and responsive layouts.',
            },
            {
                id: 'fed-ca',
                name: 'Gamehub',
                tag: 'Game store',
                stack: ['javascript', 'html', 'css'],
                liveUrl: 'https://charming-kataifi-bd9bdc.netlify.app/',
                repoUrl: 'https://github.com/YngvN/FED-CA-HTML-CSS',
                description: 'Game store prototype connected to RAWG API with randomized pricing and JS-driven catalog flow.',
            },
        ],
    },
    no: {
        heading: 'Portefølje',
        subheading: 'Utvalgt arbeid',
        intro: 'Utvalgte prosjekter fra studier, egne prosjekter og eksperimenter.',
        stackLabel: 'Teknologi',
        eyebrow: 'Utvalgt arbeid',
        viewLive: 'Live-side',
        viewRepo: 'Kode',
        projects: [
            {
                id: 'personal-site',
                name: 'YngvN.github.io',
                tag: 'Portefølje',
                stack: ['react', 'typescript', 'sass', 'vite'],
                liveUrl: 'https://yngvn.github.io/#about',
                repoUrl: 'https://github.com/YngvN/YngvN.github.io',
                description:
                    'Denne nettsiden—bygget med en lett React + TypeScript stack for å vise frem prosjekter og eksperimenter.',
            },
            {
                id: 'home-page-react',
                name: 'Interaktiv forside',
                tag: 'Landingsopplevelse',
                stack: ['react', 'typescript', 'sass', 'bootstrap', 'wordpress'],
                liveUrl: 'https://github.com/YngvN/home-page-react',
                repoUrl: 'https://github.com/YngvN/home-page-react',
                description:
                    'Animert landingsside med dynamiske bakgrunner og en interaktiv avatar som følger musepekeren.',
            },
            {
                id: 'holidaze',
                name: 'Holidaze',
                tag: 'Booking-plattform',
                stack: ['react', 'typescript', 'sass'],
                liveUrl: 'https://holidaze2025.netlify.app/',
                repoUrl: 'https://github.com/YngvN/project-exam-2-resit',
                description:
                    'Bookingopplevelse for overnatting med lister, verktøy for verter og responsivt grensesnitt for reisende.',
            },
            {
                id: 'auction-home',
                name: 'Auction Home',
                tag: 'Markedsplass',
                stack: ['react', 'typescript', 'sass'],
                liveUrl: 'https://app.netlify.com/projects/auctionhome/overview',
                repoUrl: 'https://github.com/YngvN/semester-project-2-resit',
                description: 'Auksjonsplattform med pålogging, budgivning og moderne brukeropplevelse.',
            },
            {
                id: 'store-thingy',
                name: 'Store Thingy',
                tag: 'Nettbutikk',
                stack: ['react', 'typescript', 'sass'],
                liveUrl: 'https://storethingy.netlify.app/',
                repoUrl: 'https://github.com/YngvN/javascript-frameworks-ca',
                description: 'Butikkløsning med produktlisting, handlekurv og responsivt design.',
            },
            {
                id: 'fed-ca',
                name: 'Gamehub',
                tag: 'Spillbutikk',
                stack: ['javascript', 'html', 'css'],
                liveUrl: 'https://charming-kataifi-bd9bdc.netlify.app/',
                repoUrl: 'https://github.com/YngvN/FED-CA-HTML-CSS',
                description: 'Spillbutikk bygget med JS, koblet mot RAWG API og randomiserte priser for alle spill.',
            },
        ],
    },
};

const Portfolio: React.FC<PortfolioProps> = ({ language, onNavigate }) => {
    const { heading, subheading, intro, projects, viewLive, viewRepo } = portfolioCopy[language];

    return (
        <div className="container page-container portfolio">
            <PageNavigation currentPage="portfolio" language={language} onNavigate={onNavigate} />
            <div className="portfolio__intro">
                <div>
                    <h1 className="page-heading">{heading}</h1>
                    <h2 className="page-subheading">{subheading}</h2>
                    <p className="portfolio__lede">{intro}</p>
                </div>

            </div>

            <div className="portfolio__grid">
                {projects.map(({ id, name, tag, stack, description, liveUrl, repoUrl }) => (
                    <article className="project-card surface-card" key={id}>
                        <div className="project-card__top">
                            <span className="project-card__tag">{tag}</span>
                            <h3 className="project-card__title">{name}</h3>
                        </div>
                        <p className="project-card__description">{description}</p>
                        <div className="project-card__stack">

                            <TechLogoGrid technologies={stack} keyPrefix={id} />
                        </div>
                        <div className="project-card__links">
                            <a className="btn btn-primary btn-sm" href={liveUrl} target="_blank" rel="noopener noreferrer">
                                {viewLive}
                            </a>
                            <a className="btn btn-outline btn-sm" href={repoUrl} target="_blank" rel="noopener noreferrer">
                                {viewRepo}
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;
