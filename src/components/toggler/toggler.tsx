import { type FC, type ReactNode, useEffect, useRef, useState } from 'react';
import './toggler.scss';

type TogglerProps = {
    checked: boolean;
    onToggle: () => void;
    leftLabel?: string;
    rightLabel?: string;
    leftPreview?: ReactNode;
    rightPreview?: ReactNode;
    ariaLabel?: string;
    disabled?: boolean;
    id?: string;
};

const Toggler: FC<TogglerProps> = ({
    checked,
    onToggle,
    leftLabel,
    rightLabel,
    leftPreview,
    rightPreview,
    ariaLabel,
    disabled = false,
    id,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const activeSideClass = checked ? ' toggler--right-active' : ' toggler--left-active';
    const leftText = leftLabel ?? 'Left';
    const rightText = rightLabel ?? 'Right';

    useEffect(() => {
        if (!isExpanded) return undefined;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!buttonRef.current) return;
            if (event.target instanceof Node && !buttonRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
        return () => document.removeEventListener('pointerdown', handleClickOutside);
    }, [isExpanded]);

    const handleToggle = () => {
        if (disabled) return;

        if (!isExpanded) {
            setIsExpanded(true);
            return;
        }

        onToggle();
    };

    return (
        <button
            type="button"
            className={`toggler${checked ? ' toggler--right' : ' toggler--left'}${disabled ? ' toggler--disabled' : ''}${activeSideClass}${isExpanded ? ' toggler--expanded' : ' toggler--compact'}`}
            onClick={handleToggle}
            aria-pressed={checked}
            aria-label={ariaLabel ?? `Switch to ${checked ? leftText : rightText}`}
            disabled={disabled}
            id={id}
            aria-expanded={isExpanded}
            ref={buttonRef}
        >
            <span className={`toggler__preview toggler__preview--left${!checked ? ' is-active' : ''}`} aria-hidden="true">
                {leftPreview}
            </span>
            <span className="toggler__label toggler__label--left">{leftText}</span>
            <span className="toggler__thumb" aria-hidden="true" />
            <span className="toggler__label toggler__label--right">{rightText}</span>
            <span className={`toggler__preview toggler__preview--right${checked ? ' is-active' : ''}`} aria-hidden="true">
                {rightPreview}
            </span>
        </button>
    );
};

export default Toggler;
