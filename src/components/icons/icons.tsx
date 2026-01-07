import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import type { IconTagItem, Technology } from './icons-data';
import { technologyMeta } from './icons-data';
import './icons.scss';

type TechLogoProps = {
    tech: Technology;
    className?: string;
};

export const TechLogo: React.FC<TechLogoProps> = ({ tech, className }) => {
    const meta = technologyMeta[tech];
    const [logoError, setLogoError] = useState(false);
    const showImage = Boolean(meta.logoUrl) && !logoError;
    const style = {
        '--logo-bg': meta.background,
        '--logo-color': meta.color,
    } as CSSProperties;

    return (
        <span className={`tech-logo${className ? ` ${className}` : ''}`} style={style}>
            {showImage ? (
                <span className="tech-logo__badge tech-logo__badge--image" aria-hidden="true">
                    <img
                        src={meta.logoUrl}
                        loading="lazy"
                        alt=""
                        className="tech-logo__img"
                        onError={() => setLogoError(true)}
                    />
                </span>
            ) : (
                <span className="tech-logo__badge tech-logo__badge--image" aria-hidden="true">
                    {meta.shorthand}
                </span>
            )}
            <span className="tech-logo__label" aria-hidden="true">
                {meta.label}
            </span>
        </span>
    );
};

type TechLogoGridProps = {
    technologies: Technology[];
    className?: string;
    keyPrefix?: string;
};

export const TechLogoGrid: React.FC<TechLogoGridProps> = ({ technologies, className, keyPrefix = 'tech' }) => (
    <div className={`tech-logo-grid${className ? ` ${className}` : ''}`}>
        {technologies.map((tech, index) => (
            <TechLogo key={`${keyPrefix}-${tech}-${index}`} tech={tech} />
        ))}
    </div>
);

type IconTagProps = {
    item: IconTagItem;
    className?: string;
};

export const IconTag: React.FC<IconTagProps> = ({ item, className }) => {
    const style = {
        '--logo-bg': item.background,
        '--logo-color': item.color,
    } as CSSProperties;

    return (
        <span className={`tech-logo tech-logo--tag${className ? ` ${className}` : ''}`} style={style}>
            <span className="tech-logo__badge" aria-hidden="true">
                {item.badge}
            </span>
            <span className="tech-logo__label">{item.label}</span>
        </span>
    );
};

type IconTagGridProps = {
    items: IconTagItem[];
    className?: string;
    keyPrefix?: string;
};

export const IconTagGrid: React.FC<IconTagGridProps> = ({ items, className, keyPrefix = 'icon' }) => (
    <div className={`tech-logo-grid${className ? ` ${className}` : ''}`}>
        {items.map((item, index) => (
            <IconTag key={`${keyPrefix}-${item.label}-${index}`} item={item} />
        ))}
    </div>
);
