import React from 'react';
import Squares from '../music-background/m-bg-components/squares';
import './music-display.scss';

const MusicDisplay: React.FC = () => {
    return (
        <div className="music-display" aria-label="Music display placeholder">
            <Squares />
        </div>
    );
};

export default MusicDisplay;
