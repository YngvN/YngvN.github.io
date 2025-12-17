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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function getSquareLayout(viewportWidth: number, viewportHeight: number): SquareLayout {
    const baseCols = 2;
    const baseRows = 2;

    const widthBasePx = 350;
    const heightBasePx = 550;
    const widthStepPx = 100;
    const heightStepPx= 50;

    const colsPerStep = 1;
    const rowsPerStep = 1;

    const widthSteps = Math.floor((viewportWidth - widthBasePx) / widthStepPx);
    const heightSteps = Math.floor((viewportHeight - heightBasePx) / heightStepPx);

    // Don't clamp columns/rows (only clamp the total square count later).
    // We still enforce a minimum of 1 so CSS grid repeat() stays valid.
    const colsBase = Math.max(1, baseCols + widthSteps * colsPerStep);
    const rowsBase = Math.max(1, baseRows + heightSteps * rowsPerStep);

    // Higher resolution: roughly double the number of mid-squares while keeping proportions similar.
    const hiResScale = Math.SQRT2; // sqrt(2) => ~2x area (cols*rows)
    const cols = Math.max(1, Math.round(colsBase * hiResScale));
    const rows = Math.max(1, Math.round(rowsBase * hiResScale));

    return { cols, rows };
}

export function createMidSquares(layout: SquareLayout): MidSquare[] {
    const count = clamp(layout.cols * layout.rows, 1, 240);
    return Array.from({ length: count }, (_, index) => ({
        key: `mid-${layout.cols}x${layout.rows}-${index}`,
        beat: (((index % 4) + 1) as 1 | 2 | 3 | 4),
        x: index % layout.cols,
        y: Math.floor(index / layout.cols),
    }));
}

export function useSquareLayout(): SquareLayout {
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

    return useMemo(() => getSquareLayout(viewport.width, viewport.height), [viewport.height, viewport.width]);
}
