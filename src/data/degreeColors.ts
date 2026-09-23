// Core chord tones (1-3-5-7) each get their own hue. Tensions (2/9, 4/11, 6/13)
// resolve a whole step down to the chord tone below them, so they're rendered
// as a muted tint of that tone's color rather than an unrelated hue.
const ROOT = '#DA3A2E';
const ROOT_TINT = '#B0564E';
const THIRD = '#4B9AD5';
const THIRD_TINT = '#5A87AD';
const FIFTH = '#F2C12E';
const FIFTH_TINT = '#C9A227';
const SEVENTH = '#024B9A';

export const DEGREE_COLORS: Record<string, string> = {
  '1': ROOT,
  '2': ROOT_TINT,
  '3': THIRD,
  '4': THIRD_TINT,
  '5': FIFTH,
  '6': FIFTH_TINT,
  '7': SEVENTH,
  '9': ROOT_TINT,
  '11': THIRD_TINT,
  '13': FIFTH_TINT,
  '♭2': ROOT_TINT,
  '♭3': THIRD,
  '♭5': FIFTH,
  '♭6': FIFTH_TINT,
  '♭7': SEVENTH,
  '♭9': ROOT_TINT,
  '♭13': FIFTH_TINT,
  '♯9': ROOT_TINT,
  '♯11': THIRD_TINT,
  '♭♭7': SEVENTH,
};

export function degreeDisplay(degree: string): string {
  return degree.replaceAll('♭', 'b').replaceAll('♯', '#');
}
