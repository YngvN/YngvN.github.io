import React from 'react';
import PlayIcon from '../../../../../../components/icons/play-icon/play-icon';
import PauseIcon from '../../../../../../components/icons/pause-icon/pause-icon';
import './play.scss';

type PlayControlProps = {
    isPlaying: boolean;
    onToggle: () => void;
};

const PlayControl: React.FC<PlayControlProps> = ({ isPlaying, onToggle }) => {
    const label = isPlaying ? 'Pause' : 'Play';

    return (
        <button
            type="button"
            className="music-play"
            onClick={onToggle}
            aria-pressed={isPlaying}
            aria-label={label}
        >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span className="music-play__label">{label}</span>
        </button>
    );
};

export default PlayControl;
