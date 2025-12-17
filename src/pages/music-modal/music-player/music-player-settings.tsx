export const resolution = 500;

// Returns a sensible pixel size for the current viewport/grid.
// This value is used as `--pixel-min-size` for the inner squares.
export function resolutionSizePx(viewportWidth: number, viewportHeight: number, cols: number, rows: number) {
    const safeCols = Math.max(1, cols);
    const safeRows = Math.max(1, rows);

    const cell = Math.min(viewportWidth / (safeCols * 2), viewportHeight / (safeRows * 2));
    // Match the visual scale used in `squares.scss` so this roughly reflects the visible "pixel" size.
    const scaled = cell * 0.67;

    return Math.max(6, Math.min(80, Math.round(scaled)));
}

export const GLYPH_HEIGHT_FRACTION = 5 / 10;
export const GLYPH_WIDTH_FRACTION = 7 / 10;

