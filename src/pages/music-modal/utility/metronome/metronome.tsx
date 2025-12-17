import type { BeatPalette } from './color-randomizer';
import { applyBeatPaletteToDom, getRandomBeatPalette, getRandomColorFromPalette, hexToRgba, resetBeatPaletteOnDom } from './color-randomizer';

export const BPM = 120;
export const BEATS_PER_BAR = 4;

const secondsPerBeat = 60 / BPM;
const secondsPerBar = secondsPerBeat * BEATS_PER_BAR;

let rafId: number | null = null;
let startTimestamp: number | null = null;
let lastBeat: number | null = null;
let activePalette: BeatPalette | null = null;

const hasDom = () => typeof document !== 'undefined';

function resetMusicClock() {
    if (!hasDom()) return;
    document.documentElement.style.removeProperty('--bar');
    document.documentElement.style.removeProperty('--beat');
    delete document.body.dataset.bar;
    delete document.body.dataset.beat;
    resetBeatPaletteOnDom();
    lastBeat = null;
    activePalette = null;
}

function randomizeInnerSquares(beat: number) {
    if (!hasDom() || !activePalette) return;
    const palette = activePalette;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(`.inner-square.beat-${beat}`));
    if (targets.length === 0) return;

    targets.forEach((target) => {
        const color = getRandomColorFromPalette(palette);
        target.style.backgroundColor = color;
        target.style.boxShadow = `0 10px 24px ${hexToRgba(color, 0.42)}, 0 0 0 1px ${hexToRgba(color, 0.32)}`;
    });
}

function updateMusicClock(time: number) {
    if (!hasDom()) return;

    const bar = Math.floor(time / secondsPerBar) + 1;
    const beat = Math.floor((time % secondsPerBar) / secondsPerBeat) + 1;

    document.documentElement.style.setProperty('--bar', bar.toString());
    document.documentElement.style.setProperty('--beat', beat.toString());

    document.body.dataset.bar = bar.toString().padStart(3, '0');
    document.body.dataset.beat = beat.toString();

    if (beat !== lastBeat) {
        lastBeat = beat;
        randomizeInnerSquares(beat);
    }
}

function tick(timestamp: number) {
    if (startTimestamp === null) startTimestamp = timestamp;
    const elapsedSeconds = (timestamp - startTimestamp) / 1000;
    updateMusicClock(elapsedSeconds);
    rafId = requestAnimationFrame(tick);
}

export function startMetronome() {
    if (!hasDom() || typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') return;
    if (rafId !== null) return;
    startTimestamp = null;
    const palette = getRandomBeatPalette();
    activePalette = palette;
    applyBeatPaletteToDom(palette);
    updateMusicClock(0);
    rafId = requestAnimationFrame(tick);
}

export function stopMetronome() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    resetMusicClock();
}
