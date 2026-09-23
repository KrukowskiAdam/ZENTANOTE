import { useEffect } from 'react';
import './App.css';
import { TopBar } from './components/TopBar';
import { ChordSelector } from './components/ChordSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { TuningSelector } from './components/TuningSelector';
import { Fretboard2D } from './components/Fretboard2D';
import { Piano } from './components/Piano';
import { StaffNotation } from './components/StaffNotation';
import { useViewStore } from './store/useViewStore';
import { preloadInstrument } from './audio/sound';

function App() {
  const instrument = useViewStore((s) => s.instrument);

  useEffect(() => preloadInstrument(instrument), [instrument]);

  return (
    <main className="app">
      <TopBar />
      <div className={`controls-bar ${instrument === 'piano' ? 'controls-bar--no-tuning' : ''}`}>
        <ChordSelector />
        <ScaleSelector />
        {instrument === 'guitar' && <TuningSelector />}
      </div>
      <div className="stage">
        {instrument === 'guitar' ? <Fretboard2D /> : <Piano />}
      </div>
      <div className="staff-row">
        <StaffNotation />
      </div>
    </main>
  );
}

export default App;
