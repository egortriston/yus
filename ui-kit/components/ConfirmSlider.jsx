import { useState, useRef, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';

/**
 * Slide-to-confirm interaction. User drags a handle to the right to trigger confirmation.
 * Theme-aware with accent/danger color variants.
 * Fill only appears while holding, tracking the knob center with a soft edge.
 * Label text is masked by the fill rather than switching color.
 *
 * @param {string}   label      - Text shown inside the slider track
 * @param {'accent'|'danger'} variant - Color variant (default: accent)
 * @param {boolean}  disabled   - Disable interaction
 * @param {number}   threshold  - Percent to confirm (default 70)
 * @param {Function} onConfirm  - Called when slider reaches threshold
 * @param {string}   className  - Additional classes
 */
export function ConfirmSlider({
  label = 'Slide to confirm',
  variant = 'accent',
  disabled = false,
  threshold = 70,
  onConfirm,
  className,
}) {
  const trackRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const [holding, setHolding] = useState(false);
  const sliding = useRef(false);
  const confirmed = useRef(false);
  const percentRef = useRef(0);
  const activePointerId = useRef(null);
  // Keep stable refs for the callback to avoid stale closures
  const thresholdRef = useRef(threshold);
  const onConfirmRef = useRef(onConfirm);
  thresholdRef.current = threshold;
  onConfirmRef.current = onConfirm;

  const isAccent = variant !== 'danger';

  const computePercent = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(clientX, rect.right));
    return Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
  }, []);

  const doEnd = useCallback(() => {
    if (!sliding.current) return;
    sliding.current = false;
    activePointerId.current = null;

    if (percentRef.current >= thresholdRef.current && !confirmed.current) {
      confirmed.current = true;
      percentRef.current = 100;
      setPercent(100);
      onConfirmRef.current?.();
      setTimeout(() => {
        setHolding(false);
        setTimeout(() => {
          confirmed.current = false;
          percentRef.current = 0;
          setPercent(0);
        }, 150);
      }, 500);
    } else {
      setHolding(false);
      percentRef.current = 0;
      setPercent(0);
    }
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (disabled || confirmed.current || sliding.current) return;
    sliding.current = true;
    activePointerId.current = e.pointerId;
    setHolding(true);

    trackRef.current?.setPointerCapture(e.pointerId);

    const p = computePercent(e.clientX);
    percentRef.current = p;
    setPercent(p);
  }, [disabled, computePercent]);

  const handlePointerMove = useCallback((e) => {
    if (!sliding.current || e.pointerId !== activePointerId.current) return;
    const p = computePercent(e.clientX);
    percentRef.current = p;
    setPercent(p);
  }, [computePercent]);

  const handlePointerUp = useCallback((e) => {
    if (e.pointerId !== activePointerId.current) return;
    doEnd();
  }, [doEnd]);

  const handlePointerCancel = useCallback((e) => {
    if (e.pointerId !== activePointerId.current) return;
    doEnd();
  }, [doEnd]);

  // Handle dimensions -- smaller on narrow viewports
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const handleW = isMobile ? 56 : 72;
  const handleH = isMobile ? 38 : 44;
  const padding = 4;

  // Compute handle position (px)
  const handleLeft = (() => {
    const el = trackRef.current;
    if (!el) {
      const fallbackW = 300;
      const pos = (percent / 100) * fallbackW;
      return Math.max(padding, Math.min(fallbackW - handleW - padding, pos));
    }
    const w = el.clientWidth;
    const pos = (percent / 100) * w;
    return Math.max(padding, Math.min(w - handleW - padding, pos));
  })();

  const knobCenter = handleLeft + handleW / 2;
  const isConfirmed = confirmed.current && percent === 100;
  const displayLabel = percent >= threshold ? 'Release' : label;

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={clsx(
        'relative w-full h-[46px] sm:h-[52px] rounded-full overflow-hidden select-none touch-none',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-grab active:cursor-grabbing',
        className,
      )}
    >
      {/* Background */}
      <div className={clsx('absolute inset-0', isAccent ? 'bg-accent/15' : 'bg-danger/15')} />

      {/* Fill -- only visible while holding, right edge tracks knob center; fills 100% on confirm */}
      <div
        className={clsx('absolute top-0 left-0 bottom-0 pointer-events-none', isAccent ? 'bg-accent' : 'bg-danger')}
        style={{
          width: isConfirmed ? '100%' : !holding ? '0px' : `${knobCenter}px`,
          opacity: (holding || isConfirmed) ? 1 : 0,
          transition: isConfirmed
            ? 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 120ms ease-out'
            : holding
              ? 'width 40ms linear, opacity 120ms ease-out'
              : 'width 250ms ease-in, opacity 200ms ease-in',
          ...(isConfirmed ? {} : {
            maskImage: 'linear-gradient(to right, black calc(100% - 14px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 14px), transparent 100%)',
          }),
        }}
      />

      {/* Label -- base color (visible where fill hasn't covered) */}
      <div className={clsx(
        'absolute inset-0 flex items-center justify-center pointer-events-none text-sm font-semibold tracking-wide',
        isAccent ? 'text-accent' : 'text-danger',
      )}>
        {displayLabel}
      </div>

      {/* Label -- white layer (clipped to fill so it reveals as knob moves right) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-sm font-semibold tracking-wide text-white"
        style={{
          clipPath: isConfirmed
            ? 'inset(0 0% 0 0)'
            : !holding
              ? 'inset(0 100% 0 0)'
              : `inset(0 calc(100% - ${knobCenter}px) 0 0)`,
          transition: isConfirmed
            ? 'clip-path 300ms cubic-bezier(0.4, 0, 0.2, 1)'
            : holding
              ? 'clip-path 40ms linear'
              : 'clip-path 250ms ease-in',
        }}
      >
        {displayLabel}
      </div>

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-[22px] bg-white pointer-events-none"
        style={{
          left: `${handleLeft}px`,
          width: `${handleW}px`,
          height: `${handleH}px`,
          boxShadow: '0 0 0 0.5px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.18)',
          transition: holding
            ? 'left 40ms linear'
            : 'left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className="text-black/30">
            <path d="M11 1l6 6-6 6M1 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
