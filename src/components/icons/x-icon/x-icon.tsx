import React from 'react';
import './x-icon.scss';

type XIconSize = 'sm' | 'md';

type XIconProps = {
    size?: XIconSize;
    className?: string;
};

const XIcon: React.FC<XIconProps> = ({ size = 'md', className = '' }) => {
    const classes = ['icon-x', `icon-x--${size}`, className].filter(Boolean).join(' ');

    return (
        <span className={classes} aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
            </svg>
        </span>
    );
};

export default XIcon;
