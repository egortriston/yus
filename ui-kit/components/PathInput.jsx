import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { FolderOpen, GitBranch } from '@phosphor-icons/react';
// usePathAutocomplete is app-specific -- provide a no-op fallback
const usePathAutocomplete = () => ({ suggestions: [], loading: false });
import { useSquircle } from '../hooks/useSquircle.js';
import { Input } from './Input.jsx';

/**
 * Text input with filesystem path autocomplete dropdown.
 */
export function PathInput({ value, onChange, label, placeholder, className }) {
  const [focused, setFocused] = useState(false);
  const { suggestions } = usePathAutocomplete(value, { enabled: focused });
  const wrapperRef = useRef(null);
  const [sqRef, sqStyle] = useSquircle(18);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const showDropdown = focused && suggestions.length > 0;

  return (
    <div ref={wrapperRef} className={clsx('relative', className)}>
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        icon={FolderOpen}
      />
      {showDropdown && (
        <div ref={sqRef} className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-surface-raised overflow-hidden max-h-48 overflow-y-auto" style={{ ...sqStyle, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}>
          {suggestions.map(s => (
            <button
              key={s.path}
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-overlay transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange({ target: { value: s.path } });
                setFocused(false);
              }}
            >
              <FolderOpen size={13} className={s.hasGit ? 'text-accent' : 'text-text-muted'} weight={s.hasGit ? 'duotone' : 'regular'} />
              <span className="text-xs text-text-primary truncate flex-1">{s.name}</span>
              {s.hasGit && <GitBranch size={10} className="text-success shrink-0" />}
              <span className="text-[9px] text-text-muted font-mono truncate max-w-[180px]">{s.path}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
