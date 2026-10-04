import React from 'react';

const FlightInformation = ({ flight }) => {
  if (!flight) return null;

  const { aircraft, cabin } = flight;

  return (
    <div className="SkyRoute-card SkyRoute-info-card">
      <h3 className="SkyRoute-info-card__title">Flight Information</h3>

      <div className="SkyRoute-info-card__grid">
        <div className="SkyRoute-info-card__item">
          <span className="SkyRoute-info-card__label">Flight Class</span>
          <span className="SkyRoute-info-card__value">{cabin || 'Economy Standard'}</span>
        </div>

        <div className="SkyRoute-info-card__item">
          <span className="SkyRoute-info-card__label">Aircraft Type</span>
          <span className="SkyRoute-info-card__value">{aircraft || 'Airbus A320'}</span>
        </div>

        <div className="SkyRoute-info-card__item">
          <span className="SkyRoute-info-card__label">In-flight Service</span>
          <span className="SkyRoute-info-card__value">Complimentary Beverages</span>
        </div>

        <div className="SkyRoute-info-card__item">
          <span className="SkyRoute-info-card__label">Seat Pitch</span>
          <span className="SkyRoute-info-card__value">30-31 inches (Standard legroom)</span>
        </div>
      </div>

      <div className="SkyRoute-info-card__notice">
        <span className="SkyRoute-info-card__notice-icon">ℹ️</span>
        <span className="SkyRoute-info-card__notice-text">
          Demo aircraft and amenity information. Specifications may vary by carrier operations.
        </span>
      </div>
    </div>
  );
};

export default FlightInformation;
