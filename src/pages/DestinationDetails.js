import React, { useState } from 'react';
import Icon from '../components/Icon';
import { DESTINATIONS } from '../data/travelData';
import { INITIAL_MOCK_FLIGHTS } from '../data/flights';

const DestinationDetails = ({ destination, destinationId, onNavigate, onSearch, onSelectFlight }) => {
  // Resolve destination object
  const dest =
    destination ||
    DESTINATIONS.find((d) => d.id === destinationId) ||
    DESTINATIONS[0];

  const [activeTab, setActiveTab] = useState('overview');

  const matchingFlights = INITIAL_MOCK_FLIGHTS.slice(0, 3).map((f) => ({
    ...f,
    originCity: 'Ahmedabad',
    originCode: 'AMD',
    destinationCity: dest.name,
    destinationCode: dest.code,
    price: dest.price + (f.stops > 0 ? -400 : +200)
  }));

  const handleBookFlight = (flight) => {
    if (onSelectFlight) onSelectFlight(flight);
    onNavigate('/flight-details');
  };

  const handleSearchAllFlights = () => {
    if (onSearch) {
      onSearch({
        origin: 'Ahmedabad (AMD)',
        destination: `${dest.name} (${dest.code})`,
        tripType: 'round-trip',
        departureDate: new Date(),
        returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        passengers: 1,
        cabinClass: 'Economy'
      });
    }
  };

  return (
    <div className="SkyRoute-dest-detail-page">
      {/* 1. Hero Header Banner */}
      <div className="SkyRoute-dest-hero">
        <img src={dest.image} alt={dest.name} className="SkyRoute-dest-hero__bg" />
        <div className="SkyRoute-dest-hero__overlay"></div>

        <div className="SkyRoute-container SkyRoute-dest-hero__content">
          <button
            type="button"
            className="SkyRoute-dest-back-btn"
            onClick={() => onNavigate('/explore')}
          >
            &larr; Back to Explore
          </button>

          <div className="SkyRoute-dest-hero__badges">
            <span className="SkyRoute-badge SkyRoute-badge--success">{dest.category.toUpperCase()}</span>
            <span className="SkyRoute-badge">{dest.country}</span>
            <span className="SkyRoute-dest-hero__weather-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Icon name="cloudSun" size={14} color="#173F3A" />
              <span>{dest.weather}</span>
            </span>
          </div>

          <h1 className="SkyRoute-dest-hero__title">
            {dest.name} <span className="SkyRoute-dest-hero__code">({dest.code})</span>
          </h1>
          <p className="SkyRoute-dest-hero__tagline">{dest.tagline}</p>

          {/* Key Metric Strip */}
          <div className="SkyRoute-dest-metrics-strip SkyRoute-card">
            <div className="SkyRoute-dest-metric">
              <span className="SkyRoute-dest-metric__label">Starting Airfare</span>
              <strong className="SkyRoute-dest-metric__value">₹{dest.price.toLocaleString('en-IN')}</strong>
            </div>
            <div className="SkyRoute-dest-metric">
              <span className="SkyRoute-dest-metric__label">Flight Duration</span>
              <strong className="SkyRoute-dest-metric__value">{dest.durationFromAMD}</strong>
            </div>
            <div className="SkyRoute-dest-metric">
              <span className="SkyRoute-dest-metric__label">Best Time to Visit</span>
              <strong className="SkyRoute-dest-metric__value">{dest.bestTime}</strong>
            </div>
            <div className="SkyRoute-dest-metric">
              <span className="SkyRoute-dest-metric__label">Traveller Rating</span>
              <strong className="SkyRoute-dest-metric__value" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="star" size={13} color="#D97706" /> {dest.rating} ({dest.reviews} reviews)
              </strong>
            </div>
            <div className="SkyRoute-dest-metric__action">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary"
                onClick={handleSearchAllFlights}
              >
                Search Flights &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Tabs & Grid */}
      <div className="SkyRoute-container SkyRoute-dest-main-container">
        <div className="SkyRoute-dest-grid-layout">
          {/* Left Main Column: Attractions, Things to Do, Tips, Hotels */}
          <div className="SkyRoute-dest-main-col">
            {/* Navigation Tabs */}
            <div className="SkyRoute-dest-tabs">
              <button
                type="button"
                className={`SkyRoute-dest-tab ${activeTab === 'overview' ? 'SkyRoute-dest-tab--active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview &amp; Sights
              </button>
              <button
                type="button"
                className={`SkyRoute-dest-tab ${activeTab === 'hotels' ? 'SkyRoute-dest-tab--active' : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                Top Hotels
              </button>
              <button
                type="button"
                className={`SkyRoute-dest-tab ${activeTab === 'flights' ? 'SkyRoute-dest-tab--active' : ''}`}
                onClick={() => setActiveTab('flights')}
              >
                Flight Schedules
              </button>
            </div>

            {/* Tab 1: Overview & Attractions */}
            {activeTab === 'overview' && (
              <div className="SkyRoute-dest-section-block">
                {/* Popular Attractions */}
                <div className="SkyRoute-dest-card-box SkyRoute-card">
                  <h3 className="SkyRoute-dest-box-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="mapPin" size={18} color="var(--SkyRoute-teal)" />
                    <span>Top Popular Attractions in {dest.name}</span>
                  </h3>
                  <ul className="SkyRoute-dest-attractions-list">
                    {dest.attractions?.map((item, index) => (
                      <li key={index} className="SkyRoute-dest-attraction-item">
                        <span className="SkyRoute-dest-item-bullet">{index + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Things to Do */}
                <div className="SkyRoute-dest-card-box SkyRoute-card">
                  <h3 className="SkyRoute-dest-box-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="sparkles" size={18} color="#16A34A" />
                    <span>Curated Experiences &amp; Things to Do</span>
                  </h3>
                  <div className="SkyRoute-dest-experiences-grid">
                    {dest.thingsToDo?.map((exp, index) => (
                      <div key={index} className="SkyRoute-dest-exp-card">
                        <span className="SkyRoute-dest-exp-icon">
                          <Icon name="target" size={18} color="var(--primary)" />
                        </span>
                        <p className="SkyRoute-dest-exp-text">{exp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Tips */}
                {dest.travelTips && (
                  <div className="SkyRoute-dest-tips-box SkyRoute-card">
                    <span className="SkyRoute-dest-tips-icon">
                      <Icon name="lightbulb" size={20} color="var(--primary)" />
                    </span>
                    <div>
                      <h4 className="SkyRoute-dest-tips-title">SkyRoute Local Travel Tip</h4>
                      <p className="SkyRoute-dest-tips-text">{dest.travelTips}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Hotels */}
            {activeTab === 'hotels' && (
              <div className="SkyRoute-dest-hotels-section">
                <h3 className="SkyRoute-dest-box-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="hotel" size={18} color="var(--primary)" />
                  <span>Handpicked Stays in {dest.name}</span>
                </h3>
                <div className="SkyRoute-dest-hotels-grid">
                  {dest.popularHotels?.map((hotel, index) => (
                    <div key={index} className="SkyRoute-dest-hotel-card SkyRoute-card">
                      <div className="SkyRoute-dest-hotel-card__body">
                        <span className="SkyRoute-dest-hotel-type">{hotel.type}</span>
                        <h4 className="SkyRoute-dest-hotel-name">{hotel.name}</h4>
                        <div className="SkyRoute-dest-hotel-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="star" size={13} color="#D97706" /> {hotel.rating} / 5.0
                        </div>
                      </div>
                      <div className="SkyRoute-dest-hotel-card__footer">
                        <div>
                          <span className="SkyRoute-dest-hotel-price-label">Per Night</span>
                          <strong className="SkyRoute-dest-hotel-price">₹{hotel.price.toLocaleString('en-IN')}</strong>
                        </div>
                        <button
                          type="button"
                          className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                          onClick={() => onNavigate('/hotels')}
                        >
                          View Hotel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Direct Flights */}
            {activeTab === 'flights' && (
              <div className="SkyRoute-dest-flights-section">
                <h3 className="SkyRoute-dest-box-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="flight" size={18} color="var(--primary)" />
                  <span>Top Direct Flights to {dest.name}</span>
                </h3>
                <div className="SkyRoute-dest-flight-list">
                  {matchingFlights.map((flight) => (
                    <div key={flight.id} className="SkyRoute-dest-flight-item SkyRoute-card">
                      <div className="SkyRoute-dest-flight-item__airline">
                        <span
                          className="SkyRoute-airline-logo-badge"
                          style={{ backgroundColor: flight.airlineColor }}
                        >
                          {flight.airlineCode}
                        </span>
                        <div>
                          <strong className="SkyRoute-dest-flight-airline-name">{flight.airline}</strong>
                          <span className="SkyRoute-dest-flight-num">{flight.flightNumber}</span>
                        </div>
                      </div>

                      <div className="SkyRoute-dest-flight-item__times">
                        <div className="SkyRoute-flight-time-point">
                          <span className="SkyRoute-flight-time">{flight.departureTime}</span>
                          <span className="SkyRoute-flight-city">AMD</span>
                        </div>
                        <div className="SkyRoute-flight-duration-line">
                          <span>{flight.durationText}</span>
                          <div className="SkyRoute-flight-arrow-bar"></div>
                          <span className="SkyRoute-flight-stops">{flight.stopText}</span>
                        </div>
                        <div className="SkyRoute-flight-time-point">
                          <span className="SkyRoute-flight-time">{flight.arrivalTime}</span>
                          <span className="SkyRoute-flight-city">{dest.code}</span>
                        </div>
                      </div>

                      <div className="SkyRoute-dest-flight-item__price-cta">
                        <span className="SkyRoute-dest-flight-price">₹{flight.price.toLocaleString('en-IN')}</span>
                        <button
                          type="button"
                          className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                          onClick={() => handleBookFlight(flight)}
                        >
                          Select Flight &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Quick Booking Widget */}
          <div className="SkyRoute-dest-sidebar-col">
            <div className="SkyRoute-dest-booking-card SkyRoute-card">
              <h3 className="SkyRoute-dest-sidebar-title">Ready to visit {dest.name}?</h3>
              <p className="SkyRoute-dest-sidebar-sub">
                Lock in lowest airfares today. Free cancellation available on flexible tickets.
              </p>

              <div className="SkyRoute-dest-sidebar-price-banner">
                <span>Direct Flights starting at</span>
                <strong className="SkyRoute-dest-sidebar-fare">₹{dest.price.toLocaleString('en-IN')}</strong>
              </div>

              <div className="SkyRoute-dest-sidebar-perks">
                <div className="SkyRoute-dest-perk">
                  <Icon name="shieldCheck" size={16} color="var(--SkyRoute-teal)" />
                  <span>100% Price Match Guarantee</span>
                </div>
                <div className="SkyRoute-dest-perk">
                  <Icon name="zap" size={16} color="var(--SkyRoute-teal)" />
                  <span>Instant E-ticket Generation</span>
                </div>
                <div className="SkyRoute-dest-perk">
                  <Icon name="smartphone" size={16} color="var(--SkyRoute-teal)" />
                  <span>Mobile Boarding Pass Support</span>
                </div>
              </div>

              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--full SkyRoute-dest-sidebar-cta"
                onClick={handleSearchAllFlights}
              >
                Search Ahmedabad → {dest.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
