import { clsx } from 'clsx';

/**
 * Base skeleton primitive. Renders a pulsing rounded rectangle.
 */
export function Skeleton({ className, style }) {
  return (
    <div
      className={clsx('bg-surface-overlay rounded-xl skeleton-pulse', className)}
      style={style}
    />
  );
}

/**
 * Skeleton for a single line of text.
 */
function TextLine({ width = '100%', className }) {
  return <Skeleton className={clsx('h-3', className)} style={{ width }} />;
}

/**
 * Skeleton shaped like a card row (icon + text lines).
 */
function CardRow({ className }) {
  return (
    <div className={clsx('flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-raised border border-border-subtle/40', className)}>
      <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <TextLine width="55%" />
        <TextLine width="35%" className="h-2.5" />
      </div>
      <Skeleton className="w-14 h-5 rounded-full shrink-0" />
    </div>
  );
}

/**
 * Skeleton shaped like a project card.
 */
function ProjectCard({ className }) {
  return (
    <div className={clsx('rounded-2xl bg-surface-raised border border-border-subtle/40 p-5 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <TextLine width="50%" />
          <TextLine width="70%" className="h-2" />
        </div>
      </div>
      <TextLine width="80%" className="h-2" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="w-12 h-4 rounded-full" />
        <Skeleton className="w-16 h-4 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a table row with N columns.
 */
function TableRow({ cols = 5, className }) {
  return (
    <div className={clsx('flex items-center gap-4 px-4 py-3 border-b border-border-subtle/30', className)}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3 rounded-md"
          style={{ width: i === 0 ? '30%' : `${12 + Math.random() * 10}%`, flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for a stat card.
 */
function StatCard({ className }) {
  return (
    <div className={clsx('rounded-2xl bg-surface-raised border border-border-subtle/40 p-4 space-y-2', className)}>
      <TextLine width="40%" className="h-2" />
      <Skeleton className="h-6 w-12 rounded-lg" />
    </div>
  );
}

/**
 * Skeleton for a detail page header.
 */
function DetailHeader({ className }) {
  return (
    <div className={clsx('space-y-4', className)}>
      <Skeleton className="h-3 w-20 rounded-full" />
      <div className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
          <TextLine width="45%" className="h-4" />
        </div>
        <TextLine width="70%" />
        <TextLine width="55%" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for a sidebar metadata block.
 */
function MetaSidebar({ className }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-4 space-y-2.5">
          <TextLine width="35%" className="h-2" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ── Composed page-level skeletons ──────────────────────────────────

/**
 * Full-page skeleton with a header bar and grid of project cards.
 */
export function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-2.5 w-48 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <ProjectCard key={i} />)}
      </div>
    </div>
  );
}

/**
 * Task list skeleton (table view).
 */
export function TaskListSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-2.5 w-16 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5, 6].map(i => <CardRow key={i} />)}
      </div>
    </div>
  );
}

/**
 * Queue / simple list skeleton.
 */
export function QueueSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="flex gap-3">
        {[1, 2, 3, 4].map(i => <StatCard key={i} className="flex-1" />)}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-14 rounded-full" />
        <Skeleton className="h-7 w-14 rounded-full" />
      </div>
      <div className="space-y-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-raised border border-border-subtle/40">
            <Skeleton className="w-5 h-5 rounded-md shrink-0" />
            <div className="flex-1 space-y-1.5">
              <TextLine width={`${40 + i * 5}%`} />
              <TextLine width="25%" className="h-2" />
            </div>
            <Skeleton className="w-3 h-3 rounded-sm shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * People / members list skeleton.
 */
export function PeopleSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-2.5 w-52 rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-full" />
      <div className="space-y-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-surface-raised border border-border-subtle/40">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <TextLine width="35%" />
              <TextLine width="50%" className="h-2" />
            </div>
            <Skeleton className="w-16 h-5 rounded-full shrink-0" />
            <Skeleton className="w-28 h-7 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Table-based page skeleton (Team, GlobalTasks table view, Sessions, etc.).
 */
export function TableSkeleton({ title = true, stats = false, cols = 5, rows = 6 }) {
  return (
    <div className="space-y-5">
      {title && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      )}
      {stats && (
        <div className="flex gap-3">
          {[1, 2, 3, 4].map(i => <StatCard key={i} className="flex-1" />)}
        </div>
      )}
      <Skeleton className="h-9 w-full rounded-full" />
      <div className="rounded-lg border border-border-subtle/40 overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-2.5 bg-surface-raised/50 border-b border-border-subtle/30">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-2 rounded-sm" style={{ width: `${14 + i * 3}%` }} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => <TableRow key={i} cols={cols} />)}
      </div>
    </div>
  );
}

/**
 * Settings / form page skeleton.
 */
export function SettingsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-5 w-28 rounded-lg" />
        <Skeleton className="h-2.5 w-56 rounded-md" />
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
      </div>
      <div className="space-y-6 pt-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-2.5 w-20 rounded-md" />
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        ))}
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Dashboard skeleton.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <StatCard key={i} />)}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-7 w-16 rounded-full" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-1.5">
          {[1, 2, 3, 4, 5].map(i => <CardRow key={i} />)}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-raised border border-border-subtle/40">
              <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
              <TextLine width={`${50 + i * 5}%`} className="h-2" />
              <Skeleton className="w-8 h-2 rounded-sm shrink-0 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Task detail page skeleton.
 */
export function TaskDetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-3 w-16 rounded-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <DetailHeader />
          <div className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-5 space-y-3">
            <TextLine width="20%" className="h-2" />
            <TextLine width="90%" />
            <TextLine width="75%" />
            <TextLine width="60%" />
          </div>
          <div className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-5 space-y-3">
            <TextLine width="18%" className="h-2" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-overlay/40">
                <Skeleton className="w-3 h-3 rounded-md shrink-0" />
                <TextLine width={`${40 + i * 10}%`} />
                <Skeleton className="w-14 h-4 rounded-full shrink-0 ml-auto" />
              </div>
            ))}
          </div>
        </div>
        <MetaSidebar />
      </div>
    </div>
  );
}

/**
 * Alerts page skeleton.
 */
export function AlertsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-5 w-20 rounded-lg" />
        <Skeleton className="h-2.5 w-56 rounded-md" />
      </div>
      <div className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <TextLine width="25%" className="h-4" />
            <TextLine width="45%" className="h-2" />
          </div>
          <Skeleton className="w-10 h-5 rounded-full shrink-0" />
        </div>
        <div className="rounded-xl bg-surface-overlay/40 p-4 space-y-3">
          <TextLine width="20%" className="h-2" />
          <Skeleton className="h-9 w-full rounded-full" />
        </div>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-overlay/30">
              <Skeleton className="w-5 h-5 rounded-md shrink-0" />
              <TextLine width="40%" />
              <Skeleton className="w-14 h-5 rounded-full shrink-0 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * AI page skeleton.
 */
export function AISkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-5 w-28 rounded-lg" />
        <Skeleton className="h-2.5 w-52 rounded-md" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <TextLine width="30%" className="h-3.5" />
              <TextLine width="50%" className="h-2" />
            </div>
          </div>
          <div className="space-y-2">
            <TextLine width="15%" className="h-2" />
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Activity / event list skeleton.
 */
export function ActivitySkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-24 rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-full" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-7 w-16 rounded-full" />)}
      </div>
      <div className="rounded-lg border border-border-subtle/40 overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b border-border-subtle/30 last:border-0">
            <Skeleton className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="flex gap-2">
                <Skeleton className="h-2.5 w-28 rounded-sm" />
                <Skeleton className="h-3 w-14 rounded-sm" />
                <Skeleton className="h-2.5 w-10 rounded-sm ml-auto" />
              </div>
              <TextLine width={`${40 + i * 5}%`} className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Agents page skeleton.
 */
export function AgentsSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-24 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <TextLine width="40%" className="h-3.5" />
                <TextLine width="60%" className="h-2" />
              </div>
              <Skeleton className="w-14 h-5 rounded-full shrink-0" />
            </div>
            <div className="space-y-1.5">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-overlay/30">
                  <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                  <TextLine width={`${30 + j * 10}%`} className="h-2.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Session detail skeleton.
 */
export function SessionDetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-3 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-48 rounded-lg" />
        <TextLine width="30%" className="h-2.5" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <StatCard key={i} />)}
      </div>
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Skeleton className="w-2 h-2 rounded-full" />
              {i < 5 && <Skeleton className="w-px h-12 rounded-none bg-border-subtle/40" />}
            </div>
            <div className="flex-1 rounded-xl bg-surface-raised border border-border-subtle/40 p-3 space-y-2">
              <TextLine width={`${30 + i * 8}%`} className="h-2.5" />
              <TextLine width="60%" className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Expenses page skeleton.
 */
export function ExpensesSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-28 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <StatCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl bg-surface-raised border border-border-subtle/40 p-5 space-y-3">
            <TextLine width="25%" className="h-3" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border-subtle/40 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => <TableRow key={i} cols={4} />)}
      </div>
    </div>
  );
}

/**
 * Knowledge base skeleton.
 */
export function KnowledgeBaseSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-36 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <StatCard key={i} />)}
      </div>
      <Skeleton className="h-9 w-full rounded-full" />
      <div className="rounded-lg border border-border-subtle/40 overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-2.5 bg-surface-raised/50 border-b border-border-subtle/30">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-2 rounded-sm" style={{ width: `${12 + i * 3}%` }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5, 6].map(i => <TableRow key={i} cols={5} />)}
      </div>
    </div>
  );
}

/**
 * Integrations / engine status skeleton.
 */
export function IntegrationsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-3 w-20 rounded-md" />
      <Skeleton className="h-2.5 w-64 rounded-md" />
      {[1, 2].map(i => (
        <div key={i} className="rounded-lg border border-border-subtle/40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-raised/30">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-5 h-5 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-2 w-24 rounded-sm" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-2.5 w-3/4 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Members loading skeleton.
 */
export function MembersSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-24 rounded-md" />
      <Skeleton className="h-2.5 w-56 rounded-md" />
      <div className="flex items-end gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-full" />
      </div>
      <div className="rounded-xl border border-border-subtle/40 overflow-hidden">
        {[1, 2, 3, 4].map(i => <TableRow key={i} cols={4} />)}
      </div>
    </div>
  );
}
