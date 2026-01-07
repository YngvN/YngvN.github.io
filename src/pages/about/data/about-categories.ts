export type CategoryId = 'developer' | 'musician';

export type CategoryDefinition = {
    id: CategoryId;
    defaultOpen: boolean;
};

export const categoryDefinitions: CategoryDefinition[] = [
    { id: 'developer', defaultOpen: false },
    { id: 'musician', defaultOpen: false },
];
