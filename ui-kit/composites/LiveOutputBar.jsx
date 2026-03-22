import { useRef, useEffect, useCallback, useState } from 'react';
import {
  Terminal, X, Circle, PushPin, Stop,
  Eraser, Minus, ArrowsOutSimple, ArrowsInSimple,
} from '@phosphor-icons/react';
import { useLiveOutput } from '../context/LiveOutputContext.jsx';

// ── Line type colours (theme-aware) ──────────────────────────────

const lineColors = {
  output:    'text-text-primary',
  assistant: 'text-text-primary',
  tool:      'text-accent',
  result:    'text-success',
  complete:  'text-success',
  error:     'text-danger',
};

// ── Tab component ────────────────────────────────────────────────

function SessionTab({ session, isActive, onActivate, onClose }) {
  return (
    <button
      onClick={onActivate}
      className={`group/tab relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors shrink-0 ${
        isActive
          ? 'text-text-primary bg-surface-overlay'
          : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover/40'
      }`}
    >
      <Terminal size={11} className={isActive ? 'text-accent' : ''} />

      <span className="truncate max-w-[120px]">{session.title}</span>

      {session.isActive && (
        <Circle size={6} weight="fill" className="text-success animate-pulse shrink-0" />
      )}

      {session.pinned && (
        <PushPin size={8} weight="fill" className="text-accent/50 shrink-0" />
      )}

      <span
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="ml-0.5 p-0.5 rounded-md opacity-0 group-hover/tab:opacity-100 hover:bg-surface-hover text-text-muted hover:text-text-secondary transition-all shrink-0"
      >
        <X size={9} />
      </span>

      {/* Active indicator line */}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
      )}
    </button>
  );
}

// ── Terminal content ─────────────────────────────────────────────

function TerminalContent({ session }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.lines?.length]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted/30">
        <div className="text-center">
          <Terminal size={28} className="mx-auto mb-2" />
          <p className="text-xs">No session selected</p>
        </div>
      </div>
    );
  }

  const { lines, isActive } = session;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-[1.8]"
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted/30">
          <Terminal size={24} />
          <span className="text-[11px]">
            {isActive ? 'Waiting for output...' : 'Session open -- output will appear when the task runs'}
          </span>
        </div>
      ) : (
        <>
          <div className="text-success mb-1.5">
            <span className="text-text-muted">~</span> session started
          </div>
          {lines.map((line, i) => {
            const color = lineColors[line.type] || lineColors.output;
            return (
              <div key={i} className={`${color} whitespace-pre-wrap break-all`}>
                {line.type === 'tool' && <span className="text-success">$ </span>}
                {line.type === 'error' && <span className="text-danger font-semibold">ERR </span>}
                {line.text}
              </div>
            );
          })}
          {isActive && (
            <div className="flex items-center gap-1 text-success mt-1">
              <span>$</span>
              <span className="w-2 h-4 bg-accent animate-pulse" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Status bar ───────────────────────────────────────────────────

function StatusBar({ session }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session?.isActive || !session?.startedAt) {
      setElapsed(0);
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - session.startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.isActive, session?.startedAt]);

  if (!session) return null;

  const toolLines = session.lines.filter(l => l.type === 'tool').length;
  const errorLines = session.lines.filter(l => l.type === 'error').length;

  return (
    <div className="flex items-center justify-between px-3 h-6 bg-surface-raised border-t border-border-subtle text-text-muted text-[10px] shrink-0">
      <div className="flex items-center gap-3">
        {session.isActive ? (
          <div className="flex items-center gap-1">
            <Circle size={7} weight="fill" className="text-success animate-pulse" />
            <span>Running</span>
          </div>
        ) : (
          <span>Idle</span>
        )}
        <span>{session.lines.length} lines</span>
        {elapsed > 0 && <span>{elapsed}s</span>}
      </div>
      <div className="flex items-center gap-3">
        {toolLines > 0 && <span>{toolLines} ops</span>}
        {errorLines > 0 && <span className="text-red-200">{errorLines} errors</span>}
        {session.pinned && <span>Pinned</span>}
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────

export function LiveOutputBar() {
  const {
    sessions,
    activeId,
    setActiveId,
    minimized,
    setMinimized,
    panelHeight,
    setPanelHeight,
    closeSession,
    togglePin,
    clearSession,
    hasOpenSessions,
  } = useLiveOutput();

  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef({ startY: 0, origH: 0 });

  // ── Resize from top edge ─────────────────────────────────────
  const onResizeStart = useCallback((e) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = { startY: e.clientY, origH: panelHeight };
  }, [panelHeight, isMaximized]);

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e) => {
      const dy = resizeRef.current.startY - e.clientY;
      setPanelHeight(Math.max(160, Math.min(window.innerHeight * 0.8, resizeRef.current.origH + dy)));
    };
    const onUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, setPanelHeight]);

  const activeSession = sessions.find(s => s.id === activeId) || null;

  // ── Stop task handler ────────────────────────────────────────
  const handleStop = useCallback(async () => {
    if (!activeSession) return;
    try {
      const url = `/api/projects/${activeSession.projectId}/tasks/${activeSession.taskId}/status`;
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
    } catch {
      // Silently fail -- the task may already be done
    }
  }, [activeSession]);

  if (!hasOpenSessions) return null;

  const height = isMaximized
    ? 'calc(100vh - 48px)' // leave room for the top bar
    : minimized
    ? 'auto'
    : `${panelHeight}px`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t border-border-subtle bg-surface overflow-hidden rounded-tl-xl"
      style={{
        height,
        userSelect: isResizing ? 'none' : 'auto',
      }}
    >
      {/* ── Resize handle ──────────────────────────────────────── */}
      {!minimized && !isMaximized && (
        <div
          onMouseDown={onResizeStart}
          className="h-1.5 cursor-ns-resize shrink-0 flex items-center justify-center hover:bg-accent/10 transition-colors"
        >
          <div className="w-8 h-0.5 rounded-full bg-border" />
        </div>
      )}

      {/* ── Tab bar ────────────────────────────────────────────── */}
      <div className="flex items-center h-9 bg-surface-raised border-b border-border-subtle shrink-0">
        {/* Tabs */}
        <div className="flex items-center flex-1 min-w-0 overflow-x-auto">
          {sessions.map((session, i) => (
            <div key={session.id} className="flex items-center shrink-0">
              {i > 0 && <div className="w-px h-4 bg-border-subtle shrink-0" />}
              <SessionTab
                session={session}
                isActive={session.id === activeId}
                onActivate={() => {
                  if (session.id === activeId && !minimized) {
                    setMinimized(true);
                  } else {
                    setActiveId(session.id);
                    setMinimized(false);
                  }
                }}
                onClose={() => closeSession(session.id)}
              />
            </div>
          ))}
        </div>

        {/* Tab bar controls */}
        <div className="flex items-center gap-0.5 px-2 shrink-0">
          {/* Stop task */}
          {activeSession?.isActive && (
            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium text-danger/80 hover:text-danger hover:bg-danger/5 rounded-md transition-colors"
              title="Stop task"
            >
              <Stop size={10} weight="fill" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}

          {/* Pin toggle */}
          {activeSession && (
            <button
              onClick={() => togglePin(activeSession.id)}
              className={`p-1 rounded-md transition-colors ${
                activeSession.pinned
                  ? 'text-accent bg-accent/10'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-overlay'
              }`}
              title={activeSession.pinned ? 'Unpin session' : 'Pin session (persists on reload)'}
            >
              <PushPin size={11} weight={activeSession.pinned ? 'fill' : 'regular'} />
            </button>
          )}

          {/* Clear */}
          {activeSession && (
            <button
              onClick={() => clearSession(activeSession.id)}
              className="p-1 text-text-muted hover:text-text-secondary hover:bg-surface-overlay rounded-md transition-colors"
              title="Clear output"
            >
              <Eraser size={11} />
            </button>
          )}

          {/* Minimize */}
          <button
            onClick={() => setMinimized(v => !v)}
            className="p-1 text-text-muted hover:text-text-secondary hover:bg-surface-overlay rounded-md transition-colors"
            title={minimized ? 'Expand' : 'Minimize'}
          >
            <Minus size={11} />
          </button>

          {/* Maximize */}
          <button
            onClick={() => { setIsMaximized(v => !v); setMinimized(false); }}
            className="p-1 text-text-muted hover:text-text-secondary hover:bg-surface-overlay rounded-md transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <ArrowsInSimple size={11} /> : <ArrowsOutSimple size={11} />}
          </button>

          {/* Close all */}
          <button
            onClick={() => sessions.forEach(s => closeSession(s.id))}
            className="p-1 text-text-muted hover:text-danger hover:bg-danger/5 rounded-md transition-colors"
            title="Close all sessions"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* ── Terminal content ────────────────────────────────────── */}
      {!minimized && (
        <TerminalContent session={activeSession} />
      )}

      {/* ── Status bar ─────────────────────────────────────────── */}
      {!minimized && (
        <StatusBar session={activeSession} />
      )}
    </div>
  );
}
