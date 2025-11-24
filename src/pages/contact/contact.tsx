import '../../assets/styles.scss';
import '../pages.scss';
import './contact.scss';
import React from 'react';

const socials = [
    { label: 'Email', href: 'mailto:y.nykaas@gmail.com', display: 'y.nykaas@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/YngvN', display: 'github.com/YngvN' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yngve-nyk%C3%A5s-363b28bb/', display: 'LinkedIn profile' },
];

const Contact: React.FC = () => {
    return (
        <div className="container contact">
            <h1 className="page-heading">Contact</h1>
            <p className="contact__intro">
                Happy to discuss opportunities, collaborations, or questions. Drop a line on any channel below.
            </p>
            <div className="contact-card">
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
    );
};

export default Contact;
