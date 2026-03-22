import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Bell, X, List, UserCircle, SignOut, Gear, User, Check, XCircle } from '@phosphor-icons/react';
import { useSocketEvent } from '../../hooks/useSocket.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSquircle } from '../hooks/useSquircle.js';
import { useI18n } from '../../i18n/index.jsx';
import { Input } from './Input.jsx';
import { Tooltip } from './Tooltip.jsx';
import { toast } from 'sonner';
import { globalApi } from '../../lib/api.js';

const MAX_NOTIFICATIONS = 30;

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function TopBar({ connected = false, searchValue = '', onSearchChange, onMenuClick, showConnectionStatus = false }) {
  const { user, profile, authenticated, logout, updateProfile } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef(null);
  const accountRef = useRef(null);
  const [sqNotifRef, sqNotifStyle] = useSquircle(20);
  const [sqAcctRef, sqAcctStyle] = useSquircle(20);
  const [sqProfRef, sqProfStyle] = useSquircle(20);

  // Close on outside click
  useEffect(() => {
    if (!showPanel && !showAccount) return;
    function handleClick(e) {
      if (showPanel && panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
      if (showAccount && accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccount(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPanel, showAccount]);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      await updateProfile(profileForm);
      setShowProfileEdit(false);
    } catch {}
    finally { setProfileSaving(false); }
  };

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [notif, ...prev].slice(0, MAX_NOTIFICATIONS));
    setUnread(prev => prev + 1);
  }, []);

  const handleTaskUpdate = useCallback((payload) => {
    addNotification({
      id: Date.now(),
      type: 'task',
      title: `Task ${payload.status?.replace(/_/g, ' ')}`,
      detail: payload.title || payload.taskId,
      time: new Date().toISOString(),
    });
  }, [addNotification]);

  const handleQAResult = useCallback((payload) => {
    addNotification({
      id: Date.now(),
      type: payload.valid ? 'success' : 'error',
      title: payload.valid ? 'QA passed' : 'QA failed',
      detail: `${payload.taskId}${!payload.valid ? ` -- ${payload.errors} error(s)` : ''}`,
      time: new Date().toISOString(),
    });
  }, [addNotification]);

  const handleBudgetAlert = useCallback((payload) => {
    addNotification({
      id: Date.now(),
      type: 'warning',
      title: `Budget alert: ${payload.name}`,
      detail: `${payload.percent}% ($${payload.currentUsd} / $${payload.limitUsd})`,
      time: new Date().toISOString(),
    });
  }, [addNotification]);

  const handleAgentState = useCallback((payload) => {
    addNotification({
      id: Date.now(),
      type: 'agent',
      title: `${payload.type} agent ${payload.state}`,
      detail: payload.state === 'running' ? 'Processing started' : payload.state === 'stopped' ? 'Processing halted' : '',
      time: new Date().toISOString(),
    });
  }, [addNotification]);

  // Load pending invites
  const [invites, setInvites] = useState([]);
  useEffect(() => {
    if (!authenticated) return;
    globalApi.getInvites().then(data => {
      if (Array.isArray(data)) {
        setInvites(data.filter(i => i.status === 'pending'));
        data.filter(i => i.status === 'pending').forEach(inv => {
          addNotification({
            id: `invite-${inv.id}`,
            type: 'invite',
            title: `Project invite`,
            detail: `${inv.invitedBy?.name || 'Someone'} invited you to ${inv.project?.name || 'a project'}`,
            time: inv.createdAt || new Date().toISOString(),
            inviteId: inv.id,
          });
        });
      }
    }).catch(() => {});
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAcceptInvite = async (inviteId) => {
    try {
      await globalApi.acceptInvite(inviteId);
      toast.success('Invite accepted');
      setInvites(prev => prev.filter(i => i.id !== inviteId));
      setNotifications(prev => prev.filter(n => n.inviteId !== inviteId));
    } catch (err) { toast.error(err.message); }
  };

  const handleDeclineInvite = async (inviteId) => {
    try {
      await globalApi.declineInvite(inviteId);
      toast.success('Invite declined');
      setInvites(prev => prev.filter(i => i.id !== inviteId));
      setNotifications(prev => prev.filter(n => n.inviteId !== inviteId));
    } catch (err) { toast.error(err.message); }
  };

  useSocketEvent('task:updated', handleTaskUpdate);
  useSocketEvent('qa:result', handleQAResult);
  useSocketEvent('budget:alert', handleBudgetAlert);
  useSocketEvent('agent:state', handleAgentState);

  function openPanel() {
    setShowPanel(true);
    setUnread(0);
  }

  function clearAll() {
    setNotifications([]);
    setUnread(0);
  }

  function dismiss(id) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const typeColors = {
    task: 'bg-info/20 text-info',
    success: 'bg-success/20 text-success',
    error: 'bg-danger/20 text-danger',
    warning: 'bg-warning/20 text-warning',
    agent: 'bg-purple/20 text-purple',
    invite: 'bg-accent/20 text-accent',
  };

  return (
    <header className="h-12 border-b border-border-subtle bg-surface-raised/80 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6 sticky top-0 z-20">
      {/* Left side: hamburger + search */}
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors md:hidden"
          >
            <List size={18} />
          </button>
        )}
        <div className="w-32 sm:w-64">
          <Input
            icon={MagnifyingGlass}
            placeholder="Search..."
            value={searchValue}
            onChange={onSearchChange}
            className="py-1.5! text-xs! bg-surface-overlay/50! border-transparent! focus:border-border!"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={openPanel}
            className="relative p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors"
          >
            <Bell size={17} weight={unread > 0 ? 'fill' : 'regular'} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-accent text-white text-[9px] font-bold tabular-nums">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showPanel && (
            <div ref={sqNotifRef} className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-full sm:mt-1.5 w-auto sm:w-80 rounded-xl bg-surface-overlay border-0 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50" style={{ ...sqNotifStyle, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}>
              <div className="flex items-center justify-between px-4 py-2.5 bg-surface-raised/50">
                <span className="text-xs font-semibold text-text-primary">{t('topbar.notifications')}</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {t('topbar.clearAll')}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={20} className="text-text-muted mx-auto mb-1.5" />
                    <p className="text-[11px] text-text-muted">{t('topbar.noNotifications')}</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-surface-overlay/50 transition-colors group"
                    >
                      <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${typeColors[n.type] || typeColors.task}`}>
                        {n.type === 'success' ? '+' : n.type === 'error' ? '!' : n.type === 'warning' ? '!' : n.type === 'invite' ? '@' : '-'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-text-primary truncate">{n.title}</span>
                          <span className="text-[10px] text-text-muted shrink-0 tabular-nums">{formatTime(n.time)}</span>
                        </div>
                        {n.detail && (
                          <p className="text-[11px] text-text-muted truncate mt-0.5">{n.detail}</p>
                        )}
                        {n.type === 'invite' && n.inviteId && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAcceptInvite(n.inviteId); }}
                              className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-semibold hover:bg-accent/25 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeclineInvite(n.inviteId); }}
                              className="px-2 py-0.5 rounded-md bg-surface-overlay text-text-muted text-[10px] font-semibold hover:text-danger hover:bg-danger/8 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                        className="p-0.5 text-text-muted hover:text-text-secondary opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Connection status chip -- hidden by default, toggleable via settings */}
        {showConnectionStatus && (
          <Tooltip
            content={connected ? t('topbar.connected') : t('topbar.disconnected')}
            position="bottom"
          >
            <div className={`relative flex items-center gap-1.5 h-7 px-3 rounded-full cursor-default transition-all duration-300 ${
              connected
                ? 'bg-accent/8 text-accent'
                : 'bg-danger/8 text-danger'
            }`}>
              <span className="relative flex h-1.5 w-1.5">
                {connected && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent/50 animate-[ping_2s_ease-in-out_infinite]" />
                )}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${connected ? 'bg-accent' : 'bg-danger'}`} />
              </span>
              <span className="text-[10px] font-semibold tracking-wide">
                {connected ? t('topbar.live') : t('topbar.offline')}
              </span>
            </div>
          </Tooltip>
        )}

        {/* Account menu */}
        <div className="relative" ref={accountRef}>
          {authenticated ? (
            <button
              onClick={() => {
                setShowAccount(v => !v);
                if (!showProfileEdit) {
                  setProfileForm({
                    name: user?.name || profile?.name || '',
                    email: user?.email || profile?.email || '',
                  });
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-surface-overlay transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[10px] font-bold">
                  {(user?.name || user?.login || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline text-[11px] font-medium text-text-secondary max-w-[80px] truncate">
                {user?.name || user?.login}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
            >
              <UserCircle size={16} />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}

          {/* Account dropdown */}
          {showAccount && authenticated && !showProfileEdit && (
            <div ref={sqAcctRef} className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-full sm:mt-1.5 w-auto sm:w-64 rounded-2xl bg-surface-overlay border-0 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50" style={{ ...sqAcctStyle, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}>
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-xl" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-bold border border-accent/20">
                      {(user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{user?.name || user?.login}</p>
                    <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="px-2 pb-1.5">
                <button
                  onClick={() => { setShowProfileEdit(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded-xl transition-colors text-left"
                >
                  <User size={13} /> {t('auth.editProfile')}
                </button>
                <button
                  onClick={() => { setShowAccount(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded-xl transition-colors text-left"
                >
                  <Gear size={13} /> {t('common.settings')}
                </button>
                <button
                  onClick={() => { setShowAccount(false); logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-danger hover:bg-danger/8 rounded-xl transition-colors text-left"
                >
                  <SignOut size={13} /> {t('auth.signOut')}
                </button>
              </div>
            </div>
          )}

          {/* Profile edit panel */}
          {showAccount && authenticated && showProfileEdit && (
            <div ref={sqProfRef} className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-full sm:mt-1.5 w-auto sm:w-72 rounded-2xl bg-surface-overlay border-0 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50" style={{ ...sqProfStyle, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}>
              <div className="px-4 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">{t('auth.editProfile')}</span>
                <button onClick={() => setShowProfileEdit(false)} className="p-1 text-text-muted hover:text-text-secondary hover:bg-surface-raised rounded-lg transition-colors">
                  <X size={12} />
                </button>
              </div>
              <div className="px-4 pb-4 space-y-3">
                {/* Avatar upload */}
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-12 h-12 rounded-xl" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-sm font-bold border border-accent/20">
                        {(user?.name || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 2 * 1024 * 1024) { toast.error('Max 2MB'); return; }
                          const reader = new FileReader();
                          reader.onload = async () => {
                            try {
                              await globalApi.uploadAvatar(reader.result);
                              toast.success('Avatar updated');
                              window.location.reload();
                            } catch (err) { toast.error(err.message); }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  <div className="text-[10px] text-text-muted">Click to upload<br />Max 2MB</div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-text-muted mb-1">{t('auth.nickname')}</label>
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-surface-raised border border-border-subtle rounded-full text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-text-muted mb-1">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-surface-raised border border-border-subtle rounded-full text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/20"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => setShowProfileEdit(false)}
                    className="px-3 py-1.5 text-[10px] font-medium text-text-muted hover:text-text-secondary rounded-full hover:bg-surface-raised transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className="px-3 py-1.5 text-[10px] font-medium bg-accent text-white rounded-full hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? t('auth.saving') : t('common.save')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
