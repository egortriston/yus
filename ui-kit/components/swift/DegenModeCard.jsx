import { clsx } from 'clsx';
import { Crosshair, CaretRight } from '@phosphor-icons/react';

/**
 * Degen mode subscription card -- uses Crosshair (target) icon with accent theme colors.
 */
export function DegenModeCard({ title = 'Degen Mode', description, isActive = false, expiresAt, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
        isActive ? 'bg-surface-overlay cursor-default' : 'bg-surface-overlay hover:bg-surface-raised cursor-pointer',
        className,
      )}
    >
      {/* Icon container -- theme accent color */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent/15 text-accent">
        <Crosshair size={20} weight="bold" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary font-mono">{title}</span>
          {isActive && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/15 text-success">
              Active
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-muted mt-0.5 truncate font-mono">
          {isActive && expiresAt ? `Expires: ${expiresAt}` : description || 'Unlock advanced features'}
        </p>
      </div>

      {!isActive && <CaretRight size={16} className="text-text-muted shrink-0" />}
    </button>
  );
}
