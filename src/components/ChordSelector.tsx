import { useState } from 'react';
import { useGuitarStore } from '../store/useGuitarStore';
import { NOTE_NAMES, CHORD_FORMULAS, type ChordType } from '../data/musicTheory';
import { useShallow } from 'zustand/react/shallow';

const CHORD_TYPES: ChordType[] = [
  'maj', 'min', 'maj7', 'm7', '7', 'm7b5', 'dim7', '6', 'm6', '9', 'm9',
  'maj9', '11', '13', '7b9', '7s9', '7s11', '7b13', 'sus2', 'sus4', '7sus',
];

type NamingMode = 'jazz' | 'text';

function toTextNotation(value: string): string {
  return value
    .replaceAll('Δ', 'maj')
    .replaceAll('ø', 'm7b5')
    .replaceAll('°', 'dim')
    .replaceAll('♭', 'b')
    .replaceAll('♯', '#');
}

function formatNaming(value: string, mode: NamingMode): string {
  return mode === 'jazz' ? value : toTextNotation(value);
}

export function ChordSelector() {
  const [namingMode, setNamingMode] = useState<NamingMode>('jazz');
  const { root, chordType, setRoot, setChordType } = useGuitarStore(
    useShallow((s) => ({
      root: s.root,
      chordType: s.chordType,
      setRoot: s.setRoot,
      setChordType: s.setChordType,
    })),
  );

  const formula = chordType ? CHORD_FORMULAS[chordType] : null;
  const chordLabel = formula ? formatNaming(formula.label, namingMode) : '';
  const chordName = formula ? `${root} ${chordLabel}` : root;
  const formulaStr = formula ? formula.degrees.map((d) => formatNaming(d, namingMode)).join(' \u2013 ') : '';

  return (
    <div id="chords" className="selector">
      <div className="selector__header">
        <h2 className="selector__chord-name">{chordName}</h2>
      </div>

      <div className="selector__controls">
        <div className="selector__controls-row">
          <div className="selector__group">
            {NOTE_NAMES.map((note) => (
              <button
                key={note}
                type="button"
                className={`selector__btn ${root === note ? 'selector__btn--active' : ''}`}
                onClick={() => setRoot(note)}
              >
                {note}
              </button>
            ))}
          </div>

          <div className="selector__divider" />

          <div className="selector__group">
            <select
              className="selector__type-select"
              value={chordType ?? ''}
              onChange={(e) => setChordType(e.target.value ? e.target.value as ChordType : null)}
              aria-label="Chord type"
            >
              <option value="">— None —</option>
              {CHORD_TYPES.map((ct) => (
                <option key={ct} value={ct}>
                  {formatNaming(CHORD_FORMULAS[ct].label, namingMode)}
                  {' '}
                  ({Array.from(new Set(CHORD_FORMULAS[ct].aliases.map((a) => formatNaming(a, namingMode)))).join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="selector__group selector__mode" role="group" aria-label="Chord naming mode">
            <button
              type="button"
              className={`selector__mode-btn ${namingMode === 'jazz' ? 'selector__mode-btn--active' : ''}`}
              onClick={() => setNamingMode('jazz')}
            >
              Jazz symbols
            </button>
            <button
              type="button"
              className={`selector__mode-btn ${namingMode === 'text' ? 'selector__mode-btn--active' : ''}`}
              onClick={() => setNamingMode('text')}
            >
              Text
            </button>
          </div>
        </div>
        <span className="selector__formula">{formulaStr}</span>
      </div>
    </div>
  );
}
