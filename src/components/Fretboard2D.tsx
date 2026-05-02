import { TOTAL_FRETS, tuningToLabels } from '../data/musicTheory';
import { useGuitarStore } from '../store/useGuitarStore';
import { useShallow } from 'zustand/react/shallow';

const DEGREE_COLORS: Record<string, string> = {
  '1': '#FF5A33',
  '2': '#63b3ed',
  '3': '#B4CF66',
  '4': '#4fd1c5',
  '5': '#F2C12E',
  '6': '#d69e2e',
  '7': '#44803F',
  '9': '#146152',
  '11': '#76e4f7',
  '13': '#f6e05e',
  '♭2': '#63b3ed',
  '♭3': '#B4CF66',
  '♭5': '#F2C12E',
  '♭6': '#d69e2e',
  '♭7': '#44803F',
  '♭9': '#146152',
  '♭13': '#f6e05e',
  '♯9': '#146152',
  '♯11': '#76e4f7',
  '♭♭7': '#44803F',
};

function degreeDisplay(degree: string): string {
  return degree.replaceAll('♭', 'b').replaceAll('♯', '#');
}

export function Fretboard2D() {
  const { positions, scalePositions, tuning } = useGuitarStore(
    useShallow((s) => ({ positions: s.positions, scalePositions: s.scalePositions, tuning: s.tuning })),
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
                return (
                  <div
                    key={`${stringIndex}-${fret}`}
                    className={`fret2d__cell ${fret === 0 ? 'fret2d__cell--nut' : ''}`}
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
                {[3, 5, 7, 9, 15].includes(fret) && <div className="fret2d__inlay-dot" />}
                {fret === 12 && <><div className="fret2d__inlay-dot" /><div className="fret2d__inlay-dot" /></>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
