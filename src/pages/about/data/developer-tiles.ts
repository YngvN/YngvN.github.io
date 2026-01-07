import type { Language } from '../../../types/language';
import type { Technology } from '../../../components/icons/icons-data';

export type DeveloperTile = {
    id: string;
    title: Record<Language, string>;
    technologies: Technology[];
};

export const developerTiles: DeveloperTile[] = [
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
