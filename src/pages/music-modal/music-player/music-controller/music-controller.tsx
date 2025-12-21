import React from 'react';
import type { PaletteMode } from '../../utility/metronome/metronome';
import PlayControl from './components/play/play';
import TimelineControl from './components/timeline/timeline';
import VolumeControl from './components/volume/volume';
import './music-controller.scss';

type MusicControllerProps = {
    clockLabel: string;
    clockTitle: string;
    isPlaying: boolean;
    onTogglePlayback: () => void;
    paletteMode: PaletteMode;
    onTogglePalette: () => void;
    audioCurrentTime: number;
    audioDuration: number;
    onSeek: (timeSeconds: number) => void;
    volume: number;
    onVolumeChange: (value: number) => void;
    hasAudio: boolean;
};

const MusicController: React.FC<MusicControllerProps> = ({
    clockLabel,
    clockTitle,
    isPlaying,
    onTogglePlayback,
    paletteMode,
    onTogglePalette,
    audioCurrentTime,
    audioDuration,
    onSeek,
    volume,
    onVolumeChange,
    hasAudio,
}) => {
    const paletteLabel = paletteMode === 'random' ? 'Random' : 'White';
    const paletteToggleLabel = `Colors: ${paletteLabel}`;

    return (
        <div className="music-controller" aria-label="Music controls">
            <div className="music-controller__clock" aria-label="Music clock" title={clockTitle}>
                {clockLabel}
            </div>
            <div className="music-controller__row">
                <PlayControl isPlaying={isPlaying} onToggle={onTogglePlayback} />
                <TimelineControl
                    currentTime={audioCurrentTime}
                    duration={audioDuration}
                    onSeek={onSeek}
                    isEnabled={hasAudio && audioDuration > 0}
                />
                <VolumeControl value={volume} onChange={onVolumeChange} isEnabled={hasAudio} />
                <button
                    type="button"
                    className="music-controller__button"
                    onClick={onTogglePalette}
                    aria-label={paletteToggleLabel}
                >
                    <span className="music-controller__button-label">{paletteLabel}</span>
                </button>
            </div>
        </div>
    );
};

export default MusicController;
