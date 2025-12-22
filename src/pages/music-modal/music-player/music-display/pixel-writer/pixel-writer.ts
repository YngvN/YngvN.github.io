import { PROGRAM_ATTR, buildInnerPixelMap, clearProgramPixels, getSquareGridSizeFromDom } from '../utility/pixel-program';

export type PixelWriterAlignX = 'left' | 'center' | 'right';
export type PixelWriterAlignY = 'top' | 'center' | 'bottom';

export type PixelWriterAlignment = {
    x: PixelWriterAlignX;
    y: PixelWriterAlignY;
};

export type PixelWriterParseResult = {
    text: string;
    align: PixelWriterAlignment;
};

const DEFAULT_ALIGNMENT: PixelWriterAlignment = { x: 'center', y: 'center' };

type PixelGlyphMap = ReadonlyArray<ReadonlyArray<number>>;

const PIXEL_GLYPHS: Partial<Record<string, PixelGlyphMap>> = {
    A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    B: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    C: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
    ],
    D: [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
    ],
    E: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    F: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    G: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    H: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    I: [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    J: [
        [0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 0, 0],
    ],
    K: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    L: [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    M: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    O: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    P: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    Q: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 1],
    ],
    R: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    S: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    T: [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    U: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    V: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
    ],
    W: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    Y: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    Z: [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    Æ: [
        [0, 1, 1, 1, 1],
        [1, 0, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
    ],
    Ø: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    Å: [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    '0': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '1': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
    ],
    '2': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    '3': [
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    '4': [
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
    ],
    '5': [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
    ],
    '6': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '7': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
    ],
    '8': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '9': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    '?': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    '-': [
        [0, 0],
        [0, 0],
        [1, 1],
        [0, 0],
        [0, 0],
    ],
    '.': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    ' ': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
};

const DEFAULT_GLYPH: PixelGlyphMap = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
];

const ALIGN_TOKENS = new Set(['t', 'b', 'l', 'r', 'c', 'm']);

export function parsePixelWriterInput(rawText: string): PixelWriterParseResult {
    const trimmed = rawText.trim();
    if (trimmed.length === 0) {
        return { text: '', align: DEFAULT_ALIGNMENT };
    }

    const parts = trimmed.split('-');
    let alignX: PixelWriterAlignX = 'center';
    let alignY: PixelWriterAlignY = 'center';
    let used = false;

    let idx = parts.length - 1;
    while (idx >= 0) {
        const token = parts[idx].toLowerCase();
        if (!ALIGN_TOKENS.has(token)) break;
        used = true;
        if (token === 't') alignY = 'top';
        if (token === 'b') alignY = 'bottom';
        if (token === 'l') alignX = 'left';
        if (token === 'r') alignX = 'right';
        idx -= 1;
    }

    if (!used) return { text: trimmed, align: DEFAULT_ALIGNMENT };

    const text = parts.slice(0, idx + 1).join('-').trim();
    return { text, align: { x: alignX, y: alignY } };
}

function getPixelGlyphForChar(char: string): PixelGlyphMap {
    const normalized = char.toUpperCase().slice(0, 1);
    if (normalized.length === 0) return PIXEL_GLYPHS[' '] ?? PIXEL_GLYPHS['?'] ?? DEFAULT_GLYPH;
    return PIXEL_GLYPHS[normalized] ?? PIXEL_GLYPHS['?'] ?? DEFAULT_GLYPH;
}

export function makePixelCoords(text: string, cols: number, rows: number, align: PixelWriterAlignment = DEFAULT_ALIGNMENT) {
    const innerCols = cols * 2;
    const innerRows = rows * 2;
    const glyphCols = 5;
    const glyphRows = 5;
    const glyphSpacing = 1;
    const spaceCols = 2;
    const hyphenCols = 2;
    const lineSpacing = 1;

    const coords = new Set<string>();

    if (innerCols < glyphCols || innerRows < glyphRows) return coords;

    const maxLines = Math.max(0, Math.floor((innerRows + lineSpacing) / (glyphRows + lineSpacing)));
    const normalized = text.toUpperCase().replace(/\r/g, '');
    if (maxLines === 0) return coords;

    const getGlyphWidth = (char: string) => {
        if (char === ' ') return spaceCols;
        if (char === '-') return hyphenCols;
        return glyphCols;
    };
    const getInterCharSpacing = (prev: string, next: string) => (prev !== ' ' && next !== ' ' ? glyphSpacing : 0);
    const getLineWidth = (line: string) => {
        let width = 0;
        line.split('').forEach((char, index, chars) => {
            if (index > 0) width += getInterCharSpacing(chars[index - 1], char);
            width += getGlyphWidth(char);
        });
        return width;
    };

    const lines: string[] = [];
    normalized.split('\n').forEach((line) => {
        if (line.length === 0) {
            lines.push('');
            return;
        }
        let current = '';
        let currentWidth = 0;
        let lastSpaceIndex = -1;
        line.split('').forEach((char) => {
            const width = getGlyphWidth(char);
            const spacing = current.length === 0 ? 0 : getInterCharSpacing(current.slice(-1), char);
            const nextWidth = currentWidth + spacing + width;

            if (nextWidth <= innerCols || current.length === 0) {
                current = `${current}${char}`;
                currentWidth = nextWidth;
                if (char === ' ') {
                    lastSpaceIndex = current.length - 1;
                }
                return;
            }

            if (lastSpaceIndex >= 0) {
                const head = current.slice(0, lastSpaceIndex);
                if (head.length > 0) lines.push(head);
                const tail = current.slice(lastSpaceIndex + 1);
                current = `${tail}${char}`;
                currentWidth = getLineWidth(current);
            } else {
                lines.push(current);
                current = `-${char}`;
                currentWidth = getLineWidth(current);
            }

            lastSpaceIndex = current.lastIndexOf(' ');
        });
        if (current.length > 0) lines.push(current);
    });

    const clampedLines = lines.slice(0, maxLines);
    if (clampedLines.length === 0) return coords;

    const totalHeight = clampedLines.length * glyphRows + (clampedLines.length - 1) * lineSpacing;
    const startY =
        align.y === 'top' ? 0 : align.y === 'bottom' ? Math.max(0, innerRows - totalHeight) : Math.floor((innerRows - totalHeight) / 2);

    clampedLines.forEach((line, lineIndex) => {
        const lineLength = line.length;
        if (lineLength === 0) return;
        const lineWidth = getLineWidth(line);
        const startX =
            align.x === 'left' ? 0 : align.x === 'right' ? Math.max(0, innerCols - lineWidth) : Math.floor((innerCols - lineWidth) / 2);
        const offsetY = startY + lineIndex * (glyphRows + lineSpacing);

        let cursorX = startX;
        line.split('').forEach((char, index, chars) => {
            const glyph = getPixelGlyphForChar(char);
            const offsetX = cursorX;
            glyph.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (!value) return;
                    const gridX = offsetX + x;
                    const gridY = offsetY + y;
                    if (gridX < 0 || gridX >= innerCols) return;
                    if (gridY < 0 || gridY >= innerRows) return;
                    coords.add(`${gridX}-${gridY}`);
                });
            });
            const nextChar = chars[index + 1];
            const spacing = nextChar ? getInterCharSpacing(char, nextChar) : 0;
            cursorX += getGlyphWidth(char) + spacing;
        });
    });

    return coords;
}

export function applyPixelWriterText(rawText: string) {
    if (typeof document === 'undefined') return;
    const { text, align } = parsePixelWriterInput(rawText);
    clearProgramPixels();
    if (!text) return;

    const grid = getSquareGridSizeFromDom();
    if (!grid) return;

    const pixels = buildInnerPixelMap();
    const coords = makePixelCoords(text, grid.cols, grid.rows, align);
    const midSquares = new Set<HTMLElement>();
    const programLabel = text.toUpperCase();

    coords.forEach((coord) => {
        const pixel = pixels.get(coord);
        if (!pixel) return;
        const midSquare = pixel.closest<HTMLElement>('.mid-square');
        if (midSquare) midSquares.add(midSquare);
        pixel.setAttribute(PROGRAM_ATTR, programLabel);
        delete pixel.dataset.sheetHoldUntil;
        pixel.style.display = 'block';
        pixel.style.opacity = '1';
        pixel.classList.add('pixel');
        pixel.style.removeProperty('animation');
        pixel.style.removeProperty('--hold-color');
        pixel.style.removeProperty('--hold-shadow');
        pixel.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
        pixel.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.22)';
    });

    midSquares.forEach((midSquare) => {
        midSquare.setAttribute('data-music-player-program-mid', 'true');
        midSquare.style.removeProperty('animation');
        midSquare.querySelectorAll<HTMLElement>('.inner-square').forEach((pixel) => {
            delete pixel.dataset.sheetHoldUntil;
            pixel.style.removeProperty('animation');
            pixel.style.removeProperty('--hold-color');
            pixel.style.removeProperty('--hold-shadow');
            pixel.style.display = 'block';
            if (!pixel.hasAttribute(PROGRAM_ATTR)) {
                pixel.style.opacity = '0';
            }
        });
    });
}
