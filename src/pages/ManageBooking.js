import React, { useState } from 'react';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const ManageBooking = ({ onNavigate, onSelectBooking }) => {
  const [pnrInput, setPnrInput] = useState('X7K29P');
  const [lastNameInput, setLastNameInput] = useState('Patel');
  const [activeBooking, setActiveBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [newTravelDate, setNewTravelDate] = useState('2026-10-18');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const handleTrackBooking = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const pnrClean = pnrInput.trim().toUpperCase();

    // Check localStorage bookings
    try {
      const saved = JSON.parse(localStorage.getItem('skyroute_bookings') || '[]');
      const found = saved.find((b) => b.pnr?.toUpperCase() === pnrClean);
      if (found) {
        setActiveBooking(found);
        return;
      }
    } catch (err) {
      console.warn('Error fetching bookings:', err);
    }

    // Default sample if PNR matches demo or any query
    if (pnrClean === 'X7K29P' || pnrClean.length >= 4) {
      setActiveBooking({
        bookingId: 'BK-948210',
        pnr: pnrClean,
        bookingDate: '2026-10-01',
        flight: {
          airline: 'IndiGo',
          airlineCode: '6E',
          airlineColor: '#4A342A',
          flightNumber: '6E-214',
          originCity: 'Ahmedabad',
          originCode: 'AMD',
          destinationCity: 'Mumbai',
          destinationCode: 'BOM',
          departureTime: '06:15 AM',
          arrivalTime: '07:40 AM',
          durationText: '1h 25m',
          cabin: 'Economy',
          baggage: '7kg Cabin + 15kg Check-in'
        },
        passengers: [
          { firstName: 'Mahi', lastName: lastNameInput || 'Patel', gender: 'female', govtIdType: 'Aadhaar' }
        ],
        seat: { id: '14A', type: 'Window' },
        gate: 'B12',
        terminal: 'T1',
        total: 4269,
        status: 'Confirmed'
      });
    } else {
      setErrorMessage('No booking found for this PNR. Please check and try again.');
    }
  };

  const handleConfirmCancel = () => {
    if (activeBooking) {
      const updated = { ...activeBooking, status: 'Cancelled (Refund Processing)' };
      setActiveBooking(updated);
      setCancelSuccess(true);
      setShowCancelModal(false);

      try {
        const saved = JSON.parse(localStorage.getItem('skyroute_bookings') || '[]');
        const exists = saved.some(
          (b) =>
            (b.pnr && b.pnr.toUpperCase() === activeBooking.pnr?.toUpperCase()) ||
            (b.bookingId && b.bookingId === activeBooking.bookingId)
        );

        let updatedList;
        if (exists) {
          updatedList = saved.map((b) =>
            (b.pnr && b.pnr.toUpperCase() === activeBooking.pnr?.toUpperCase()) ||
            (b.bookingId && b.bookingId === activeBooking.bookingId)
              ? { ...b, status: 'Cancelled (Refund Processing)' }
              : b
          );
        } else {
          updatedList = [updated, ...saved];
        }

        localStorage.setItem('skyroute_bookings', JSON.stringify(updatedList));

        const currentSaved = JSON.parse(localStorage.getItem('skyroute_current_booking') || 'null');
        if (
          currentSaved &&
          ((currentSaved.pnr && currentSaved.pnr.toUpperCase() === activeBooking.pnr?.toUpperCase()) ||
            (currentSaved.bookingId && currentSaved.bookingId === activeBooking.bookingId))
        ) {
          localStorage.setItem('skyroute_current_booking', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('Error updating cancellation in localStorage:', err);
      }
    }
  };

  const handleConfirmReschedule = () => {
    if (activeBooking) {
      const updated = {
        ...activeBooking,
        rescheduledDate: newTravelDate,
        status: 'Confirmed (Rescheduled)'
      };
      setActiveBooking(updated);
      setRescheduleSuccess(true);
      setShowRescheduleModal(false);

      try {
        const saved = JSON.parse(localStorage.getItem('skyroute_bookings') || '[]');
        const exists = saved.some(
          (b) =>
            (b.pnr && b.pnr.toUpperCase() === activeBooking.pnr?.toUpperCase()) ||
            (b.bookingId && b.bookingId === activeBooking.bookingId)
        );

        let updatedList;
        if (exists) {
          updatedList = saved.map((b) =>
            (b.pnr && b.pnr.toUpperCase() === activeBooking.pnr?.toUpperCase()) ||
            (b.bookingId && b.bookingId === activeBooking.bookingId)
              ? { ...b, rescheduledDate: newTravelDate, status: 'Confirmed (Rescheduled)' }
              : b
          );
        } else {
          updatedList = [updated, ...saved];
        }

        localStorage.setItem('skyroute_bookings', JSON.stringify(updatedList));

        const currentSaved = JSON.parse(localStorage.getItem('skyroute_current_booking') || 'null');
        if (
          currentSaved &&
          ((currentSaved.pnr && currentSaved.pnr.toUpperCase() === activeBooking.pnr?.toUpperCase()) ||
            (currentSaved.bookingId && currentSaved.bookingId === activeBooking.bookingId))
        ) {
          localStorage.setItem('skyroute_current_booking', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('Error updating reschedule in localStorage:', err);
      }
    }
  };

  return (
    <div className="SkyRoute-manage-page">
      <div className="SkyRoute-container">
        {/* Header */}
        <div className="SkyRoute-section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <span className="SkyRoute-section-header__tag">RESERVATION PORTAL</span>
            <h1 className="SkyRoute-section-header__title">Manage Your Booking</h1>
            <p className="SkyRoute-section-header__subtitle">
              Enter your Booking Reference (PNR) and Last Name to retrieve e-tickets, select meals, reschedule, or cancel.
            </p>
          </div>
        </div>

        {/* PNR Tracker Search Form */}
        <div className="SkyRoute-pnr-form-card SkyRoute-card">
          <form onSubmit={handleTrackBooking} className="SkyRoute-pnr-form">
            <div className="SkyRoute-pnr-fields-row">
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Booking Reference / PNR *</label>
                <input
                  type="text"
                  className="SkyRoute-text-input"
                  placeholder="e.g. X7K29P"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Primary Passenger Last Name *</label>
                <input
                  type="text"
                  className="SkyRoute-text-input"
                  placeholder="e.g. Patel"
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="SkyRoute-pnr-submit-wrapper">
                <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg">
                  Track Booking &rarr;
                </button>
              </div>
            </div>

            {errorMessage && <span className="SkyRoute-field-error">{errorMessage}</span>}
          </form>
        </div>

        {/* Success Feedback Banners */}
        {cancelSuccess && (
          <div className="SkyRoute-alert-banner SkyRoute-alert-banner--success" role="alert">
            <span className="SkyRoute-alert-banner__icon">✓</span>
            <div className="SkyRoute-alert-banner__content">
              Cancellation request submitted. A refund of {formatINR(activeBooking?.total ? activeBooking.total - 1200 : 3069)} will be credited to your original payment method within 3-5 business days.
            </div>
          </div>
        )}

        {rescheduleSuccess && (
          <div className="SkyRoute-alert-banner SkyRoute-alert-banner--success" role="alert">
            <span className="SkyRoute-alert-banner__icon">✓</span>
            <div className="SkyRoute-alert-banner__content">
              Flight successfully rescheduled to {newTravelDate}. Updated digital boarding pass has been generated.
            </div>
          </div>
        )}

        {/* Active Booking Details Card */}
        {activeBooking && (
          <div className="SkyRoute-manage-result-card SkyRoute-card">
            <div className="SkyRoute-manage-result-header">
              <div>
                <div className="SkyRoute-manage-pnr-row">
                  <span className="SkyRoute-badge SkyRoute-badge--success">{activeBooking.status}</span>
                  <span className="SkyRoute-pnr-tag">PNR: {activeBooking.pnr}</span>
                </div>
                <h2 className="SkyRoute-manage-route-title">
                  {activeBooking.flight?.originCity} ({activeBooking.flight?.originCode}) &rarr; {activeBooking.flight?.destinationCity} ({activeBooking.flight?.destinationCode})
                </h2>
              </div>

              <div className="SkyRoute-manage-header-actions">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                  onClick={() => {
                    if (onSelectBooking) onSelectBooking(activeBooking);
                    onNavigate('/booking-confirmation');
                  }}
                >
                  View Digital Boarding Pass &rarr;
                </button>
              </div>
            </div>

            {/* Booking Metadata Grid */}
            <div className="SkyRoute-manage-details-grid">
              <div className="SkyRoute-manage-detail-item">
                <span className="SkyRoute-manage-label">AIRLINE &amp; FLIGHT</span>
                <strong className="SkyRoute-manage-val">
                  {activeBooking.flight?.airline} {activeBooking.flight?.flightNumber}
                </strong>
              </div>

              <div className="SkyRoute-manage-detail-item">
                <span className="SkyRoute-manage-label">PRIMARY PASSENGER</span>
                <strong className="SkyRoute-manage-val">
                  {activeBooking.passengers?.[0]?.firstName} {activeBooking.passengers?.[0]?.lastName || 'Patel'}
                </strong>
              </div>

              <div className="SkyRoute-manage-detail-item">
                <span className="SkyRoute-manage-label">ASSIGNED SEAT</span>
                <strong className="SkyRoute-manage-val" style={{ color: '#7D5A44' }}>
                  {activeBooking.seat?.id || '14A'} ({activeBooking.seat?.type || 'Window'})
                </strong>
              </div>

              <div className="SkyRoute-manage-detail-item">
                <span className="SkyRoute-manage-label">BAGGAGE ALLOWANCE</span>
                <strong className="SkyRoute-manage-val">
                  {activeBooking.flight?.baggage || '7kg Cabin + 15kg Check-in'}
                </strong>
              </div>

              <div className="SkyRoute-manage-detail-item">
                <span className="SkyRoute-manage-label">SCHEDULED DEPARTURE</span>
                <strong className="SkyRoute-manage-val">
                  {activeBooking.flight?.departureTime || '06:15 AM'} (Gate {activeBooking.gate || 'B12'})
                </strong>
              </div>

              <div className="SkyRoute-manage-detail-item">
                <span className="SkyRoute-manage-label">TOTAL FARE PAID</span>
                <strong className="SkyRoute-manage-val">
                  {formatINR(activeBooking.total || 4269)}
                </strong>
              </div>
            </div>

            {/* Management Actions Grid */}
            <div className="SkyRoute-manage-actions-panel">
              <h3 className="SkyRoute-manage-actions-title">Trip Management Actions</h3>
              <div className="SkyRoute-manage-buttons-grid">
                <button
                  type="button"
                  className="SkyRoute-manage-action-box"
                  onClick={() => setShowRescheduleModal(true)}
                >
                  <span className="SkyRoute-action-icon">🗓️</span>
                  <div className="SkyRoute-action-meta">
                    <strong>Reschedule Flight</strong>
                    <span>Change departure date or flight time</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="SkyRoute-manage-action-box"
                  onClick={() => setShowCancelModal(true)}
                >
                  <span className="SkyRoute-action-icon">❌</span>
                  <div className="SkyRoute-action-meta">
                    <strong>Cancel Reservation</strong>
                    <span>Review cancellation fee &amp; instant refund</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="SkyRoute-manage-action-box"
                  onClick={() => onNavigate('/flight-status')}
                >
                  <span className="SkyRoute-action-icon">⏱️</span>
                  <div className="SkyRoute-action-meta">
                    <strong>Live Flight Radar</strong>
                    <span>Check terminal, gate and baggage belt</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="SkyRoute-manage-action-box"
                  onClick={() => {
                    if (onSelectBooking) onSelectBooking(activeBooking);
                    onNavigate('/booking-confirmation');
                  }}
                >
                  <span className="SkyRoute-action-icon">📥</span>
                  <div className="SkyRoute-action-meta">
                    <strong>Download E-Ticket</strong>
                    <span>Print official PDF receipt with QR code</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && (
          <div className="SkyRoute-modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="SkyRoute-modal" onClick={(e) => e.stopPropagation()}>
              <div className="SkyRoute-modal__header">
                <h3 className="SkyRoute-modal__title">Confirm Flight Cancellation</h3>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={() => setShowCancelModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="SkyRoute-modal__body">
                <p style={{ marginBottom: '1rem' }}>
                  Are you sure you want to cancel booking <strong>{activeBooking?.pnr}</strong>?
                </p>
                <div className="SkyRoute-refund-calculation-box SkyRoute-card">
                  <div className="SkyRoute-breakdown-row">
                    <span>Original Booking Total:</span>
                    <strong>{formatINR(activeBooking?.total || 4269)}</strong>
                  </div>
                  <div className="SkyRoute-breakdown-row">
                    <span>Airline Cancellation Fee:</span>
                    <strong style={{ color: '#7D5A44' }}>-₹1,200</strong>
                  </div>
                  <div className="SkyRoute-breakdown-row" style={{ borderTop: '1px solid var(--SkyRoute-border)', paddingTop: '8px' }}>
                    <span>Estimated Refund Amount:</span>
                    <strong style={{ color: '#7D5A44', fontSize: '1.1rem' }}>
                      {formatINR(activeBooking?.total ? activeBooking.total - 1200 : 3069)}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="SkyRoute-modal__footer">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--outline"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary"
                  style={{ backgroundColor: '#7D5A44', borderColor: '#7D5A44' }}
                  onClick={handleConfirmCancel}
                >
                  Confirm &amp; Process Refund
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="SkyRoute-modal-overlay" onClick={() => setShowRescheduleModal(false)}>
            <div className="SkyRoute-modal" onClick={(e) => e.stopPropagation()}>
              <div className="SkyRoute-modal__header">
                <h3 className="SkyRoute-modal__title">Reschedule Flight</h3>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={() => setShowRescheduleModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="SkyRoute-modal__body">
                <p style={{ marginBottom: '1rem' }}>
                  Select your new preferred travel date for route <strong>{activeBooking?.flight?.originCode} &rarr; {activeBooking?.flight?.destinationCode}</strong>:
                </p>
                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">New Departure Date</label>
                  <input
                    type="date"
                    className="SkyRoute-text-input"
                    value={newTravelDate}
                    onChange={(e) => setNewTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <p className="SkyRoute-reschedule-note">
                  ℹ️ Zero change fee applicable on your flexible ticket. Fare difference (if any) is waived for next week travel.
                </p>
              </div>
              <div className="SkyRoute-modal__footer">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--outline"
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary"
                  onClick={handleConfirmReschedule}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
