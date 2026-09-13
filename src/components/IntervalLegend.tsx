const LEGEND_ITEMS = [
  { color: '#FF6B6B', label: 'Tonic',   degree: '1' },
  { color: '#4ECDC4', label: 'Third',   degree: '3' },
  { color: '#F2C12E', label: 'Fifth',   degree: '5' },
  { color: '#5B8DB8', label: 'Seventh', degree: '7' },
] as const;

export function IntervalLegend() {
  return (
    <div className="interval-legend">
      <div className="interval-legend__title">Intervals</div>
      {LEGEND_ITEMS.map(({ color, label, degree }) => (
        <div key={degree} className="interval-legend__item">
          <div className="interval-legend__dot" style={{ backgroundColor: color }} />
          <span className="interval-legend__label">{label} ({degree})</span>
        </div>
      ))}
    </div>
  );
}
