import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createMidSquares, useSquareLayout } from '../../../../utility/square-creator';
import '../squares.scss';

type ZoneEventDetail = {
    count?: number;
};

const ZONE_EVENT = 'music-player:zones';

function readZoneCountFromDom() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const style = window.getComputedStyle(document.documentElement);
    const raw = style.getPropertyValue('--mid-zone-count').trim();
    if (!raw) return null;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function clampZoneCount(value: number | null, total: number) {
    if (!value || value <= 0) return total;
    return Math.min(total, Math.max(1, Math.round(value)));
}

function getZoneIndex(index: number, total: number, zoneCount: number) {
    if (zoneCount <= 1) return 1;
    const size = total / zoneCount;
    return Math.min(zoneCount, Math.floor(index / size) + 1);
}

const SixSplitBg: React.FC = () => {
    const layout = useSquareLayout();
    const midSquares = createMidSquares(layout);
    const innerCells = Array.from({ length: 4 }, (_, index) => index);
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const [zoneCount, setZoneCount] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const update = () => setZoneCount(readZoneCountFromDom());
        update();

        const onZone = (event: Event) => {
            const detail = (event as CustomEvent<ZoneEventDetail>).detail;
            if (detail && typeof detail.count === 'number') {
                setZoneCount(detail.count);
            } else {
                update();
            }
        };

        window.addEventListener(ZONE_EVENT, onZone);
        return () => window.removeEventListener(ZONE_EVENT, onZone);
    }, []);

    const style = useMemo(
        () =>
            ({
                '--grid-cols': layout.cols,
                '--grid-rows': layout.rows,
                '--pixel-min-size': `${layout.pixelSize}px`,
                '--grid-cell': `${layout.pixelSize * 2}px`,
            }) as CSSProperties,
        [layout.cols, layout.pixelSize, layout.rows],
    );

    const total = midSquares.length;
    const effectiveZoneCount = clampZoneCount(zoneCount, total);

    return (
        <span ref={containerRef} className="outer-square" style={style}>
            {midSquares.map((midSquare, index) => {
                const zone = getZoneIndex(index, total, effectiveZoneCount);
                const zoneColor = `var(--zone-color-${zone}, var(--pulse-color-base, #ffffff))`;
                return (
                    <span
                        key={midSquare.key}
                        className={`square mid-square beat-${midSquare.beat} m-s--${midSquare.x}-${midSquare.y}`}
                        data-zone={zone}
                        style={{ '--pulse-color': zoneColor } as CSSProperties}
                    >
                        {innerCells.map((cellIndex) => {
                            const innerX = midSquare.x * 2 + (cellIndex % 2);
                            const innerY = midSquare.y * 2 + Math.floor(cellIndex / 2);
                            return (
                                <span
                                    key={`${midSquare.key}-inner-${cellIndex}`}
                                    className={`square inner-square i-s--${innerX}-${innerY}`}
                                />
                            );
                        })}
                    </span>
                );
            })}
        </span>
    );
};

export default SixSplitBg;
