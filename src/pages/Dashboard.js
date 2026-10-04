import React, { useState, useEffect } from 'react';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const Dashboard = ({ onNavigate, onSelectBooking }) => {
  const [bookings, setBookings] = useState([]);
  const [lastSearch, setLastSearch] = useState(null);

  useEffect(() => {
    try {
      const savedBookings = JSON.parse(localStorage.getItem('skyroute_bookings') || '[]');
      setBookings(savedBookings);
    } catch (e) {
      setBookings([]);
    }

    try {
      const savedSearch = JSON.parse(localStorage.getItem('skyroute_search') || 'null');
      setLastSearch(savedSearch);
    } catch (e) {
      setLastSearch(null);
    }
  }, []);

  const totalBookingsCount = bookings.length;
  const latestBooking = bookings[0] || null;

  return (
    <div className="SkyRoute-dashboard-home">
      {/* Dashboard Top Header */}
      <div className="SkyRoute-dashboard-header">
        <div>
          <span className="SkyRoute-dashboard-header__tag">OVERVIEW</span>
          <h1 className="SkyRoute-dashboard-header__title">Dashboard</h1>
          <p className="SkyRoute-dashboard-header__subtitle">
            Manage your flights, bookings and traveller details from one place.
          </p>
        </div>

        <div className="SkyRoute-dashboard-header__actions">
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--primary"
            onClick={() => onNavigate('/dashboard/flights')}
          >
            ✈ Search Flights
          </button>
        </div>
      </div>

      {/* Stats / Real Count Summary */}
      <div className="SkyRoute-dashboard-summary-row SkyRoute-dashboard-summary-row--two-col">
        <div className="SkyRoute-dashboard-stat-card SkyRoute-card">
          <div className="SkyRoute-dashboard-stat-card__icon SkyRoute-dashboard-stat-card__icon--blue">
            🎫
          </div>
          <div className="SkyRoute-dashboard-stat-card__content">
            <span className="SkyRoute-dashboard-stat-card__label">Confirmed Bookings</span>
            <strong className="SkyRoute-dashboard-stat-card__value">
              {totalBookingsCount} {totalBookingsCount === 1 ? 'booking' : 'bookings'}
            </strong>
          </div>
        </div>

        <div className="SkyRoute-dashboard-stat-card SkyRoute-card">
          <div className="SkyRoute-dashboard-stat-card__icon SkyRoute-dashboard-stat-card__icon--purple">
            🔍
          </div>
          <div className="SkyRoute-dashboard-stat-card__content">
            <span className="SkyRoute-dashboard-stat-card__label">Recent Search Route</span>
            <strong className="SkyRoute-dashboard-stat-card__value SkyRoute-dashboard-stat-card__value--sm">
              {lastSearch ? `${lastSearch.origin?.split(' ')[0]} → ${lastSearch.destination?.split(' ')[0]}` : 'Ahmedabad → Mumbai'}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Action Cards Grid */}
      <h2 className="SkyRoute-dashboard-section-title">Quick Actions</h2>
      <div className="SkyRoute-dashboard-cards-grid SkyRoute-dashboard-cards-grid--two-col">
        {/* Card 1: Search Flights */}
        <div className="SkyRoute-dashboard-action-card SkyRoute-card">
          <div className="SkyRoute-dashboard-action-card__icon">✈️</div>
          <div className="SkyRoute-dashboard-action-card__body">
            <h3 className="SkyRoute-dashboard-action-card__title">Search Flights</h3>
            <p className="SkyRoute-dashboard-action-card__desc">
              Find and compare available demo flights across leading airlines with transparent fares.
            </p>
          </div>
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-dashboard-action-card__btn"
            onClick={() => onNavigate('/dashboard/flights')}
          >
            Search Flights &rarr;
          </button>
        </div>

        {/* Card 2: My Bookings */}
        <div className="SkyRoute-dashboard-action-card SkyRoute-card">
          <div className="SkyRoute-dashboard-action-card__icon">🎫</div>
          <div className="SkyRoute-dashboard-action-card__body">
            <h3 className="SkyRoute-dashboard-action-card__title">My Bookings</h3>
            <p className="SkyRoute-dashboard-action-card__desc">
              View your confirmed reservations, journey details, and download or print digital boarding passes.
            </p>
          </div>
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-dashboard-action-card__btn"
            onClick={() => onNavigate('/dashboard/bookings')}
          >
            View Bookings &rarr;
          </button>
        </div>
      </div>

      {/* Recent Booking Spotlight (if any exists) */}
      {latestBooking && (
        <div className="SkyRoute-dashboard-spotlight">
          <h2 className="SkyRoute-dashboard-section-title">Latest Booking</h2>
          <div className="SkyRoute-card SkyRoute-dashboard-latest-card">
            <div className="SkyRoute-dashboard-latest-card__left">
              <div className="SkyRoute-dashboard-latest-card__badge-row">
                <span className="SkyRoute-tag SkyRoute-tag--green">Confirmed</span>
                <span className="SkyRoute-dashboard-latest-card__ref">
                  Ref: {latestBooking.bookingId}
                </span>
              </div>
              <h3 className="SkyRoute-dashboard-latest-card__route">
                {latestBooking.flight?.originCity} ({latestBooking.flight?.originCode}) &rarr; {latestBooking.flight?.destinationCity} ({latestBooking.flight?.destinationCode})
              </h3>
              <p className="SkyRoute-dashboard-latest-card__meta">
                {latestBooking.flight?.airline} &bull; {latestBooking.flight?.flightNumber} &bull; {latestBooking.flight?.departureTime} &ndash; {latestBooking.flight?.arrivalTime}
              </p>
            </div>

            <div className="SkyRoute-dashboard-latest-card__right">
              <div className="SkyRoute-dashboard-latest-card__price-box">
                <span className="SkyRoute-dashboard-latest-card__price-label">Total Amount</span>
                <span className="SkyRoute-dashboard-latest-card__price">
                  {formatINR(latestBooking.total)}
                </span>
              </div>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                onClick={() => onSelectBooking(latestBooking)}
              >
                View Boarding Pass &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
