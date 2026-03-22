import { Check, Trash } from '@phosphor-icons/react';
import { useTheme } from '../themes/ThemeContext.jsx';

/**
 * Shared theme selection grid used in both project Settings and Global Settings.
 * Shows all available themes (built-in + custom) with color swatches.
 */
export function ThemeGrid() {
  const { themeId, setTheme, themes, deleteCustomTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.values(themes).map((t) => {
        const active = themeId === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`group relative flex flex-col gap-2.5 p-3 rounded-2xl text-left transition-all ${
              active
                ? 'ring-2 ring-accent/40 bg-accent/5'
                : 'bg-surface-overlay/50 hover:bg-surface-overlay'
            }`}
          >
            <div className="flex shrink-0 -space-x-1">
              <div className="w-5 h-5 rounded-full border-2 border-surface-raised"
                style={{ background: t.vars['--color-surface'] }} />
              <div className="w-5 h-5 rounded-full border-2 border-surface-raised"
                style={{ background: t.vars['--color-accent'] }} />
              <div className="w-5 h-5 rounded-full border-2 border-surface-raised"
                style={{ background: t.vars['--color-text-primary'] }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-primary">{t.name}</span>
                {active && <Check size={10} weight="bold" className="text-accent" />}
              </div>
              <span className="text-[10px] text-text-muted block">{t.description}</span>
            </div>
            {t.isCustom && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteCustomTheme(t.id); }}
                className="absolute top-2 right-2 p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash size={10} />
              </button>
            )}
          </button>
        );
      })}
    </div>
  );
}
