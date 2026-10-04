import React from 'react';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const FareSummary = ({ flight, searchData, onContinue }) => {
  if (!flight) return null;

  const passengers = Number(searchData?.passengers) || 1;
  const unitPrice = flight.price || 3800;

  // Calculate realistic fare breakdown: ~84% Base fare, ~16% Taxes & Airport Fees
  const baseFarePerPerson = Math.round(unitPrice * 0.84);
  const taxesPerPerson = unitPrice - baseFarePerPerson;

  const totalBaseFare = baseFarePerPerson * passengers;
  const totalTaxes = taxesPerPerson * passengers;
  const grandTotal = unitPrice * passengers;

  return (
    <div className="SkyRoute-card SkyRoute-fare-summary-card">
      <h3 className="SkyRoute-fare-summary-card__title">Fare Summary</h3>

      <div className="SkyRoute-fare-summary-card__list">
        <div className="SkyRoute-fare-summary-card__row">
          <span className="SkyRoute-fare-summary-card__label">
            Base Fare {passengers > 1 && `(${passengers} × ${formatINR(baseFarePerPerson)})`}
          </span>
          <span className="SkyRoute-fare-summary-card__val">{formatINR(totalBaseFare)}</span>
        </div>

        <div className="SkyRoute-fare-summary-card__row">
          <span className="SkyRoute-fare-summary-card__label">
            Taxes & Airport Fees {passengers > 1 && `(${passengers} × ${formatINR(taxesPerPerson)})`}
          </span>
          <span className="SkyRoute-fare-summary-card__val">{formatINR(totalTaxes)}</span>
        </div>

        <div className="SkyRoute-fare-summary-card__row SkyRoute-fare-summary-card__row--addon">
          <span className="SkyRoute-fare-summary-card__label">Convenience Fee</span>
          <span className="SkyRoute-fare-summary-card__val SkyRoute-fare-summary-card__val--free">
            FREE (Demo)
          </span>
        </div>

        <div className="SkyRoute-fare-summary-card__divider"></div>

        {/* Total Row */}
        <div className="SkyRoute-fare-summary-card__row SkyRoute-fare-summary-card__row--total">
          <div>
            <span className="SkyRoute-fare-summary-card__total-title">Total Amount</span>
            <span className="SkyRoute-fare-summary-card__total-sub">
              Includes all taxes & carrier surcharges
            </span>
          </div>
          <span className="SkyRoute-fare-summary-card__total-val">{formatINR(grandTotal)}</span>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="SkyRoute-fare-summary-card__guarantee">
        <span className="SkyRoute-fare-summary-card__guarantee-icon">🛡️</span>
        <span className="SkyRoute-fare-summary-card__guarantee-text">
          Best price guarantee. Instant booking confirmation.
        </span>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-fare-summary-card__cta-btn"
        onClick={onContinue}
      >
        Continue to Passenger Details &rarr;
      </button>
    </div>
  );
};

export default FareSummary;
