import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Gauge,
  Kanban,
  Terminal,
  Pulse,
  Wallet,
  SlidersHorizontal,
  ClockCounterClockwise,
  Megaphone,
  Question,
} from '@phosphor-icons/react';

const mainNav = [
  { to: '/', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/tasks', label: 'Tasks', icon: Kanban },
  { to: '/agents', label: 'Agents', icon: Terminal, end: true },
  { to: '/agents/sessions', label: 'Sessions', icon: ClockCounterClockwise },
  { to: '/activity', label: 'Activity', icon: Pulse },
  { to: '/expenses', label: 'Expenses', icon: Wallet },
];

const bottomNav = [
  { to: '/alerts', label: 'Alerts', icon: Megaphone },
  { to: '/ai', label: 'AI & Index', icon: Terminal },
  { to: '/docs', label: 'How to Use', icon: Question },
  { to: '/settings', label: 'Settings', icon: SlidersHorizontal },
];

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-sidebar bg-surface-raised border-r border-border-subtle flex flex-col z-30">
      {/* Brand */}
      <div className="px-5 h-12 flex items-center border-b border-border-subtle shrink-0">
        <h1 className="text-base font-bold tracking-tight">
          <span className="text-accent">alex</span>
          <span className="text-text-primary">bot</span>
        </h1>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {mainNav.map(item => (
          <SidebarLink key={item.to} {...item} />
        ))}

        <div className="h-px bg-border-subtle my-3" />

        {bottomNav.map(item => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border-subtle">
        <p className="text-[9px] text-text-muted font-mono uppercase tracking-widest">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}

function SidebarLink({ to, label, icon: Icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium',
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
