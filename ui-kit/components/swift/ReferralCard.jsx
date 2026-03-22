import { clsx } from 'clsx';
import { TonIcon, GemIcon } from './SwiftIcons.jsx';
import { Users, Copy, Share } from '@phosphor-icons/react';

/**
 * Referral stats card.
 * @param {number} earnedTon
 * @param {number} earnedDiamonds
 * @param {number} invitedCount
 * @param {number} badgeProgress - 0 to 1
 * @param {string} referralCode
 * @param {Function} onInvite
 * @param {Function} onCopy
 */
export function ReferralCard({ earnedTon = 0, earnedDiamonds = 0, invitedCount = 0, badgeProgress = 0, referralCode, onInvite, onCopy, className }) {
  return (
    <div className={clsx('rounded-2xl bg-surface-overlay p-4', className)}>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Referral Program</h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-surface-raised">
          <TonIcon size={14} />
          <span className="text-sm font-bold text-text-primary tabular-nums">{earnedTon}</span>
          <span className="text-[9px] text-text-muted">Earned</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-surface-raised">
          <GemIcon size={14} className="text-accent" />
          <span className="text-sm font-bold text-text-primary tabular-nums">{earnedDiamonds}</span>
          <span className="text-[9px] text-text-muted">Diamonds</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-surface-raised">
          <Users size={14} className="text-accent" />
          <span className="text-sm font-bold text-text-primary tabular-nums">{invitedCount}</span>
          <span className="text-[9px] text-text-muted">Invited</span>
        </div>
      </div>

      {/* Badge progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-text-muted">Next badge</span>
          <span className="text-text-secondary font-medium tabular-nums">{Math.round(badgeProgress * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${badgeProgress * 100}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onInvite} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:brightness-110 transition-all">
          <Share size={14} weight="bold" />
          Invite Friends
        </button>
        <button onClick={onCopy} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-raised text-text-secondary text-xs font-medium hover:text-text-primary transition-colors">
          <Copy size={14} />
          {referralCode || 'Copy'}
        </button>
      </div>
    </div>
  );
}
