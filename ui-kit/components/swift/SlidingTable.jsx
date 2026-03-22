import { clsx } from 'clsx';

/**
 * Horizontally scrollable data table with fixed rank + name columns.
 * @param {{ rank: number, name: string, image?: string, price?: number, change?: number, volume?: number, holders?: number, floor?: number }[]} data
 * @param {string} filter - 'all'|'gainers'|'losers'|'volume'
 */
export function SlidingTable({ data = [], filter = 'all', className }) {
  return (
    <div className={clsx('rounded-2xl bg-surface-overlay overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-xs" style={{ minWidth: 540 }}>
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider w-8">#</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">Collection</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Avg Price</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Change</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Volume</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Holders</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">Floor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {data.map((row) => (
              <tr key={row.rank} className="hover:bg-surface-raised/50 transition-colors cursor-pointer">
                <td className="px-3 py-2.5 text-text-muted tabular-nums">{row.rank}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {row.image && <img src={row.image} alt="" className="w-6 h-6 rounded" />}
                    <span className="font-medium text-text-primary truncate">{row.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right text-text-primary tabular-nums">{row.price?.toFixed(2)}</td>
                <td className={clsx('px-3 py-2.5 text-right tabular-nums font-medium', (row.change ?? 0) >= 0 ? 'text-[#00B843]' : 'text-[#DD2728]')}>
                  {(row.change ?? 0) >= 0 ? '+' : ''}{row.change?.toFixed(1)}%
                </td>
                <td className="px-3 py-2.5 text-right text-text-secondary tabular-nums">{row.volume?.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right text-text-secondary tabular-nums">{row.holders?.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right text-text-primary tabular-nums">{row.floor?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
