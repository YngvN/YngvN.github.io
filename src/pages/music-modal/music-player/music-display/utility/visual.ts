import type { HoldState } from './types';

function restartAnimation(element: HTMLElement, animation: string) {
    element.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
    element.style.animation = animation;
}

function formatDurationMs(durationMs: number) {
    return `${Math.max(1, Math.round(durationMs))}ms`;
}

export function restartAnimationWithDuration(element: HTMLElement, name: string, durationMs: number) {
    element.style.setProperty('--beat-anim-duration', formatDurationMs(durationMs));
    restartAnimation(element, `${name} var(--beat-anim-duration)`);
}

export function snapshotPulseVars() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const style = window.getComputedStyle(document.documentElement);
    const color = style.getPropertyValue('--pulse-color').trim();
    const shadow = style.getPropertyValue('--pulse-shadow').trim();
    return {
        color: color.length > 0 ? color : null,
        shadow: shadow.length > 0 ? shadow : null,
    };
}

export function clearAllSquares() {
    if (typeof document === 'undefined') return;
    const layer = document.querySelector<HTMLElement>('.outer-square--active');
    if (!layer) return;
    layer.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
        pixel.style.removeProperty('opacity');
        pixel.style.removeProperty('background-color');
        pixel.style.removeProperty('box-shadow');
        pixel.classList.remove('pixel');
        delete pixel.dataset.sheetHoldUntil;
        pixel.style.removeProperty('--hold-color');
        pixel.style.removeProperty('--hold-shadow');
        pixel.removeAttribute('data-music-player-program');
        pixel.style.removeProperty('animation');
        pixel.style.opacity = '0';
    });
    layer.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
        mid.style.removeProperty('animation');
    });
}

export function applyInnerHoldBase(pixel: HTMLElement, state: HoldState) {
    pixel.style.opacity = '1';
    pixel.classList.add('pixel');
    if (state.color) pixel.style.setProperty('--hold-color', state.color);
    if (state.shadow) pixel.style.setProperty('--hold-shadow', state.shadow);
    pixel.style.backgroundColor = 'var(--hold-color, var(--pulse-color, #ffffff))';
    pixel.style.boxShadow = 'var(--hold-shadow, var(--pulse-shadow, none))';
    pixel.style.removeProperty('animation');
    pixel.dataset.sheetHoldUntil = String(Math.round(state.untilMs));
}

export function applyMidHoldBase(mid: HTMLElement, state: HoldState) {
    if (state.color) mid.style.setProperty('--hold-color', state.color);
    if (state.shadow) mid.style.setProperty('--hold-shadow', state.shadow);
    mid.style.backgroundColor = 'color-mix(in srgb, var(--hold-color, var(--pulse-color, #ffffff)) 16%, transparent)';
    mid.style.boxShadow = 'var(--hold-shadow, var(--pulse-shadow, none))';
    mid.style.removeProperty('animation');
    mid.dataset.sheetHoldUntil = String(Math.round(state.untilMs));
}

export function clearHoldBase(element: HTMLElement) {
    delete element.dataset.sheetHoldUntil;
    element.style.removeProperty('--hold-color');
    element.style.removeProperty('--hold-shadow');
    element.style.removeProperty('background-color');
    element.style.removeProperty('box-shadow');
    element.style.removeProperty('animation');
    if (element.classList.contains('inner-square')) {
        element.style.opacity = '0';
        element.classList.remove('pixel');
    }
}

export function getHoldUntil(pixel: HTMLElement) {
    const raw = pixel.dataset.sheetHoldUntil;
    if (!raw) return null;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : null;
}
