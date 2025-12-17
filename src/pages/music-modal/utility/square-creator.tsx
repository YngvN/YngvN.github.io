import { useEffect, useMemo, useState } from 'react';

export type SquareLayout = {
    cols: number;
    rows: number;
};

export type MidSquare = {
    key: string;
    beat: 1 | 2 | 3 | 4;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function getSquareLayout(viewportWidth: number): SquareLayout {
    if (viewportWidth < 520) return { cols: 2, rows: 2 };
    if (viewportWidth < 900) return { cols: 3, rows: 2 };
    return { cols: 3, rows: 3 };
}

export function createMidSquares(layout: SquareLayout): MidSquare[] {
    const count = clamp(layout.cols * layout.rows, 1, 12);
    return Array.from({ length: count }, (_, index) => ({
        key: `mid-${layout.cols}x${layout.rows}-${index}`,
        beat: (((index % 4) + 1) as 1 | 2 | 3 | 4),
    }));
}

export function createInnerBeats(): Array<1 | 2 | 3 | 4> {
    return [1, 2, 3, 4];
}

export function useSquareLayout(): SquareLayout {
    const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 1024 : window.innerWidth));

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        let rafId: number | null = null;
        const onResize = () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
        };

        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return useMemo(() => getSquareLayout(width), [width]);
}

