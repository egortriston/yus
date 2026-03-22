# SwiftGifts UI Kit - Component API Reference

Complete API documentation for every component in the kit.

---

## Table of Contents

- [Button](#button)
- [Input](#input)
- [Checkbox](#checkbox)
- [Badge](#badge)
- [Tooltip](#tooltip)
- [ProgressBar](#progressbar)
- [Loader](#loader)
- [CustomSelect](#customselect)
- [ColorPicker](#colorpicker)
- [CalendarPicker](#calendarpicker)
- [PathInput](#pathinput)
- [Card](#card)
- [Table](#table)
- [Tabs](#tabs)
- [Modal](#modal)
- [ConfirmModal](#confirmmodal)
- [EmptyState](#emptystate)
- [AnimatedList](#animatedlist)
- [ToastProvider](#toastprovider)
- [Skeleton](#skeleton)
- [SubtaskTimeline](#subtasktimeline)
- [ThemeGrid](#themegrid)
- [ThemeProvider](#themeprovider)

---

## Button

Multi-variant button with icon support, loading states, and full theme integration.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary'` \| `'secondary'` \| `'ghost'` \| `'danger'` | `'primary'` | Visual style variant |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Button size |
| `icon` | `Component` | - | Phosphor icon component shown before children |
| `loading` | `boolean` | `false` | Show loading spinner, disable interaction |
| `disabled` | `boolean` | `false` | Disable the button |
| `className` | `string` | `''` | Additional CSS classes |
| `type` | `string` | `'button'` | HTML button type |
| `onClick` | `function` | - | Click handler |
| `children` | `ReactNode` | - | Button label content |

### Variants

- **primary**: Accent background, white text
- **secondary**: Surface overlay background, muted text
- **ghost**: Transparent background, muted text, subtle hover
- **danger**: Red/danger themed button

### Examples

```jsx
<Button>Save Changes</Button>
<Button variant="ghost" size="sm" icon={Plus}>Add Item</Button>
<Button variant="danger" loading>Deleting...</Button>
```

---

## Input

Styled text input with optional leading icon and label.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text above input |
| `icon` | `Component` | - | Phosphor icon on the left |
| `className` | `string` | `''` | Wrapper CSS classes |
| `...rest` | - | - | All standard `<input>` props |

### Examples

```jsx
<Input placeholder="Search..." icon={MagnifyingGlass} />
<Input label="API Key" type="password" />
```

---

## Checkbox

Animated checkbox with accent color, pop animation, and multiple sizes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Controlled checked state |
| `onChange` | `function` | - | Called with new boolean value |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Checkbox dimensions |
| `indeterminate` | `boolean` | `false` | Show indeterminate dash |
| `disabled` | `boolean` | `false` | Disable interaction |
| `label` | `string` | - | Text label beside checkbox |

---

## Badge

Status indicator with colored dot and semantic colors.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `string` | - | Status key (maps to theme colors) |
| `dot` | `boolean` | `false` | Show colored status dot |
| `className` | `string` | `''` | Additional CSS classes |
| `children` | `ReactNode` | - | Badge content |

### Status Colors

| Status | Color |
|--------|-------|
| `completed`, `passed`, `validated` | Success (green) |
| `in_progress`, `running`, `active` | Accent |
| `pending`, `backlog`, `queued` | Warning (yellow) |
| `failed`, `error`, `rejected` | Danger (red) |
| `review`, `testing` | Info (blue) |
| Default | Muted |

---

## Tooltip

Hover tooltip rendered at the specified position.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | - | Tooltip content |
| `position` | `'top'` \| `'bottom'` \| `'left'` \| `'right'` | `'top'` | Position relative to trigger |
| `children` | `ReactNode` | - | Trigger element |

---

## ProgressBar

Animated horizontal progress indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress percentage (0-100) |
| `variant` | `string` | - | Color variant |
| `className` | `string` | `''` | Additional CSS classes |

---

## Loader

Centered loading spinner with optional label text.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Text shown below spinner |
| `className` | `string` | `''` | Additional CSS classes |

---

## CustomSelect

Portal-based dropdown select. Renders outside the DOM hierarchy to prevent clipping in modals and scroll containers.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value |
| `onChange` | `function` | - | Called with the selected option's value |
| `options` | `{ value: string, label: string }[]` | `[]` | Available options |
| `placeholder` | `string` | `'Select...'` | Placeholder when no value |
| `size` | `'sm'` \| `'md'` | `'md'` | Trigger size |
| `className` | `string` | `''` | Wrapper CSS classes |

### Features

- Portal-based rendering (no clipping)
- Automatic positioning (opens above if no space below)
- Check mark on selected option
- Empty state message when no options
- Keyboard accessible

---

## ColorPicker

Full-featured color picker with preset swatches, grayscale palette, and HSL hue slider.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Current color as hex string (e.g., `'#ff6b35'`) |
| `onChange` | `function` | - | Called with new hex string |
| `className` | `string` | `''` | Wrapper CSS classes |

### Features

- 10 grayscale swatches (white to black)
- 20 color presets
- HSL hue slider for fine-tuning
- Portal-based popup
- Active color highlight ring

---

## CalendarPicker

Date picker with full calendar grid, month/year quick navigation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` \| `string` \| `null` | - | Selected date |
| `onChange` | `function` | - | Called with `Date` object or `null` (on clear) |
| `label` | `string` | - | Label above trigger |
| `placeholder` | `string` | `'Select date...'` | Placeholder text |
| `clearable` | `boolean` | `true` | Show clear button |
| `className` | `string` | `''` | Wrapper CSS classes |

### Features

- **Day view**: Full month calendar with outside-month padding
- **Month view**: Click the month/year header to select month
- **Year view**: Click again for a 12-year grid
- Arrow navigation between months/year ranges
- Today highlight ring
- Today shortcut button
- Portal-based popup
- Clears to `null`

---

## PathInput

File system path input with autocomplete suggestions.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Current path string |
| `onChange` | `function` | - | Called with new path string |
| `placeholder` | `string` | - | Placeholder text |
| `className` | `string` | `''` | Wrapper CSS classes |

---

## Card

Container card with header/content/footer sections.

### Subcomponents

- `CardHeader` - Top section with title and actions
- `CardContent` - Main body
- `CardFooter` - Bottom section with actions

### Examples

```jsx
<Card>
  <CardHeader>Settings</CardHeader>
  <CardContent>
    <Input label="Name" />
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

## Table

Styled table with theme-aware borders and hover states.

### Subcomponents

- `Table` - Wrapper `<table>`
- `TableHeader` - `<thead>`
- `TableBody` - `<tbody>`
- `TableRow` - `<tr>` (with hover highlight)
- `TableHead` - `<th>` (muted, uppercase, small)
- `TableCell` - `<td>`

---

## Tabs

Horizontal tab navigation with active state indicator.

### Subcomponents

- `Tabs` - Container for tab buttons
- `Tab` - Individual tab button

### Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Tab label text |
| `active` | `boolean` | `false` | Whether this tab is active |
| `onClick` | `function` | - | Click handler |

---

## Modal

Overlay modal dialog with backdrop blur and animation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Whether modal is visible |
| `onClose` | `function` | - | Called when backdrop clicked or ESC pressed |
| `title` | `string` | - | Modal title |
| `description` | `string` | - | Subtitle/description |
| `size` | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'` | Max width |
| `children` | `ReactNode` | - | Modal body content |

### ModalFooter

Flex container for action buttons at the bottom of a modal.

---

## ConfirmModal

Pre-built confirmation dialog with variants.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Whether modal is visible |
| `onClose` | `function` | - | Called on cancel/close |
| `onConfirm` | `function` | - | Called on confirm |
| `title` | `string` | `'Confirm'` | Dialog title |
| `message` | `string` | - | Dialog message |
| `variant` | `'danger'` \| `'warning'` \| `'default'` | `'default'` | Button color variant |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |

---

## EmptyState

Centered empty state with icon, title, description, and optional action.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Component` | - | Phosphor icon component |
| `title` | `string` | - | Main heading |
| `description` | `string` | - | Subtext description |
| `action` | `ReactNode` | - | CTA button or element |
| `centered` | `boolean` | `false` | Vertically center in container |
| `className` | `string` | `''` | Additional CSS classes |

---

## AnimatedList

Staggered entrance animation wrapper for list items.

### AnimatedList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | AnimatedItem children |

### AnimatedItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to animate in |
| `delay` | `number` | auto | Animation delay in ms |

---

## ToastProvider

Theme-aware toast notification provider using Sonner.

### Setup

Place once at your app root:

```jsx
<ToastProvider />
```

### Usage

```jsx
import { toast } from 'sonner';

toast('Hello world');
toast.success('Saved successfully');
toast.error('Something failed');
toast.info('FYI notification');
toast.warning('Watch out');
```

### Features

- Close button with status-colored accent
- Bottom-right positioning
- Theme-aware colors
- Max 4 visible toasts

---

## Skeleton

Shimmer-animated placeholder matching real content layouts.

### Base Skeleton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Dimensions and shape classes |

### Pre-built Skeletons

Each skeleton is a full-page placeholder matching the real page layout:

- `DashboardSkeleton` - Stats cards + charts + task list
- `TaskListSkeleton` - Task rows
- `TaskDetailSkeleton` - Task header + description + subtasks
- `SessionListSkeleton` - Session table rows
- `SessionDetailSkeleton` - Session timeline
- `AgentListSkeleton` - Agent cards
- `ActivitySkeleton` - Activity feed
- `ExpensesSkeleton` - Cost table
- `PeopleSkeleton` - User list
- `AlertsSkeleton` - Alert cards
- `AISkeleton` - AI panel
- `KnowledgeSkeleton` - Document list
- `SettingsSkeleton` - Settings form
- `GlobalSettingsSkeleton` - Global settings
- `ProjectsSkeleton` - Project card grid
- `GlobalTasksSkeleton` - Global task list
- `DocumentationSkeleton` - Doc sections
- `QueueSkeleton` - Queue items

---

## SubtaskTimeline

Collapsible subtask list with theme-aware status indicators and scrollable content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `subtasks` | `object[]` | `[]` | Array of subtask objects |
| `defaultOpen` | `boolean` | `false` | Start expanded |

### Subtask Object Shape

```js
{
  id: string,
  title: string,
  status: 'pending' | 'in_progress' | 'code_complete' | 'tests_passing' | 'validated' | 'completed' | 'rework' | 'failed',
  description?: string,
  commitHash?: string,
}
```

### Features

- Collapsible with toggle arrow
- Progress bar with percentage
- Scrollable (max 280px)
- Click to expand description
- Status icons and colored labels

---

## ThemeGrid

Visual grid of theme cards for selection.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themes` | `object` | - | Theme map (id -> theme object) |
| `activeId` | `string` | - | Currently active theme ID |
| `onSelect` | `function` | - | Called with theme ID |
| `onDelete` | `function` | - | Called with custom theme ID |

---

## ThemeProvider

Context provider for the theming system.

### Usage

```jsx
import { ThemeProvider, useTheme } from './ui-kit';

// Wrap app:
<ThemeProvider>{children}</ThemeProvider>

// Use in any component:
const {
  themeId,           // Current theme ID
  theme,             // Current theme object { id, name, vars, ... }
  setTheme,          // Switch theme by ID
  themes,            // All themes (built-in + custom)
  customThemes,      // Custom themes only
  saveCustomTheme,   // Create/update custom theme
  deleteCustomTheme, // Delete custom theme
  exportTheme,       // Export theme as JSON string
  importTheme,       // Import theme from JSON string
} = useTheme();
```

---

## Design Tokens

### Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | `0.875rem` | Buttons, inputs, badges |
| `rounded-xl` | `1.25rem` | Cards, dropdowns, tooltips |
| `rounded-2xl` | `1.625rem` | Panels, modals, major sections |
| `rounded-full` | `9999px` | Pills, avatars, tags |

### Spacing Scale

Standard Tailwind spacing with `--spacing-sidebar: 240px` for sidebar width.

### Typography

| Class | Font | Usage |
|-------|------|-------|
| `font-sans` | Plus Jakarta Sans | Body text, headings, UI |
| `font-mono` | JetBrains Mono | Code, hashes, timestamps |

### Animation Classes

| Class | Effect |
|-------|--------|
| `animate-in fade-in duration-200` | Fade in |
| `animate-in slide-in-from-top-2` | Slide down |
| `skeleton-pulse` | Skeleton shimmer |
| `animate-spin-once` | Single 360 spin |

---

## SwiftGifts Components

All SwiftGifts-specific components are in `components/swift/`. They follow the same theme-aware patterns but are tailored for the Telegram Mini App ecosystem.

### LineChart

Pure SVG line chart with gradient fill, timeframe selector, and hover tooltip.

```jsx
import { LineChart } from './components/swift/LineChart';

<LineChart
  title="Market Cap"
  timeframes={['1d', '1w', '1m', '3m']}
  data={{
    '1d': { labels: ['00:00', '08:00', '16:00', '23:59'], values: [2.1e9, 2.3e9, 2.4e9, 2.6e9] },
  }}
  color="var(--color-accent)"
  height={240}
/>
```

**Props**: `title`, `timeframes` (string[]), `data` (`{ [tf]: { labels, values } }`), `color`, `height` (px), `showArea` (bool), `className`

### BarChart

SVG bar chart with timeframe selector.

```jsx
import { BarChart } from './components/swift/BarChart';

<BarChart
  title="Volume"
  timeframes={['1d', '1w', '1m']}
  data={{ '1d': { labels: [...], values: [...] } }}
  color="var(--color-accent)"
  height={200}
/>
```

**Props**: `title`, `timeframes`, `data`, `color`, `height`, `className`

### WhaleFlowChart

Scrollable vertical bar chart with opacity encoding volume and hover stats.

```jsx
import { WhaleFlowChart } from './components/swift/WhaleFlowChart';

<WhaleFlowChart
  title="Whale Net Flow"
  timeframes={['1h', '6h', '1d']}
  data={{
    '1h': [{ count: 18, volume: 45, label: '0m' }, ...],
  }}
/>
```

**Props**: `title`, `timeframes`, `data` (`{ [tf]: { count, volume, label }[] }`), `className`

### HealthScoreGauge

3/4 arc gauge with red/yellow/green segments.

```jsx
import { HealthScoreGauge } from './components/swift/HealthScoreGauge';

<HealthScoreGauge value={72} label="Health Score" />
```

**Props**: `value` (0-100), `label`, `className`

### Heatmap

Treemap-style heatmap with click-to-detail panel below the grid.

```jsx
import { Heatmap } from './components/swift/Heatmap';

<Heatmap
  title="Heatmap"
  timeframes={['12h', '24h', '3d', '7d', '30d']}
  data={{
    '24h': [
      { id: 'ton', name: 'TON', change: 12.5, price: 5.82, volume: '1.2B', mcap: '20B' },
      ...
    ],
  }}
/>
```

**Props**: `title`, `timeframes`, `data` (`{ [tf]: { id, name, change, price?, volume?, mcap?, holders? }[] }`), `className`

### GiftCard

Telegram-style gift card with backdrop gradient, paper texture, squircle corners.

```jsx
import { GiftCard } from './components/swift/GiftCard';

<GiftCard
  name="Berry Box"
  image="/swift-assets/img/berry-box.webp"
  provider="Getgems"
  priceTon={0.3}
  priceUsd={1.74}
  inCart={false}
  onToggleCart={() => {}}
/>
```

**Props**: `name`, `image`, `provider`, `priceTon`, `priceUsd`, `inCart`, `onToggleCart`, `backdrop` (custom gradient), `className`

### ItemCard

Simpler item card variant.

**Props**: `name`, `image`, `provider`, `price`, `currency`, `soldOut`, `inCart`, `onToggleCart`, `className`

### OrderCard

Order summary card with fee breakdown.

**Props**: `items`, `fees`, `total`, `currency`, `onBuy`, `onAddToCart`, `className`

### CurrencyBadge

Small badge showing currency icon + value. Supports TON, USDT, STON, DUST, Web3, DaoLama, BOLT, and gem.

```jsx
import { CurrencyBadge } from './components/swift/CurrencyBadge';

<CurrencyBadge currency="ton" value="2.5" />
<CurrencyBadge currency="gem" value="100" />
<CurrencyBadge currency="ston" value="45" />
```

**Props**: `currency` (ton/gem/usdt/ston/dust/web3/daolama/bolt), `value`, `className`

### TimeframeControl

Row of timeframe buttons with single-select accent highlight.

```jsx
import { TimeframeControl } from './components/swift/TimeframeControl';

<TimeframeControl options={['1h', '6h', '1d', '1w']} value="1d" onChange={setTf} />
```

**Props**: `options` (string[]), `value`, `onChange`

### SegmentedControl

Pill-style segmented tabs.

```jsx
import { SegmentedControl } from './components/swift/SegmentedControl';

<SegmentedControl
  options={[
    { id: 'overview', label: 'Overview' },
    { id: 'whales', label: 'Whales' },
  ]}
  value="overview"
  onChange={setSegment}
/>
```

**Props**: `options` (`{ id, label }[]`), `value`, `onChange`

### FilterDropdown

Dropdown button for filter options.

```jsx
import { FilterDropdown } from './components/swift/FilterDropdown';

<FilterDropdown
  options={[
    { id: 'all', label: 'All' },
    { id: 'gainers', label: 'Gainers' },
  ]}
  value="all"
  onChange={setFilter}
/>
```

**Props**: `options` (`{ id, label }[]`), `value`, `onChange`, `className`

### AchievementCard

Achievement tile with completed/locked states.

**Props**: `icon`, `title`, `subtitle`, `completed`, `pinned`, `onClick`, `className`

### CheckInBonus

7-day check-in grid with gem rewards and claim button.

**Props**: `days` (`{ reward, isAvailable, isClaimed }[]`), `onClaim`, `className`

### ReferralCard

Referral stats card with invite/copy buttons.

**Props**: `earnedTon`, `earnedDiamonds`, `invitedCount`, `badgeLevel`, `badgeProgress`, `onInvite`, `onCopy`, `className`

### StatsTriplet

Three stat blocks in a row.

```jsx
import { StatsTriplet } from './components/swift/StatsTriplet';

<StatsTriplet
  items={[
    { label: 'Earned', value: '12.5 TON' },
    { label: 'Volume', value: '$1.2K' },
    { label: 'Orders', value: '48' },
  ]}
/>
```

**Props**: `items` (`{ label, value }[]`), `className`

### BatteryIndicator

Battery icon with 4 states.

```jsx
import { BatteryIndicator } from './components/swift/BatteryIndicator';

<BatteryIndicator state="full" />
<BatteryIndicator state="low" />
```

**Props**: `state` (none/low/half/full), `size`, `className`

### DegenModeCard

Subscription card with crosshair icon.

**Props**: `active`, `expiresAt`, `onPress`, `className`

### SwiftIcons

Inline SVG icons that inherit `currentColor`.

```jsx
import { TonIcon, GemIcon, PresentIcon, StarIcon, CrownIcon, WalletIcon, BatteryIcon } from './components/swift/SwiftIcons';

<TonIcon size={16} />         // TON blue circle logo
<GemIcon size={16} />         // Phosphor SketchLogo (gem/crystal shape)
<PresentIcon size={16} />     // Gift box
<BatteryIcon state="full" />  // Battery with fill level
```

**Props** (all): `size`, `className`. `BatteryIcon` also takes `state`.
