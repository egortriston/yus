import { clsx } from 'clsx';
import { ShoppingCart } from '@phosphor-icons/react';
import { TonIcon } from './SwiftIcons.jsx';

// Backdrop gradients from SwiftGifts app
const BACKDROPS = [
  'radial-gradient(circle, rgb(95, 120, 73) 30%, rgb(60, 79, 59) 100%)',
  'radial-gradient(circle, rgb(221, 142, 111) 30%, rgb(183, 90, 96) 100%)',
  'radial-gradient(circle, rgb(131, 165, 133) 30%, rgb(80, 113, 80) 100%)',
  'radial-gradient(circle, rgb(167, 178, 192) 30%, rgb(110, 122, 140) 100%)',
  'radial-gradient(circle, rgb(122, 198, 186) 30%, rgb(70, 142, 132) 100%)',
  'radial-gradient(circle, rgb(186, 178, 162) 30%, rgb(135, 124, 108) 100%)',
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
  return PROVIDER_IMGS[provider.toLowerCase().replace(/\s/g, '')] || null;
}

// Paper noise SVG
const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Simpler item/product card with squircle corners, backdrop, and provider icon.
 */
export function ItemCard({ name, image, provider, price, soldOut = false, onAdd, backdrop, className }) {
  const bg = backdrop || BACKDROPS[hashCode(name || '') % BACKDROPS.length];
  const providerImg = getProviderImg(provider);

  return (
    <div
      className={clsx(
        'overflow-hidden transition-all group',
        soldOut ? 'opacity-60 grayscale' : 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      style={{
        background: 'var(--color-surface-overlay)',
        boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
        borderRadius: '16px',
        WebkitBorderRadius: '16px',
      }}
    >
      <div className="relative aspect-square overflow-hidden flex items-center justify-center" style={{ background: bg }}>
        {/* Paper noise overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: NOISE_BG, backgroundSize: '80px 80px', opacity: 0.28 }}
        />
        {image ? (
          <img src={image} alt={name} className="w-[65%] h-[65%] object-contain drop-shadow-lg relative z-1" />
        ) : (
          <ShoppingCart size={24} className="text-white/30" />
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-2">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Sold out</span>
          </div>
        )}
        {provider && (
          providerImg ? (
            <img src={providerImg} alt={provider} className="absolute top-1.5 left-1.5 z-2 w-4 h-4 rounded-md object-cover ring-1 ring-black/20" />
          ) : (
            <span className="absolute top-1.5 left-1.5 z-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-black/50 text-white/80 backdrop-blur-sm">{provider}</span>
          )
        )}
      </div>

      <div className="p-2.5 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent/4 blur-xl pointer-events-none" />
        <p className="text-[11px] font-medium text-text-primary truncate mb-1.5">{name}</p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-text-primary">
            <TonIcon size={12} /> {price}
          </span>
          {!soldOut && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
              className="w-6 h-6 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-overlay flex items-center justify-center transition-colors"
            >
              <ShoppingCart size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
