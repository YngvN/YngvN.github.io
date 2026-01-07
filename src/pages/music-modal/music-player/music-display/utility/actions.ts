import { BPM } from '../../../utility/metronome/metronome';
import type { SheetTriggerContext, HoldState } from './types';
import { applyPixelWriterText } from '../pixel-writer/pixel-writer';
import { applyInnerHoldBase, applyMidHoldBase, restartAnimationWithDuration, snapshotPulseVars } from './visual';

function parseMetaNumber(meta: string, key: string) {
    const match = new RegExp(`(?:^|,)${key}=(\\d+)(?:,|$)`).exec(meta);
    if (!match) return null;
    const value = Number.parseInt(match[1], 10);
    return Number.isFinite(value) ? value : null;
}

function parseMetaVariant(meta: string) {
    const match = /(?:^|,)variant=(pulse|flash)(?:,|$)/.exec(meta);
    return match ? match[1] : null;
}

function parseMetaColors(meta: string) {
    const match = /(?:^|,)colors=([^,]+)(?:,|$)/.exec(meta);
    if (!match) return null;
    return match[1]
        .split('|')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
}

function pickRandom<T>(list: T[], count: number) {
    const picks: T[] = [];
    const pool = list.slice();
    const total = Math.max(0, Math.min(count, pool.length));
    for (let i = 0; i < total; i += 1) {
        const idx = Math.floor(Math.random() * pool.length);
        picks.push(pool[idx]);
        pool.splice(idx, 1);
    }
    return picks;
}

function getActiveSquareLayer() {
    if (typeof document === 'undefined') return null;
    return document.querySelector<HTMLElement>('.outer-square--active');
}

function getAnimatableInnerSquares() {
    const layer = getActiveSquareLayer();
    if (!layer) return [];
    return Array.from(
        layer.querySelectorAll<HTMLElement>(
            '.mid-square .inner-square:not([data-music-player-program])',
        ),
    );
}

function getActiveNeighborInnerSquares() {
    const layer = getActiveSquareLayer();
    if (!layer) return [];
    const midSquares = new Set<HTMLElement>();
    layer
        .querySelectorAll<HTMLElement>('.mid-square .inner-square.pixel')
        .forEach((pixel) => {
            const mid = pixel.closest<HTMLElement>('.mid-square');
            if (mid) midSquares.add(mid);
        });

    const neighbors: HTMLElement[] = [];
    midSquares.forEach((mid) => {
        mid.querySelectorAll<HTMLElement>('.inner-square:not(.pixel):not([data-music-player-program])').forEach((pixel) => {
            neighbors.push(pixel);
        });
    });
    return neighbors;
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

export function triggerSheetAction(action: string, ctx: SheetTriggerContext) {
    if (typeof document === 'undefined') return;
    if (action.startsWith('pixel-write:')) {
        applyPixelWriterText(action.slice('pixel-write:'.length));
        return;
    }
    const [baseAction, ...metaParts] = action.split('@');
    const meta = metaParts.join('@');
    // eslint-disable-next-line no-console
    console.log('[anim]', { action: baseAction, bar: ctx.bar, beat: ctx.beat, subBeat: ctx.subBeat });

    if (baseAction === 'm-s-zones') {
        const root = document.documentElement;
        const count = parseMetaNumber(meta, 'count');
        const colors = parseMetaColors(meta);
        if (count && Number.isFinite(count)) {
            root.style.setProperty('--mid-zone-count', String(count));
        } else {
            root.style.removeProperty('--mid-zone-count');
        }
        if (colors && colors.length > 0) {
            colors.forEach((color, index) => {
                root.style.setProperty(`--zone-color-${index + 1}`, color);
            });
        }
        window.dispatchEvent(new CustomEvent('music-player:zones', { detail: { count: count ?? undefined } }));
        return;
    }

    const msPerBeat = 60_000 / (ctx.bpm || BPM);
    const msPerBar = msPerBeat * ctx.beatsPerBar;
    const isBarStart = ctx.beat === 1 && ctx.subBeat === 1;
    const barsMatch = /(?:^|,)bars=(\d+)(?:,|$)/.exec(meta);
    const barsOverride = barsMatch ? Number.parseInt(barsMatch[1], 10) : null;
    const holdDurationMs = isBarStart
        ? msPerBar * (barsOverride && Number.isFinite(barsOverride) ? barsOverride : 1)
        : msPerBeat;

    if (baseAction === 'm-s-beatpulse') {
        const layer = getActiveSquareLayer();
        if (!layer) return;
        const durationMs = getAnimationTimebaseMs(ctx);
        layer.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
            restartAnimationWithDuration(mid, 'beatMidPulse', durationMs);
        });
        getActiveNeighborInnerSquares().forEach((pixel) => {
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
            restartAnimationWithDuration(pixel, 'beatPulse', durationMs);
        });
        return;
    }

    if (baseAction === 'm-s-beatflash') {
        const layer = getActiveSquareLayer();
        if (!layer) return;
        const durationMs = getAnimationTimebaseMs(ctx);
        layer.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
            restartAnimationWithDuration(mid, 'beatMidFlash', durationMs);
        });
        getActiveNeighborInnerSquares().forEach((pixel) => {
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
            restartAnimationWithDuration(pixel, 'beatFlash', durationMs);
        });
        return;
    }

    if (baseAction === 'i-s-beatflash' || baseAction === 's-i-beatflash') {
        const durationMs = (60_000 / (ctx.bpm || BPM)) * 0.36;
        getAnimatableInnerSquares().forEach((pixel) => {
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
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
        getAnimatableInnerSquares().forEach((pixel) => {
            applyInnerHoldBase(pixel, state);
        });
        return;
    }

    if (baseAction === 'm-s-beathold') {
        const layer = getActiveSquareLayer();
        if (!layer) return;
        const pulse = snapshotPulseVars();
        const untilMs = (typeof performance === 'undefined' ? Date.now() : performance.now()) + holdDurationMs;
        const state: HoldState = {
            untilMs,
            color: pulse?.color ?? null,
            shadow: pulse?.shadow ?? null,
        };
        layer.querySelectorAll<HTMLElement>('.mid-square').forEach((mid) => {
            applyMidHoldBase(mid, state);
        });
        return;
    }

    if (baseAction === 'i-s-beatpulse' || baseAction === 's-i-beatpulse') {
        const durationMs = getAnimationTimebaseMs(ctx);
        getAnimatableInnerSquares().forEach((pixel) => {
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
            restartAnimationWithDuration(pixel, 'beatPulse', durationMs);
        });
        return;
    }

    if (baseAction === 'random-pixel' || baseAction === 'random-pixel-pulse' || baseAction === 'random-pixel-flash') {
        const count = parseMetaNumber(meta, 'count') ?? 6;
        const variant =
            baseAction === 'random-pixel'
                ? parseMetaVariant(meta) ?? 'pulse'
                : baseAction.endsWith('flash')
                  ? 'flash'
                  : 'pulse';
        const pixels = Array.from(getAnimatableInnerSquares());
        const chosen = pickRandom(pixels, Math.max(1, count));
        const durationMs = getAnimationTimebaseMs(ctx) * (variant === 'flash' ? 0.36 : 1);
        chosen.forEach((pixel) => {
            pixel.style.opacity = '1';
            pixel.classList.add('pixel');
            restartAnimationWithDuration(pixel, variant === 'flash' ? 'randomPixelFlash' : 'randomPixelPulse', durationMs);
        });
        return;
    }
}
