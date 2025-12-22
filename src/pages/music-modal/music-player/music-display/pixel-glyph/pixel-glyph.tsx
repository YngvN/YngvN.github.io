import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './pixel-glyph.scss';

const PROGRAM_ATTR = 'data-music-player-program';

type GridSize = {
    cols: number;
    rows: number;
};

type PixelGlyphMap = ReadonlyArray<ReadonlyArray<number>>;

const PIXEL_GLYPHS: Partial<Record<string, PixelGlyphMap>> = {
    A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    B: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    C: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
    ],
    D: [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
    ],
    E: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    F: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    G: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    H: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    I: [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    J: [
        [0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 0, 0],
    ],
    K: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    L: [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    M: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    O: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    P: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    Q: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 1],
    ],
    R: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    S: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    T: [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    U: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    V: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
    ],
    W: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    Y: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    Z: [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    Æ: [
        [0, 1, 1, 1, 1],
        [1, 0, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
    ],
    Ø: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    Å: [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    '0': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '1': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
    ],
    '2': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    '3': [
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    '4': [
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
    ],
    '5': [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    '6': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '7': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
    ],
    '8': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '9': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '?': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    '-': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    '.': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    ' ': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
};

const DEFAULT_GLYPH: PixelGlyphMap = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
];

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

function getPixelGlyphForChar(char: string): PixelGlyphMap {
    const normalized = char.toUpperCase().slice(0, 1);
    if (normalized.length === 0) return PIXEL_GLYPHS[' '] ?? PIXEL_GLYPHS['?'] ?? DEFAULT_GLYPH;
    return PIXEL_GLYPHS[normalized] ?? PIXEL_GLYPHS['?'] ?? DEFAULT_GLYPH;
}

function makePixelCoords(text: string, cols: number, rows: number) {
    const innerCols = cols * 2;
    const innerRows = rows * 2;
    const glyphCols = 5;
    const glyphRows = 5;
    const glyphSpacing = 1;

    const coords = new Set<string>();

    if (innerCols < glyphCols || innerRows < glyphRows) return coords;

    const maxChars = Math.max(0, Math.floor((innerCols + glyphSpacing) / (glyphCols + glyphSpacing)));
    const normalized = text.toUpperCase();
    const clamped = maxChars > 0 ? normalized.slice(0, maxChars) : '';
    if (clamped.length === 0) return coords;

    const totalWidth = clamped.length * glyphCols + (clamped.length - 1) * glyphSpacing;
    const startX = Math.floor((innerCols - totalWidth) / 2);
    const startY = Math.floor((innerRows - glyphRows) / 2);

    clamped.split('').forEach((char, index) => {
        const glyph = getPixelGlyphForChar(char);
        const offsetX = startX + index * (glyphCols + glyphSpacing);
        glyph.forEach((row, y) => {
            row.forEach((value, x) => {
                if (!value) return;
                const gridX = offsetX + x;
                const gridY = startY + y;
                if (gridX < 0 || gridX >= innerCols) return;
                if (gridY < 0 || gridY >= innerRows) return;
                coords.add(`${gridX}-${gridY}`);
            });
        });
    });

    return coords;
}

function clearProgramPixels() {
    document.querySelectorAll<HTMLElement>(`.inner-square[${PROGRAM_ATTR}]`).forEach((pixel) => {
        pixel.style.removeProperty('opacity');
        pixel.style.removeProperty('background-color');
        pixel.style.removeProperty('box-shadow');
        pixel.style.removeProperty('--pixel-rot');
        pixel.classList.remove('pixel');
        pixel.removeAttribute(PROGRAM_ATTR);
    });
    document.querySelectorAll<HTMLElement>('.mid-square[data-music-player-program-mid]').forEach((mid) => {
        mid.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
            pixel.style.display = 'none';
            pixel.style.opacity = '0';
        });
        mid.removeAttribute('data-music-player-program-mid');
    });
}

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
        clearProgramPixels();
        if (!enabled) return;
        if (!normalizedText) return;

        const grid = getSquareGridSizeFromDom();
        if (!grid) return;

        const pixels = buildInnerPixelMap();
        const coords = makePixelCoords(normalizedText, grid.cols, grid.rows);
        const midSquares = new Set<HTMLElement>();

        coords.forEach((coord) => {
            const pixel = pixels.get(coord);
            if (!pixel) return;
            const midSquare = pixel.closest<HTMLElement>('.mid-square');
            if (midSquare) midSquares.add(midSquare);
            pixel.setAttribute(PROGRAM_ATTR, normalizedText);
            pixel.style.display = 'block';
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
            pixel.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
            pixel.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.22)';
        });

        midSquares.forEach((midSquare) => {
            midSquare.setAttribute('data-music-player-program-mid', 'true');
            midSquare.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
                pixel.style.display = 'block';
                if (!pixel.hasAttribute(PROGRAM_ATTR)) {
                    pixel.style.opacity = '0';
                }
            });
        });
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

    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = event.target.value;
            setText(next);
            const hasChar = next.trim().length > 0;
            setEnabled(hasChar);
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
                maxLength={32}
                placeholder=" "
                aria-label="Pixel glyph character"
                title="Type text to display"
            />
        </div>
    );
};

export default PixelGlyph;
