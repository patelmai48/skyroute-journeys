import React, { useState } from 'react';
import Icon from '../components/Icon';
import { MOCK_FLIGHT_STATUSES } from '../data/travelData';

const FlightStatus = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('6E 201');
  const [activeTab, setActiveTab] = useState('flightNumber'); // flightNumber | route
  const [routeFrom, setRouteFrom] = useState('Ahmedabad (AMD)');
  const [routeTo, setRouteTo] = useState('Delhi (DEL)');

  const [activeStatus, setActiveStatus] = useState(MOCK_FLIGHT_STATUSES[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'flightNumber') {
      const queryClean = searchQuery.replace(/\s|-/g, '').toUpperCase();
      const found = MOCK_FLIGHT_STATUSES.find(
        (f) => f.flightNumber.replace(/\s|-/g, '').toUpperCase() === queryClean
      );
      setActiveStatus(found || null);
    } else {
      const found = MOCK_FLIGHT_STATUSES.find(
        (f) => f.origin === routeFrom && f.destination === routeTo
      );
      setActiveStatus(found || null);
    }
  };

  return (
    <div className="SkyRoute-status-page">
      <div className="SkyRoute-container">
        {/* Header Title */}
        <div className="SkyRoute-section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <span className="SkyRoute-section-header__tag">LIVE AIRPORT TRACKER</span>
            <h1 className="SkyRoute-section-header__title">Real-Time Flight Status</h1>
            <p className="SkyRoute-section-header__subtitle">
              Check live departures, delays, gate numbers, terminal assignments, and baggage claim belts.
            </p>
          </div>
        </div>

        {/* Search Input Card */}
        <div className="SkyRoute-status-search-card SkyRoute-card">
          <div className="SkyRoute-status-tabs">
            <button
              type="button"
              className={`SkyRoute-status-tab ${activeTab === 'flightNumber' ? 'SkyRoute-status-tab--active' : ''}`}
              onClick={() => setActiveTab('flightNumber')}
            >
              Search by Flight Number
            </button>
            <button
              type="button"
              className={`SkyRoute-status-tab ${activeTab === 'route' ? 'SkyRoute-status-tab--active' : ''}`}
              onClick={() => setActiveTab('route')}
            >
              Search by Route
            </button>
          </div>

          <form onSubmit={handleSearch} className="SkyRoute-status-form">
            {activeTab === 'flightNumber' ? (
              <div className="SkyRoute-status-input-row">
                <input
                  type="text"
                  className="SkyRoute-text-input SkyRoute-status-input"
                  placeholder="Enter Flight Number (e.g. 6E 201, AI 805, UK 952)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary">
                  Check Live Status &rarr;
                </button>
              </div>
            ) : (
              <div className="SkyRoute-status-route-row">
                <select
                  className="SkyRoute-select-input"
                  value={routeFrom}
                  onChange={(e) => setRouteFrom(e.target.value)}
                >
                  <option value="Ahmedabad (AMD)">Ahmedabad (AMD)</option>
                  <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                  <option value="Delhi (DEL)">Delhi (DEL)</option>
                </select>

                <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>&rarr;</span>

                <select
                  className="SkyRoute-select-input"
                  value={routeTo}
                  onChange={(e) => setRouteTo(e.target.value)}
                >
                  <option value="Delhi (DEL)">Delhi (DEL)</option>
                  <option value="Goa (GOI)">Goa (GOI)</option>
                  <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                  <option value="Dubai (DXB)">Dubai (DXB)</option>
                  <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                </select>

                <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary">
                  Find Flights
                </button>
              </div>
            )}
          </form>

          {/* Quick Shortcuts */}
          <div className="SkyRoute-status-shortcuts">
            <span className="SkyRoute-shortcuts-label">Trending Flights:</span>
            {['6E 201', 'AI 805', 'UK 952', 'EK 501'].map((fn) => (
              <button
                key={fn}
                type="button"
                className="SkyRoute-shortcut-pill"
                onClick={() => {
                  setSearchQuery(fn);
                  const found = MOCK_FLIGHT_STATUSES.find((f) => f.flightNumber === fn);
                  if (found) setActiveStatus(found);
                }}
              >
                {fn}
              </button>
            ))}
          </div>
        </div>

        {/* Live Flight Result Card or Clean Empty State */}
        {activeStatus ? (
          <div className="SkyRoute-status-result-card SkyRoute-card">
            {/* Top Bar */}
            <div className="SkyRoute-status-result-header">
              <div className="SkyRoute-status-airline-info">
                <span
                  className="SkyRoute-airline-logo-badge"
                  style={{ backgroundColor: activeStatus.airlineColor || '#143F67' }}
                >
                  {activeStatus.airline.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h2 className="SkyRoute-status-flight-number">
                    {activeStatus.airline} &bull; {activeStatus.flightNumber}
                  </h2>
                  <span className="SkyRoute-status-aircraft-sub">
                    Aircraft: {activeStatus.aircraft || 'Airbus A320neo'}
                  </span>
                </div>
              </div>

              <div className="SkyRoute-status-badge-container">
                <span className={`SkyRoute-badge ${activeStatus.status === 'On Time' || activeStatus.status === 'Boarding' ? 'SkyRoute-badge--success' : 'SkyRoute-badge--warning'}`}>
                  ● {activeStatus.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Timings & Stations */}
            <div className="SkyRoute-status-route-banner">
              <div className="SkyRoute-status-point">
                <span className="SkyRoute-status-point-city">{activeStatus.origin}</span>
                <strong className="SkyRoute-status-point-time">{activeStatus.scheduledDeparture}</strong>
                <span className="SkyRoute-status-point-est">Est: {activeStatus.estimatedDeparture}</span>
              </div>

              <div className="SkyRoute-status-vector-col">
                <span className="SkyRoute-status-vector-badge">Direct Route</span>
                <div className="SkyRoute-status-vector-line">
                  <span className="SkyRoute-status-vector-plane">
                    <Icon name="flight" size={16} color="var(--primary)" />
                  </span>
                </div>
              </div>

              <div className="SkyRoute-status-point SkyRoute-status-point--dest">
                <span className="SkyRoute-status-point-city">{activeStatus.destination}</span>
                <strong className="SkyRoute-status-point-time">{activeStatus.scheduledArrival}</strong>
                <span className="SkyRoute-status-point-est">Est: {activeStatus.estimatedArrival}</span>
              </div>
            </div>

            {/* Airport Operations Grid: Gate, Terminal, Belt */}
            <div className="SkyRoute-airport-ops-grid">
              <div className="SkyRoute-airport-op-card">
                <span className="SkyRoute-op-label">DEPARTURE GATE</span>
                <strong className="SkyRoute-op-value">{activeStatus.gate}</strong>
              </div>
              <div className="SkyRoute-airport-op-card">
                <span className="SkyRoute-op-label">TERMINAL</span>
                <strong className="SkyRoute-op-value">{activeStatus.terminal}</strong>
              </div>
              <div className="SkyRoute-airport-op-card">
                <span className="SkyRoute-op-label">BAGGAGE CLAIM</span>
                <strong className="SkyRoute-op-value">{activeStatus.baggageBelt}</strong>
              </div>
              <div className="SkyRoute-airport-op-card">
                <span className="SkyRoute-op-label">WEB CHECK-IN</span>
                <strong className="SkyRoute-op-value" style={{ color: '#143F67' }}>OPEN</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="SkyRoute-card SkyRoute-empty-state" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="SkyRoute-empty-state__icon" style={{ marginBottom: '1rem' }}>
              <Icon name="takeoff" size={42} color="var(--primary)" />
            </div>
            <h3 className="SkyRoute-empty-state__title" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--SkyRoute-text-main, #143F67)', marginBottom: '0.5rem' }}>
              No Active Flight Status Found
            </h3>
            <p className="SkyRoute-empty-state__text" style={{ color: 'var(--SkyRoute-text-secondary, #1E5282)', maxWidth: '500px', margin: '0 auto' }}>
              {activeTab === 'flightNumber'
                ? `No live radar schedule found for flight number "${searchQuery}". Please check the flight number and try again.`
                : `No direct scheduled flight found for route ${routeFrom} → ${routeTo}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightStatus;
