import React from 'react';
import format from 'date-fns/format';
import Icon from '../components/Icon';
import FlightItinerary from '../components/FlightItinerary';
import FlightInformation from '../components/FlightInformation';
import BaggageInfo from '../components/BaggageInfo';
import FareSummary from '../components/FareSummary';

const formatDisplayDate = (date) => {
  if (!date) return 'Today';
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : format(d, 'EEE, d MMM yyyy');
  } catch (e) {
    return '';
  }
};

const FlightDetails = ({ selectedFlight, searchData, onBackToResults, onContinue }) => {
  if (!selectedFlight) {
    return (
      <div className="SkyRoute-details-page">
        <div className="SkyRoute-container">
          <div className="SkyRoute-empty-state SkyRoute-card SkyRoute-details-page__empty-card">
            <div className="SkyRoute-empty-state__icon">
              <Icon name="flight" size={36} color="var(--primary)" />
            </div>
            <h2 className="SkyRoute-empty-state__title">No flight selected</h2>
            <p className="SkyRoute-empty-state__subtitle">
              You haven't selected a flight yet. Please view available flights and choose your preferred schedule.
            </p>
            <button
              type="button"
              className="SkyRoute-btn SkyRoute-btn--primary"
              onClick={onBackToResults}
            >
              &larr; Back to Available Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    originCity,
    originCode,
    destinationCity,
    destinationCode,
  } = selectedFlight;

  const departureDate = searchData?.departureDate || new Date();
  const tripType = searchData?.tripType === 'one-way' ? 'One Way' : 'Round Trip';
  const passengers = searchData?.passengers || 1;

  return (
    <div className="SkyRoute-details-page">
      {/* Header Summary Sub-Bar */}
      <div className="SkyRoute-details-page__header-bar">
        <div className="SkyRoute-container SkyRoute-details-page__header-container">
          <div>
            <div className="SkyRoute-details-page__breadcrumb">
              <span>Flights</span> &rsaquo; <strong>Flight Details</strong>
            </div>
            <h1 className="SkyRoute-details-page__title">
              {originCity || 'Ahmedabad'} ({originCode || 'AMD'}) &rarr; {destinationCity || 'Mumbai'} ({destinationCode || 'BOM'})
            </h1>
            <div className="SkyRoute-details-page__meta">
              <span className="SkyRoute-summary-pill SkyRoute-summary-pill--accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="calendar" size={13} /> {formatDisplayDate(departureDate)}
              </span>
              <span className="SkyRoute-summary-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="users" size={13} /> {passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}
              </span>
              <span className="SkyRoute-summary-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="flight" size={13} /> {tripType}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm SkyRoute-details-page__back-btn"
            onClick={onBackToResults}
          >
            &larr; Back to Results
          </button>
        </div>
      </div>

      {/* Main 2-Column Details Layout */}
      <div className="SkyRoute-container SkyRoute-details-page__main-container">
        <div className="SkyRoute-details-layout">
          {/* Left Column: Itinerary, Info, Baggage */}
          <div className="SkyRoute-details-layout__left">
            <FlightItinerary flight={selectedFlight} searchData={searchData} />
            <FlightInformation flight={selectedFlight} />
            <BaggageInfo />
          </div>

          {/* Right Column: Sticky Fare Breakdown & CTA */}
          <div className="SkyRoute-details-layout__right">
            <div className="SkyRoute-details-layout__sticky-sidebar">
              <FareSummary
                flight={selectedFlight}
                searchData={searchData}
                onContinue={onContinue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
