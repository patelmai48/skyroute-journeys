import React, { useState, useEffect, useMemo } from 'react';
import SearchSummary from '../components/SearchSummary';
import FlightFilters from '../components/FlightFilters';
import FlightCard from '../components/FlightCard';
import FlightComparisonModal from '../components/FlightComparisonModal';
import CheapestMonthModal from '../components/CheapestMonthModal';
import { getMockFlights, getFlexibleDates } from '../data/flights';

const FlightResults = ({ searchData, onSelectFlight, onEditSearch, onSearchChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stopsFilter, setStopsFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [departureTimeFilter, setDepartureTimeFilter] = useState('all');
  const [baggageFilter, setBaggageFilter] = useState('all');
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('best');

  // Flight Comparison State
  const [comparedFlights, setComparedFlights] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Cheapest Month Modal
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

  // Loading state on query change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchData]);

  // Base flights generated for current route
  const baseFlights = useMemo(() => {
    return getMockFlights(searchData);
  }, [searchData]);

  // Flexible dates generated for current search date
  const flexibleDates = useMemo(() => {
    return getFlexibleDates(searchData?.departureDate, baseFlights[0]?.price || 4250);
  }, [searchData, baseFlights]);

  // Extract distinct available airlines
  const availableAirlines = useMemo(() => {
    const set = new Set();
    baseFlights.forEach((f) => {
      if (f.airline) set.add(f.airline);
    });
    return Array.from(set).sort();
  }, [baseFlights]);

  // Apply active filtering and sorting
  const filteredAndSortedFlights = useMemo(() => {
    let result = [...baseFlights];

    // 1. Filter by Stops
    if (stopsFilter === 'non-stop') {
      result = result.filter((f) => f.stops === 0);
    } else if (stopsFilter === '1-stop') {
      result = result.filter((f) => f.stops === 1);
    }

    // 2. Filter by Price
    if (priceFilter === 'under-5000') {
      result = result.filter((f) => f.price < 5000);
    } else if (priceFilter === '5000-10000') {
      result = result.filter((f) => f.price >= 5000 && f.price <= 10000);
    } else if (priceFilter === 'above-10000') {
      result = result.filter((f) => f.price > 10000);
    }

    // 3. Filter by Airline
    if (airlineFilter !== 'all') {
      result = result.filter((f) => f.airline === airlineFilter);
    }

    // 4. Filter by Departure Time
    if (departureTimeFilter === 'morning') {
      result = result.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return hour >= 6 && hour < 12;
      });
    } else if (departureTimeFilter === 'afternoon') {
      result = result.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return hour >= 12 && hour < 18;
      });
    } else if (departureTimeFilter === 'evening') {
      result = result.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return hour >= 18 || hour < 6;
      });
    }

    // 5. Filter by Baggage
    if (baggageFilter === 'checkin-included') {
      result = result.filter((f) => f.baggage?.includes('Check-in') || f.baggage?.includes('15kg'));
    }

    // 6. Filter by Refundable
    if (refundableOnly) {
      result = result.filter((f) => f.refundable);
    }

    // Sorting: Best (Recommended), Cheapest, Fastest
    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else {
      // Best default score
      result.sort((a, b) => (b.recommendedScore || 90) - (a.recommendedScore || 90));
    }

    return result;
  }, [
    baseFlights,
    stopsFilter,
    priceFilter,
    airlineFilter,
    departureTimeFilter,
    baggageFilter,
    refundableOnly,
    sortBy,
  ]);

  // Identify cheapest and fastest flights
  const cheapestId = useMemo(() => {
    if (!baseFlights.length) return null;
    const sorted = [...baseFlights].sort((a, b) => a.price - b.price);
    return sorted[0]?.id;
  }, [baseFlights]);

  const fastestId = useMemo(() => {
    if (!baseFlights.length) return null;
    const sorted = [...baseFlights].sort((a, b) => a.durationMinutes - b.durationMinutes);
    return sorted[0]?.id;
  }, [baseFlights]);

  const handleResetFilters = () => {
    setStopsFilter('all');
    setPriceFilter('all');
    setAirlineFilter('all');
    setDepartureTimeFilter('all');
    setBaggageFilter('all');
    setRefundableOnly(false);
    setSortBy('best');
  };

  // Compare Toggle handler
  const handleToggleCompare = (flight) => {
    if (comparedFlights.some((f) => f.id === flight.id)) {
      setComparedFlights(comparedFlights.filter((f) => f.id !== flight.id));
    } else {
      if (comparedFlights.length < 3) {
        setComparedFlights([...comparedFlights, flight]);
      }
    }
  };

  const handleRemoveCompare = (flightId) => {
    setComparedFlights(comparedFlights.filter((f) => f.id !== flightId));
  };

  const handleDateSelect = (newDate) => {
    if (onSearchChange) {
      onSearchChange({ ...searchData, departureDate: newDate });
    }
  };

  return (
    <div className="SkyRoute-results-page">
      {/* 1. Top Search Summary Bar */}
      <SearchSummary searchData={searchData} onEdit={onEditSearch} />

      {/* 2. Flexible Dates Ribbon */}
      <div className="SkyRoute-flexible-dates-bar">
        <div className="SkyRoute-container">
          <div className="SkyRoute-flex-dates-header">
            <span className="SkyRoute-flex-dates-title">📅 Nearby Flexible Dates</span>
            <button
              type="button"
              className="SkyRoute-cheapest-month-btn"
              onClick={() => setIsMonthModalOpen(true)}
            >
              📊 View Cheapest Month
            </button>
          </div>

          <div className="SkyRoute-flex-dates-scroll">
            {flexibleDates.map((item, idx) => (
              <div
                key={idx}
                className={`SkyRoute-flex-date-card ${item.isCurrent ? 'SkyRoute-flex-date-card--current' : ''} ${item.isCheapest ? 'SkyRoute-flex-date-card--cheapest' : ''}`}
                onClick={() => handleDateSelect(item.date)}
                role="button"
                tabIndex={0}
              >
                {item.isCheapest && <span className="SkyRoute-flex-cheapest-tag">Cheapest</span>}
                <span className="SkyRoute-flex-date-str">{item.shortDate}</span>
                <strong className="SkyRoute-flex-date-price">₹{item.price.toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Results Grid (Filters + Flight Cards) */}
      <div className="SkyRoute-container SkyRoute-results-container">
        <div className="SkyRoute-results-layout">
          {/* Left Sidebar: Filters */}
          <div className="SkyRoute-results-layout__sidebar">
            <FlightFilters
              stopsFilter={stopsFilter}
              onStopsChange={setStopsFilter}
              priceFilter={priceFilter}
              onPriceChange={setPriceFilter}
              airlineFilter={airlineFilter}
              onAirlineChange={setAirlineFilter}
              departureTimeFilter={departureTimeFilter}
              onDepartureTimeChange={setDepartureTimeFilter}
              baggageFilter={baggageFilter}
              onBaggageChange={setBaggageFilter}
              refundableOnly={refundableOnly}
              onRefundableChange={setRefundableOnly}
              availableAirlines={availableAirlines}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Column: Sorting & Flight Cards */}
          <div className="SkyRoute-results-layout__content">
            {/* Header Control Card with Sort Buttons (Best, Cheapest, Fastest) */}
            <div className="SkyRoute-results-header-card SkyRoute-card">
              <div className="SkyRoute-results-header-card__info">
                <h2 className="SkyRoute-results-header-card__title">Available Flights</h2>
                <span className="SkyRoute-badge SkyRoute-badge--teal">
                  {isLoading
                    ? 'Searching...'
                    : `${filteredAndSortedFlights.length} ${
                        filteredAndSortedFlights.length === 1 ? 'flight' : 'flights'
                      }`}
                </span>
              </div>

              {/* Sorting Tabs: Best, Cheapest, Fastest */}
              <div className="SkyRoute-results-header-card__sort">
                <span className="SkyRoute-sort-label">Sort:</span>
                <div className="SkyRoute-sort-buttons">
                  <button
                    type="button"
                    className={`SkyRoute-sort-btn ${sortBy === 'best' ? 'SkyRoute-sort-btn--active' : ''}`}
                    onClick={() => setSortBy('best')}
                  >
                    Best
                  </button>
                  <button
                    type="button"
                    className={`SkyRoute-sort-btn ${sortBy === 'cheapest' ? 'SkyRoute-sort-btn--active' : ''}`}
                    onClick={() => setSortBy('cheapest')}
                  >
                    Cheapest
                  </button>
                  <button
                    type="button"
                    className={`SkyRoute-sort-btn ${sortBy === 'fastest' ? 'SkyRoute-sort-btn--active' : ''}`}
                    onClick={() => setSortBy('fastest')}
                  >
                    Fastest
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Cards List */}
            {isLoading ? (
              <div className="SkyRoute-loading-state SkyRoute-card">
                <div className="SkyRoute-loading-spinner"></div>
                <h3 className="SkyRoute-loading-title">Finding live flights...</h3>
                <p className="SkyRoute-loading-text">
                  Comparing schedules, direct routes, and lowest available fares for your route.
                </p>
              </div>
            ) : filteredAndSortedFlights.length === 0 ? (
              <div className="SkyRoute-empty-state SkyRoute-card">
                <div className="SkyRoute-empty-state__icon">🔍</div>
                <h3 className="SkyRoute-empty-state__title">No flights match your filters</h3>
                <p className="SkyRoute-empty-state__subtitle">
                  Try clearing some filter criteria or adjusting your price range.
                </p>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--accent SkyRoute-empty-state__reset-btn"
                  onClick={handleResetFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="SkyRoute-flight-list">
                {filteredAndSortedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelectFlight={onSelectFlight}
                    isCheapest={flight.id === cheapestId}
                    isFastest={flight.id === fastestId}
                    isCompared={comparedFlights.some((f) => f.id === flight.id)}
                    onToggleCompare={handleToggleCompare}
                    compareDisabled={comparedFlights.length >= 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Bar */}
      {comparedFlights.length > 0 && (
        <div className="SkyRoute-compare-floating-bar">
          <div className="SkyRoute-compare-floating-bar__inner SkyRoute-card">
            <div className="SkyRoute-compare-floating-bar__left">
              <span className="SkyRoute-badge SkyRoute-badge--teal">
                {comparedFlights.length}/3 Flights Selected
              </span>
              <div className="SkyRoute-compare-thumbs">
                {comparedFlights.map((f) => (
                  <span
                    key={f.id}
                    className="SkyRoute-compare-thumb"
                    style={{ backgroundColor: f.airlineColor }}
                    title={`${f.airline} (${f.flightNumber})`}
                  >
                    {f.airlineCode}
                  </span>
                ))}
              </div>
            </div>

            <div className="SkyRoute-compare-floating-bar__actions">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                onClick={() => setComparedFlights([])}
              >
                Clear
              </button>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--accent SkyRoute-btn--sm"
                onClick={() => setIsComparisonOpen(true)}
              >
                Compare Flights →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flight Comparison Modal */}
      <FlightComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedFlights={comparedFlights}
        onSelectFlight={onSelectFlight}
        onRemoveFlight={handleRemoveCompare}
      />

      {/* Cheapest Month Heatmap Modal */}
      <CheapestMonthModal
        isOpen={isMonthModalOpen}
        onClose={() => setIsMonthModalOpen(false)}
        onSelectDate={handleDateSelect}
        basePrice={baseFlights[0]?.price || 3800}
        initialDate={searchData?.departureDate}
      />
    </div>
  );
};

export default FlightResults;
