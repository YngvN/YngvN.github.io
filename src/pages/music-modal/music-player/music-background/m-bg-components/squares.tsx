import React from 'react';
import type { CSSProperties } from 'react';
import './squares.scss';
import { createInnerBeats, createMidSquares, useSquareLayout } from '../../../utility/square-creator';

const Squares: React.FC = () => {
    const layout = useSquareLayout();
    const midSquares = createMidSquares(layout);
    const innerBeats = createInnerBeats();

    const style = {
        '--grid-cols': layout.cols,
        '--grid-rows': layout.rows,
    } as CSSProperties;

    return (
        <span className="outer-square" style={style}>
            {midSquares.map((midSquare) => (
                <span key={midSquare.key} className={`square mid-square beat-${midSquare.beat}`}>
                    {innerBeats.map((beat) => (
                        <span key={`${midSquare.key}-inner-${beat}`} className={`square inner-square beat-${beat}`} />
                    ))}
                </span>
            ))}
        </span>
    );
};

export default Squares;

