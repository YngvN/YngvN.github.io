import React, { useCallback, useEffect, useMemo, useState } from 'react';

const PROGRAM_ATTR = 'data-music-player-program';

type GridSize = {
    cols: number;
    rows: number;
};

function lerp(from: number, to: number, t: number) {
    return from + (to - from) * t;
}

function parseCssInt(value: string) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function getSquareGridSizeFromDom(): GridSize | null {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const container = document.querySelector<HTMLElement>('.outer-square');
    if (!container) return null;

    const style = window.getComputedStyle(container);
    const cols = parseCssInt(style.getPropertyValue('--grid-cols'));
    const rows = parseCssInt(style.getPropertyValue('--grid-rows'));
    if (!cols || !rows) return null;

    return { cols, rows };
}

function buildInnerPixelMap() {
    const pixels = Array.from(document.querySelectorAll<HTMLElement>('.inner-square'));
    const map = new Map<string, HTMLElement>();

    pixels.forEach((pixel) => {
        const classes = pixel.className.split(/\s+/);
        const tag = classes.find((c) => c.startsWith('i-s--'));
        if (!tag) return;
        const [, coords] = tag.split('i-s--');
        if (!coords) return;
        map.set(coords, pixel);
    });

    return map;
}

function makeYCoords(cols: number, rows: number) {
    const innerCols = cols * 2;
    const innerRows = rows * 2;

    const midY = Math.max(2, Math.floor(innerRows / 2));
    const armThickness = innerCols >= 12 ? 2 : 1;
    const stemThickness = 1;

    const edgePadding = armThickness - 1;
    const centerX = innerCols % 2 === 0 ? innerCols / 2 : Math.floor(innerCols / 2);
    const leftStart = Math.max(0, innerCols % 2 === 0 ? edgePadding + 1 : edgePadding);
    const rightStart = Math.min(innerCols - 1, innerCols - 1 - edgePadding);

    const coords = new Set<string>();
    const add = (x: number, y: number) => {
        if (x < 0 || x >= innerCols) return;
        if (y < 0 || y >= innerRows) return;
        coords.add(`${x}-${y}`);
    };

    for (let y = 0; y < midY; y += 1) {
        const t = midY <= 1 ? 1 : y / (midY - 1);
        const leftX = Math.round(lerp(leftStart, centerX, t));
        const rightX = Math.round(lerp(rightStart, centerX, t));

        for (let dx = -armThickness + 1; dx <= armThickness - 1; dx += 1) {
            add(leftX + dx, y);
            add(rightX + dx, y);
        }
    }

    for (let y = midY - 1; y < innerRows; y += 1) {
        for (let dx = -stemThickness + 1; dx <= stemThickness - 1; dx += 1) {
            add(centerX + dx, y);
        }
    }

    return coords;
}

function clearProgramPixels() {
    document.querySelectorAll<HTMLElement>(`.inner-square[${PROGRAM_ATTR}]`).forEach((pixel) => {
        pixel.style.removeProperty('opacity');
        pixel.style.removeProperty('background-color');
        pixel.style.removeProperty('box-shadow');
        pixel.removeAttribute(PROGRAM_ATTR);
    });
}

const MusicPlayerProgram: React.FC = () => {
    const [enabled, setEnabled] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.location.search.includes('program=y');
    });

    const label = enabled ? 'Clear program' : 'Draw Y';

    const run = useCallback(() => {
        if (typeof document === 'undefined') return;
        clearProgramPixels();

        const grid = getSquareGridSizeFromDom();
        if (!grid) return;

        const pixels = buildInnerPixelMap();
        const yCoords = makeYCoords(grid.cols, grid.rows);

        yCoords.forEach((coord) => {
            const pixel = pixels.get(coord);
            if (!pixel) return;
            pixel.setAttribute(PROGRAM_ATTR, 'y');
            pixel.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
            pixel.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.22)';
        });
    }, []);

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

    const onClick = useCallback(() => {
        setEnabled((prev) => {
            const next = !prev;
            if (prev) clear();
            return next;
        });
    }, [clear]);

    const style = useMemo(
        () => ({
            position: 'absolute' as const,
            left: 12,
            bottom: 12,
            zIndex: 3,
        }),
        [],
    );

    return (
        <button type="button" onClick={onClick} style={style}>
            {label}
        </button>
    );
};

export default MusicPlayerProgram;
