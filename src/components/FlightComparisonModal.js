import React from 'react';

const FlightComparisonModal = ({
  isOpen,
  onClose,
  comparedFlights = [],
  onSelectFlight,
  onRemoveFlight
}) => {
  if (!isOpen || comparedFlights.length === 0) return null;

  return (
    <div className="SkyRoute-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="SkyRoute-modal SkyRoute-comparison-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="SkyRoute-modal__header">
          <div>
            <span className="SkyRoute-badge SkyRoute-badge--success">Side-by-Side Analysis</span>
            <h2 className="SkyRoute-modal__title">Compare Flights ({comparedFlights.length}/3)</h2>
          </div>
          <button
            type="button"
            className="SkyRoute-modal__close"
            onClick={onClose}
            aria-label="Close comparison"
          >
            &times;
          </button>
        </div>

        <div className="SkyRoute-modal__body SkyRoute-comparison-modal__body">
          <div className="SkyRoute-comparison-table-wrapper">
            <table className="SkyRoute-comparison-table">
              <thead>
                <tr>
                  <th className="SkyRoute-comparison-feature-col">Feature</th>
                  {comparedFlights.map((flight) => (
                    <th key={flight.id} className="SkyRoute-comparison-flight-col">
                      <div className="SkyRoute-comparison-flight-header">
                        <button
                          type="button"
                          className="SkyRoute-comparison-remove-btn"
                          onClick={() => onRemoveFlight(flight.id)}
                          title="Remove flight from comparison"
                        >
                          &times;
                        </button>
                        <span
                          className="SkyRoute-airline-logo-badge"
                          style={{ backgroundColor: flight.airlineColor }}
                        >
                          {flight.airlineCode}
                        </span>
                        <div className="SkyRoute-comparison-flight-meta">
                          <strong className="SkyRoute-comparison-airline-name">{flight.airline}</strong>{' '}
                          <span className="SkyRoute-comparison-flight-num">{flight.flightNumber}</span>
                        </div>
                        <span className="SkyRoute-comparison-flight-price">
                          ₹{flight.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 1. Timings & Route */}
                <tr>
                  <td className="SkyRoute-comparison-label">Timings</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <strong>{flight.departureTime} &ndash; {flight.arrivalTime}</strong>
                      <div className="SkyRoute-comparison-sub">
                        {flight.originCode} &rarr; {flight.destinationCode}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Duration */}
                <tr>
                  <td className="SkyRoute-comparison-label">Duration</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <strong>{flight.durationText}</strong>
                    </td>
                  ))}
                </tr>

                {/* 3. Stops */}
                <tr>
                  <td className="SkyRoute-comparison-label">Stops</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <span className={`SkyRoute-badge ${flight.stops === 0 ? 'SkyRoute-badge--success' : ''}`}>
                        {flight.stopText}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 4. Baggage Allowance */}
                <tr>
                  <td className="SkyRoute-comparison-label">Baggage</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <span>🧳 {flight.baggage || '7kg Cabin + 15kg Check-in'}</span>
                    </td>
                  ))}
                </tr>

                {/* 5. Cancellation & Refunds */}
                <tr>
                  <td className="SkyRoute-comparison-label">Cancellation</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <span className={flight.refundable ? 'SkyRoute-text-success' : 'SkyRoute-text-danger'}>
                        {flight.refundPolicy || (flight.refundable ? 'Refundable' : 'Non-refundable')}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 6. Seat Space & Aircraft */}
                <tr>
                  <td className="SkyRoute-comparison-label">Aircraft &amp; Pitch</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <div>{flight.aircraft || 'Airbus A320neo'}</div>
                      <span className="SkyRoute-comparison-sub">{flight.seatPitch || '30-31 inch standard'}</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Meal Included */}
                <tr>
                  <td className="SkyRoute-comparison-label">In-Flight Meals</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <span>🍽️ {flight.meal || 'Paid selection'}</span>
                    </td>
                  ))}
                </tr>

                {/* 8. On-Time Rating */}
                <tr>
                  <td className="SkyRoute-comparison-label">On-Time Score</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <strong style={{ color: '#1E5282' }}>{flight.onTimeRating || '95% On-time'}</strong>
                    </td>
                  ))}
                </tr>

                {/* 9. Action Selection Row */}
                <tr>
                  <td className="SkyRoute-comparison-label">Action</td>
                  {comparedFlights.map((flight) => (
                    <td key={flight.id}>
                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm SkyRoute-btn--full"
                        onClick={() => {
                          onSelectFlight(flight);
                          onClose();
                        }}
                      >
                        Select Flight &rarr;
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="SkyRoute-modal__footer">
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--outline"
            onClick={onClose}
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightComparisonModal;
