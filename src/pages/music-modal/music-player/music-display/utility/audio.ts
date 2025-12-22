const audioAssets = import.meta.glob('../../../../../assets/song/*.mp3', { eager: true, import: 'default' }) as Record<
    string,
    string
>;

function safeDecode(value: string) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

const audioAssetMap = (() => {
    const entries = new Map<string, string>();
    Object.entries(audioAssets).forEach(([path, url]) => {
        const fileName = path.split('/').pop() ?? path;
        entries.set(fileName, url);
        entries.set(safeDecode(fileName), url);
        entries.set(encodeURIComponent(fileName), url);
    });
    return entries;
})();

export function resolveAudioSrc(raw: string | undefined) {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const fileName = trimmed.split('/').pop() ?? trimmed;
    const candidates = [
        trimmed,
        fileName,
        safeDecode(trimmed),
        safeDecode(fileName),
        encodeURIComponent(trimmed),
        encodeURIComponent(fileName),
    ];
    for (const candidate of candidates) {
        const mapped = audioAssetMap.get(candidate);
        if (mapped) return mapped;
    }
    if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('/')) return trimmed;
    const base = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';
    return `${base}${base.endsWith('/') ? '' : '/'}${trimmed}`;
}
