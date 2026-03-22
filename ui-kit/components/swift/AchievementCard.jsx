import { clsx } from 'clsx';
import { PushPin, Lock, Trophy, Star, Lightning, Diamond, Medal, Crown, Target, Gift } from '@phosphor-icons/react';

// Icon pool for achievements (instead of emojis)
const ACHIEVEMENT_ICONS = [Trophy, Star, Lightning, Diamond, Medal, Crown, Target, Gift];

/**
 * Single achievement tile. Uses Phosphor icons instead of emojis.
 */
export function AchievementCard({ title, subtitle, icon, iconIndex = 0, completed = false, pinned = false, onPin, onClick, className }) {
  const FallbackIcon = ACHIEVEMENT_ICONS[iconIndex % ACHIEVEMENT_ICONS.length];
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={clsx(
        'relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all text-center cursor-pointer',
        completed
          ? 'bg-surface-overlay hover:bg-surface-raised'
          : 'bg-surface-overlay/50 opacity-50 grayscale',
        className,
      )}
    >
      {/* Pin badge */}
      {completed && onPin && (
        <span
          onClick={(e) => { e.stopPropagation(); onPin?.(); }}
          className={clsx(
            'absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors z-10',
            pinned ? 'bg-accent text-white' : 'bg-surface-raised text-text-muted hover:text-accent',
          )}
        >
          <PushPin size={10} weight={pinned ? 'fill' : 'bold'} />
        </span>
      )}

      {/* Icon */}
      <div className={clsx(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        completed ? 'bg-accent/10 text-accent' : 'bg-surface-raised text-text-muted',
      )}>
        {icon || (completed ? <FallbackIcon size={18} weight="duotone" /> : <Lock size={16} />)}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-text-primary leading-tight">{title}</p>
        {subtitle && <p className="text-[9px] text-text-muted mt-0.5 leading-tight">{subtitle}</p>}
      </div>
    </div>
  );
}
