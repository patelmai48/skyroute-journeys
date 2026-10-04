import React, { useState } from 'react';
import { INSURANCE_PLANS } from '../data/travelData';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const TravelInsurance = ({ onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const activePlanObj = INSURANCE_PLANS.find((p) => p.id === selectedPlan) || INSURANCE_PLANS[1];

  const handlePurchase = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3500);
  };

  return (
    <div className="SkyRoute-insurance-page">
      <div className="SkyRoute-container">
        {/* Header */}
        <div className="SkyRoute-section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <span className="SkyRoute-section-header__tag">COMPREHENSIVE COVERAGE</span>
            <h1 className="SkyRoute-section-header__title">SkyRoute Travel Insurance</h1>
            <p className="SkyRoute-section-header__subtitle">
              Fly worry-free with instant protection against flight delays, lost baggage, medical emergencies, and unexpected trip cancellations.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {showConfirmation && (
          <div className="SkyRoute-alert-banner SkyRoute-alert-banner--success" role="alert">
            <span className="SkyRoute-alert-banner__icon">✓</span>
            <div className="SkyRoute-alert-banner__content">
              Policy activated for {activePlanObj.name}! Certificate of Insurance has been sent to your registered email.
            </div>
          </div>
        )}

        {/* Insurance Plans Comparison Grid */}
        <div className="SkyRoute-insurance-cards-grid">
          {INSURANCE_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`SkyRoute-ins-plan-card SkyRoute-card ${plan.popular ? 'SkyRoute-ins-plan-card--popular' : ''} ${isSelected ? 'SkyRoute-ins-plan-card--selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
                role="button"
                tabIndex={0}
              >
                {plan.popular && (
                  <div className="SkyRoute-ins-popular-tag">MOST POPULAR</div>
                )}

                <div className="SkyRoute-ins-card-header">
                  <div className="SkyRoute-ins-badge-row">
                    <span className="SkyRoute-badge SkyRoute-badge--teal">{plan.badge}</span>
                  </div>
                  <h3 className="SkyRoute-ins-plan-name">{plan.name}</h3>
                  <div className="SkyRoute-ins-price-row">
                    <strong className="SkyRoute-ins-price-amount">{formatINR(plan.price)}</strong>
                    <span className="SkyRoute-ins-price-sub">/ passenger</span>
                  </div>
                  <div className="SkyRoute-ins-coverage-pill">
                    <span>Medical Cover:</span>
                    <strong>{plan.coverage}</strong>
                  </div>
                </div>

                <div className="SkyRoute-ins-features-list">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="SkyRoute-ins-feature-row">
                      <span className="SkyRoute-ins-check">✓</span>
                      <span className="SkyRoute-ins-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="SkyRoute-ins-card-footer">
                  <button
                    type="button"
                    className={`SkyRoute-btn SkyRoute-btn--full ${isSelected ? 'SkyRoute-btn--primary' : 'SkyRoute-btn--outline'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                      handlePurchase();
                    }}
                  >
                    {isSelected ? 'Select & Activate Policy' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Details Table */}
        <div className="SkyRoute-ins-matrix-card SkyRoute-card">
          <h3 className="SkyRoute-ins-matrix-title">Detailed Feature Matrix</h3>
          <div className="SkyRoute-comparison-table-wrapper">
            <table className="SkyRoute-comparison-table">
              <thead>
                <tr>
                  <th>Coverage Feature</th>
                  <th>Basic Shield (₹199)</th>
                  <th>SkyRoute Comprehensive (₹449)</th>
                  <th>Elite Global (₹899)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Emergency Medical Cover</td>
                  <td>₹1,00,000</td>
                  <td>₹5,00,000</td>
                  <td>₹25,00,000</td>
                </tr>
                <tr>
                  <td>Trip Cancellation</td>
                  <td>-</td>
                  <td>Up to ₹25,000</td>
                  <td>Up to ₹50,000</td>
                </tr>
                <tr>
                  <td>Baggage Loss &amp; Delay</td>
                  <td>₹10,000</td>
                  <td>₹30,000</td>
                  <td>₹60,000</td>
                </tr>
                <tr>
                  <td>Flight Delay Reimbursement</td>
                  <td>₹3,000 (after 6h)</td>
                  <td>₹6,000 (after 3h)</td>
                  <td>₹10,000 (after 2h) + VIP Lounge</td>
                </tr>
                <tr>
                  <td>24/7 Global Assistance</td>
                  <td>✓ Phone support</td>
                  <td>✓ Priority Concierge</td>
                  <td>✓ Dedicated Care Agent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelInsurance;
