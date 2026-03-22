import { useState } from 'react';
import {
  Clock,
  Spinner,
  Code,
  CheckCircle,
  ShieldCheck,
  Warning,
  XCircle,
  CaretDown,
  CaretRight,
} from '@phosphor-icons/react';

const STATUS_CFG = {
  pending:       { Icon: Clock,       color: 'text-text-muted',  bg: 'bg-text-muted/10',  dot: 'bg-text-muted/60' },
  in_progress:   { Icon: Spinner,     color: 'text-accent',      bg: 'bg-accent/10',      dot: 'bg-accent' },
  code_complete: { Icon: Code,        color: 'text-accent',      bg: 'bg-accent/10',      dot: 'bg-accent/70' },
  tests_passing: { Icon: CheckCircle, color: 'text-success',     bg: 'bg-success/10',     dot: 'bg-success' },
  validated:     { Icon: ShieldCheck,  color: 'text-success',     bg: 'bg-success/10',     dot: 'bg-success' },
  completed:     { Icon: CheckCircle,  color: 'text-success',     bg: 'bg-success/10',     dot: 'bg-success' },
  rework:        { Icon: Warning,      color: 'text-warning',     bg: 'bg-warning/10',     dot: 'bg-warning' },
  failed:        { Icon: XCircle,      color: 'text-danger',      bg: 'bg-danger/10',      dot: 'bg-danger' },
};

export function SubtaskTimeline({ subtasks, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [expandedId, setExpandedId] = useState(null);

  if (!subtasks || subtasks.length === 0) {
    return (
      <p className="text-[11px] text-text-muted/60 text-center py-3">
        No subtasks yet
      </p>
    );
  }

  const doneCount = subtasks.filter(s =>
    ['completed', 'validated', 'tests_passing'].includes(s.status)
  ).length;
  const progress = Math.round((doneCount / subtasks.length) * 100);

  return (
    <div className="space-y-2">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 group"
      >
        <span className="text-text-muted transition-transform duration-200" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          <CaretDown size={11} weight="bold" />
        </span>
        <span className="text-[11px] font-semibold text-text-secondary">
          {subtasks.length} subtask{subtasks.length !== 1 ? 's' : ''}
        </span>
        <span className="text-[10px] text-text-muted tabular-nums">{doneCount}/{subtasks.length}</span>

        {/* Inline progress bar */}
        <div className="flex-1 h-1 bg-surface-overlay rounded-full overflow-hidden ml-1">
          <div
            className="h-full bg-accent/60 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[9px] text-text-muted tabular-nums font-mono">{progress}%</span>
      </button>

      {/* Collapsible list */}
      {open && (
        <div
          className="space-y-1 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin"
          style={{ animation: 'dropdown-in 150ms ease-out both' }}
        >
          {subtasks.map((st, idx) => {
            const cfg = STATUS_CFG[st.status] || STATUS_CFG.pending;
            const IconComp = cfg.Icon;
            const hasDesc = st.description && st.description.trim();
            const isExpanded = expandedId === st.id;

            return (
              <div
                key={st.id}
                className={`rounded-xl transition-colors ${isExpanded ? 'bg-surface-overlay/60' : 'hover:bg-surface-overlay/40'}`}
              >
                <div
                  className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer"
                  onClick={() => hasDesc && setExpandedId(isExpanded ? null : st.id)}
                >
                  {/* Status icon */}
                  <div className={`w-6 h-6 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <IconComp
                      size={12}
                      weight="bold"
                      className={`${cfg.color} ${st.status === 'in_progress' ? 'animate-spin' : ''}`}
                    />
                  </div>

                  {/* Title + status */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text-primary truncate">
                      {st.title || st.id}
                    </p>
                  </div>

                  {/* Status label */}
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color} shrink-0`}>
                    {st.status.replace(/_/g, ' ')}
                  </span>

                  {/* Expand arrow for description */}
                  {hasDesc && (
                    <span className="text-text-muted/50 shrink-0">
                      {isExpanded ? <CaretDown size={9} /> : <CaretRight size={9} />}
                    </span>
                  )}
                </div>

                {/* Expanded description */}
                {isExpanded && hasDesc && (
                  <div className="px-2.5 pb-2.5 pl-11">
                    <p className="text-[11px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {st.description}
                    </p>
                    {st.commitHash && (
                      <span className="inline-block mt-1 text-[9px] font-mono text-text-muted bg-surface-overlay px-1.5 py-0.5 rounded">
                        {st.commitHash.slice(0, 7)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
