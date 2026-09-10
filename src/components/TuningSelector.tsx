import { useGuitarStore } from '../store/useGuitarStore';
import { NOTE_NAMES, TUNING_PRESETS, tuningToLabels } from '../data/musicTheory';
import { useShallow } from 'zustand/react/shallow';

export function TuningSelector() {
  const { tuning, presetName, setTuningPreset, setStringTuning } = useGuitarStore(
    useShallow((s) => ({
      tuning: s.tuning,
      presetName: s.presetName,
      setTuningPreset: s.setTuningPreset,
      setStringTuning: s.setStringTuning,
    })),
  );

  return (
    <div id="tuning" className="selector tuning">
      <div className="selector__header">
        <h2 className="selector__chord-name">Tuning</h2>
      </div>
      <div className="selector__controls">
        <select
          id="tuning-preset"
          className="tuning__preset-select"
          value={presetName ?? '__custom'}
          onChange={(e) => {
            if (e.target.value !== '__custom') setTuningPreset(e.target.value);
          }}
        >
          {TUNING_PRESETS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} ({tuningToLabels(p.tuning).join(' ')})
            </option>
          ))}
          {presetName === null && <option value="__custom">Custom</option>}
        </select>
        <div className="tuning__strings">
          {tuning.map((sem, i) => (
            <div key={i} className="tuning__string">
              <span className="tuning__string-num">{6 - i}</span>
              <select
                className="tuning__note-select"
                value={sem}
                onChange={(e) => setStringTuning(i, Number(e.target.value))}
              >
                {NOTE_NAMES.map((note, ni) => (
                  <option key={note} value={ni}>
                    {note}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
