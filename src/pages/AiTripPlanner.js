import React, { useState } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { useToast } from '../context/ToastContext';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const AiTripPlanner = ({ onNavigate, onSearch }) => {
  const [fromCity, setFromCity] = useState('Ahmedabad (AMD)');
  const [destination, setDestination] = useState('Dubai (DXB)');
  const [budget, setBudget] = useState('30000');
  const [durationDays, setDurationDays] = useState('5');
  const [travellers, setTravellers] = useState('2');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState([
    'Beaches',
    'Food & Culinary',
    'Sightseeing & Heritage'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const { showToast } = useToast();

  const interestOptions = [
    'Beaches',
    'Sightseeing & Heritage',
    'Food & Culinary',
    'Adventure & Sports',
    'Relaxation & Spa',
    'Nightlife & Cafes',
    'Shopping & Souvenirs',
    'Nature & Mountains'
  ];

  const toggleInterest = (item) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleGeneratePlan = (e) => {
    e.preventDefault();

    const numericBudget = parseFloat(budget);
    if (isNaN(numericBudget) || numericBudget <= 0) {
      showToast('Please enter a valid budget amount.', 'error');
      return;
    }

    setIsGenerating(true);

    const destClean = destination.split('(')[0].trim();
    const matchedDest =
      DESTINATIONS.find((d) => d.name.toLowerCase().includes(destClean.toLowerCase())) ||
      DESTINATIONS[0];

    const daysCount = parseInt(durationDays, 10) || 5;
    const travellersCount = parseInt(travellers, 10) || 2;
    const totalBudget = numericBudget;

    setTimeout(() => {
      setIsGenerating(false);

      const flightCost = matchedDest.price * travellersCount;
      const hotelCost = Math.round(totalBudget * 0.35);
      const foodCost = Math.round(totalBudget * 0.22);
      const transportCost = Math.round(totalBudget * 0.12);
      const activitiesCost = Math.round(totalBudget * 0.16);
      const totalSpent = flightCost + hotelCost + foodCost + transportCost + activitiesCost;
      const remaining = Math.max(0, totalBudget - totalSpent);

      const planItinerary = [
        {
          day: 1,
          title: `Arrival in ${matchedDest.name} & City Orientation`,
          morning: `Board morning flight from ${fromCity} to ${matchedDest.name} (${matchedDest.code}). Check into your accommodation and settle in.`,
          afternoon: `Enjoy lunch at a seaside café and explore the surrounding neighborhood at an easy pace.`,
          evening: `Sunset observation walk along the iconic promenade followed by authentic local delicacies.`,
          diningTip: `Try the local specialty tasting platter at the city center.`
        },
        {
          day: 2,
          title: `Signature Landmarks & Cultural Heritage`,
          morning: `Early entry tour to world-renowned heritage sites and architectural landmarks.`,
          afternoon: `Wander through traditional bazaars and artisan markets for authentic souvenirs.`,
          evening: `Scenic twilight cruise along the river / waterfront with live music.`,
          diningTip: `Reserved dinner table featuring regional culinary highlights.`
        },
        {
          day: 3,
          title: `Adventure Activities & Scenic Excursions`,
          morning: `Guided outdoor adventure excursion or wildlife/desert safari experience.`,
          afternoon: `Panoramic viewpoint visit followed by leisure shopping at famous local arcades.`,
          evening: `Rooftop lounge dinner overlooking the illuminated city skyline.`,
          diningTip: `Handcrafted cocktails and fusion appetizers at high-altitude terrace.`
        },
        {
          day: 4,
          title: `Hidden Gems & Culinary Exploration`,
          morning: `Peaceful visit to botanical gardens or serene local cultural sanctuaries.`,
          afternoon: `Curated street food walking tour covering legendary neighborhood eateries.`,
          evening: `Relaxing spa treatment or beach club sunset session.`,
          diningTip: `Fresh seafood and local dessert delicacies.`
        }
      ];

      if (daysCount >= 5) {
        planItinerary.push({
          day: 5,
          title: `Leisure Morning & Return Flight`,
          morning: `Slow morning breakfast buffet and final photography session.`,
          afternoon: `Transfer to airport for departure back to ${fromCity}.`,
          evening: `Arrive safely home carrying unforgettable travel memories.`,
          diningTip: `Complimentary refreshments at the airport departure lounge.`
        });
      }

      setGeneratedPlan({
        destination: matchedDest,
        days: daysCount,
        travellers: travellersCount,
        style: travelStyle,
        totalBudget,
        totalSpent,
        remaining,
        flightSuggestion: {
          airline: 'IndiGo / Air India Express',
          route: `${fromCity} ➔ ${matchedDest.name} (${matchedDest.code})`,
          farePerPerson: matchedDest.price,
          totalFlightFare: flightCost
        },
        hotelSuggestion: matchedDest.popularHotels?.[0] || {
          name: `${matchedDest.name} Grand Palace Resort`,
          rating: 4.9,
          price: Math.round(hotelCost / daysCount),
          type: '4-Star Premium Hotel'
        },
        itinerary: planItinerary,
        categories: [
          {
            icon: '✈️',
            name: 'Flights',
            amount: flightCost,
            pct: Math.min(100, Math.round((flightCost / totalBudget) * 100)),
            barColor: 'var(--SkyRoute-navy)'
          },
          {
            icon: '🏨',
            name: 'Hotel & Stay',
            amount: hotelCost,
            pct: Math.min(100, Math.round((hotelCost / totalBudget) * 100)),
            barColor: 'var(--SkyRoute-teal)'
          },
          {
            icon: '🍽️',
            name: 'Food & Dining',
            amount: foodCost,
            pct: Math.min(100, Math.round((foodCost / totalBudget) * 100)),
            barColor: '#B2967D'
          },
          {
            icon: '🚕',
            name: 'Local Transport',
            amount: transportCost,
            pct: Math.min(100, Math.round((transportCost / totalBudget) * 100)),
            barColor: '#7D5A44'
          },
          {
            icon: '🎟️',
            name: 'Sightseeing & Activities',
            amount: activitiesCost,
            pct: Math.min(100, Math.round((activitiesCost / totalBudget) * 100)),
            barColor: 'var(--SkyRoute-rose)'
          }
        ]
      });

      showToast('AI Itinerary generated successfully!', 'success');
    }, 600);
  };

  const handleCopyItinerary = () => {
    if (!generatedPlan) return;
    const text = `SkyRoute AI Itinerary: ${generatedPlan.days}-Day Escape to ${generatedPlan.destination.name}\nBudget: ${formatINR(generatedPlan.totalBudget)}\nTravellers: ${generatedPlan.travellers}\n\nSchedule:\n${generatedPlan.itinerary
      .map((d) => `Day ${d.day}: ${d.title}\n• Morning: ${d.morning}\n• Afternoon: ${d.afternoon}\n• Evening: ${d.evening}\n• Dining Tip: ${d.diningTip}`)
      .join('\n\n')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Itinerary copied to clipboard!', 'success');
    }
  };

  const handleBookFlightsFromPlan = () => {
    if (onSearch && generatedPlan) {
      onSearch({
        origin: fromCity,
        destination: `${generatedPlan.destination.name} (${generatedPlan.destination.code})`,
        tripType: 'round-trip',
        departureDate: new Date(),
        returnDate: new Date(Date.now() + generatedPlan.days * 24 * 60 * 60 * 1000),
        passengers: generatedPlan.travellers,
        cabinClass: 'Economy'
      });
    }
  };

  return (
    <div className="SkyRoute-ai-planner-page">
      <div className="SkyRoute-container">
        {/* Header Title */}
        <div className="SkyRoute-section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <span className="SkyRoute-badge SkyRoute-badge--teal">SMART ITINERARY GENERATOR</span>
            <h1 className="SkyRoute-section-header__title" style={{ marginTop: '0.5rem' }}>
              AI Travel Planner
            </h1>
            <p className="SkyRoute-section-header__subtitle">
              Input your trip parameters, budget, and travel preferences to generate a complete custom day-by-day itinerary with flight &amp; hotel suggestions.
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="SkyRoute-ai-form-card SkyRoute-card">
          <form onSubmit={handleGeneratePlan} noValidate>
            <div className="SkyRoute-ai-form-grid">
              {/* Departure */}
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Departure City (From)</label>
                <select
                  className="SkyRoute-select-input"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                >
                  <option value="Ahmedabad (AMD)">Ahmedabad (AMD)</option>
                  <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                  <option value="Delhi (DEL)">Delhi (DEL)</option>
                  <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                </select>
              </div>

              {/* Destination */}
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Destination (To)</label>
                <select
                  className="SkyRoute-select-input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={`${d.name} (${d.code})`}>
                      {d.name} ({d.code}) &ndash; {d.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget - Proper editable number input allowing any amount */}
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Total Budget (₹)</label>
                <input
                  type="number"
                  className="SkyRoute-text-input"
                  placeholder="e.g. 5000, 30045, 125000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="1000"
                  step="500"
                  required
                />
              </div>

              {/* Duration in Days */}
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Trip Duration</label>
                <select
                  className="SkyRoute-select-input"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                >
                  <option value="3">3 Days (Weekend Getaway)</option>
                  <option value="4">4 Days (Short Vacation)</option>
                  <option value="5">5 Days (Standard Holiday)</option>
                  <option value="7">7 Days (Full Week Escape)</option>
                </select>
              </div>

              {/* Number of Travellers */}
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Passengers / Travellers</label>
                <select
                  className="SkyRoute-select-input"
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                >
                  <option value="1">1 Solo Traveller</option>
                  <option value="2">2 Travellers (Couple / Friends)</option>
                  <option value="3">3 Friends</option>
                  <option value="4">4 Family Members</option>
                </select>
              </div>

              {/* Travel Style */}
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Travel Style</label>
                <select
                  className="SkyRoute-select-input"
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                >
                  <option value="Balanced">Balanced / Standard</option>
                  <option value="Backpacker">Backpacker / Budget</option>
                  <option value="Luxury">Luxury &amp; Comfort</option>
                  <option value="Family">Family Friendly</option>
                </select>
              </div>
            </div>

            {/* Preferred Activities Chips */}
            <div className="SkyRoute-ai-interests-section">
              <label className="SkyRoute-field-label">Select Activities &amp; Trip Interests:</label>
              <div className="SkyRoute-ai-interests-tags">
                {interestOptions.map((item) => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`SkyRoute-interest-tag-btn ${
                        isSelected ? 'SkyRoute-interest-tag-btn--selected' : ''
                      }`}
                      onClick={() => toggleInterest(item)}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="SkyRoute-ai-form-actions">
              <button
                type="submit"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg SkyRoute-ai-generate-btn"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="SkyRoute-loading-spinner-inline"></span>
                    <span>Generating Custom AI Itinerary...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Itinerary →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Generated AI Itinerary Result */}
        {generatedPlan && (
          <div className="SkyRoute-ai-result-section">
            {/* 1. Trip Overview Card */}
            <div className="SkyRoute-ai-overview-card SkyRoute-card">
              <div className="SkyRoute-ai-overview-card__header">
                <div>
                  <span className="SkyRoute-badge SkyRoute-badge--teal">TRIP OVERVIEW</span>
                  <h2 className="SkyRoute-ai-result-title">
                    {generatedPlan.days}-Day {generatedPlan.style} Itinerary in {generatedPlan.destination.name}
                  </h2>
                  <p className="SkyRoute-ai-result-sub">
                    Customized for {generatedPlan.travellers} {generatedPlan.travellers === 1 ? 'Traveller' : 'Travellers'} &bull; Total Allocated Budget: <strong>{formatINR(generatedPlan.totalBudget)}</strong>
                  </p>
                </div>

                <div className="SkyRoute-ai-overview-card__actions">
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                    onClick={handleCopyItinerary}
                  >
                    📋 Copy Itinerary
                  </button>
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                    onClick={handleBookFlightsFromPlan}
                  >
                    Search Flights to {generatedPlan.destination.code} →
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Recommended Flight & Hotel Cards */}
            <div className="SkyRoute-ai-recommendations-grid">
              {/* Flight Card */}
              <div className="SkyRoute-ai-rec-card SkyRoute-card">
                <div className="SkyRoute-ai-rec-card__header">
                  <span className="SkyRoute-ai-rec-icon">✈️</span>
                  <div>
                    <span className="SkyRoute-ai-rec-tag">RECOMMENDED FLIGHT</span>
                    <h3 className="SkyRoute-ai-rec-title">{generatedPlan.flightSuggestion.airline}</h3>
                  </div>
                </div>
                <div className="SkyRoute-ai-rec-card__body">
                  <div className="SkyRoute-ai-rec-route">{generatedPlan.flightSuggestion.route}</div>
                  <p className="SkyRoute-ai-rec-desc">
                    Direct round-trip connection with standard cabin luggage &amp; flexible rescheduling.
                  </p>
                  <div className="SkyRoute-ai-rec-price-row">
                    <span className="SkyRoute-ai-rec-price-label">Starting Fare per Adult:</span>
                    <strong className="SkyRoute-ai-rec-price-val">
                      {formatINR(generatedPlan.flightSuggestion.farePerPerson)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Hotel Card */}
              <div className="SkyRoute-ai-rec-card SkyRoute-card">
                <div className="SkyRoute-ai-rec-card__header">
                  <span className="SkyRoute-ai-rec-icon">🏨</span>
                  <div>
                    <span className="SkyRoute-ai-rec-tag">RECOMMENDED HOTEL</span>
                    <h3 className="SkyRoute-ai-rec-title">{generatedPlan.hotelSuggestion.name}</h3>
                  </div>
                </div>
                <div className="SkyRoute-ai-rec-card__body">
                  <div className="SkyRoute-ai-rec-route">
                    ★ {generatedPlan.hotelSuggestion.rating} / 5.0 &bull; {generatedPlan.hotelSuggestion.type}
                  </div>
                  <p className="SkyRoute-ai-rec-desc">
                    Top-rated central location with complimentary breakfast, infinity pool, and airport pickup.
                  </p>
                  <div className="SkyRoute-ai-rec-price-row">
                    <span className="SkyRoute-ai-rec-price-label">Nightly Rate:</span>
                    <strong className="SkyRoute-ai-rec-price-val">
                      {formatINR(generatedPlan.hotelSuggestion.price)} / night
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Day-by-Day Schedule Cards */}
            <div className="SkyRoute-ai-schedule-section">
              <h3 className="SkyRoute-ai-section-heading">📅 Day-by-Day Travel Schedule</h3>
              <div className="SkyRoute-ai-days-stack">
                {generatedPlan.itinerary.map((dayItem) => (
                  <div key={dayItem.day} className="SkyRoute-ai-day-card SkyRoute-card">
                    <div className="SkyRoute-ai-day-card__header">
                      <span className="SkyRoute-badge SkyRoute-badge--navy">DAY {dayItem.day}</span>
                      <h4 className="SkyRoute-ai-day-card__title">{dayItem.title}</h4>
                    </div>

                    <div className="SkyRoute-ai-day-timeline-grid">
                      <div className="SkyRoute-ai-time-slot">
                        <span className="SkyRoute-ai-time-label">🌅 Morning</span>
                        <p className="SkyRoute-ai-time-text">{dayItem.morning}</p>
                      </div>

                      <div className="SkyRoute-ai-time-slot">
                        <span className="SkyRoute-ai-time-label">☀️ Afternoon</span>
                        <p className="SkyRoute-ai-time-text">{dayItem.afternoon}</p>
                      </div>

                      <div className="SkyRoute-ai-time-slot">
                        <span className="SkyRoute-ai-time-label">🌙 Evening</span>
                        <p className="SkyRoute-ai-time-text">{dayItem.evening}</p>
                      </div>
                    </div>

                    <div className="SkyRoute-ai-day-card__footer">
                      <span className="SkyRoute-dining-tip-icon">🍜</span>
                      <span className="SkyRoute-dining-tip-text">
                        <strong>Dining Tip:</strong> {dayItem.diningTip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Estimated Holiday Budget Section */}
            <div className="SkyRoute-ai-budget-card SkyRoute-card">
              <div className="SkyRoute-ai-budget-card__header">
                <div>
                  <span className="SkyRoute-badge SkyRoute-badge--teal">BUDGET ALLOCATION</span>
                  <h3 className="SkyRoute-ai-budget-card__title">Estimated Holiday Budget Breakdown</h3>
                </div>
              </div>

              {/* Total Summary Row */}
              <div className="SkyRoute-budget-summary-stats">
                <div className="SkyRoute-budget-stat-box">
                  <span className="SkyRoute-budget-stat-label">Total Budget</span>
                  <strong className="SkyRoute-budget-stat-val">{formatINR(generatedPlan.totalBudget)}</strong>
                </div>
                <div className="SkyRoute-budget-stat-box">
                  <span className="SkyRoute-budget-stat-label">Estimated Spent</span>
                  <strong className="SkyRoute-budget-stat-val" style={{ color: 'var(--SkyRoute-teal)' }}>
                    {formatINR(generatedPlan.totalSpent)}
                  </strong>
                </div>
                <div className="SkyRoute-budget-stat-box">
                  <span className="SkyRoute-budget-stat-label">Remaining Buffer</span>
                  <strong className="SkyRoute-budget-stat-val" style={{ color: '#7D5A44' }}>
                    {formatINR(generatedPlan.remaining)}
                  </strong>
                </div>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="SkyRoute-budget-categories-list">
                {generatedPlan.categories.map((cat, idx) => (
                  <div key={idx} className="SkyRoute-budget-category-row">
                    <div className="SkyRoute-budget-cat-info">
                      <span className="SkyRoute-budget-cat-name">
                        <span className="SkyRoute-budget-cat-icon">{cat.icon}</span> {cat.name}
                      </span>
                      <div className="SkyRoute-budget-cat-values">
                        <strong className="SkyRoute-budget-cat-amount">{formatINR(cat.amount)}</strong>
                        <span className="SkyRoute-budget-cat-pct">({cat.pct}%)</span>
                      </div>
                    </div>
                    <div className="SkyRoute-progress-track">
                      <div
                        className="SkyRoute-progress-bar"
                        style={{ width: `${cat.pct}%`, backgroundColor: cat.barColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTripPlanner;
