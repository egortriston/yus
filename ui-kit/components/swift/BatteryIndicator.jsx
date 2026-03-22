import { clsx } from 'clsx';

/**
 * Battery indicator using the original SwiftGifts battery SVGs.
 * 4 states: none, low, half, full
 */
function BatterySvg({ state = 'full', width = 38 }) {
  const colors = { none: '#DD2728', low: '#D68600', half: '#0098EA', full: '#00B843' };
  const c = colors[state] || colors.full;
  // Replicated from swift-assets/icons/battery_states/
  const fillWidths = { none: null, low: 6, half: 13, full: 26 };
  const fillRx = { low: 3, half: 4, full: 4 };
  const fw = fillWidths[state];
  return (
    <svg width={width} height={width * 18 / 38} viewBox="0 0 38 18" fill="none">
      <path d="M26 1C29.866 1 33 4.13401 33 8V10C33 13.866 29.866 17 26 17H8C4.13401 17 1 13.866 1 10V8C1 4.13401 4.13401 1 8 1H26Z" stroke={c} strokeWidth="2" />
      {fw && <rect x="4" y="4" width={fw} height="10" rx={fillRx[state]} fill={c} />}
      <path d="M36 6C36 5.44772 36.4477 5 37 5C37.5523 5 38 5.44772 38 6V12C38 12.5523 37.5523 13 37 13C36.4477 13 36 12.5523 36 12V6Z" fill={c} />
    </svg>
  );
}

export function BatteryIndicator({ state = 'full', label, size = 38, className }) {
  const stateLabels = { none: 'Empty', low: 'Low', half: 'Half', full: 'Full' };
  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <BatterySvg state={state} width={size} />
      {label !== false && (
        <span className="text-[11px] font-medium text-text-secondary">
          {label || stateLabels[state]}
        </span>
      )}
    </div>
  );
}
