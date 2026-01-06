import React from 'react';
import type { Language } from '../../../types/language';
import { TechLogoGrid } from '../../../components/icons/icons';
import { developerIntroCopy } from '../data/section-copy';
import { developerTiles } from '../data/developer-tiles';

type DeveloperContentProps = {
    language: Language;
};

const DeveloperContent: React.FC<DeveloperContentProps> = ({ language }) => (
    <div className="developer-content">
        <p>{developerIntroCopy[language]}</p>
        <div className="tech-tiles">
            {developerTiles.map(({ id, title, technologies }) => (
                <div className="tech-tile" key={id}>
                    <h3>{title[language]}</h3>
                    <TechLogoGrid technologies={technologies} keyPrefix={id} />
                </div>
            ))}
        </div>
    </div>
);

export default DeveloperContent;
