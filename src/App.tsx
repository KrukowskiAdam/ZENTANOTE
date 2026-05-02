import './App.css';
import { ChordSelector } from './components/ChordSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { TuningSelector } from './components/TuningSelector';
import { Fretboard2D } from './components/Fretboard2D';

function App() {
  return (
    <main className="app">
      <ChordSelector />
      <ScaleSelector />
      <TuningSelector />
      <div className="stage">
        <Fretboard2D />
      </div>
    </main>
  );
}

export default App;
