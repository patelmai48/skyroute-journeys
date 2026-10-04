import React from 'react';
import format from 'date-fns/format';

const formatDisplayDate = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : format(d, 'EEE, d MMM yyyy');
  } catch (e) {
    return '';
  }
};

const SearchSummary = ({ searchData, onEdit }) => {
  const origin = (searchData?.origin && searchData.origin.trim()) || 'Ahmedabad (AMD)';
  const destination = (searchData?.destination && searchData.destination.trim()) || 'Dubai (DXB)';
  const departureDate = searchData?.departureDate || new Date();
  const returnDate = searchData?.returnDate;
  const isRoundTrip = searchData?.tripType === 'round-trip';
  const tripType = isRoundTrip ? 'Round Trip' : 'One Way';
  const passengers = searchData?.passengers || 1;
  const cabinClass = searchData?.cabinClass || 'Economy';

  return (
    <div className="SkyRoute-search-summary-wrap">
      <div className="SkyRoute-container">
        <div className="SkyRoute-summary-card SkyRoute-card">
          <div className="SkyRoute-summary-card__main">
            {/* Primary Visual Element: Route */}
            <div className="SkyRoute-summary-card__route-section">
              <div className="SkyRoute-summary-card__badge-row">
                <span className="SkyRoute-badge SkyRoute-badge--teal">FLIGHT SEARCH SUMMARY</span>
                <span className="SkyRoute-badge SkyRoute-badge--outline">{tripType}</span>
              </div>
              <div className="SkyRoute-summary-card__route-title">
                <span className="SkyRoute-summary-route-city">{origin}</span>
                <span className="SkyRoute-summary-route-arrow" aria-hidden="true">
                  {isRoundTrip ? '⇄' : '➔'}
                </span>
                <span className="SkyRoute-summary-route-city">{destination}</span>
              </div>
            </div>

            {/* Secondary Metadata Grid */}
            <div className="SkyRoute-summary-card__details-grid">
              <div className="SkyRoute-summary-meta-item">
                <span className="SkyRoute-summary-meta-item__icon">📅</span>
                <div className="SkyRoute-summary-meta-item__content">
                  <span className="SkyRoute-summary-meta-item__label">Travel Date</span>
                  <strong className="SkyRoute-summary-meta-item__val">
                    {formatDisplayDate(departureDate)}
                    {isRoundTrip && returnDate && (
                      <> &ndash; {formatDisplayDate(returnDate)}</>
                    )}
                  </strong>
                </div>
              </div>

              <div className="SkyRoute-summary-meta-item">
                <span className="SkyRoute-summary-meta-item__icon">👥</span>
                <div className="SkyRoute-summary-meta-item__content">
                  <span className="SkyRoute-summary-meta-item__label">Passengers</span>
                  <strong className="SkyRoute-summary-meta-item__val">
                    {passengers} {passengers === 1 ? 'Adult' : 'Adults'}
                  </strong>
                </div>
              </div>

              <div className="SkyRoute-summary-meta-item">
                <span className="SkyRoute-summary-meta-item__icon">💺</span>
                <div className="SkyRoute-summary-meta-item__content">
                  <span className="SkyRoute-summary-meta-item__label">Cabin Class</span>
                  <strong className="SkyRoute-summary-meta-item__val">{cabinClass}</strong>
                </div>
              </div>
            </div>

            {/* Action / Edit */}
            {onEdit && (
              <div className="SkyRoute-summary-card__action">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-summary-modify-btn"
                  onClick={onEdit}
                  title="Click to modify flight search parameters"
                >
                  <span className="SkyRoute-modify-icon">✏️</span>
                  <span>Modify Search</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSummary;
