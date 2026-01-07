import '../../assets/styles.scss';
import '../pages.scss';
import './contact.scss';
import React from 'react';
import type { Language } from '../../types/language';
import PageNavigation from '../../components/page-navigation/page-navigation';
import type { PageName } from '../../types/pages';
import contactCopyData from './contact.copy.json';

type ContactProps = {
    language: Language;
    onNavigate?: (page: PageName, direction: 'ltr' | 'rtl') => void;
};

type ContactCopy = { heading: string; intro: string };

const contactCopy = contactCopyData as Record<Language, ContactCopy>;

const socials = [
    { label: 'Email', href: 'mailto:y.nykaas@gmail.com', display: 'y.nykaas@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/YngvN', display: 'github.com/YngvN' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yngve-nyk%C3%A5s-363b28bb/', display: 'LinkedIn profile' },
];

const Contact: React.FC<ContactProps> = ({ language, onNavigate }) => {
    const { heading, intro } = contactCopy[language];

    return (
        <>
            <div className="page-navigation-wrapper">
                <PageNavigation currentPage="contact" language={language} onNavigate={onNavigate} />
            </div>
            <div className="container page-container contact">
                <h1 className="page-heading">{heading}</h1>
                <p className="contact__intro">{intro}</p>
                <div className="contact-card surface-card">
                    <ul className="contact-list">
                        {socials.map(({ label, href, display }) => (
                            <li key={label} className="contact-list__item">
                                <span className="contact-list__label">{label}</span>
                                <a href={href} className="contact-list__link" target="_blank" rel="noopener noreferrer">
                                    {display}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Contact;
