import React, { useEffect, useMemo, useRef, useState } from 'react';
import Squares from '../music-background/m-bg-components/squares';
import LcdGlyph from './lcd-glyph/lcd-glyph';
import MusicController from '../music-controller/music-controller';
import type { ParsedMusicSheet } from '../music-sheet';
import { fetchMusicSheetJson, parseMusicSheetJson } from '../music-sheet';
import type { PaletteMode } from '../../utility/metronome/metronome';
import { BEATS_PER_BAR, BPM, SUB_BEATS_PER_BEAT, getBeatClockAtTime, startMetronome, stopMetronome } from '../../utility/metronome/metronome';
import { resolveAudioSrc } from './utility/audio';
import { triggerSheetAction } from './utility/actions';
import { formatClockTime, readBeatClockFromDom } from './utility/time';
import { applyInnerHoldBase, applyMidHoldBase, clearAllSquares, clearHoldBase, getHoldUntil } from './utility/visual';
import './music-display.scss';

const MusicDisplay: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [paletteMode, setPaletteMode] = useState<PaletteMode>('random');
    const [clock, setClock] = useState(() => ({
        time: formatClockTime(0),
        bar: 0,
        beat: 0,
        subBeat: 0,
    }));
    const [sheet, setSheet] = useState<ParsedMusicSheet | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.85);

    const startTimeRef = useRef<number | null>(null);
    const autoStoppedRef = useRef(false);
    const lastAnimationStampRef = useRef<string | null>(null);
    const animationCountsRef = useRef<Map<string, number>>(new Map());
    const lastSheetTickRef = useRef<string | null>(null);
    const lastMetronomeGridKeyRef = useRef<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlayback = () => setIsPlaying((prev) => !prev);
    const audioSrc = useMemo(() => resolveAudioSrc(sheet?.audio), [sheet?.audio]);
    const grid = useMemo(
        () => ({
            bpm: sheet?.bpm || BPM,
            beatsPerBar: sheet?.beatsPerBar || BEATS_PER_BAR,
            subBeatsPerBeat: sheet?.subBeatsPerBeat || SUB_BEATS_PER_BEAT,
        }),
        [sheet],
    );
    const effectiveBars = useMemo(() => {
        if (!sheet) return 0;
        if (audioDuration <= 0) return sheet.bars;
        const bpm = grid.bpm;
        const beatsPerBar = grid.beatsPerBar;
        const secondsPerBar = (60 / bpm) * beatsPerBar;
        return Math.max(1, Math.ceil(audioDuration / secondsPerBar));
    }, [audioDuration, grid, sheet]);

    useEffect(() => {
        const metronomeGridKey = sheet
            ? `${sheet.bpm || BPM}|${sheet.beatsPerBar || BEATS_PER_BAR}|${sheet.subBeatsPerBeat || SUB_BEATS_PER_BEAT}`
            : `default|${BPM}|${BEATS_PER_BAR}|${SUB_BEATS_PER_BEAT}`;

        if (isPlaying) {
            const shouldRestart = lastMetronomeGridKeyRef.current !== metronomeGridKey;
            lastMetronomeGridKeyRef.current = metronomeGridKey;

            if (shouldRestart) {
                stopMetronome();
                autoStoppedRef.current = false;
                clearAllSquares();
                window.dispatchEvent(new Event('music-player-program:clear'));
                lastSheetTickRef.current = null;
            }

            const beginMetronome = () => {
                const audioElapsedMs = audioRef.current ? audioRef.current.currentTime * 1000 : 0;
                startMetronome({
                    mode: paletteMode,
                    grid: sheet
                        ? {
                              bpm: sheet.bpm || BPM,
                              beatsPerBar: sheet.beatsPerBar || BEATS_PER_BAR,
                              subBeatsPerBeat: sheet.subBeatsPerBeat || SUB_BEATS_PER_BEAT,
                          }
                        : undefined,
                    startAtSeconds: audioRef.current ? audioRef.current.currentTime : 0,
                });
                const now = typeof performance === 'undefined' ? Date.now() : performance.now();
                startTimeRef.current = now - audioElapsedMs;
                autoStoppedRef.current = false;
            };

            const audio = audioRef.current;
            if (audio && audioSrc) {
                const playResult = audio.play();
                if (playResult && typeof playResult.then === 'function') {
                    playResult
                        .then(() => {
                            window.setTimeout(beginMetronome, 50);
                        })
                        .catch(beginMetronome);
                } else {
                    window.setTimeout(beginMetronome, 50);
                }
            } else {
                beginMetronome();
            }
        } else {
            stopMetronome();
            startTimeRef.current = null;
            lastMetronomeGridKeyRef.current = null;
            const audio = audioRef.current;
            if (audio) audio.pause();
        }

        return () => {
            stopMetronome();
        };
    }, [audioSrc, isPlaying, paletteMode, sheet]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;
        audio.pause();
        audio.currentTime = 0;
        setAudioCurrentTime(0);
        setAudioDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    }, [audioSrc]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;
        audio.volume = volume;
    }, [audioSrc, volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;
        const onLoaded = () => setAudioDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        const onTimeUpdate = () => setAudioCurrentTime(audio.currentTime);
        const onEnded = () => setIsPlaying(false);
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('durationchange', onLoaded);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('durationchange', onLoaded);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioSrc]);

    useEffect(() => {
        if (isPlaying) return;
        const baseTime = audioCurrentTime || 0;
        if (baseTime <= 0) {
            setClock({ time: formatClockTime(0), bar: 0, beat: 0, subBeat: 0 });
            return;
        }
        const beatClock = getBeatClockAtTime(baseTime, grid);
        setClock({
            time: formatClockTime(baseTime * 1000),
            bar: beatClock.bar,
            beat: beatClock.beat,
            subBeat: beatClock.subBeat,
        });
    }, [audioCurrentTime, grid, isPlaying]);

    useEffect(() => {
        let cancelled = false;
        fetchMusicSheetJson()
            .then((json) => parseMusicSheetJson(json))
            .then((parsed) => {
                if (cancelled) return;
                setSheet(parsed);
            })
            .catch(() => {
                if (cancelled) return;
                setSheet(null);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const sheetEventMap = useMemo(() => {
        const map = new Map<string, string[]>();
        if (!sheet) return map;
        sheet.events.forEach((event) => {
            const key = `${event.at.bar}:${event.at.subBeat}`;
            const existing = map.get(key);
            if (existing) existing.push(event.action);
            else map.set(key, [event.action]);
        });
        return map;
    }, [sheet]);

    useEffect(() => {
        if (!isPlaying) return undefined;
        if (typeof window === 'undefined') return undefined;

        let rafId: number | null = null;
        const tick = () => {
            const start = startTimeRef.current;
            const now = typeof performance === 'undefined' ? Date.now() : performance.now();
            const elapsedMs = start === null ? 0 : now - start;

            const { bar, beat, subBeat, eightBeat } = readBeatClockFromDom();
            const stamp = `${bar}|${beat}|${eightBeat}`;

            if (!autoStoppedRef.current && sheet && bar > effectiveBars) {
                autoStoppedRef.current = true;
                stopMetronome();
                clearAllSquares();
                window.dispatchEvent(new Event('music-player-program:clear'));
                setIsPlaying(false);
                return;
            }

            if (!autoStoppedRef.current && sheet && bar === 0) {
                const bpm = sheet.bpm || BPM;
                const msPerBar = (60_000 / bpm) * (sheet.beatsPerBar || BEATS_PER_BAR);
                const durationMs = effectiveBars * msPerBar;
                if (elapsedMs >= durationMs) {
                    autoStoppedRef.current = true;
                    stopMetronome();
                    clearAllSquares();
                    window.dispatchEvent(new Event('music-player-program:clear'));
                    setIsPlaying(false);
                    return;
                }
            }

            if (import.meta.env.DEV) {
                const previousStamp = lastAnimationStampRef.current;
                if (previousStamp && stamp !== previousStamp) {
                    animationCountsRef.current.clear();
                }
                lastAnimationStampRef.current = stamp;
            }

            if (sheet && bar > 0 && subBeat > 0) {
                const tickKey = `${bar}:${subBeat}`;
                if (lastSheetTickRef.current !== tickKey) {
                    lastSheetTickRef.current = tickKey;
                    const actions = sheetEventMap.get(tickKey);
                    if (actions && actions.length > 0) {
                        const bpm = sheet.bpm || BPM;
                        actions.forEach((action) =>
                            triggerSheetAction(action, {
                                bpm,
                                beatsPerBar: sheet.beatsPerBar || BEATS_PER_BAR,
                                subBeatsPerBeat: sheet.subBeatsPerBeat || SUB_BEATS_PER_BEAT,
                                bar,
                                beat,
                                subBeat,
                            }),
                        );
                    }
                }
            }

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
    }, [effectiveBars, isPlaying, sheet, sheetEventMap]);

    useEffect(() => {
        if (!isPlaying) return undefined;
        if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
        if (!import.meta.env.DEV) return undefined;

        const onAnimationStart = (event: Event) => {
            if (!(event instanceof AnimationEvent)) return;
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (!target.classList.contains('mid-square') && !target.classList.contains('inner-square')) return;

            const { bar, beat, eightBeat } = readBeatClockFromDom();
            const stamp = `${bar}|${beat}|${eightBeat}`;
            lastAnimationStampRef.current = stamp;

            const kind = target.classList.contains('mid-square') ? 'mid' : 'inner';
            const key = `${event.animationName}:${kind}`;
            animationCountsRef.current.set(key, (animationCountsRef.current.get(key) ?? 0) + 1);
        };

        const root = document.querySelector('.music-display') ?? document;
        root.addEventListener('animationstart', onAnimationStart, { capture: true });
        return () => {
            root.removeEventListener('animationstart', onAnimationStart, { capture: true } as AddEventListenerOptions);
            animationCountsRef.current.clear();
            lastAnimationStampRef.current = null;
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return undefined;
        if (typeof document === 'undefined') return undefined;

        const onAnimationEnd = (event: Event) => {
            if (!(event instanceof AnimationEvent)) return;
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const isInner = target.classList.contains('inner-square');
            const isMid = target.classList.contains('mid-square');
            if (!isInner && !isMid) return;
            if (isInner && target.hasAttribute('data-music-player-program')) return;

            const until = getHoldUntil(target);
            if (!until) {
                if (isInner) {
                    target.style.opacity = '0';
                    target.style.display = 'none';
                }
                return;
            }

            const now = typeof performance === 'undefined' ? Date.now() : performance.now();
            if (now >= until) {
                clearHoldBase(target);
                return;
            }

            const state = {
                untilMs: until,
                color: target.style.getPropertyValue('--hold-color').trim() || null,
                shadow: target.style.getPropertyValue('--hold-shadow').trim() || null,
            };

            if (isInner) {
                applyInnerHoldBase(target, state);
            } else {
                applyMidHoldBase(target, state);
            }
        };

        const root = document.querySelector('.music-display') ?? document;
        root.addEventListener('animationend', onAnimationEnd, { capture: true });
        return () => {
            root.removeEventListener('animationend', onAnimationEnd, { capture: true } as AddEventListenerOptions);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return undefined;
        if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

        let rafId: number | null = null;
        const tickHolds = () => {
            const now = typeof performance === 'undefined' ? Date.now() : performance.now();
            document.querySelectorAll<HTMLElement>('[data-sheet-hold-until]').forEach((element) => {
                const until = getHoldUntil(element);
                if (!until) return;
                if (now >= until) clearHoldBase(element);
            });
            rafId = window.requestAnimationFrame(tickHolds);
        };

        rafId = window.requestAnimationFrame(tickHolds);
        return () => {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
    }, [isPlaying]);

    const sheetSummary = useMemo(() => {
        if (!sheet) return null;
        const bpm = sheet.bpm || BPM;
        const timeLabel = sheet.timeSignature ? `${sheet.timeSignature} time` : `${grid.beatsPerBar}/4 time`;
        return `${bpm} BPM • ${timeLabel}`;
    }, [grid.beatsPerBar, sheet]);

    const clockLabel = useMemo(() => {
        const eightBeat = clock.subBeat > 0 ? (Math.floor((clock.subBeat - 1) / 2) % 4) + 1 : 0;
        const beatPart = `${clock.bar}|${clock.beat}|${eightBeat}`;
        const metaPart = sheetSummary ? ` • ${sheetSummary}` : '';
        return `${clock.time} ${beatPart}${metaPart}`;
    }, [clock.beat, clock.bar, clock.subBeat, clock.time, sheetSummary]);

    const clockTitle = useMemo(() => {
        const defaults = `BPM ${BPM}, sub-beats per beat ${SUB_BEATS_PER_BEAT}`;
        if (!sheet) return defaults;
        const timeLabel = sheet.timeSignature ? `${sheet.timeSignature} time` : `${grid.beatsPerBar}/4 time`;
        return `Sheet: ${sheet.bpm} BPM, ${timeLabel} • ${defaults}`;
    }, [grid.beatsPerBar, sheet]);

    const handleSeek = (nextTime: number) => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;
        const clamped = Math.max(0, Math.min(nextTime, audioDuration || audio.duration || nextTime));
        audio.currentTime = clamped;
        setAudioCurrentTime(clamped);
        if (startTimeRef.current !== null) {
            const now = typeof performance === 'undefined' ? Date.now() : performance.now();
            startTimeRef.current = now - clamped * 1000;
            lastSheetTickRef.current = null;
        }
        if (isPlaying) {
            stopMetronome();
            startMetronome({
                mode: paletteMode,
                grid,
                startAtSeconds: clamped,
            });
            clearAllSquares();
            window.dispatchEvent(new Event('music-player-program:clear'));
            autoStoppedRef.current = false;
            lastSheetTickRef.current = null;
        }
    };

    return (
        <div className="music-display" aria-label="Music display placeholder">
            {audioSrc ? <audio ref={audioRef} preload="auto" src={audioSrc} /> : null}
            <Squares />
            <LcdGlyph />
            <MusicController
                clockLabel={clockLabel}
                clockTitle={clockTitle}
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
                onRestart={() => {
                    const audio = audioRef.current;
                    if (!audio || !audioSrc) return;
                    audio.currentTime = 0;
                    setAudioCurrentTime(0);
                    const now = typeof performance === 'undefined' ? Date.now() : performance.now();
                    startTimeRef.current = now;
                    lastSheetTickRef.current = null;
                    if (isPlaying) {
                        stopMetronome();
                        startMetronome({
                            mode: paletteMode,
                            grid,
                            startAtSeconds: 0,
                        });
                        clearAllSquares();
                        window.dispatchEvent(new Event('music-player-program:clear'));
                        autoStoppedRef.current = false;
                    }
                }}
                paletteMode={paletteMode}
                onTogglePalette={() => setPaletteMode((prev) => (prev === 'random' ? 'white' : 'random'))}
                audioCurrentTime={audioCurrentTime}
                audioDuration={audioDuration}
                onSeek={handleSeek}
                volume={volume}
                onVolumeChange={setVolume}
                hasAudio={Boolean(audioSrc)}
            />
        </div>
    );
};

export default MusicDisplay;
