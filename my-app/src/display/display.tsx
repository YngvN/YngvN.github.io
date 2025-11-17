import type { FC } from 'react';
import About from '../pages/about/about';
import Portfolio from '../pages/portfolio/portfolio';
import '../assets/styles.scss';
import type { PageName } from '../types/pages';

type DisplayProps = {
    currentPage: PageName;
};

const placeholder = (title: string, description: string) => (
    <div className="container">
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
);

const Display: FC<DisplayProps> = ({ currentPage }) => {
    const content = (() => {
        switch (currentPage) {
            case 'about':
                return <About />;
            case 'portfolio':
                return <Portfolio />;
            case 'resume':
                return placeholder('Resume', 'A downloadable version of my resume will appear here soon.');
            case 'contact':
                return placeholder('Contact Me', 'Want to work together? Send me an email at yngve@example.com.');
            default:
                return <About />;
        }
    })();

    return <section className="page-display">{content}</section>;
};

export default Display;
