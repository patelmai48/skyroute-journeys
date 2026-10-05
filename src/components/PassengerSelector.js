import React, { useState, useRef, useEffect } from 'react';

const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class'];

const PassengerSelector = ({
  passengers = 1,
  setPassengers,
  onPassengersChange,
  cabinClass = 'Economy',
  setCabinClass,
  onCabinClassChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const updatePassengers = onPassengersChange || setPassengers || (() => {});
  const updateCabinClass = onCabinClassChange || setCabinClass || (() => {});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (passengers < 9) {
      updatePassengers(passengers + 1);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (passengers > 1) {
      updatePassengers(passengers - 1);
    }
  };

  const handleSelectCabin = (cls, e) => {
    e.stopPropagation();
    updateCabinClass(cls);
  };

  return (
    <div
      className={`SkyRoute-search-field-box SkyRoute-search-field-box--btn ${
        isOpen ? 'SkyRoute-search-field-box--open' : ''
      }`}
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
    >
      <div className="SkyRoute-search-field-header">
        <span className="SkyRoute-search-field-icon">👥</span>
        <span className="SkyRoute-search-field-tag">Travellers &amp; Cabin</span>
      </div>

      <div className="SkyRoute-search-field-body">
        <span className="SkyRoute-search-field-val">
          {passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}, {cabinClass}
        </span>
        <span className={`SkyRoute-search-field-arrow ${isOpen ? 'SkyRoute-search-field-arrow--open' : ''}`}>
          ▼
        </span>
      </div>

      <span className="SkyRoute-search-field-subtext">{cabinClass} Class</span>

      {/* Popover */}
      {isOpen && (
        <div
          className="SkyRoute-search-popover-menu SkyRoute-search-popover-menu--passengers"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="SkyRoute-popover-header">
            <span>Travellers &amp; Cabin Class</span>
            <button
              type="button"
              className="SkyRoute-popover-close-btn"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="SkyRoute-passengers-popover-body">
            {/* Passenger Count Section */}
            <div className="SkyRoute-popover-row">
              <div>
                <strong className="SkyRoute-popover-row-title">Adults &amp; Children</strong>
                <span className="SkyRoute-popover-row-sub">Age 2+ years (Max 9)</span>
              </div>
              <div className="SkyRoute-counter-stepper">
                <button
                  type="button"
                  className="SkyRoute-counter-btn"
                  onClick={handleDecrement}
                  disabled={passengers <= 1}
                  aria-label="Decrease passenger count"
                >
                  &minus;
                </button>
                <span className="SkyRoute-counter-value">{passengers}</span>
                <button
                  type="button"
                  className="SkyRoute-counter-btn"
                  onClick={handleIncrement}
                  disabled={passengers >= 9}
                  aria-label="Increase passenger count"
                >
                  +
                </button>
              </div>
            </div>

            <div className="SkyRoute-popover-divider"></div>

            {/* Cabin Class Selection */}
            <div>
              <strong className="SkyRoute-popover-row-title" style={{ display: 'block', marginBottom: '8px' }}>
                Cabin Class
              </strong>
              <div className="SkyRoute-cabin-pills-grid">
                {CABIN_CLASSES.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    className={`SkyRoute-cabin-pill ${cabinClass === cls ? 'SkyRoute-cabin-pill--active' : ''}`}
                    onClick={(e) => handleSelectCabin(cls, e)}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="SkyRoute-popover-footer">
            <button
              type="button"
              className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;
