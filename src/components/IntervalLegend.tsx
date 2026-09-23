import { DEGREE_COLORS } from '../data/degreeColors';

const LEGEND_ITEMS = [
  { color: DEGREE_COLORS['1'], label: 'Tonic',   degree: '1' },
  { color: DEGREE_COLORS['3'], label: 'Third',   degree: '3' },
  { color: DEGREE_COLORS['5'], label: 'Fifth',   degree: '5' },
  { color: DEGREE_COLORS['7'], label: 'Seventh', degree: '7' },
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
