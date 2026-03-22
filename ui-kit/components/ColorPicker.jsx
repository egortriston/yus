import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Eyedropper } from '@phosphor-icons/react';

/**
 * Custom color picker with a swatch grid, hue slider, and hex input.
 * Replaces the native <input type="color"> with a designed component.
 */

const PRESET_COLORS = [
  '#ffffff', '#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373',
  '#525252', '#262626', '#171717', '#0a0a0a', '#000000',
  '#ff6b35', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#78716c',
  '#1a8068', '#c27040', '#c99435', '#4d9ecf', '#7c3aed',
];

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function ColorPicker({
  value = '#ff6b35',
  onChange,
  label,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const [hueValue, setHueValue] = useState(() => hexToHsl(value)[0]);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setHex(value);
    setHueValue(hexToHsl(value)[0]);
  }, [value]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popW = 260;
    const left = Math.min(rect.left, window.innerWidth - popW - 16);
    setPos({ top: rect.bottom + 6, left: Math.max(8, left) });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    function handleClick(e) {
      if (triggerRef.current?.contains(e.target)) return;
      if (popoverRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  const commit = useCallback((color) => {
    setHex(color);
    setHueValue(hexToHsl(color)[0]);
    onChange?.(color);
  }, [onChange]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">{label}</label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-overlay/60 hover:bg-surface-overlay transition-colors w-full focus:outline-none"
      >
        <div
          className="w-5 h-5 rounded-lg shrink-0 ring-1 ring-black/10"
          style={{ backgroundColor: hex }}
        />
        <span className="text-[11px] font-mono text-text-secondary flex-1 text-left">{hex}</span>
        <Eyedropper size={12} className="text-text-muted shrink-0" />
      </button>

      {open && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-9999 w-[260px] rounded-2xl bg-surface-raised p-4 space-y-3"
          style={{ top: pos.top, left: pos.left, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.4))', animation: 'dropdown-in 120ms ease-out both' }}
        >
          {/* Swatch grid */}
          <div className="grid grid-cols-10 gap-1.5">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => commit(c)}
                className={`w-5 h-5 rounded-md transition-transform hover:scale-125 ${hex.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface-raised scale-110' : ''} ${c === '#ffffff' || c === '#f5f5f5' ? 'ring-1 ring-black/10' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Hue slider */}
          <div>
            <input
              type="range"
              min={0}
              max={359}
              value={hueValue}
              onChange={(e) => {
                const newHue = parseInt(e.target.value);
                setHueValue(newHue);
                const [, s, l] = hexToHsl(hex);
                commit(hslToHex(newHue, Math.max(s, 50), Math.max(Math.min(l, 70), 30)));
              }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
              }}
            />
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg shrink-0 ring-1 ring-black/10"
              style={{ backgroundColor: hex }}
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => {
                const v = e.target.value;
                setHex(v);
                if (/^#[0-9a-fA-F]{6}$/.test(v)) commit(v);
              }}
              onBlur={() => {
                if (!/^#[0-9a-fA-F]{6}$/.test(hex)) setHex(value);
              }}
              className="flex-1 px-2.5 py-1.5 text-[11px] font-mono rounded-lg bg-surface-overlay border border-border-subtle text-text-primary focus:outline-none focus:border-accent/40"
              maxLength={7}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
