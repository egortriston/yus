import { clsx } from 'clsx';
import { TonIcon } from './SwiftIcons.jsx';

/**
 * Whale/transaction data table.
 * @param {{ address: string, amount: number, side: 'buy'|'sell', collection: string, time: string }[]} data
 * @param {boolean} hasMore
 * @param {Function} onShowMore
 * @param {string} title
 */
export function TransactionTable({ data = [], hasMore = false, onShowMore, title, className }) {
  return (
    <div className={clsx('rounded-2xl bg-surface-overlay overflow-hidden', className)}>
      {title && (
        <div className="px-4 py-2.5 border-b border-border-subtle">
          <h3 className="text-xs font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-xs" style={{ minWidth: 480 }}>
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider w-8">#</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Address</th>
              <th className="px-3 py-2 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Amount</th>
              <th className="px-3 py-2 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">Side</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Collection</th>
              <th className="px-3 py-2 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {data.map((tx, i) => (
              <tr key={i} className="hover:bg-surface-raised/50 transition-colors">
                <td className="px-3 py-2 text-text-muted tabular-nums">{i + 1}</td>
                <td className="px-3 py-2 text-text-primary font-mono text-[11px]">{tx.address}</td>
                <td className="px-3 py-2 text-right">
                  <span className="inline-flex items-center gap-1 text-text-primary tabular-nums">
                    <TonIcon size={12} /> {tx.amount.toFixed(1)}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase',
                    tx.side === 'buy' ? 'bg-[#00B843]/15 text-[#00B843]' : 'bg-[#DD2728]/15 text-[#DD2728]',
                  )}>
                    {tx.side}
                  </span>
                </td>
                <td className="px-3 py-2 text-text-secondary">{tx.collection}</td>
                <td className="px-3 py-2 text-right text-text-muted">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="px-4 py-2 border-t border-border-subtle">
          <button onClick={onShowMore} className="text-[11px] text-accent font-medium hover:underline">Show more</button>
        </div>
      )}
      {data.length === 0 && (
        <div className="py-8 text-center text-[11px] text-text-muted">Waiting for transactions...</div>
      )}
    </div>
  );
}
