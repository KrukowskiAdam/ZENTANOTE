import { useViewStore } from '../store/useViewStore';

export function TopBar() {
  const { instrument, setInstrument } = useViewStore();

  return (
    <header className="topbar">
      <span className="topbar__brand">Zentanote</span>
      <nav className="topbar__menu" role="tablist" aria-label="Instrument">
        <button
          type="button"
          role="tab"
          aria-selected={instrument === 'piano'}
          className={`topbar__menu-btn ${instrument === 'piano' ? 'topbar__menu-btn--active' : ''}`}
          onClick={() => setInstrument('piano')}
        >
          Piano
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={instrument === 'guitar'}
          className={`topbar__menu-btn ${instrument === 'guitar' ? 'topbar__menu-btn--active' : ''}`}
          onClick={() => setInstrument('guitar')}
        >
          Guitar
        </button>
      </nav>
    </header>
  );
}
