import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { User, Gear, SignOut } from '@phosphor-icons/react';

/**
 * Profile / account dropdown menu. Standalone, no auth dependencies.
 * Pass user data and handlers externally.
 *
 * @param {object}   user          - { name, email, avatar }
 * @param {Function} onEditProfile - Called when "Edit Profile" is clicked
 * @param {Function} onSettings    - Called when "Settings" is clicked
 * @param {Function} onSignOut     - Called when "Sign Out" is clicked
 * @param {string}   className     - Additional classes
 */
export function ProfileMenu({
  user = {},
  onEditProfile,
  onSettings,
  onSignOut,
  className,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();

  return (
    <div className={clsx('relative', className)} ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-surface-overlay transition-colors"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[10px] font-bold">
            {initial}
          </div>
        )}
        <span className="text-[11px] font-medium text-text-secondary max-w-[80px] truncate">
          {user.name || user.email || 'Account'}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-overlay overflow-hidden z-50 shadow-xl shadow-black/20 ring-1 ring-border-subtle"
        >
          {/* User info header */}
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-bold border border-accent/20">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{user.name || 'User'}</p>
                <p className="text-[10px] text-text-muted truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-2 pb-1.5">
            <button
              onClick={() => { setOpen(false); onEditProfile?.(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded-xl transition-colors text-left"
            >
              <User size={13} /> Edit Profile
            </button>
            <button
              onClick={() => { setOpen(false); onSettings?.(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded-xl transition-colors text-left"
            >
              <Gear size={13} /> Settings
            </button>
            <button
              onClick={() => { setOpen(false); onSignOut?.(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-danger hover:bg-danger/8 rounded-xl transition-colors text-left"
            >
              <SignOut size={13} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
