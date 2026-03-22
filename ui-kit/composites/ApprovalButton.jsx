import { useState } from 'react';
import { toast } from 'sonner';
import {
  CheckCircle,
  ArrowsClockwise,
  ShieldCheck,
  XCircle,
  ArrowUp,
  X,
} from '@phosphor-icons/react';
import { useProject } from '../context/ProjectContext.jsx';
import { Button } from './ui/index.js';

export function ApprovalButton({ task, onAction }) {
  const { api } = useProject();
  const [loading, setLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  async function handleApprove() {
    setLoading(true);
    try {
      await api.approveTask(task.id, 'dashboard-user');
      toast.success('Task approved successfully');
      onAction?.();
    } catch (err) {
      toast.error(`Approval failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setLoading(true);
    try {
      await api.rejectTask(task.id, 'dashboard-user', rejectReason.trim());
      toast.success('Task rejected -- worker will be notified');
      setShowRejectDialog(false);
      setRejectReason('');
      onAction?.();
    } catch (err) {
      toast.error(`Rejection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    setLoading(true);
    try {
      await api.retryTask(task.id);
      toast.success('Task queued for retry');
      onAction?.();
    } catch (err) {
      toast.error(`Retry failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 relative">
      {/* Approve + Reject for completed tasks (awaiting manual approval) */}
      {task.status === 'completed' && (
        <>
          <Button
            variant="secondary"
            icon={CheckCircle}
            onClick={handleApprove}
            loading={loading}
            className="!border-success/30 !text-success hover:!bg-success/15"
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            icon={XCircle}
            onClick={() => setShowRejectDialog(true)}
            className="!border-danger/30 !text-danger hover:!bg-danger/15"
          >
            Reject
          </Button>
        </>
      )}

      {/* Retry for failed tasks */}
      {['failed', 'qa_failed'].includes(task.status) && (
        <Button
          variant="secondary"
          icon={ArrowsClockwise}
          onClick={handleRetry}
          loading={loading}
          className="!border-warning/30 !text-warning hover:!bg-warning/15"
        >
          Retry
        </Button>
      )}

      {/* Approved badge */}
      {task.status === 'approved' && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
          <ShieldCheck size={16} weight="fill" />
          Approved{task.approvedBy ? ` by ${task.approvedBy}` : ''}
        </div>
      )}

      {/* Reject dialog */}
      {showRejectDialog && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface-raised border border-border rounded-xl shadow-xl z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Reject Task</h3>
            <button
              onClick={() => setShowRejectDialog(false)}
              className="text-text-muted hover:text-text-secondary"
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Describe the issue for the worker agent..."
            rows={3}
            className="w-full rounded-lg border border-border bg-surface-overlay text-sm text-text-primary placeholder-text-muted px-3 py-2 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={ArrowUp}
              onClick={handleReject}
              loading={loading}
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
