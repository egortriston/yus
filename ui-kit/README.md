# SwiftGifts UI Kit

A theme-aware React component library for the SwiftGifts ecosystem. Dark-mode-first, built for Telegram Mini Apps, dashboards, and developer tooling interfaces.

## Quick Start

### Prerequisites

- React 18+
- Tailwind CSS v4
- `@phosphor-icons/react`
- `clsx`
- `sonner` (for toasts)
- `Plus Jakarta Sans` and `JetBrains Mono` fonts

### Installation

```bash
# Copy the ui-kit folder into your project
cp -r ui-kit/ your-project/src/ui-kit/

# Install peer dependencies
npm install @phosphor-icons/react clsx sonner
```

### Setup

1. **Add fonts to your HTML `<head>`**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

2. **Import the global styles** in your CSS entry point:

```css
@import "./ui-kit/styles/globals.css";
```

3. **Wrap your app with the ThemeProvider**:

```jsx
import { ThemeProvider, ToastProvider } from './ui-kit';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider />
      {/* Your app */}
    </ThemeProvider>
  );
}
```

4. **Use components**:

```jsx
import { Button, Modal, Badge } from './ui-kit';
import { LineChart } from './ui-kit/components/swift/LineChart';
import { GiftCard } from './ui-kit/components/swift/GiftCard';
```

---

## Theming

The kit ships with 7 built-in themes and supports unlimited custom themes.

### Built-in Themes

| Theme | Description | Surface | Accent |
|-------|-------------|---------|--------|
| **Midnight** | Dark charcoal | `#0c0c10` | `#ff6b35` (burnt orange) |
| **Sand** | Warm beige (light) | `#f5f0e8` | `#c27040` (terracotta) |
| **Graphite** | Cool slate | `#101215` | `#4d9ecf` (steel blue) |
| **Ash** | Warm gray | `#141210` | `#c99435` (muted amber) |
| **Noir** | True black | `#000000` | `#22c55e` (neon green) |
| **Aurora** | Deep indigo | `#07080f` | `#7c3aed` (polar glow) |
| **Parchment** | Light cream | `#f8f6f1` | `#1a8068` (forest teal) |

### Using Themes

```jsx
import { useTheme } from './ui-kit';

function ThemeSwitcher() {
  const { themeId, setTheme, themes } = useTheme();

  return (
    <div>
      {Object.values(themes).map(t => (
        <button key={t.id} onClick={() => setTheme(t.id)}>
          {t.name}
        </button>
      ))}
    </div>
  );
}
```

### Custom Themes

```jsx
const { saveCustomTheme, exportTheme, importTheme } = useTheme();

saveCustomTheme({
  name: 'My Theme',
  description: 'Custom dark theme',
  vars: {
    '--color-surface': '#0a0a12',
    '--color-surface-raised': '#12121a',
    '--color-accent': '#e040fb',
    // ... all CSS variables
  },
});

const json = exportTheme('my-theme-id');
importTheme(json);
```

### CSS Variables Reference

```
Surfaces:    --color-surface, --color-surface-raised, --color-surface-overlay, --color-surface-hover
Borders:     --color-border, --color-border-subtle, --color-border-accent
Text:        --color-text-primary, --color-text-secondary, --color-text-muted
Accent:      --color-accent, --color-accent-hover, --color-accent-muted, --color-accent-dim
Status:      --color-success, --color-warning, --color-danger, --color-info, --color-purple
Typography:  --font-sans, --font-mono
Radii:       --radius-xs through --radius-4xl
```

---

## Common Components

### Primitives

| Component | Description |
|-----------|-------------|
| `Button` | Multi-variant button with icon support, loading state |
| `Input` | Text input with optional icon and label |
| `Checkbox` | Animated checkbox with sm/md/lg sizes |
| `Badge` | Status indicator badges (completed, in_progress, failed, pending) |
| `Tooltip` | Hover tooltip with configurable position |
| `ProgressBar` | Animated progress indicator |
| `Loader` | Loading spinner with optional label |

### Form Controls

| Component | Description |
|-----------|-------------|
| `CustomSelect` | Portal-based dropdown select |
| `ColorPicker` | Color picker with presets and hue slider |
| `CalendarPicker` | Full calendar date picker with month/year quick select |

### Layout

| Component | Description |
|-----------|-------------|
| `Card` | Card with header, content, footer slots |
| `Table` | Data table with header, body, row, cell subcomponents |
| `Tabs` | Tab navigation |
| `Modal` | Dialog overlay with title, description, footer |
| `ConfirmModal` | Pre-built confirmation dialog (danger/warning/default) |
| `EmptyState` | Empty state with icon, title, description, action |
| `AnimatedList` | Staggered animation wrapper for lists |

### Feedback

| Component | Description |
|-----------|-------------|
| `ToastProvider` | Theme-aware toast notifications (via Sonner) |
| `Skeleton` | Skeleton loading placeholders for every page type |
| `ConfirmSlider` | Slide-to-confirm interaction with knob and fill |
| `NotificationPanel` | Notification dropdown with dismiss and clear all |
| `ProfileMenu` | User profile dropdown with avatar and actions |

### Composites

| Component | Description |
|-----------|-------------|
| `SubtaskTimeline` | Collapsible subtask list with status indicators |
| `ThemeGrid` | Visual theme selector grid |
| `Graphic` | Decorative SVG graphic component |

---

## SwiftGifts Components

Components specific to the SwiftGifts Telegram Mini App ecosystem, located in `components/swift/`.

### Charts and Analytics

| Component | Description |
|-----------|-------------|
| `LineChart` | Pure SVG line chart with gradient fill, timeframe selector, hover tooltip. Used for market cap. |
| `BarChart` | SVG bar chart with timeframe selector. Used for volume analytics. |
| `WhaleFlowChart` | Scrollable vertical bar chart with opacity encoding volume. Legend, hover stats. |
| `HealthScoreGauge` | 3/4 arc SVG gauge (red/yellow/green) with score center text. |

### Tables

| Component | Description |
|-----------|-------------|
| `SlidingTable` | Horizontally scrollable table with fixed rank+name columns, green/red change values. |
| `TransactionTable` | Whale/transaction table with address, amount, buy/sell side coloring. |
| `TransactionHistory` | Date-grouped history with image, title, tx ID, status badge. |

### Heatmap

| Component | Description |
|-----------|-------------|
| `Heatmap` | Treemap-style heatmap. Blocks sized by change, colored green/red. Timeframe buttons. Click-to-detail panel below grid (Telegram-style). |

### Gift / Marketplace

| Component | Description |
|-----------|-------------|
| `GiftCard` | Telegram gift card with provider icon, backdrop gradient, paper texture, squircle corners. Cart toggle. |
| `ItemCard` | Simpler item card variant with provider badge, price, cart button. |
| `OrderCard` | Order summary with fee breakdown, currency selector, buy/cart buttons. |

### Gamification

| Component | Description |
|-----------|-------------|
| `AchievementCard` | Achievement tile with icon, title, subtitle. Completed vs locked states. Pin badge. |
| `AchievementsModal` | Modal with tab switcher, grid of AchievementCards, empty state. |
| `CheckInBonus` | 7-day check-in grid. Gem icon + reward per day, green check when claimed. |
| `ReferralCard` | Earned stats (TON + gems), invited friends, badge with progress, invite/copy buttons. |

### Profile / Status

| Component | Description |
|-----------|-------------|
| `BatteryIndicator` | Battery icon with 4 states (none/low/half/full). |
| `CurrencyBadge` | Small badge with currency icon (TON/USDT/STON/DUST/Web3/DaoLama) + value. |
| `StatsTriplet` | Three stat blocks in a row (e.g., Earned / Volume / Orders). |
| `DegenModeCard` | Subscription card with crosshair icon, active/inactive state, expiry. |

### Layout / Controls

| Component | Description |
|-----------|-------------|
| `TimeframeControl` | Row of timeframe buttons (1h/6h/1d etc.), single-select with accent highlight. |
| `SegmentedControl` | Pill-style segmented tabs (Overview/Collections/Whales). |
| `FilterDropdown` | Dropdown button for filter options (all/gainers/losers/volume). |

### Icons

| Component | Description |
|-----------|-------------|
| `SwiftIcons` | Inline SVG icons: `TonIcon`, `GemIcon` (Phosphor SketchLogo), `PresentIcon`, `StarIcon`, `CrownIcon`, `WalletIcon`, `BatteryIcon`. |

---

## File Structure

```
ui-kit/
  index.js                # Main entry point - all exports
  README.md               # This file
  COMPONENTS.md           # Detailed component API docs
  components/             # Base UI primitives
    Button.jsx
    Input.jsx
    Badge.jsx
    Card.jsx
    Checkbox.jsx
    CalendarPicker.jsx
    ColorPicker.jsx
    ConfirmModal.jsx
    ConfirmSlider.jsx
    CustomSelect.jsx
    EmptyState.jsx
    Graphic.jsx
    Loader.jsx
    Modal.jsx
    NotificationPanel.jsx
    ProfileMenu.jsx
    ProgressBar.jsx
    Skeleton.jsx
    Table.jsx
    Tabs.jsx
    Toast.jsx
    Tooltip.jsx
    AnimatedList.jsx
    swift/                # SwiftGifts-specific components
      LineChart.jsx
      BarChart.jsx
      WhaleFlowChart.jsx
      HealthScoreGauge.jsx
      SlidingTable.jsx
      TransactionTable.jsx
      TransactionHistory.jsx
      Heatmap.jsx
      GiftCard.jsx
      ItemCard.jsx
      OrderCard.jsx
      AchievementCard.jsx
      AchievementsModal.jsx
      CheckInBonus.jsx
      ReferralCard.jsx
      BatteryIndicator.jsx
      CurrencyBadge.jsx
      StatsTriplet.jsx
      DegenModeCard.jsx
      TimeframeControl.jsx
      SegmentedControl.jsx
      FilterDropdown.jsx
      SwiftIcons.jsx
  composites/             # Higher-level composed components
    SubtaskTimeline.jsx
    ThemeGrid.jsx
  hooks/                  # Utility hooks
    useSquircle.js
  themes/                 # Theme system
    ThemeContext.jsx
  styles/                 # Global CSS
    globals.css
  swift-assets/           # SwiftGifts image assets
    img/                  # Gift images, marketplace logos, currency icons
    icons/                # SVG icons, battery states
  playground/             # Interactive component gallery (Vite app)
    package.json
    vite.config.js
    src/App.jsx
```

## Playground

The UI Kit includes an interactive playground for previewing all components:

```bash
cd ui-kit/playground
npm install
npm run dev
```

Starts a Vite dev server at `http://localhost:5173` with a full component gallery, live theme switching (8 themes), mobile-responsive layout with burger menu, and usage examples for every component.

---

## Design Philosophy

- **Theme-first**: Every color references a CSS variable. No hardcoded colors.
- **Dark-mode-first**: Designed for dark themes, fully supports light themes.
- **Portal-based popups**: Dropdowns, calendars, and pickers render via `createPortal` to avoid clipping.
- **Squircle corners**: Gift cards and marketplace components use iOS-style continuous corners.
- **Paper textures**: SVG noise overlays on gift/item cards for tactile depth.
- **Responsive**: Mobile-first with breakpoint-aware layouts. Mobile header with scroll-aware visibility.
- **Performant**: CSS-only animations, no runtime animation libraries for base components.
- **Consistent**: Unified border radii, spacing, and typography scales across all components.
