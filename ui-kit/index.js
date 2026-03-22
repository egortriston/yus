// ============================================================================
// alexbot UI Kit - Component Library
// ============================================================================
// A complete, theme-aware component library extracted from the alexbot platform.
// Built with React, Tailwind CSS v4, and Phosphor Icons.
//
// Usage:
//   import { Button, Modal, CalendarPicker } from '@alexbot/ui-kit';
//
// Requirements:
//   - React 18+
//   - Tailwind CSS v4
//   - @phosphor-icons/react
//   - clsx
//   - sonner (for toasts)
// ============================================================================

// ── Primitives ──────────────────────────────────────────────────────────────
export { Button } from './components/Button.jsx';
export { Input } from './components/Input.jsx';
export { Checkbox } from './components/Checkbox.jsx';
export { Badge } from './components/Badge.jsx';
export { Tooltip } from './components/Tooltip.jsx';
export { ProgressBar } from './components/ProgressBar.jsx';
export { Loader } from './components/Loader.jsx';

// ── Form Controls ───────────────────────────────────────────────────────────
export { CustomSelect } from './components/CustomSelect.jsx';
export { ColorPicker } from './components/ColorPicker.jsx';
export { CalendarPicker } from './components/CalendarPicker.jsx';
export { PathInput } from './components/PathInput.jsx';

// ── Layout ──────────────────────────────────────────────────────────────────
export { Card, CardHeader, CardContent, CardFooter } from './components/Card.jsx';
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/Table.jsx';
export { Tabs, Tab } from './components/Tabs.jsx';
export { Modal, ModalFooter } from './components/Modal.jsx';
export { ConfirmModal } from './components/ConfirmModal.jsx';
export { EmptyState } from './components/EmptyState.jsx';
export { AnimatedList, AnimatedItem } from './components/AnimatedList.jsx';

// ── Navigation ──────────────────────────────────────────────────────────────
export { default as Sidebar } from './components/Sidebar.jsx';
export { TopBar } from './components/TopBar.jsx';

// ── Feedback ────────────────────────────────────────────────────────────────
export { ToastProvider } from './components/Toast.jsx';

// ── Skeleton Loaders ────────────────────────────────────────────────────────
export {
  Skeleton,
  DashboardSkeleton,
  TaskListSkeleton,
  TaskDetailSkeleton,
  SessionListSkeleton,
  SessionDetailSkeleton,
  AgentListSkeleton,
  ActivitySkeleton,
  ExpensesSkeleton,
  PeopleSkeleton,
  AlertsSkeleton,
  AISkeleton,
  KnowledgeSkeleton,
  SettingsSkeleton,
  GlobalSettingsSkeleton,
  ProjectsSkeleton,
  GlobalTasksSkeleton,
  DocumentationSkeleton,
  QueueSkeleton,
} from './components/Skeleton.jsx';

// ── Composite Components ────────────────────────────────────────────────────
export { SubtaskTimeline } from './composites/SubtaskTimeline.jsx';
export { ThemeGrid } from './composites/ThemeGrid.jsx';
export { ActivityFeed } from './composites/ActivityFeed.jsx';

// ── Theming ─────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme, THEMES } from './themes/ThemeContext.jsx';
