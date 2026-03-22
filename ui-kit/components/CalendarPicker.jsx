import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CaretRight, CalendarBlank } from '@phosphor-icons/react';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function sameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(d) {
  return sameDay(d, new Date());
}

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let startDay = (first.getDay() + 6) % 7;
  const days = [];
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, outside: true });
  }
  for (let i = 1; i <= last.getDate(); i++) {
    days.push({ date: new Date(year, month, i), outside: false });
  }
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - last.getDate() - startDay + 1);
    days.push({ date: d, outside: true });
  }
  return days;
}

/**
 * Custom calendar date picker.
 * Supports single date selection with month/year quick navigation.
 *
 * onChange receives a Date object (or null on clear).
 */
export function CalendarPicker({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  className = '',
  clearable = true,
}) {
  const selectedDate = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    const d = new Date(value + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => selectedDate?.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDate?.getMonth() ?? new Date().getMonth());
  // 'days' | 'months' | 'years'
  const [viewMode, setViewMode] = useState('days');
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  // Years grid: show a range around the current view year
  const yearsRange = useMemo(() => {
    const base = Math.floor(viewYear / 12) * 12;
    return Array.from({ length: 12 }, (_, i) => base + i);
  }, [viewYear]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popW = 280, popH = 360;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < popH && rect.top > popH ? rect.top - popH - 4 : rect.bottom + 6;
    const left = Math.min(rect.left, window.innerWidth - popW - 16);
    setPos({ top, left: Math.max(8, left) });
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

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleSelect = (d) => {
    onChange?.(d);
    setOpen(false);
    setViewMode('days');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const displayValue = selectedDate
    ? `${MONTHS[selectedDate.getMonth()].slice(0, 3)} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : null;

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open && selectedDate) {
            setViewYear(selectedDate.getFullYear());
            setViewMonth(selectedDate.getMonth());
          }
          setViewMode('days');
          setOpen(v => !v);
        }}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border-subtle bg-surface-overlay hover:border-border transition-colors w-full text-left"
      >
        <CalendarBlank size={14} className="text-text-muted shrink-0" />
        <span className={`text-[11px] flex-1 ${displayValue ? 'text-text-primary' : 'text-text-muted'}`}>
          {displayValue || placeholder}
        </span>
        {clearable && value && (
          <span
            onClick={handleClear}
            className="text-text-muted hover:text-text-secondary text-[10px] px-1"
          >
            Clear
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-9999 w-[280px] rounded-2xl bg-surface-raised p-4"
          style={{ top: pos.top, left: pos.left, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.4))', animation: 'dropdown-in 120ms ease-out both' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            {viewMode === 'days' && (
              <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-text-primary transition-colors">
                <CaretLeft size={14} weight="bold" />
              </button>
            )}
            {viewMode === 'years' && (
              <button type="button" onClick={() => setViewYear(y => y - 12)} className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-text-primary transition-colors">
                <CaretLeft size={14} weight="bold" />
              </button>
            )}
            {viewMode === 'months' && <div className="w-8" />}

            <button
              type="button"
              onClick={() => {
                if (viewMode === 'days') setViewMode('months');
                else if (viewMode === 'months') setViewMode('years');
                else setViewMode('days');
              }}
              className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors px-2 py-0.5 rounded-lg hover:bg-surface-overlay"
            >
              {viewMode === 'years'
                ? `${yearsRange[0]} - ${yearsRange[yearsRange.length - 1]}`
                : viewMode === 'months'
                ? viewYear
                : `${MONTHS[viewMonth]} ${viewYear}`
              }
            </button>

            {viewMode === 'days' && (
              <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-text-primary transition-colors">
                <CaretRight size={14} weight="bold" />
              </button>
            )}
            {viewMode === 'years' && (
              <button type="button" onClick={() => setViewYear(y => y + 12)} className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-text-primary transition-colors">
                <CaretRight size={14} weight="bold" />
              </button>
            )}
            {viewMode === 'months' && <div className="w-8" />}
          </div>

          {/* Years grid */}
          {viewMode === 'years' && (
            <div className="grid grid-cols-3 gap-1.5">
              {yearsRange.map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => { setViewYear(y); setViewMode('months'); }}
                  className={`py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                    y === viewYear ? 'bg-accent text-white' : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
                  } ${y === new Date().getFullYear() && y !== viewYear ? 'ring-1 ring-accent/40 text-accent' : ''}`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Months grid */}
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setViewMonth(i); setViewMode('days'); }}
                  className={`py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                    i === viewMonth ? 'bg-accent text-white' : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
                  } ${i === new Date().getMonth() && viewYear === new Date().getFullYear() && i !== viewMonth ? 'ring-1 ring-accent/40 text-accent' : ''}`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Days view */}
          {viewMode === 'days' && (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[9px] font-semibold text-text-muted uppercase py-1">{d}</div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {days.map(({ date, outside }, i) => {
                  const sel = sameDay(date, selectedDate);
                  const today = isToday(date);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(date)}
                      className={`
                        w-full aspect-square rounded-lg text-[11px] font-medium transition-all
                        flex items-center justify-center
                        ${outside ? 'text-text-muted/30 hover:text-text-muted/60 hover:bg-surface-overlay/40' : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'}
                        ${sel ? 'bg-accent text-white hover:bg-accent-hover hover:text-white' : ''}
                        ${today && !sel ? 'ring-1 ring-accent/40 text-accent' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Today shortcut */}
              <div className="mt-3 pt-2.5 border-t border-border-subtle/60 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleSelect(new Date())}
                  className="text-[10px] font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  Today
                </button>
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
