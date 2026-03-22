import { clsx } from 'clsx';
import { GemIcon } from './SwiftIcons.jsx';
import { Check } from '@phosphor-icons/react';

/**
 * 7-day check-in grid matching SwiftGifts app style.
 * Uses theme colors, no emojis.
 */
export function CheckInBonus({ currentDay = 0, rewards = [], claimed = [], onClaim, className }) {
  const days = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    reward: rewards[i] || (i + 1) * 10,
    isClaimed: claimed[i] || false,
    isCurrent: i === currentDay,
    isAvailable: i <= currentDay,
  }));

  return (
    <div className={clsx('rounded-2xl bg-surface-overlay p-3', className)}>
      <h3 className="text-sm font-semibold text-text-primary mb-3 font-mono">Daily Bonus</h3>

      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <div
            key={d.day}
            className={clsx(
              'flex flex-col items-center gap-1',
              !d.isAvailable && !d.isClaimed && 'opacity-40',
            )}
          >
            {/* Cell */}
            <div
              className={clsx(
                'w-full aspect-square p-1 rounded-lg flex items-center justify-center transition-all',
              )}
              style={{
                backgroundColor: d.isCurrent && !d.isClaimed && d.isAvailable
                  ? 'var(--color-surface-raised)'
                  : 'var(--color-surface)',
              }}
            >
              {d.isClaimed ? (
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00B843' }}>
                  <Check size={12} weight="bold" className="text-white" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <GemIcon size={16} className={d.isAvailable ? 'text-accent' : 'text-text-muted'} />
                  <span
                    className={clsx(
                      'text-[10px] font-medium leading-none tabular-nums font-mono',
                      d.isAvailable ? 'text-text-primary' : 'text-text-muted',
                    )}
                  >
                    {d.reward}
                  </span>
                </div>
              )}
            </div>

            {/* Day label */}
            <span className={clsx(
              'text-[10px] leading-tight font-mono',
              (d.isAvailable || d.isClaimed) ? 'text-text-primary' : 'text-text-muted',
            )}>
              Day {d.day}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onClaim}
        disabled={days[currentDay]?.isClaimed}
        className={clsx(
          'w-full mt-3 py-2 rounded-xl text-xs font-semibold transition-all',
          days[currentDay]?.isClaimed
            ? 'bg-surface-raised text-text-muted cursor-not-allowed opacity-50'
            : 'bg-accent text-white hover:brightness-110',
        )}
      >
        {days[currentDay]?.isClaimed ? 'Already Claimed' : `Claim Day ${currentDay + 1}`}
      </button>
    </div>
  );
}
