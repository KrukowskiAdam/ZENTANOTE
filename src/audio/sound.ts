import * as Tone from 'tone';
import type { Instrument } from '../store/useViewStore';

// Samples live in public/samples; Tone.Sampler repitches between them.
// File names use "s" for sharps (Cs4.mp3 = C#4).
const SAMPLE_MAPS: Record<Instrument, { baseUrl: string; urls: Record<string, string> }> = {
  piano: {
    baseUrl: '/samples/piano/',
    urls: Object.fromEntries(
      [1, 2, 3, 4, 5, 6, 7].flatMap((o) =>
        ['C', 'D#', 'F#', 'A'].map((n) => [`${n}${o}`, `${n.replace('#', 's')}${o}.mp3`]),
      ).concat([['C8', 'C8.mp3']]),
    ),
  },
  guitar: {
    baseUrl: '/samples/guitar/',
    urls: Object.fromEntries(
      ['E2', 'G2', 'A#2', 'C#3', 'E3', 'G3', 'A#3', 'C#4', 'E4', 'G4', 'A#4', 'C#5', 'D5'].map(
        (n) => [n, `${n.replace('#', 's')}.mp3`],
      ),
    ),
  },
};

const samplers: Partial<Record<Instrument, Tone.Sampler>> = {};

function getSampler(instrument: Instrument): Tone.Sampler {
  let sampler = samplers[instrument];
  if (!sampler) {
    const { baseUrl, urls } = SAMPLE_MAPS[instrument];
    sampler = new Tone.Sampler({ urls, baseUrl, release: 1 }).toDestination();
    samplers[instrument] = sampler;
  }
  return sampler;
}

/** Start fetching samples early so the first click doesn't lag. */
export function preloadInstrument(instrument: Instrument): void {
  getSampler(instrument);
}

async function ready(instrument: Instrument): Promise<Tone.Sampler> {
  // AudioContext may only start after a user gesture — every caller is a click handler.
  if (Tone.getContext().state !== 'running') await Tone.start();
  const sampler = getSampler(instrument);
  if (!sampler.loaded) await Tone.loaded();
  return sampler;
}

const toFreq = (midi: number) => Tone.Frequency(midi, 'midi').toFrequency();

export async function playMidi(midi: number, instrument: Instrument): Promise<void> {
  const sampler = await ready(instrument);
  sampler.triggerAttackRelease(toFreq(midi), instrument === 'guitar' ? 2.5 : 1.5);
}

