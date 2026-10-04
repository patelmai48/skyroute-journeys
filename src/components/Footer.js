import React from 'react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="SkyRoute-footer">
      <div className="SkyRoute-container SkyRoute-footer__container">
        <div className="SkyRoute-footer__top">
          <div className="SkyRoute-footer__brand-group">
            <div 
              className="SkyRoute-footer__brand"
              onClick={() => onNavigate('/')}
              role="button"
              tabIndex={0}
            >
              <span className="SkyRoute-header__logo-icon" style={{ width: '28px', height: '28px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.8.3-2.1 1.2-.3.9.1 1.8.9 2.2l5.4 3.2-3.2 3.2-2.3-.6c-.5-.1-1 .1-1.3.4l-.4.4 2.8 1.4 1.4 2.8.4-.4c.3-.3.5-.8.4-1.3l-.6-2.3 3.2-3.2 3.2 5.4c.4.8 1.3 1.2 2.2.9.9-.3 1.4-1.2 1.2-2.1z" />
                </svg>
              </span>
              <span>SkyRoute</span>
            </div>
            <p className="SkyRoute-footer__tagline">
              Flight planning made simple.
            </p>
          </div>

          <nav className="SkyRoute-footer__nav" aria-label="Footer navigation">
            <button
              type="button"
              className="SkyRoute-footer__link"
              onClick={() => onNavigate('/dashboard/flights')}
            >
              Flights
            </button>
            <button
              type="button"
              className="SkyRoute-footer__link"
              onClick={() => onNavigate('/dashboard/bookings')}
            >
              My Bookings
            </button>
            <button
              type="button"
              className="SkyRoute-footer__link"
              onClick={() => onNavigate('/dashboard/about')}
            >
              About
            </button>
          </nav>
        </div>

        <div className="SkyRoute-footer__bottom">
          <span>&copy; {new Date().getFullYear()} SkyRoute. Demo project.</span>
          <span>Powered by React &amp; Skyscanner Backpack</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
