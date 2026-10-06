import React, { useState } from 'react';
import Icon from './Icon';

// Generates 20 rows of seats (A B C | D E F)
const generateSeatRows = () => {
  const rows = [];
  const occupiedSet = new Set(['1A', '1C', '2D', '3B', '4E', '5F', '7A', '8C', '12B', '14D', '15F', '18A', '19C']);

  for (let r = 1; r <= 20; r++) {
    const isExitRow = r === 14;
    const isExtraLegroom = r === 1 || r === 12 || r === 14;
    const isFrontRow = r <= 3;

    let price = 0;
    let category = 'Standard';

    if (r === 1) {
      price = 800;
      category = 'Front Premium (Extra Legroom)';
    } else if (isExitRow) {
      price = 600;
      category = 'Exit Row (Extra Legroom)';
    } else if (isExtraLegroom) {
      price = 450;
      category = 'Extra Legroom';
    } else if (isFrontRow) {
      price = 350;
      category = 'Front Cabin';
    } else if (r <= 10) {
      price = 250;
      category = 'Preferred Window/Aisle';
    } else {
      price = 0;
      category = 'Standard (Free)';
    }

    const seats = ['A', 'B', 'C', 'D', 'E', 'F'].map((col) => {
      const id = `${r}${col}`;
      const isWindow = col === 'A' || col === 'F';
      const isAisle = col === 'C' || col === 'D';
      const isMiddle = col === 'B' || col === 'E';
      const isOccupied = occupiedSet.has(id);

      return {
        id,
        row: r,
        col,
        type: isWindow ? 'Window' : isAisle ? 'Aisle' : 'Middle',
        category,
        price: isMiddle && price > 0 ? price - 100 : price,
        isOccupied,
        isExtraLegroom,
        isExitRow,
      };
    });

    rows.push({ rowNumber: r, seats, isExitRow });
  }

  return rows;
};

const SEAT_ROWS = generateSeatRows();

const SeatSelection = ({
  selectedSeat,
  onSelectSeat,
  onConfirm,
  onBack,
  flight,
  passengerCount = 1
}) => {
  const [activeSeat, setActiveSeat] = useState(
    selectedSeat || {
      id: '14A',
      row: 14,
      col: 'A',
      type: 'Window',
      category: 'Exit Row (Extra Legroom)',
      price: 450,
      isExtraLegroom: true
    }
  );

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;
    setActiveSeat(seat);
    if (onSelectSeat) onSelectSeat(seat);
  };

  const handleConfirmSeat = () => {
    if (onConfirm) onConfirm(activeSeat);
  };

  return (
    <div className="SkyRoute-seat-selection-container SkyRoute-card">
      <div className="SkyRoute-seat-selection-header">
        <div>
          <span className="SkyRoute-badge SkyRoute-badge--success">Aircraft Seat Selection</span>
          <h2 className="SkyRoute-seat-selection-title">Choose Your Preferred Seat</h2>
          <p className="SkyRoute-seat-selection-subtitle">
            {flight?.airline || 'IndiGo'} &bull; {flight?.aircraft || 'Airbus A320neo'} &bull; {flight?.originCity} ({flight?.originCode}) &rarr; {flight?.destinationCity} ({flight?.destinationCode})
          </p>
        </div>
      </div>

      {/* Seat Type Legend */}
      <div className="SkyRoute-seat-legend-bar">
        <div className="SkyRoute-seat-legend-item">
          <span className="SkyRoute-seat-sample SkyRoute-seat-sample--available"></span>
          <span>Available</span>
        </div>
        <div className="SkyRoute-seat-legend-item">
          <span className="SkyRoute-seat-sample SkyRoute-seat-sample--selected"></span>
          <span>Selected</span>
        </div>
        <div className="SkyRoute-seat-legend-item">
          <span className="SkyRoute-seat-sample SkyRoute-seat-sample--occupied"></span>
          <span>Occupied</span>
        </div>
        <div className="SkyRoute-seat-legend-item">
          <span className="SkyRoute-seat-sample SkyRoute-seat-sample--legroom"></span>
          <span>Extra Legroom (₹450+)</span>
        </div>
        <div className="SkyRoute-seat-legend-item">
          <span className="SkyRoute-seat-sample SkyRoute-seat-sample--free"></span>
          <span>Free (₹0)</span>
        </div>
      </div>

      <div className="SkyRoute-seat-layout-grid">
        {/* Left: Aircraft Fuselage Visualization */}
        <div className="SkyRoute-fuselage-wrapper">
          <div className="SkyRoute-aircraft-nose">
            <span className="SkyRoute-cockpit-icon" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="flight" size={16} /> Cockpit / Front
            </span>
          </div>

          {/* Cabin Column Headers (A B C | Aisle | D E F) */}
          <div
            className="SkyRoute-cabin-col-headers"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'nowrap',
              width: '100%'
            }}
          >
            <span className="SkyRoute-col-letter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', minWidth: '42px', flexShrink: 0, textAlign: 'center', fontWeight: '800' }}>A</span>
            <span className="SkyRoute-col-letter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', minWidth: '42px', flexShrink: 0, textAlign: 'center', fontWeight: '800' }}>B</span>
            <span className="SkyRoute-col-letter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', minWidth: '42px', flexShrink: 0, textAlign: 'center', fontWeight: '800' }}>C</span>
            <span className="SkyRoute-aisle-label" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', minWidth: '38px', flexShrink: 0, textAlign: 'center', fontSize: '0.72rem', fontWeight: '800' }}>Aisle</span>
            <span className="SkyRoute-col-letter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', minWidth: '42px', flexShrink: 0, textAlign: 'center', fontWeight: '800' }}>D</span>
            <span className="SkyRoute-col-letter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', minWidth: '42px', flexShrink: 0, textAlign: 'center', fontWeight: '800' }}>E</span>
            <span className="SkyRoute-col-letter" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', minWidth: '42px', flexShrink: 0, textAlign: 'center', fontWeight: '800' }}>F</span>
          </div>

          {/* Seat Rows */}
          <div className="SkyRoute-cabin-rows" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            {SEAT_ROWS.map((row) => (
              <div key={row.rowNumber} className="SkyRoute-cabin-row-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                {row.isExitRow && (
                  <div className="SkyRoute-exit-row-banner">
                    <span>Emergency Exit Row &ndash; Extra Legroom</span>
                  </div>
                )}

                <div
                  className="SkyRoute-cabin-row"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'nowrap',
                    width: '100%'
                  }}
                >
                  {/* Left seats: A, B, C */}
                  {row.seats.slice(0, 3).map((seat) => {
                    const isSelected = activeSeat?.id === seat.id;
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '42px',
                          minWidth: '42px',
                          height: '42px',
                          flexShrink: 0,
                          padding: 0
                        }}
                        className={`SkyRoute-seat-btn ${
                          seat.isOccupied
                            ? 'SkyRoute-seat-btn--occupied'
                            : isSelected
                            ? 'SkyRoute-seat-btn--selected'
                            : seat.isExtraLegroom
                            ? 'SkyRoute-seat-btn--legroom'
                            : seat.price === 0
                            ? 'SkyRoute-seat-btn--free'
                            : 'SkyRoute-seat-btn--paid'
                        }`}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${seat.type} (${seat.category}): ₹${seat.price}`}
                      >
                        <span className="SkyRoute-seat-num">{seat.id}</span>
                      </button>
                    );
                  })}

                  {/* Center: Row Number */}
                  <div
                    className="SkyRoute-aisle-row-number"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '38px',
                      minWidth: '38px',
                      flexShrink: 0,
                      textAlign: 'center',
                      fontWeight: '800'
                    }}
                  >
                    {row.rowNumber}
                  </div>

                  {/* Right seats: D, E, F */}
                  {row.seats.slice(3, 6).map((seat) => {
                    const isSelected = activeSeat?.id === seat.id;
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '42px',
                          minWidth: '42px',
                          height: '42px',
                          flexShrink: 0,
                          padding: 0
                        }}
                        className={`SkyRoute-seat-btn ${
                          seat.isOccupied
                            ? 'SkyRoute-seat-btn--occupied'
                            : isSelected
                            ? 'SkyRoute-seat-btn--selected'
                            : seat.isExtraLegroom
                            ? 'SkyRoute-seat-btn--legroom'
                            : seat.price === 0
                            ? 'SkyRoute-seat-btn--free'
                            : 'SkyRoute-seat-btn--paid'
                        }`}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${seat.type} (${seat.category}): ₹${seat.price}`}
                      >
                        <span className="SkyRoute-seat-num">{seat.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="SkyRoute-aircraft-tail">
            <span>Rear Galley &amp; Lavatories</span>
          </div>
        </div>

        {/* Right: Selected Seat Summary & Price Box */}
        <div className="SkyRoute-seat-summary-sidebar">
          <div className="SkyRoute-seat-selection-card">
            <h3 className="SkyRoute-seat-selection-card__title">Selected Seat</h3>

            {activeSeat ? (
              <div className="SkyRoute-seat-details-box">
                <div className="SkyRoute-seat-badge-row">
                  <div className="SkyRoute-seat-badge-large">
                    {activeSeat.id}
                  </div>
                  <div className="SkyRoute-seat-meta">
                    <strong className="SkyRoute-seat-type">{activeSeat.type} Seat</strong>
                    <span className="SkyRoute-seat-category">{activeSeat.category}</span>
                    {activeSeat.isExtraLegroom && (
                      <span className="SkyRoute-badge SkyRoute-badge--success">
                        Extra Legroom
                      </span>
                    )}
                  </div>
                </div>

                <div className="SkyRoute-seat-price-row">
                  <span className="SkyRoute-seat-price-label">Seat Fee:</span>
                  <strong className="SkyRoute-seat-price-val">
                    {activeSeat.price === 0 ? 'FREE' : `₹${activeSeat.price.toLocaleString('en-IN')}`}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="SkyRoute-seat-empty-hint">
                Please click on an available seat in the aircraft map to select it.
              </div>
            )}

            <div className="SkyRoute-seat-perks-list">
              <div className="SkyRoute-seat-perk-item">
                <span className="SkyRoute-seat-perk-icon">
                  <Icon name="seat" size={16} color="var(--primary)" />
                </span>
                <span className="SkyRoute-seat-perk-text">Pre-assigned seat printed on boarding pass</span>
              </div>
              <div className="SkyRoute-seat-perk-item">
                <span className="SkyRoute-seat-perk-icon">
                  <Icon name="zap" size={16} color="var(--primary)" />
                </span>
                <span className="SkyRoute-seat-perk-text">Fast-track boarding with Front / Exit rows</span>
              </div>
            </div>

            <div className="SkyRoute-seat-sidebar-actions">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--full SkyRoute-btn--lg"
                onClick={handleConfirmSeat}
                disabled={!activeSeat}
              >
                Confirm Seat ({activeSeat?.id}) &rarr;
              </button>
              {onBack && (
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--full"
                  onClick={onBack}
                >
                  &larr; Back to Flight Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
