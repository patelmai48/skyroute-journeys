import React, { useState } from 'react';
import FlightSidebarSummary from '../components/FlightSidebarSummary';
import { OFFERS_DATA } from '../data/travelData';
import { useToast } from '../context/ToastContext';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const ReviewBooking = ({
  selectedFlight,
  searchData,
  passengerData,
  selectedSeat,
  selectedInsurance,
  onBackToPassengerDetails,
  onConfirmBooking,
}) => {
  const { showSuccess, showInfo } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card | netbanking | wallet
  const [upiId, setUpiId] = useState('mahipatel@okaxis');
  const [isUpiVerified, setIsUpiVerified] = useState(true);

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8841 9023 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardName, setCardName] = useState('Mahi Patel');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [otherBank, setOtherBank] = useState('');

  // Wallets
  const [selectedWallet, setSelectedWallet] = useState('phonepe');

  // Promo Code State
  const [couponCode, setCouponCode] = useState('SKYDOM500');
  const [appliedCoupon, setAppliedCoupon] = useState('SKYDOM500');
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const passengers = Number(searchData?.passengers) || 1;
  const baseFlightFare = (selectedFlight?.price || 3800) * passengers;
  const taxesAndFees = Math.round(baseFlightFare * 0.12);
  const seatFee = selectedSeat ? (selectedSeat.price || 0) : 0;
  const insuranceFee = selectedInsurance === 'none' ? 0 : 449;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon === 'SKYDOM500') discountAmount = 500;
  else if (appliedCoupon === 'FLYINTL2500') discountAmount = 2500;
  else if (appliedCoupon === 'STUDENTSKY') discountAmount = Math.round(baseFlightFare * 0.1);

  const finalTotal = Math.max(0, baseFlightFare + taxesAndFees + seatFee + insuranceFee - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    const found = OFFERS_DATA.find((o) => o.code === code);
    if (found || code === 'SKYDOM500' || code === 'FLYINTL2500' || code === 'STUDENTSKY') {
      setAppliedCoupon(code);
      if (showSuccess) showSuccess(`✓ Coupon ${code} applied — saved ${formatINR(code === 'FLYINTL2500' ? 2500 : 500)}!`);
    } else {
      setCouponError('Invalid promo code. Try SKYDOM500 or FLYINTL2500.');
    }
  };

  const handleVerifyUpi = () => {
    if (!upiId.includes('@')) {
      if (showInfo) showInfo('Please enter a valid UPI ID (e.g. name@bank)');
      return;
    }
    setIsUpiVerified(true);
    if (showSuccess) showSuccess('✓ UPI ID verified for Mahi Patel');
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Generate random PNR
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const bookingRecord = {
      bookingId: `BK-${Date.now().toString().slice(-6)}`,
      pnr,
      bookingDate: new Date().toISOString(),
      flight: selectedFlight,
      searchData,
      passengers: passengerData,
      seat: selectedSeat || { id: '14A', type: 'Window', price: 450 },
      insurance: selectedInsurance,
      paymentMethod,
      subtotal: baseFlightFare,
      taxes: taxesAndFees,
      seatFee,
      insuranceFee,
      discount: discountAmount,
      total: finalTotal,
      gate: 'B12',
      terminal: 'T1',
      status: 'Confirmed'
    };

    // Save to localStorage bookings array
    try {
      const existing = JSON.parse(localStorage.getItem('skyroute_bookings') || '[]');
      localStorage.setItem('skyroute_bookings', JSON.stringify([bookingRecord, ...existing]));
    } catch (err) {
      console.warn('Failed to persist booking:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      if (showSuccess) showSuccess('✓ Payment confirmed! Boarding pass generated.');
      onConfirmBooking(bookingRecord);
    }, 1200);
  };

  return (
    <div className="SkyRoute-review-page">
      <div className="SkyRoute-container">
        {/* Step Indicator */}
        <div className="SkyRoute-booking-steps-bar">
          <div className="SkyRoute-step-item SkyRoute-step-item--completed">
            <span className="SkyRoute-step-num">✓</span>
            <span>1. Flight Selected</span>
          </div>
          <div className="SkyRoute-step-item SkyRoute-step-item--completed">
            <span className="SkyRoute-step-num">✓</span>
            <span>2. Seat Assigned</span>
          </div>
          <div className="SkyRoute-step-item SkyRoute-step-item--completed">
            <span className="SkyRoute-step-num">✓</span>
            <span>3. Traveller Details</span>
          </div>
          <div className="SkyRoute-step-item SkyRoute-step-item--active">
            <span className="SkyRoute-step-num">4</span>
            <span>4. Payment &amp; Confirmation</span>
          </div>
        </div>

        <div className="SkyRoute-review-layout">
          {/* Main Column: Payment Methods & Review */}
          <div className="SkyRoute-review-layout__main">
            <div className="SkyRoute-section-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <span className="SkyRoute-section-header__tag">SECURE CHECKOUT</span>
                <h1 className="SkyRoute-section-header__title">Select Payment Method</h1>
                <p className="SkyRoute-section-header__subtitle">
                  Choose your preferred payment mode. 256-bit SSL encrypted transaction with instant ticket confirmation.
                </p>
              </div>
            </div>

            {/* Payment Method Selector Card */}
            <div className="SkyRoute-payment-methods-card SkyRoute-card">
              {/* Payment Tabs - Large, Clear, Professional Cards */}
              <div className="SkyRoute-payment-tabs-grid">
                <button
                  type="button"
                  className={`SkyRoute-payment-method-card ${paymentMethod === 'upi' ? 'SkyRoute-payment-method-card--active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="SkyRoute-pm-header">
                    <span className="SkyRoute-pm-icon">📱</span>
                    {paymentMethod === 'upi' ? (
                      <span className="SkyRoute-pm-badge">✓ SELECTED</span>
                    ) : (
                      <span className="SkyRoute-pm-radio-circle"></span>
                    )}
                  </div>
                  <div className="SkyRoute-pm-content">
                    <strong className="SkyRoute-pm-title">UPI / QR</strong>
                    <span className="SkyRoute-pm-desc">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`SkyRoute-payment-method-card ${paymentMethod === 'card' ? 'SkyRoute-payment-method-card--active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="SkyRoute-pm-header">
                    <span className="SkyRoute-pm-icon">💳</span>
                    {paymentMethod === 'card' ? (
                      <span className="SkyRoute-pm-badge">✓ SELECTED</span>
                    ) : (
                      <span className="SkyRoute-pm-radio-circle"></span>
                    )}
                  </div>
                  <div className="SkyRoute-pm-content">
                    <strong className="SkyRoute-pm-title">Credit / Debit Card</strong>
                    <span className="SkyRoute-pm-desc">Visa, Mastercard, RuPay, Amex</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`SkyRoute-payment-method-card ${paymentMethod === 'netbanking' ? 'SkyRoute-payment-method-card--active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <div className="SkyRoute-pm-header">
                    <span className="SkyRoute-pm-icon">🏦</span>
                    {paymentMethod === 'netbanking' ? (
                      <span className="SkyRoute-pm-badge">✓ SELECTED</span>
                    ) : (
                      <span className="SkyRoute-pm-radio-circle"></span>
                    )}
                  </div>
                  <div className="SkyRoute-pm-content">
                    <strong className="SkyRoute-pm-title">Net Banking</strong>
                    <span className="SkyRoute-pm-desc">HDFC, ICICI, SBI, Axis &amp; 40+ banks</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`SkyRoute-payment-method-card ${paymentMethod === 'wallet' ? 'SkyRoute-payment-method-card--active' : ''}`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="SkyRoute-pm-header">
                    <span className="SkyRoute-pm-icon">👛</span>
                    {paymentMethod === 'wallet' ? (
                      <span className="SkyRoute-pm-badge">✓ SELECTED</span>
                    ) : (
                      <span className="SkyRoute-pm-radio-circle"></span>
                    )}
                  </div>
                  <div className="SkyRoute-pm-content">
                    <strong className="SkyRoute-pm-title">Wallets &amp; Postpaid</strong>
                    <span className="SkyRoute-pm-desc">Amazon Pay, Paytm, Mobikwik</span>
                  </div>
                </button>
              </div>

              {/* Tab 1: UPI Form & QR */}
              {paymentMethod === 'upi' && (
                <div className="SkyRoute-payment-tab-content">
                  <div className="SkyRoute-upi-grid">
                    <div className="SkyRoute-upi-left">
                      <div className="SkyRoute-form-group">
                        <label className="SkyRoute-field-label">Enter UPI ID / VPA *</label>
                        <div className="SkyRoute-upi-input-wrapper">
                          <input
                            type="text"
                            className="SkyRoute-text-input"
                            placeholder="yourname@okaxis"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setIsUpiVerified(false);
                            }}
                          />
                          <button
                            type="button"
                            className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                            onClick={handleVerifyUpi}
                          >
                            Verify VPA
                          </button>
                        </div>
                        {isUpiVerified && (
                          <span className="SkyRoute-coupon-success" style={{ marginTop: '4px' }}>
                            ✓ Verified VPA (Account Holder: Mahi Patel)
                          </span>
                        )}
                      </div>

                      <div className="SkyRoute-upi-apps-box">
                        <span className="SkyRoute-field-label" style={{ marginBottom: '6px', display: 'block' }}>
                          Popular UPI Apps Supported
                        </span>
                        <div className="SkyRoute-upi-apps-row">
                          <span className="SkyRoute-upi-app-badge">Google Pay</span>
                          <span className="SkyRoute-upi-app-badge">PhonePe</span>
                          <span className="SkyRoute-upi-app-badge">Paytm UPI</span>
                          <span className="SkyRoute-upi-app-badge">BHIM UPI</span>
                          <span className="SkyRoute-upi-app-badge">Cred UPI</span>
                        </div>
                      </div>

                      <p className="SkyRoute-upi-instructions">
                        ℹ️ A payment request for <strong>{formatINR(finalTotal)}</strong> will be sent to your UPI app. Please approve within 5 minutes.
                      </p>
                    </div>

                    <div className="SkyRoute-upi-right-qr">
                      <div className="SkyRoute-qr-box">
                        <svg viewBox="0 0 120 120" width="110" height="110">
                          <rect width="120" height="120" fill="#F5F7F2" rx="8" />
                          <rect x="10" y="10" width="30" height="30" fill="#173F3A" />
                          <rect x="15" y="15" width="20" height="20" fill="#F5F7F2" />
                          <rect x="80" y="10" width="30" height="30" fill="#173F3A" />
                          <rect x="85" y="15" width="20" height="20" fill="#F5F7F2" />
                          <rect x="10" y="80" width="30" height="30" fill="#173F3A" />
                          <rect x="15" y="85" width="20" height="20" fill="#F5F7F2" />
                          <rect x="50" y="50" width="20" height="20" fill="#4F7C73" />
                          <rect x="45" y="20" width="10" height="10" fill="#173F3A" />
                          <rect x="65" y="80" width="15" height="15" fill="#173F3A" />
                          <rect x="90" y="55" width="15" height="15" fill="#173F3A" />
                        </svg>
                        <span className="SkyRoute-qr-caption">Scan QR with any UPI App</span>
                        <span className="SkyRoute-badge SkyRoute-badge--teal">Instant Approval</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Credit / Debit Card Form with Live Card Preview */}
              {paymentMethod === 'card' && (
                <div className="SkyRoute-payment-tab-content">
                  <div className="SkyRoute-card-tab-layout">
                    {/* Live Realistic Card Mockup */}
                    <div className="SkyRoute-live-card-preview">
                      <div className="SkyRoute-live-card-top">
                        <span className="SkyRoute-live-card-bank">SkyRoute Secured</span>
                        <span className="SkyRoute-live-card-network">VISA</span>
                      </div>
                      <div className="SkyRoute-live-card-chip"></div>
                      <div className="SkyRoute-live-card-number">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="SkyRoute-live-card-bottom">
                        <div>
                          <span className="SkyRoute-card-sub-label">CARDHOLDER</span>
                          <strong className="SkyRoute-card-val">{cardName || 'YOUR NAME'}</strong>
                        </div>
                        <div>
                          <span className="SkyRoute-card-sub-label">EXPIRES</span>
                          <strong className="SkyRoute-card-val">{cardExpiry || 'MM/YY'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Card Form Grid */}
                    <div className="SkyRoute-form-grid">
                      <div className="SkyRoute-form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="SkyRoute-field-label">Card Number *</label>
                        <input
                          type="text"
                          className="SkyRoute-text-input"
                          placeholder="4532 •••• •••• ••••"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength="19"
                        />
                      </div>

                      <div className="SkyRoute-form-group">
                        <label className="SkyRoute-field-label">Expiry Date (MM/YY) *</label>
                        <input
                          type="text"
                          className="SkyRoute-text-input"
                          placeholder="08/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength="5"
                        />
                      </div>

                      <div className="SkyRoute-form-group">
                        <label className="SkyRoute-field-label">CVV / CVC (3-4 digits) *</label>
                        <input
                          type="password"
                          maxLength="4"
                          className="SkyRoute-text-input"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>

                      <div className="SkyRoute-form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="SkyRoute-field-label">Cardholder Full Name *</label>
                        <input
                          type="text"
                          className="SkyRoute-text-input"
                          placeholder="Name printed on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="SkyRoute-payment-tab-content">
                  <span className="SkyRoute-field-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Select Popular Bank
                  </span>
                  <div className="SkyRoute-bank-grid">
                    {[
                      { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
                      { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
                      { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
                      { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
                      { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
                      { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        className={`SkyRoute-bank-card-btn ${selectedBank === bank.id ? 'SkyRoute-bank-card-btn--active' : ''}`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <span className="SkyRoute-bank-badge">{bank.code}</span>
                        <span className="SkyRoute-bank-name">{bank.name}</span>
                        {selectedBank === bank.id && <span className="SkyRoute-bank-check">✓</span>}
                      </button>
                    ))}
                  </div>

                  <div className="SkyRoute-form-group" style={{ marginTop: '1.25rem' }}>
                    <label className="SkyRoute-field-label">Or Choose from All Other Banks</label>
                    <select
                      className="SkyRoute-select-input"
                      value={otherBank}
                      onChange={(e) => {
                        setOtherBank(e.target.value);
                        setSelectedBank('other');
                      }}
                    >
                      <option value="">-- Select from 45+ Net Banking Partners --</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="indusind">IndusInd Bank</option>
                      <option value="yes">Yes Bank</option>
                      <option value="idfc">IDFC FIRST Bank</option>
                      <option value="union">Union Bank of India</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 4: Wallets */}
              {paymentMethod === 'wallet' && (
                <div className="SkyRoute-payment-tab-content">
                  <span className="SkyRoute-field-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Select Digital Wallet Provider
                  </span>
                  <div className="SkyRoute-wallet-list">
                    {[
                      { id: 'phonepe', name: 'PhonePe Wallet', balance: '₹1,250.00', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm Wallet / Postpaid', balance: '₹480.00', icon: '🔵' },
                      { id: 'amazon', name: 'Amazon Pay Balance', balance: '₹2,100.00', icon: '🟠' },
                      { id: 'mobikwik', name: 'MobiKwik ZIP Pay Later', balance: '₹5,000.00', icon: '🔴' },
                    ].map((w) => (
                      <label
                        key={w.id}
                        className={`SkyRoute-wallet-card-option ${selectedWallet === w.id ? 'SkyRoute-wallet-card-option--active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="wallet"
                          checked={selectedWallet === w.id}
                          onChange={() => setSelectedWallet(w.id)}
                        />
                        <span className="SkyRoute-wallet-icon">{w.icon}</span>
                        <div className="SkyRoute-wallet-meta">
                          <strong>{w.name}</strong>
                          <span>Verified balance: {w.balance}</span>
                        </div>
                        {selectedWallet === w.id && (
                          <span className="SkyRoute-badge SkyRoute-badge--success" style={{ marginLeft: 'auto' }}>
                            SELECTED
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code Box */}
            <div className="SkyRoute-coupon-card SkyRoute-card">
              <span className="SkyRoute-coupon-icon">🏷️</span>
              <div className="SkyRoute-coupon-body">
                <strong className="SkyRoute-coupon-title">Have a promo or coupon code?</strong>
                <form className="SkyRoute-coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    className="SkyRoute-coupon-input"
                    placeholder="Enter Coupon (e.g. SKYDOM500 or FLYINTL2500)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button type="submit" className="SkyRoute-btn SkyRoute-btn--secondary SkyRoute-btn--sm">
                    Apply Coupon
                  </button>
                </form>
                {appliedCoupon && !couponError && (
                  <span className="SkyRoute-coupon-success">
                    ✓ Applied {appliedCoupon}: {discountAmount > 0 ? `Saved ${formatINR(discountAmount)} on your total fare` : 'Active'}
                  </span>
                )}
                {couponError && <span className="SkyRoute-field-error">{couponError}</span>}
              </div>
            </div>

            {/* Pay Button & Back Action */}
            <div className="SkyRoute-payment-actions">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline"
                onClick={onBackToPassengerDetails}
                disabled={isProcessing}
              >
                &larr; Back to Travellers
              </button>

              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg SkyRoute-pay-btn"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="SkyRoute-loading-spinner-inline"></span>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Pay {formatINR(finalTotal)} &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="SkyRoute-review-layout__sidebar">
            <FlightSidebarSummary
              flight={selectedFlight}
              searchData={searchData}
              selectedSeat={selectedSeat}
              insurancePrice={insuranceFee}
              discountAmount={discountAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;
