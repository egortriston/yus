import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

const GAP = 8;

/**
 * Tooltip that renders in document.body so it is never clipped by overflow.
 */
export function Tooltip({
  children,
  content,
  position = 'bottom',
  delay = 300,
  className,
}) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !bubbleRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const tip = bubbleRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = trigger.left + trigger.width / 2 - tip.width / 2;
    let top = position === 'top' ? trigger.top - tip.height - GAP : trigger.bottom + GAP;
    if (position === 'left') {
      left = trigger.left - tip.width - GAP;
      top = trigger.top + trigger.height / 2 - tip.height / 2;
    } else if (position === 'right') {
      left = trigger.right + GAP;
      top = trigger.top + trigger.height / 2 - tip.height / 2;
    }
    if (left < GAP) left = GAP;
    if (left + tip.width > vw - GAP) left = vw - tip.width - GAP;
    if (top < GAP) top = GAP;
    if (top + tip.height > vh - GAP) top = vh - tip.height - GAP;
    setCoords({ left, top });
  }, [position]);

  function show() {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(updatePosition);
    }, delay);
  }

  function hide() {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });
    return () => cancelAnimationFrame(id);
  }, [visible, updatePosition]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <>
      <div
        ref={triggerRef}
        className={clsx('relative inline-flex', className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {visible && content && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={bubbleRef}
            role="tooltip"
            className={clsx(
              'fixed z-[99999] px-2.5 py-1.5 rounded-lg text-[11px] font-medium',
              'bg-surface-raised text-text-secondary border border-border',
              'whitespace-normal max-w-xs pointer-events-none',
              'shadow-lg'
            )}
            style={{ left: coords.left, top: coords.top }}
          >
            {content}
          </div>,
          document.body
        )
      }
    </>
  );
}
