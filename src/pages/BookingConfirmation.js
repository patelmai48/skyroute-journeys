import React, { useState } from 'react';
import format from 'date-fns/format';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDisplayDate = (date) => {
  if (!date) return 'Fri, 12 Oct 2026';
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Fri, 12 Oct 2026' : format(d, 'EEE, d MMM yyyy');
  } catch (e) {
    return 'Fri, 12 Oct 2026';
  }
};

const BookingConfirmation = ({
  currentBooking,
  onNavigateHome,
  onNavigateMyBookings,
  onNavigate
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Fallback demo booking if none active
  const booking = currentBooking || {
    bookingId: 'BK-948210',
    pnr: 'X7K29P',
    bookingDate: new Date().toISOString(),
    flight: {
      airline: 'IndiGo',
      airlineCode: '6E',
      airlineColor: '#173F3A',
      flightNumber: '6E-214',
      aircraft: 'Airbus A320neo',
      originCity: 'Ahmedabad',
      originCode: 'AMD',
      destinationCity: 'Mumbai',
      destinationCode: 'BOM',
      departureTime: '06:15',
      arrivalTime: '07:40',
      durationText: '1h 25m',
      cabin: 'Economy',
      baggage: '7kg Cabin + 15kg Check-in'
    },
    passengers: [
      { firstName: 'Mahi', lastName: 'Patel', gender: 'female', govtIdType: 'Aadhaar' }
    ],
    seat: { id: '14A', type: 'Window', category: 'Extra Legroom' },
    gate: 'B12',
    terminal: 'T1',
    status: 'Confirmed',
    total: 4269
  };

  const passengerName = booking.passengers?.[0]
    ? `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`
    : 'Mahi Patel';

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      window.print();
      setDownloadSuccess(false);
    }, 400);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `SkyRoute Flight Booking Confirmed!\nPNR: ${booking.pnr}\nFlight: ${booking.flight?.airline} ${booking.flight?.flightNumber}\nRoute: ${booking.flight?.originCode} -> ${booking.flight?.destinationCode}\nSeat: ${booking.seat?.id || '14A'}`
      );
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <div className="SkyRoute-confirmation-page">
      <div className="SkyRoute-container">
        {/* Success Header */}
        <div className="SkyRoute-confirmation-hero">
          <div className="SkyRoute-confirmation-hero__icon">🎉</div>
          <h1 className="SkyRoute-confirmation-hero__title">Booking Confirmed!</h1>
          <p className="SkyRoute-confirmation-hero__subtitle">
            Your e-ticket and boarding pass have been issued. Confirmation details sent to your registered email &amp; SMS.
          </p>
          <div className="SkyRoute-confirmation-pnr-pill">
            <span>Booking PNR:</span>
            <strong className="SkyRoute-pnr-code">{booking.pnr}</strong>
          </div>
        </div>

        {/* Realistic Airline Boarding Pass Component */}
        <div className="SkyRoute-boarding-pass-card SkyRoute-card">
          <div className="SkyRoute-boarding-pass-header">
            <div className="SkyRoute-boarding-pass-brand">
              <span className="SkyRoute-boarding-pass-logo">✈</span>
              <span className="SkyRoute-boarding-pass-brand-name">SKYROUTE AIRWAYS</span>
            </div>
            <span className="SkyRoute-badge SkyRoute-badge--success">DIGITAL BOARDING PASS</span>
          </div>

          <div className="SkyRoute-boarding-pass-main">
            {/* Left Main Section */}
            <div className="SkyRoute-boarding-pass-left">
              {/* Route & Flight Code */}
              <div className="SkyRoute-boarding-pass-route">
                <div className="SkyRoute-bp-city-col">
                  <span className="SkyRoute-bp-city-name">{booking.flight?.originCity || 'Ahmedabad'}</span>
                  <strong className="SkyRoute-bp-city-code">{booking.flight?.originCode || 'AMD'}</strong>
                  <span className="SkyRoute-bp-time">{booking.flight?.departureTime || '06:15'}</span>
                </div>

                <div className="SkyRoute-bp-flight-vector">
                  <span className="SkyRoute-bp-flight-no">
                    {booking.flight?.airline} &bull; {booking.flight?.flightNumber}
                  </span>
                  <div className="SkyRoute-bp-vector-line">
                    <span className="SkyRoute-bp-vector-icon">✈</span>
                  </div>
                  <span className="SkyRoute-bp-duration">{booking.flight?.durationText || '1h 25m'}</span>
                </div>

                <div className="SkyRoute-bp-city-col SkyRoute-bp-city-col--dest">
                  <span className="SkyRoute-bp-city-name">{booking.flight?.destinationCity || 'Mumbai'}</span>
                  <strong className="SkyRoute-bp-city-code">{booking.flight?.destinationCode || 'BOM'}</strong>
                  <span className="SkyRoute-bp-time">{booking.flight?.arrivalTime || '07:40'}</span>
                </div>
              </div>

              {/* Passenger & Flight Details Grid */}
              <div className="SkyRoute-bp-details-grid">
                <div className="SkyRoute-bp-field">
                  <span className="SkyRoute-bp-field-label">PASSENGER NAME</span>
                  <strong className="SkyRoute-bp-field-value">{passengerName.toUpperCase()}</strong>
                </div>
                <div className="SkyRoute-bp-field">
                  <span className="SkyRoute-bp-field-label">TRAVEL DATE</span>
                  <strong className="SkyRoute-bp-field-value">
                    {formatDisplayDate(booking.searchData?.departureDate)}
                  </strong>
                </div>
                <div className="SkyRoute-bp-field">
                  <span className="SkyRoute-bp-field-label">CABIN CLASS</span>
                  <strong className="SkyRoute-bp-field-value">{booking.flight?.cabin || 'Economy'}</strong>
                </div>
                <div className="SkyRoute-bp-field">
                  <span className="SkyRoute-bp-field-label">BAGGAGE</span>
                  <strong className="SkyRoute-bp-field-value">{booking.flight?.baggage || '7kg + 15kg'}</strong>
                </div>
              </div>

              {/* Gate & Boarding Time Highlights */}
              <div className="SkyRoute-bp-gate-strip">
                <div className="SkyRoute-bp-gate-item">
                  <span className="SkyRoute-bp-gate-label">GATE</span>
                  <strong className="SkyRoute-bp-gate-val">{booking.gate || 'B12'}</strong>
                </div>
                <div className="SkyRoute-bp-gate-item">
                  <span className="SkyRoute-bp-gate-label">TERMINAL</span>
                  <strong className="SkyRoute-bp-gate-val">{booking.terminal || 'T1'}</strong>
                </div>
                <div className="SkyRoute-bp-gate-item">
                  <span className="SkyRoute-bp-gate-label">BOARDING TIME</span>
                  <strong className="SkyRoute-bp-gate-val" style={{ color: '#4F7C73' }}>
                    45m BEFORE DEPARTURE
                  </strong>
                </div>
              </div>
            </div>

            {/* Perforation Divider */}
            <div className="SkyRoute-boarding-pass-divider">
              <div className="SkyRoute-bp-notch SkyRoute-bp-notch--top"></div>
              <div className="SkyRoute-bp-dash-line"></div>
              <div className="SkyRoute-bp-notch SkyRoute-bp-notch--bottom"></div>
            </div>

            {/* Right Stub Section (Seat & Barcode) */}
            <div className="SkyRoute-boarding-pass-stub">
              <div className="SkyRoute-bp-stub-top">
                <span className="SkyRoute-bp-field-label">SEAT NUMBER</span>
                <strong className="SkyRoute-bp-seat-number">{booking.seat?.id || '14A'}</strong>
                <span className="SkyRoute-bp-seat-type">{booking.seat?.type || 'Window'} &bull; Zone 1</span>
              </div>

              {/* Barcode Visual */}
              <div className="SkyRoute-bp-barcode-container">
                <svg viewBox="0 0 160 50" className="SkyRoute-bp-barcode-svg">
                  {[4, 8, 14, 18, 26, 32, 36, 42, 48, 56, 62, 68, 76, 82, 88, 96, 102, 108, 116, 122, 128, 134, 142, 148, 154].map((x, i) => (
                    <rect
                      key={i}
                      x={x}
                      y="0"
                      width={i % 3 === 0 ? 3.5 : i % 2 === 0 ? 2 : 1}
                      height="44"
                      fill="currentColor"
                    />
                  ))}
                </svg>
                <span className="SkyRoute-bp-barcode-text">*{booking.pnr}*</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="SkyRoute-confirmation-actions">
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg"
            onClick={handleDownload}
          >
            <span>📥</span>
            <span>Download / Print Ticket</span>
          </button>

          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--lg"
            onClick={handleShare}
          >
            <span>🔗</span>
            <span>{shareSuccess ? 'Copied to Clipboard!' : 'Share Itinerary'}</span>
          </button>

          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--secondary SkyRoute-btn--lg"
            onClick={onNavigateMyBookings}
          >
            <span>🧳</span>
            <span>Add to My Trips</span>
          </button>

          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--lg"
            onClick={onNavigateHome}
          >
            Book Another Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
