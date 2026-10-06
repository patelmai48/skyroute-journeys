import React, { useState } from 'react';
import AirportInput from './AirportInput';
import DatePickerField from './DatePickerField';
import PassengerSelector from './PassengerSelector';
import Icon from './Icon';

const SERVICE_TABS = [
  { id: 'flights', label: 'Flights', iconName: 'flight' },
  { id: 'hotels', label: 'Hotels', iconName: 'hotel' },
  { id: 'flight-hotel', label: 'Flight + Hotel', iconName: 'package' },
];

const TRIP_TYPES = {
  ONE_WAY: 'one-way',
  ROUND_TRIP: 'round-trip',
  MULTI_CITY: 'multi-city',
};

const FlightSearchForm = ({ onSearch, initialValues, onNavigateHotels }) => {
  const [activeServiceTab, setActiveServiceTab] = useState('flights');
  const [tripType, setTripType] = useState(
    initialValues?.tripType || TRIP_TYPES.ROUND_TRIP
  );
  const [origin, setOrigin] = useState(initialValues?.origin || 'Ahmedabad (AMD)');
  const [destination, setDestination] = useState(
    initialValues?.destination || 'Dubai (DXB)'
  );
  const [departureDate, setDepartureDate] = useState(
    initialValues?.departureDate || new Date()
  );
  const [returnDate, setReturnDate] = useState(
    initialValues?.returnDate ||
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [passengers, setPassengers] = useState(
    initialValues?.passengers || 1
  );
  const [cabinClass, setCabinClass] = useState(
    initialValues?.cabinClass || 'Economy'
  );

  // Multi-City Legs
  const [multiCityLegs, setMultiCityLegs] = useState([
    { id: 'leg-1', origin: 'Ahmedabad (AMD)', destination: 'Dubai (DXB)', date: new Date() },
    { id: 'leg-2', origin: 'Dubai (DXB)', destination: 'London (LHR)', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) }
  ]);

  const [errors, setErrors] = useState({});

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setErrors((prev) => ({ ...prev, origin: null, destination: null }));
  };

  const handleAddLeg = () => {
    if (multiCityLegs.length < 4) {
      const lastLeg = multiCityLegs[multiCityLegs.length - 1];
      const nextDate = new Date(lastLeg.date || Date.now());
      nextDate.setDate(nextDate.getDate() + 3);
      setMultiCityLegs([
        ...multiCityLegs,
        {
          id: `leg-${Date.now()}`,
          origin: lastLeg.destination || 'Dubai (DXB)',
          destination: 'Paris (CDG)',
          date: nextDate
        }
      ]);
    }
  };

  const handleRemoveLeg = (idx) => {
    if (multiCityLegs.length > 2) {
      setMultiCityLegs(multiCityLegs.filter((_, i) => i !== idx));
    }
  };

  const handleLegChange = (idx, field, value) => {
    const updated = [...multiCityLegs];
    updated[idx][field] = value;
    setMultiCityLegs(updated);
  };

  const validate = () => {
    const errs = {};

    if (tripType === TRIP_TYPES.MULTI_CITY) {
      multiCityLegs.forEach((leg, i) => {
        if (!leg.origin) errs[`leg_${i}_origin`] = 'Enter origin';
        if (!leg.destination) errs[`leg_${i}_dest`] = 'Enter destination';
        if (!leg.date) errs[`leg_${i}_date`] = 'Select date';
      });
    } else {
      if (!origin || !origin.trim()) {
        errs.origin = 'Please enter a departure city.';
      }
      if (!destination || !destination.trim()) {
        errs.destination = 'Please enter a destination city.';
      }
      if (
        origin &&
        destination &&
        origin.trim().toLowerCase() === destination.trim().toLowerCase()
      ) {
        errs.destination = 'Origin and destination cannot be identical.';
      }
      if (!departureDate) {
        errs.departureDate = 'Please select a departure date.';
      }
      if (tripType === TRIP_TYPES.ROUND_TRIP) {
        if (!returnDate) {
          errs.returnDate = 'Please select a return date.';
        } else if (departureDate && returnDate < departureDate) {
          errs.returnDate = 'Return date cannot be earlier than departure date.';
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeServiceTab === 'hotels' && onNavigateHotels) {
      onNavigateHotels();
      return;
    }
    if (validate()) {
      if (tripType === TRIP_TYPES.MULTI_CITY) {
        onSearch({
          tripType,
          origin: multiCityLegs[0].origin,
          destination: multiCityLegs[0].destination,
          departureDate: multiCityLegs[0].date,
          returnDate: null,
          passengers,
          cabinClass,
          multiCityLegs
        });
      } else {
        onSearch({
          tripType,
          origin,
          destination,
          departureDate,
          returnDate: tripType === TRIP_TYPES.ROUND_TRIP ? returnDate : null,
          passengers,
          cabinClass,
        });
      }
    }
  };

  return (
    <form className="SkyRoute-search-card SkyRoute-card" onSubmit={handleSubmit} noValidate>
      {/* 1. Top Service Category Tabs (Flights, Hotels, Flight + Hotel) */}
      <div className="SkyRoute-search-card__top-tabs">
        {SERVICE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`SkyRoute-service-tab ${
              activeServiceTab === tab.id ? 'SkyRoute-service-tab--active' : ''
            }`}
            onClick={() => setActiveServiceTab(tab.id)}
          >
            <span className="SkyRoute-service-tab__icon">
              <Icon name={tab.iconName} size={17} />
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Trip Type Selector Radio Row */}
      <div className="SkyRoute-search-card__trip-type-row">
        <label className={`SkyRoute-trip-radio ${tripType === TRIP_TYPES.ONE_WAY ? 'SkyRoute-trip-radio--active' : ''}`}>
          <input
            type="radio"
            name="tripType"
            checked={tripType === TRIP_TYPES.ONE_WAY}
            onChange={() => setTripType(TRIP_TYPES.ONE_WAY)}
          />
          <span className="SkyRoute-trip-radio__custom"></span>
          <span>One Way</span>
        </label>

        <label className={`SkyRoute-trip-radio ${tripType === TRIP_TYPES.ROUND_TRIP ? 'SkyRoute-trip-radio--active' : ''}`}>
          <input
            type="radio"
            name="tripType"
            checked={tripType === TRIP_TYPES.ROUND_TRIP}
            onChange={() => setTripType(TRIP_TYPES.ROUND_TRIP)}
          />
          <span className="SkyRoute-trip-radio__custom"></span>
          <span>Round Trip</span>
        </label>

        <label className={`SkyRoute-trip-radio ${tripType === TRIP_TYPES.MULTI_CITY ? 'SkyRoute-trip-radio--active' : ''}`}>
          <input
            type="radio"
            name="tripType"
            checked={tripType === TRIP_TYPES.MULTI_CITY}
            onChange={() => setTripType(TRIP_TYPES.MULTI_CITY)}
          />
          <span className="SkyRoute-trip-radio__custom"></span>
          <span>Multi City</span>
        </label>
      </div>

      {/* Validation Banner if errors present */}
      {Object.keys(errors).length > 0 && (
        <div className="SkyRoute-alert-banner" role="alert">
          <span className="SkyRoute-alert-banner__icon">
            <Icon name="alertTriangle" size={18} color="#993D3D" />
          </span>
          <div className="SkyRoute-alert-banner__content">
            {Object.values(errors)[0]}
          </div>
        </div>
      )}

      {/* 3. Search Fields Grid */}
      {tripType !== TRIP_TYPES.MULTI_CITY ? (
        <div
          className={`SkyRoute-search-grid ${
            tripType === TRIP_TYPES.ONE_WAY
              ? 'SkyRoute-search-grid--one-way'
              : 'SkyRoute-search-grid--round-trip'
          }`}
        >
          {/* Origin Airport */}
          <div className="SkyRoute-search-grid__col SkyRoute-search-grid__col--origin">
            <AirportInput
              id="origin-airport"
              label="From"
              placeholder="City or Airport (e.g. Ahmedabad)"
              value={origin}
              onChange={(val) => {
                setOrigin(val);
                if (errors.origin) setErrors((e) => ({ ...e, origin: null }));
              }}
              icon="takeoff"
              error={errors.origin}
            />
          </div>

          {/* Swap Button */}
          <div className="SkyRoute-search-grid__swap">
            <button
              type="button"
              className="SkyRoute-swap-btn"
              onClick={handleSwap}
              title="Swap Departure and Arrival Airports"
              aria-label="Swap airports"
            >
              <Icon name="swap" size={17} />
            </button>
          </div>

          {/* Destination Airport */}
          <div className="SkyRoute-search-grid__col SkyRoute-search-grid__col--destination">
            <AirportInput
              id="destination-airport"
              label="To"
              placeholder="City or Airport (e.g. Dubai)"
              value={destination}
              onChange={(val) => {
                setDestination(val);
                if (errors.destination) setErrors((e) => ({ ...e, destination: null }));
              }}
              icon="landing"
              error={errors.destination}
            />
          </div>

          {/* Departure Date */}
          <div className="SkyRoute-search-grid__col SkyRoute-search-grid__col--date">
            <DatePickerField
              id="departure-date"
              label="Departure"
              selectedDate={departureDate}
              onChange={(d) => {
                setDepartureDate(d);
                if (errors.departureDate) setErrors((e) => ({ ...e, departureDate: null }));
              }}
              minDate={new Date()}
              icon="calendar"
              error={errors.departureDate}
            />
          </div>

          {/* Return Date (if round-trip) */}
          {tripType === TRIP_TYPES.ROUND_TRIP && (
            <div className="SkyRoute-search-grid__col SkyRoute-search-grid__col--date">
              <DatePickerField
                id="return-date"
                label="Return"
                selectedDate={returnDate}
                onChange={(d) => {
                  setReturnDate(d);
                  if (errors.returnDate) setErrors((e) => ({ ...e, returnDate: null }));
                }}
                minDate={departureDate || new Date()}
                icon="calendar"
                error={errors.returnDate}
              />
            </div>
          )}

          {/* Travellers & Cabin Class */}
          <div className="SkyRoute-search-grid__col SkyRoute-search-grid__col--passengers">
            <PassengerSelector
              passengers={passengers}
              cabinClass={cabinClass}
              onPassengersChange={setPassengers}
              onCabinClassChange={setCabinClass}
            />
          </div>
        </div>
      ) : (
        /* Multi-City Legs Builder */
        <div className="SkyRoute-multi-city-container">
          {multiCityLegs.map((leg, index) => (
            <div key={leg.id} className="SkyRoute-multi-city-row">
              <span className="SkyRoute-multi-city-row__label">Flight {index + 1}</span>
              <div className="SkyRoute-multi-city-row__fields">
                <AirportInput
                  id={`mc-origin-${index}`}
                  label="From"
                  placeholder="Origin"
                  value={leg.origin}
                  onChange={(val) => handleLegChange(index, 'origin', val)}
                  icon="takeoff"
                />
                <AirportInput
                  id={`mc-dest-${index}`}
                  label="To"
                  placeholder="Destination"
                  value={leg.destination}
                  onChange={(val) => handleLegChange(index, 'destination', val)}
                  icon="landing"
                />
                <DatePickerField
                  id={`mc-date-${index}`}
                  label="Date"
                  selectedDate={leg.date}
                  onChange={(d) => handleLegChange(index, 'date', d)}
                  minDate={new Date()}
                  icon="calendar"
                />
                {multiCityLegs.length > 2 && (
                  <button
                    type="button"
                    className="SkyRoute-multi-city-row__remove"
                    onClick={() => handleRemoveLeg(index)}
                    title="Remove flight leg"
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="SkyRoute-multi-city-actions">
            {multiCityLegs.length < 4 && (
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--secondary SkyRoute-btn--sm"
                onClick={handleAddLeg}
              >
                + Add Another City
              </button>
            )}
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <PassengerSelector
                passengers={passengers}
                cabinClass={cabinClass}
                onPassengersChange={setPassengers}
                onCabinClassChange={setCabinClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Action Submit Button */}
      <div className="SkyRoute-search-card__actions">
        <button
          type="submit"
          className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg SkyRoute-search-card__submit-btn"
        >
          <span>Search Flights</span>
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
