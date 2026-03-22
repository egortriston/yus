import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const THEME_STORAGE_KEY = 'alexbot-theme';
const CUSTOM_THEMES_KEY = 'alexbot-custom-themes';

export const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark charcoal, burnt orange',
    vars: {
      '--color-surface': '#0c0c10',
      '--color-surface-raised': '#141418',
      '--color-surface-overlay': '#1c1c22',
      '--color-surface-hover': '#22222a',
      '--color-border': '#2a2a36',
      '--color-border-subtle': '#1e1e28',
      '--color-border-accent': '#ff6b3540',
      '--color-text-primary': '#ececf2',
      '--color-text-secondary': '#9090a8',
      '--color-text-muted': '#5a5a72',
      '--color-accent': '#ff6b35',
      '--color-accent-hover': '#ff8255',
      '--color-accent-muted': '#ff6b3520',
      '--color-accent-dim': '#cc5529',
      '--color-success': '#34d399',
      '--color-success-muted': '#34d39920',
      '--color-warning': '#fbbf24',
      '--color-warning-muted': '#fbbf2420',
      '--color-danger': '#f87171',
      '--color-danger-muted': '#f8717120',
      '--color-info': '#60a5fa',
      '--color-info-muted': '#60a5fa20',
      '--color-purple': '#a78bfa',
      '--color-purple-muted': '#a78bfa20',
      '--bg-pattern-primary': '#ff6b35',
      '--bg-pattern-secondary': '#a78bfa',
    },
  },
  sand: {
    id: 'sand',
    name: 'Sand',
    description: 'Warm beige, terracotta',
    vars: {
      '--color-surface': '#f5f0e8',
      '--color-surface-raised': '#faf7f2',
      '--color-surface-overlay': '#ede7dc',
      '--color-surface-hover': '#e3dbd0',
      '--color-border': '#d4c9b9',
      '--color-border-subtle': '#e8e0d4',
      '--color-border-accent': '#c2704040',
      '--color-text-primary': '#2c2418',
      '--color-text-secondary': '#6b5d4e',
      '--color-text-muted': '#9a8b7a',
      '--color-accent': '#c27040',
      '--color-accent-hover': '#a85c32',
      '--color-accent-muted': '#c2704018',
      '--color-accent-dim': '#8f4e28',
      '--color-success': '#3d8b5e',
      '--color-success-muted': '#3d8b5e18',
      '--color-warning': '#b8860b',
      '--color-warning-muted': '#b8860b18',
      '--color-danger': '#b44040',
      '--color-danger-muted': '#b4404018',
      '--color-info': '#4a7fb5',
      '--color-info-muted': '#4a7fb518',
      '--color-purple': '#7b5ea7',
      '--color-purple-muted': '#7b5ea718',
      '--bg-pattern-primary': '#c27040',
      '--bg-pattern-secondary': '#7b5ea7',
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    description: 'Cool slate, steel blue',
    vars: {
      '--color-surface': '#101215',
      '--color-surface-raised': '#171a1e',
      '--color-surface-overlay': '#1e2228',
      '--color-surface-hover': '#252a31',
      '--color-border': '#2e3540',
      '--color-border-subtle': '#222830',
      '--color-border-accent': '#4d9ecf40',
      '--color-text-primary': '#dce1e8',
      '--color-text-secondary': '#8892a2',
      '--color-text-muted': '#556070',
      '--color-accent': '#4d9ecf',
      '--color-accent-hover': '#6bb3dd',
      '--color-accent-muted': '#4d9ecf20',
      '--color-accent-dim': '#3878a0',
      '--color-success': '#34d399',
      '--color-success-muted': '#34d39920',
      '--color-warning': '#f0b429',
      '--color-warning-muted': '#f0b42920',
      '--color-danger': '#e06060',
      '--color-danger-muted': '#e0606020',
      '--color-info': '#4d9ecf',
      '--color-info-muted': '#4d9ecf20',
      '--color-purple': '#9b8ec4',
      '--color-purple-muted': '#9b8ec420',
      '--bg-pattern-primary': '#4d9ecf',
      '--bg-pattern-secondary': '#9b8ec4',
    },
  },
  ash: {
    id: 'ash',
    name: 'Ash',
    description: 'Warm gray, muted amber',
    vars: {
      '--color-surface': '#141210',
      '--color-surface-raised': '#1b1916',
      '--color-surface-overlay': '#23201c',
      '--color-surface-hover': '#2b2824',
      '--color-border': '#3a352e',
      '--color-border-subtle': '#282420',
      '--color-border-accent': '#c9943540',
      '--color-text-primary': '#e8e2d8',
      '--color-text-secondary': '#a09585',
      '--color-text-muted': '#6e6358',
      '--color-accent': '#c99435',
      '--color-accent-hover': '#daa84e',
      '--color-accent-muted': '#c9943520',
      '--color-accent-dim': '#a07728',
      '--color-success': '#5ea06a',
      '--color-success-muted': '#5ea06a20',
      '--color-warning': '#c99435',
      '--color-warning-muted': '#c9943520',
      '--color-danger': '#c96050',
      '--color-danger-muted': '#c9605020',
      '--color-info': '#6a9bc0',
      '--color-info-muted': '#6a9bc020',
      '--color-purple': '#9a85b5',
      '--color-purple-muted': '#9a85b520',
      '--bg-pattern-primary': '#c99435',
      '--bg-pattern-secondary': '#9a85b5',
    },
  },
  noir: {
    id: 'noir',
    name: 'Noir',
    description: 'True black, neon green',
    vars: {
      '--color-surface': '#000000',
      '--color-surface-raised': '#0a0a0a',
      '--color-surface-overlay': '#141414',
      '--color-surface-hover': '#1c1c1c',
      '--color-border': '#262626',
      '--color-border-subtle': '#1a1a1a',
      '--color-border-accent': '#22c55e40',
      '--color-text-primary': '#e4e4e7',
      '--color-text-secondary': '#a1a1aa',
      '--color-text-muted': '#52525b',
      '--color-accent': '#22c55e',
      '--color-accent-hover': '#4ade80',
      '--color-accent-muted': '#22c55e20',
      '--color-accent-dim': '#16a34a',
      '--color-success': '#22c55e',
      '--color-success-muted': '#22c55e20',
      '--color-warning': '#eab308',
      '--color-warning-muted': '#eab30820',
      '--color-danger': '#ef4444',
      '--color-danger-muted': '#ef444420',
      '--color-info': '#38bdf8',
      '--color-info-muted': '#38bdf820',
      '--color-purple': '#c084fc',
      '--color-purple-muted': '#c084fc20',
      '--bg-pattern-primary': '#22c55e',
      '--bg-pattern-secondary': '#c084fc',
    },
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    description: 'Deep indigo, polar glow',
    vars: {
      '--color-surface': '#07080f',
      '--color-surface-raised': '#0d0f1a',
      '--color-surface-overlay': '#151828',
      '--color-surface-hover': '#1c2036',
      '--color-border': '#262c4a',
      '--color-border-subtle': '#1a1f38',
      '--color-border-accent': '#7c3aed40',
      '--color-text-primary': '#e8eaf4',
      '--color-text-secondary': '#9498be',
      '--color-text-muted': '#585e82',
      '--color-accent': '#7c3aed',
      '--color-accent-hover': '#8b5cf6',
      '--color-accent-muted': '#7c3aed20',
      '--color-accent-dim': '#5b21b6',
      '--color-success': '#4ade80',
      '--color-success-muted': '#4ade8020',
      '--color-warning': '#facc15',
      '--color-warning-muted': '#facc1520',
      '--color-danger': '#f472b6',
      '--color-danger-muted': '#f472b620',
      '--color-info': '#38bdf8',
      '--color-info-muted': '#38bdf820',
      '--color-purple': '#a78bfa',
      '--color-purple-muted': '#a78bfa20',
      '--bg-pattern-primary': '#7c3aed',
      '--bg-pattern-secondary': '#38bdf8',
    },
  },
  parchment: {
    id: 'parchment',
    name: 'Parchment',
    description: 'Light cream, forest teal',
    vars: {
      '--color-surface': '#f8f6f1',
      '--color-surface-raised': '#ffffff',
      '--color-surface-overlay': '#efece5',
      '--color-surface-hover': '#e5e1d8',
      '--color-border': '#d6d0c4',
      '--color-border-subtle': '#e8e4da',
      '--color-border-accent': '#1a806840',
      '--color-text-primary': '#1f2420',
      '--color-text-secondary': '#556054',
      '--color-text-muted': '#8a9488',
      '--color-accent': '#1a8068',
      '--color-accent-hover': '#15664f',
      '--color-accent-muted': '#1a806818',
      '--color-accent-dim': '#0f5040',
      '--color-success': '#2d8c5a',
      '--color-success-muted': '#2d8c5a18',
      '--color-warning': '#a67c1a',
      '--color-warning-muted': '#a67c1a18',
      '--color-danger': '#b33e3e',
      '--color-danger-muted': '#b33e3e18',
      '--color-info': '#3a7ca5',
      '--color-info-muted': '#3a7ca518',
      '--color-purple': '#7554a0',
      '--color-purple-muted': '#7554a018',
      '--bg-pattern-primary': '#1a8068',
      '--bg-pattern-secondary': '#7554a0',
    },
  },
};

const ThemeContext = createContext(null);

function loadCustomThemes() {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCustomThemes(themes) {
  try {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
  } catch {}
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'default' || stored === 'ocean' || stored === 'forest' || stored === 'sunset' || stored === 'light') {
        return stored === 'light' ? 'sand' : 'midnight';
      }
      return stored || 'midnight';
    } catch {
      return 'midnight';
    }
  });

  const [customThemes, setCustomThemes] = useState(loadCustomThemes);

  const allThemes = useMemo(() => ({ ...THEMES, ...customThemes }), [customThemes]);
  const theme = allThemes[themeId] || THEMES.midnight;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Apply background image if custom theme has one
    if (theme.bgImage) {
      root.style.setProperty('--custom-bg-image', `url(${theme.bgImage})`);
      document.body.style.backgroundImage = `var(--custom-bg-image)`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      root.style.removeProperty('--custom-bg-image');
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    }
  }, [theme]);

  const setTheme = useCallback((id) => {
    if (!allThemes[id]) return;
    setThemeIdState(id);
    try { localStorage.setItem(THEME_STORAGE_KEY, id); } catch {}
  }, [allThemes]);

  const saveCustomTheme = useCallback((themeData) => {
    // themeData: { id, name, description, vars, bgImage? }
    const id = themeData.id || `custom-${Date.now()}`;
    const newTheme = { ...themeData, id, isCustom: true };
    setCustomThemes(prev => {
      const updated = { ...prev, [id]: newTheme };
      saveCustomThemes(updated);
      return updated;
    });
    setThemeIdState(id);
    try { localStorage.setItem(THEME_STORAGE_KEY, id); } catch {}
    return id;
  }, []);

  const deleteCustomTheme = useCallback((id) => {
    setCustomThemes(prev => {
      const updated = { ...prev };
      delete updated[id];
      saveCustomThemes(updated);
      return updated;
    });
    if (themeId === id) {
      setThemeIdState('midnight');
      try { localStorage.setItem(THEME_STORAGE_KEY, 'midnight'); } catch {}
    }
  }, [themeId]);

  const exportTheme = useCallback((id) => {
    const t = allThemes[id];
    if (!t) return null;
    return JSON.stringify({ name: t.name, description: t.description, vars: t.vars, bgImage: t.bgImage || null });
  }, [allThemes]);

  const importTheme = useCallback((jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.name || !data.vars) throw new Error('Invalid theme');
      return saveCustomTheme(data);
    } catch {
      return null;
    }
  }, [saveCustomTheme]);

  return (
    <ThemeContext.Provider value={{
      themeId, theme, setTheme, themes: allThemes,
      customThemes, saveCustomTheme, deleteCustomTheme,
      exportTheme, importTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
