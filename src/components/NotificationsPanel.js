import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/travelData';
import '../styles/Notifications.scss';

const NotificationsPanel = ({ isOpen, onClose, onNavigate }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const panelRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('skyroute_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleDeleteNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.link) {
      onNavigate(item.link);
      onClose();
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="SkyRoute-notif-panel" ref={panelRef} role="dialog" aria-label="Notifications">
      <div className="SkyRoute-notif-panel__header">
        <div className="SkyRoute-notif-panel__title-row">
          <h3 className="SkyRoute-notif-panel__title">Notifications</h3>
          {unreadCount > 0 && (
            <span className="SkyRoute-notif-panel__badge">{unreadCount} New</span>
          )}
        </div>
        <div className="SkyRoute-notif-panel__actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="SkyRoute-notif-panel__action-btn"
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              className="SkyRoute-notif-panel__action-btn SkyRoute-notif-panel__action-btn--clear"
              onClick={clearAll}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="SkyRoute-notif-panel__list">
        {notifications.length === 0 ? (
          <div className="SkyRoute-notif-panel__empty">
            <span className="SkyRoute-notif-panel__empty-icon">🔔</span>
            <p className="SkyRoute-notif-panel__empty-text">You're all caught up!</p>
            <span className="SkyRoute-notif-panel__empty-sub">No new notifications at this time.</span>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`SkyRoute-notif-item ${item.unread ? 'SkyRoute-notif-item--unread' : ''}`}
              onClick={() => handleNotificationClick(item)}
              role="button"
              tabIndex={0}
            >
              <div className="SkyRoute-notif-item__icon-box">
                {item.type === 'flight' && '✈️'}
                {item.type === 'price' && '📉'}
                {item.type === 'booking' && '🎫'}
                {item.type === 'alert' && '🔔'}
              </div>
              <div className="SkyRoute-notif-item__content">
                <div className="SkyRoute-notif-item__top">
                  <span className="SkyRoute-notif-item__title">{item.title}</span>
                  <div className="SkyRoute-notif-item__top-right">
                    <span className="SkyRoute-notif-item__time">{item.time}</span>
                    <button
                      type="button"
                      className="SkyRoute-notif-item__delete-btn"
                      onClick={(e) => handleDeleteNotification(item.id, e)}
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <p className="SkyRoute-notif-item__message">{item.message}</p>
              </div>
              {item.unread && <span className="SkyRoute-notif-item__dot"></span>}
            </div>
          ))
        )}
      </div>

      <div className="SkyRoute-notif-panel__footer">
        <button
          type="button"
          className="SkyRoute-notif-panel__view-all-btn"
          onClick={() => {
            onNavigate('/notifications');
            onClose();
          }}
        >
          View All Notifications in Activity Center &rarr;
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
