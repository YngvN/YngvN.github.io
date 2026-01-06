export function formatClockTime(elapsedMs: number) {
    const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function readBeatClockFromDom() {
    if (typeof document === 'undefined') return { bar: 0, beat: 0, subBeat: 0, eightBeat: 0 };
    const bar = Number.parseInt(document.body.dataset.bar ?? '0', 10) || 0;
    const beat = Number.parseInt(document.body.dataset.beat ?? '0', 10) || 0;
    const subBeat = Number.parseInt(document.body.dataset.subBeat ?? '0', 10) || 0;
    const eightBeat = Number.parseInt(document.body.dataset.eightBeat ?? '0', 10) || 0;
    return { bar, beat, subBeat, eightBeat };
}
