import { TOTAL_FRETS, tuningToLabels, stringFretToMidi } from '../data/musicTheory';
import { useGuitarStore } from '../store/useGuitarStore';
import { useShallow } from 'zustand/react/shallow';

// Core chord tones (1-3-5-7) each get their own hue. Tensions (2/9, 4/11, 6/13)
// resolve a whole step down to the chord tone below them, so they're rendered
// as a muted tint of that tone's color rather than an unrelated hue.
const ROOT = '#FF6B6B';
const ROOT_TINT = '#C2585A';
const THIRD = '#4ECDC4';
const THIRD_TINT = '#4FA89E';
const FIFTH = '#F2C12E';
const FIFTH_TINT = '#C9A227';
const SEVENTH = '#5B8DB8';

const DEGREE_COLORS: Record<string, string> = {
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

function degreeDisplay(degree: string): string {
  return degree.replaceAll('♭', 'b').replaceAll('♯', '#');
}

export function Fretboard2D() {
  const { positions, scalePositions, tuning, highlightedMidi, setHighlightedMidi } = useGuitarStore(
    useShallow((s) => ({
      positions: s.positions,
      scalePositions: s.scalePositions,
      tuning: s.tuning,
      highlightedMidi: s.highlightedMidi,
      setHighlightedMidi: s.setHighlightedMidi,
    })),
  );

  const stringLabels = tuningToLabels(tuning);
  const stringOrder = [5, 4, 3, 2, 1, 0];
  const frets = Array.from({ length: TOTAL_FRETS + 1 }, (_, i) => i);

  const markerByCell = new Map(
    positions.map((pos) => [`${pos.stringIndex}:${pos.fret}`, pos] as const),
  );
  const scaleByCell = new Map(
    scalePositions.map((pos) => [`${pos.stringIndex}:${pos.fret}`, pos] as const),
  );

  return (
    <div className="fret2d__viewport">
      <div className="fret2d">
        <div className="fret2d__frets" aria-hidden="true">
          <div className="fret2d__corner" />
          {frets.map((fret) => (
            <div key={fret} className={`fret2d__fret-label ${fret === 0 ? 'fret2d__fret-label--nut' : ''}`}>
              {fret}
            </div>
          ))}
        </div>

        <div className="fret2d__rows">
          {stringOrder.map((stringIndex) => (
            <div key={stringIndex} className="fret2d__row">
              <div className="fret2d__string-label">{stringLabels[stringIndex]}</div>
              {frets.map((fret) => {
                const marker = markerByCell.get(`${stringIndex}:${fret}`);
                const cellMidi = stringFretToMidi(stringIndex, fret, tuning);
                const isHighlighted = highlightedMidi === cellMidi;
                return (
                  <div
                    key={`${stringIndex}-${fret}`}
                    className={`fret2d__cell ${fret === 0 ? 'fret2d__cell--nut' : ''} ${isHighlighted ? 'fret2d__cell--highlighted' : ''}`}
                    onClick={() => setHighlightedMidi(isHighlighted ? null : cellMidi)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fret2d__string-line" />
                    {marker && (
                      <div
                        className="fret2d__marker"
                        style={{ backgroundColor: DEGREE_COLORS[marker.degree] ?? '#888' }}
                        title={marker.degree}
                      >
                        {degreeDisplay(marker.degree)}
                      </div>
                    )}
                    {!marker && scaleByCell.get(`${stringIndex}:${fret}`) && (() => {
                      const sm = scaleByCell.get(`${stringIndex}:${fret}`)!;
                      return (
                        <div
                          className="fret2d__marker fret2d__marker--scale"
                          style={{ backgroundColor: DEGREE_COLORS[sm.degree] ?? '#888' }}
                          title={sm.degree}
                        >
                          {degreeDisplay(sm.degree)}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="fret2d__inlays" aria-hidden="true">
            <div />
            {frets.map((fret) => (
              <div key={fret} className="fret2d__inlay-cell">
                {[5, 9, 15].includes(fret) && <div className="fret2d__inlay-dot" />}
                {fret === 7 && (
                  <>
                    <div className="fret2d__inlay-dot fret2d__inlay-dot--row2" />
                    <div className="fret2d__inlay-dot fret2d__inlay-dot--row4" />
                  </>
                )}
                {fret === 12 && (
                  <>
                    <div className="fret2d__inlay-dot fret2d__inlay-dot--pair-left" />
                    <div className="fret2d__inlay-dot fret2d__inlay-dot--pair-right" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
