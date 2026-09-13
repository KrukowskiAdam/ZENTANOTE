import { TOTAL_FRETS } from './musicTheory';

export const FRET_SPACING = 0.7;
export const STRING_SPACING = 0.35;
export const BOARD_THICKNESS = 0.08;

export const BOARD_START = -0.5;
export const BOARD_END = TOTAL_FRETS * FRET_SPACING + 0.3;
export const BOARD_LENGTH = BOARD_END - BOARD_START;
export const BOARD_WIDTH = 5 * STRING_SPACING + 0.3;
export const BOARD_CENTER_X = (BOARD_START + BOARD_END) / 2;

export function stringZ(index: number): number {
  return (2.5 - index) * STRING_SPACING;
}

export function noteX(fret: number): number {
  return fret === 0 ? -0.2 : (fret - 0.5) * FRET_SPACING;
}

export function fretX(n: number): number {
  return n * FRET_SPACING;
}
