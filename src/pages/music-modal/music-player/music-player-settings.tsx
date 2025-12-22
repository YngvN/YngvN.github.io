export const resolution = 600;

// Returns a sensible pixel size for the current viewport/grid.
// This value is used as `--pixel-min-size` for the inner squares.
export function resolutionSizePx(viewportWidth: number, viewportHeight: number, cols: number, rows: number) {
    const safeCols = Math.max(1, cols);
    const safeRows = Math.max(1, rows);

    const cell = Math.min(viewportWidth / (safeCols * 2), viewportHeight / (safeRows * 2));
    // Fit each inner square exactly to its cell size.
    return cell;
}

export const GLYPH_HEIGHT_FRACTION = 5 / 10;
export const GLYPH_WIDTH_FRACTION = 7 / 10;
