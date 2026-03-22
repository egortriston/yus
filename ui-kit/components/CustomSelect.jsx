import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CaretDown, Check } from '@phosphor-icons/react';

/**
 * Custom CSS dropdown replacing native <select> on all platforms.
 * Uses a portal so the menu never clips inside modals or scrollable containers.
 * Matches the profile popup / notification panel design language.
 */
export function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className = '',
  size = 'md',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const selected = options.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && ref.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Position the menu whenever it opens or viewport scrolls/resizes
  const updatePosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = 240;
    const openAbove = spaceBelow < menuHeight && rect.top > menuHeight;
    setMenuPos({
      top: openAbove ? rect.top - Math.min(menuHeight, rect.top - 8) : rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 180),
      openAbove,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs'
    : 'px-3 py-2 text-sm';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-2 ${sizeClasses} rounded-xl bg-surface-overlay/60 text-text-primary hover:bg-surface-overlay transition-colors focus:outline-none`}
      >
        <span className={selected ? 'truncate' : 'text-text-muted truncate'}>
          {selected?.label || placeholder}
        </span>
        <CaretDown
          size={11}
          className={`text-text-muted shrink-0 mr-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="fixed z-9999 rounded-2xl bg-surface-raised overflow-hidden"
          style={{
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.4))',
            animation: 'dropdown-in 120ms ease-out both',
          }}
        >
          <div className="py-1.5 max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-3 text-[11px] text-text-muted/60 text-center">
                No options available
              </div>
            ) : options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors rounded-lg mx-0 flex items-center justify-between ${
                  String(opt.value) === String(value)
                    ? 'text-accent bg-accent/8'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay/60'
                }`}
                style={{ margin: '0 6px', width: 'calc(100% - 12px)' }}
              >
                <span>{opt.label}</span>
                {String(opt.value) === String(value) && (
                  <Check size={10} weight="bold" className="text-accent shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
