import React from 'react';

const FlightItinerary = ({ flight, searchData }) => {
  if (!flight) return null;

  const {
    airline,
    airlineCode,
    airlineColor,
    flightNumber,
    aircraft,
    departureTime,
    arrivalTime,
    durationText,
    stops,
    stopText,
    originCode,
    destinationCode,
    originCity,
    destinationCity,
    cabin,
  } = flight;

  return (
    <div className="SkyRoute-card SkyRoute-itinerary-card">
      {/* Airline Bar */}
      <div className="SkyRoute-itinerary-card__airline-bar">
        <div className="SkyRoute-itinerary-card__airline-info">
          <div
            className="SkyRoute-itinerary-card__logo"
            style={{ backgroundColor: airlineColor || '#4A342A' }}
          >
            {airlineCode || (airline ? airline.slice(0, 2).toUpperCase() : 'SK')}
          </div>
          <div>
            <h3 className="SkyRoute-itinerary-card__airline-name">{airline}</h3>
            <span className="SkyRoute-itinerary-card__flight-meta">
              {flightNumber} &bull; {aircraft} &bull; {cabin || 'Economy'}
            </span>
          </div>
        </div>

        <div className="SkyRoute-itinerary-card__status-tag">
          <span className="SkyRoute-tag SkyRoute-tag--green">Confirmed Schedule</span>
        </div>
      </div>

      <div className="SkyRoute-itinerary-card__divider"></div>

      {/* Itinerary Timeline */}
      <div className="SkyRoute-itinerary-card__timeline">
        {/* Departure Point */}
        <div className="SkyRoute-itinerary-card__point SkyRoute-itinerary-card__point--departure">
          <div className="SkyRoute-itinerary-card__time">{departureTime}</div>
          <div className="SkyRoute-itinerary-card__airport-box">
            <span className="SkyRoute-itinerary-card__code">{originCode || 'AMD'}</span>
            <span className="SkyRoute-itinerary-card__city">{originCity || 'Ahmedabad'}</span>
            <span className="SkyRoute-itinerary-card__terminal">Terminal 2</span>
          </div>
        </div>

        {/* Flight Path Middle */}
        <div className="SkyRoute-itinerary-card__path">
          <span className="SkyRoute-itinerary-card__duration">{durationText}</span>
          <div className="SkyRoute-itinerary-card__path-graphic">
            <span className="SkyRoute-itinerary-card__dot"></span>
            <div className="SkyRoute-itinerary-card__line"></div>
            <span className="SkyRoute-itinerary-card__plane">✈</span>
            <span className="SkyRoute-itinerary-card__dot"></span>
          </div>
          <span
            className={`SkyRoute-itinerary-card__stops-badge ${
              stops === 0
                ? 'SkyRoute-itinerary-card__stops-badge--direct'
                : 'SkyRoute-itinerary-card__stops-badge--layover'
            }`}
          >
            {stopText || (stops === 0 ? 'Non-stop' : `${stops} Stop`)}
          </span>
        </div>

        {/* Arrival Point */}
        <div className="SkyRoute-itinerary-card__point SkyRoute-itinerary-card__point--arrival">
          <div className="SkyRoute-itinerary-card__time">{arrivalTime}</div>
          <div className="SkyRoute-itinerary-card__airport-box">
            <span className="SkyRoute-itinerary-card__code">{destinationCode || 'BOM'}</span>
            <span className="SkyRoute-itinerary-card__city">{destinationCity || 'Mumbai'}</span>
            <span className="SkyRoute-itinerary-card__terminal">Terminal 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightItinerary;
