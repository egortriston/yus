import { clsx } from 'clsx';

export function Table({ children, className }) {
  return (
    <div className={clsx('rounded-2xl border border-border overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={clsx('bg-surface-overlay', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return (
    <tbody className={clsx('divide-y divide-border-subtle', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, clickable = false, ...props }) {
  return (
    <tr
      className={clsx(
        'transition-colors',
        clickable && 'cursor-pointer hover:bg-surface-overlay',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return (
    <th className={clsx('px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }) {
  return (
    <td className={clsx('px-4 py-3 text-text-primary', className)}>
      {children}
    </td>
  );
}
