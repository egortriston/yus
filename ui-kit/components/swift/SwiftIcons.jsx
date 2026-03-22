/**
 * Inline SVG icon components from swift-assets.
 * Using inline SVGs so they inherit currentColor and work without bundler config.
 */

export function TonIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="12" fill="#0098EA" />
      <path d="M16.097 6.698H7.902c-1.507 0-2.462 1.625-1.704 2.94l5.058 8.765c.33.573 1.157.573 1.487 0l5.06-8.766c.756-1.312-.2-2.94-1.706-2.94zm-4.845 9.077l-1.102-2.132-2.657-4.754c-.175-.304.041-.694.409-.694h3.35v7.58zm5.253-6.887l-2.657 4.755-1.102 2.131V8.194h3.35c.367 0 .584.39.409.694z" fill="#fff" />
    </svg>
  );
}

export { SketchLogo as GemIcon } from '@phosphor-icons/react';

export function PresentIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 19" fill="none" className={className}>
      <path d="M18 9v8h-2V9h2zM4 9v8H2V9h2zM18 19H2v-2h16v2zM18 11H2V9h16v2zM20 9h-2V6h2v3zM2 9H0V6h2v3zM13 17h-2V5h2v12zM9 17H7V5h2v12zM13 2h-2V0h2v2zM15 2h-2V0h2v2zM15 4h-2V2h2v2zM9 2H7V0h2v2zM11 4H9V2h2v2zM7 2H5V0h2v2zM7 4H5V2h2v2zM18 6H2V4h16v2z" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" />
    </svg>
  );
}

export function CrownIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18" fill="none" className={className}>
      <path d="M10 0l3 6 7-3-3 9H3L0 3l7 3 3-6zM3 14h14v2H3v-2z" fill="currentColor" />
    </svg>
  );
}

export function WalletIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="5" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20M16 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 5V3a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function BatteryIcon({ state = 'full', size = 24, className = '' }) {
  const levels = { none: 0, low: 1, half: 2, full: 3 };
  const level = levels[state] ?? 3;
  const colors = ['var(--color-text-muted)', '#DD2728', '#FED813', '#00B843'];
  const c = colors[level];
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 28 16" fill="none" className={className}>
      <rect x="1" y="1" width="22" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="24" y="5" width="3" height="6" rx="1" fill="currentColor" opacity="0.2" />
      {level >= 1 && <rect x="3.5" y="3.5" width="5" height="9" rx="1" fill={c} />}
      {level >= 2 && <rect x="10" y="3.5" width="5" height="9" rx="1" fill={c} />}
      {level >= 3 && <rect x="16.5" y="3.5" width="5" height="9" rx="1" fill={c} />}
    </svg>
  );
}
