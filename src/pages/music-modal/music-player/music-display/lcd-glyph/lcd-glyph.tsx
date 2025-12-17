import React, { useCallback, useEffect, useState } from 'react';
import './lcd-glyph.scss';

const PROGRAM_ATTR = 'data-music-player-program';

type GridSize = {
    cols: number;
    rows: number;
};

function lerp(from: number, to: number, t: number) {
    return from + (to - from) * t;
}

type Segment14 =
    | 'top'
    | 'upperLeft'
    | 'upperRight'
    | 'middleLeft'
    | 'middleRight'
    | 'lowerLeft'
    | 'lowerRight'
    | 'bottom';

const CHAR_14SEGMENTS: Partial<Record<string, ReadonlyArray<Segment14>>> = {
    0: ['top', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight', 'bottom'],
    1: ['upperRight', 'lowerRight'],
    2: ['top', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'bottom'],
    3: ['top', 'upperRight', 'middleRight', 'lowerRight', 'bottom'],
    4: ['upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerRight'],
    5: ['top', 'upperLeft', 'middleLeft', 'middleRight', 'lowerRight', 'bottom'],
    6: ['top', 'upperLeft', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight', 'bottom'],
    7: ['top', 'upperRight', 'lowerRight'],
    8: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight', 'bottom'],
    9: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerRight', 'bottom'],
};

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

function makeGlyphCoords(char: string, cols: number, rows: number) {
    const innerCols = cols * 2;
    const innerRows = rows * 2;

    const coords = new Set<string>();
    const add = (x: number, y: number) => {
        if (x < 0 || x >= innerCols) return;
        if (y < 0 || y >= innerRows) return;
        coords.add(`${x}-${y}`);
    };

    const drawLine = (fromX: number, fromY: number, toX: number, toY: number) => {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
        for (let i = 0; i <= steps; i += 1) {
            const t = i / steps;
            add(Math.round(lerp(fromX, toX, t)), Math.round(lerp(fromY, toY, t)));
        }
    };

    const xInset = innerCols % 2 === 0 ? 1 : 0;
    const yInset = innerRows >= 10 ? 1 : 0;

    // Lock glyph aspect ratio by drawing within a centered square viewport.
    const availableLeftX = xInset;
    const availableRightX = innerCols - 1;
    const availableTopY = yInset;
    const availableBottomY = innerRows - 1 - yInset;

    const availableWidth = Math.max(1, availableRightX - availableLeftX + 1);
    const availableHeight = Math.max(1, availableBottomY - availableTopY + 1);

    let size = Math.min(availableWidth, availableHeight);
    // Prefer odd dimensions so the glyph has a true center row/column.
    if (size % 2 === 0) size -= 1;
    size = Math.max(1, size);

    const leftX = availableLeftX + Math.floor((availableWidth - size) / 2);
    const rightX = leftX + size - 1;
    const topY = availableTopY + Math.floor((availableHeight - size) / 2);
    const bottomY = topY + size - 1;
    const midY = Math.floor((topY + bottomY) / 2);
    const centerX = leftX + Math.floor((rightX - leftX) / 2);

    const drawHorizontal = (y: number, fromX: number, toX: number) => drawLine(fromX, y, toX, y);
    const drawVertical = (x: number, fromY: number, toY: number) => drawLine(x, fromY, x, toY);

    const drawUnknownLcdGlyph = () => {
        // Old LCD "unknown" glyph: a box with an X and a small dash in the center.
        drawHorizontal(topY, leftX, rightX);
        drawHorizontal(bottomY, leftX, rightX);
        drawVertical(leftX, topY, bottomY);
        drawVertical(rightX, topY, bottomY);

        drawLine(leftX + 1, topY + 1, rightX - 1, bottomY - 1);
        drawLine(rightX - 1, topY + 1, leftX + 1, bottomY - 1);

        // Center crosshair (— and |) should span the full inner width/height.
        drawHorizontal(midY, leftX + 1, rightX - 1);
        drawVertical(centerX, topY + 1, bottomY - 1);
    };

    const normalizedChar = char.toUpperCase();
    const segments = CHAR_14SEGMENTS[normalizedChar];
    if (!segments) {
        drawUnknownLcdGlyph();
        return coords;
    }

    const drawSegment = (segment: Segment14) => {
        if (segment === 'top') return drawHorizontal(topY, leftX + 1, rightX - 1);
        if (segment === 'bottom') return drawHorizontal(bottomY, leftX + 1, rightX - 1);
        if (segment === 'middleLeft') return drawHorizontal(midY, leftX + 1, centerX - 1);
        if (segment === 'middleRight') return drawHorizontal(midY, centerX + 1, rightX - 1);
        if (segment === 'upperLeft') return drawVertical(leftX, topY + 1, midY - 1);
        if (segment === 'upperRight') return drawVertical(rightX, topY + 1, midY - 1);
        if (segment === 'lowerLeft') return drawVertical(leftX, midY + 1, bottomY - 1);
        if (segment === 'lowerRight') return drawVertical(rightX, midY + 1, bottomY - 1);
        return undefined;
    };

    segments.forEach((segment) => drawSegment(segment));
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

function readInitialEnabled() {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const program = params.get('program');
    return program === 'lcd' || program === 'y' || program === 'yp';
}

function readInitialGlyphId() {
    if (typeof window === 'undefined') return 'yp';
    const params = new URLSearchParams(window.location.search);
    const program = params.get('program');
    if (program === 'lcd') return (params.get('char') || '?').slice(0, 1).toUpperCase();
    return '?';
}

const LcdGlyph: React.FC = () => {
    const [enabled, setEnabled] = useState(readInitialEnabled);
    const [glyphId] = useState(readInitialGlyphId);
    const title = enabled ? 'Hide LCD glyph' : 'Show LCD glyph';

    const run = useCallback(() => {
        if (typeof document === 'undefined') return;
        clearProgramPixels();

        const grid = getSquareGridSizeFromDom();
        if (!grid) return;

        const pixels = buildInnerPixelMap();
        const coords = makeGlyphCoords(glyphId, grid.cols, grid.rows);

        coords.forEach((coord) => {
            const pixel = pixels.get(coord);
            if (!pixel) return;
            pixel.setAttribute(PROGRAM_ATTR, glyphId);
            pixel.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
            pixel.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.22)';
        });
    }, [glyphId]);

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

    return (
        <button
            type="button"
            className="lcd-glyph__toggle"
            onClick={onClick}
            aria-pressed={enabled}
            title={title}
        >
            Y
        </button>
    );
};

export default LcdGlyph;
