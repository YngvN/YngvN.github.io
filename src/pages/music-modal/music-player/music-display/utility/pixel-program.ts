export const PROGRAM_ATTR = 'data-music-player-program';

type GridSize = {
    cols: number;
    rows: number;
};

function parseCssInt(value: string) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function getActiveSquareLayer() {
    if (typeof document === 'undefined') return null;
    return document.querySelector<HTMLElement>('.outer-square--active');
}

export function getSquareGridSizeFromDom(): GridSize | null {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const container = getActiveSquareLayer();
    if (!container) return null;

    const style = window.getComputedStyle(container);
    const cols = parseCssInt(style.getPropertyValue('--grid-cols'));
    const rows = parseCssInt(style.getPropertyValue('--grid-rows'));
    if (!cols || !rows) return null;

    return { cols, rows };
}

export function buildInnerPixelMap() {
    const layer = getActiveSquareLayer();
    if (!layer) return new Map<string, HTMLElement>();
    const pixels = Array.from(layer.querySelectorAll<HTMLElement>('.inner-square'));
    const map = new Map<string, HTMLElement>();

    pixels.forEach((pixel) => {
        const classes = pixel.className.split(/\s+/);
        const tag = classes.find((c) => c.startsWith('i-s--'));
        if (!tag) return;
        const [, coords] = tag.split('i-s--');
        if (!coords) return;
        map.set(coords, pixel);
    });

    return map;
}

export function clearProgramPixels() {
    const layer = getActiveSquareLayer();
    if (!layer) return;
    layer.querySelectorAll<HTMLElement>(`.inner-square[${PROGRAM_ATTR}]`).forEach((pixel) => {
        pixel.style.removeProperty('opacity');
        pixel.style.removeProperty('background-color');
        pixel.style.removeProperty('box-shadow');
        pixel.style.removeProperty('--pixel-rot');
        pixel.classList.remove('pixel');
        pixel.removeAttribute(PROGRAM_ATTR);
    });
    layer.querySelectorAll<HTMLElement>('.mid-square[data-music-player-program-mid]').forEach((mid) => {
        mid.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
            pixel.style.opacity = '0';
        });
        mid.removeAttribute('data-music-player-program-mid');
    });
}
