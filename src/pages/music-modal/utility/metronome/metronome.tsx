import type { BeatPalette } from './color-randomizer';
import { applyBeatPaletteToDom, getRandomBeatPalette, getRandomColorFromPalette, hexToRgba, resetBeatPaletteOnDom } from './color-randomizer';

export const BPM = 120;
export const BEATS_PER_BAR = 4;
export const SUB_BEATS_PER_BEAT = 4;
export const SUB_BEATS_PER_BAR = BEATS_PER_BAR * SUB_BEATS_PER_BEAT;

export type PaletteMode = 'random' | 'white';

const secondsPerBeat = 60 / BPM;
const secondsPerSubBeat = secondsPerBeat / SUB_BEATS_PER_BEAT;
const secondsPerBar = secondsPerBeat * BEATS_PER_BAR;

const PULSE_SUB_BEATS = new Set<number>([1, 5, 9, 13]);

let rafId: number | null = null;
let startTimestamp: number | null = null;
let lastBeat: number | null = null;
let lastSubBeat: number | null = null;
let activePalette: BeatPalette | null = null;

const hasDom = () => typeof document !== 'undefined';

function getPaletteForMode(mode: PaletteMode): BeatPalette {
    if (mode === 'white') {
        return { name: 'White', colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] };
    }
    return getRandomBeatPalette();
}

function setPulseVars(color: string) {
    if (!hasDom()) return;
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
    document.documentElement.style.removeProperty('--pulse-shadow');
    delete document.body.dataset.bar;
    delete document.body.dataset.beat;
    delete document.body.dataset.subBeat;
    resetBeatPaletteOnDom();
    lastBeat = null;
    lastSubBeat = null;
    activePalette = null;
}

function randomizeInnerSquares(subBeat: number) {
    if (!hasDom() || !activePalette) return;
    const palette = activePalette;

    if (!PULSE_SUB_BEATS.has(subBeat)) return;

    const pulseColor = getRandomColorFromPalette(palette);
    setPulseVars(pulseColor);

    const targets = Array.from(document.querySelectorAll<HTMLElement>(`.inner-square.sub-beat-${subBeat}`));
    if (targets.length === 0) return;

    targets.forEach((target) => {
        target.style.backgroundColor = pulseColor;
        target.style.boxShadow = `0 10px 24px ${hexToRgba(pulseColor, 0.42)}, 0 0 0 1px ${hexToRgba(pulseColor, 0.32)}`;
    });
}

function updateMusicClock(time: number) {
    if (!hasDom()) return;

    const bar = Math.floor(time / secondsPerBar) + 1;
    const subBeat = Math.min(SUB_BEATS_PER_BAR, Math.floor((time % secondsPerBar) / secondsPerSubBeat) + 1);
    const beat = Math.floor((subBeat - 1) / SUB_BEATS_PER_BEAT) + 1;

    document.documentElement.style.setProperty('--bar', bar.toString());
    document.documentElement.style.setProperty('--beat', beat.toString());
    document.documentElement.style.setProperty('--sub-beat', subBeat.toString());

    document.body.dataset.bar = bar.toString().padStart(3, '0');
    document.body.dataset.beat = beat.toString();
    document.body.dataset.subBeat = subBeat.toString();

    if (beat !== lastBeat) {
        lastBeat = beat;
    }

    if (subBeat !== lastSubBeat) {
        lastSubBeat = subBeat;
        randomizeInnerSquares(subBeat);
    }
}

function tick(timestamp: number) {
    if (startTimestamp === null) startTimestamp = timestamp;
    const elapsedSeconds = (timestamp - startTimestamp) / 1000;
    updateMusicClock(elapsedSeconds);
    rafId = requestAnimationFrame(tick);
}

export function startMetronome(mode: PaletteMode = 'random') {
    if (!hasDom() || typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') return;
    if (rafId !== null) {
        setMetronomePaletteMode(mode);
        return;
    }
    startTimestamp = null;
    setMetronomePaletteMode(mode);
    updateMusicClock(0);
    rafId = requestAnimationFrame(tick);
}

export function setMetronomePaletteMode(mode: PaletteMode) {
    if (!hasDom()) return;
    const palette = getPaletteForMode(mode);
    activePalette = palette;
    applyBeatPaletteToDom(palette);
    setPulseVars(getRandomColorFromPalette(palette));
    if (lastSubBeat !== null) randomizeInnerSquares(lastSubBeat);
}

export function stopMetronome() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    resetMusicClock();
}
