import "../../assets/styles.scss";
import React from "react";

const Portfolio: React.FC = () => {
    const projects = [
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
    ];

    return (
        <div className="container">
            <h1>Portfolio</h1>
            <p>Here are a few things I have been building and experimenting with lately:</p>
            <ul>
                {projects.map(({ name, stack, description }) => (
                    <li key={name} style={{ marginBottom: "1.5rem" }}>
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
