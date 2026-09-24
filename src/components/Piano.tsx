import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getChordToneClasses, getScaleToneClasses } from '../data/musicTheory';
import { DEGREE_COLORS, degreeDisplay } from '../data/degreeColors';
import { useGuitarStore } from '../store/useGuitarStore';
import { playMidi } from '../audio/sound';

// Standard 76-key keyboard range: E1–G7.
const START_MIDI = 28;
const END_MIDI = 103;

const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);

function pitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12;
}

function midiOctave(midi: number): number {
  return Math.floor(midi / 12) - 1; // MIDI 60 = C4
}

interface WhiteKey {
  midi: number;
  isC: boolean;
  octave: number;
}
interface BlackKey {
  midi: number;
  afterIndex: number; // index into the white-key array this key sits after
}

function buildKeys(startMidi: number, endMidi: number): { white: WhiteKey[]; black: BlackKey[] } {
  const white: WhiteKey[] = [];
  const black: BlackKey[] = [];

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const pc = pitchClass(midi);
    if (WHITE_PITCH_CLASSES.has(pc)) {
      white.push({ midi, isC: pc === 0, octave: midiOctave(midi) });
    } else {
      black.push({ midi, afterIndex: white.length - 1 });
    }
  }

  return { white, black };
}

interface PianoProps {
  startMidi?: number;
  endMidi?: number;
}

export function Piano({ startMidi = START_MIDI, endMidi = END_MIDI }: PianoProps) {
  const { root, chordType, scaleType, highlightedMidi, setHighlightedMidi } = useGuitarStore(
    useShallow((s) => ({
      root: s.root,
      chordType: s.chordType,
      scaleType: s.scaleType,
      highlightedMidi: s.highlightedMidi,
      setHighlightedMidi: s.setHighlightedMidi,
    })),
  );

  const { white, black } = useMemo(() => buildKeys(startMidi, endMidi), [startMidi, endMidi]);

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
                onClick={() => {
                  setHighlightedMidi(isHighlighted ? null : key.midi);
                  void playMidi(key.midi, 'piano');
                }}
              >
                {key.isC && <span className="piano__key-label">C{key.octave}</span>}
                {degree && (
                  <div
                    className="piano__marker"
                    style={{ backgroundColor: DEGREE_COLORS[degree] ?? '#888' }}
                    title={degree}
                  >
                    {degreeDisplay(degree)}
                  </div>
                )}
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
                  void playMidi(key.midi, 'piano');
                }}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
