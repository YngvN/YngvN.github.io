import "../../assets/styles.scss";
import React from "react";
import type { Language } from "../../types/language";

type PortfolioProps = {
    language: Language;
};

type Project = {
    name: string;
    stack: string;
    description: string;
};

const portfolioCopy: Record<Language, { heading: string; intro: string; projects: Project[] }> = {
    en: {
        heading: "Portfolio",
        intro: "Here are a few things I have been building and experimenting with lately:",
        projects: [
            {
                name: "Personal Website",
                stack: "React, TypeScript, SASS",
                description: "The site you're looking at right now—designed to highlight my work and experience."
            },
            {
                name: "Open Source Contributions",
                stack: "Node.js, GraphQL",
                description: "Bug fixes and features for a handful of GitHub projects that I use day-to-day."
            },
            {
                name: "Design Experiments",
                stack: "Figma, Framer",
                description: "Rapid prototyping work where I play with ideas before implementing them in code."
            }
        ]
    },
    no: {
        heading: "Portefølje",
        intro: "Her er noen av prosjektene jeg jobber med og utforsker om dagen:",
        projects: [
            {
                name: "Personlig nettside",
                stack: "React, TypeScript, SASS",
                description: "Akkurat denne nettsiden – bygget for å vise frem arbeid og erfaring."
            },
            {
                name: "Bidrag til åpen kildekode",
                stack: "Node.js, GraphQL",
                description: "Feilrettinger og funksjoner for flere GitHub-prosjekter jeg bruker daglig."
            },
            {
                name: "Designeksperimenter",
                stack: "Figma, Framer",
                description: "Raske prototyper der jeg tester ideer før jeg bygger dem i kode."
            }
        ]
    }
};

const Portfolio: React.FC<PortfolioProps> = ({ language }) => {
    const { heading, intro, projects } = portfolioCopy[language];

    return (
        <div className="container">
            <h1>{heading}</h1>
            <p>{intro}</p>
            <ul>
                {projects.map(({ name, stack, description }) => (
                    <li key={`${name}-${stack}`} style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ marginBottom: "0.3rem" }}>{name}</h3>
                        <small style={{ display: "block", marginBottom: "0.5rem" }}>{stack}</small>
                        <p style={{ margin: 0 }}>{description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Portfolio;
