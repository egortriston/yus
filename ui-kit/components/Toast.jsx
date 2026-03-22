import { Toaster } from 'sonner';

/**
 * Custom-styled toast provider.
 * Close button on the left edge, centered at the intersection of the
 * top-left corner, using the alert-type accent color as background.
 */
export function ToastProvider() {
  return (
    <>
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors={false}
        closeButton
        offset={16}
        gap={8}
        visibleToasts={4}
        toastOptions={{
          style: {
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            lineHeight: '1.5',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            padding: '10px 14px',
          },
          className: 'alexbot-toast',
        }}
      />
      <style>{`
        /* ── Close button: center of circle at top-left corner of the toast ── */
        .alexbot-toast [data-close-button] {
          left: -4px !important;
          right: unset !important;
          top: -4px !important;
          transform: none !important;
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          border: none !important;
          opacity: 0 !important;
          transition: opacity 0.15s ease !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .alexbot-toast:hover [data-close-button] {
          opacity: 1 !important;
        }
        .alexbot-toast [data-close-button]:hover {
          filter: brightness(1.15) !important;
        }

        /* Default close button colors (neutral) */
        .alexbot-toast [data-close-button] {
          background: var(--color-text-muted) !important;
          color: var(--color-surface-raised) !important;
        }

        /* Type-specific close button colors */
        .alexbot-toast[data-type="success"] [data-close-button] {
          background: var(--color-success) !important;
          color: #fff !important;
        }
        .alexbot-toast[data-type="error"] [data-close-button] {
          background: var(--color-danger) !important;
          color: #fff !important;
        }
        .alexbot-toast[data-type="info"] [data-close-button] {
          background: var(--color-info) !important;
          color: #fff !important;
        }
        .alexbot-toast[data-type="warning"] [data-close-button] {
          background: var(--color-warning) !important;
          color: #fff !important;
        }

        /* Icon styling */
        .alexbot-toast [data-icon] svg {
          width: 14px !important;
          height: 14px !important;
        }
      `}</style>
    </>
  );
}
