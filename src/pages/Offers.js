import React, { useState } from 'react';
import { OFFERS_DATA } from '../data/travelData';
import { useToast } from '../context/ToastContext';

const Offers = ({ onNavigate, onSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const { showToast } = useToast();

  const categories = [
    { id: 'all', label: 'All Offers' },
    { id: 'domestic', label: 'Domestic Flights' },
    { id: 'international', label: 'International Flights' },
    { id: 'bank', label: 'Bank & Card Deals' },
    { id: 'student', label: 'Student Specials' },
    { id: 'seasonal', label: 'Holiday & Seasonal' }
  ];

  const filteredOffers = OFFERS_DATA.filter((o) =>
    selectedCategory === 'all' ? true : o.category === selectedCategory
  );

  const handleCopyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast(`Promo code ${code} copied successfully!`, 'success');
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleApplyOffer = (offer) => {
    handleCopyCode(offer.code);
    if (onNavigate) onNavigate('/flights');
  };

  return (
    <div className="SkyRoute-offers-page">
      <div className="SkyRoute-container">
        {/* Header Title */}
        <div className="SkyRoute-section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <span className="SkyRoute-badge SkyRoute-badge--teal">EXCLUSIVE PROMOTIONS</span>
            <h1 className="SkyRoute-section-header__title" style={{ marginTop: '0.5rem' }}>
              Travel Deals &amp; Promo Coupons
            </h1>
            <p className="SkyRoute-section-header__subtitle">
              Save more on domestic and international air tickets with bank cashbacks, seasonal discounts, and student perks.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="SkyRoute-offers-categories-bar">
          <div className="SkyRoute-offers-categories-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`SkyRoute-cat-pill-btn ${selectedCategory === cat.id ? 'SkyRoute-cat-pill-btn--active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="SkyRoute-offers-grid">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="SkyRoute-offer-card SkyRoute-card">
              <div className="SkyRoute-offer-card__header">
                <span className="SkyRoute-badge SkyRoute-badge--teal">{offer.tag}</span>
                <span className="SkyRoute-offer-card__valid">Valid till: {offer.validTill}</span>
              </div>

              <div className="SkyRoute-offer-card__body">
                <div className="SkyRoute-offer-discount-pill">{offer.discount}</div>
                <h3 className="SkyRoute-offer-card__title">{offer.title}</h3>
                <p className="SkyRoute-offer-card__desc">{offer.description}</p>
                <div className="SkyRoute-offer-card__terms-box">
                  <span>Terms: {offer.terms}</span>
                </div>
              </div>

              <div className="SkyRoute-offer-card__footer">
                <div className="SkyRoute-coupon-code-box">
                  <span className="SkyRoute-coupon-code-label">PROMO CODE</span>
                  <strong className="SkyRoute-coupon-code-value">{offer.code}</strong>
                </div>

                <div className="SkyRoute-offer-btn-group">
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                    onClick={() => handleCopyCode(offer.code)}
                  >
                    {copiedCode === offer.code ? '✓ Copied' : 'Copy Promo Code'}
                  </button>
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                    onClick={() => handleApplyOffer(offer)}
                  >
                    Apply &amp; Search Flights &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
