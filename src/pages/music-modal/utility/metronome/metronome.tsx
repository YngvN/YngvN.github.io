import type { BeatPalette } from './color-randomizer';
import { applyBeatPaletteToDom, getRandomBeatPalette, getRandomColorFromPalette, hexToRgba, resetBeatPaletteOnDom } from './color-randomizer';

export const BPM = 120;
export const BEATS_PER_BAR = 4;
export const SUB_BEATS_PER_BEAT = 4;
export const SUB_BEATS_PER_BAR = BEATS_PER_BAR * SUB_BEATS_PER_BEAT;

export type PaletteMode = 'random' | 'white';

export type MetronomeGrid = {
    bpm: number;
    beatsPerBar: number;
    subBeatsPerBeat: number;
};

export type StartMetronomeOptions = {
    mode?: PaletteMode;
    grid?: Partial<MetronomeGrid>;
    startAtSeconds?: number;
};

const DEFAULT_GRID: MetronomeGrid = {
    bpm: BPM,
    beatsPerBar: BEATS_PER_BAR,
    subBeatsPerBeat: SUB_BEATS_PER_BEAT,
};

let rafId: number | null = null;
let startTimestamp: number | null = null;
let lastBeat: number | null = null;
let lastSubBeat: number | null = null;
let activePalette: BeatPalette | null = null;
let activeGrid: MetronomeGrid = DEFAULT_GRID;

const hasDom = () => typeof document !== 'undefined';

function getPaletteForMode(mode: PaletteMode): BeatPalette {
    if (mode === 'white') {
        return { name: 'White', colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] };
    }
    return getRandomBeatPalette();
}

function setPulseVars(color: string) {
    if (!hasDom()) return;
    document.documentElement.style.setProperty('--pulse-color-base', color);
    document.documentElement.style.setProperty('--pulse-color', color);
    document.documentElement.style.setProperty(
        '--pulse-shadow',
        `0 10px 24px ${hexToRgba(color, 0.42)}, 0 0 0 1px ${hexToRgba(color, 0.32)}`,
    );
}

function resetMusicClock() {
    if (!hasDom()) return;
    document.documentElement.style.removeProperty('--bar');
    document.documentElement.style.removeProperty('--beat');
    document.documentElement.style.removeProperty('--sub-beat');
    document.documentElement.style.removeProperty('--pulse-color');
    document.documentElement.style.removeProperty('--pulse-color-base');
    document.documentElement.style.removeProperty('--pulse-shadow');
    delete document.body.dataset.bar;
    delete document.body.dataset.beat;
    delete document.body.dataset.subBeat;
    delete document.body.dataset.eightBeat;
    resetBeatPaletteOnDom();
    lastBeat = null;
    lastSubBeat = null;
    activePalette = null;
}

function updatePulseForSubBeat(subBeat: number) {
    if (!hasDom() || !activePalette) return;
    const palette = activePalette;

    if ((subBeat - 1) % activeGrid.subBeatsPerBeat !== 0) return;

    const pulseColor = getRandomColorFromPalette(palette);
    setPulseVars(pulseColor);
}

function updateMusicClock(time: number) {
    if (!hasDom()) return;

    const { bar, beat, subBeat, eightBeat } = getBeatClockAtTime(time, activeGrid);

    document.documentElement.style.setProperty('--bar', bar.toString());
    document.documentElement.style.setProperty('--beat', beat.toString());
    document.documentElement.style.setProperty('--sub-beat', subBeat.toString());

    document.body.dataset.bar = bar.toString().padStart(3, '0');
    document.body.dataset.beat = beat.toString();
    document.body.dataset.subBeat = subBeat.toString();
    document.body.dataset.eightBeat = eightBeat.toString();

    if (beat !== lastBeat) {
        lastBeat = beat;
    }

    if (subBeat !== lastSubBeat) {
        lastSubBeat = subBeat;
        updatePulseForSubBeat(subBeat);
    }
}

function tick(timestamp: number) {
    if (startTimestamp === null) startTimestamp = timestamp;
    const elapsedSeconds = (timestamp - startTimestamp) / 1000;
    updateMusicClock(elapsedSeconds);
    rafId = requestAnimationFrame(tick);
}

export function getBeatClockAtTime(time: number, grid: Partial<MetronomeGrid> = {}) {
    const bpm = Math.max(1, grid.bpm ?? DEFAULT_GRID.bpm);
    const beatsPerBar = Math.max(1, grid.beatsPerBar ?? DEFAULT_GRID.beatsPerBar);
    const subBeatsPerBeat = Math.max(1, grid.subBeatsPerBeat ?? DEFAULT_GRID.subBeatsPerBeat);

    const secondsPerBeat = 60 / bpm;
    const secondsPerSubBeat = secondsPerBeat / subBeatsPerBeat;
    const secondsPerBar = secondsPerBeat * beatsPerBar;
    const subBeatsPerBar = beatsPerBar * subBeatsPerBeat;

    const bar = Math.floor(time / secondsPerBar) + 1;
    const subBeat = Math.min(subBeatsPerBar, Math.floor((time % secondsPerBar) / secondsPerSubBeat) + 1);
    const beat = Math.floor((subBeat - 1) / subBeatsPerBeat) + 1;
    const eightBeat =
        subBeatsPerBeat % 2 === 0
            ? (Math.floor((subBeat - 1) / (subBeatsPerBeat / 2)) % (beatsPerBar * 2)) + 1
            : (Math.floor((subBeat - 1) / subBeatsPerBeat) % beatsPerBar) + 1;

    return { bar, beat, subBeat, eightBeat };
}

export function startMetronome(options: StartMetronomeOptions | PaletteMode = 'random') {
    if (!hasDom() || typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') return;
    const resolvedOptions: StartMetronomeOptions =
        typeof options === 'string'
            ? { mode: options }
            : {
                  mode: options.mode,
                  grid: options.grid,
                  startAtSeconds: options.startAtSeconds,
              };

    activeGrid = {
        ...DEFAULT_GRID,
        ...(resolvedOptions.grid ?? {}),
    };

    const startAtSeconds = Math.max(0, resolvedOptions.startAtSeconds ?? 0);
    if (rafId !== null) {
        setMetronomePaletteMode(resolvedOptions.mode ?? 'random');
        if (startAtSeconds > 0) {
            const now = typeof performance === 'undefined' ? Date.now() : performance.now();
            startTimestamp = now - startAtSeconds * 1000;
            updateMusicClock(startAtSeconds);
        }
        return;
    }
    startTimestamp = null;
    setMetronomePaletteMode(resolvedOptions.mode ?? 'random');
    if (startAtSeconds > 0) {
        const now = typeof performance === 'undefined' ? Date.now() : performance.now();
        startTimestamp = now - startAtSeconds * 1000;
        updateMusicClock(startAtSeconds);
    } else {
        updateMusicClock(0);
    }
    rafId = requestAnimationFrame(tick);
}

export function setMetronomePaletteMode(mode: PaletteMode) {
    if (!hasDom()) return;
    const palette = getPaletteForMode(mode);
    activePalette = palette;
    applyBeatPaletteToDom(palette);
    setPulseVars(getRandomColorFromPalette(palette));
    if (lastSubBeat !== null) updatePulseForSubBeat(lastSubBeat);
}

export function stopMetronome() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    resetMusicClock();
}
