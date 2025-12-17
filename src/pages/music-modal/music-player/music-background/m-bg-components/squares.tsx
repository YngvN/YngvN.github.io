import React from 'react';
import type { CSSProperties } from 'react';
import './squares.scss';
import { createInnerSubBeats, createMidSquares, useSquareLayout } from '../../../utility/square-creator';

const Squares: React.FC = () => {
    const layout = useSquareLayout();
    const midSquares = createMidSquares(layout);
    const innerSubBeats = createInnerSubBeats();

    const style = {
        '--grid-cols': layout.cols,
        '--grid-rows': layout.rows,
    } as CSSProperties;

    return (
        <span className="outer-square" style={style}>
            {midSquares.map((midSquare) => (
                <span
                    key={midSquare.key}
                    className={`square mid-square beat-${midSquare.beat} m-s--${midSquare.x}-${midSquare.y}`}
                >
                    {innerSubBeats.map((subBeat, index) => {
                        const innerX = midSquare.x * 2 + (index % 2);
                        const innerY = midSquare.y * 2 + Math.floor(index / 2);
                        return (
                            <span
                                key={`${midSquare.key}-inner-${subBeat}`}
                                className={`square inner-square sub-beat-${subBeat} i-s--${innerX}-${innerY}`}
                            />
                        );
                    })}
                </span>
            ))}
        </span>
    );
};

export default Squares;
