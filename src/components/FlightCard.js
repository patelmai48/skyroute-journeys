import React from 'react';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const FlightCard = ({
  flight,
  onSelectFlight,
  isCheapest,
  isFastest,
  isCompared = false,
  onToggleCompare,
  compareDisabled = false
}) => {
  const {
    id,
    airline,
    airlineCode,
    airlineColor,
    flightNumber,
    aircraft,
    departureTime,
    arrivalTime,
    durationText,
    stops,
    stopText,
    price,
    seatsLeft,
    originCode,
    destinationCode,
    originCity,
    destinationCity,
    cabin,
    baggage,
    refundable,
    refundPolicy,
    onTimeRating
  } = flight;

  return (
    <div className={`SkyRoute-flight-card SkyRoute-card ${isCompared ? 'SkyRoute-flight-card--compared' : ''}`}>
      {/* Highlight Badges */}
      <div className="SkyRoute-flight-card__tag-bar">
        {isCheapest && (
          <span className="SkyRoute-badge SkyRoute-badge--teal">
            ⚡ CHEAPEST FARE
          </span>
        )}
        {isFastest && (
          <span className="SkyRoute-badge SkyRoute-badge--rose">
            🚀 FASTEST FLIGHT
          </span>
        )}
        {seatsLeft && seatsLeft <= 3 && (
          <span className="SkyRoute-badge SkyRoute-badge--warning">
            🔥 {seatsLeft} SEATS LEFT
          </span>
        )}
        {refundable && (
          <span className="SkyRoute-badge SkyRoute-badge--success">
            ✓ FREE CANCELLATION
          </span>
        )}
      </div>

      <div className="SkyRoute-flight-card__body">
        {/* Airline Info & Compare Toggle */}
        <div className="SkyRoute-flight-card__top">
          <div className="SkyRoute-flight-card__airline-info">
            <div
              className="SkyRoute-flight-card__logo"
              style={{ backgroundColor: airlineColor || '#4A342A' }}
              title={airline}
            >
              <span className="SkyRoute-flight-card__logo-icon">✈</span>
              <span className="SkyRoute-flight-card__logo-code">
                {airlineCode || (airline ? airline.slice(0, 2).toUpperCase() : 'SK')}
              </span>
            </div>
            <div className="SkyRoute-flight-card__airline-meta">
              <strong className="SkyRoute-flight-card__airline-name">{airline || 'SkyRoute Partner'}</strong>
              <span className="SkyRoute-flight-card__flight-number">
                {flightNumber || 'SK-100'} {aircraft ? `• ${aircraft}` : ''}
              </span>
            </div>
          </div>

          {/* Compare Checkbox */}
          {onToggleCompare && (
            <label className={`SkyRoute-flight-card__compare-toggle ${compareDisabled && !isCompared ? 'SkyRoute-flight-card__compare-toggle--disabled' : ''}`}>
              <input
                type="checkbox"
                checked={isCompared}
                onChange={() => onToggleCompare(flight)}
                disabled={compareDisabled && !isCompared}
              />
              <span>Compare</span>
            </label>
          )}
        </div>

        {/* Flight Schedule Row */}
        <div className="SkyRoute-flight-card__main">
          {/* Departure */}
          <div className="SkyRoute-flight-card__time-box">
            <div className="SkyRoute-flight-card__time">{departureTime}</div>
            <div className="SkyRoute-flight-card__city-code">{originCode}</div>
            <div className="SkyRoute-flight-card__city-name">{originCity}</div>
          </div>

          {/* Route & Duration Graphic */}
          <div className="SkyRoute-flight-card__route-graphic">
            <span className="SkyRoute-flight-card__duration-text">{durationText}</span>
            <div className="SkyRoute-flight-card__flight-line">
              <span className="SkyRoute-flight-card__dot SkyRoute-flight-card__dot--origin"></span>
              <div className="SkyRoute-flight-card__line-track"></div>
              <span className="SkyRoute-flight-card__plane-icon">✈</span>
              <span className="SkyRoute-flight-card__dot SkyRoute-flight-card__dot--dest"></span>
            </div>
            <span className={`SkyRoute-flight-card__stops-badge ${stops === 0 ? 'SkyRoute-flight-card__stops-badge--nonstop' : ''}`}>
              {stopText}
            </span>
          </div>

          {/* Arrival */}
          <div className="SkyRoute-flight-card__time-box SkyRoute-flight-card__time-box--dest">
            <div className="SkyRoute-flight-card__time">{arrivalTime}</div>
            <div className="SkyRoute-flight-card__city-code">{destinationCode}</div>
            <div className="SkyRoute-flight-card__city-name">{destinationCity}</div>
          </div>
        </div>

        {/* Perks & Amenities Line */}
        <div className="SkyRoute-flight-card__perks-bar">
          <span className="SkyRoute-flight-perk-item">🧳 {baggage || '15kg baggage'}</span>
          <span className="SkyRoute-flight-perk-item">
            {refundable ? 'Free cancellation' : 'Standard cancellation'}
          </span>
          <span className="SkyRoute-flight-perk-item">⏱️ {onTimeRating || '95% On-time'}</span>
          {cabin && <span className="SkyRoute-flight-perk-item">💺 {cabin}</span>}
        </div>

        {/* Price & Select CTA */}
        <div className="SkyRoute-flight-card__bottom">
          <div className="SkyRoute-flight-card__price-section">
            <div className="SkyRoute-flight-card__price-amount">{formatINR(price)}</div>
            <span className="SkyRoute-flight-card__price-label">per adult</span>
          </div>

          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--accent SkyRoute-flight-card__select-btn"
            onClick={() => onSelectFlight(flight)}
          >
            <span>Select</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
