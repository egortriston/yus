import { clsx } from 'clsx';
import { ShoppingCart } from '@phosphor-icons/react';
import { TonIcon } from './SwiftIcons.jsx';

/**
 * Order summary card with fee breakdown.
 * @param {Object}   item          - { name, image, price, provider }
 * @param {{ label: string, value: number }[]} fees
 * @param {string}   currency
 * @param {number}   total
 * @param {Function} onBuy
 * @param {Function} onAddToCart
 */
export function OrderCard({ item = {}, fees = [], currency = 'TON', total, onBuy, onAddToCart, className }) {
  return (
    <div className={clsx('bg-surface-overlay p-4 relative overflow-hidden', className)} style={{ borderRadius: '18px' }}>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent/3 blur-2xl pointer-events-none" />
      {/* Item preview */}
      <div className="flex items-center gap-3 mb-4">
        {item.image ? (
          <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-surface-raised" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-surface-raised flex items-center justify-center">
            <ShoppingCart size={18} className="text-text-muted/40" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
          {item.provider && <p className="text-[10px] text-text-muted">{item.provider}</p>}
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-text-primary">
          <TonIcon size={16} /> {item.price}
        </span>
      </div>

      {/* Fee breakdown */}
      <div className="space-y-2 mb-4">
        {fees.map((fee, i) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">{fee.label}</span>
            <span className="text-text-secondary tabular-nums">{fee.value} {currency}</span>
          </div>
        ))}
        <div className="border-t border-border-subtle pt-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-text-primary">Total</span>
          <span className="inline-flex items-center gap-1 font-bold text-text-primary">
            <TonIcon size={14} /> {total ?? item.price} {currency}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onBuy}
          className="flex-1 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:brightness-110 transition-all"
        >
          Buy now
        </button>
        <button
          onClick={onAddToCart}
          className="w-10 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-overlay flex items-center justify-center transition-colors"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
    </div>
  );
}
