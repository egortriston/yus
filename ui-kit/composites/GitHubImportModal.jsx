import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  GithubLogo, MagnifyingGlass, Lock, Globe, GitBranch,
  Star, FolderOpen, ArrowsClockwise,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext.jsx';
import { Modal, ModalFooter, Button, Input, PathInput } from './ui/index.js';

export function GitHubImportModal({ open, onClose, onImported }) {
  const { authFetch, authenticated } = useAuth();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [clonePath, setClonePath] = useState('');
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    if (open && authenticated) {
      loadRepos();
    }
  }, [open, authenticated]);

  async function loadRepos() {
    setLoading(true);
    try {
      const res = await authFetch('/api/auth/github/repos?per_page=100');
      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  }

  const filtered = repos.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  async function handleClone() {
    if (!selectedRepo || !clonePath) return;
    setCloning(true);
    try {
      const res = await authFetch('/api/auth/github/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloneUrl: selectedRepo.cloneUrl,
          targetPath: clonePath,
          branch: selectedRepo.defaultBranch,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Cloned ${selectedRepo.name} successfully`);
        onImported?.({
          name: selectedRepo.name,
          path: clonePath,
          description: selectedRepo.description,
          gitRemote: selectedRepo.cloneUrl,
          gitBranch: selectedRepo.defaultBranch,
        });
        onClose();
      } else {
        toast.error(data.error || 'Clone failed');
      }
    } catch (err) {
      toast.error('Clone failed');
    } finally {
      setCloning(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Import from GitHub" size="lg">
      <div className="space-y-4">
        {/* Search */}
        <Input
          icon={MagnifyingGlass}
          placeholder="Search your repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Repo list */}
        <div className="rounded-lg border border-border-subtle max-h-64 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center">
              <ArrowsClockwise size={18} className="text-text-muted mx-auto animate-spin mb-2" />
              <p className="text-xs text-text-muted">Loading repositories...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center">
              <GithubLogo size={20} className="text-text-muted mx-auto mb-2" />
              <p className="text-xs text-text-muted">
                {repos.length === 0 ? 'No repositories found' : 'No matching repos'}
              </p>
            </div>
          ) : (
            filtered.map(repo => (
              <button
                key={repo.id}
                onClick={() => {
                  setSelectedRepo(repo);
                  if (!clonePath) setClonePath(`/Users/${repo.name}`);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border-subtle last:border-0 ${
                  selectedRepo?.id === repo.id
                    ? 'bg-accent/8 border-l-2 border-l-accent'
                    : 'hover:bg-surface-overlay/50'
                }`}
              >
                <GithubLogo size={16} className="text-text-muted mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-primary truncate">{repo.fullName}</span>
                    {repo.private ? (
                      <Lock size={10} className="text-warning shrink-0" />
                    ) : (
                      <Globe size={10} className="text-text-muted shrink-0" />
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-[10px] text-text-muted truncate mt-0.5">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    {repo.language && (
                      <span className="text-[9px] text-text-muted">{repo.language}</span>
                    )}
                    <span className="text-[9px] text-text-muted flex items-center gap-0.5">
                      <Star size={8} /> {repo.stargazersCount}
                    </span>
                    <span className="text-[9px] text-text-muted flex items-center gap-0.5">
                      <GitBranch size={8} /> {repo.defaultBranch}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Clone path */}
        {selectedRepo && (
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <p className="text-xs font-semibold text-text-primary">
              Clone destination for <span className="text-accent">{selectedRepo.name}</span>
            </p>
            <PathInput
              value={clonePath}
              onChange={(e) => setClonePath(e.target.value)}
              placeholder="/Users/you/projects/repo-name"
            />
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          icon={FolderOpen}
          onClick={handleClone}
          loading={cloning}
          disabled={!selectedRepo || !clonePath}
        >
          Clone & Import
        </Button>
      </ModalFooter>
    </Modal>
  );
}
