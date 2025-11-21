import { useState, type FC } from 'react';
import './nav.scss';
import type { PageName } from '../types/pages';
import avatarImage from '../assets/images/me.jpeg';
import type { Language } from '../types/language';
import ThemeToggle from '../components/theme-toggle/theme-toggle';
import type { Theme } from '../types/theme';

type NavProps = {
    currentPage?: PageName;
    onNavigate?: (page: PageName) => void;
    language?: Language;
    onLanguageChange?: (language: Language) => void;
    theme?: Theme;
    onThemeToggle?: () => void;
};

const navCopy: Record<Language, { description: string; links: { label: string; page: PageName }[] }> = {
    en: {
        description: "Hi!\nI'm Yngve, and I'm a Frontend developer.",
        links: [
            { label: 'About Me', page: 'about' },
            { label: 'Portfolio', page: 'portfolio' },
            { label: 'Resume', page: 'resume' },
            { label: 'Contact Me', page: 'contact' },
        ],
    },
    no: {
        description: "Hei!\nJeg heter Yngve og jobber som frontendutvikler.",
        links: [
            { label: 'Om meg', page: 'about' },
            { label: 'Portefølje', page: 'portfolio' },
            { label: 'CV', page: 'resume' },
            { label: 'Kontakt meg', page: 'contact' },
        ],
    },
};

const languageOptions: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'no', label: 'Norwegian' },
];

const Nav: FC<NavProps> = ({
    currentPage = 'about',
    onNavigate = () => { },
    language = 'en',
    onLanguageChange = () => { },
    theme = 'light',
    onThemeToggle = () => { },
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { description, links } = navCopy[language];

    const toggleNav = () => setIsOpen((prev) => !prev);

    const handleNavigate = (page: PageName) => {
        onNavigate(page);
        setIsOpen(false);
    };

    const handleLanguageClick = (code: Language) => {
        if (code === language) return;
        onLanguageChange(code);
    };

    return (
        <div className={`nav-shell${isOpen ? ' open' : ''}`}>
            <nav className={`navbar${isOpen ? ' open' : ''}`}>
                <div className="navbar-brand mb-4">
                    <div className="language-toggle" role="group" aria-label="Change language">
                        {languageOptions.map(({ code, label }) => (
                            <button
                                type="button"
                                key={code}
                                className={`language-button${code === language ? ' active' : ''}`}
                                onClick={() => handleLanguageClick(code)}
                                aria-pressed={code === language}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <img src={avatarImage} alt="Picture of me" className="nav-avatar" />
                </div>
                <div className="nav-language-content language-fade" key={language}>
                    <p className="nav-description">
                        {description.split('\n').map((segment, index) => (
                            <span key={index}>
                                {segment}
                                {index === 0 && <br />}
                            </span>
                        ))}
                    </p>
                    <ul className="navbar-nav flex-column w-100">
                        {links.map(({ label, page }) => (
                            <li className="nav-item mb-2" key={page}>
                                <button
                                    type="button"
                                    className={`nav-link${currentPage === page ? ' active' : ''}`}
                                    onClick={() => handleNavigate(page)}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="social-links">
                    <a href="https://github.com/YngvN" target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/yngve-nyk%C3%A5s-363b28bb/" target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.836 0-9.754h3.554v1.391c.43-.664 1.202-1.61 2.923-1.61 2.136 0 3.74 1.393 3.74 4.385v5.588zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.706 0-.968.771-1.71 1.954-1.71 1.18 0 1.912.742 1.937 1.71 0 .948-.757 1.706-1.976 1.706zm1.581 11.597H3.715V9.505h3.203v10.947zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                    </a>
                </div>
                <ThemeToggle theme={theme} onToggle={onThemeToggle} language={language} />
            </nav>
            <button
                type="button"
                className={`nav-toggle${isOpen ? ' open' : ''}`}
                onClick={toggleNav}
                aria-label="Toggle navigation"
                aria-expanded={isOpen}
            >
                <span className="nav-toggle__line" aria-hidden="true" />
                <span className="nav-toggle__line" aria-hidden="true" />
            </button>
        </div>
    );
};

export default Nav;
