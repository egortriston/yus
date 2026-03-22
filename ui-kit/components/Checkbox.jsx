import { clsx } from 'clsx';
import { Check, Minus } from '@phosphor-icons/react';

/**
 * Custom-styled Checkbox component.
 * Supports checked, indeterminate, disabled states, and optional label.
 * Use this everywhere instead of native <input type="checkbox" />.
 */
export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  className,
  size = 'md',
  disabled = false,
}) {
  const sizes = {
    sm: 'w-3.5 h-3.5 rounded-[5px]',
    md: 'w-4 h-4 rounded-md',
    lg: 'w-5 h-5 rounded-lg',
  };

  const iconSizes = { sm: 8, md: 10, lg: 12 };

  return (
    <label className={clsx('inline-flex items-center gap-2.5 cursor-pointer group select-none', disabled && 'opacity-40 cursor-not-allowed', className)}>
      <div
        className={clsx(
          'relative flex items-center justify-center transition-all duration-150 border-[1.5px]',
          sizes[size] || sizes.md,
          checked || indeterminate
            ? 'bg-accent border-accent shadow-[0_0_0_1px_rgba(var(--color-accent-rgb,255,107,53),0.15)]'
            : 'border-border bg-surface-overlay group-hover:border-text-muted/60 group-hover:bg-surface-overlay/80'
        )}
        style={{
          transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 100ms ease',
          transform: checked ? 'scale(1)' : 'scale(1)',
        }}
      >
        {(checked || indeterminate) && (
          <span className="flex items-center justify-center" style={{ animation: 'checkbox-pop 150ms ease-out' }}>
            {indeterminate ? (
              <Minus size={iconSizes[size] || 10} weight="bold" className="text-white" />
            ) : (
              <Check size={iconSizes[size] || 10} weight="bold" className="text-white" />
            )}
          </span>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        className="sr-only"
      />
      {label && (
        <span className={clsx(
          'text-text-secondary group-hover:text-text-primary transition-colors',
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-[13px]'
        )}>
          {label}
        </span>
      )}
      <style>{`
        @keyframes checkbox-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </label>
  );
}
