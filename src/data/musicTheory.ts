export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export const NOTE_TO_SEMITONE: Record<NoteName, number> = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5,
  'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
};

/** Standard tuning: string index 0 = string 6 (low E) → index 5 = string 1 (high E) */
export const STANDARD_TUNING: number[] = [4, 9, 2, 7, 11, 4];

export interface TuningPreset {
  name: string;
  tuning: number[];
}

export const TUNING_PRESETS: TuningPreset[] = [
  { name: 'Standard',       tuning: [4, 9, 2, 7, 11, 4] },   // E A D G B E
  { name: 'Drop D',         tuning: [2, 9, 2, 7, 11, 4] },   // D A D G B E
  { name: 'Open D',         tuning: [2, 9, 2, 6, 9, 2] },    // D A D F# A D
  { name: 'Open G',         tuning: [2, 7, 2, 7, 11, 2] },   // D G D G B D
  { name: 'Open A',         tuning: [4, 9, 4, 9, 1, 4] },    // E A E A C# E
  { name: 'Open E',         tuning: [4, 11, 4, 8, 11, 4] },  // E B E G# B E
  { name: 'Open C',         tuning: [0, 7, 0, 7, 0, 4] },    // C G C G C E
  { name: 'DADGAD',         tuning: [2, 9, 2, 7, 9, 2] },    // D A D G A D
  { name: 'Drop C',         tuning: [0, 7, 0, 5, 9, 2] },    // C G C F A D
  { name: 'Half Step Down', tuning: [3, 8, 1, 6, 10, 3] },   // Eb Ab Db Gb Bb Eb
  { name: 'Full Step Down', tuning: [2, 7, 0, 5, 9, 2] },    // D G C F A D
];

export function tuningToLabels(tuning: number[]): string[] {
  return tuning.map((sem, i) => {
    const name = NOTE_NAMES[sem % 12];
    return i === 5 && name === NOTE_NAMES[tuning[0] % 12] ? name.toLowerCase() : name;
  });
}

export const TOTAL_FRETS = 15;

// ── MIDI / Staff utilities ──────────────────────────────────────────────────

/** MIDI base notes for standard-tuning open strings (index 0 = low E = string 6) */
const STANDARD_MIDI_BASE = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

/** Convert string + fret + current tuning to MIDI note number */
export function stringFretToMidi(stringIndex: number, fret: number, tuning: number[]): number {
  const semitoneShift = tuning[stringIndex] - STANDARD_TUNING[stringIndex];
  return STANDARD_MIDI_BASE[stringIndex] + semitoneShift + fret;
}

// Chromatic semitone → nearest lower natural note index (C=0…B=6) + accidental
const SEMI_TO_DIATONIC: { nat: number; acc: string }[] = [
  { nat: 0, acc: ''  }, // C
  { nat: 0, acc: '#' }, // C#
  { nat: 1, acc: ''  }, // D
  { nat: 1, acc: '#' }, // D#
  { nat: 2, acc: ''  }, // E
  { nat: 3, acc: ''  }, // F
  { nat: 3, acc: '#' }, // F#
  { nat: 4, acc: ''  }, // G
  { nat: 4, acc: '#' }, // G#
  { nat: 5, acc: ''  }, // A
  { nat: 5, acc: '#' }, // A#
  { nat: 6, acc: ''  }, // B
];
const DIATONIC_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export interface StaffPosition {
  /** Diatonic step from F5 downward (F5=0, E5=1, D5=2, …) */
  step: number;
  accidental: '' | '#';
  noteName: string;
  octave: number;
}

/**
 * Convert MIDI note number to grand-staff position.
 * Step 0 = F5 (top treble line). Steps increase going down.
 */
export function midiToStaff(midi: number): StaffPosition {
  const semi = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1; // MIDI 60 = C4
  const { nat, acc } = SEMI_TO_DIATONIC[semi];
  // steps from F5 (oct=5, nat=3)
  const step = (5 - octave) * 7 + (3 - nat);
  return { step, accidental: acc as '' | '#', noteName: DIATONIC_NAMES[nat] + acc, octave };
}

/** Ledger lines needed for a note at the given staff step (guitar range D2–G5) */
export function staffLedgerLines(step: number): number[] {
  if (step >= 10 && step <= 11) return [10];          // middle C area
  if (step === 22 || step === 23) return [22];         // E2 / D2
  if (step >= 24) {                                    // C2 and below
    const lines: number[] = [];
    for (let s = 22; s <= step; s += 2) lines.push(s);
    return lines;
  }
  return [];
}

export type ChordType =
  | 'maj7'
  | 'm7'
  | '7'
  | 'm7b5'
  | 'dim7'
  | '6'
  | 'm6'
  | '9'
  | 'm9'
  | 'maj9'
  | '11'
  | '13'
  | '7b9'
  | '7s9'
  | '7s11'
  | '7b13'
  | 'sus2'
  | 'sus4'
  | '7sus';

export interface ChordFormula {
  intervals: number[];
  degrees: string[];
  label: string;
  aliases: string[];
}

export const CHORD_FORMULAS: Record<ChordType, ChordFormula> = {
  maj7: { intervals: [0, 4, 7, 11],       degrees: ['1', '3', '5', '7'],              label: 'Maj7',  aliases: ['maj7', 'Δ', 'Δ7', 'M7', 'Ma7'] },
  m7:   { intervals: [0, 3, 7, 10],       degrees: ['1', '♭3', '5', '♭7'],            label: 'm7',    aliases: ['m7', '-7', 'min7'] },
  '7':  { intervals: [0, 4, 7, 10],       degrees: ['1', '3', '5', '♭7'],             label: '7',     aliases: ['7', 'dom7'] },
  m7b5: { intervals: [0, 3, 6, 10],       degrees: ['1', '♭3', '♭5', '♭7'],           label: 'm7♭5',  aliases: ['m7♭5', 'ø', 'ø7', '-7♭5'] },
  dim7: { intervals: [0, 3, 6, 9],        degrees: ['1', '♭3', '♭5', '♭♭7'],          label: 'dim7',  aliases: ['dim7', '°', '°7'] },
  '6':  { intervals: [0, 4, 7, 9],        degrees: ['1', '3', '5', '6'],              label: '6',     aliases: ['6', 'add6'] },
  m6:   { intervals: [0, 3, 7, 9],        degrees: ['1', '♭3', '5', '6'],             label: 'm6',    aliases: ['m6', '-6'] },
  '9':  { intervals: [0, 4, 7, 10, 14],   degrees: ['1', '3', '5', '♭7', '9'],        label: '9',     aliases: ['9', 'add9'] },
  m9:   { intervals: [0, 3, 7, 10, 14],   degrees: ['1', '♭3', '5', '♭7', '9'],       label: 'm9',    aliases: ['m9', '-9'] },
  maj9: { intervals: [0, 4, 7, 11, 14],   degrees: ['1', '3', '5', '7', '9'],         label: 'Maj9',  aliases: ['maj9', 'Δ9', 'M9'] },
  '11': { intervals: [0, 4, 7, 10, 14, 17], degrees: ['1', '3', '5', '♭7', '9', '11'], label: '11',    aliases: ['11', 'add11'] },
  '13': { intervals: [0, 4, 7, 10, 14, 17, 21], degrees: ['1', '3', '5', '♭7', '9', '11', '13'], label: '13', aliases: ['13', 'add13'] },
  '7b9': { intervals: [0, 4, 7, 10, 13],  degrees: ['1', '3', '5', '♭7', '♭9'],       label: '7♭9',   aliases: ['7♭9', '7(-9)'] },
  '7s9': { intervals: [0, 4, 7, 10, 15],  degrees: ['1', '3', '5', '♭7', '♯9'],       label: '7♯9',   aliases: ['7♯9', '7(+9)'] },
  '7s11': { intervals: [0, 4, 7, 10, 18], degrees: ['1', '3', '5', '♭7', '♯11'],      label: '7♯11',  aliases: ['7♯11', '7(+11)'] },
  '7b13': { intervals: [0, 4, 7, 10, 20], degrees: ['1', '3', '5', '♭7', '♭13'],      label: '7♭13',  aliases: ['7♭13', '7(-13)'] },
  sus2: { intervals: [0, 2, 7],           degrees: ['1', '2', '5'],                    label: 'sus2',  aliases: ['sus2'] },
  sus4: { intervals: [0, 5, 7],           degrees: ['1', '4', '5'],                    label: 'sus4',  aliases: ['sus4', 'sus'] },
  '7sus': { intervals: [0, 5, 7, 10],     degrees: ['1', '4', '5', '♭7'],             label: '7sus',  aliases: ['7sus', '7sus4'] },
};

export interface ChordPosition {
  stringIndex: number;
  fret: number;
  degree: string;
  intervalIndex: number;
}

export function getChordPositions(root: NoteName, chordType: ChordType, tuning: number[] = STANDARD_TUNING): ChordPosition[] {
  const rootSemitone = NOTE_TO_SEMITONE[root];
  const formula = CHORD_FORMULAS[chordType];
  const targets = formula.intervals.map((i) => (rootSemitone + i) % 12);

  const result: ChordPosition[] = [];

  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= TOTAL_FRETS; f++) {
      const sem = (tuning[s] + f) % 12;
      const idx = targets.indexOf(sem);
      if (idx !== -1) {
        result.push({
          stringIndex: s,
          fret: f,
          degree: formula.degrees[idx],
          intervalIndex: idx,
        });
      }
    }
  }

  return result;
}

export type ScaleType =
  | 'pentatonic_minor'
  | 'pentatonic_major'
  | 'major'
  | 'natural_minor'
  | 'dorian'
  | 'mixolydian'
  | 'phrygian'
  | 'blues_minor'
  | 'blues_major'
  | 'bebop_dominant';

export interface ScaleFormula {
  intervals: number[];
  degrees: string[];
  label: string;
}

export const SCALE_FORMULAS: Record<ScaleType, ScaleFormula> = {
  pentatonic_minor: { intervals: [0, 3, 5, 7, 10],        degrees: ['1', '♭3', '4', '5', '♭7'],            label: 'Pentatonic Minor' },
  pentatonic_major: { intervals: [0, 2, 4, 7, 9],         degrees: ['1', '2', '3', '5', '6'],              label: 'Pentatonic Major' },
  major:            { intervals: [0, 2, 4, 5, 7, 9, 11],  degrees: ['1', '2', '3', '4', '5', '6', '7'],    label: 'Major' },
  natural_minor:    { intervals: [0, 2, 3, 5, 7, 8, 10],  degrees: ['1', '2', '♭3', '4', '5', '♭6', '♭7'], label: 'Natural Minor' },
  dorian:           { intervals: [0, 2, 3, 5, 7, 9, 10],  degrees: ['1', '2', '♭3', '4', '5', '6', '♭7'],  label: 'Dorian' },
  mixolydian:       { intervals: [0, 2, 4, 5, 7, 9, 10],  degrees: ['1', '2', '3', '4', '5', '6', '♭7'],   label: 'Mixolydian' },
  phrygian:         { intervals: [0, 1, 3, 5, 7, 8, 10],  degrees: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'], label: 'Phrygian' },
  blues_minor:      { intervals: [0, 3, 5, 6, 7, 10],       degrees: ['1', '♭3', '4', '♭5', '5', '♭7'],          label: 'Blues Minor' },
  blues_major:      { intervals: [0, 2, 3, 4, 7, 9],        degrees: ['1', '2', '♭3', '3', '5', '6'],            label: 'Blues Major' },
  bebop_dominant:   { intervals: [0, 2, 4, 5, 7, 9, 10, 11], degrees: ['1', '2', '3', '4', '5', '6', '♭7', '7'],  label: 'Bebop Dominant' },
};

export function getScalePositions(root: NoteName, scaleType: ScaleType, tuning: number[] = STANDARD_TUNING): ChordPosition[] {
  const rootSemitone = NOTE_TO_SEMITONE[root];
  const formula = SCALE_FORMULAS[scaleType];
  const targets = formula.intervals.map((i) => (rootSemitone + i) % 12);
  const result: ChordPosition[] = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= TOTAL_FRETS; f++) {
      const sem = (tuning[s] + f) % 12;
      const idx = targets.indexOf(sem);
      if (idx !== -1) {
        result.push({ stringIndex: s, fret: f, degree: formula.degrees[idx], intervalIndex: idx });
      }
    }
  }
  return result;
}
