import { clsx } from 'clsx';
import { useSquircle } from '../hooks/useSquircle.js';

export function Card({ children, className, hover = false, ...props }) {
  const [sqRef, sqStyle] = useSquircle(26);
  return (
    <div
      ref={sqRef}
      className={clsx(
        'rounded-2xl bg-surface-raised',
        hover && 'transition-all duration-200 hover:shadow-lg hover:shadow-accent/5',
        className
      )}
      style={sqStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('px-5 py-4 border-b border-border-subtle', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={clsx('px-5 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }) {
  return (
    <div className={clsx('px-5 py-3 border-t border-border-subtle', className)}>
      {children}
    </div>
  );
}
