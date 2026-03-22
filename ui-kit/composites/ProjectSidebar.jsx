import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Gauge, Kanban, Terminal, Pulse, Wallet,
  SlidersHorizontal, ClockCounterClockwise,
  Megaphone, ArrowLeft, FolderOpen, BookOpen,
  Spinner, X, CaretDown, CaretRight,
  UsersThree, CursorClick,
} from '@phosphor-icons/react';
import { useProject } from '../context/ProjectContext.jsx';
import { useI18n } from '../i18n/index.jsx';

export function ProjectSidebar({ mobileOpen, onMobileClose }) {
  const { projectId, project, loading } = useProject();
  const { t } = useI18n();
  const [aiExpanded, setAiExpanded] = useState(true);

  const base = `/projects/${projectId}`;

  const topNav = [
    { to: base, label: t('nav.dashboard'), icon: Gauge, end: true },
    { to: `${base}/tasks`, label: t('nav.tasks'), icon: Kanban },
    { to: `${base}/people`, label: t('nav.people'), icon: UsersThree },
  ];

  const aiNav = [
    { to: `${base}/agents`, label: t('nav.agents'), icon: CursorClick, end: true },
    { to: `${base}/agents/sessions`, label: t('nav.sessions'), icon: ClockCounterClockwise },
    { to: `${base}/activity`, label: t('nav.activity'), icon: Pulse },
    { to: `${base}/expenses`, label: t('nav.expenses'), icon: Wallet },
    { to: `${base}/ai`, label: t('nav.aiIndex'), icon: Terminal },
  ];

  const bottomNav = [
    { to: `${base}/alerts`, label: t('nav.alerts'), icon: Megaphone },
    { to: `${base}/docs`, label: 'Project Doc', icon: BookOpen },
    { to: `${base}/settings`, label: t('nav.settings'), icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onMobileClose} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed top-0 left-0 bottom-0 w-sidebar bg-surface-raised border-r border-border-subtle flex flex-col z-50',
        'transition-transform duration-200 ease-out',
        'md:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}>
        {/* Brand + project name */}
        <div className="px-4 h-12 flex items-center justify-between border-b border-border-subtle shrink-0">
          <Link to="/" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
            <ArrowLeft size={14} />
            <h1 className="text-base font-bold tracking-tight">
              <span className="text-accent">alex</span>
              <span className="text-text-primary">bot</span>
            </h1>
          </Link>
          <button
            onClick={onMobileClose}
            className="p-1 text-text-muted hover:text-text-secondary md:hidden"
          >
            <X size={14} />
          </button>
        </div>

        {/* Project indicator */}
        <div className="px-4 py-2.5 border-b border-border-subtle bg-surface-overlay/30">
          <div className="flex items-center gap-2 min-w-0">
            <FolderOpen size={14} className="text-accent shrink-0" weight="duotone" />
            {loading ? (
              <Spinner size={12} className="animate-spin text-text-muted" />
            ) : (
              <p className="text-xs font-semibold text-text-primary truncate">
                {project?.name || t('common.loading')}
              </p>
            )}
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {/* Dashboard, Tasks, People */}
          {topNav.map(item => (
            <SidebarLink key={item.to} {...item} onClick={onMobileClose} />
          ))}

          {/* AI Section - collapsible */}
          <div className="pt-3">
            <button
              onClick={() => setAiExpanded(v => !v)}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-wider hover:text-text-secondary transition-colors rounded-md"
            >
              <Terminal size={12} className="text-text-muted" />
              <span className="flex-1 text-left">AI</span>
              {aiExpanded ? <CaretDown size={10} /> : <CaretRight size={10} />}
            </button>

            {aiExpanded && (
              <div className="mt-0.5 space-y-0.5 ml-0.5">
                {aiNav.map(item => (
                  <SidebarLink key={item.to} {...item} onClick={onMobileClose} />
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border-subtle my-3" />

          {bottomNav.map(item => (
            <SidebarLink key={item.to} {...item} onClick={onMobileClose} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border-subtle">
          <p className="text-[9px] text-text-muted font-mono uppercase tracking-widest">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, label, icon: Icon, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium',
          'transition-all duration-200 ease-out',
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={16} weight={isActive ? 'fill' : 'regular'} className="transition-all duration-200" />
          {label}
        </>
      )}
    </NavLink>
  );
}
