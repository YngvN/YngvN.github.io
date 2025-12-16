export const BPM = 120;
export const BEATS_PER_BAR = 4;

const secondsPerBeat = 60 / BPM;
const secondsPerBar = secondsPerBeat * BEATS_PER_BAR;

let rafId: number | null = null;
let startTimestamp: number | null = null;

const hasDom = () => typeof document !== 'undefined';

function resetMusicClock() {
    if (!hasDom()) return;
    document.documentElement.style.removeProperty('--bar');
    document.documentElement.style.removeProperty('--beat');
    delete document.body.dataset.bar;
    delete document.body.dataset.beat;
}

function updateMusicClock(time: number) {
    if (!hasDom()) return;

    const bar = Math.floor(time / secondsPerBar) + 1;
    const beat = Math.floor((time % secondsPerBar) / secondsPerBeat) + 1;

    document.documentElement.style.setProperty('--bar', bar.toString());
    document.documentElement.style.setProperty('--beat', beat.toString());

    document.body.dataset.bar = bar.toString().padStart(3, '0');
    document.body.dataset.beat = beat.toString();
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
