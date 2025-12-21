import React, { useEffect, useMemo, useRef, useState } from 'react';
import Squares from '../music-background/m-bg-components/squares';
import LcdGlyph from './lcd-glyph/lcd-glyph';
import MusicController from '../music-controller/music-controller';
import type { ParsedMusicSheet } from '../music-sheet';
import { fetchMusicSheetJson, parseMusicSheetJson } from '../music-sheet';
import type { PaletteMode } from '../../utility/metronome/metronome';
import { BEATS_PER_BAR, BPM, SUB_BEATS_PER_BEAT, getBeatClockAtTime, startMetronome, stopMetronome } from '../../utility/metronome/metronome';
import './music-display.scss';

const audioAssets = import.meta.glob('../../../../assets/song/*.mp3', { eager: true, import: 'default' }) as Record<
    string,
    string
>;
const audioAssetMap = Object.fromEntries(
    Object.entries(audioAssets).map(([path, url]) => [path.split('/').pop() ?? path, url]),
);

function resolveAudioSrc(raw: string | undefined) {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const fileName = trimmed.split('/').pop() ?? trimmed;
    return audioAssetMap[trimmed] ?? audioAssetMap[fileName] ?? trimmed;
}

function formatClockTime(elapsedMs: number) {
    const totalMs = Math.max(0, Math.floor(elapsedMs));
    const minutes = Math.floor(totalMs / 60_000);
    const seconds = Math.floor((totalMs % 60_000) / 1000);
    const ms = totalMs % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
}

function readBeatClockFromDom() {
    if (typeof document === 'undefined') return { bar: 0, beat: 0, subBeat: 0, eightBeat: 0 };
    const bar = Number.parseInt(document.body.dataset.bar ?? '0', 10) || 0;
    const beat = Number.parseInt(document.body.dataset.beat ?? '0', 10) || 0;
    const subBeat = Number.parseInt(document.body.dataset.subBeat ?? '0', 10) || 0;
    const eightBeat = Number.parseInt(document.body.dataset.eightBeat ?? '0', 10) || 0;
    return { bar, beat, subBeat, eightBeat };
}

function clearAllSquares() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
        pixel.style.removeProperty('opacity');
        pixel.style.removeProperty('background-color');
        pixel.style.removeProperty('box-shadow');
        delete pixel.dataset.sheetHoldUntil;
        pixel.style.removeProperty('--hold-color');
        pixel.style.removeProperty('--hold-shadow');
        pixel.removeAttribute('data-music-player-program');
        pixel.style.removeProperty('animation');
    });
    document.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
        mid.style.removeProperty('animation');
    });
}

function restartAnimation(element: HTMLElement, animation: string) {
    element.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
    element.style.animation = animation;
}

function snapshotPulseVars() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const style = window.getComputedStyle(document.documentElement);
    const color = style.getPropertyValue('--pulse-color').trim();
    const shadow = style.getPropertyValue('--pulse-shadow').trim();
    return {
        color: color.length > 0 ? color : null,
        shadow: shadow.length > 0 ? shadow : null,
    };
}

type SheetTriggerContext = {
    bpm: number;
    beatsPerBar: number;
    subBeatsPerBeat: number;
    bar: number;
    beat: number;
    subBeat: number;
};

type HoldState = {
    untilMs: number;
    color: string | null;
    shadow: string | null;
};

function applyInnerHoldBase(pixel: HTMLElement, state: HoldState) {
    if (state.color) pixel.style.setProperty('--hold-color', state.color);
    if (state.shadow) pixel.style.setProperty('--hold-shadow', state.shadow);
    pixel.style.backgroundColor = 'var(--hold-color, var(--pulse-color, #ffffff))';
    pixel.style.boxShadow = 'var(--hold-shadow, var(--pulse-shadow, none))';
    pixel.style.removeProperty('animation');
    pixel.dataset.sheetHoldUntil = String(Math.round(state.untilMs));
}

function applyMidHoldBase(mid: HTMLElement, state: HoldState) {
    if (state.color) mid.style.setProperty('--hold-color', state.color);
    if (state.shadow) mid.style.setProperty('--hold-shadow', state.shadow);
    mid.style.backgroundColor = 'color-mix(in srgb, var(--hold-color, var(--pulse-color, #ffffff)) 16%, transparent)';
    mid.style.boxShadow = 'var(--hold-shadow, var(--pulse-shadow, none))';
    mid.style.removeProperty('animation');
    mid.dataset.sheetHoldUntil = String(Math.round(state.untilMs));
}

function clearHoldBase(element: HTMLElement) {
    delete element.dataset.sheetHoldUntil;
    element.style.removeProperty('--hold-color');
    element.style.removeProperty('--hold-shadow');
    element.style.removeProperty('background-color');
    element.style.removeProperty('box-shadow');
    element.style.removeProperty('animation');
}

function getHoldUntil(pixel: HTMLElement) {
    const raw = pixel.dataset.sheetHoldUntil;
    if (!raw) return null;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : null;
}

function formatDurationMs(durationMs: number) {
    return `${Math.max(1, Math.round(durationMs))}ms`;
}

function restartAnimationWithDuration(element: HTMLElement, name: string, durationMs: number) {
    element.style.setProperty('--beat-anim-duration', formatDurationMs(durationMs));
    restartAnimation(element, `${name} var(--beat-anim-duration)`);
}

function getAnimationTimebaseMs(ctx: SheetTriggerContext) {
    const msPerBeat = 60_000 / (ctx.bpm || BPM);
    const msPerBar = msPerBeat * ctx.beatsPerBar;
    const msPerSubBeat = msPerBeat / ctx.subBeatsPerBeat;
    const subBeatsPerEighth = ctx.subBeatsPerBeat / 2;
    const hasEighth = Number.isInteger(subBeatsPerEighth) && subBeatsPerEighth >= 1;
    const msPerEighth = hasEighth ? msPerBeat / 2 : msPerSubBeat;

    const isBarStart = ctx.beat === 1 && ctx.subBeat === 1;
    if (isBarStart) return msPerBar;

    const isBeatBoundary = (ctx.subBeat - 1) % ctx.subBeatsPerBeat === 0;
    if (isBeatBoundary) return msPerBeat;

    const isEighthBoundary = hasEighth && (ctx.subBeat - 1) % subBeatsPerEighth === 0;
    if (isEighthBoundary) return msPerEighth;

    return msPerSubBeat;
}

function triggerSheetAction(action: string, ctx: SheetTriggerContext) {
    if (typeof document === 'undefined') return;
    const [baseAction, ...metaParts] = action.split('@');
    const meta = metaParts.join('@');

    const msPerBeat = 60_000 / (ctx.bpm || BPM);
    const msPerBar = msPerBeat * ctx.beatsPerBar;
    const isBarStart = ctx.beat === 1 && ctx.subBeat === 1;
    const barsMatch = /(?:^|,)bars=(\d+)(?:,|$)/.exec(meta);
    const barsOverride = barsMatch ? Number.parseInt(barsMatch[1], 10) : null;
    const holdDurationMs = isBarStart
        ? msPerBar * (barsOverride && Number.isFinite(barsOverride) ? barsOverride : 1)
        : msPerBeat;

    if (baseAction === 'm-s-beatpulse') {
        const durationMs = getAnimationTimebaseMs(ctx) * 0.56;
        document.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
            restartAnimationWithDuration(mid, 'beatMidPulse', durationMs);
        });
        return;
    }

    if (baseAction === 'i-s-beatflash' || baseAction === 's-i-beatflash') {
        const durationMs = getAnimationTimebaseMs(ctx) * 0.36;
        document.querySelectorAll<HTMLElement>('.inner-square:not([data-music-player-program])').forEach((pixel) => {
            restartAnimationWithDuration(pixel, 'beatFlash', durationMs);
        });
        return;
    }

    if (baseAction === 'i-s-beathold' || baseAction === 's-i-beathold') {
        const pulse = snapshotPulseVars();
        const untilMs = (typeof performance === 'undefined' ? Date.now() : performance.now()) + holdDurationMs;
        const state: HoldState = {
            untilMs,
            color: pulse?.color ?? null,
            shadow: pulse?.shadow ?? null,
        };
        document.querySelectorAll<HTMLElement>('.inner-square:not([data-music-player-program])').forEach((pixel) => {
            applyInnerHoldBase(pixel, state);
        });
        return;
    }

    if (baseAction === 'm-s-beathold') {
        const pulse = snapshotPulseVars();
        const untilMs = (typeof performance === 'undefined' ? Date.now() : performance.now()) + holdDurationMs;
        const state: HoldState = {
            untilMs,
            color: pulse?.color ?? null,
            shadow: pulse?.shadow ?? null,
        };
        document.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
            applyMidHoldBase(mid, state);
        });
        return;
    }

    if (baseAction === 'i-s-beatpulse' || baseAction === 's-i-beatpulse') {
        const durationMs = getAnimationTimebaseMs(ctx);
        document.querySelectorAll<HTMLElement>('.inner-square:not([data-music-player-program])').forEach((pixel) => {
            restartAnimationWithDuration(pixel, 'beatPulse', durationMs);
        });
        return;
    }

    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[sheet] unknown action', action);
    }
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
                    const summary = Object.fromEntries(animationCountsRef.current.entries());
                    // eslint-disable-next-line no-console
                    console.log('[anim]', previousStamp, summary);
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
                        if (import.meta.env.DEV) {
                            // eslint-disable-next-line no-console
                            console.log('[sheet]', tickKey, actions);
                        }
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
            const stamp = lastAnimationStampRef.current;
            if (stamp) {
                const summary = Object.fromEntries(animationCountsRef.current.entries());
                if (Object.keys(summary).length > 0) {
                    // eslint-disable-next-line no-console
                    console.log('[anim]', stamp, summary);
                }
            }
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
            if (!until) return;

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
        const barsLabel = `${effectiveBars} ${effectiveBars === 1 ? 'bar' : 'bars'}`;
        return `${bpm} BPM • ${barsLabel}`;
    }, [effectiveBars, sheet]);

    const clockLabel = useMemo(() => {
        const eightBeat = clock.subBeat > 0 ? (Math.floor((clock.subBeat - 1) / 2) % 4) + 1 : 0;
        const beatPart = `${clock.bar}|${clock.beat}|${eightBeat}`;
        const metaPart = sheetSummary ? ` • ${sheetSummary}` : '';
        return `${clock.time} ${beatPart}${metaPart}`;
    }, [clock.beat, clock.bar, clock.subBeat, clock.time, sheetSummary]);

    const clockTitle = useMemo(() => {
        const defaults = `BPM ${BPM}, sub-beats per beat ${SUB_BEATS_PER_BEAT}`;
        if (!sheet) return defaults;
        return `Sheet: ${sheet.bpm} BPM, ${effectiveBars} bars • ${defaults}`;
    }, [effectiveBars, sheet]);

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
