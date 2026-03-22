import { clsx } from 'clsx';

/**
 * iOS-style loading indicator.
 * A smooth pill-shaped track with an accent capsule that glides across.
 * The noise background is handled at the layout level -- the Loader is
 * now a clean, minimal element that sits on top of it.
 */
export function Loader({ size = 'md', label, className, centered = false }) {
  const widths = { sm: 'w-10', md: 'w-16', lg: 'w-24' };
  const trackWidth = widths[size] || widths.md;

  return (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-3',
      centered && 'min-h-[60vh]',
      className,
    )}>
      {/* Track */}
      <div className={clsx('relative h-1 overflow-hidden rounded-full bg-surface-overlay', trackWidth)}>
        <div
          className="absolute inset-y-0 w-1/3 rounded-full bg-accent/70"
          style={{ animation: 'ios-loader 1.4s ease-in-out infinite' }}
        />
      </div>
      {label && (
        <p className="text-[11px] text-text-muted font-medium tracking-wide">{label}</p>
      )}

      <style>{`
        @keyframes ios-loader {
          0%   { left: -33%; opacity: 0.4; }
          50%  { opacity: 1; }
          100% { left: 100%; opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
