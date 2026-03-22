import { clsx } from 'clsx';

/**
 * Transaction history grouped by date.
 * @param {{ date: string, items: { id: string, title: string, txId: string, status: 'success'|'rejected'|'pending', image?: string }[] }[]} groups
 */
export function TransactionHistory({ groups = [], className }) {
  const statusStyles = {
    success: 'bg-[#00B843]/15 text-[#00B843]',
    rejected: 'bg-[#DD2728]/15 text-[#DD2728]',
    pending: 'bg-[#FED813]/15 text-[#FED813]',
  };

  return (
    <div className={clsx('space-y-3', className)}>
      {groups.map(group => (
        <div key={group.date} className="rounded-2xl bg-surface-overlay overflow-hidden">
          <div className="px-4 py-2 border-b border-border-subtle">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{group.date}</span>
          </div>
          <div className="divide-y divide-border-subtle/50">
            {group.items.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-2.5">
                {tx.image ? (
                  <img src={tx.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-surface-raised" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-text-muted text-xs font-bold">
                    {tx.title.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{tx.title}</p>
                  <p className="text-[10px] text-text-muted font-mono truncate">{tx.txId}</p>
                </div>
                <span className={clsx(
                  'text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0',
                  statusStyles[tx.status] || statusStyles.pending,
                )}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
