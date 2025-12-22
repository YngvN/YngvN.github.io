export type SheetTriggerContext = {
    bpm: number;
    beatsPerBar: number;
    subBeatsPerBeat: number;
    bar: number;
    beat: number;
    subBeat: number;
};

export type HoldState = {
    untilMs: number;
    color: string | null;
    shadow: string | null;
};
