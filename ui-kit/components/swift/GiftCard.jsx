import { clsx } from 'clsx';
import { ShoppingCart, Check } from '@phosphor-icons/react';
import { TonIcon } from './SwiftIcons.jsx';

/**
 * Telegram-style gift card for NFT/web3 gifts.
 * Uses squircle corners, backdrop radial gradients, and provider icons.
 */

// Backdrop colors matching the SwiftGifts app (text.js)
const BACKDROPS = [
  'radial-gradient(circle, rgb(95, 120, 73) 30%, rgb(60, 79, 59) 100%)',
  'radial-gradient(circle, rgb(221, 142, 111) 30%, rgb(183, 90, 96) 100%)',
  'radial-gradient(circle, rgb(131, 165, 133) 30%, rgb(80, 113, 80) 100%)',
  'radial-gradient(circle, rgb(167, 178, 192) 30%, rgb(110, 122, 140) 100%)',
  'radial-gradient(circle, rgb(122, 198, 186) 30%, rgb(70, 142, 132) 100%)',
  'radial-gradient(circle, rgb(186, 178, 162) 30%, rgb(135, 124, 108) 100%)',
  'radial-gradient(circle, rgb(100, 148, 237) 30%, rgb(62, 100, 186) 100%)',
  'radial-gradient(circle, rgb(216, 145, 175) 30%, rgb(175, 92, 126) 100%)',
];

// Provider image map
const PROVIDER_IMGS = {
  getgems: '/swift-assets/img/getgems.jpeg',
  fragment: '/swift-assets/img/fragment.jpeg',
  mrkt: '/swift-assets/img/mrkt.jpeg',
  tonnel: '/swift-assets/img/tonnel.jpeg',
  portals: '/swift-assets/img/portals.jpeg',
  marketapp: '/swift-assets/img/marketapp.jpeg',
};

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getProviderImg(provider) {
  if (!provider) return null;
  const key = provider.toLowerCase().replace(/\s/g, '');
  return PROVIDER_IMGS[key] || null;
}

// Noise texture SVG data URI for paper effect
const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function GiftCard({ name, image, provider, priceTon, priceUsd, inCart = false, onToggleCart, backdrop, className }) {
  const bg = backdrop || BACKDROPS[hashCode(name || '') % BACKDROPS.length];
  const providerImg = getProviderImg(provider);

  return (
    <div
      className={clsx(
        'overflow-hidden transition-all duration-200 group cursor-pointer',
        inCart ? 'ring-2 ring-accent shadow-md shadow-accent/10' : 'hover:shadow-lg hover:-translate-y-0.5',
        className,
      )}
      style={{
        background: 'var(--color-surface-overlay)',
        boxShadow: inCart ? undefined : '0 6px 14px rgba(0,0,0,0.35)',
        borderRadius: '18px',
        // iOS continuous corners (squircle-like in Safari)
        WebkitBorderRadius: '18px',
      }}
    >
      {/* Image with backdrop radial gradient + paper texture */}
      <div
        className="relative aspect-square overflow-hidden flex items-center justify-center"
        style={{ background: bg }}
      >
        {/* Paper noise overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: NOISE_BG, backgroundSize: '80px 80px', opacity: 0.28 }}
        />
        {image ? (
          <img src={image} alt={name} className="w-[70%] h-[70%] object-contain drop-shadow-lg relative z-1" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white/10 relative z-1" />
        )}
        {/* Provider: show icon if available, otherwise text badge */}
        {provider && (
          providerImg ? (
            <img
              src={providerImg}
              alt={provider}
              className="absolute top-2 left-2 z-2 w-5 h-5 rounded-md object-cover ring-1 ring-black/20"
            />
          ) : (
            <span className="absolute top-2 left-2 z-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-black/50 text-white/80 backdrop-blur-sm">
              {provider}
            </span>
          )
        )}
      </div>

      {/* Info section with subtle accent glow */}
      <div className="p-3 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-accent/4 blur-xl pointer-events-none" />
        <p className="text-[11px] font-medium text-text-primary truncate mb-2">{name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-text-primary">
              <TonIcon size={14} /> {priceTon}
            </span>
            {priceUsd != null && (
              <span className="text-[10px] text-text-muted">${priceUsd}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCart?.(); }}
            className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center transition-all',
              inCart ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay',
            )}
          >
            {inCart ? <Check size={14} weight="bold" /> : <ShoppingCart size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
