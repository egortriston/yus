import { useState, useEffect } from 'react';
import { Check, Compass, UserCircle, Palette } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Modal, Button, ColorPicker } from './ui/index.js';
import { toast } from 'sonner';

const WELCOME_KEY = 'alexbot-welcomed';

export function WelcomeModal() {
  const { user, authenticated, updateProfile } = useAuth();
  const { themeId, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authenticated || !user) return;
    const welcomed = localStorage.getItem(WELCOME_KEY);
    // Re-show if never welcomed OR if user has no name set (left early)
    if (!welcomed || !user.name) {
      setOpen(true);
      setName(user.name || '');
    }
  }, [authenticated, user]);

  const handleFinish = async (startTour = false) => {
    setSaving(true);
    try {
      const updates = {};
      if (name.trim() && name.trim() !== user?.name) updates.name = name.trim();
      if (Object.keys(updates).length > 0) await updateProfile(updates);
      localStorage.setItem(WELCOME_KEY, 'true');
      setOpen(false);
      if (startTour) {
        // Small delay so modal closes first
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('alexbot-start-tour'));
        }, 300);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={() => { localStorage.setItem(WELCOME_KEY, 'true'); setOpen(false); }} size="md">
      <div className="text-center space-y-5 pt-2">
        {/* Waving hand */}
        <div className="text-5xl select-none" style={{ animation: 'wave 1.5s ease-in-out infinite', transformOrigin: '70% 70%', display: 'inline-block' }}>
          <span role="img" aria-label="wave">&#x1F44B;</span>
        </div>
        <style>{`
          @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>

        <div>
          <h2 className="text-xl font-bold text-text-primary">Welcome to alexbot</h2>
          <p className="text-sm text-text-muted mt-1">Let's personalize your experience</p>
        </div>

        {/* Name input */}
        <div className="text-left">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">What should we call you?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl bg-surface-overlay border border-border-subtle text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>

        {/* Status / description */}
        <div className="text-left">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Set a status <span className="text-text-muted font-normal">(optional)</span></label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="e.g. Building something amazing..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface-overlay border border-border-subtle text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>

        {/* Theme selection */}
        <div className="text-left">
          <label className="block text-xs font-medium text-text-secondary mb-2">Pick a color theme</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(themes).filter(t => !t.isCustom).map((theme) => {
              const active = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`flex flex-col gap-2 p-3 rounded-2xl text-left transition-all ${
                    active
                      ? 'ring-2 ring-accent/40 bg-accent/5'
                      : 'bg-surface-overlay/50 hover:bg-surface-overlay'
                  }`}
                >
                  <div className="flex shrink-0 -space-x-1">
                    <div className="w-4 h-4 rounded-full border-2 border-surface-raised"
                      style={{ background: theme.vars['--color-surface'] }} />
                    <div className="w-4 h-4 rounded-full border-2 border-surface-raised"
                      style={{ background: theme.vars['--color-accent'] }} />
                    <div className="w-4 h-4 rounded-full border-2 border-surface-raised"
                      style={{ background: theme.vars['--color-text-primary'] }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-text-primary">{theme.name}</span>
                    {active && <Check size={9} weight="bold" className="text-accent" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom accent color */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle/40">
            <Palette size={13} className="text-text-muted shrink-0" />
            <span className="text-[10px] text-text-muted">or pick a custom accent:</span>
            <div className="flex-1">
              <ColorPicker
                value={themes[themeId]?.vars?.['--color-accent'] || '#ff6b35'}
                onChange={(color) => {
                  // Apply accent color as CSS variable override
                  document.documentElement.style.setProperty('--color-accent', color);
                }}
              />
            </div>
          </div>
        </div>

        {/* Two action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleFinish(true)}
            disabled={saving}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-accent/8 border border-accent/20 hover:bg-accent/12 transition-all group"
          >
            <Compass size={20} weight="duotone" className="text-accent" />
            <span className="text-xs font-semibold text-accent">Guide me through</span>
            <span className="text-[10px] text-text-muted">Interactive walkthrough</span>
          </button>
          <button
            onClick={() => handleFinish(false)}
            disabled={saving}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-overlay/60 hover:bg-surface-overlay transition-all group"
          >
            <UserCircle size={20} weight="duotone" className="text-text-secondary" />
            <span className="text-xs font-semibold text-text-primary">I'll figure it out</span>
            <span className="text-[10px] text-text-muted">Skip the tour</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
