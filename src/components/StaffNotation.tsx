import type { MouseEvent } from 'react';
import { useGuitarStore } from '../store/useGuitarStore';
import { useViewStore } from '../store/useViewStore';
import { midiToStaff, staffLedgerLines, staffStepToMidi } from '../data/musicTheory';
import { playMidi } from '../audio/sound';

/**
 * StaffNotation — grand staff (treble + bass) covering the full piano range (E1–G7),
 * so any key on the Piano view can be plotted, ledger lines and all.
 *
 * Geometry reference:
 *   S    = diatonic half-step distance in SVG units (line ↔ adjacent space)
 *   sy() = SVG y for a given "step" (step 0 = F5, top line of treble;
 *          positive steps go DOWN / lower in pitch)
 *
 * Step map (natural notes only):
 *  -15 G7  (top of range, several ledger lines above treble)
 *   -1 G5  |  0 F5  2 D5  4 B4  6 G4  8 E4  ← treble staff lines
 *   10 C4  (middle C — ledger)
 *   12 A3  14 F3  16 D3  18 B2  20 G2        ← bass staff lines
 *   22 E2  (1st ledger below bass)
 *   24 D2  (2nd ledger below bass)
 *   29 E1  (bottom of range, several ledger lines below bass)
 */

const S     = 8;
const PAD_T = 136;  // px above F5 — room up to G7 (step −15)
const PAD_B = 8;
const PAD_L = 72;   // left — clef symbol area
const VBW   = 1200;
const VBH   = PAD_T + 30 * S + PAD_B; // 384 — down to E1 (step 29)

const sy = (step: number): number => PAD_T + step * S;

const SX1 = PAD_L;
const SX2 = VBW - 14;

// Clickable range: G7 (step −15) … E1 (step 29)
const MIN_STEP = -15;
const MAX_STEP = 29;

// Staff line step positions
const TREBLE_STEPS = [0, 2, 4, 6, 8];       // F5 D5 B4 G4 E4
const BASS_STEPS   = [12, 14, 16, 18, 20];  // A3 F3 D3 B2 G2

export function StaffNotation() {
  const highlightedMidi = useGuitarStore((s) => s.highlightedMidi);
  const setHighlightedMidi = useGuitarStore((s) => s.setHighlightedMidi);
  const instrument = useViewStore((s) => s.instrument);

  // Click on a line/space → play that natural note and highlight it everywhere.
  // Clicking the highlighted note's position replays it (keeping its sharp).
  const handleStaffClick = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const step = Math.min(MAX_STEP, Math.max(MIN_STEP, Math.round((pt.y - PAD_T) / S)));
    const midi =
      highlightedMidi != null && midiToStaff(highlightedMidi).step === step
        ? highlightedMidi
        : staffStepToMidi(step);
    setHighlightedMidi(midi);
    void playMidi(midi, instrument);
  };


  const LINE   = '#cccccc';
  const CLEF   = '#333333';
  const REF    = '#999999';

  // Highlighted note computed from MIDI
  const highlighted = highlightedMidi != null ? midiToStaff(highlightedMidi) : null;

  // x of highlighted note head
  const NX  = 260;
  const NRX = 10;  // note head half-width
  const NRY = 6.5; // note head half-height

  return (
    <div className="staff-section">
      <svg
        onClick={handleStaffClick}
        width="100%"
        viewBox={`0 0 ${VBW} ${VBH}`}
        style={{ display: 'block', cursor: 'pointer' }}
        aria-label="Grand staff – piano range E1 to G7"
      >
        {/* ── Treble staff lines ── */}
        {TREBLE_STEPS.map(step => (
          <line
            key={`t${step}`}
            x1={SX1} y1={sy(step)} x2={SX2} y2={sy(step)}
            stroke={LINE} strokeWidth={1.5}
          />
        ))}

        {/* ── Bass staff lines ── */}
        {BASS_STEPS.map(step => (
          <line
            key={`b${step}`}
            x1={SX1} y1={sy(step)} x2={SX2} y2={sy(step)}
            stroke={LINE} strokeWidth={1.5}
          />
        ))}

        {/* ── Vertical bar at left connecting both staves ── */}
        <line
          x1={SX1} y1={sy(0)} x2={SX1} y2={sy(20)}
          stroke={LINE} strokeWidth={2}
        />

        {/* ── Treble clef 𝄞
              In standard notation the clef wraps around the G4 line (step 6).
              Position the SVG text baseline at G4 + a small offset. ── */}
        <text
          x={PAD_L - 18}
          y={sy(6) + 10}
          fontSize={82}
          fill={CLEF}
          fontFamily="Times New Roman, Georgia, serif"
          textAnchor="middle"
        >𝄞</text>

        {/* ── Bass clef 𝄢
              The two dots straddle the F3 line (step 14). ── */}
        <text
          x={PAD_L - 20}
          y={sy(14) + 4}
          fontSize={44}
          fill={CLEF}
          fontFamily="Times New Roman, Georgia, serif"
          textAnchor="middle"
        >𝄢</text>

        {/* ── Middle C reference (C4 = step 10) — dashed ledger ── */}
        <line
          x1={SX1} y1={sy(10)} x2={SX1 + 40} y2={sy(10)}
          stroke={LINE} strokeWidth={1.3}
          strokeDasharray="3 3" strokeOpacity={0.45}
        />
        <text
          x={SX1 - 6} y={sy(10) + 3.5}
          fontSize={9} fill={REF}
          fontFamily="monospace" textAnchor="end"
        >C4</text>

        {/* ── Ledger lines below bass for D2 range (steps 22 & 24) ── */}
        {[22, 24].map(step => (
          <line
            key={`lg${step}`}
            x1={SX1} y1={sy(step)} x2={SX1 + 40} y2={sy(step)}
            stroke={LINE} strokeWidth={1.5}
          />
        ))}

        {/* ── Range labels ── */}
        <text
          x={SX1 - 6} y={sy(-15) + 3.5}
          fontSize={9} fill={REF} fontFamily="monospace" textAnchor="end"
        >G7</text>
        <text
          x={SX1 - 6} y={sy(29) + 3.5}
          fontSize={9} fill={REF} fontFamily="monospace" textAnchor="end"
        >E1</text>

        {/* ── Highlighted note from fretboard click ── */}
        {highlighted && (() => {
          const { step, accidental, noteName } = highlighted;
          const cy = sy(step);
          const ledgers = staffLedgerLines(step);
          // Stem: goes up when note is below middle of treble (step > 4), down otherwise
          const stemUp = step > 4;
          const stemX  = stemUp ? NX + NRX - 1 : NX - NRX + 1;
          const stemY1 = stemUp ? cy - NRY : cy + NRY;
          const stemY2 = stemUp ? cy - NRY - 42 : cy + NRY + 42;

          return (
            <g>
              {/* Ledger lines */}
              {ledgers.map(ls => (
                <line
                  key={`hl-lg${ls}`}
                  x1={NX - NRX - 6} y1={sy(ls)}
                  x2={NX + NRX + 6} y2={sy(ls)}
                  stroke={LINE} strokeWidth={1.5}
                />
              ))}
              {/* Stem */}
              <line
                x1={stemX} y1={stemY1}
                x2={stemX} y2={stemY2}
                stroke="#1a2240" strokeWidth={2}
              />
              {/* Note head */}
              <ellipse
                cx={NX} cy={cy}
                rx={NRX} ry={NRY}
                fill="#1a2240"
                transform={`rotate(-12, ${NX}, ${cy})`}
              />
              {/* Accidental */}
              {accidental === '#' && (
                <text
                  x={NX - NRX - 9} y={cy + 5}
                  fontSize={16} fill="#1a2240"
                  fontFamily="Times New Roman, Georgia, serif"
                  textAnchor="middle"
                >♯</text>
              )}
              {/* Note name label below/above */}
              <text
                x={NX} y={stemUp ? stemY2 - 6 : stemY2 + 14}
                fontSize={11} fill="rgba(40,60,160,0.85)"
                fontFamily="monospace" fontWeight="700"
                textAnchor="middle"
              >{noteName}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
