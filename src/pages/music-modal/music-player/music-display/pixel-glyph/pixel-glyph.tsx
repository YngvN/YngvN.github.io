import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './pixel-glyph.scss';
import PixelRing from '../pixel-ring/pixel-ring';
import { applyPixelWriterText } from '../pixel-writer/pixel-writer';
import { clearProgramPixels } from '../utility/pixel-program';

function readInitialText() {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('char');
    if (!raw) return '';
    return raw.toUpperCase();
}

const PixelGlyph: React.FC = () => {
    const [enabled, setEnabled] = useState(true);
    const [text, setText] = useState(readInitialText);

    const normalizedText = useMemo(() => (text || '').toUpperCase(), [text]);

    const run = useCallback(() => {
        if (typeof document === 'undefined') return;
        if (!enabled || !normalizedText) {
            clearProgramPixels();
            return;
        }
        applyPixelWriterText(normalizedText);
    }, [enabled, normalizedText]);

    const clear = useCallback(() => {
        if (typeof document === 'undefined') return;
        clearProgramPixels();
    }, []);

    useEffect(() => {
        if (!enabled) return undefined;
        if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

        let rafId: number | null = null;
        const scheduleRun = () => {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                run();
            });
        };

        scheduleRun();

        const outer = document.querySelector<HTMLElement>('.outer-square');
        if (!outer) return () => undefined;

        const mutationObserver = new MutationObserver(() => {
            clearProgramPixels();
            scheduleRun();
        });
        mutationObserver.observe(outer, { childList: true, subtree: true });

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                clearProgramPixels();
                scheduleRun();
            });
            resizeObserver.observe(outer);
        }

        window.addEventListener('resize', scheduleRun, { passive: true });

        return () => {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            window.removeEventListener('resize', scheduleRun);
            mutationObserver.disconnect();
            resizeObserver?.disconnect();
        };
    }, [enabled, run]);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const onClear = () => {
            setEnabled(false);
            if (typeof document === 'undefined') return;
            clearProgramPixels();
        };
        window.addEventListener('music-player-program:clear', onClear);
        return () => window.removeEventListener('music-player-program:clear', onClear);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const onRing = () => setEnabled(false);
        window.addEventListener('music-player-program:ring', onRing);
        return () => window.removeEventListener('music-player-program:ring', onRing);
    }, []);

    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = event.target.value;
            setText(next);
            const hasChar = next.trim().length > 0;
            setEnabled(hasChar);
            if (hasChar && typeof window !== 'undefined') {
                window.dispatchEvent(new Event('music-player-program:ring:clear'));
            }
            if (!hasChar) clear();
        },
        [clear],
    );

    return (
        <div className="pixel-glyph">
            <input
                className="pixel-glyph__input"
                value={text}
                onChange={onChange}
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                maxLength={120}
                placeholder=" "
                aria-label="Pixel glyph character"
                title="Type text to display"
            />
            <PixelRing />
        </div>
    );
};

export default PixelGlyph;
