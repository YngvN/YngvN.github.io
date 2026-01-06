import type { Language } from '../../../types/language';

export type CategoryId = 'developer' | 'musician';

export type CategoryDefinition = {
    id: CategoryId;
    defaultOpen: boolean;
};

export const categoryDefinitions: CategoryDefinition[] = [
    { id: 'developer', defaultOpen: false },
    { id: 'musician', defaultOpen: false },
];

export const aboutCategoryCopy: Record<
    Language,
    Record<CategoryId, { title: string; description: string }>
> = {
    en: {
        developer: {
            title: 'Developer',
            description: 'My technical expertise and experience',
        },
        musician: {
            title: 'Creative Work',
            description: 'Other work as a creative person',
        },
    },
    no: {
        developer: {
            title: 'Utvikler',
            description: 'Min tekniske kompetanse og erfaring',
        },
        musician: {
            title: 'Kreativt arbeid',
            description: 'Annet arbeid som kreativ person',
        },
    },
};
