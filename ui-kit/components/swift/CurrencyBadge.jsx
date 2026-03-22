import { clsx } from 'clsx';
import { TonIcon, GemIcon } from './SwiftIcons.jsx';

/**
 * Small badge showing currency icon + value.
 * Supports TON ecosystem jettons: ton, gem, usdt, ston, major, dust, web3, daolama
 * Uses actual asset images where available.
 */

const IMAGE_CURRENCIES = {
  usdt: '/swift-assets/img/usdt.webp',
  ston: '/swift-assets/img/ston.webp',
  dust: '/swift-assets/img/dust.webp',
  web3: '/swift-assets/img/web3.webp',
  daolama: '/swift-assets/img/daolama.jpeg',
  bolt: '/swift-assets/img/bolt.webp',
};

const ICON_CURRENCIES = {
  ton: { Icon: TonIcon },
  gem: { Icon: GemIcon, colorClass: 'text-accent' },
};

export function CurrencyBadge({ currency = 'ton', value, className }) {
  const iconEntry = ICON_CURRENCIES[currency];
  const imgSrc = IMAGE_CURRENCIES[currency];

  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums', className)}>
      {iconEntry ? (
        <iconEntry.Icon size={16} weight={iconEntry.weight} className={iconEntry.colorClass} />
      ) : imgSrc ? (
        <img src={imgSrc} alt={currency} className="w-4 h-4 rounded-full object-cover shrink-0" />
      ) : (
        <span className="w-4 h-4 rounded-full bg-accent/20 text-accent text-[8px] flex items-center justify-center font-bold uppercase shrink-0">
          {currency.charAt(0)}
        </span>
      )}
      <span className="text-text-primary">{value}</span>
    </span>
  );
}
