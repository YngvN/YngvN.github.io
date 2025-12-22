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

    return (
        <span className="outer-square" style={style}>
            {midSquares.map((midSquare) => (
                <span
                    key={midSquare.key}
                    className={`square mid-square beat-${midSquare.beat} m-s--${midSquare.x}-${midSquare.y}`}
                >
                    {innerCells.map((index) => {
                        const innerX = midSquare.x * 2 + (index % 2);
                        const innerY = midSquare.y * 2 + Math.floor(index / 2);
                        return (
                            <span
                                key={`${midSquare.key}-inner-${index}`}
                                className={`square inner-square i-s--${innerX}-${innerY}`}
                            />
                        );
                    })}
                </span>
            ))}
        </span>
    );
};

export default Squares;
