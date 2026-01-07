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

    const renderLayer = (layerClass: string, hidden = false) => (
        <span ref={layerClass === 'outer-square--active' ? containerRef : null} className={`outer-square ${layerClass}`} style={style} aria-hidden={hidden}>
            {midSquares.map((midSquare, index) => {
                const zone = getZoneIndex(index, total, effectiveZoneCount);
                const zoneColor = `var(--zone-color-${zone}, var(--pulse-color-base, #ffffff))`;
                return (
                    <span
                        key={`${layerClass}-${midSquare.key}`}
                        className={`square mid-square beat-${midSquare.beat} m-s--${midSquare.x}-${midSquare.y}`}
                        data-zone={zone}
                        style={
                            {
                                '--pulse-color': zoneColor,
                                '--cell-x': midSquare.x,
                                '--cell-y': midSquare.y,
                            } as CSSProperties
                        }
                    >
                        {innerCells.map((cellIndex) => {
                            const offsetX = cellIndex % 2;
                            const offsetY = Math.floor(cellIndex / 2);
                            const innerX = midSquare.x * 2 + offsetX;
                            const innerY = midSquare.y * 2 + offsetY;
                            return (
                                <span
                                    key={`${layerClass}-${midSquare.key}-inner-${cellIndex}`}
                                    className={`square inner-square i-s--${innerX}-${innerY}`}
                                    style={{ '--inner-x': offsetX, '--inner-y': offsetY } as CSSProperties}
                                />
                            );
                        })}
                    </span>
                );
            })}
        </span>
    );

    return (
        <>
            {renderLayer('outer-square--active')}
            {renderLayer('outer-square--ghost', true)}
        </>
    );
};

export default SixSplitBg;
