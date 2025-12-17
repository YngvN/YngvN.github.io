import { useEffect, useMemo, useState } from 'react';

export type SquareLayout = {
    cols: number;
    rows: number;
};

export type MidSquare = {
    key: string;
    beat: 1 | 2 | 3 | 4;
    x: number;
    y: number;
};

export const resolution = 300;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const resolutionSize = (viewportWidth: number, viewportHeight: number, layout: SquareLayout) => {
    const safeCols = Math.max(1, layout.cols);
    const safeRows = Math.max(1, layout.rows);
    const cell = Math.min(viewportWidth / (safeCols * 2), viewportHeight / (safeRows * 2));
    // Match the visual scale used in CSS so this roughly reflects the visible "pixel" size.
    const scaled = cell * 0.67;
    return clamp(Math.round(scaled), 6, 80);
};

function pickGridFromResolution(target: number, aspectRatio: number): SquareLayout {
    const normalizedAspect = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;
    let bestCols = target;
    let bestRows = 1;
    let bestScore = Number.POSITIVE_INFINITY;

    const maxFactor = Math.floor(Math.sqrt(target));
    for (let factor = 1; factor <= maxFactor; factor += 1) {
        if (target % factor !== 0) continue;
        const other = target / factor;

        const candidates: Array<{ cols: number; rows: number }> = [
            { cols: factor, rows: other },
            { cols: other, rows: factor },
        ];

        candidates.forEach(({ cols, rows }) => {
            const ratio = cols / rows;
            const score = Math.abs(Math.log(ratio / normalizedAspect));
            if (score < bestScore) {
                bestScore = score;
                bestCols = cols;
                bestRows = rows;
            }
        });
    }

    return { cols: Math.max(1, bestCols), rows: Math.max(1, bestRows) };
}

export function getSquareLayout(viewportWidth: number, viewportHeight: number): SquareLayout {
    const aspectRatio = viewportWidth / Math.max(1, viewportHeight);
    return pickGridFromResolution(resolution, aspectRatio);
}

export function createMidSquares(layout: SquareLayout): MidSquare[] {
    // `resolution` is fixed; `getSquareLayout` is derived from it, so cols*rows should match.
    return Array.from({ length: resolution }, (_, index) => ({
        key: `mid-${layout.cols}x${layout.rows}-${index}`,
        beat: (((index % 4) + 1) as 1 | 2 | 3 | 4),
        x: index % layout.cols,
        y: Math.floor(index / layout.cols),
    }));
}

export type SquareResolution = SquareLayout & { pixelSize: number };

export function useSquareLayout(): SquareResolution {
    const [viewport, setViewport] = useState(() => ({
        width: typeof window === 'undefined' ? 1024 : window.innerWidth,
        height: typeof window === 'undefined' ? 768 : window.innerHeight,
    }));

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        let rafId: number | null = null;
        const onResize = () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() =>
                setViewport({
                    width: window.innerWidth,
                    height: window.innerHeight,
                }),
            );
        };

        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return useMemo(() => {
        const layout = getSquareLayout(viewport.width, viewport.height);
        return { ...layout, pixelSize: resolutionSize(viewport.width, viewport.height, layout) };
    }, [viewport.height, viewport.width]);
}
