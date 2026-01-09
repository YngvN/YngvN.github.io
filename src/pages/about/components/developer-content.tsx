import React from 'react';
import type { Technology } from '../../../components/icons/icons-data';
import { TechLogoGrid } from '../../../components/icons/icons';

type DeveloperContentProps = {
    intro: string;
    tiles: DeveloperTile[];
};

type DeveloperTile = {
    id: string;
    title: string;
    technologies: Technology[];
};

const DeveloperContent: React.FC<DeveloperContentProps> = ({ intro, tiles }) => (
    <div className="developer-content">
        <p>{intro}</p>
        <div className="tech-tiles">
            {tiles.map(({ id, title, technologies }) => (
                <div className="tech-tile" key={id}>
                    <h4 className="dropdown-title">{title}</h4>
                    <TechLogoGrid technologies={technologies} keyPrefix={id} />
                </div>
            ))}
        </div>
    </div>
);

export default DeveloperContent;
