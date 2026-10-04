import React from 'react';

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Search',
    desc: 'Enter your departure city, destination, travel dates and passenger information.',
    icon: '🔍',
  },
  {
    step: '02',
    title: 'Compare',
    desc: 'Browse available demo flights and filter or sort them by price, stops and duration.',
    icon: '⚡',
  },
  {
    step: '03',
    title: 'Review',
    desc: 'View flight details and enter traveller information before confirming.',
    icon: '📝',
  },
  {
    step: '04',
    title: 'Confirm',
    desc: 'Review the booking and generate a simulated booking confirmation.',
    icon: '🎫',
  },
];

const FEATURES = [
  {
    title: 'Flight Search',
    desc: 'Search using departure, destination, dates and passengers with autocomplete and interactive calendar.',
    icon: '🛫',
  },
  {
    title: 'Flight Comparison',
    desc: 'Filter and sort available demo flights by price brackets, stops (Non-stop/1 Stop), and duration.',
    icon: '📊',
  },
  {
    title: 'Flight Details',
    desc: 'Review transparent itinerary timelines, baggage allowances (15 kg checked, 7 kg cabin), and fare breakdowns.',
    icon: '✈️',
  },
  {
    title: 'Passenger Forms',
    desc: 'Enter and validate traveller information with real-time field validation and primary contact handling.',
    icon: '👥',
  },
  {
    title: 'Booking Review',
    desc: 'Check complete flight, passenger, and fare details before confirming your reservation.',
    icon: '📋',
  },
  {
    title: 'My Bookings',
    desc: 'View previously confirmed demo bookings stored locally in your browser with print-ready tickets.',
    icon: '🗂️',
  },
];

const TECH_STACK = [
  {
    name: 'React',
    badge: 'v17.0.2',
    desc: 'Component-driven architecture, state management, and declarative UI rendering.',
  },
  {
    name: 'JavaScript',
    badge: 'ES6+',
    desc: 'Modern JavaScript with array mapping, filtering, sorting, and immutable state updates.',
  },
  {
    name: 'Backpack Calendar',
    badge: 'Skyscanner',
    desc: 'Accessible Backpack web date picker components and theme token mixins.',
  },
  {
    name: 'Modular SCSS',
    badge: 'CSS3',
    desc: 'Design token variables, CSS Grid, Flexbox, media queries, and print stylesheets.',
  },
  {
    name: 'HTML5 History API',
    badge: 'Client Routing',
    desc: 'Seamless multi-step page routing with browser back/forward button synchronization.',
  },
  {
    name: 'Browser LocalStorage',
    badge: 'Storage',
    desc: 'Persistent client-side storage for search criteria, passenger records, and booking history.',
  },
];

const SKILLS_LIST = [
  'React component architecture & decomposition',
  'Client-side state management (useState, useEffect, useMemo)',
  'Multi-step user flow routing with browser history sync',
  'Real-time controlled form handling & regex validation',
  'Multi-facet array filtering, search queries, and sorting',
  'Responsive, token-based SCSS with Flexbox and CSS Grid',
  'Browser LocalStorage integration for state persistence',
  'Print media formatting for simulated boarding passes',
];

const About = ({ onNavigate }) => {
  return (
    <div className="SkyRoute-about-page">
      {/* 1. Hero Section */}
      <section className="SkyRoute-about-hero">
        <div className="SkyRoute-container SkyRoute-about-hero__container">
          <span className="SkyRoute-about-hero__badge">ABOUT SKYROUTE</span>
          <h1 className="SkyRoute-about-hero__title">Making flight planning simple</h1>
          <p className="SkyRoute-about-hero__subtitle">
            SkyRoute is a modern flight-booking demo designed to make searching, comparing and managing flight journeys simple and intuitive.
          </p>
        </div>
      </section>

      <div className="SkyRoute-container SkyRoute-about-main">
        {/* 2. What is SkyRoute? */}
        <section className="SkyRoute-about-section">
          <div className="SkyRoute-card SkyRoute-about-overview-card">
            <div className="SkyRoute-about-overview-card__header">
              <span className="SkyRoute-about-overview-card__icon">🌐</span>
              <h2 className="SkyRoute-about-section-title">What is SkyRoute?</h2>
            </div>
            <p className="SkyRoute-about-overview-card__lead">
              SkyRoute is a frontend flight-booking demonstration project built with React and JavaScript. It simulates the journey a traveller would take when searching for a flight, selecting an itinerary, entering passenger details and reviewing a booking.
            </p>
            <div className="SkyRoute-about-overview-card__focus-grid">
              <div className="SkyRoute-about-focus-item">
                <span className="SkyRoute-about-focus-item__bullet">✓</span>
                <span>User experience &amp; clean visual design</span>
              </div>
              <div className="SkyRoute-about-focus-item">
                <span className="SkyRoute-about-focus-item__bullet">✓</span>
                <span>Responsive layouts across mobile and desktop</span>
              </div>
              <div className="SkyRoute-about-focus-item">
                <span className="SkyRoute-about-focus-item__bullet">✓</span>
                <span>Reusable React components &amp; modular architecture</span>
              </div>
              <div className="SkyRoute-about-focus-item">
                <span className="SkyRoute-about-focus-item__bullet">✓</span>
                <span>Controlled form handling &amp; validation</span>
              </div>
              <div className="SkyRoute-about-focus-item">
                <span className="SkyRoute-about-focus-item__bullet">✓</span>
                <span>Flight filtering, search queries, and dynamic sorting</span>
              </div>
              <div className="SkyRoute-about-focus-item">
                <span className="SkyRoute-about-focus-item__bullet">✓</span>
                <span>Client-side state management &amp; LocalStorage</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How SkyRoute Works */}
        <section className="SkyRoute-about-section">
          <div className="SkyRoute-about-section__header-center">
            <span className="SkyRoute-about-section__tag">STEP-BY-STEP FLOW</span>
            <h2 className="SkyRoute-about-section-title">How SkyRoute Works</h2>
            <p className="SkyRoute-about-section-sub">
              Experience an intuitive 4-stage booking flow from discovery to ticket generation.
            </p>
          </div>

          <div className="SkyRoute-about-steps-grid">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <div key={s.step} className="SkyRoute-card SkyRoute-about-step-card">
                <div className="SkyRoute-about-step-card__top">
                  <span className="SkyRoute-about-step-card__num">{s.step}</span>
                  <span className="SkyRoute-about-step-card__icon">{s.icon}</span>
                </div>
                <h3 className="SkyRoute-about-step-card__title">{s.title}</h3>
                <p className="SkyRoute-about-step-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Features */}
        <section className="SkyRoute-about-section">
          <div className="SkyRoute-about-section__header-center">
            <span className="SkyRoute-about-section__tag">CAPABILITIES</span>
            <h2 className="SkyRoute-about-section-title">Built for a Realistic Booking Experience</h2>
            <p className="SkyRoute-about-section-sub">
              Carefully engineered components delivering modern travel booking functionality.
            </p>
          </div>

          <div className="SkyRoute-about-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="SkyRoute-card SkyRoute-about-feature-card">
                <div className="SkyRoute-about-feature-card__icon">{f.icon}</div>
                <h3 className="SkyRoute-about-feature-card__title">{f.title}</h3>
                <p className="SkyRoute-about-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Technology Behind SkyRoute */}
        <section className="SkyRoute-about-section">
          <div className="SkyRoute-about-section__header-center">
            <span className="SkyRoute-about-section__tag">UNDER THE HOOD</span>
            <h2 className="SkyRoute-about-section-title">Technology Behind SkyRoute</h2>
            <p className="SkyRoute-about-section-sub">
              Built on a foundation of standard web technologies and Skyscanner Backpack components.
            </p>
          </div>

          <div className="SkyRoute-about-tech-grid">
            {TECH_STACK.map((t, i) => (
              <div key={i} className="SkyRoute-card SkyRoute-about-tech-card">
                <div className="SkyRoute-about-tech-card__header">
                  <h3 className="SkyRoute-about-tech-card__name">{t.name}</h3>
                  <span className="SkyRoute-tag SkyRoute-tag--blue">{t.badge}</span>
                </div>
                <p className="SkyRoute-about-tech-card__desc">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="SkyRoute-card SkyRoute-about-tech-summary">
            <p>
              <strong>SkyRoute</strong> uses React components and state management to create an interactive booking experience. LocalStorage is used to persist demo search, passenger and booking information in the browser.
            </p>
          </div>
        </section>

        {/* 6. Why This Project? */}
        <section className="SkyRoute-about-section">
          <div className="SkyRoute-card SkyRoute-about-purpose-card">
            <div className="SkyRoute-about-purpose-card__header">
              <span className="SkyRoute-about-purpose-card__icon">💡</span>
              <div>
                <h2 className="SkyRoute-about-section-title">Why This Project?</h2>
                <p className="SkyRoute-about-purpose-card__sub">
                  Created as a comprehensive portfolio project demonstrating end-to-end frontend engineering best practices:
                </p>
              </div>
            </div>

            <div className="SkyRoute-about-skills-grid">
              {SKILLS_LIST.map((skill, index) => (
                <div key={index} className="SkyRoute-about-skill-item">
                  <span className="SkyRoute-about-skill-item__dot"></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Demo Disclaimer */}
        <section className="SkyRoute-about-section">
          <div className="SkyRoute-card SkyRoute-about-disclaimer-card">
            <div className="SkyRoute-about-disclaimer-card__icon">🛡️</div>
            <div className="SkyRoute-about-disclaimer-card__content">
              <h3 className="SkyRoute-about-disclaimer-card__title">Demo Project</h3>
              <p className="SkyRoute-about-disclaimer-card__text">
                SkyRoute is a demonstration flight-booking application. Flight availability, pricing, booking confirmation and payment are simulated. No real airline reservation or payment is processed.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Call To Action */}
        <section className="SkyRoute-about-cta">
          <div className="SkyRoute-card SkyRoute-about-cta__card">
            <h2 className="SkyRoute-about-cta__title">Ready to explore SkyRoute?</h2>
            <p className="SkyRoute-about-cta__subtitle">
              Try the flight search and experience the complete demo booking flow.
            </p>
            <div className="SkyRoute-about-cta__actions">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg"
                onClick={() => onNavigate('/dashboard/flights')}
              >
                ✈️ Search Flights
              </button>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--lg"
                onClick={() => onNavigate('/dashboard/bookings')}
              >
                📋 View My Bookings
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
