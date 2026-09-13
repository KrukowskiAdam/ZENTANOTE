# FretBoard – Guitar Chord Visualizer 🎸

Interaktywna aplikacja 3D do nauki dźwięków, skal, arpeggi i akordów na gryfie gitary. Zbudowana jako portfolio project z użyciem React, R3F, GSAP i Zustand.

## Stack.

- **React 19** + **TypeScript** + **Vite 7**
- **@react-three/fiber** + **@react-three/drei** — 3D scena gryfu gitary
- **GSAP** (@gsap/react) — animacja pojawiania się markerów (staggered scale-in)
- **Zustand** — globalny state (wybrana nuta, typ akordu, pozycje na gryfie)
- **@react-three/postprocessing** / **@react-three/rapier** — dostępne, nie użyte jeszcze

## Szybki start

```bash
npm install
npm run dev
```

Otwórz `http://localhost:5173/`

## Co jest zrobione (v0.1)

### Teoria muzyczna (`src/data/`)
- `musicTheory.ts` — 12 nut, strojenie standardowe, 5 typów akordów:
  - **Major** (1-3-5), **Minor** (1-♭3-5)
  - **Dom7** (1-3-5-♭7), **Maj7** (1-3-5-7), **Min7** (1-♭3-5-♭7)
- `fretboardLayout.ts` — stałe układu 3D (rozstaw progów, strun, pozycje XZ)
- Funkcja `getChordPositions(root, chordType)` → oblicza wszystkie pozycje na 12 progach × 6 strun

### Zustand Store (`src/store/`)
- `useGuitarStore.ts` — root (C-B), chordType (maj/min/dom7/maj7/min7), positions[]
- `useSceneStore.ts` — stary store z hero scene (do usunięcia/recyklingu)

### Komponenty 3D (`src/components/`)
- `Fretboard.tsx` — 3D gryf:
  - Deska (ciemne drewno), nakładka, progi metalowe
  - 6 strun (realistyczne grubości: bas = grubszy/złoty, sopran = cienki/srebrny)
  - Kropki pozycyjne na progach 3, 5, 7, 9 + podwójna na 12
  - Etykiety strun (E A D G B e) + numery progów (1-12)
- `NoteMarkers.tsx` — kolorowe sfery na gryfie:
  - Kolory wg interwału: 1=zielony, 3=niebieski, ♭3=fioletowy, 5=lawendowy, 7=złoty, ♭7=pomarańczowy
  - Billboard labels z numerem interwału
  - **GSAP animacja**: przy zmianie akordu — staggered scale-in z `back.out(1.7)` od lewej do prawej
- `GuitarScene.tsx` — Canvas R3F, oświetlenie, Environment, ContactShadows, OrbitControls

### UI (`src/components/`)
- `ChordSelector.tsx` — panel na górze strony:
  - 12 przycisków nut bazowych (C, C#, D, ... B)
  - 5 przycisków typu akordu (Major, Minor, 7, Maj7, Min7)
  - Wyświetla nazwę akordu + formułę interwałową

### Style
- `App.css` — layout fullscreen (selector na górze, Canvas na resztę), dark theme
- `index.css` — globalne style, font Space Grotesk, ciemny gradient tła

## Plany rozwoju (TODO)

- [ ] Tryb skali (Major, Minor, Pentatonic, Blues, Modes)
- [ ] Tryb arpeggio
- [ ] Filtrowanie po zakresie progów (np. pozycja I-IV)
- [ ] Dźwięk — kliknięcie na nutę odtwarza ton
- [ ] Więcej typów akordów (dim, aug, sus2, sus4, add9...)
- [ ] Animacja palcowania (konkretne voicingi akordów)
- [ ] Ciemny/jasny motyw
- [ ] Responsywność mobile
- [ ] Deploy na Vercel/Netlify
# ZENTANOTE
# ZENTANOTE
