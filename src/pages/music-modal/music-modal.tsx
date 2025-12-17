import '../../assets/styles.scss';
import '../pages.scss';
import './music-modal.scss';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Language } from '../../types/language';
import XIcon from '../../components/icons/x-icon/x-icon';
import MusicDisplay from './music-player/music-display/music-display';

type MusicModalProps = {
    language: Language;
    isOpen?: boolean;
    onClose?: () => void;
    renderTrigger?: boolean;
};

const modalCopy: Record<
    Language,
    {
        openLabel: string;
        title: string;
        body: string;
        tracksLabel: string;
        closeLabel: string;
    }
> = {
    en: {
        openLabel: 'Preview music modal',
        title: 'Music preview',
        body: 'A lightweight modal to share a few snippets and notes about ongoing music projects.',
        tracksLabel: 'Latest snippets',
        closeLabel: 'Close',
    },
    no: {
        openLabel: 'Forhåndsvis musikkmodal',
        title: 'Musikkforhåndsvisning',
        body: 'En enkel modal for å dele lydklipp og notater om pågående musikkprosjekter.',
        tracksLabel: 'Siste klipp',
        closeLabel: 'Lukk',
    },
};

const MusicModal: React.FC<MusicModalProps> = ({ language, isOpen: controlledOpen, onClose, renderTrigger = true }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const copy = modalCopy[language];

    const isOpen = controlledOpen ?? internalOpen;

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setIsClosing(false);
        } else if (isRendered) {
            setIsClosing(true);
            const timer = window.setTimeout(() => {
                setIsRendered(false);
                setIsClosing(false);
            }, 220);
            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [isOpen, isRendered]);

    const handleOpen = () => setInternalOpen(true);

    const handleClose = () => {
        if (controlledOpen === undefined) {
            setInternalOpen(false);
        }
        onClose?.();
    };

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKey);
        };
    }, [isOpen]);

    return (
        <div className="music-modal">
            {renderTrigger && (
                <button type="button" className="btn btn-primary" onClick={handleOpen}>
                    {copy.openLabel}
                </button>
            )}

            {isRendered && typeof document !== 'undefined' && createPortal(
                <div className={`music-modal__backdrop${isClosing ? ' is-closing' : ''}`} onClick={handleClose}>
                    <div
                        className={`music-modal__dialog${isClosing ? ' is-closing' : ''}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="music-modal-title"
                        aria-describedby="music-modal-body"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="music-modal__close"
                            aria-label={copy.closeLabel}
                            onClick={handleClose}
                        >
                            <XIcon size="md" />
                        </button>

                        <MusicDisplay />

                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MusicModal;
