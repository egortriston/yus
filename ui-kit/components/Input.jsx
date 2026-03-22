import { clsx } from 'clsx';

export function Input({
  label,
  icon: Icon,
  error,
  className,
  wrapperClassName,
  clearable = false,
  onClear,
  endContent,
  value,
  onChange,
  ...props
}) {
  const showClear = clearable && value && String(value).length > 0;
  const hasRight = showClear || endContent;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Synthesise a minimal event-like object so controlled inputs work
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={clsx('space-y-1.5', wrapperClassName)}>
      {label && (
        <label className="block text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={16} />
          </div>
        )}
        <input
          value={value}
          onChange={onChange}
          className={clsx(
            'w-full rounded-full border bg-surface-overlay text-sm text-text-primary placeholder-text-muted',
            'transition-colors duration-150',
            'focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20',
            Icon ? 'pl-9' : 'pl-3',
            hasRight ? 'pr-9' : 'pr-3',
            'py-2',
            error ? 'border-danger/50' : 'border-border',
            className
          )}
          {...props}
        />
        {hasRight && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showClear && (
              <button
                type="button"
                tabIndex={-1}
                onClick={handleClear}
                className="w-5 h-5 flex items-center justify-center rounded-full text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors"
                aria-label="Clear"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {endContent}
          </div>
        )}
      </div>
    </div>
  );
}
