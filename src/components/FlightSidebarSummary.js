import React from 'react';
import format from 'date-fns/format';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDisplayDate = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : format(d, 'EEE, d MMM yyyy');
  } catch (e) {
    return '';
  }
};

const FlightSidebarSummary = ({
  flight,
  searchData,
  selectedSeat,
  insurancePrice = 0,
  discountAmount = 0,
  repeatDiscount = 0,
  pointsEarned = 0
}) => {
  if (!flight) return null;

  const passengers = Number(searchData?.passengers) || 1;
  const baseFlightFare = (flight.price || 3800) * passengers;
  const taxesAndFees = Math.round(baseFlightFare * 0.12);
  const seatFee = selectedSeat ? (selectedSeat.price || 0) : 0;
  const insuranceFee = insurancePrice || 0;
  const grandTotal = Math.max(0, baseFlightFare + taxesAndFees + seatFee + insuranceFee - discountAmount - repeatDiscount);

  return (
    <div className="SkyRoute-card SkyRoute-sidebar-summary">
      <h3 className="SkyRoute-sidebar-summary__title">Booking Summary</h3>

      {/* Airline Header */}
      <div className="SkyRoute-sidebar-summary__airline">
        <div
          className="SkyRoute-sidebar-summary__logo"
          style={{ backgroundColor: flight.airlineColor || '#143F67' }}
        >
          {flight.airlineCode || flight.airline.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="SkyRoute-sidebar-summary__airline-name">{flight.airline}</h4>
          <span className="SkyRoute-sidebar-summary__flight-no">
            {flight.flightNumber} &bull; {flight.aircraft}
          </span>
        </div>
      </div>

      <div className="SkyRoute-sidebar-summary__divider"></div>

      {/* Route & Times */}
      <div className="SkyRoute-sidebar-summary__route-box">
        <div className="SkyRoute-sidebar-summary__point">
          <strong className="SkyRoute-sidebar-summary__time">{flight.departureTime}</strong>
          <span className="SkyRoute-sidebar-summary__code">{flight.originCode}</span>
          <span className="SkyRoute-sidebar-summary__city">{flight.originCity}</span>
        </div>

        <div className="SkyRoute-sidebar-summary__mid">
          <span className="SkyRoute-sidebar-summary__duration">{flight.durationText}</span>
          <span className="SkyRoute-sidebar-summary__arrow">&rarr;</span>
          <span className="SkyRoute-sidebar-summary__stops">
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
          </span>
        </div>

        <div className="SkyRoute-sidebar-summary__point SkyRoute-sidebar-summary__point--arr">
          <strong className="SkyRoute-sidebar-summary__time">{flight.arrivalTime}</strong>
          <span className="SkyRoute-sidebar-summary__code">{flight.destinationCode}</span>
          <span className="SkyRoute-sidebar-summary__city">{flight.destinationCity}</span>
        </div>
      </div>

      <div className="SkyRoute-sidebar-summary__divider"></div>

      {/* Meta Info */}
      <div className="SkyRoute-sidebar-summary__meta-list">
        <div className="SkyRoute-sidebar-summary__meta-row">
          <span>Travel Date</span>
          <strong>{formatDisplayDate(searchData?.departureDate)}</strong>
        </div>
        <div className="SkyRoute-sidebar-summary__meta-row">
          <span>Travellers</span>
          <strong>{passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}</strong>
        </div>
        <div className="SkyRoute-sidebar-summary__meta-row">
          <span>Cabin Class</span>
          <strong>{flight.cabin || 'Economy'}</strong>
        </div>
        {selectedSeat && (
          <div className="SkyRoute-sidebar-summary__meta-row">
            <span>Assigned Seat</span>
            <strong className="SkyRoute-badge SkyRoute-badge--success">
              {selectedSeat.id} ({selectedSeat.type})
            </strong>
          </div>
        )}
      </div>

      <div className="SkyRoute-sidebar-summary__divider"></div>

      {/* Detailed Fare Breakdown */}
      <div className="SkyRoute-sidebar-summary__breakdown">
        <div className="SkyRoute-breakdown-row">
          <span>Base Airfare ({passengers}x)</span>
          <span>{formatINR(baseFlightFare)}</span>
        </div>
        <div className="SkyRoute-breakdown-row">
          <span>Taxes &amp; Airport Surcharges</span>
          <span>{formatINR(taxesAndFees)}</span>
        </div>
        {seatFee > 0 && (
          <div className="SkyRoute-breakdown-row">
            <span>Seat Assignment ({selectedSeat?.id})</span>
            <span>+{formatINR(seatFee)}</span>
          </div>
        )}
        {insuranceFee > 0 && (
          <div className="SkyRoute-breakdown-row">
            <span>Travel Insurance Protection</span>
            <span>+{formatINR(insuranceFee)}</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div className="SkyRoute-breakdown-row SkyRoute-breakdown-row--discount">
            <span>Coupon Discount</span>
            <span>-{formatINR(discountAmount)}</span>
          </div>
        )}
        {repeatDiscount > 0 && (
          <div className="SkyRoute-breakdown-row SkyRoute-breakdown-row--discount SkyRoute-breakdown-row--loyalty">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ⭐ Repeat Traveler Reward
            </span>
            <span>-{formatINR(repeatDiscount)}</span>
          </div>
        )}
      </div>

      <div className="SkyRoute-sidebar-summary__divider"></div>

      {/* Total Fare Amount */}
      <div className="SkyRoute-sidebar-summary__total-row">
        <div>
          <span className="SkyRoute-sidebar-summary__total-label">Grand Total</span>
          <span className="SkyRoute-sidebar-summary__total-tax">All GST &amp; fees included</span>
        </div>
        <span className="SkyRoute-sidebar-summary__total-val">{formatINR(grandTotal)}</span>
      </div>

      {pointsEarned > 0 && (
        <div className="SkyRoute-sidebar-summary__points-reward" style={{
          marginTop: '12px',
          padding: '10px 12px',
          borderRadius: '8px',
          backgroundColor: '#FBF3E4',
          border: '1.5px solid #E4B46C',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: '#143F67'
        }}>
          <span>🎁</span>
          <span>
            Earn <strong>+{pointsEarned.toLocaleString()} SkyPoints</strong> on this booking!
          </span>
        </div>
      )}
    </div>
  );
};

export default FlightSidebarSummary;
