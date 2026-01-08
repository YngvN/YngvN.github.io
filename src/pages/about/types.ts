import type { PageName } from '../../types/pages';
import type { Technology } from '../../components/icons/icons-data';
import type { CategoryId } from './data/about-categories';

export type LinkParagraph = {
    prefix: string;
    links: { label: string; href: string; suffix: string }[];
};

export type QuoteParagraph = {
    prefix: string;
    quote: string;
    suffix: string;
};

export type AboutCopy = {
    pageHeading: string;
    heading: string;
    subheading: string;
    paragraphs: Array<string | QuoteParagraph>;
    linkParagraph: LinkParagraph;
    buttons: { label: string; page: PageName; variant: 'primary' | 'secondary' }[];
    categories: Record<CategoryId, { title: string; description: string }>;
    developerIntro: string;
    musicianIntro: string;
    developerTiles: { id: string; title: string; technologies: Technology[] }[];
};
