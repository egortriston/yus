import { useState, useCallback, useEffect, useRef } from 'react';

// ── Superellipse path generator ────────────────────────────────────
// Attempt to replicate the iOS 26 squircle with a parameterised
// superellipse (n = 3).  `smoothing` controls how far the curve
// extends beyond the nominal radius (0 = pure superellipse,
// 0.6 = Apple-like continuous curvature).

const STEPS = 16;          // points per corner arc
const N     = 3;            // superellipse exponent
const EXP   = 2 / N;       // pre-computed for the parametric formula

export function generateSquirclePath(w, h, radius, smoothing = 0.6) {
  if (w <= 0 || h <= 0) return '';

  const r = Math.min(radius, w / 2, h / 2);
  const a = Math.min(r * (1 + smoothing * 0.528), Math.min(w, h) / 2);

  function corner(cx, cy, fromAngle) {
    let d = '';
    for (let i = 0; i <= STEPS; i++) {
      const t = fromAngle + (i / STEPS) * (Math.PI / 2);
      const ct = Math.cos(t);
      const st = Math.sin(t);
      const x = cx + a * Math.sign(ct) * Math.pow(Math.abs(ct), EXP);
      const y = cy + a * Math.sign(st) * Math.pow(Math.abs(st), EXP);
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d;
  }

  return (
    `M${a.toFixed(1)},0` +
    ` L${(w - a).toFixed(1)},0` +
    corner(w - a, a, -Math.PI / 2) +          // top-right
    ` L${w.toFixed(1)},${(h - a).toFixed(1)}` +
    corner(w - a, h - a, 0) +                 // bottom-right
    ` L${a.toFixed(1)},${h.toFixed(1)}` +
    corner(a, h - a, Math.PI / 2) +           // bottom-left
    ` L0,${a.toFixed(1)}` +
    corner(a, a, Math.PI) +                   // top-left
    ' Z'
  );
}

// ── React hook ─────────────────────────────────────────────────────
// Returns [callbackRef, squircleStyle].
//
//   const [sqRef, sqStyle] = useSquircle(26);
//   <div ref={sqRef} className="rounded-2xl ..." style={{ ...otherStyles, ...sqStyle }}>
//
// When the clip-path is not yet computed (pre-mount) the style object
// is empty, so the CSS `rounded-*` class acts as a natural fallback.

export function useSquircle(radius = 24, smoothing = 0.6) {
  const [clipPath, setClipPath] = useState('');
  const elRef       = useRef(null);
  const observerRef = useRef(null);
  const radiusRef   = useRef(radius);
  const smoothRef   = useRef(smoothing);

  // Keep refs in sync so the ResizeObserver callback always uses
  // the latest values without needing to re-create the observer.
  radiusRef.current = radius;
  smoothRef.current = smoothing;

  const update = useCallback(() => {
    const el = elRef.current;
    if (!el) { setClipPath(''); return; }
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const path = generateSquirclePath(w, h, radiusRef.current, smoothRef.current);
    setClipPath(path ? `path('${path}')` : '');
  }, []);

  // Callback ref -- wire up / tear down the ResizeObserver when the
  // element mounts or changes.
  const setRef = useCallback((el) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    elRef.current = el;
    if (el) {
      // Initial measurement
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      observerRef.current = ro;
    }
  }, [update]);

  // Safety net: disconnect on unmount even if the element ref was
  // never set to null (e.g. parent un-renders without clearing ref).
  useEffect(() => () => {
    if (observerRef.current) observerRef.current.disconnect();
  }, []);

  const style = clipPath ? { clipPath, borderRadius: 0 } : {};
  return [setRef, style];
}
