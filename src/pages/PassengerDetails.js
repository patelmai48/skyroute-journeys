import React, { useState } from 'react';
import FlightSidebarSummary from '../components/FlightSidebarSummary';
import SeatSelection from '../components/SeatSelection';
import { INSURANCE_PLANS } from '../data/travelData';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\s\-()]{7,16}$/;

const PassengerDetails = ({
  selectedFlight,
  searchData,
  passengerData,
  setPassengerData,
  selectedSeat,
  setSelectedSeat,
  selectedInsurance,
  setSelectedInsurance,
  onBackToDetails,
  onContinue,
}) => {
  const passengerCount = Math.max(1, Number(searchData?.passengers) || 1);

  const [passengers, setPassengers] = useState(() => {
    if (Array.isArray(passengerData) && passengerData.length === passengerCount) {
      return passengerData;
    }
    return Array.from({ length: passengerCount }, (_, i) => ({
      id: `p-${i + 1}`,
      firstName: i === 0 ? 'Mahi' : '',
      lastName: i === 0 ? 'Patel' : '',
      dateOfBirth: i === 0 ? '1998-05-14' : '',
      gender: 'female',
      govtIdType: 'Aadhaar Card',
      govtIdNumber: i === 0 ? '9876 5432 1098' : '',
      email: i === 0 ? 'mahi.patel@example.com' : undefined,
      phone: i === 0 ? '+91 98765 43210' : undefined,
    }));
  });

  const [insuranceChoice, setInsuranceChoice] = useState(selectedInsurance || 'standard');
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
    if (setPassengerData) setPassengerData(updated);

    // Clear field error
    if (errors[`${index}_${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`${index}_${field}`];
        return next;
      });
    }
  };

  const handleInsuranceChange = (planId) => {
    setInsuranceChoice(planId);
    if (setSelectedInsurance) setSelectedInsurance(planId);
  };

  const validate = () => {
    const newErrors = {};

    passengers.forEach((p, idx) => {
      if (!p.firstName || !p.firstName.trim()) {
        newErrors[`${idx}_firstName`] = 'First name is required.';
      }
      if (!p.lastName || !p.lastName.trim()) {
        newErrors[`${idx}_lastName`] = 'Last name is required.';
      }
      if (!p.dateOfBirth) {
        newErrors[`${idx}_dateOfBirth`] = 'Date of birth is required.';
      }
      if (!p.govtIdNumber || !p.govtIdNumber.trim()) {
        newErrors[`${idx}_govtIdNumber`] = 'Government ID / Passport number is required.';
      }

      if (idx === 0) {
        if (!p.email || !EMAIL_REGEX.test(p.email)) {
          newErrors[`${idx}_email`] = 'Please enter a valid email address.';
        }
        if (!p.phone || !PHONE_REGEX.test(p.phone)) {
          newErrors[`${idx}_phone`] = 'Please enter a valid mobile number.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (validate()) {
      if (setPassengerData) setPassengerData(passengers);
      if (setSelectedInsurance) setSelectedInsurance(insuranceChoice);
      if (onContinue) onContinue();
    } else {
      // Scroll to first error
      const firstErrorEl = document.querySelector('.SkyRoute-field-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="SkyRoute-passenger-page">
      <div className="SkyRoute-container">
        {/* Step Indicator */}
        <div className="SkyRoute-booking-steps-bar">
          <div className="SkyRoute-step-item SkyRoute-step-item--completed">
            <span className="SkyRoute-step-num">✓</span>
            <span>1. Flight Selected</span>
          </div>
          <div
            className="SkyRoute-step-item SkyRoute-step-item--completed"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowSeatMap(!showSeatMap)}
            title="Click to view or change seat"
          >
            <span className="SkyRoute-step-num">💺</span>
            <span>2. Seat: {selectedSeat?.id || '14A'} ({showSeatMap ? 'Close Map ▲' : 'Change ▼'})</span>
          </div>
          <div className="SkyRoute-step-item SkyRoute-step-item--active">
            <span className="SkyRoute-step-num">3</span>
            <span>3. Traveller Info</span>
          </div>
          <div className="SkyRoute-step-item">
            <span className="SkyRoute-step-num">4</span>
            <span>4. Payment &amp; Confirmation</span>
          </div>
        </div>

        <div className="SkyRoute-passenger-layout">
          {/* Main Form Area */}
          <div className="SkyRoute-passenger-layout__main">
            <form onSubmit={handleSubmit} noValidate>
              <div className="SkyRoute-passenger-page-header">
                <span className="SkyRoute-badge SkyRoute-badge--teal">STEP 3 OF 4</span>
                <h1 className="SkyRoute-passenger-page-title">Traveller Details</h1>
                <p className="SkyRoute-passenger-page-subtitle">
                  Please enter passenger names exactly as they appear on official government-issued ID or passport.
                </p>
              </div>

              {formSubmitted && Object.keys(errors).length > 0 && (
                <div className="SkyRoute-form-alert-banner">
                  <span>⚠️ Please fill in all required traveller fields marked with red below before continuing to payment.</span>
                </div>
              )}

              {/* Passenger Cards */}
              <div className="SkyRoute-traveller-cards-stack">
                {passengers.map((p, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={p.id}
                      className={`SkyRoute-traveller-card SkyRoute-card ${
                        isPrimary ? 'SkyRoute-traveller-card--primary' : ''
                      }`}
                    >
                      <div className="SkyRoute-traveller-card__header">
                        <div className="SkyRoute-traveller-card__title-row">
                          <span className="SkyRoute-traveller-badge-icon">
                            {isPrimary ? '👑' : '👤'}
                          </span>
                          <div>
                            <h3 className="SkyRoute-traveller-title">
                              {isPrimary ? 'Traveller 1 — Primary Contact' : `Traveller ${idx + 1}`}
                            </h3>
                            <span className="SkyRoute-traveller-sub">
                              Adult Passenger &bull; {searchData?.cabinClass || 'Economy Class'}
                            </span>
                          </div>
                        </div>
                        {isPrimary && (
                          <span className="SkyRoute-badge SkyRoute-badge--navy">Primary Lead</span>
                        )}
                      </div>

                      <div className="SkyRoute-traveller-card__body">
                        <div className="SkyRoute-form-grid-2col">
                          {/* First Name */}
                          <div className="SkyRoute-form-group">
                            <label className="SkyRoute-field-label">
                              First &amp; Middle Name <span className="SkyRoute-req-star">*</span>
                            </label>
                            <input
                              type="text"
                              className={`SkyRoute-text-input ${
                                errors[`${idx}_firstName`] ? 'SkyRoute-text-input--error' : ''
                              }`}
                              placeholder="e.g. Mahi"
                              value={p.firstName}
                              onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                            />
                            {errors[`${idx}_firstName`] && (
                              <span className="SkyRoute-field-error">
                                ⚠ {errors[`${idx}_firstName`]}
                              </span>
                            )}
                          </div>

                          {/* Last Name */}
                          <div className="SkyRoute-form-group">
                            <label className="SkyRoute-field-label">
                              Last Name <span className="SkyRoute-req-star">*</span>
                            </label>
                            <input
                              type="text"
                              className={`SkyRoute-text-input ${
                                errors[`${idx}_lastName`] ? 'SkyRoute-text-input--error' : ''
                              }`}
                              placeholder="e.g. Patel"
                              value={p.lastName}
                              onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                            />
                            {errors[`${idx}_lastName`] && (
                              <span className="SkyRoute-field-error">
                                ⚠ {errors[`${idx}_lastName`]}
                              </span>
                            )}
                          </div>

                          {/* Gender */}
                          <div className="SkyRoute-form-group">
                            <label className="SkyRoute-field-label">
                              Gender <span className="SkyRoute-req-star">*</span>
                            </label>
                            <select
                              className="SkyRoute-select-input"
                              value={p.gender}
                              onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                            >
                              <option value="female">Female</option>
                              <option value="male">Male</option>
                              <option value="other">Other / Non-Binary</option>
                            </select>
                          </div>

                          {/* Date of Birth */}
                          <div className="SkyRoute-form-group">
                            <label className="SkyRoute-field-label">
                              Date of Birth <span className="SkyRoute-req-star">*</span>
                            </label>
                            <input
                              type="date"
                              className={`SkyRoute-text-input ${
                                errors[`${idx}_dateOfBirth`] ? 'SkyRoute-text-input--error' : ''
                              }`}
                              value={p.dateOfBirth}
                              onChange={(e) => handlePassengerChange(idx, 'dateOfBirth', e.target.value)}
                              max={new Date().toISOString().split('T')[0]}
                            />
                            {errors[`${idx}_dateOfBirth`] && (
                              <span className="SkyRoute-field-error">
                                ⚠ {errors[`${idx}_dateOfBirth`]}
                              </span>
                            )}
                          </div>

                          {/* Govt ID Type */}
                          <div className="SkyRoute-form-group">
                            <label className="SkyRoute-field-label">
                              Government ID Type <span className="SkyRoute-req-star">*</span>
                            </label>
                            <select
                              className="SkyRoute-select-input"
                              value={p.govtIdType || 'Aadhaar Card'}
                              onChange={(e) => handlePassengerChange(idx, 'govtIdType', e.target.value)}
                            >
                              <option value="Aadhaar Card">Aadhaar Card</option>
                              <option value="Passport">Passport</option>
                              <option value="Voter ID">Voter ID</option>
                              <option value="Driving License">Driving License</option>
                            </select>
                          </div>

                          {/* Govt ID Number */}
                          <div className="SkyRoute-form-group">
                            <label className="SkyRoute-field-label">
                              Government ID / Passport Number <span className="SkyRoute-req-star">*</span>
                            </label>
                            <input
                              type="text"
                              className={`SkyRoute-text-input ${
                                errors[`${idx}_govtIdNumber`] ? 'SkyRoute-text-input--error' : ''
                              }`}
                              placeholder="e.g. 9876 5432 1098 / Z1234567"
                              value={p.govtIdNumber}
                              onChange={(e) => handlePassengerChange(idx, 'govtIdNumber', e.target.value)}
                            />
                            {errors[`${idx}_govtIdNumber`] && (
                              <span className="SkyRoute-field-error">
                                ⚠ {errors[`${idx}_govtIdNumber`]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact Details for Primary Passenger */}
                        {isPrimary && (
                          <div className="SkyRoute-contact-details-box">
                            <div className="SkyRoute-contact-details-box__header">
                              <span className="SkyRoute-contact-icon">📬</span>
                              <div>
                                <h4 className="SkyRoute-contact-details-title">
                                  E-Ticket &amp; Flight SMS Updates
                                </h4>
                                <span className="SkyRoute-contact-details-sub">
                                  Your boarding pass, delay alerts, and gate changes will be sent here.
                                </span>
                              </div>
                            </div>

                            <div className="SkyRoute-form-grid-2col">
                              <div className="SkyRoute-form-group">
                                <label className="SkyRoute-field-label">
                                  Email Address <span className="SkyRoute-req-star">*</span>
                                </label>
                                <input
                                  type="email"
                                  className={`SkyRoute-text-input ${
                                    errors[`${idx}_email`] ? 'SkyRoute-text-input--error' : ''
                                  }`}
                                  placeholder="name@example.com"
                                  value={p.email || ''}
                                  onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                                />
                                {errors[`${idx}_email`] && (
                                  <span className="SkyRoute-field-error">
                                    ⚠ {errors[`${idx}_email`]}
                                  </span>
                                )}
                              </div>

                              <div className="SkyRoute-form-group">
                                <label className="SkyRoute-field-label">
                                  Mobile Phone Number <span className="SkyRoute-req-star">*</span>
                                </label>
                                <input
                                  type="tel"
                                  className={`SkyRoute-text-input ${
                                    errors[`${idx}_phone`] ? 'SkyRoute-text-input--error' : ''
                                  }`}
                                  placeholder="+91 98765 43210"
                                  value={p.phone || ''}
                                  onChange={(e) => handlePassengerChange(idx, 'phone', e.target.value)}
                                />
                                {errors[`${idx}_phone`] && (
                                  <span className="SkyRoute-field-error">
                                    ⚠ {errors[`${idx}_phone`]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seat Selection Interactive Section */}
              {showSeatMap ? (
                <div style={{ marginBottom: '2rem' }}>
                  <SeatSelection
                    selectedSeat={selectedSeat}
                    onSelectSeat={(seat) => {
                      if (setSelectedSeat) setSelectedSeat(seat);
                    }}
                    onConfirm={() => setShowSeatMap(false)}
                    flight={selectedFlight}
                    passengerCount={passengerCount}
                  />
                </div>
              ) : (
                <div
                  className="SkyRoute-card"
                  style={{
                    padding: '1.25rem 1.75rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    backgroundColor: '#173F3A',
                    border: '1.5px solid #4F7C73',
                    borderRadius: '12px'
                  }}
                >
                  <div>
                    <span className="SkyRoute-badge SkyRoute-badge--teal" style={{ marginBottom: '0.4rem' }}>
                      SEAT SELECTION
                    </span>
                    <h3 style={{ margin: 0, color: '#F5F7F2', fontSize: '1.1rem' }}>
                      Seat {selectedSeat?.id || '14A'} &bull; {selectedSeat?.type || 'Window'} ({selectedSeat?.category || 'Standard Window'})
                    </h3>
                    <p style={{ margin: '0.25rem 0 0', color: '#F5F7F2', fontSize: '0.88rem' }}>
                      {selectedSeat?.price ? `Seat Add-on Fee: ₹${selectedSeat.price.toLocaleString('en-IN')}` : 'Complimentary Selection'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--teal SkyRoute-btn--sm"
                    onClick={() => setShowSeatMap(true)}
                  >
                    💺 Choose / Change Seat
                  </button>
                </div>
              )}

              {/* Travel Insurance Add-on Section */}
              <div className="SkyRoute-insurance-selector-card SkyRoute-card">
                <div className="SkyRoute-insurance-selector-header">
                  <span className="SkyRoute-badge SkyRoute-badge--teal">PROTECTION ADD-ON</span>
                  <h2 className="SkyRoute-insurance-selector-title">
                    🛡️ Secure Your Journey with Travel Insurance
                  </h2>
                  <p className="SkyRoute-insurance-selector-sub">
                    Get full coverage for flight delays, lost baggage, medical emergencies, and unexpected trip cancellations.
                  </p>
                </div>

                {/* 3 Selectable Plan Cards Grid */}
                <div className="SkyRoute-insurance-plans-grid">
                  {INSURANCE_PLANS.map((plan) => {
                    const isSelected = insuranceChoice === plan.id;
                    return (
                      <div
                        key={plan.id}
                        className={`SkyRoute-insurance-plan-box ${
                          isSelected ? 'SkyRoute-insurance-plan-box--selected' : ''
                        }`}
                        onClick={() => handleInsuranceChange(plan.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleInsuranceChange(plan.id);
                          }
                        }}
                      >
                        <div className="SkyRoute-insurance-plan-box__top">
                          <div className="SkyRoute-insurance-plan-box__radio-wrap">
                            <input
                              type="radio"
                              name="insurancePlanChoice"
                              checked={isSelected}
                              onChange={() => handleInsuranceChange(plan.id)}
                            />
                            <div>
                              <strong className="SkyRoute-insurance-plan-name">{plan.name}</strong>
                              <span className="SkyRoute-badge SkyRoute-insurance-plan-badge">
                                {plan.badge}
                              </span>
                            </div>
                          </div>
                          <div className="SkyRoute-insurance-plan-price-tag">
                            +₹{plan.price}
                          </div>
                        </div>

                        <div className="SkyRoute-insurance-coverage-line">
                          Coverage up to <strong>{plan.coverage}</strong>
                        </div>

                        <ul className="SkyRoute-insurance-features-list">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="SkyRoute-insurance-feature-item">
                              <span className="SkyRoute-check-icon">✓</span> {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="SkyRoute-insurance-plan-action">
                          <span className="SkyRoute-insurance-select-label">
                            {isSelected ? '✓ Selected Plan' : 'Select This Plan'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clearly Separated Opt-Out Card */}
                <div
                  className={`SkyRoute-insurance-opt-out-card ${
                    insuranceChoice === 'none' ? 'SkyRoute-insurance-opt-out-card--selected' : ''
                  }`}
                  onClick={() => handleInsuranceChange('none')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleInsuranceChange('none');
                    }
                  }}
                >
                  <div className="SkyRoute-insurance-opt-out-left">
                    <input
                      type="radio"
                      name="insurancePlanChoice"
                      checked={insuranceChoice === 'none'}
                      onChange={() => handleInsuranceChange('none')}
                    />
                    <div>
                      <strong className="SkyRoute-opt-out-title">I will risk my travel (No Insurance)</strong>
                      <p className="SkyRoute-opt-out-sub">
                        I understand I will not receive medical reimbursement, trip delay cover, or lost baggage compensation.
                      </p>
                    </div>
                  </div>
                  <span className="SkyRoute-opt-out-price">₹0</span>
                </div>
              </div>

              {/* Form Navigation Actions */}
              <div className="SkyRoute-passenger-actions">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--outline"
                  onClick={onBackToDetails}
                >
                  &larr; Back to Flight Details
                </button>
                <button
                  type="submit"
                  className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg SkyRoute-continue-pay-btn"
                >
                  Continue to Payment &rarr;
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar Summary */}
          <div className="SkyRoute-passenger-layout__sidebar">
            <FlightSidebarSummary
              flight={selectedFlight}
              searchData={searchData}
              selectedSeat={selectedSeat}
              insurancePrice={
                insuranceChoice === 'none'
                  ? 0
                  : INSURANCE_PLANS.find((p) => p.id === insuranceChoice)?.price || 449
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
