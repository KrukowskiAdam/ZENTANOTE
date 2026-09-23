import { TOTAL_FRETS, tuningToLabels, stringFretToMidi } from '../data/musicTheory';
import { DEGREE_COLORS, degreeDisplay } from '../data/degreeColors';
import { useGuitarStore } from '../store/useGuitarStore';
import { useShallow } from 'zustand/react/shallow';
import { playMidi } from '../audio/sound';

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
                    onClick={() => {
                      setHighlightedMidi(isHighlighted ? null : cellMidi);
                      void playMidi(cellMidi, 'guitar');
                    }}
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
