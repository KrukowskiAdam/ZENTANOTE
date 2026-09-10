import { create } from 'zustand';
import {
  type NoteName,
  type ChordType,
  type ScaleType,
  type ChordPosition,
  getChordPositions,
  getScalePositions,
  STANDARD_TUNING,
  TUNING_PRESETS,
} from '../data/musicTheory';

// Open tunings voice a specific chord on the open strings, named after its root.
// Selecting one of these presets should switch the root to match, so degree
// markers (e.g. the "1" on fret 0) line up with what the tuning actually plays.
const OPEN_TUNING_ROOTS: Partial<Record<string, NoteName>> = {
  'Open D': 'D',
  'Open G': 'G',
  'Open A': 'A',
  'Open E': 'E',
  'Open C': 'C',
  DADGAD: 'D',
};

interface GuitarState {
  root: NoteName;
  chordType: ChordType | null;
  scaleType: ScaleType | null;
  tuning: number[];
  presetName: string | null;
  positions: ChordPosition[];
  scalePositions: ChordPosition[];
  highlightedMidi: number | null;
  setRoot: (root: NoteName) => void;
  setChordType: (chordType: ChordType | null) => void;
  setScaleType: (scaleType: ScaleType | null) => void;
  setTuningPreset: (presetName: string) => void;
  setStringTuning: (stringIndex: number, semitone: number) => void;
  setHighlightedMidi: (midi: number | null) => void;
}

export const useGuitarStore = create<GuitarState>((set) => ({
  root: 'C',
  chordType: 'maj7',
  scaleType: null,
  tuning: [...STANDARD_TUNING],
  presetName: 'Standard',
  positions: getChordPositions('C', 'maj7', STANDARD_TUNING),
  scalePositions: [],
  highlightedMidi: null,
  setHighlightedMidi: (midi) => set({ highlightedMidi: midi }),
  setRoot: (root) =>
    set((state) => ({
      root,
      positions: state.chordType ? getChordPositions(root, state.chordType, state.tuning) : [],
      scalePositions: state.scaleType ? getScalePositions(root, state.scaleType, state.tuning) : [],
    })),
  setChordType: (chordType) =>
    set((state) => ({
      chordType,
      positions: chordType ? getChordPositions(state.root, chordType, state.tuning) : [],
      ...(chordType ? { scaleType: null, scalePositions: [] } : {}),
    })),
  setScaleType: (scaleType) =>
    set((state) => ({
      scaleType,
      scalePositions: scaleType ? getScalePositions(state.root, scaleType, state.tuning) : [],
      ...(scaleType ? { chordType: null, positions: [] } : {}),
    })),
  setTuningPreset: (presetName) =>
    set((state) => {
      const preset = TUNING_PRESETS.find((p) => p.name === presetName);
      if (!preset) return state;
      const tuning = [...preset.tuning];
      const root = OPEN_TUNING_ROOTS[presetName] ?? state.root;
      return {
        tuning,
        presetName,
        root,
        positions: state.chordType ? getChordPositions(root, state.chordType, tuning) : [],
        scalePositions: state.scaleType ? getScalePositions(root, state.scaleType, tuning) : [],
      };
    }),
  setStringTuning: (stringIndex, semitone) =>
    set((state) => {
      const tuning = [...state.tuning];
      tuning[stringIndex] = semitone;
      const matchingPreset = TUNING_PRESETS.find(
        (p) => p.tuning.every((v, i) => v === tuning[i]),
      );
      return {
        tuning,
        presetName: matchingPreset?.name ?? null,
        positions: state.chordType ? getChordPositions(state.root, state.chordType, tuning) : [],
        scalePositions: state.scaleType ? getScalePositions(state.root, state.scaleType, tuning) : [],
      };
    }),
}));
