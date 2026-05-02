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

interface GuitarState {
  root: NoteName;
  chordType: ChordType | null;
  scaleType: ScaleType | null;
  tuning: number[];
  presetName: string | null;
  positions: ChordPosition[];
  scalePositions: ChordPosition[];
  setRoot: (root: NoteName) => void;
  setChordType: (chordType: ChordType | null) => void;
  setScaleType: (scaleType: ScaleType | null) => void;
  setTuningPreset: (presetName: string) => void;
  setStringTuning: (stringIndex: number, semitone: number) => void;
}

export const useGuitarStore = create<GuitarState>((set) => ({
  root: 'C',
  chordType: 'maj7',
  scaleType: null,
  tuning: [...STANDARD_TUNING],
  presetName: 'Standard',
  positions: getChordPositions('C', 'maj7', STANDARD_TUNING),
  scalePositions: [],
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
      return {
        tuning,
        presetName,
        positions: state.chordType ? getChordPositions(state.root, state.chordType, tuning) : [],
        scalePositions: state.scaleType ? getScalePositions(state.root, state.scaleType, tuning) : [],
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
