import React from 'react';
import type { CSSProperties } from 'react';
import './squares.scss';
import { createMidSquares, useSquareLayout } from '../../../utility/square-creator';

const Squares: React.FC = () => {
    const layout = useSquareLayout();
    const midSquares = createMidSquares(layout);
    const innerCells = Array.from({ length: 4 }, (_, index) => index);

    const style = {
        '--grid-cols': layout.cols,
        '--grid-rows': layout.rows,
        '--pixel-min-size': `${layout.pixelSize}px`,
        '--grid-cell': `${layout.pixelSize * 2}px`,
    } as CSSProperties;

    const renderLayer = (layerClass: string, hidden = false) => (
        <span className={`outer-square ${layerClass}`} style={style} aria-hidden={hidden}>
            {midSquares.map((midSquare) => (
                <span
                    key={`${layerClass}-${midSquare.key}`}
                    className={`square mid-square beat-${midSquare.beat} m-s--${midSquare.x}-${midSquare.y}`}
                    style={{ '--cell-x': midSquare.x, '--cell-y': midSquare.y } as CSSProperties}
                >
                    {innerCells.map((index) => {
                        const offsetX = index % 2;
                        const offsetY = Math.floor(index / 2);
                        const innerX = midSquare.x * 2 + offsetX;
                        const innerY = midSquare.y * 2 + offsetY;
                        return (
                            <span
                                key={`${layerClass}-${midSquare.key}-inner-${index}`}
                                className={`square inner-square i-s--${innerX}-${innerY}`}
                                style={{ '--inner-x': offsetX, '--inner-y': offsetY } as CSSProperties}
                            />
                        );
                    })}
                </span>
            ))}
        </span>
    );

    return (
        <>
            {renderLayer('outer-square--active')}
            {renderLayer('outer-square--ghost', true)}
        </>
    );
};

export default Squares;
