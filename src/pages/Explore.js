import React, { useState, useMemo } from 'react';
import { DESTINATIONS, TRAVEL_CATEGORIES } from '../data/travelData';

const getCountryFlag = (country) => {
  if (!country) return '✈️';
  const c = country.toLowerCase();
  if (c.includes('india')) return '🇮🇳';
  if (c.includes('uae') || c.includes('united arab')) return '🇦🇪';
  if (c.includes('singapore')) return '🇸🇬';
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('england')) return '🇬🇧';
  if (c.includes('france')) return '🇫🇷';
  if (c.includes('indonesia')) return '🇮🇩';
  if (c.includes('thailand')) return '🇹🇭';
  if (c.includes('japan')) return '🇯🇵';
  if (c.includes('united states') || c.includes('usa')) return '🇺🇸';
  return '🌍';
};

const Explore = ({ onNavigate, onSearch, onSelectDestination }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState(60000);

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      // Category Filter
      if (selectedCategory !== 'all' && dest.category !== selectedCategory) {
        return false;
      }
      // Budget Filter
      if (dest.price > maxBudget) {
        return false;
      }
      // Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = dest.name.toLowerCase().includes(q);
        const matchCountry = dest.country.toLowerCase().includes(q);
        const matchCode = dest.code.toLowerCase().includes(q);
        const matchTagline = (dest.tagline || '').toLowerCase().includes(q);
        if (!matchName && !matchCountry && !matchCode && !matchTagline) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery, maxBudget]);

  const handleBookFlights = (dest) => {
    if (onSearch) {
      onSearch({
        origin: 'Ahmedabad (AMD)',
        destination: `${dest.name} (${dest.code})`,
        tripType: 'round-trip',
        departureDate: new Date(),
        returnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        passengers: 1,
        cabinClass: 'Economy'
      });
    }
  };

  const handleOpenDetails = (dest) => {
    if (onSelectDestination) onSelectDestination(dest);
    if (onNavigate) onNavigate(`/destination/${dest.id}`);
  };

  return (
    <div className="SkyRoute-explore-page">
      {/* Editorial Hero Header */}
      <div className="SkyRoute-explore-hero">
        <div className="SkyRoute-container">
          <div className="SkyRoute-explore-hero__content">
            <span className="SkyRoute-badge SkyRoute-badge--teal">DESTINATION EXPLORER</span>
            <h1 className="SkyRoute-explore-hero__title">Explore Routes & Escapes</h1>
            <p className="SkyRoute-explore-hero__subtitle">
              Discover breathtaking destinations worldwide, compare direct round-trip fares, and find your next unforgettable journey.
            </p>

            {/* Quick Search & Budget Controls */}
            <div className="SkyRoute-explore-filter-card SkyRoute-card">
              <div className="SkyRoute-explore-search-box">
                <span className="SkyRoute-explore-search-icon">🔍</span>
                <input
                  type="text"
                  className="SkyRoute-explore-search-input"
                  placeholder="Search destination, city, airport code, or country (e.g. Dubai, London, Goa)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="SkyRoute-explore-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="SkyRoute-explore-budget-row">
                <div className="SkyRoute-budget-slider-wrapper">
                  <span className="SkyRoute-budget-label">
                    Max Starting Fare: <strong>₹{maxBudget.toLocaleString('en-IN')}</strong>
                  </span>
                  <input
                    type="range"
                    min="3000"
                    max="60000"
                    step="1000"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="SkyRoute-budget-range"
                  />
                </div>
                <div className="SkyRoute-explore-count-tag">
                  Showing <strong>{filteredDestinations.length}</strong> Destinations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="SkyRoute-container">
        {/* Curated Escapes Category Pill Buttons */}
        <div className="SkyRoute-explore-categories-section">
          <div className="SkyRoute-category-tabs-row" role="tablist">
            {TRAVEL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                className={`SkyRoute-cat-pill-btn ${
                  selectedCategory === cat.id ? 'SkyRoute-cat-pill-btn--active' : ''
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="SkyRoute-cat-pill-btn__icon">{cat.icon}</span>
                <span className="SkyRoute-cat-pill-btn__label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Heading */}
        <div className="SkyRoute-explore-results-header">
          <div>
            <h2 className="SkyRoute-explore-results-title">
              {selectedCategory === 'all'
                ? 'All Popular Destinations'
                : `${TRAVEL_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Curated'} Escapes`}
              <span className="SkyRoute-explore-count"> ({filteredDestinations.length})</span>
            </h2>
            <p className="SkyRoute-explore-results-sub">
              Starting round-trip flight fares departing from Ahmedabad (AMD). Prices include taxes & fees.
            </p>
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="SkyRoute-explore-empty SkyRoute-card">
            <span className="SkyRoute-explore-empty-icon">🏝️</span>
            <h3>No destinations match your filters</h3>
            <p>Try adjusting your search query, increasing the budget limit, or selecting "All Places".</p>
            <button
              type="button"
              className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxBudget(60000);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="SkyRoute-explore-dest-grid">
            {filteredDestinations.map((dest) => {
              const flag = getCountryFlag(dest.country);
              return (
                <div key={dest.id} className="SkyRoute-destination-explorer-card SkyRoute-card">
                  {/* Card Visual Header */}
                  <div className="SkyRoute-destination-explorer-card__image-wrap">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="SkyRoute-destination-explorer-card__image"
                      loading="lazy"
                    />
                    <div className="SkyRoute-destination-explorer-card__flag-badge" title={dest.country}>
                      <span className="SkyRoute-destination-explorer-card__flag-emoji">{flag}</span>
                    </div>
                    <span className="SkyRoute-badge SkyRoute-destination-explorer-card__cat-badge">
                      {(dest.category || 'Travel').toUpperCase()}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="SkyRoute-destination-explorer-card__body">
                    <div className="SkyRoute-destination-explorer-card__title-row">
                      <div>
                        <h3 className="SkyRoute-destination-explorer-card__city">{dest.name}</h3>
                        <span className="SkyRoute-destination-explorer-card__country">{dest.country}</span>
                      </div>
                      <div className="SkyRoute-destination-explorer-card__code-badge">{dest.code}</div>
                    </div>

                    <p className="SkyRoute-destination-explorer-card__description">
                      {dest.tagline || 'Experience unforgettable sightseeing, cultural heritage, and vibrant local cuisine.'}
                    </p>

                    {/* Metadata Grid: Price, Duration, Weather */}
                    <div className="SkyRoute-destination-explorer-card__stats-box">
                      <div className="SkyRoute-destination-stat-item">
                        <span className="SkyRoute-destination-stat-item__label">Starting From</span>
                        <strong className="SkyRoute-destination-stat-item__value SkyRoute-destination-stat-item__price">
                          ₹{dest.price.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div className="SkyRoute-destination-stat-item">
                        <span className="SkyRoute-destination-stat-item__label">Duration</span>
                        <span className="SkyRoute-destination-stat-item__value">
                          ⏱ {dest.durationFromAMD || '2h 30m'}
                        </span>
                      </div>
                      {dest.weather && (
                        <div className="SkyRoute-destination-stat-item">
                          <span className="SkyRoute-destination-stat-item__label">Weather</span>
                          <span className="SkyRoute-destination-stat-item__value">
                            🌤 {dest.weather}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Popular Attractions */}
                    {dest.attractions && dest.attractions.length > 0 && (
                      <div className="SkyRoute-destination-explorer-card__attractions-box">
                        <span className="SkyRoute-destination-explorer-card__attractions-title">
                          Popular Attractions
                        </span>
                        <ul className="SkyRoute-destination-explorer-card__attractions-list">
                          {dest.attractions.slice(0, 3).map((attr, idx) => (
                            <li key={idx} className="SkyRoute-destination-explorer-card__attraction-bullet">
                              <span className="SkyRoute-bullet-dot">&bull;</span> {attr}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="SkyRoute-destination-explorer-card__actions">
                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                        onClick={() => handleOpenDetails(dest)}
                      >
                        Explore {dest.name} →
                      </button>
                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                        onClick={() => handleBookFlights(dest)}
                      >
                        Search Flights to {dest.code}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
