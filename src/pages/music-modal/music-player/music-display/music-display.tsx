import React, { useState } from 'react';
import Squares from '../music-background/m-bg-components/squares';
import PlayIcon from '../../../../components/icons/play-icon/play-icon';
import PauseIcon from '../../../../components/icons/pause-icon/pause-icon';
import './music-display.scss';

const MusicDisplay: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayback = () => setIsPlaying((prev) => !prev);
    const controlLabel = isPlaying ? 'Pause' : 'Play';

    return (
        <div className="music-display" aria-label="Music display placeholder">
            <Squares />
            <button
                type="button"
                className="music-display__control"
                onClick={togglePlayback}
                aria-pressed={isPlaying}
                aria-label={controlLabel}
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                <span className="music-display__control-label">{controlLabel}</span>
            </button>
        </div>
    );
};

export default MusicDisplay;
