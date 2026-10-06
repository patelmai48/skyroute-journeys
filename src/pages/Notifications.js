import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { INITIAL_NOTIFICATIONS } from '../data/travelData';
import { useToast } from '../context/ToastContext';

const Notifications = ({ onNavigate }) => {
  const { showSuccess, showInfo } = useToast();
  const [activeFilter, setActiveFilter] = useState('all'); // all | flight | price | booking

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('skyroute_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (showSuccess) showSuccess('All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    if (showInfo) showInfo('All notifications deleted');
  };

  const handleDeleteNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (showInfo) showInfo('Notification deleted');
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.link) {
      onNavigate(item.link);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'flight') return item.type === 'flight';
    if (activeFilter === 'price') return item.type === 'price';
    if (activeFilter === 'booking') return item.type === 'booking';
    return true;
  });

  return (
    <div className="SkyRoute-notifications-page">
      <div className="SkyRoute-container">
        {/* Header */}
        <div className="SkyRoute-section-header">
          <div>
            <span className="SkyRoute-section-header__tag">ACTIVITY CENTER</span>
            <h1 className="SkyRoute-section-header__title">Notifications &amp; Updates</h1>
            <p className="SkyRoute-section-header__subtitle">
              Stay updated with real-time flight schedules, fare drops, gate assignments, and booking confirmations.
            </p>
          </div>

          <div className="SkyRoute-notif-header-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="SkyRoute-notif-filter-bar">
          {[
            { id: 'all', label: 'All Notifications', count: notifications.length },
            { id: 'flight', label: 'Flights & Gates', count: notifications.filter((n) => n.type === 'flight').length },
            { id: 'price', label: 'Price Alerts', count: notifications.filter((n) => n.type === 'price').length },
            { id: 'booking', label: 'Bookings & Trips', count: notifications.filter((n) => n.type === 'booking').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`SkyRoute-notif-filter-pill ${activeFilter === tab.id ? 'SkyRoute-notif-filter-pill--active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="SkyRoute-notif-pill-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="SkyRoute-notif-page-list">
          {filteredNotifications.length === 0 ? (
            <div className="SkyRoute-card SkyRoute-empty-state">
              <div className="SkyRoute-empty-state__icon">
                <Icon name="bell" size={36} color="var(--primary)" />
              </div>
              <h3 className="SkyRoute-empty-state__title">No notifications in this category</h3>
              <p className="SkyRoute-empty-state__text">
                You're all caught up! As soon as prices drop or your flight updates, we'll notify you right here.
              </p>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary"
                onClick={() => onNavigate('/flights')}
              >
                Explore Flights &rarr;
              </button>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`SkyRoute-notif-card SkyRoute-card ${item.unread ? 'SkyRoute-notif-card--unread' : ''}`}
                onClick={() => handleNotificationClick(item)}
                role="button"
                tabIndex={0}
              >
                <div className="SkyRoute-notif-card__icon-box">
                  {item.type === 'flight' && <Icon name="flight" size={18} color="var(--primary)" />}
                  {item.type === 'price' && <Icon name="trendDown" size={18} color="#16A34A" />}
                  {item.type === 'booking' && <Icon name="ticket" size={18} color="var(--primary)" />}
                  {item.type === 'alert' && <Icon name="bell" size={18} color="var(--primary)" />}
                  {!['flight', 'price', 'booking', 'alert'].includes(item.type) && <Icon name="bell" size={18} color="var(--primary)" />}
                </div>

                <div className="SkyRoute-notif-card__body">
                  <div className="SkyRoute-notif-card__header">
                    <h3 className="SkyRoute-notif-card__title">
                      {item.title}
                      {item.unread && (
                        <span className="SkyRoute-notif-new-badge">NEW</span>
                      )}
                    </h3>
                    <div className="SkyRoute-notif-card__header-right">
                      <span className="SkyRoute-notif-card__time">{item.time}</span>
                      <button
                        type="button"
                        className="SkyRoute-notif-card__delete-btn"
                        onClick={(e) => handleDeleteNotification(item.id, e)}
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                  <p className="SkyRoute-notif-card__message">{item.message}</p>
                  {item.link && (
                    <span className="SkyRoute-notif-card__cta">
                      View details &rarr;
                    </span>
                  )}
                </div>

                {item.unread && <span className="SkyRoute-notif-card__unread-indicator"></span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
