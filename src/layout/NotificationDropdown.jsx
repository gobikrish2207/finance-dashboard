import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Info, AlertTriangle, CheckCircle2, BellOff, Trash2, X } from 'lucide-react';
import './NotificationDropdown.css';

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useApp();
  const { notifications } = state;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={15} />;
      case 'error':   return <AlertTriangle size={15} />;
      case 'info':    return <Info size={15} />;
      default:        return <Bell size={15} />;
    }
  };

  return (
    <div className="notif-dropdown animate-slide-down">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-left">
          <Bell size={16} className="notif-header-icon" />
          <span className="notif-header-title">Notifications</span>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </div>
        <div className="notif-header-right">
          {unreadCount > 0 && (
            <button
              className="notif-action-btn"
              onClick={() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' })}
            >
              Mark all read
            </button>
          )}
          <button className="notif-close-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <BellOff size={28} style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs muted">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 8).map(n => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? 'unread' : ''}`}
              onClick={() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' })}
            >
              <div className={`notif-icon ${n.type}`}>
                {getIcon(n.type)}
              </div>
              <div className="notif-content">
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{timeAgo(n.timestamp)}</span>
              </div>
              {!n.read && <div className="notif-dot" />}
              <button
                className="notif-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id });
                }}
                title="Dismiss"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notif-footer">
          <span className="text-xs muted">{notifications.length} total notification{notifications.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}
