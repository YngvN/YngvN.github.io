import React from 'react';
import './pause-icon.scss';

type PauseIconSize = 'sm' | 'md';

type PauseIconProps = {
    size?: PauseIconSize;
    className?: string;
};

const PauseIcon: React.FC<PauseIconProps> = ({ size = 'md', className = '' }) => {
    const classes = ['icon-pause', `icon-pause--${size}`, className].filter(Boolean).join(' ');

    return (
        <span className={classes} aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
                <rect x="7" y="5" width="4.6" height="14" rx="1.2" />
                <rect x="12.8" y="5" width="4.6" height="14" rx="1.2" />
            </svg>
        </span>
    );
};

export default PauseIcon;
