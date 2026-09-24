import { useEffect, useState } from 'react';
import { TopBar } from './TopBar';
import { ChordSelector } from './ChordSelector';
import { ScaleSelector } from './ScaleSelector';
import { TuningSelector } from './TuningSelector';
import { Fretboard2D } from './Fretboard2D';
import { Piano } from './Piano';
import { useViewStore } from '../store/useViewStore';
import { useGuitarStore } from '../store/useGuitarStore';
import { CHORD_FORMULAS, SCALE_FORMULAS } from '../data/musicTheory';

// Narrower range than desktop so keys stay wide enough to tap: C3–C6.
const MOBILE_PIANO_START = 48;
const MOBILE_PIANO_END = 84;

export function MobileLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const instrument = useViewStore((s) => s.instrument);
  const root = useGuitarStore((s) => s.root);
  const chordType = useGuitarStore((s) => s.chordType);
  const scaleType = useGuitarStore((s) => s.scaleType);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const summary = chordType
    ? `${root} ${CHORD_FORMULAS[chordType].label}`
    : scaleType
      ? `${root} ${SCALE_FORMULAS[scaleType].label}`
      : root;

  return (
    <main className="app app--mobile">
      <aside className="m-rail">
        <button
          type="button"
          className="m-rail__burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="m-drawer"
          onClick={() => setMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span className="m-rail__summary">{summary}</span>
      </aside>

      <div className="stage">
        {instrument === 'guitar'
          ? <Fretboard2D />
          : <Piano startMidi={MOBILE_PIANO_START} endMidi={MOBILE_PIANO_END} />}
      </div>

      <div
        className={`m-backdrop ${menuOpen ? 'm-backdrop--open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      {/* Kept mounted so selector-local state (e.g. naming mode) survives closing the menu. */}
      <nav
        id="m-drawer"
        className={`m-drawer ${menuOpen ? 'm-drawer--open' : ''}`}
        aria-label="Settings"
        inert={!menuOpen}
      >
        <div className="m-drawer__head">
          <TopBar />
          <button
            type="button"
            className="m-drawer__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ChordSelector />
        <ScaleSelector />
        {instrument === 'guitar' && <TuningSelector />}
      </nav>

      <div className="m-rotate" role="alert">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 15a8 8 0 0 1-5 5m0 0 .5-2.5M15 20l2.4.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p>Rotate your phone to landscape</p>
      </div>
    </main>
  );
}
