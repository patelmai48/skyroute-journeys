import React from 'react';
import FlightSearchForm from './FlightSearchForm';

const Hero = ({ onSearch, initialValues, onNavigateHotels }) => {
  return (
    <section className="SkyRoute-hero">
      <div className="SkyRoute-hero__container">
        <div className="SkyRoute-hero__tag">
          <span className="SkyRoute-hero__tag-dot"></span>
          <span className="SkyRoute-hero__tag-text">TRAVEL · EXPLORE · DISCOVER</span>
        </div>

        <h1 className="SkyRoute-hero__title">
          Your Next<br />Journey Starts Here
        </h1>
        <p className="SkyRoute-hero__subtitle">
          Search, compare and book flights with SkyRoute.
        </p>

        {/* Flight Search Widget Card */}
        <div className="SkyRoute-hero__search-container">
          <FlightSearchForm
            onSearch={onSearch}
            initialValues={initialValues}
            onNavigateHotels={onNavigateHotels}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
