import React from 'react';
import './play-icon.scss';

type PlayIconSize = 'sm' | 'md';

type PlayIconProps = {
    size?: PlayIconSize;
    className?: string;
};

const PlayIcon: React.FC<PlayIconProps> = ({ size = 'md', className = '' }) => {
    const classes = ['icon-play', `icon-play--${size}`, className].filter(Boolean).join(' ');

    return (
        <span className={classes} aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
                <path d="M8 5.5 18 12 8 18.5Z" />
            </svg>
        </span>
    );
};

export default PlayIcon;
