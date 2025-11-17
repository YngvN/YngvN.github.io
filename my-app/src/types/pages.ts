const pageNameMap = {
    ABOUT: 'about',
    PORTFOLIO: 'portfolio',
    RESUME: 'resume',
    CONTACT: 'contact',
} as const;

export type PageName = typeof pageNameMap[keyof typeof pageNameMap];
export const PageName = pageNameMap;
