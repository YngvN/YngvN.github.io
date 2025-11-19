import { type FC } from 'react';
import type { Theme } from '../types/theme';

type ThemeToggleProps = {
    theme: Theme;
    onToggle: () => void;
};

type BulbVariant = 'on' | 'off';

const LightBulbIcon: FC<{ variant: BulbVariant }> = ({ variant }) => {
    const isOn = variant === 'on';
    const fillColor = isOn ? '#f6c844' : 'none';
    const strokeColor = isOn ? '#f1c40f' : '#6c757d';

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3a6 6 0 0 0-6 6c0 2.28 1.1 4.15 2.85 5.3L9 17h6l0.15-2.7C16.9 13.15 18 11.28 18 9a6 6 0 0 0-6-6z" />
            <path d="M10 20h4" />
            <path d="M9.5 17h5" />
        </svg>
    );
};

const ThemeToggle: FC<ThemeToggleProps> = ({ theme, onToggle }) => {
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className={`theme-toggle${isDark ? ' dark' : ''}`}
            onClick={onToggle}
            aria-pressed={isDark}
            aria-label={`Activate ${isDark ? 'light' : 'dark'} mode`}
        >
            <span className="theme-toggle__icon" aria-hidden="true">
                <LightBulbIcon variant="off" />
            </span>
            <span className="theme-toggle__icon" aria-hidden="true">
                <LightBulbIcon variant="on" />
            </span>
            <span className="theme-toggle__slider" aria-hidden="true" />
        </button>
    );
};

export default ThemeToggle;
