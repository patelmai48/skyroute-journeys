import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import setMonth from 'date-fns/setMonth';
import setYear from 'date-fns/setYear';

const formatDisplay = (date) => (date ? format(date, 'EEE, d MMM yyyy') : '');
const formatDayOfWeek = (date) => (date ? format(date, 'EEEE') : '');

const WEEKDAYS = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DatePickerField = ({
  id,
  label,
  selectedDate,
  onChange,
  onDateChange,
  minDate = new Date(),
  placeholder = 'Select date',
  icon = '📅',
  error,
  alignRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate || minDate || new Date());
  const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleDateChange = onChange || onDateChange || (() => {});
  const shouldAlignRight = alignRight !== undefined ? alignRight : (id === 'return-date' || label === 'Return');

  // Sync viewDate when modal opens or selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setViewDate(new Date(selectedDate));
    }
  }, [selectedDate, isOpen]);

  // Dynamic coordinates positioning for floating portal
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 640;
      const calendarWidth = Math.min(350, window.innerWidth * 0.94);

      const top = rect.bottom + window.scrollY + 6;
      let left;

      if (isMobile) {
        left = (window.innerWidth - calendarWidth) / 2 + window.scrollX;
      } else if (shouldAlignRight) {
        left = rect.right - 350 + window.scrollX;
        if (left < 10) left = 10;
      } else {
        left = rect.left + window.scrollX;
        if (left + 350 > window.innerWidth - 10) {
          left = window.innerWidth - 350 - 10 + window.scrollX;
        }
        if (left < 10) left = 10;
      }

      setPopoverCoords({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, shouldAlignRight]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    handleDateChange(date);
    setIsOpen(false);
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate((d) => subMonths(d, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate((d) => addMonths(d, 1));
  };

  const handleMonthSelect = (mIndex) => {
    setViewDate((d) => setMonth(d, mIndex));
  };

  const handleYearSelect = (yearVal) => {
    setViewDate((d) => setYear(d, yearVal));
  };

  // Generate calendar days for current viewDate
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDay.getDate();

    // Monday is index 0, Sunday is index 6
    const startDayIndex = (firstDay.getDay() + 6) % 7;

    const days = [];

    // Preceding month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isDisabled: true,
      });
    }

    // Current month days
    const today = startOfDay(new Date());
    const minDay = minDate ? startOfDay(new Date(minDate)) : null;

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      const isPast = minDay ? isBefore(d, minDay) : false;
      const isSelected = selectedDate ? isSameDay(d, new Date(selectedDate)) : false;
      const isToday = isSameDay(d, today);

      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        isDisabled: isPast,
        isSelected,
        isToday,
      });
    }

    // Trailing padding days to fill 7 columns evenly (35 or 42 cells)
    const remainingCells = 7 - (days.length % 7);
    if (remainingCells < 7) {
      for (let i = 1; i <= remainingCells; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
          date: d,
          dayNumber: i,
          isCurrentMonth: false,
          isDisabled: true,
        });
      }
    }

    return days;
  }, [viewDate, minDate, selectedDate]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1, currentYear + 2];
  }, []);

  return (
    <div
      className={`SkyRoute-search-field-box SkyRoute-search-field-box--btn ${
        isOpen ? 'SkyRoute-search-field-box--open' : ''
      } ${error ? 'SkyRoute-search-field-box--error' : ''}`}
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      id={id}
    >
      <div className="SkyRoute-search-field-header">
        <span className="SkyRoute-search-field-icon">{icon}</span>
        <span className="SkyRoute-search-field-tag">{label}</span>
      </div>

      <div className="SkyRoute-search-field-body">
        <span
          className={
            selectedDate
              ? 'SkyRoute-search-field-val'
              : 'SkyRoute-search-field-val SkyRoute-search-field-val--placeholder'
          }
        >
          {selectedDate ? formatDisplay(selectedDate) : placeholder}
        </span>
        <span className="SkyRoute-search-field-calendar-icon">📅</span>
      </div>

      {selectedDate && (
        <span className="SkyRoute-search-field-subtext">{formatDayOfWeek(selectedDate)}</span>
      )}

      {error && <span className="SkyRoute-field-error-text">{error}</span>}

      {/* Floating Portaled Calendar Dropdown */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className={`SkyRoute-search-popover-menu SkyRoute-search-popover-menu--calendar ${
              shouldAlignRight
                ? 'SkyRoute-search-popover-menu--align-right'
                : 'SkyRoute-search-popover-menu--align-left'
            }`}
            style={{
              position: 'absolute',
              top: `${popoverCoords.top}px`,
              left: `${popoverCoords.left}px`,
              zIndex: 999999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="SkyRoute-popover-header">
              <span>Select {label} Date</span>
              <button
                type="button"
                className="SkyRoute-popover-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                aria-label="Close calendar"
              >
                &times;
              </button>
            </div>

            {/* Calendar Widget */}
            <div className="SkyRoute-clean-calendar">
              {/* Month Navigation & Selector Bar */}
              <div className="SkyRoute-clean-calendar__nav">
                <button
                  type="button"
                  className="SkyRoute-clean-calendar__nav-btn"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                  aria-label="Previous Month"
                >
                  ‹
                </button>

                <div className="SkyRoute-clean-calendar__dropdowns">
                  <select
                    value={viewDate.getMonth()}
                    onChange={(e) => handleMonthSelect(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="SkyRoute-clean-calendar__select"
                    aria-label="Select month"
                  >
                    {MONTH_NAMES.map((mName, idx) => (
                      <option key={mName} value={idx}>
                        {mName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={viewDate.getFullYear()}
                    onChange={(e) => handleYearSelect(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="SkyRoute-clean-calendar__select"
                    aria-label="Select year"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="SkyRoute-clean-calendar__nav-btn"
                  onClick={handleNextMonth}
                  title="Next Month"
                  aria-label="Next Month"
                >
                  ›
                </button>
              </div>

              {/* Day Headers (Mon - Sun) */}
              <div className="SkyRoute-clean-calendar__weekdays">
                {WEEKDAYS.map((w) => (
                  <div key={w.key} className="SkyRoute-clean-calendar__weekday">
                    {w.label}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="SkyRoute-clean-calendar__grid">
                {calendarDays.map((cell, index) => {
                  let cellClass = 'SkyRoute-clean-calendar__day';
                  if (!cell.isCurrentMonth) cellClass += ' SkyRoute-clean-calendar__day--outside';
                  if (cell.isDisabled) cellClass += ' SkyRoute-clean-calendar__day--disabled';
                  if (cell.isSelected) cellClass += ' SkyRoute-clean-calendar__day--selected';
                  if (cell.isToday && !cell.isSelected) cellClass += ' SkyRoute-clean-calendar__day--today';

                  return (
                    <button
                      key={`${cell.dayNumber}-${index}`}
                      type="button"
                      disabled={cell.isDisabled}
                      className={cellClass}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!cell.isDisabled) handleDateSelect(cell.date);
                      }}
                      title={format(cell.date, 'EEEE, MMMM d, yyyy')}
                    >
                      <span>{cell.dayNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="SkyRoute-popover-footer">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--secondary SkyRoute-btn--sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateSelect(new Date());
                }}
                style={{ marginRight: 'auto' }}
              >
                Today
              </button>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                Confirm Date
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DatePickerField;
