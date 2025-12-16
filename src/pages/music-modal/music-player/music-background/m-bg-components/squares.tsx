import React from 'react';
import './squares.scss';

const Squares: React.FC = () => {
    return (
        <span className="outer-square">
            <span className="square mid-square beat-1">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-2">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-3">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-4">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-1">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-2">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-3">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-4">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
            <span className="square mid-square beat-1">
                <span className="square inner-square beat-1" />
                <span className="square inner-square beat-2" />
                <span className="square inner-square beat-3" />
                <span className="square inner-square beat-4" />
            </span>
        </span>
    );
};

export default Squares;
