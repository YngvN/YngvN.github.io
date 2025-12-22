import { useEffect, useMemo, useState } from 'react';
import { resolution, resolutionSizePx } from '../music-player/music-player-settings';

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

function pickGridFromResolution(target: number, aspectRatio: number): SquareLayout {
    const normalizedAspect = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;
    const safeTarget = Math.max(1, Math.round(target));
    const approxCols = Math.max(1, Math.round(Math.sqrt(safeTarget * normalizedAspect)));
    let bestCols = approxCols;
    let bestRows = Math.max(1, Math.round(safeTarget / approxCols));
    let bestScore = Number.POSITIVE_INFINITY;

    for (let delta = -6; delta <= 6; delta += 1) {
        const cols = Math.max(1, approxCols + delta);
        const rows = Math.max(1, Math.round(safeTarget / cols));
        const ratio = cols / rows;
        const ratioScore = Math.abs(Math.log(ratio / normalizedAspect));
        const countScore = Math.abs(cols * rows - safeTarget) / safeTarget;
        const score = ratioScore * 0.75 + countScore * 0.25;
        if (score < bestScore) {
            bestScore = score;
            bestCols = cols;
            bestRows = rows;
        }
    }

    return { cols: bestCols, rows: bestRows };
}

export function getSquareLayout(viewportWidth: number, viewportHeight: number): SquareLayout {
    const aspectRatio = viewportWidth / Math.max(1, viewportHeight);
    return pickGridFromResolution(resolution, aspectRatio);
}

export function createMidSquares(layout: SquareLayout): MidSquare[] {
    const total = Math.max(1, layout.cols * layout.rows);
    return Array.from({ length: total }, (_, index) => ({
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
        return { ...layout, pixelSize: resolutionSizePx(viewport.width, viewport.height, layout.cols, layout.rows) };
    }, [viewport.height, viewport.width]);
}
