import { useRef, useEffect, useState } from 'react';
import {
  Terminal, X, Circle,
  File, FileCss, FileJs, FileTs, FileJsx,
  FileHtml, FileMd, Folder, FolderOpen,
  Sidebar,
} from '@phosphor-icons/react';
import { useCliStream } from '../hooks/useCliStream.js';

// ── File icon by extension ───────────────────────────────────────

function FileIcon({ name, isFolder, isOpen }) {
  if (isFolder) {
    return isOpen
      ? <FolderOpen size={14} className="text-blue-400 shrink-0" weight="fill" />
      : <Folder size={14} className="text-blue-400 shrink-0" weight="fill" />;
  }
  const ext = name.split('.').pop()?.toLowerCase();
  const iconMap = {
    jsx: { icon: FileJsx, color: 'text-cyan-400' },
    tsx: { icon: FileTs, color: 'text-cyan-400' },
    js: { icon: FileJs, color: 'text-yellow-400' },
    ts: { icon: FileTs, color: 'text-blue-400' },
    css: { icon: FileCss, color: 'text-blue-500' },
    json: { icon: File, color: 'text-yellow-500' },
    md: { icon: FileMd, color: 'text-gray-400' },
    html: { icon: FileHtml, color: 'text-orange-400' },
  };
  const match = iconMap[ext];
  if (match) {
    const Icon = match.icon;
    return <Icon size={14} className={`${match.color} shrink-0`} />;
  }
  return <File size={14} className="text-text-muted shrink-0" />;
}

// ── Line type styling (matches VS Code terminal colors) ──────────

const lineStyles = {
  output: { color: 'text-[#cccccc]', prefix: null },
  assistant: { color: 'text-[#e0e0e0]', prefix: null },
  tool: { color: 'text-[#007acc]', prefix: '$ ' },
  result: { color: 'text-success', prefix: null },
  complete: { color: 'text-success', prefix: null },
  error: { color: 'text-danger', prefix: 'ERR ' },
};

// ── Extract file tree from tool calls ────────────────────────────

function extractFiles(lines) {
  const files = new Set();
  for (const line of lines) {
    if (line.type === 'tool') {
      // Match common patterns: file paths in tool output
      const pathMatch = line.text.match(/(?:(?:read|write|edit|create|delete|open)\s+)?((?:[\w.-]+\/)+[\w.-]+\.\w+)/i);
      if (pathMatch) files.add(pathMatch[1]);
      // Also grab paths that look like they're in quotes or backticks
      const quotedPaths = line.text.match(/[`"']((?:[\w.-]+\/)*[\w.-]+\.\w+)[`"']/g);
      if (quotedPaths) {
        for (const p of quotedPaths) files.add(p.replace(/[`"']/g, ''));
      }
    }
  }
  return Array.from(files).sort();
}

// ── Main IDE-style Panel ─────────────────────────────────────────

/**
 * IDE-style live CLI output panel.
 * Designed to resemble Cursor/VS Code with:
 * - File explorer sidebar (extracted from tool calls)
 * - Terminal output with syntax-colored lines
 * - Tab bar header
 * - Status bar footer
 */
export function CliStreamPanel({ taskId, onClose }) {
  const { lines, isActive, clear } = useCliStream({ taskId });
  const scrollRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines.length]);

  const files = extractFiles(lines);
  const toolLines = lines.filter(l => l.type === 'tool').length;
  const errorLines = lines.filter(l => l.type === 'error').length;

  return (
    <div className="rounded-2xl border border-[#3e3e42] bg-[#1e1e1e] overflow-hidden flex flex-col" style={{ minHeight: 320 }}>
      {/* ── Tab bar / Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-2 h-9 bg-[#252526] border-b border-[#3e3e42] shrink-0">
        <div className="flex items-center gap-1">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1 rounded hover:bg-[#2d2d30] transition-colors text-[#969696]"
          >
            <Sidebar size={13} />
          </button>

          {/* Active tab */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] border-t-2 border-t-[#007acc] rounded-t-sm ml-1">
            <Terminal size={12} className="text-[#007acc]" />
            <span className="text-[11px] font-medium text-[#cccccc]">Terminal</span>
            {isActive && (
              <Circle size={7} weight="fill" className="text-success animate-pulse" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={clear}
            className="text-[9px] text-[#969696] hover:text-[#cccccc] transition-colors px-2 py-1 rounded hover:bg-[#2d2d30]"
          >
            Clear
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-[#969696] hover:text-[#cccccc] hover:bg-[#2d2d30] rounded transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Body: sidebar + terminal ─────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* File explorer sidebar */}
        {sidebarOpen && (
          <div className="w-48 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 overflow-hidden">
            {/* Explorer header */}
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#969696] uppercase tracking-wider">
              Explorer
            </div>

            {/* File list */}
            <div className="flex-1 overflow-y-auto px-1 pb-2">
              {files.length === 0 ? (
                <div className="px-2 py-4 text-[10px] text-[#969696]/50 text-center italic">
                  Files will appear as the agent works
                </div>
              ) : (
                files.map(f => {
                  const parts = f.split('/');
                  const fileName = parts[parts.length - 1];
                  const isSelected = selectedFile === f;

                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFile(isSelected ? null : f)}
                      className={`flex items-center gap-1.5 w-full text-left px-2 py-1 rounded-sm text-[11px] font-mono transition-colors ${
                        isSelected
                          ? 'bg-[#007acc]/20 text-[#007acc] border-r-2 border-r-[#007acc]'
                          : 'text-[#cccccc] hover:bg-[#2d2d30]'
                      }`}
                      title={f}
                    >
                      <FileIcon name={fileName} />
                      <span className="truncate">{fileName}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Terminal output area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Terminal content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-[1.7] min-h-[200px]"
            style={{ fontFamily: "'SF Mono', 'JetBrains Mono', Monaco, Consolas, monospace" }}
          >
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-[#969696]/40">
                <Terminal size={24} />
                <span className="text-[11px]">
                  {isActive ? 'Waiting for output...' : 'Start a task to see live output'}
                </span>
              </div>
            ) : (
              <>
                {/* Prompt header */}
                <div className="text-success mb-2">
                  <span className="text-[#969696]">~</span> agent session started
                </div>

                {lines.map((line, i) => {
                  const style = lineStyles[line.type] || lineStyles.output;
                  // Filter by selected file
                  if (selectedFile && line.type === 'tool' && !line.text.includes(selectedFile)) {
                    return null;
                  }

                  return (
                    <div key={i} className={`${style.color} whitespace-pre-wrap break-all`}>
                      {line.type === 'tool' && (
                        <span className="text-success">$ </span>
                      )}
                      {line.type === 'error' && (
                        <span className="text-danger font-semibold">ERR </span>
                      )}
                      {line.text}
                    </div>
                  );
                })}

                {isActive && (
                  <div className="flex items-center gap-1 text-success mt-1">
                    <span>$</span>
                    <span className="w-2 h-4 bg-[#007acc] animate-pulse" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Status bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 h-6 bg-[#007acc] text-white text-[10px] shrink-0">
        <div className="flex items-center gap-3">
          {isActive ? (
            <div className="flex items-center gap-1">
              <Circle size={7} weight="fill" className="animate-pulse" />
              <span>Running</span>
            </div>
          ) : (
            <span>Idle</span>
          )}
          <span>{lines.length} lines</span>
        </div>
        <div className="flex items-center gap-3">
          {toolLines > 0 && <span>{toolLines} operations</span>}
          {errorLines > 0 && <span className="text-red-200">{errorLines} errors</span>}
          {files.length > 0 && <span>{files.length} files touched</span>}
        </div>
      </div>
    </div>
  );
}
