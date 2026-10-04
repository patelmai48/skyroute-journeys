import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import BpkCalendar, {
  CALENDAR_SELECTION_TYPE,
} from '@skyscanner/backpack-web/bpk-component-calendar';
import format from 'date-fns/format';

const formatDateFull = (date) => (date ? format(date, 'EEEE, do MMMM yyyy') : '');
const formatMonth = (date) => (date ? format(date, 'MMMM yyyy') : '');
const formatDisplay = (date) => (date ? format(date, 'EEE, d MMM yyyy') : '');
const formatDayOfWeek = (date) => (date ? format(date, 'EEEE') : '');

const DAYS_OF_WEEK = [
  { name: 'Sunday', nameAbbr: 'Sun', index: 0, isWeekend: true },
  { name: 'Monday', nameAbbr: 'Mon', index: 1, isWeekend: false },
  { name: 'Tuesday', nameAbbr: 'Tue', index: 2, isWeekend: false },
  { name: 'Wednesday', nameAbbr: 'Wed', index: 3, isWeekend: false },
  { name: 'Thursday', nameAbbr: 'Thu', index: 4, isWeekend: false },
  { name: 'Friday', nameAbbr: 'Fri', index: 5, isWeekend: false },
  { name: 'Saturday', nameAbbr: 'Sat', index: 6, isWeekend: true },
];

const DatePickerField = ({
  id,
  label,
  selectedDate,
  onChange,
  onDateChange,
  minDate,
  placeholder = 'Select date',
  icon = '📅',
  error,
  alignRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 400 });
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleDateChange = onChange || onDateChange || (() => {});
  const shouldAlignRight = alignRight !== undefined ? alignRight : (id === 'return-date' || label === 'Return');

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const calendarWidth = Math.min(410, window.innerWidth - 24);

    const top = rect.bottom + 8;
    let left = shouldAlignRight ? rect.right - calendarWidth : rect.left;

    // Clamp within viewport
    if (left + calendarWidth > window.innerWidth - 12) {
      left = window.innerWidth - calendarWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    setCoords({ top, left, width: calendarWidth });
  }, [shouldAlignRight]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleReposition = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const handleDateSelect = (date) => {
    handleDateChange(date);
    setIsOpen(false);
  };

  return (
    <>
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
      </div>

      {/* Portal-rendered Calendar Popover attached directly to document.body */}
      {isOpen &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={popoverRef}
            className={`SkyRoute-search-popover-menu SkyRoute-search-popover-menu--calendar SkyRoute-search-popover-menu--portal ${
              shouldAlignRight
                ? 'SkyRoute-search-popover-menu--align-right'
                : 'SkyRoute-search-popover-menu--align-left'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 999999,
              backgroundColor: '#F5F1EA',
              border: '2px solid #7D5A44',
              borderRadius: '16px',
              boxShadow: '0 24px 64px rgba(74, 52, 42, 0.38)',
              overflow: 'visible',
            }}
          >
            <div className="SkyRoute-popover-header">
              <span>Select {label} Date</span>
              <button
                type="button"
                className="SkyRoute-popover-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close calendar"
              >
                &times;
              </button>
            </div>

            <div
              className="SkyRoute-calendar-container"
              style={{
                overflow: 'visible',
                padding: '1rem 1.15rem 1.15rem',
                backgroundColor: '#F5F1EA',
                minHeight: '340px',
              }}
            >
              <BpkCalendar
                id={`calendar-${id}`}
                onDateSelect={handleDateSelect}
                formatMonth={formatMonth}
                formatDateFull={formatDateFull}
                daysOfWeek={DAYS_OF_WEEK}
                weekStartsOn={1}
                changeMonthLabel="Change month"
                nextMonthLabel="Next month"
                previousMonthLabel="Previous month"
                minDate={minDate}
                selectionConfiguration={{
                  type: CALENDAR_SELECTION_TYPE.single,
                  date: selectedDate,
                }}
              />
            </div>

            <div className="SkyRoute-popover-footer">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                onClick={() => setIsOpen(false)}
              >
                Confirm Date
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default DatePickerField;



