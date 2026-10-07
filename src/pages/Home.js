import React from 'react';
import Hero from '../components/Hero';
import Icon from '../components/Icon';
import { DESTINATIONS, TRAVEL_CATEGORIES } from '../data/travelData';

const POPULAR_DESTINATION_IDS = ['goa', 'dubai', 'bali', 'singapore', 'paris', 'london', 'manali', 'delhi'];

const PLAN_BETTER_ITEMS = [
  { id: 'manage', title: 'Manage Booking', desc: 'Reschedule, cancel or modify your seat', iconName: 'fileText', path: '/manage-booking' },
  { id: 'status', title: 'Check Flight Status', desc: 'Live departure, gate & arrival radar', iconName: 'takeoff', path: '/flight-status' },
  { id: 'checkin', title: 'Web Check-in', desc: 'Select seats and get mobile boarding pass', iconName: 'ticket', path: '/my-trips' },
  { id: 'insurance', title: 'Travel Insurance', desc: 'Comprehensive medical & trip protection', iconName: 'shieldCheck', path: '/insurance' },
  { id: 'baggage', title: 'Baggage Info', desc: 'Cabin and check-in baggage guidelines', iconName: 'luggage', path: '/about' },
  { id: 'ai-planner', title: 'AI Trip Planner', desc: 'Personalized day-by-day smart itineraries', iconName: 'sparkles', path: '/ai-planner' },
];

const Home = ({ onSearch, searchData, onNavigate, onSelectDestination }) => {
  const popularDestinations = DESTINATIONS.filter((d) =>
    POPULAR_DESTINATION_IDS.includes(d.id)
  );

  const handleCategoryClick = (catId) => {
    onNavigate(`/explore?category=${catId}`);
  };

  const handleQuickFlight = (destination) => {
    onSearch({
      origin: searchData?.origin || 'Ahmedabad (AMD)',
      destination: `${destination.name} (${destination.code})`,
      tripType: 'round-trip',
      departureDate: new Date(),
      returnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      passengers: 1,
      cabinClass: 'Economy'
    });
  };

  return (
    <div className="SkyRoute-home">
      {/* 1. Large Travel Hero with Flight Search Card Overlapping */}
      <Hero
        onSearch={onSearch}
        initialValues={searchData}
        onNavigateHotels={() => onNavigate('/hotels')}
      />

      {/* 2. Visual Travel Categories */}
      <section className="SkyRoute-home-categories">
        <div className="SkyRoute-container">
          <div className="SkyRoute-categories-wrapper">
            <span className="SkyRoute-categories-label">Browse by Escape:</span>
            <div className="SkyRoute-categories-list">
              {TRAVEL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="SkyRoute-category-pill"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="SkyRoute-category-pill__icon">{cat.icon}</span>
                  <span className="SkyRoute-category-pill__label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Destinations Grid */}
      <section className="SkyRoute-popular-section">
        <div className="SkyRoute-container">
          <div className="SkyRoute-section-header">
            <div className="SkyRoute-section-header__left">
              <span className="SkyRoute-section-header__tag">POPULAR DESTINATIONS</span>
              <h2 className="SkyRoute-section-header__title">Explore Top Destinations</h2>
              <p className="SkyRoute-section-header__subtitle">
                Handpicked global cities and holiday escapes with the best airfare deals.
              </p>
            </div>
            <button
              type="button"
              className="SkyRoute-btn SkyRoute-btn--outline"
              onClick={() => onNavigate('/explore')}
            >
              <span>Explore All</span>
              <span>→</span>
            </button>
          </div>

          <div className="SkyRoute-dest-grid">
            {popularDestinations.map((dest) => (
              <div
                key={dest.id}
                className="SkyRoute-dest-card SkyRoute-card SkyRoute-card--interactive"
                onClick={() => {
                  if (onSelectDestination) onSelectDestination(dest);
                  onNavigate(`/destination/${dest.id}`);
                }}
              >
                <div className="SkyRoute-dest-card__image-box">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="SkyRoute-dest-card__image"
                    loading="lazy"
                  />
                  <span className="SkyRoute-dest-card__category-badge">
                    {dest.category.toUpperCase()}
                  </span>
                  <div className="SkyRoute-dest-card__overlay-price">
                    <span className="SkyRoute-dest-card__from">From</span>
                    <span className="SkyRoute-dest-card__price">₹{dest.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="SkyRoute-dest-card__body">
                  <div className="SkyRoute-dest-card__header-row">
                    <div>
                      <h3 className="SkyRoute-dest-card__title">
                        {dest.name}
                      </h3>
                      <span className="SkyRoute-dest-card__country">{dest.country}</span>
                    </div>
                    {/* Circular Arrow Button */}
                    <button
                      type="button"
                      className="SkyRoute-dest-card__circle-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickFlight(dest);
                      }}
                      title={`Search flights to ${dest.name}`}
                      aria-label={`Search flights to ${dest.name}`}
                    >
                      →
                    </button>
                  </div>

                  <p className="SkyRoute-dest-card__tagline">{dest.tagline}</p>

                  <div className="SkyRoute-dest-card__meta-pills">
                    <span className="SkyRoute-dest-meta-pill">
                      <Icon name="cloudSun" size={13} style={{ marginRight: '4px' }} />
                      {dest.weather}
                    </span>
                    <span className="SkyRoute-dest-meta-pill">
                      <Icon name="clock" size={13} style={{ marginRight: '4px' }} />
                      {dest.durationFromAMD}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Special Offers Promotional Banner */}
      <section className="SkyRoute-home-offers">
        <div className="SkyRoute-container">
          <div className="SkyRoute-offers-banner-card">
            <div className="SkyRoute-offers-banner-card__left">
              <span className="SkyRoute-badge SkyRoute-badge--rose">EXCLUSIVE PROMO</span>
              <h3 className="SkyRoute-offers-banner-card__title">
                Special Offers for Your Next Trip
              </h3>
              <p className="SkyRoute-offers-banner-card__desc">
                Get exclusive deals on domestic and international flights. Save flat ₹500 with <strong className="SkyRoute-code-highlight">SKYDOM500</strong> or ₹2,500 on international with <strong className="SkyRoute-code-highlight">FLYINTL2500</strong>.
              </p>
            </div>
            <div className="SkyRoute-offers-banner-card__right">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--accent SkyRoute-btn--lg"
                onClick={() => onNavigate('/offers')}
              >
                <span>View Offers</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Plan Your Journey Better Feature Navigation Section */}
      <section className="SkyRoute-plan-better-section">
        <div className="SkyRoute-container">
          <div className="SkyRoute-section-header">
            <div className="SkyRoute-section-header__left">
              <span className="SkyRoute-section-header__tag">TRAVEL SUITE</span>
              <h2 className="SkyRoute-section-header__title">Plan Your Journey Better</h2>
              <p className="SkyRoute-section-header__subtitle">
                Quick digital tools and services to manage every step of your travel experience.
              </p>
            </div>
          </div>

          <div className="SkyRoute-plan-better-grid">
            {PLAN_BETTER_ITEMS.map((item) => (
              <div
                key={item.id}
                className="SkyRoute-plan-card SkyRoute-card SkyRoute-card--interactive"
                onClick={() => onNavigate(item.path)}
                role="button"
                tabIndex={0}
              >
                <div className="SkyRoute-plan-card__icon-wrap">
                  <span className="SkyRoute-plan-card__icon">
                    <Icon name={item.iconName} size={24} color="#143F67" />
                  </span>
                </div>
                <div className="SkyRoute-plan-card__content">
                  <h3 className="SkyRoute-plan-card__title">{item.title}</h3>
                  <p className="SkyRoute-plan-card__desc">{item.desc}</p>
                </div>
                <span className="SkyRoute-plan-card__arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
