import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { INITIAL_PRICE_ALERTS, DESTINATIONS } from '../data/travelData';
import { useToast } from '../context/ToastContext';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const PriceAlerts = ({ onNavigate, onSearch }) => {
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_price_alerts');
      return saved ? JSON.parse(saved) : INITIAL_PRICE_ALERTS;
    } catch (e) {
      return INITIAL_PRICE_ALERTS;
    }
  });

  const [fromCity, setFromCity] = useState('Ahmedabad (AMD)');
  const [toCity, setToCity] = useState('Dubai (DXB)');
  const [targetPrice, setTargetPrice] = useState('11000');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('skyroute_price_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed to save alerts:', e);
    }
  }, [alerts]);

  const handleCreateAlert = (e) => {
    e.preventDefault();
    const numPrice = parseFloat(targetPrice);
    if (!numPrice || numPrice <= 0) {
      showToast('Please enter a valid target price.', 'error');
      return;
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      fromCity,
      toCity,
      currentPrice: Math.round(numPrice * 1.18),
      targetPrice: numPrice,
      status: 'Active Monitoring',
      dateCreated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      trend: 'stable'
    };

    setAlerts([newAlert, ...alerts]);
    showToast(`Price alert created for ${fromCity} → ${toCity}!`, 'success');
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    showToast('Price alert removed successfully.', 'info');
  };

  const handleSearchFlights = (alert) => {
    if (onSearch) {
      onSearch({
        origin: alert.fromCity,
        destination: alert.toCity,
        tripType: 'round-trip',
        departureDate: new Date(),
        returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        passengers: 1,
        cabinClass: 'Economy'
      });
    }
  };

  return (
    <div className="SkyRoute-alerts-page">
      <div className="SkyRoute-container">
        {/* Header */}
        <div className="SkyRoute-section-header">
          <div className="SkyRoute-section-header__left">
            <span className="SkyRoute-badge SkyRoute-badge--teal">FARE TRACKER</span>
            <h1 className="SkyRoute-section-header__title" style={{ marginTop: '0.5rem' }}>
              Price Alerts &amp; Fare Watch
            </h1>
            <p className="SkyRoute-section-header__subtitle">
              Set target price thresholds on popular global routes and receive real-time notifications when airfares drop.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="SkyRoute-alerts-layout">
          {/* Left Column: Create Alert Form Card */}
          <div className="SkyRoute-alerts-layout__left">
            <div className="SkyRoute-create-alert-card SkyRoute-card">
              <div className="SkyRoute-create-alert-card__header">
                <span className="SkyRoute-badge SkyRoute-badge--teal">NEW ALERT</span>
                <h2 className="SkyRoute-create-alert-title">Create Price Alert</h2>
                <p className="SkyRoute-create-alert-sub">
                  We scan 500+ airlines continuously to notify you the instant prices fall below your target.
                </p>
              </div>

              <form onSubmit={handleCreateAlert} className="SkyRoute-create-alert-form" noValidate>
                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">FROM</label>
                  <select
                    className="SkyRoute-select-input"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                  >
                    <option value="Ahmedabad (AMD)">Ahmedabad (AMD)</option>
                    <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                    <option value="Delhi (DEL)">Delhi (DEL)</option>
                    <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                  </select>
                </div>

                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">TO</label>
                  <select
                    className="SkyRoute-select-input"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={`${d.name} (${d.code})`}>
                        {d.name} ({d.code}) &ndash; {d.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Price - Free-form numeric input */}
                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">TARGET PRICE (₹)</label>
                  <input
                    type="number"
                    className="SkyRoute-text-input"
                    placeholder="e.g. 2500, 5000, 11000, 25000"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    min="500"
                    step="100"
                    required
                  />
                  <span className="SkyRoute-field-helper">
                    Enter any desired target budget amount.
                  </span>
                </div>

                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-checkbox-label">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                    />
                    <span>Send instant email &amp; SMS alerts</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg SkyRoute-btn--full"
                >
                  Create Price Alert &rarr;
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Active Alerts List */}
          <div className="SkyRoute-alerts-layout__right">
            <div className="SkyRoute-alerts-list-header">
              <h2 className="SkyRoute-alerts-list-heading">
                Active Monitored Routes <span className="SkyRoute-alerts-count">({alerts.length})</span>
              </h2>
            </div>

            {alerts.length === 0 ? (
              <div className="SkyRoute-empty-state SkyRoute-card">
                <span className="SkyRoute-empty-state__icon">
                  <Icon name="bell" size={36} color="var(--primary)" />
                </span>
                <h3 className="SkyRoute-empty-state__title">No Active Price Alerts</h3>
                <p className="SkyRoute-empty-state__subtitle">
                  Use the form on the left to start tracking flights for your favorite destinations.
                </p>
              </div>
            ) : (
              <div className="SkyRoute-alerts-items-stack">
                {alerts.map((item) => (
                  <div key={item.id} className="SkyRoute-alert-item-card SkyRoute-card">
                    <div className="SkyRoute-alert-item-card__header">
                      <div className="SkyRoute-alert-item-card__route-box">
                        <span className="SkyRoute-alert-route-icon">
                          <Icon name="flight" size={18} color="var(--primary)" />
                        </span>
                        <div>
                          <h3 className="SkyRoute-alert-route-title">
                            {item.fromCity} &rarr; {item.toCity}
                          </h3>
                          <span className="SkyRoute-alert-date-sub">
                            Monitoring since {item.dateCreated}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`SkyRoute-badge ${
                          item.status.includes('Dropped')
                            ? 'SkyRoute-badge--success'
                            : 'SkyRoute-badge--teal'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="SkyRoute-alert-item-card__prices-grid">
                      <div className="SkyRoute-alert-price-point">
                        <span className="SkyRoute-alert-price-label">Current Lowest Fare</span>
                        <strong className="SkyRoute-alert-curr-val">
                          {formatINR(item.currentPrice)}
                        </strong>
                      </div>

                      <div className="SkyRoute-alert-price-point">
                        <span className="SkyRoute-alert-price-label">Target Threshold</span>
                        <strong className="SkyRoute-alert-target-val">
                          {formatINR(item.targetPrice)}
                        </strong>
                      </div>
                    </div>

                    <div className="SkyRoute-alert-item-card__footer">
                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                        onClick={() => handleSearchFlights(item)}
                      >
                        Search Flights Now &rarr;
                      </button>
                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                        onClick={() => handleDeleteAlert(item.id)}
                      >
                        Delete Alert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAlerts;
