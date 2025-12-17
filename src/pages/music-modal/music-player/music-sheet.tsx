export type BeatGrid = {
    bars: number;
    beatsPerBar: number;
    subBeatsPerBeat: number;
};

export type MusicSheetJson = {
    bpm: number;
    bars: number;
    beatsPerBar?: number;
    subBeatsPerBeat?: number;
    program?: Record<string, Record<string, Record<string, string>>>;
    events?: Record<string, string>;
};

export type BeatPosition = {
    bar: number;
    beat: number;
};

export type SubBeatPosition = {
    bar: number;
    subBeat: number;
};

export type MusicSheetEvent<TContext> = {
    id: string;
    at: BeatPosition | SubBeatPosition;
    action: (context: TContext) => void;
};

export type CreateMusicSheetOptions = {
    bars: number;
    beatsPerBar?: number;
    subBeatsPerBeat?: number;
};

export type ParsedMusicSheetEvent = {
    id: string;
    at: SubBeatPosition;
    action: string;
};

export type ParsedMusicSheet = {
    bpm: number;
    bars: number;
    beatsPerBar: number;
    subBeatsPerBeat: number;
    events: ReadonlyArray<ParsedMusicSheetEvent>;
};

function clampInt(value: number, min: number, max: number) {
    const next = Math.trunc(value);
    return Math.min(max, Math.max(min, next));
}

function isBeatPosition(position: BeatPosition | SubBeatPosition): position is BeatPosition {
    return 'beat' in position;
}

function makeEventId(position: BeatPosition | SubBeatPosition, index: number) {
    if (isBeatPosition(position)) return `bar-${position.bar}-beat-${position.beat}-${index}`;
    return `bar-${position.bar}-sub-${position.subBeat}-${index}`;
}

function normalizeGrid(options: CreateMusicSheetOptions): BeatGrid {
    return {
        bars: clampInt(options.bars, 1, 10_000),
        beatsPerBar: clampInt(options.beatsPerBar ?? 4, 1, 64),
        subBeatsPerBeat: clampInt(options.subBeatsPerBeat ?? 4, 1, 64),
    };
}

function parseSubBeatKey(key: string): SubBeatPosition | null {
    const trimmed = key.trim();
    const match = /^bar-?(\d+)-(\d+)$/.exec(trimmed);
    if (!match) return null;
    const bar = Number.parseInt(match[1], 10);
    const subBeat = Number.parseInt(match[2], 10);
    if (!Number.isFinite(bar) || !Number.isFinite(subBeat)) return null;
    return { bar, subBeat };
}

function parseRangeKey(prefix: string, key: string) {
    const trimmed = key.trim();
    const regex = new RegExp(`^${prefix}-(\\d+)-(\\d+)$`);
    const match = regex.exec(trimmed);
    if (!match) return null;
    const start = Number.parseInt(match[1], 10);
    const end = Number.parseInt(match[2], 10);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
    if (start < 1 || end < 1) return null;
    return { start: Math.min(start, end), end: Math.max(start, end) };
}

function assertWithinGrid(grid: BeatGrid, position: BeatPosition | SubBeatPosition) {
    if (position.bar < 1 || position.bar > grid.bars) {
        throw new Error(`Bar out of range: ${position.bar} (expected 1..${grid.bars})`);
    }

    if (isBeatPosition(position)) {
        if (position.beat < 1 || position.beat > grid.beatsPerBar) {
            throw new Error(`Beat out of range: ${position.beat} (expected 1..${grid.beatsPerBar})`);
        }
        return;
    }

    const subBeatsPerBar = grid.beatsPerBar * grid.subBeatsPerBeat;
    if (position.subBeat < 1 || position.subBeat > subBeatsPerBar) {
        throw new Error(`Sub-beat out of range: ${position.subBeat} (expected 1..${subBeatsPerBar})`);
    }
}

export type MusicSheet<TContext> = {
    grid: BeatGrid;
    events: ReadonlyArray<MusicSheetEvent<TContext>>;
    onBeat: (at: BeatPosition, action: (context: TContext) => void, id?: string) => MusicSheet<TContext>;
    onSubBeat: (at: SubBeatPosition, action: (context: TContext) => void, id?: string) => MusicSheet<TContext>;
    withBars: (bars: number) => MusicSheet<TContext>;
};

export function createMusicSheet<TContext = void>(options: CreateMusicSheetOptions): MusicSheet<TContext> {
    const grid = normalizeGrid(options);
    const events: MusicSheetEvent<TContext>[] = [];

    const api: MusicSheet<TContext> = {
        grid,
        events,
        onBeat: (at, action, id) => {
            assertWithinGrid(grid, at);
            events.push({ id: id ?? makeEventId(at, events.length), at, action });
            return api;
        },
        onSubBeat: (at, action, id) => {
            assertWithinGrid(grid, at);
            events.push({ id: id ?? makeEventId(at, events.length), at, action });
            return api;
        },
        withBars: (bars) => createMusicSheet<TContext>({ ...options, bars }),
    };

    return api;
}

export function parseMusicSheetJson(json: MusicSheetJson): ParsedMusicSheet {
    const bpm = clampInt(json.bpm, 1, 999);
    const bars = clampInt(json.bars, 1, 10_000);
    const beatsPerBar = clampInt(json.beatsPerBar ?? 4, 1, 64);
    const subBeatsPerBeat = clampInt(json.subBeatsPerBeat ?? 4, 1, 64);

    const grid = normalizeGrid({ bars, beatsPerBar, subBeatsPerBeat });
    const events: ParsedMusicSheetEvent[] = [];

    const programEntries = Object.entries(json.program ?? {});
    if (programEntries.length > 0) {
        let index = 0;
        programEntries.forEach(([barKey, beats]) => {
            const barRange = parseRangeKey('bar', barKey);
            if (!barRange) throw new Error(`Invalid bar key: "${barKey}" (expected "bar-x-y")`);

            Object.entries(beats ?? {}).forEach(([beatKey, subBeats]) => {
                const beatRange = parseRangeKey('beat', beatKey);
                if (!beatRange) throw new Error(`Invalid beat key: "${beatKey}" (expected "beat-x-y")`);

                Object.entries(subBeats ?? {}).forEach(([subBeatKey, action]) => {
                    const subBeatRange = parseRangeKey('subbeat', subBeatKey);
                    if (!subBeatRange) {
                        throw new Error(`Invalid subbeat key: "${subBeatKey}" (expected "subbeat-x-y")`);
                    }

                    for (let bar = barRange.start; bar <= barRange.end; bar += 1) {
                        for (let beat = beatRange.start; beat <= beatRange.end; beat += 1) {
                            for (let subBeat = subBeatRange.start; subBeat <= subBeatRange.end; subBeat += 1) {
                                const absoluteSubBeat = (beat - 1) * grid.subBeatsPerBeat + subBeat;
                                const at: SubBeatPosition = { bar, subBeat: absoluteSubBeat };
                                assertWithinGrid(grid, at);
                                events.push({ id: `sheet-${index}`, at, action });
                                index += 1;
                            }
                        }
                    }
                });
            });
        });

        return { bpm, bars, beatsPerBar, subBeatsPerBeat, events };
    }

    const entries = Object.entries(json.events ?? {});
    entries.forEach(([key, action], index) => {
        const at = parseSubBeatKey(key);
        if (!at) {
            throw new Error(`Invalid event key: "${key}" (expected "barX-Y" or "bar-X-Y")`);
        }
        assertWithinGrid(grid, at);
        events.push({ id: `sheet-${index}`, at, action });
    });

    return { bpm, bars, beatsPerBar, subBeatsPerBeat, events };
}

export async function fetchMusicSheetJson(path = 'sheet.json'): Promise<MusicSheetJson> {
    if (typeof fetch === 'undefined') throw new Error('fetch() is not available in this environment');
    const base = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';
    const url = `${base}${base.endsWith('/') ? '' : '/'}${path.replace(/^\//, '')}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
        throw new Error(`Failed to load sheet: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as MusicSheetJson;
}
