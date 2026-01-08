import React from 'react';
import './chevron.scss';

type ChevronDirection = 'up' | 'down';

type ChevronProps = {
    direction?: ChevronDirection;
    className?: string;
};

const Chevron: React.FC<ChevronProps> = ({ direction = 'down', className = '' }) => {
    const classes = ['icon-chevron', `icon-chevron--${direction}`, className].filter(Boolean).join(' ');

    return (
        <span className={classes} aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
                <path d="M6 9l6 6 6-6" />
            </svg>
        </span>
    );
};

export default Chevron;
