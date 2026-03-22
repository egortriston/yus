import { clsx } from 'clsx';

const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm shadow-accent/20',
  secondary: 'bg-surface-overlay hover:bg-surface-hover text-text-primary border border-border',
  ghost: 'bg-transparent hover:bg-surface-overlay text-text-secondary hover:text-text-primary',
  danger: 'bg-danger/15 hover:bg-danger/25 text-danger border border-danger/20',
};

const sizes = {
  sm: 'py-1.5 text-xs gap-1.5',
  md: 'py-2 text-sm gap-2',
  lg: 'py-2.5 text-sm gap-2',
};

const paddings = {
  sm: { normal: 'px-3', icon: 'pl-2.5 pr-3' },
  md: { normal: 'px-4', icon: 'pl-3.5 pr-4.5' },
  lg: { normal: 'px-5', icon: 'pl-3.5 pr-4.5' },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-medium transition-all duration-150',
        'focus:outline-none focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        (Icon || loading) ? paddings[size]?.icon : paddings[size]?.normal,
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 16} weight="bold" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : 16} weight="bold" />}
    </button>
  );
}
