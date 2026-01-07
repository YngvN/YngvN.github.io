export type Technology =
    | 'vite'
    | 'react'
    | 'typescript'
    | 'sass'
    | 'html'
    | 'css'
    | 'javascript'
    | 'sql'
    | 'csharp'
    | 'python'
    | 'swift'
    | 'jest'
    | 'cypress'
    | 'bootstrap'
    | 'adobexd'
    | 'figma'
    | 'illustrator'
    | 'wordpress';

export type TechnologyMeta = {
    label: string;
    shorthand: string;
    background: string;
    color: string;
    logoUrl?: string;
};

export type IconTagItem = {
    label: string;
    badge: string;
    background: string;
    color: string;
};

export const technologyMeta: Record<Technology, TechnologyMeta> = {
    vite: {
        label: 'Vite',
        shorthand: 'V',
        background: 'linear-gradient(135deg,#FFEA83,#FFA800)',
        color: '#4c1d95',
        logoUrl: 'https://cdn.simpleicons.org/vite/646CFF',
    },
    react: {
        label: 'React',
        shorthand: '⚛︎',
        background: '#1f2937',
        color: '#61dafb',
        logoUrl: 'https://cdn.simpleicons.org/react/61DAFB',
    },
    typescript: {
        label: 'TypeScript',
        shorthand: 'TS',
        background: '#1f75cb',
        color: '#ffffff',
        logoUrl: 'https://cdn.simpleicons.org/typescript/3178C6',
    },
    sass: {
        label: 'Sass',
        shorthand: 'Sa',
        background: '#cf649a',
        color: '#ffffff',
        logoUrl: 'https://cdn.simpleicons.org/sass/CC6699',
    },
    html: {
        label: 'HTML5',
        shorthand: 'HTML',
        background: '#e34c26',
        color: '#ffffff',
        logoUrl: 'https://cdn.simpleicons.org/html5/E34F26',
    },
    css: {
        label: 'CSS',
        shorthand: 'CSS',
        background: '#1572b6',
        color: '#ffffff',
        logoUrl: '/logos/css3.svg',
    },
    javascript: {
        label: 'JavaScript',
        shorthand: 'JS',
        background: '#f7df1e',
        color: '#1f2933',
        logoUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E',
    },
    sql: {
        label: 'SQL',
        shorthand: 'SQL',
        background: '#0f172a',
        color: '#38bdf8',
        logoUrl: 'https://cdn.simpleicons.org/postgresql/4169E1',
    },
    csharp: {
        label: 'C#',
        shorthand: 'C#',
        background: '#6f2dbd',
        color: '#f8fafc',
        logoUrl: '/logos/csharp.svg',
    },
    python: {
        label: 'Python',
        shorthand: 'Py',
        background: 'linear-gradient(135deg,#306998,#ffd343)',
        color: '#0f172a',
        logoUrl: 'https://cdn.simpleicons.org/python/3776AB',
    },
    swift: {
        label: 'Swift',
        shorthand: 'Sw',
        background: '#f05138',
        color: '#fff7ed',
        logoUrl: 'https://cdn.simpleicons.org/swift/FA7343',
    },
    jest: {
        label: 'Jest',
        shorthand: 'Je',
        background: '#99425b',
        color: '#ffe4e6',
        logoUrl: 'https://cdn.simpleicons.org/jest/C21325',
    },
    cypress: {
        label: 'Cypress',
        shorthand: 'Cy',
        background: '#0f766e',
        color: '#ecfeff',
        logoUrl: 'https://cdn.simpleicons.org/cypress/69D3A7',
    },
    bootstrap: {
        label: 'Bootstrap',
        shorthand: 'B',
        background: '#563d7c',
        color: '#ede9fe',
        logoUrl: 'https://cdn.simpleicons.org/bootstrap/7952B3',
    },
    adobexd: {
        label: 'Adobe XD',
        shorthand: 'XD',
        background: '#470137',
        color: '#ff61f6',
        logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobexd.svg',
    },
    figma: {
        label: 'Figma',
        shorthand: 'Fg',
        background: 'linear-gradient(135deg,#f24e1e,#a259ff)',
        color: '#fef2f2',
        logoUrl: 'https://cdn.simpleicons.org/figma/F24E1E',
    },
    illustrator: {
        label: 'Illustrator',
        shorthand: 'Ai',
        background: '#310',
        color: '#ff9a00',
        logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobeillustrator.svg',
    },
    wordpress: {
        label: 'WordPress',
        shorthand: 'W',
        background: '#21759b',
        color: '#ffffff',
        logoUrl: 'https://cdn.simpleicons.org/wordpress/21759B',
    },
};

export const creativeItems: IconTagItem[] = [
    { label: 'Guitar', badge: '🎸', background: '#fef3c7', color: '#92400e' },
    { label: 'Piano', badge: '🎹', background: '#e0e7ff', color: '#312e81' },
    { label: 'Vocals', badge: '🎤', background: '#ffe4e6', color: '#9f1239' },
    { label: 'Banjo', badge: '🪕', background: '#f5f5f4', color: '#44403c' },
    { label: 'Synths', badge: '🎛️', background: '#cffafe', color: '#0f172a' },
    { label: 'Bass', badge: '🎸', background: '#ede9fe', color: '#4c1d95' },
    { label: 'Ableton', badge: '🎚️', background: '#111827', color: '#e5e7eb' },
    { label: 'Logic Pro X', badge: '🎧', background: '#0f172a', color: '#38bdf8' },
    { label: 'Saxophone', badge: '🎷', background: '#fef9c3', color: '#92400e' },
    { label: 'Clarinet', badge: '🎼', background: '#e5e7eb', color: '#111827' },
];
