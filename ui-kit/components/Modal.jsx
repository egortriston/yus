import { useEffect, useRef, useCallback, Children, isValidElement } from 'react';
import { clsx } from 'clsx';
import { X } from '@phosphor-icons/react';
import { useSquircle } from '../hooks/useSquircle.js';

/**
 * Accessible modal overlay with focus trap and escape-to-close.
 */
export function Modal({
  open,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className,
  hideClose = false,
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [squircleRef, squircleStyle] = useSquircle(32);
  // Merge panelRef (for focus management) with squircle callback ref
  const combinedRef = useCallback((el) => {
    panelRef.current = el;
    squircleRef(el);
  }, [squircleRef]);
  // Store onClose in a ref so the effect never re-runs when the parent
  // passes a new inline handler (which would steal focus from inputs).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;

    const raf = requestAnimationFrame(() => {
      if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
        panelRef.current.focus();
      }
    });

    function handleKey(e) {
      if (e.key === 'Escape') onCloseRef.current?.();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open]); // Only depend on open, NOT onClose

  if (!open) return null;

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size] || 'max-w-lg';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-hidden"
      style={{ minHeight: '100dvh' }}
      onClick={(e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onCloseRef.current?.(); }}
    >
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-panel-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" style={{ animation: 'modal-fade-in 150ms ease-out both', minHeight: '100dvh' }} />

      {/* Panel */}
      <div
        ref={combinedRef}
        tabIndex={-1}
        className={clsx(
          'relative w-full rounded-2xl bg-surface-raised shadow-2xl shadow-black/40',
          'outline-none',
          'max-h-[90vh] flex flex-col',
          sizeClass,
          className
        )}
        style={{ ...squircleStyle, animation: 'modal-panel-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-0 shrink-0">
            <div>
              {title && (
                <h2 className="text-base font-semibold text-text-primary">{title}</h2>
              )}
              {description && (
                <p className="text-xs text-text-muted mt-1">{description}</p>
              )}
            </div>
            {onClose && !hideClose && (
              <button
                onClick={onClose}
                className="p-1 -m-1 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>
        )}

        {/* Body -- scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
          {Children.toArray(children).filter(c => !(isValidElement(c) && c.type === ModalFooter))}
        </div>

        {/* Footer -- pinned at bottom */}
        {Children.toArray(children).filter(c => isValidElement(c) && c.type === ModalFooter)}
      </div>
    </div>
  );
}

/**
 * Modal footer with right-aligned actions.
 * Now sits at the bottom of the flex column, outside the scrollable body.
 */
export function ModalFooter({ children, className }) {
  return (
    <div className={clsx(
      'px-6 py-3.5 border-t border-border-subtle bg-surface-overlay/30 flex items-center justify-end gap-2 shrink-0',
      className
    )}>
      {children}
    </div>
  );
}
