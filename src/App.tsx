import './App.css';
import { ChordSelector } from './components/ChordSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { TuningSelector } from './components/TuningSelector';
import { Fretboard2D } from './components/Fretboard2D';
import { StaffNotation } from './components/StaffNotation';

function App() {
  return (
    <main className="app">
      <div className="controls-bar">
        <ChordSelector />
        <ScaleSelector />
        <TuningSelector />
      </div>
      <div className="stage">
        <Fretboard2D />
      </div>
      <div className="staff-row">
        <StaffNotation />
      </div>
    </main>
  );
}

export default App;
