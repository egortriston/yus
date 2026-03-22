import { useState } from 'react';
import { Warning } from '@phosphor-icons/react';
import { Modal, ModalFooter } from './Modal.jsx';
import { Button } from './Button.jsx';

/**
 * Reusable confirmation modal replacing window.confirm().
 *
 * Usage:
 *   <ConfirmModal
 *     open={showConfirm}
 *     onClose={() => setShowConfirm(false)}
 *     onConfirm={handleDelete}
 *     title="Delete Session"
 *     message="Are you sure? This cannot be undone."
 *     confirmLabel="Delete"
 *     variant="danger"   // 'danger' | 'warning' | 'default'
 *   />
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading: externalLoading,
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading ?? internalLoading;

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm?.();
      onClose?.();
    } catch {
      // Caller handles errors
    } finally {
      setInternalLoading(false);
    }
  };

  const variantStyles = {
    danger: { icon: 'text-danger bg-danger/10', btn: 'bg-danger hover:bg-danger/90 text-white' },
    warning: { icon: 'text-warning bg-warning/10', btn: 'bg-warning hover:bg-warning/90 text-black' },
    default: { icon: 'text-accent bg-accent/10', btn: 'bg-accent hover:bg-accent-hover text-white' },
  };
  const vs = variantStyles[variant] || variantStyles.default;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center space-y-4 py-2">
        <div className={`w-12 h-12 rounded-2xl ${vs.icon} flex items-center justify-center mx-auto`}>
          <Warning size={22} weight="duotone" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-primary">{title}</h3>
          {message && <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{message}</p>}
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 ${vs.btn}`}
        >
          {loading ? 'Please wait...' : confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}
