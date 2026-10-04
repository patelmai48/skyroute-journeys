import React from 'react';

const BaggageInfo = () => {
  return (
    <div className="SkyRoute-card SkyRoute-baggage-card">
      <h3 className="SkyRoute-baggage-card__title">Baggage Allowance</h3>

      <div className="SkyRoute-baggage-card__grid">
        {/* Checked Baggage */}
        <div className="SkyRoute-baggage-card__item">
          <div className="SkyRoute-baggage-card__icon-box">🧳</div>
          <div className="SkyRoute-baggage-card__content">
            <span className="SkyRoute-baggage-card__name">Checked Baggage</span>
            <span className="SkyRoute-baggage-card__limit">15 kg (1 piece per adult)</span>
            <span className="SkyRoute-baggage-card__desc">Included in standard fare</span>
          </div>
        </div>

        {/* Cabin Baggage */}
        <div className="SkyRoute-baggage-card__item">
          <div className="SkyRoute-baggage-card__icon-box">🎒</div>
          <div className="SkyRoute-baggage-card__content">
            <span className="SkyRoute-baggage-card__name">Cabin Baggage</span>
            <span className="SkyRoute-baggage-card__limit">7 kg (Overhead bin)</span>
            <span className="SkyRoute-baggage-card__desc">+ 1 small laptop bag / purse</span>
          </div>
        </div>
      </div>

      <div className="SkyRoute-baggage-card__footer-note">
        <span>⚠️ Additional baggage or excess weight may incur standard airport surcharges.</span>
      </div>
    </div>
  );
};

export default BaggageInfo;
