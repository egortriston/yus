import { clsx } from 'clsx';

export function Tabs({ children, className }) {
  return (
    <div className={clsx('overflow-x-auto scrollbar-none -mx-1 px-1', className)}>
      <div className="flex items-center gap-1 border-b border-border-subtle min-w-max">
        {children}
      </div>
    </div>
  );
}

export function Tab({ children, active = false, icon: Icon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap',
        'focus:outline-none',
        active
          ? 'text-text-primary'
          : 'text-text-muted hover:text-text-secondary',
        className
      )}
    >
      {Icon && <Icon size={16} weight={active ? 'fill' : 'regular'} />}
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
      )}
    </button>
  );
}
