import { useState } from 'react';
import { clsx } from 'clsx';
import { X } from '@phosphor-icons/react';
import { AchievementCard } from './AchievementCard.jsx';
import { SegmentedControl } from './SegmentedControl.jsx';

const TABS = [
  { id: 'pinned', label: 'Pinned' },
  { id: 'friends', label: 'Friends' },
  { id: 'activity', label: 'Activity' },
  { id: 'crystals', label: 'Crystals' },
  { id: 'milestones', label: 'Milestones' },
];

/**
 * Achievements modal with tab switcher and grid of achievement cards.
 * @param {boolean} open
 * @param {Function} onClose
 * @param {{ id: string, title: string, subtitle: string, icon?: React.ReactNode, completed: boolean, pinned?: boolean, category: string }[]} achievements
 * @param {Function} onPin
 */
export function AchievementsModal({ open, onClose, achievements = [], onPin }) {
  const [tab, setTab] = useState('pinned');

  if (!open) return null;

  const filtered = tab === 'pinned'
    ? achievements.filter(a => a.pinned)
    : achievements.filter(a => a.category === tab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[80vh] rounded-2xl bg-surface-raised shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-sm font-bold text-text-primary">Achievements</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-surface-overlay text-text-muted hover:text-text-primary flex items-center justify-center transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3 overflow-x-auto scrollbar-none">
          <SegmentedControl segments={TABS} value={tab} onChange={setTab} />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filtered.map((a, i) => (
                <AchievementCard
                  key={a.id}
                  title={a.title}
                  subtitle={a.subtitle}
                  iconIndex={a.iconIndex ?? i}
                  completed={a.completed}
                  pinned={a.pinned}
                  onPin={() => onPin?.(a.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[11px] text-text-muted">
              {tab === 'pinned' ? 'No pinned achievements yet' : 'No achievements in this category'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
