import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getChordToneClasses, getScaleToneClasses } from '../data/musicTheory';
import { DEGREE_COLORS, degreeDisplay } from '../data/degreeColors';
import { useGuitarStore } from '../store/useGuitarStore';

const START_OCTAVE = 2;
const END_OCTAVE = 5; // inclusive — only the C of this octave is rendered, as the trailing key

const WHITE_STEPS = [
  { note: 'C', semitone: 0 },
  { note: 'D', semitone: 2 },
  { note: 'E', semitone: 4 },
  { note: 'F', semitone: 5 },
  { note: 'G', semitone: 7 },
  { note: 'A', semitone: 9 },
  { note: 'B', semitone: 11 },
] as const;

// The black key that follows a given white key; null where there's no gap (E-F, B-C).
const BLACK_AFTER: Record<string, string | null> = {
  C: 'C#', D: 'D#', E: null, F: 'F#', G: 'G#', A: 'A#', B: null,
};

interface WhiteKey {
  midi: number;
  note: string;
  octave: number;
}
interface BlackKey {
  midi: number;
  note: string;
  afterIndex: number; // index into the white-key array this key sits after
}

function buildKeys(): { white: WhiteKey[]; black: BlackKey[] } {
  const white: WhiteKey[] = [];
  const black: BlackKey[] = [];

  for (let octave = START_OCTAVE; octave <= END_OCTAVE; octave++) {
    for (const { note, semitone } of WHITE_STEPS) {
      if (octave === END_OCTAVE && note !== 'C') continue;
      const midi = (octave + 1) * 12 + semitone;
      white.push({ midi, note, octave });

      const blackNote = BLACK_AFTER[note];
      if (blackNote && octave !== END_OCTAVE) {
        black.push({ midi: midi + 1, note: blackNote, afterIndex: white.length - 1 });
      }
    }
  }

  return { white, black };
}

export function Piano() {
  const { root, chordType, scaleType, highlightedMidi, setHighlightedMidi } = useGuitarStore(
    useShallow((s) => ({
      root: s.root,
      chordType: s.chordType,
      scaleType: s.scaleType,
      highlightedMidi: s.highlightedMidi,
      setHighlightedMidi: s.setHighlightedMidi,
    })),
  );

  const { white, black } = useMemo(buildKeys, []);

  const degreeBySemitone = useMemo(() => {
    const map = new Map<number, string>();
    if (chordType) {
      for (const t of getChordToneClasses(root, chordType)) map.set(t.semitone, t.degree);
    } else if (scaleType) {
      for (const t of getScaleToneClasses(root, scaleType)) map.set(t.semitone, t.degree);
    }
    return map;
  }, [root, chordType, scaleType]);

  const whiteWidthPct = 100 / white.length;
  const blackWidthPct = whiteWidthPct * 0.62;

  return (
    <div className="piano__viewport">
      <div className="piano">
        <div className="piano__keys">
          {white.map((key) => {
            const degree = degreeBySemitone.get(key.midi % 12);
            const isHighlighted = highlightedMidi === key.midi;
            return (
              <div
                key={key.midi}
                className={`piano__key piano__key--white ${isHighlighted ? 'piano__key--highlighted' : ''}`}
                style={{ width: `${whiteWidthPct}%` }}
                onClick={() => setHighlightedMidi(isHighlighted ? null : key.midi)}
              >
                {degree && (
                  <div
                    className="piano__marker"
                    style={{ backgroundColor: DEGREE_COLORS[degree] ?? '#888' }}
                    title={degree}
                  >
                    {degreeDisplay(degree)}
                  </div>
                )}
                {key.note === 'C' && <span className="piano__key-label">C{key.octave}</span>}
              </div>
            );
          })}

          {black.map((key) => {
            const degree = degreeBySemitone.get(key.midi % 12);
            const isHighlighted = highlightedMidi === key.midi;
            const centerPct = (key.afterIndex + 1) * whiteWidthPct;
            return (
              <div
                key={key.midi}
                className={`piano__key piano__key--black ${isHighlighted ? 'piano__key--highlighted' : ''}`}
                style={{ left: `${centerPct}%`, width: `${blackWidthPct}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setHighlightedMidi(isHighlighted ? null : key.midi);
                }}
              >
                {degree && (
                  <div
                    className="piano__marker piano__marker--black"
                    style={{ backgroundColor: DEGREE_COLORS[degree] ?? '#888' }}
                    title={degree}
                  >
                    {degreeDisplay(degree)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
