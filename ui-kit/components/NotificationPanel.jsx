import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Bell, X } from '@phosphor-icons/react';

/**
 * Notification dropdown panel. Standalone, no socket/API dependencies.
 * Pass notifications array and handlers externally.
 *
 * @param {Array}    notifications - Array of { id, type, title, detail, time }
 * @param {Function} onDismiss     - Called with notification id
 * @param {Function} onClearAll    - Called to clear all notifications
 * @param {string}   className     - Additional classes on the wrapper
 */

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const typeColors = {
  task: 'bg-info',
  success: 'bg-success',
  error: 'bg-danger',
  warning: 'bg-warning',
  agent: 'bg-purple',
  invite: 'bg-accent',
};


export function NotificationPanel({
  notifications = [],
  onDismiss,
  onClearAll,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.length);
  const ref = useRef(null);

  useEffect(() => {
    setUnread(notifications.length);
  }, [notifications.length]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={clsx('relative', className)} ref={ref}>
      {/* Bell trigger */}
      <button
        onClick={() => { setOpen(v => !v); setUnread(0); }}
        className="relative p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors"
      >
        <Bell size={17} weight={unread > 0 ? 'fill' : 'regular'} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-accent text-white text-[9px] font-bold tabular-nums">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-surface-overlay overflow-hidden z-50 shadow-xl shadow-black/20 ring-1 ring-border-subtle"
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-raised/50">
            <span className="text-xs font-semibold text-text-primary">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={() => { onClearAll?.(); }}
                className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell size={20} className="text-text-muted mx-auto mb-1.5" />
                <p className="text-[11px] text-text-muted">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-surface-overlay/50 transition-colors group"
                >
                  <span className={clsx(
                    'mt-1.5 w-2.5 h-2.5 rounded-full shrink-0',
                    typeColors[n.type] || typeColors.task,
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-primary truncate">{n.title}</span>
                      <span className="text-[10px] text-text-muted shrink-0 tabular-nums">{formatTime(n.time)}</span>
                    </div>
                    {n.detail && (
                      <p className="text-[11px] text-text-muted truncate mt-0.5">{n.detail}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDismiss?.(n.id); }}
                    className="p-0.5 text-text-muted hover:text-text-secondary sm:opacity-0 sm:group-hover:opacity-100 transition-all shrink-0"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
