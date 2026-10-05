import React, { useState, useMemo } from 'react';
import { getCheapestMonthDays } from '../data/flights';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CheapestMonthModal = ({
  isOpen,
  onClose,
  onSelectDate,
  basePrice = 3800,
  initialDate = null,
}) => {
  const [monthOffset, setMonthOffset] = useState(0);

  // Generate list of 12 upcoming months for the direct selector
  const availableMonths = useMemo(() => {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push({
        offset: i,
        label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        shortLabel: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    }
    return months;
  }, []);

  if (!isOpen) return null;

  const { monthName, days } = getCheapestMonthDays(monthOffset, basePrice, null);

  // Calculate starting day of the week for padding cells
  const firstDayOfWeek = days.length > 0 ? days[0].date.getDay() : 0;
  const paddingCells = Array.from({ length: firstDayOfWeek });

  const isSelectedDate = (dateObj) => {
    if (!initialDate) return false;
    const d = new Date(initialDate);
    return (
      d.getFullYear() === dateObj.getFullYear() &&
      d.getMonth() === dateObj.getMonth() &&
      d.getDate() === dateObj.getDate()
    );
  };

  const handleDaySelect = (day) => {
    if (onSelectDate) onSelectDate(day.date);
    onClose();
  };

  return (
    <div className="SkyRoute-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="SkyRoute-modal SkyRoute-cheapest-month-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="SkyRoute-modal__header">
          <div>
            <span className="SkyRoute-badge SkyRoute-badge--teal">FARE CALENDAR</span>
            <h2 className="SkyRoute-modal__title">Cheapest Month Price Heatmap</h2>
          </div>
          <button
            type="button"
            className="SkyRoute-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="SkyRoute-modal__body">
          {/* Month Selector Bar with dropdown and prev/next buttons */}
          <div className="SkyRoute-month-selector-bar">
            <button
              type="button"
              className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
              onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
              disabled={monthOffset === 0}
            >
              &larr; Prev
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <select
                className="SkyRoute-text-input"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: 'var(--SkyRoute-radius-sm)',
                  backgroundColor: 'var(--SkyRoute-card-secondary, #DDE8E3)',
                  borderColor: 'var(--SkyRoute-border, #8FAFA6)',
                  color: 'var(--SkyRoute-text-main, #173F3A)',
                }}
                value={monthOffset}
                onChange={(e) => setMonthOffset(parseInt(e.target.value, 10))}
              >
                {availableMonths.map((m) => (
                  <option key={m.offset} value={m.offset}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
              onClick={() => setMonthOffset((prev) => Math.min(11, prev + 1))}
              disabled={monthOffset >= 11}
            >
              Next &rarr;
            </button>
          </div>

          {/* Fare Legend */}
          <div className="SkyRoute-month-legend">
            <span className="SkyRoute-legend-item">
              <span className="SkyRoute-legend-dot SkyRoute-legend-dot--low"></span>
              Lowest Fares (&lt;₹3,200)
            </span>
            <span className="SkyRoute-legend-item">
              <span className="SkyRoute-legend-dot SkyRoute-legend-dot--med"></span>
              Standard (₹3,200 – ₹4,500)
            </span>
            <span className="SkyRoute-legend-item">
              <span className="SkyRoute-legend-dot SkyRoute-legend-dot--high"></span>
              Peak (&gt;₹4,500)
            </span>
          </div>

          {/* 7-Column Calendar Grid */}
          <div className="SkyRoute-calendar-wrapper">
            <div className="SkyRoute-calendar-weekdays-row">
              {WEEKDAYS.map((wd) => (
                <div key={wd} className="SkyRoute-calendar-weekday-header">
                  {wd}
                </div>
              ))}
            </div>

            <div className="SkyRoute-month-calendar-grid">
              {paddingCells.map((_, idx) => (
                <div key={`pad-${idx}`} className="SkyRoute-month-day-cell SkyRoute-month-day-cell--empty" />
              ))}

              {days.map((day) => {
                const selected = isSelectedDate(day.date);
                return (
                  <div
                    key={day.dayNumber}
                    className={`SkyRoute-month-day-cell ${
                      day.isLow
                        ? 'SkyRoute-month-day-cell--low'
                        : day.isHigh
                        ? 'SkyRoute-month-day-cell--high'
                        : 'SkyRoute-month-day-cell--med'
                    } ${selected ? 'SkyRoute-month-day-cell--selected' : ''}`}
                    onClick={() => handleDaySelect(day)}
                    role="button"
                    tabIndex={0}
                    style={
                      selected
                        ? {
                            outline: '2.5px solid #173F3A',
                            boxShadow: '0 0 0 3px #F5F7F2 inset, 0 4px 12px rgba(23, 63, 58, 0.25)',
                            transform: 'scale(1.03)',
                            zIndex: 3,
                          }
                        : {}
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDaySelect(day);
                      }
                    }}
                  >
                    <span className="SkyRoute-month-day-number">{day.dayNumber}</span>
                    <span className="SkyRoute-month-day-price">₹{day.price.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="SkyRoute-modal__footer">
          <p className="SkyRoute-calendar-note">
            💡 Select any date cell above to view flights and update your search query.
          </p>
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheapestMonthModal;
