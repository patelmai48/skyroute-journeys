import React from 'react';
import Icon from './Icon';

const FlightFilters = ({
  stopsFilter,
  onStopsChange,
  priceFilter,
  onPriceChange,
  airlineFilter,
  onAirlineChange,
  departureTimeFilter = 'all',
  onDepartureTimeChange,
  baggageFilter = 'all',
  onBaggageChange,
  refundableOnly = false,
  onRefundableChange,
  availableAirlines = [],
  onResetFilters,
}) => {
  return (
    <aside className="SkyRoute-filters-card SkyRoute-card" aria-label="Flight Search Filters">
      <div className="SkyRoute-filters-card__header">
        <h3 className="SkyRoute-filters-card__title">Filter Flights</h3>
        <button
          type="button"
          className="SkyRoute-filters-card__reset-btn"
          onClick={onResetFilters}
          title="Reset all filters"
        >
          Reset All
        </button>
      </div>

      <div className="SkyRoute-filters-card__body">
        {/* 1. Stops Filter */}
        <div className="SkyRoute-filter-group">
          <label className="SkyRoute-filter-group__title">Stops</label>
          <div className="SkyRoute-filter-options">
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="stops"
                value="all"
                checked={stopsFilter === 'all'}
                onChange={(e) => onStopsChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">All Flights</span>
            </label>
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="stops"
                value="non-stop"
                checked={stopsFilter === 'non-stop'}
                onChange={(e) => onStopsChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">Direct / Non-stop</span>
            </label>
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="stops"
                value="1-stop"
                checked={stopsFilter === '1-stop'}
                onChange={(e) => onStopsChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">1 Stop</span>
            </label>
          </div>
        </div>

        {/* 2. Refundability Filter */}
        <div className="SkyRoute-filter-group">
          <label className="SkyRoute-filter-group__title">Ticket Policy</label>
          <div className="SkyRoute-filter-options">
            <label className="SkyRoute-filter-option">
              <input
                type="checkbox"
                checked={refundableOnly}
                onChange={(e) => onRefundableChange(e.target.checked)}
              />
              <span className="SkyRoute-filter-option__text">Refundable Fares Only</span>
            </label>
          </div>
        </div>

        {/* 3. Departure Time of Day */}
        <div className="SkyRoute-filter-group">
          <label className="SkyRoute-filter-group__title">Departure Time</label>
          <div className="SkyRoute-time-slots-grid">
            {[
              { id: 'all', label: 'Any', iconName: 'clock' },
              { id: 'morning', label: 'Morning (06-12)', iconName: 'sun' },
              { id: 'afternoon', label: 'Afternoon (12-18)', iconName: 'sun' },
              { id: 'evening', label: 'Evening (18-24)', iconName: 'compass' },
            ].map((slot) => (
              <button
                key={slot.id}
                type="button"
                className={`SkyRoute-time-slot-btn ${departureTimeFilter === slot.id ? 'SkyRoute-time-slot-btn--active' : ''}`}
                onClick={() => onDepartureTimeChange(slot.id)}
              >
                <Icon name={slot.iconName} size={15} color={departureTimeFilter === slot.id ? '#FFFFFF' : '#1E5282'} />
                <span>{slot.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Price Filter */}
        <div className="SkyRoute-filter-group">
          <label className="SkyRoute-filter-group__title">Price Range</label>
          <div className="SkyRoute-filter-options">
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="price"
                value="all"
                checked={priceFilter === 'all'}
                onChange={(e) => onPriceChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">Any Price</span>
            </label>
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="price"
                value="under-5000"
                checked={priceFilter === 'under-5000'}
                onChange={(e) => onPriceChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">Under ₹5,000</span>
            </label>
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="price"
                value="5000-10000"
                checked={priceFilter === '5000-10000'}
                onChange={(e) => onPriceChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">₹5,000 &ndash; ₹10,000</span>
            </label>
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="price"
                value="above-10000"
                checked={priceFilter === 'above-10000'}
                onChange={(e) => onPriceChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">Above ₹10,000 (Premium)</span>
            </label>
          </div>
        </div>

        {/* 5. Airlines Filter */}
        {availableAirlines.length > 0 && (
          <div className="SkyRoute-filter-group">
            <label className="SkyRoute-filter-group__title">Airlines</label>
            <div className="SkyRoute-filter-options">
              <label className="SkyRoute-filter-option">
                <input
                  type="radio"
                  name="airline"
                  value="all"
                  checked={airlineFilter === 'all'}
                  onChange={(e) => onAirlineChange(e.target.value)}
                />
                <span className="SkyRoute-filter-option__text">All Airlines</span>
              </label>
              {availableAirlines.map((airline) => (
                <label key={airline} className="SkyRoute-filter-option">
                  <input
                    type="radio"
                    name="airline"
                    value={airline}
                    checked={airlineFilter === airline}
                    onChange={(e) => onAirlineChange(e.target.value)}
                  />
                  <span className="SkyRoute-filter-option__text">{airline}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 6. Baggage Included */}
        <div className="SkyRoute-filter-group">
          <label className="SkyRoute-filter-group__title">Baggage Allowance</label>
          <div className="SkyRoute-filter-options">
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="baggage"
                value="all"
                checked={baggageFilter === 'all'}
                onChange={(e) => onBaggageChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">Any Allowance</span>
            </label>
            <label className="SkyRoute-filter-option">
              <input
                type="radio"
                name="baggage"
                value="checkin-included"
                checked={baggageFilter === 'checkin-included'}
                onChange={(e) => onBaggageChange(e.target.value)}
              />
              <span className="SkyRoute-filter-option__text">15kg+ Check-in Included</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FlightFilters;
