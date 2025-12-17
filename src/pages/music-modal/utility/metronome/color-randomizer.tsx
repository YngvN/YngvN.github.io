export type BeatPalette = {
    name: string;
    colors: [string, string, string, string];
};

export const beatPalettes: BeatPalette[] = [
    {
        name: 'Neon Pop',
        colors: ['#ff3d7f', '#ffd60a', '#06d6a0', '#4d7cff'],
    },
    {
        name: 'Nordic Night',
        colors: ['#38bdf8', '#22c55e', '#a78bfa', '#fb7185'],
    },
    {
        name: 'Sunset Tape',
        colors: ['#f97316', '#f43f5e', '#eab308', '#3b82f6'],
    },
    {
        name: 'Lo-fi Garden',
        colors: ['#2dd4bf', '#f59e0b', '#60a5fa', '#fb7185'],
    },
    {
        name: 'Electric Slate',
        colors: ['#60a5fa', '#34d399', '#f472b6', '#fbbf24'],
    },
];

export function getRandomBeatPalette(palettes: BeatPalette[] = beatPalettes): BeatPalette {
    if (palettes.length === 0) {
        return { name: 'Default', colors: ['#ff6b6b', '#f7b801', '#2ec4b6', '#6c63ff'] };
    }
    const index = Math.floor(Math.random() * palettes.length);
    return palettes[index] ?? palettes[0];
}

export function getRandomColorFromPalette(palette: BeatPalette): string {
    const { colors } = palette;
    const index = Math.floor(Math.random() * colors.length);
    return colors[index] ?? colors[0];
}

export function hexToRgba(hex: string, alpha = 1): string {
    const normalized = hex.replace('#', '').trim();
    const full = normalized.length === 3 ? normalized.split('').map((ch) => ch + ch).join('') : normalized;
    const value = Number.parseInt(full, 16);

    if (Number.isNaN(value) || full.length !== 6) {
        return `rgba(0, 0, 0, ${alpha})`;
    }

    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyBeatPaletteToDom(palette: BeatPalette, element?: HTMLElement) {
    if (typeof document === 'undefined') return;
    const target = element ?? document.documentElement;
    palette.colors.forEach((color, index) => {
        target.style.setProperty(`--beat-color-${index + 1}`, color);
    });
    document.body.dataset.palette = palette.name;
}

export function resetBeatPaletteOnDom(element?: HTMLElement) {
    if (typeof document === 'undefined') return;
    const target = element ?? document.documentElement;
    for (let index = 1; index <= 4; index += 1) {
        target.style.removeProperty(`--beat-color-${index}`);
    }
    delete document.body.dataset.palette;
}
