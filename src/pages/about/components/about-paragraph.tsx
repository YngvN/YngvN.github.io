import { Fragment } from 'react';
import './about-paragraph.scss';
import type { LinkParagraph, QuoteParagraph } from '../types';

type AboutParagraphProps = {
    paragraph: string | LinkParagraph | QuoteParagraph;
};

const AboutParagraph = ({ paragraph }: AboutParagraphProps) => {
    const isLinkParagraph = typeof paragraph !== 'string' && 'links' in paragraph;
    const isQuoteParagraph = typeof paragraph !== 'string' && 'quote' in paragraph;

    if (isLinkParagraph) {
        return (
            <p>
                {paragraph.prefix}
                {paragraph.links.map((link, linkIndex) => (
                    <Fragment key={`${link.href}-${linkIndex}`}>
                        <a className="about-link" href={link.href}>
                            {link.label}
                        </a>
                        {link.suffix}
                    </Fragment>
                ))}
            </p>
        );
    }

    if (isQuoteParagraph) {
        return (
            <p>
                {paragraph.prefix}
                <span className="about-quote">{paragraph.quote}</span>
                <span className="about-quote-source">{paragraph.suffix}</span>
            </p>
        );
    }

    return <p>{paragraph}</p>;
};

export default AboutParagraph;
