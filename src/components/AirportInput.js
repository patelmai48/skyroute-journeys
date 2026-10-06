import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

const POPULAR_AIRPORTS = [
  { city: 'Ahmedabad', code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', country: 'India' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India' },
  { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International', country: 'India' },
  { city: 'Goa', code: 'GOI', name: 'Dabolim / Manohar Intl', country: 'India' },
  { city: 'Bengaluru', code: 'BLR', name: 'Kempegowda International', country: 'India' },
  { city: 'Dubai', code: 'DXB', name: 'Dubai International Airport', country: 'United Arab Emirates' },
  { city: 'Singapore', code: 'SIN', name: 'Changi International Airport', country: 'Singapore' },
  { city: 'London', code: 'LHR', name: 'Heathrow Airport', country: 'United Kingdom' },
  { city: 'Paris', code: 'CDG', name: 'Charles de Gaulle Airport', country: 'France' },
  { city: 'Bangkok', code: 'BKK', name: 'Suvarnabhumi Airport', country: 'Thailand' },
  { city: 'Tokyo', code: 'HND', name: 'Haneda International Airport', country: 'Japan' },
  { city: 'New York', code: 'JFK', name: 'John F. Kennedy Intl Airport', country: 'United States' }
];

const AirportInput = ({ id, label, placeholder, value, onChange, icon, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.replace(/[()]/g, ' ').toLowerCase().trim();
  const qTerms = cleanQuery.split(/\s+/).filter(Boolean);
  const filteredAirports = POPULAR_AIRPORTS.filter((item) => {
    if (qTerms.length === 0) return true;
    return qTerms.some((term) =>
      item.city.toLowerCase().includes(term) ||
      item.code.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.country.toLowerCase().includes(term)
    );
  });

  const matchedAirport = POPULAR_AIRPORTS.find(
    (item) => query.includes(item.code) || query.toLowerCase().includes(item.city.toLowerCase())
  );

  const handleSelect = (airport) => {
    const formatted = `${airport.city} (${airport.code})`;
    setQuery(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
  };

  const iconName = icon === 'landing' || icon === '🛬' || label === 'To' ? 'landing' : 'takeoff';

  return (
    <div
      className={`SkyRoute-search-field-box ${isOpen ? 'SkyRoute-search-field-box--open' : ''} ${error ? 'SkyRoute-search-field-box--error' : ''}`}
      ref={containerRef}
      onClick={() => {
        const inputEl = document.getElementById(id);
        if (inputEl) inputEl.focus();
      }}
    >
      <div className="SkyRoute-search-field-header">
        <span className="SkyRoute-search-field-icon">
          <Icon name={iconName} size={15} color="#1E5282" />
        </span>
        <span className="SkyRoute-search-field-tag">{label}</span>
      </div>

      <div className="SkyRoute-search-field-body">
        <input
          id={id}
          type="text"
          className="SkyRoute-search-field-input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="SkyRoute-search-field-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              onChange('');
            }}
            aria-label="Clear input"
            title="Clear"
          >
            <Icon name="close" size={13} />
          </button>
        )}
      </div>

      {matchedAirport && (
        <span className="SkyRoute-search-field-subtext">{matchedAirport.name}</span>
      )}

      {error && <span className="SkyRoute-field-error-text">{error}</span>}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="SkyRoute-search-popover-menu" role="listbox">
          <div className="SkyRoute-popover-header">Popular Airports</div>
          <div className="SkyRoute-popover-list">
            {filteredAirports.length === 0 ? (
              <div className="SkyRoute-popover-empty">
                No matching airports found. You can type any city code.
              </div>
            ) : (
              filteredAirports.map((airport) => (
                <div
                  key={airport.code}
                  className="SkyRoute-popover-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(airport);
                  }}
                  role="option"
                  tabIndex={0}
                >
                  <div className="SkyRoute-popover-item-left">
                    <strong className="SkyRoute-popover-city">{airport.city}</strong>
                    <span className="SkyRoute-popover-sub">{airport.name}</span>
                  </div>
                  <div className="SkyRoute-popover-item-right">
                    <span className="SkyRoute-popover-code-badge">{airport.code}</span>
                    <span className="SkyRoute-popover-country">{airport.country}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportInput;
