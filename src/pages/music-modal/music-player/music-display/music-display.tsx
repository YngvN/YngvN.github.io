import React, { useEffect, useState } from 'react';
import Squares from '../music-background/m-bg-components/squares';
import PlayIcon from '../../../../components/icons/play-icon/play-icon';
import PauseIcon from '../../../../components/icons/pause-icon/pause-icon';
import MusicPlayerProgram from '../music-player-program/music-player-program';
import type { PaletteMode } from '../../utility/metronome/metronome';
import { startMetronome, stopMetronome } from '../../utility/metronome/metronome';
import './music-display.scss';

const MusicDisplay: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [paletteMode, setPaletteMode] = useState<PaletteMode>('random');

    const togglePlayback = () => setIsPlaying((prev) => !prev);
    const controlLabel = isPlaying ? 'Pause' : 'Play';
    const paletteLabel = paletteMode === 'random' ? 'Random' : 'White';
    const paletteToggleLabel = `Colors: ${paletteLabel}`;

    useEffect(() => {
        if (isPlaying) {
            startMetronome(paletteMode);
        } else {
            stopMetronome();
        }

        return () => {
            stopMetronome();
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;
        startMetronome(paletteMode);
    }, [isPlaying, paletteMode]);

    return (
        <div className="music-display" aria-label="Music display placeholder">
            <Squares />
            <MusicPlayerProgram />
            <div className="music-display__controls">
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
                <button
                    type="button"
                    className="music-display__control"
                    onClick={() => setPaletteMode((prev) => (prev === 'random' ? 'white' : 'random'))}
                    aria-label={paletteToggleLabel}
                >
                    <span className="music-display__control-label">{paletteLabel}</span>
                </button>
            </div>
        </div>
    );
};

export default MusicDisplay;
