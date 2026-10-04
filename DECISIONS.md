# SkyRoute Technical Decisions

This document details the architectural, design, and technical decisions made during the development of the SkyRoute flight-booking demo application.

---

## 1. Why React?

React was chosen as the core UI library because flight booking interfaces demand complex, reactive state management across multi-step forms and asynchronous interactions:
- **Declarative UI**: Keeps the view synchronized with data states (search queries, flight filters, passenger forms, and booking summaries).
- **Component-Driven Architecture**: Enables breaking complex screens into self-contained units (e.g. `FlightCard`, `DatePickerField`, `PassengerFormCard`, `FareSummary`).
- **Efficient Re-rendering**: Efficiently updates filter results and passenger counts without full page reloads.

---

## 2. Why JavaScript?

JavaScript (ES6+) was selected for this project to maintain a streamlined, agile development process while leveraging modern language features:
- Native array manipulation methods (`.filter()`, `.map()`, `.sort()`, `.reduce()`) for high-performance client-side flight sorting and price calculations.
- Clean asynchronous execution and standard browser Web APIs.
- Broad compatibility with existing Backpack React component libraries and build scripts.

---

## 3. Why Client-Side Routing (HTML5 History API)?

Rather than reloading pages from a server, SkyRoute uses client-side routing synchronized via the HTML5 `history.pushState` and `popstate` event listeners:
- **Seamless Single-Page Application (SPA) Experience**: Instant transitions between Search, Results, Details, Passenger entry, Review, and Confirmation.
- **Deep Linking & Browser History**: Users can use browser Back and Forward buttons naturally without losing application state.
- **Lightweight Architecture**: Provides robust path routing (`/`, `/flights`, `/flight-details`, `/passenger-details`, `/review-booking`, `/booking-confirmation`, `/my-bookings`, `/about`, `/login`) without heavy router library overhead.

---

## 4. Why LocalStorage for Persistence?

To simulate real-world persistence without requiring a backend database server:
- **Cross-Session Retention**: Retains ongoing search queries, selected flight options, and passenger information across page refreshes.
- **Booking History**: Allows users to confirm bookings on `/review-booking` and view them permanently on `/my-bookings`.
- **Zero Backend Dependency**: Enables the repository to run entirely client-side out of the box with `npm start` or any static web host.

---

## 5. Why Mock Flight Data?

Instead of integrating external flight search APIs (such as Amadeus, Skyscanner API, or Sabre), SkyRoute uses a rich internal dataset (`data/flights.js`):
- **Deterministic Testing**: Ensures stable prices, guaranteed route availability, and predictable flight schedules for demo users and reviewers.
- **No API Rate Limits or API Keys**: Allows anyone cloning the repository to run and inspect the app immediately without provisioning credentials.
- **Realistic Data Modeling**: Accurately mirrors production airline data structures (airline codes, aircraft types, baggage policies, departure/arrival terminals, and fare breakdowns).

---

## 6. Why Frontend-Only?

SkyRoute was purposefully designed as a focused frontend showcase:
- **Emphasis on Frontend Craftsmanship**: Highlights advanced UI/UX engineering, form validation, dynamic filtering, responsive styling, and accessibility.
- **Safe Demonstration Environment**: Eliminates security risks associated with live payment gateways or sensitive passenger credential handling.
- **Clear Scope**: Clearly presented as a portfolio demonstration rather than a commercial booking service.

---

## 7. Responsive Design Philosophy

Travel planning is predominantly performed across mobile devices, tablets, and desktop workstations. SkyRoute was developed with a mobile-responsive mindset:
- **CSS Grid & Flexbox**: Utilizes auto-fitting grid templates and flexible containers rather than fixed pixel dimensions.
- **Breakpoint Hierarchy**:
  - **Desktop (1200px – 1440px)**: Multi-column layouts (filter sidebars, flight cards with horizontal timelines, and two-column review summaries).
  - **Tablet (768px – 1024px)**: Collapsible filter sections and adapted grid structures.
  - **Mobile (375px – 600px)**: Single-column vertical stacks, full-width touch-friendly buttons, and zero horizontal scrolling.

---

## 8. Reusable Component Strategy

To maintain clean code hygiene and adhere to the DRY (Don't Repeat Yourself) principle, recurring UI elements were factored into reusable components:
- **`Header` & `Footer`**: Global layout anchors providing consistent navigation across all 8 routes.
- **`FlightCard`**: Standardized presentation for flight results and summary representations.
- **`PassengerFormCard`**: Reusable form card supporting dynamic multi-passenger generation with individual validation states.
- **`AirportInput` & `DatePickerField`**: Modular input widgets with built-in autocomplete and date selection logic.
