export type Segment14 =
    | 'top'
    | 'upperLeft'
    | 'upperRight'
    | 'middleLeft'
    | 'middleRight'
    | 'lowerLeft'
    | 'lowerRight'
    | 'bottom'
    | 'diagUpperLeft'
    | 'diagUpperRight'
    | 'diagLowerLeft'
    | 'diagLowerRight'
    | 'centerTop'
    | 'centerBottom';

const LCD_LETTERS: Partial<Record<string, ReadonlyArray<Segment14>>> = {
    // Digits (14-seg-ish; close enough for our pixel grid)
    0: ['top', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight', 'bottom'],
    1: ['upperRight', 'lowerRight'],
    2: ['top', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'bottom'],
    3: ['top', 'upperRight', 'middleRight', 'lowerRight', 'bottom'],
    4: ['upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerRight'],
    5: ['top', 'upperLeft', 'middleLeft', 'middleRight', 'lowerRight', 'bottom'],
    6: ['top', 'upperLeft', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight', 'bottom'],
    7: ['top', 'upperRight', 'lowerRight'],
    8: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight', 'bottom'],
    9: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerRight', 'bottom'],

    // Uppercase letters
    A: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight'],
    B: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight', 'bottom'],
    C: ['top', 'upperLeft', 'lowerLeft', 'bottom'],
    D: ['top', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight', 'bottom'],
    E: ['top', 'upperLeft', 'lowerLeft', 'bottom', 'middleLeft', 'middleRight'],
    F: ['top', 'upperLeft', 'lowerLeft', 'middleLeft', 'middleRight'],
    G: ['top', 'upperLeft', 'lowerLeft', 'bottom', 'lowerRight', 'middleRight'],
    H: ['upperLeft', 'lowerLeft', 'upperRight', 'lowerRight', 'middleLeft', 'middleRight'],
    I: ['top', 'bottom', 'centerTop', 'centerBottom'],
    J: ['upperRight', 'lowerRight', 'bottom'],
    K: ['upperLeft', 'lowerLeft', 'middleLeft', 'diagUpperRight', 'diagLowerRight'],
    L: ['upperLeft', 'lowerLeft', 'bottom'],
    M: ['upperLeft', 'lowerLeft', 'upperRight', 'lowerRight', 'diagUpperLeft', 'diagUpperRight'],
    N: ['upperLeft', 'lowerLeft', 'upperRight', 'lowerRight', 'diagLowerLeft', 'diagUpperRight'],
    O: ['top', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight', 'bottom'],
    P: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'centerTop'],
    Q: ['top', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight', 'bottom', 'diagLowerRight'],
    R: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'centerTop', 'diagLowerRight'],
    S: ['top', 'upperLeft', 'middleLeft', 'middleRight', 'lowerRight', 'bottom'],
    T: ['top', 'centerTop', 'centerBottom'],
    U: ['upperLeft', 'lowerLeft', 'upperRight', 'lowerRight', 'bottom'],
    V: ['diagLowerLeft', 'diagLowerRight', 'bottom'],
    W: ['upperLeft', 'lowerLeft', 'upperRight', 'lowerRight', 'diagLowerLeft', 'diagLowerRight'],
    X: ['diagUpperLeft', 'diagUpperRight', 'diagLowerLeft', 'diagLowerRight'],
    Y: ['diagUpperLeft', 'diagUpperRight', 'centerBottom'],
    Z: ['top', 'bottom', 'diagUpperRight', 'diagLowerLeft'],

    // Nordic extras (approximations on a 14-seg grid)
    Æ: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'bottom', 'lowerRight'],
    Ø: ['top', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight', 'bottom', 'diagUpperRight', 'diagLowerLeft'],
    Å: ['top', 'upperLeft', 'upperRight', 'middleLeft', 'middleRight', 'lowerLeft', 'lowerRight'],

    // Punctuation / symbols
    '-': ['middleLeft', 'middleRight'],
    '_': ['bottom'],
    '|': ['centerTop', 'centerBottom'],
    '/': ['diagUpperRight', 'diagLowerLeft'],
    '\\': ['diagUpperLeft', 'diagLowerRight'],
    ' ': [],
};

export function getLcdSegmentsForChar(char: string): ReadonlyArray<Segment14> | null {
    const normalized = char.slice(0, 1).toUpperCase();
    const segments = LCD_LETTERS[normalized];
    return segments ?? null;
}

