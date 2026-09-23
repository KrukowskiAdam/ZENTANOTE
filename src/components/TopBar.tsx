import { useViewStore } from '../store/useViewStore';

export function TopBar() {
  const { instrument, setInstrument } = useViewStore();

  return (
    <header className="topbar">
      <span className="topbar__brand">
        {/* charm:music (MIT) — same glyph as the favicon */}
        <svg className="topbar__logo" viewBox="0 0 16 16" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
            <circle cx="4" cy="12" r="2.25" />
            <circle cx="12" cy="11" r="2.25" />
            <polyline points="6.25 12 6.25 2.75 14.25 1.75 14.25 11" />
          </g>
        </svg>
        Zentanote
      </span>
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
