import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { CaretDown, Check } from '@phosphor-icons/react';

/**
 * Dropdown button for filter options.
 * @param {{ id: string, label: string }[]} options
 * @param {string} value - currently selected option id
 * @param {Function} onChange
 */
export function FilterDropdown({ options = [], value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={clsx('relative', className)} ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-overlay text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        {selected?.label || 'All'}
        <CaretDown size={10} weight="bold" className={clsx('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-40 rounded-xl bg-surface-overlay shadow-xl shadow-black/20 ring-1 ring-border-subtle overflow-hidden z-50">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange?.(opt.id); setOpen(false); }}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left',
                value === opt.id ? 'text-accent bg-accent/8' : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised',
              )}
            >
              {opt.label}
              {value === opt.id && <Check size={12} weight="bold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
