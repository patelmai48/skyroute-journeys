import React, { useState, useEffect, useRef } from 'react';
import NotificationsPanel from './NotificationsPanel';
import Icon from './Icon';
import { INITIAL_NOTIFICATIONS } from '../data/travelData';

const NAV_LINKS = [
  { id: 'flights', label: 'Flights', path: '/flights' },
  { id: 'hotels', label: 'Hotels', path: '/hotels' },
  { id: 'explore', label: 'Explore', path: '/explore' },
  { id: 'my-trips', label: 'My Trips', path: '/my-trips' },
  { id: 'ai-planner', label: 'AI Planner', path: '/ai-planner', badge: 'AI' },
  { id: 'price-alerts', label: 'Price Alerts', path: '/price-alerts' },
  { id: 'offers', label: 'Offers', path: '/offers' },
  { id: 'support', label: 'Support', path: '/about' },
];

const Header = ({ onNavigate, currentRoute }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('skyroute_notifications');
      const list = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
      setUnreadCount(list.filter((n) => n.unread).length);
    } catch (e) {
      setUnreadCount(2);
    }
  }, [notifOpen]);

  useEffect(() => {
    try {
      const auth = localStorage.getItem('skyroute_auth_user');
      if (auth) {
        setCurrentUser(JSON.parse(auth));
      } else {
        setCurrentUser(null);
      }
      setAvatarLoadError(false);
    } catch (e) {
      setCurrentUser(null);
    }
  }, [currentRoute]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('skyroute_auth_user');
    setCurrentUser(null);
    setProfileMenuOpen(false);
    onNavigate('/login');
  };

  const isLinkActive = (path) => {
    if (path === '/flights') {
      return currentRoute === '/flights' || currentRoute === '/dashboard/flights';
    }
    if (path === '/my-trips') {
      return currentRoute === '/my-trips' || currentRoute === '/my-bookings' || currentRoute === '/dashboard/bookings';
    }
    if (path === '/explore') {
      return currentRoute === '/explore' || currentRoute.startsWith('/destination/');
    }
    return currentRoute === path;
  };

  return (
    <header className="SkyRoute-header">
      <div className="SkyRoute-header__container">
        {/* Left: Brand Logo */}
        <div
          className="SkyRoute-header__brand"
          onClick={() => handleNav('/home')}
          role="button"
          tabIndex={0}
          title="SkyRoute Home"
        >
          <div className="SkyRoute-header__logo-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.8.3-2.1 1.2-.3.9.1 1.8.9 2.2l5.4 3.2-3.2 3.2-2.3-.6c-.5-.1-1 .1-1.3.4l-.4.4 2.8 1.4 1.4 2.8.4-.4c.3-.3.5-.8.4-1.3l-.6-2.3 3.2-3.2 3.2 5.4c.4.8 1.3 1.2 2.2.9.9-.3 1.4-1.2 1.2-2.1z" />
            </svg>
          </div>
          <span className="SkyRoute-header__brand-name">
            Sky<span className="SkyRoute-header__brand-accent">Route</span>
          </span>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="SkyRoute-header__nav" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.id}
                type="button"
                className={`SkyRoute-header__nav-item ${active ? 'SkyRoute-header__nav-item--active' : ''}`}
                onClick={() => handleNav(link.path)}
              >
                {link.label}
                {link.badge && (
                  <span className="SkyRoute-header__item-badge">{link.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="SkyRoute-header__actions">
          {/* Quick Search Shortcut */}
          <button
            type="button"
            className="SkyRoute-header__icon-btn"
            onClick={() => handleNav('/flights')}
            aria-label="Search Flights"
            title="Search Flights"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Notifications Button */}
          <div className="SkyRoute-header__notif-wrapper">
            <button
              type="button"
              className={`SkyRoute-header__icon-btn ${currentRoute === '/notifications' ? 'SkyRoute-header__icon-btn--active' : ''}`}
              onClick={() => handleNav('/notifications')}
              aria-label="View notifications"
              title="Notifications & Updates"
            >
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="SkyRoute-header__notif-badge">{unreadCount}</span>
              )}
            </button>
          </div>

          {/* Profile Menu Dropdown */}
          <div className="SkyRoute-header__profile-container" ref={profileRef}>
            <button
              type="button"
              className={`SkyRoute-header__profile-trigger ${profileMenuOpen ? 'SkyRoute-header__profile-trigger--active' : ''}`}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="User Account Menu"
              aria-expanded={profileMenuOpen}
            >
              <div className="SkyRoute-header__avatar">
                {currentUser ? (
                  currentUser.picture && !avatarLoadError ? (
                    <img
                      src={currentUser.picture}
                      alt={currentUser.name || 'Profile'}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={() => setAvatarLoadError(true)}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : <Icon name="user" size={16} />
                  )
                ) : (
                  <Icon name="user" size={16} />
                )}
              </div>
              <span className="SkyRoute-header__profile-name">
                {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
              </span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {profileMenuOpen && (
              <div className="SkyRoute-header__profile-dropdown">
                {currentUser ? (
                  <>
                    <div className="SkyRoute-header__dropdown-user-info">
                      <strong>{currentUser.name}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <div className="SkyRoute-header__dropdown-divider"></div>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item"
                      onClick={() => handleNav('/profile')}
                    >
                      <Icon name="user" size={16} color="var(--primary)" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item"
                      onClick={() => handleNav('/my-trips')}
                    >
                      <Icon name="flight" size={16} color="var(--primary)" />
                      <span>My Trips &amp; Bookings</span>
                    </button>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item"
                      onClick={() => handleNav('/price-alerts')}
                    >
                      <Icon name="bell" size={16} color="var(--primary)" />
                      <span>Price Alerts</span>
                    </button>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item"
                      onClick={() => handleNav('/profile')}
                    >
                      <Icon name="settings" size={16} color="var(--primary)" />
                      <span>Settings</span>
                    </button>
                    <div className="SkyRoute-header__dropdown-divider"></div>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item SkyRoute-header__dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      <Icon name="logOut" size={16} color="#DC2626" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="SkyRoute-header__dropdown-user-info">
                      <strong>Welcome to SkyRoute</strong>
                      <span>Sign in to manage flights &amp; trips</span>
                    </div>
                    <div className="SkyRoute-header__dropdown-divider"></div>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item"
                      onClick={() => handleNav('/login')}
                    >
                      <Icon name="key" size={16} color="var(--primary)" />
                      <span>Log In</span>
                    </button>
                    <button
                      type="button"
                      className="SkyRoute-header__dropdown-item"
                      onClick={() => handleNav('/login')}
                    >
                      <Icon name="sparkles" size={16} color="var(--primary)" />
                      <span>Create Account</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="SkyRoute-header__hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="SkyRoute-header__mobile-drawer">
          <div className="SkyRoute-header__mobile-links">
            <button
              type="button"
              className={`SkyRoute-header__mobile-item ${currentRoute === '/' ? 'SkyRoute-header__mobile-item--active' : ''}`}
              onClick={() => handleNav('/')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="home" size={16} color="var(--primary)" /> Home
              </span>
            </button>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`SkyRoute-header__mobile-item ${isLinkActive(link.path) ? 'SkyRoute-header__mobile-item--active' : ''}`}
                onClick={() => handleNav(link.path)}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="SkyRoute-header__item-badge">{link.badge}</span>
                )}
              </button>
            ))}
            <button
              type="button"
              className={`SkyRoute-header__mobile-item ${currentRoute === '/flight-status' ? 'SkyRoute-header__mobile-item--active' : ''}`}
              onClick={() => handleNav('/flight-status')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="activity" size={16} color="var(--primary)" /> Flight Status
              </span>
            </button>
            <button
              type="button"
              className={`SkyRoute-header__mobile-item ${currentRoute === '/manage-booking' ? 'SkyRoute-header__mobile-item--active' : ''}`}
              onClick={() => handleNav('/manage-booking')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="package" size={16} color="var(--primary)" /> Manage Booking
              </span>
            </button>
          </div>

          <div className="SkyRoute-header__mobile-footer">
            <div className="SkyRoute-header__mobile-btn-group">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--full"
                onClick={() => handleNav('/profile')}
              >
                My Account / Profile
              </button>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--full"
                onClick={() => handleNav('/login')}
              >
                Log In / Register
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
