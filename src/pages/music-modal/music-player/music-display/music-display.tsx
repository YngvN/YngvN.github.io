import React, { useEffect, useMemo, useRef, useState } from 'react';
import Squares from '../music-background/m-bg-components/squares';
import PlayIcon from '../../../../components/icons/play-icon/play-icon';
import PauseIcon from '../../../../components/icons/pause-icon/pause-icon';
import MusicPlayerProgram from '../music-player-program/music-player-program';
import { fetchMusicSheetJson, parseMusicSheetJson } from '../music-sheet';
import type { PaletteMode } from '../../utility/metronome/metronome';
import { BEATS_PER_BAR, BPM, SUB_BEATS_PER_BEAT, startMetronome, stopMetronome } from '../../utility/metronome/metronome';
import './music-display.scss';

function formatClockTime(elapsedMs: number) {
    const totalMs = Math.max(0, Math.floor(elapsedMs));
    const minutes = Math.floor(totalMs / 60_000);
    const seconds = Math.floor((totalMs % 60_000) / 1000);
    const ms = totalMs % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
}

function readBeatClockFromDom() {
    if (typeof document === 'undefined') return { bar: 0, beat: 0, subBeat: 0 };
    const bar = Number.parseInt(document.body.dataset.bar ?? '0', 10) || 0;
    const beat = Number.parseInt(document.body.dataset.beat ?? '0', 10) || 0;
    const subBeat = Number.parseInt(document.body.dataset.subBeat ?? '0', 10) || 0;
    return { bar, beat, subBeat };
}

function clearAllSquares() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
        pixel.style.removeProperty('opacity');
        pixel.style.removeProperty('background-color');
        pixel.style.removeProperty('box-shadow');
        pixel.removeAttribute('data-music-player-program');
    });
}

const MusicDisplay: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [paletteMode, setPaletteMode] = useState<PaletteMode>('random');
    const [clock, setClock] = useState(() => ({
        time: formatClockTime(0),
        bar: 0,
        beat: 0,
        subBeat: 0,
    }));
    const [sheetMeta, setSheetMeta] = useState<{ bpm: number; bars: number } | null>(null);

    const startTimeRef = useRef<number | null>(null);
    const autoStoppedRef = useRef(false);

    const togglePlayback = () => setIsPlaying((prev) => !prev);
    const controlLabel = isPlaying ? 'Pause' : 'Play';
    const paletteLabel = paletteMode === 'random' ? 'Random' : 'White';
    const paletteToggleLabel = `Colors: ${paletteLabel}`;

    useEffect(() => {
        if (isPlaying) {
            startMetronome(paletteMode);
            startTimeRef.current = typeof performance === 'undefined' ? Date.now() : performance.now();
            autoStoppedRef.current = false;
        } else {
            stopMetronome();
            startTimeRef.current = null;
            setClock({ time: formatClockTime(0), bar: 0, beat: 0, subBeat: 0 });
        }

        return () => {
            stopMetronome();
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;
        startMetronome(paletteMode);
    }, [isPlaying, paletteMode]);

    useEffect(() => {
        let cancelled = false;
        fetchMusicSheetJson()
            .then((json) => parseMusicSheetJson(json))
            .then((parsed) => {
                if (cancelled) return;
                setSheetMeta({ bpm: parsed.bpm, bars: parsed.bars });
            })
            .catch(() => {
                if (cancelled) return;
                setSheetMeta(null);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isPlaying) return undefined;
        if (typeof window === 'undefined') return undefined;

        let rafId: number | null = null;
        const tick = () => {
            const start = startTimeRef.current;
            const now = typeof performance === 'undefined' ? Date.now() : performance.now();
            const elapsedMs = start === null ? 0 : now - start;

            if (!autoStoppedRef.current && sheetMeta) {
                const bpm = sheetMeta.bpm || BPM;
                const msPerBar = (60_000 / bpm) * BEATS_PER_BAR;
                const durationMs = sheetMeta.bars * msPerBar;
                if (elapsedMs >= durationMs) {
                    autoStoppedRef.current = true;
                    stopMetronome();
                    clearAllSquares();
                    window.dispatchEvent(new Event('music-player-program:clear'));
                    setIsPlaying(false);
                    return;
                }
            }

            const { bar, beat, subBeat } = readBeatClockFromDom();
            setClock({
                time: formatClockTime(elapsedMs),
                bar,
                beat,
                subBeat,
            });
            rafId = window.requestAnimationFrame(tick);
        };

        rafId = window.requestAnimationFrame(tick);
        return () => {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
    }, [isPlaying, sheetMeta]);

    const clockLabel = useMemo(() => {
        const beatPart = `${clock.bar}:${clock.beat}:${clock.subBeat}`;
        return `${clock.time} ${beatPart}`;
    }, [clock.beat, clock.bar, clock.subBeat, clock.time]);

    const clockTitle = useMemo(() => {
        const defaults = `BPM ${BPM}, sub-beats per beat ${SUB_BEATS_PER_BEAT}`;
        if (!sheetMeta) return defaults;
        return `Sheet: ${sheetMeta.bpm} BPM, ${sheetMeta.bars} bars • ${defaults}`;
    }, [sheetMeta]);

    return (
        <div className="music-display" aria-label="Music display placeholder">
            <Squares />
            <MusicPlayerProgram />
            <div className="music-display__controls">
                <div
                    className="music-display__clock"
                    aria-label="Music clock"
                    title={clockTitle}
                >
                    {clockLabel}
                </div>
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
