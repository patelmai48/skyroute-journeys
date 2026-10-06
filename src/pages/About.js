import React, { useState } from 'react';
import Icon from '../components/Icon';

const TECH_STACK_ITEMS = [
  {
    category: 'Frontend Framework',
    name: 'React',
    version: 'v17.0.2',
    desc: 'Functional component architecture, unidirectional state distribution, hooks (useState, useEffect, useMemo, useRef), and React Portals (createPortal).',
    iconName: 'code',
  },
  {
    category: 'Core Language',
    name: 'JavaScript',
    version: 'ES6+',
    desc: 'Immutable state updates, multi-criteria array filtering & sorting algorithms, dynamic mock generation, and regex validations.',
    iconName: 'terminal',
  },
  {
    category: 'Styling & Tokens',
    name: 'Modular SCSS',
    version: 'CSS3 / Sass',
    desc: 'Strict 3-color token palette (Deep Navy #143F67, Warm Golden Yellow #E4B46C, Off-White #FFFFFF / #FAFBFC), CSS Grid, Flexbox, media queries, and print stylesheets.',
    iconName: 'edit',
  },
  {
    category: 'Design System',
    name: 'Backpack System',
    version: 'Skyscanner',
    desc: 'Accessible Skyscanner Backpack web mixins (bpk-mixins), stylesheets (bpk-stylesheets), and design tokens.',
    iconName: 'package',
  },
  {
    category: 'Client Routing',
    name: 'HTML5 History API',
    version: 'Single-Page',
    desc: 'Native browser routing utilizing window.history.pushState and popstate event listeners without external router bloat.',
    iconName: 'compass',
  },
  {
    category: 'State Persistence',
    name: 'Web LocalStorage',
    version: 'Browser API',
    desc: 'Synchronous client-side persistence for active searches, selected flights, passenger manifests, and confirmed bookings.',
    iconName: 'database',
  },
  {
    category: 'Form Engine',
    name: 'Controlled Validation',
    version: 'Real-Time',
    desc: 'Controlled component inputs with regex verification for passenger names, emails, phone numbers, and flight dates.',
    iconName: 'checkCircle',
  },
  {
    category: 'Responsive Design',
    name: 'Adaptive Engine',
    version: 'Mobile & Desktop',
    desc: 'Custom fluid layouts tested across 360px (mobile), 768px (tablet), and 1440px+ (desktop) viewports with zero horizontal overflow.',
    iconName: 'smartphone',
  },
];

const ARCHITECTURE_STEPS = [
  {
    id: 'search',
    num: '01',
    title: 'Flight Search',
    role: 'Inputs & Queries',
    desc: 'Captures trip type (one-way, round-trip, multi-city), origin, destination, dates, and travellers.',
    tech: 'Controlled inputs, fuzzy airport autocomplete, portaled calendar dropdown.',
    storage: 'localStorage: skyroute_search',
  },
  {
    id: 'results',
    num: '02',
    title: 'Flight Results',
    role: 'Filtering & Sorting',
    desc: 'Queries in-memory inventory against route parameters with real-time multi-facet filtering and sorting.',
    tech: 'Array.prototype.filter, price range calculation, duration sorting, stop classification.',
    storage: 'In-memory state (flights.js)',
  },
  {
    id: 'details',
    num: '03',
    title: 'Flight Details',
    role: 'Itinerary Inspection',
    desc: 'Renders complete segment timeline, aircraft specifications, baggage allowances, and refund policies.',
    tech: 'Component decomposition, dynamic fare breakdown calculations.',
    storage: 'localStorage: skyroute_selected_flight',
  },
  {
    id: 'passenger',
    num: '04',
    title: 'Passenger & Seats',
    role: 'Data Collection & Verification',
    desc: 'Collects passenger details and allows interactive seat selection on an aircraft cabin grid.',
    tech: 'Regex form validation, interactive aircraft seat selection modal, error state badges.',
    storage: 'localStorage: skyroute_passengers, skyroute_selected_seat',
  },
  {
    id: 'review',
    num: '05',
    title: 'Review & Payment',
    role: 'Checkout & Simulation',
    desc: 'Calculates tax, seat add-ons, promo code discounts (SKYDOM500, FLYINTL2500), and simulates payment gateway.',
    tech: 'Price aggregation, discount application logic, simulated card/UPI payment selector.',
    storage: 'In-memory review calculation',
  },
  {
    id: 'confirmation',
    num: '06',
    title: 'Booking Confirmation',
    role: 'Record Generation & Ticket',
    desc: 'Generates unique 6-character PNR (SR-XXXXXX), boarding pass, and printable PDF itinerary.',
    tech: 'Pseudo-random PNR generator, native window.print() formatting.',
    storage: 'localStorage: skyroute_current_booking, skyroute_bookings',
  },
  {
    id: 'trips',
    num: '07',
    title: 'My Trips & Management',
    role: 'Persistence & Cancellation',
    desc: 'Master dashboard displaying confirmed trips with full cancellation and rescheduling state management.',
    tech: 'Master array sync, persistent status mutation (Confirmed / Cancelled), search integration.',
    storage: 'localStorage: skyroute_bookings master store',
  },
];

const STORAGE_SCHEMA = [
  {
    key: 'skyroute_search',
    type: 'Object',
    description: 'Active flight search query parameters',
    fields: 'origin, destination, tripType, departureDate, returnDate, passengers, cabinClass',
  },
  {
    key: 'skyroute_selected_flight',
    type: 'Object',
    description: 'Flight currently selected for booking',
    fields: 'id, airline, flightNumber, departureTime, arrivalTime, price, baggage, amenities',
  },
  {
    key: 'skyroute_passengers',
    type: 'Array<Object>',
    description: 'Manifest of traveller details',
    fields: 'id, title, firstName, lastName, email, phone, ageCategory',
  },
  {
    key: 'skyroute_selected_seat',
    type: 'Object',
    description: 'Active seat assignment and tier',
    fields: 'id (e.g. 14A), row, col, type (Window/Aisle), category, price',
  },
  {
    key: 'skyroute_current_booking',
    type: 'Object',
    description: 'Active confirmed booking snapshot',
    fields: 'pnr, flight, passengers, seat, fareBreakdown, paymentMethod, status, bookedAt',
  },
  {
    key: 'skyroute_bookings',
    type: 'Array<Object>',
    description: 'Master list of all historical confirmed bookings',
    fields: 'Array of complete booking snapshots with persisted cancellation status',
  },
  {
    key: 'skyroute_auth_user',
    type: 'Object',
    description: 'Authenticated demo user session',
    fields: 'email, name, role, lastLoginAt',
  },
];

const IMPLEMENTATION_REALITY = [
  {
    feature: 'Flight Search & Results Matching',
    status: 'Real Client Logic',
    isReal: true,
    detail: 'Executed locally in browser using array filtering and sorting on curated mock datasets.',
  },
  {
    feature: 'Form & Input Validation',
    status: 'Real Client Logic',
    isReal: true,
    detail: 'Regex validations for passenger names, emails, phone numbers, and flight date consistency.',
  },
  {
    feature: 'Portaled Date Picker Dropdown',
    status: 'Real React Feature',
    isReal: true,
    detail: 'Custom lightweight calendar rendered directly to document.body via createPortal to prevent DOM clipping.',
  },
  {
    feature: 'Booking State Persistence',
    status: 'Real Client Storage',
    isReal: true,
    detail: 'Master booking records and trip lifecycle stored synchronously in browser localStorage.',
  },
  {
    feature: 'Payment Gateway Processing',
    status: 'Simulated Demo',
    isReal: false,
    detail: 'Demonstration payment selector; no real monetary transactions or banking APIs are connected.',
  },
  {
    feature: 'Airlines GDS / Reservation API',
    status: 'Simulated Demo',
    isReal: false,
    detail: 'Generates client-side PNR reference codes (SR-XXXXXX); no live airline reservation system API.',
  },
  {
    feature: 'User Authentication System',
    status: 'Simulated Demo',
    isReal: false,
    detail: 'Client-side session simulation with localStorage persistence and simulated Google OAuth.',
  },
];

const About = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div className="SkyRoute-about-page">
      {/* 1. Hero Section */}
      <section className="SkyRoute-about-hero">
        <div className="SkyRoute-container SkyRoute-about-hero__container">
          <span className="SkyRoute-about-hero__badge">TECHNICAL OVERVIEW &amp; ARCHITECTURE</span>
          <h1 className="SkyRoute-about-hero__title">Engineering Behind SkyRoute</h1>
          <p className="SkyRoute-about-hero__subtitle">
            An in-depth technical inspection of SkyRoute's component architecture, state management pipeline, data structures, and client-side storage implementation.
          </p>
        </div>
      </section>

      <div className="SkyRoute-container SkyRoute-about-main">
        {/* Navigation Tabs */}
        <div className="SkyRoute-about-nav-tabs">
          <button
            type="button"
            className={`SkyRoute-about-tab-btn ${activeTab === 'architecture' ? 'SkyRoute-about-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Icon name="layers" size={16} /> Architecture &amp; Flow
          </button>
          <button
            type="button"
            className={`SkyRoute-about-tab-btn ${activeTab === 'support' ? 'SkyRoute-about-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            <Icon name="headphones" size={16} /> Customer Support &amp; FAQ
          </button>
          <button
            type="button"
            className={`SkyRoute-about-tab-btn ${activeTab === 'tech' ? 'SkyRoute-about-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            <Icon name="code" size={16} /> Tech Stack Specifications
          </button>
          <button
            type="button"
            className={`SkyRoute-about-tab-btn ${activeTab === 'storage' ? 'SkyRoute-about-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('storage')}
          >
            <Icon name="database" size={16} /> Data &amp; LocalStorage Schema
          </button>
          <button
            type="button"
            className={`SkyRoute-about-tab-btn ${activeTab === 'reality' ? 'SkyRoute-about-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('reality')}
          >
            <Icon name="shieldCheck" size={16} /> Implementation Reality
          </button>
        </div>

        {/* Tab 1: Architecture & Flow */}
        {activeTab === 'architecture' && (
          <section className="SkyRoute-about-section">
            <div className="SkyRoute-about-section__header-center">
              <span className="SkyRoute-about-section__tag">SYSTEM DESIGN</span>
              <h2 className="SkyRoute-about-section-title">End-to-End Booking Pipeline</h2>
              <p className="SkyRoute-about-section-sub">
                How state, user inputs, validation engines, and local storage connect across the 7 application stages.
              </p>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="SkyRoute-about-pipeline-grid">
              {ARCHITECTURE_STEPS.map((step) => (
                <div key={step.id} className="SkyRoute-card SkyRoute-pipeline-card">
                  <div className="SkyRoute-pipeline-card__header">
                    <span className="SkyRoute-pipeline-card__num">{step.num}</span>
                    <span className="SkyRoute-pipeline-card__role">{step.role}</span>
                  </div>
                  <h3 className="SkyRoute-pipeline-card__title">{step.title}</h3>
                  <p className="SkyRoute-pipeline-card__desc">{step.desc}</p>
                  <div className="SkyRoute-pipeline-card__meta">
                    <div className="SkyRoute-pipeline-card__meta-row">
                      <strong>Logic:</strong> <span>{step.tech}</span>
                    </div>
                    <div className="SkyRoute-pipeline-card__meta-row">
                      <strong>Storage:</strong> <code>{step.storage}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Architecture Tree */}
            <div className="SkyRoute-card SkyRoute-about-code-block-card">
              <h3 className="SkyRoute-about-code-block-title">Unidirectional Data Flow Architecture</h3>
              <pre className="SkyRoute-about-ascii-tree">
{`[User Interaction] 
       │
       ▼
[App.js: Master State Controller] ─── Synchronizes with ───▶ [localStorage API]
       │                                                         │
       ├── searchData (origin, destination, dates, cabin)       ├── skyroute_search
       ├── selectedFlight (itinerary, baggage, fare rules)       ├── skyroute_selected_flight
       ├── passengerData (names, emails, phones, validation)     ├── skyroute_passengers
       ├── selectedSeat (seat 14A, tier, upgrade fee)            ├── skyroute_selected_seat
       └── currentBooking (PNR reference, master manifest)      └── skyroute_bookings (History)
       │
       ▼
[Page Routing Pipeline via HTML5 History API (pushState & popstate)]
  ├── / (Home & FlightSearchForm)
  ├── /flights (FlightResults & Multi-Facet Filters)
  ├── /flight-details (FlightDetails & Itinerary Breakdown)
  ├── /passenger-details (PassengerDetails & SeatSelectionModal)
  ├── /review-booking (ReviewBooking & Simulated Payment)
  ├── /booking-confirmation (BookingConfirmation & Printable Boarding Pass)
  └── /my-trips (MyTrips & ManageBooking with LocalStorage Sync)`}
              </pre>
            </div>
          </section>
        )}

        {/* Tab 2: Tech Stack */}
        {activeTab === 'tech' && (
          <section className="SkyRoute-about-section">
            <div className="SkyRoute-about-section__header-center">
              <span className="SkyRoute-about-section__tag">ENGINEERING FOUNDATIONS</span>
              <h2 className="SkyRoute-about-section-title">Verified Technology Stack</h2>
              <p className="SkyRoute-about-section-sub">
                Core technologies and design system packages powering the frontend platform.
              </p>
            </div>

            <div className="SkyRoute-about-tech-grid">
              {TECH_STACK_ITEMS.map((t, i) => (
                <div key={i} className="SkyRoute-card SkyRoute-about-tech-card">
                  <div className="SkyRoute-about-tech-card__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="SkyRoute-about-tech-card__icon-wrap">
                        <Icon name={t.iconName} size={18} color="#143F67" />
                      </span>
                      <h3 className="SkyRoute-about-tech-card__name">{t.name}</h3>
                    </div>
                    <span className="SkyRoute-tag SkyRoute-tag--blue">{t.version}</span>
                  </div>
                  <span className="SkyRoute-about-tech-card__cat">{t.category}</span>
                  <p className="SkyRoute-about-tech-card__desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 3: Data & Storage Schema */}
        {activeTab === 'storage' && (
          <section className="SkyRoute-about-section">
            <div className="SkyRoute-about-section__header-center">
              <span className="SkyRoute-about-section__tag">DATA PERSISTENCE</span>
              <h2 className="SkyRoute-about-section-title">Client-Side Storage Schema</h2>
              <p className="SkyRoute-about-section-sub">
                Explicit breakdown of how browser LocalStorage keys structure and maintain state across user sessions.
              </p>
            </div>

            <div className="SkyRoute-card SkyRoute-about-table-card">
              <div className="SkyRoute-about-table-wrap">
                <table className="SkyRoute-about-table">
                  <thead>
                    <tr>
                      <th>LocalStorage Key</th>
                      <th>Data Type</th>
                      <th>Purpose &amp; Description</th>
                      <th>Schema Fields</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STORAGE_SCHEMA.map((s) => (
                      <tr key={s.key}>
                        <td><code>{s.key}</code></td>
                        <td><span className="SkyRoute-type-badge">{s.type}</span></td>
                        <td>{s.description}</td>
                        <td className="SkyRoute-fields-cell"><code>{s.fields}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: Implementation Reality */}
        {activeTab === 'reality' && (
          <section className="SkyRoute-about-section">
            <div className="SkyRoute-about-section__header-center">
              <span className="SkyRoute-about-section__tag">TRANSPARENCY</span>
              <h2 className="SkyRoute-about-section-title">Implementation Reality Matrix</h2>
              <p className="SkyRoute-about-section-sub">
                Clear and transparent distinction between real client-side engineering and simulated demo integrations.
              </p>
            </div>

            <div className="SkyRoute-card SkyRoute-about-table-card">
              <div className="SkyRoute-about-table-wrap">
                <table className="SkyRoute-about-table">
                  <thead>
                    <tr>
                      <th>Application Component</th>
                      <th>Classification</th>
                      <th>Engineering Implementation Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IMPLEMENTATION_REALITY.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.feature}</strong></td>
                        <td>
                          <span className={`SkyRoute-status-badge ${item.isReal ? 'SkyRoute-status-badge--real' : 'SkyRoute-status-badge--simulated'}`}>
                            <Icon name={item.isReal ? 'checkCircle' : 'info'} size={14} style={{ marginRight: '4px' }} />
                            {item.status}
                          </span>
                        </td>
                        <td>{item.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 5: Customer Support & FAQ */}
        {activeTab === 'support' && (
          <section className="SkyRoute-about-section">
            <div className="SkyRoute-about-section__header-center">
              <span className="SkyRoute-about-section__tag">24/7 TRAVELLER ASSISTANCE</span>
              <h2 className="SkyRoute-about-section-title">Support &amp; Help Desk</h2>
              <p className="SkyRoute-about-section-sub">
                Fast, dedicated customer care for flight rescheduling, baggage allowances, cancellation refunds, and check-in guidance.
              </p>
            </div>

            {/* Support Assistance Channels Grid */}
            <div className="SkyRoute-support-grid">
              <div className="SkyRoute-support-card">
                <div className="SkyRoute-support-card__icon">
                  <Icon name="phone" size={22} color="#143F67" />
                </div>
                <h3 className="SkyRoute-support-card__title">24/7 Phone Support</h3>
                <p className="SkyRoute-support-card__text">
                  Direct hotline for flight changes, emergency travel assistance, and immediate check-in issues.
                </p>
                <a href="tel:+911800258741" className="SkyRoute-support-card__action">
                  Call +91 1800-258-741 &rarr;
                </a>
              </div>

              <div className="SkyRoute-support-card">
                <div className="SkyRoute-support-card__icon">
                  <Icon name="mail" size={22} color="#143F67" />
                </div>
                <h3 className="SkyRoute-support-card__title">Email Help Desk</h3>
                <p className="SkyRoute-support-card__text">
                  Send booking queries, e-ticket resends, and refund requests with responses within 2 hours.
                </p>
                <a href="mailto:support@skyroute-travel.com" className="SkyRoute-support-card__action">
                  support@skyroute-travel.com &rarr;
                </a>
              </div>

              <div className="SkyRoute-support-card">
                <div className="SkyRoute-support-card__icon">
                  <Icon name="ticket" size={22} color="#143F67" />
                </div>
                <h3 className="SkyRoute-support-card__title">Manage PNR &amp; Check-in</h3>
                <p className="SkyRoute-support-card__text">
                  Retrieve booking records, modify passenger details, or initiate instant self-service cancellations.
                </p>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--subtle SkyRoute-btn--sm"
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => onNavigate('/manage-booking')}
                >
                  Manage Booking &rarr;
                </button>
              </div>

              <div className="SkyRoute-support-card">
                <div className="SkyRoute-support-card__icon">
                  <Icon name="shieldCheck" size={22} color="#143F67" />
                </div>
                <h3 className="SkyRoute-support-card__title">Travel Insurance Claims</h3>
                <p className="SkyRoute-support-card__text">
                  24/7 assistance for baggage loss, trip delays, medical emergency coverage, and policy benefits.
                </p>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--subtle SkyRoute-btn--sm"
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => onNavigate('/travel-insurance')}
                >
                  Insurance Portal &rarr;
                </button>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="SkyRoute-faq-list">
              <div className="SkyRoute-faq-item">
                <h4 className="SkyRoute-faq-item__question">
                  <Icon name="helpCircle" size={18} color="#E4B46C" /> How do I complete web check-in?
                </h4>
                <p className="SkyRoute-faq-item__answer">
                  Web check-in opens 48 hours prior to domestic departure and 24 hours prior to international flights. Navigate to <strong>Manage Booking</strong>, enter your 6-character PNR code and passenger last name to select seats and download your digital boarding pass.
                </p>
              </div>

              <div className="SkyRoute-faq-item">
                <h4 className="SkyRoute-faq-item__question">
                  <Icon name="helpCircle" size={18} color="#E4B46C" /> What are the standard baggage allowances?
                </h4>
                <p className="SkyRoute-faq-item__answer">
                  Standard domestic economy flights allow <strong>7 kg cabin baggage</strong> (1 handbag/laptop bag) and <strong>15 kg check-in baggage</strong> per passenger. Air India and international routes include 25 kg to 30 kg check-in allowance.
                </p>
              </div>

              <div className="SkyRoute-faq-item">
                <h4 className="SkyRoute-faq-item__question">
                  <Icon name="helpCircle" size={18} color="#E4B46C" /> How do flight cancellations and refunds work?
                </h4>
                <p className="SkyRoute-faq-item__answer">
                  Refundable tickets can be cancelled up to 2 hours prior to scheduled departure. Once cancelled via <strong>Manage Booking</strong> or <strong>My Trips</strong>, the net refund is calculated automatically according to airline tariff rules and processed to the original payment source.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Call To Action */}
        <section className="SkyRoute-about-cta">
          <div className="SkyRoute-card SkyRoute-about-cta__card">
            <h2 className="SkyRoute-about-cta__title">Explore the Live Application</h2>
            <p className="SkyRoute-about-cta__subtitle">
              Test the flight search engine, interact with the custom portaled datepicker, or inspect your local bookings.
            </p>
            <div className="SkyRoute-about-cta__actions">
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg"
                onClick={() => onNavigate('/')}
              >
                <Icon name="flight" size={18} style={{ marginRight: '8px' }} /> Start Flight Search
              </button>
              <button
                type="button"
                className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--lg"
                onClick={() => onNavigate('/my-trips')}
              >
                <Icon name="list" size={18} style={{ marginRight: '8px' }} /> View Stored Trips
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
