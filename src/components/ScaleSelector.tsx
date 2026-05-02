import { useGuitarStore } from '../store/useGuitarStore';
import { SCALE_FORMULAS, type ScaleType } from '../data/musicTheory';
import { useShallow } from 'zustand/react/shallow';

const SCALE_TYPES: ScaleType[] = [
  'pentatonic_minor',
  'pentatonic_major',
  'blues_minor',
  'blues_major',
  'major',
  'natural_minor',
  'dorian',
  'mixolydian',
  'phrygian',
  'bebop_dominant',
];

export function ScaleSelector() {
  const { scaleType, setScaleType } = useGuitarStore(
    useShallow((s) => ({ scaleType: s.scaleType, setScaleType: s.setScaleType })),
  );

  const formula = scaleType ? SCALE_FORMULAS[scaleType] : null;
  const degreesStr = formula ? formula.degrees.join(' – ') : '';

  return (
    <div className="selector selector--scale">
      <div className="selector__header">
        <span className="selector__formula">{degreesStr}</span>
      </div>
      <div className="selector__controls">
        <div className="selector__group">
          <select
            className="selector__type-select"
            value={scaleType ?? ''}
            onChange={(e) => setScaleType(e.target.value ? e.target.value as ScaleType : null)}
            aria-label="Scale type"
          >
            <option value="">— Scale: None —</option>
            {SCALE_TYPES.map((st) => (
              <option key={st} value={st}>
                {SCALE_FORMULAS[st].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
