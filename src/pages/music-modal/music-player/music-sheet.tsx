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
    program?: Record<string, MusicSheetProgramNode>;
    events?: Record<string, string>;
};

export type MusicSheetProgramNode = string | MusicSheetProgramNode[] | { [key: string]: MusicSheetProgramNode };

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
    const singleRegex = new RegExp(`^${prefix}-(\\d+)$`);
    const rangeRegex = new RegExp(`^${prefix}-(\\d+)-(\\d+)$`);

    const singleMatch = singleRegex.exec(trimmed);
    if (singleMatch) {
        const value = Number.parseInt(singleMatch[1], 10);
        if (!Number.isFinite(value) || value < 1) return null;
        return { start: value, end: value };
    }

    const rangeMatch = rangeRegex.exec(trimmed);
    if (!rangeMatch) return null;
    const start = Number.parseInt(rangeMatch[1], 10);
    const end = Number.parseInt(rangeMatch[2], 10);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
    if (start < 1 || end < 1) return null;
    return { start: Math.min(start, end), end: Math.max(start, end) };
}

type ProgramContext = {
    barRange: { start: number; end: number };
    beat?: number;
    eighth?: number;
};

function assertProgramNodeIsObject(
    node: MusicSheetProgramNode,
    path: string,
): asserts node is Record<string, MusicSheetProgramNode> {
    if (typeof node !== 'object' || node === null || Array.isArray(node)) {
        throw new Error(`Expected object at "${path}"`);
    }
}

function addParsedEvent(events: ParsedMusicSheetEvent[], at: SubBeatPosition, action: string) {
    events.push({ id: `sheet-${events.length}`, at, action });
}

function parseProgramNode(
    node: MusicSheetProgramNode,
    grid: BeatGrid,
    events: ParsedMusicSheetEvent[],
    ctx: ProgramContext,
    path: string,
) {
    const step8 = grid.subBeatsPerBeat / 2;
    const has8 = Number.isInteger(step8) && step8 >= 1;

    if (Array.isArray(node)) {
        node.forEach((entry, index) => {
            parseProgramNode(entry, grid, events, ctx, `${path}[${index}]`);
        });
        return;
    }

    if (typeof node === 'string') {
        const rangeLength = ctx.barRange.end - ctx.barRange.start + 1;
        const isHold = node === 'i-s-beathold' || node === 's-i-beathold' || node === 'm-s-beathold';

        if (isHold && rangeLength > 1) {
            addParsedEvent(events, { bar: ctx.barRange.start, subBeat: 1 }, `${node}@bars=${rangeLength}`);
            return;
        }

        for (let bar = ctx.barRange.start; bar <= ctx.barRange.end; bar += 1) {
            addParsedEvent(events, { bar, subBeat: 1 }, node);
        }
        return;
    }

    assertProgramNodeIsObject(node, path);

    Object.entries(node).forEach(([rawKey, child]) => {
        const key = rawKey.trim();

        const emit = (bar: number, subBeat: number, action: string) => {
            const at: SubBeatPosition = { bar, subBeat };
            assertWithinGrid(grid, at);
            addParsedEvent(events, at, action);
        };

        if (key.startsWith('4beat-')) {
            const beatRange = parseRangeKey('4beat', key);
            if (!beatRange) throw new Error(`Invalid key "${key}" at "${path}" (expected "4beat-x" or "4beat-x-y")`);
            for (let beat = beatRange.start; beat <= beatRange.end; beat += 1) {
                if (typeof child === 'string') {
                    for (let bar = ctx.barRange.start; bar <= ctx.barRange.end; bar += 1) {
                        emit(bar, (beat - 1) * grid.subBeatsPerBeat + 1, child);
                    }
                } else {
                    parseProgramNode(child, grid, events, { ...ctx, beat }, `${path}.${key}`);
                }
            }
            return;
        }

        if (key.startsWith('8beat-')) {
            if (!has8) throw new Error(`"8beat" requires subBeatsPerBeat to be divisible by 2`);
            const range = parseRangeKey('8beat', key);
            if (!range) throw new Error(`Invalid key "${key}" at "${path}" (expected "8beat-x" or "8beat-x-y")`);

            for (let idx = range.start; idx <= range.end; idx += 1) {
                const eighth = ctx.beat !== undefined && idx >= 1 && idx <= 2 ? (ctx.beat - 1) * 2 + idx : idx;

                if (eighth < 1 || eighth > grid.beatsPerBar * 2) {
                    throw new Error(`8beat index out of range (${eighth}) at "${path}.${key}" (expected 1..${grid.beatsPerBar * 2})`);
                }

                if (typeof child === 'string') {
                    for (let bar = ctx.barRange.start; bar <= ctx.barRange.end; bar += 1) {
                        emit(bar, (eighth - 1) * step8 + 1, child);
                    }
                } else {
                    parseProgramNode(child, grid, events, { ...ctx, eighth }, `${path}.${key}`);
                }
            }
            return;
        }

        if (key.startsWith('beat-')) {
            const beatRange = parseRangeKey('beat', key);
            if (!beatRange) throw new Error(`Invalid key "${key}" at "${path}" (expected "beat-x" or "beat-x-y")`);
            for (let beat = beatRange.start; beat <= beatRange.end; beat += 1) {
                if (typeof child === 'string') {
                    for (let bar = ctx.barRange.start; bar <= ctx.barRange.end; bar += 1) {
                        emit(bar, (beat - 1) * grid.subBeatsPerBeat + 1, child);
                    }
                } else {
                    parseProgramNode(child, grid, events, { ...ctx, beat }, `${path}.${key}`);
                }
            }
            return;
        }

        if (key.startsWith('subbeat-')) {
            const subBeatRange = parseRangeKey('subbeat', key);
            if (!subBeatRange) throw new Error(`Invalid key "${key}" at "${path}" (expected "subbeat-x" or "subbeat-x-y")`);
            if (typeof child !== 'string') throw new Error(`subbeat must map to an action string at "${path}.${key}"`);
            for (let subBeat = subBeatRange.start; subBeat <= subBeatRange.end; subBeat += 1) {
                for (let bar = ctx.barRange.start; bar <= ctx.barRange.end; bar += 1) {
                    emit(bar, subBeat, child);
                }
            }
            return;
        }

        throw new Error(`Unknown key "${key}" at "${path}"`);
    });
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
        programEntries.forEach(([barKey, node]) => {
            const barRange = parseRangeKey('bar', barKey);
            if (!barRange) throw new Error(`Invalid bar key: "${barKey}" (expected "bar-x" or "bar-x-y")`);
            parseProgramNode(node, grid, events, { barRange }, `program.${barKey}`);
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
