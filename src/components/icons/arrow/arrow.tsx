import React from 'react';
import './arrow.scss';

type ArrowDirection = 'left' | 'right' | 'up' | 'down';
type ArrowSize = 'sm' | 'md';

type ArrowProps = {
    direction?: ArrowDirection;
    size?: ArrowSize;
    className?: string;
    /** When true, moves the arrowhead to the opposite side while keeping the shaft static. */
    open?: boolean;
};

const Arrow: React.FC<ArrowProps> = ({ direction = 'right', size = 'md', className = '', open = false }) => {
    const classes = ['icon-arrow', `icon-arrow--${direction}`, `icon-arrow--${size}`, open ? 'icon-arrow--open' : '', className]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classes} aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
                <path className="icon-arrow__shaft" d="M5 12h14" />
                <path className="icon-arrow__head" d="M13 6l6 6-6 6" />
            </svg>
        </span>
    );
};

export default Arrow;
