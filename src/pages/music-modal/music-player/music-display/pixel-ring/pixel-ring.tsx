import React, { useCallback, useEffect, useState } from 'react';
import './pixel-ring.scss';
import { PROGRAM_ATTR, buildInnerPixelMap, clearProgramPixels, getSquareGridSizeFromDom } from '../utility/pixel-program';

function makeBorderRingCoords(cols: number, rows: number) {
    const innerCols = cols * 2;
    const innerRows = rows * 2;
    const coords = new Set<string>();

    if (innerCols === 0 || innerRows === 0) return coords;

    for (let y = 0; y < innerRows; y += 1) {
        for (let x = 0; x < innerCols; x += 1) {
            const isBorder = x === 0 || y === 0 || x === innerCols - 1 || y === innerRows - 1;
            if (!isBorder) continue;
            coords.add(`${x}-${y}`);
        }
    }

    return coords;
}

const PixelRing: React.FC = () => {
    const [enabled, setEnabled] = useState(false);

    const run = useCallback(() => {
        if (typeof document === 'undefined') return;
        clearProgramPixels();
        if (!enabled) return;

        const grid = getSquareGridSizeFromDom();
        if (!grid) return;

        const pixels = buildInnerPixelMap();
        const coords = makeBorderRingCoords(grid.cols, grid.rows);

        coords.forEach((coord) => {
            const pixel = pixels.get(coord);
            if (!pixel) return;
            pixel.setAttribute(PROGRAM_ATTR, 'ring');
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
        });
    }, [enabled]);

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

        const outer = document.querySelector<HTMLElement>('.outer-square--active');
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
        const onRingClear = () => setEnabled(false);
        window.addEventListener('music-player-program:clear', onClear);
        window.addEventListener('music-player-program:ring:clear', onRingClear);
        return () => {
            window.removeEventListener('music-player-program:clear', onClear);
            window.removeEventListener('music-player-program:ring:clear', onRingClear);
        };
    }, []);

    const lightBorderRing = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('music-player-program:ring'));
        }
        setEnabled(true);
    }, []);

    return (
        <button className="pixel-ring" type="button" onClick={lightBorderRing}>
            Border ring
        </button>
    );
};

export default PixelRing;
