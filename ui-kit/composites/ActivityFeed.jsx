import { useState, useEffect, useCallback } from 'react';
import { useSocketEvent } from '../hooks/useSocket.js';
import { Lightning } from '@phosphor-icons/react';

const TYPE_DOT = {
  status_change: 'bg-info',
  approval: 'bg-success',
  rejection: 'bg-danger',
  retry: 'bg-warning',
  comment: 'bg-text-muted',
};

function EventItem({ ev }) {
  const [expanded, setExpanded] = useState(false);
  const taskLabel = ev.taskId?.split('/').pop() || ev.taskId || '';
  const isLong = (ev.detail || '').length > 40;

  return (
    <div
      className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-surface-overlay/40 transition-colors cursor-default group"
      onMouseEnter={() => isLong && setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => isLong && setExpanded(prev => !prev)}
    >
      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${TYPE_DOT[ev.action] || 'bg-text-muted'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-mono text-text-muted truncate max-w-[140px]">
            {taskLabel}
          </span>
          <span className="text-[10px] text-text-muted ml-auto shrink-0 tabular-nums">
            {formatTime(ev.createdAt)}
          </span>
        </div>
        {ev.detail && (
          <p className={`text-[11px] text-text-secondary mt-0.5 leading-relaxed transition-all ${
            expanded ? 'whitespace-normal break-words' : 'truncate'
          }`}>
            {ev.detail}
          </p>
        )}
      </div>
    </div>
  );
}

export function ActivityFeed({ events: initialEvents, maxItems = 50 }) {
  const [events, setEvents] = useState(initialEvents || []);

  useEffect(() => {
    if (initialEvents) setEvents(initialEvents);
  }, [initialEvents]);

  const handleTaskUpdate = useCallback((payload) => {
    setEvents(prev => [{
      id: Date.now(),
      taskId: payload.taskId,
      agent: 'system',
      action: 'status_change',
      detail: `${payload.status?.replace(/_/g, ' ')}`,
      createdAt: new Date().toISOString(),
    }, ...prev].slice(0, maxItems));
  }, [maxItems]);

  const handleQAResult = useCallback((payload) => {
    setEvents(prev => [{
      id: Date.now(),
      taskId: payload.taskId,
      agent: 'qa',
      action: payload.valid ? 'approval' : 'rejection',
      detail: payload.valid ? 'validation passed' : `${payload.errors} error(s)`,
      createdAt: new Date().toISOString(),
    }, ...prev].slice(0, maxItems));
  }, [maxItems]);

  useSocketEvent('task:updated', handleTaskUpdate);
  useSocketEvent('qa:result', handleQAResult);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Lightning size={16} className="text-text-muted mb-1.5" />
        <p className="text-[11px] text-text-muted">No activity yet</p>
      </div>
    );
  }

  return (
    <div>
      {events.map((ev) => (
        <EventItem key={ev.id} ev={ev} />
      ))}
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
