# SkyRoute — Flight Booking Platform (Technical Overview)

SkyRoute is a responsive, client-side flight-booking web application built with **React (v17.0.2)**, **JavaScript (ES6+)**, and **Modular SCSS**. It models an end-to-end flight booking journey—from route exploration and multi-parameter search to passenger validation, seat selection, simulated payment, and local booking persistence.

---

## 1. Tech Stack & Engineering Foundations

| Layer / Technology | Specification | Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 17.0.2 | Component-driven architecture utilizing functional components with hooks (`useState`, `useEffect`, `useMemo`, `useRef`) and `createPortal` for floating overlays. |
| **Core Language** | JavaScript (ES6+) | Immutable state transitions, array manipulation (`filter`, `reduce`, `sort`, `map`), dynamic mock generation, and regex validations. |
| **Styling & Design Tokens** | Modular SCSS (Sass) | Token-based 3-color system (Deep Navy `#143F67`, Warm Gold `#E4B46C`, Clean White `#FAFBFC` / `#FFFFFF`, Neutral Border `#E2E8F0`), CSS Grid, Flexbox layouts, micro-animations, and media queries with zero third-party utility frameworks. |
| **Design System** | Skyscanner Backpack | `@skyscanner/backpack-web` tokens, calendar stylesheets (`bpk-stylesheets`), and mixins (`bpk-mixins`). |
| **Client-Side Routing** | HTML5 History API | Native single-page routing powered by `window.history.pushState` and `window.addEventListener('popstate')` without external router bloat. |
| **Form Handling & Validation** | Custom Controlled Forms | Real-time inline field validation (names, emails, phone numbers, dates), clear error messaging, and atomic state updates. |
| **Client Storage** | Web Storage API (`localStorage`) | Synchronous browser persistence for active search parameters, selected flights, passenger manifests, and historical booking records. |
| **Responsive Engine** | Viewport Breakpoints | Fluid layout adaptations across Mobile (360px–640px), Tablet (768px–1024px), and Desktop (1200px–1440px+). |

---

## 2. Project Architecture

The application follows a unidirectional data flow where `App.js` serves as the root controller, coordinating page routing, global search context, passenger data, and local storage synchronization.

```text
                                 ┌──────────────────────────────┐
                                 │           App.js             │
                                 │   (Root Route & State Store) │
                                 └──────────────┬───────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                   ┌──────────────────┐
│  Static Datasets │                  │  State & Hooks   │                   │  LocalStorage    │
│  - flights.js    │                  │  - searchData    │                   │  - skyroute_...  │
│  - travelData.js │                  │  - currentBooking│                   │  - search        │
└────────┬─────────┘                  └─────────┬────────┘                   │  - bookings      │
         │                                      │                            └────────┬─────────┘
         │                                      │                                     │
         └──────────────────────────────────────┼─────────────────────────────────────┘
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       Application Routing Pipeline                                     │
├───────────────┬───────────────┬───────────────┬──────────────────┬──────────────┬──────────────┬───────┤
│    Home /     │    Flight     │    Flight     │    Passenger     │   Review &   │ Confirmation │  My   │
│ Flight Search │    Results    │    Details    │   & Seat Select  │   Payment    │   (Ticket)   │ Trips │
└───────────────┴───────────────┴───────────────┴──────────────────┴──────────────┴──────────────┴───────┘
```

### Key Architectural Layers:
1. **Presentation Components (`src/components/`)**: Atomic and composite UI elements (e.g., `FlightCard`, `DatePickerField`, `AirportInput`, `PassengerSelector`, `BaggageInfo`, `FareSummary`).
2. **Page Controllers (`src/pages/`)**: Route-level components orchestrating page-specific data pipelines (e.g., `FlightResults`, `PassengerDetails`, `ReviewBooking`, `MyTrips`, `ManageBooking`).
3. **Data Layer (`src/data/`)**: Curated in-memory inventory containing domestic and international routes, airline schedules, aircraft types, fare rules, and cancellation policies.
4. **Storage Synchronizer (`src/App.js`)**: Serializes state to `localStorage` on key transitions, enabling seamless page refreshes and session continuity.

---

## 3. End-to-End Booking Flow

The booking flow models an 8-stage transactional pipeline:

```text
[1. Search Inputs] ──▶ [2. Flight Results] ──▶ [3. Flight Details] ──▶ [4. Passenger Info]
        │                       │                       │                       │
  Origin, Dest,          Filter by Price,        Itinerary timeline,      First/Last Name,
  Dates, Cabin           Stops, Airlines         Baggage & Fare rules     Email, Phone, Seat
        │                       │                       │                       │
        ▼                       ▼                       ▼                       ▼
[8. My Trips]   ◀── [7. Confirmation] ◀── [6. Booking Record] ◀── [5. Review & Pay]
  Manage & Cancel         Boarding Pass &         Ref: SR-XXXXXX          Simulated Card/UPI
  Persistence             Printable Ticket        Master Array Append     Promo Codes (₹500/₹2500)
```

### Technical Step Breakdown:
1. **Search Inputs (`FlightSearchForm.js`)**:
   - Collects origin/destination with live fuzzy autocomplete against 12+ major airports.
   - Calculates departure/return dates via a floating portaled calendar dropdown (`createPortal` to `document.body`).
   - Validates trip type (One-Way, Round-Trip, Multi-City) and passengers count.
2. **Flight Search & Filtering (`FlightResults.js`)**:
   - Matches route criteria against `INITIAL_MOCK_FLIGHTS`.
   - Executes multi-parameter filtering (Stops: Non-stop / 1 Stop; Airlines: IndiGo, Air India, Vistara, etc.; Departure Time brackets; Price range slider).
   - Dynamic sorting: Cheapest First (`price ASC`), Fastest Flight (`durationMinutes ASC`), Earliest Departure (`departureTime ASC`).
3. **Flight Details (`FlightDetails.js`)**:
   - Renders segment timelines, aircraft equipment (A320neo, B787 Dreamliner), baggage allowances (15kg/25kg), and refundable fare policies.
4. **Passenger Details & Seat Selection (`PassengerDetails.js`)**:
   - Generates dynamic form cards for each traveller.
   - Validates input fields with regex (Name `^[a-zA-Z\s]{2,50}$`, Email `^[^\s@]+@[^\s@]+\.[^\s@]+$`, Phone `^\+?[0-9]{10,14}$`).
   - Interactive Aircraft Seat Map (`SeatSelectionModal.js`) allowing real-time seat assignment (Window, Aisle, Extra Legroom).
5. **Review & Payment Simulation (`ReviewBooking.js`)**:
   - Computes base fare, passenger multiplier, seat upgrade add-ons, taxes (12% GST), and discount coupon subtotals (`SKYDOM500`, `FLYINTL2500`).
   - Simulated payment selector (Credit/Debit Card, UPI, Net Banking) with dummy validation.
6. **Booking Creation & Confirmation (`BookingConfirmation.js`)**:
   - Generates a unique 6-character PNR reference (`SR-` + 6 uppercase alphanumeric characters).
   - Compiles a complete itinerary snapshot with boarding times, terminal, gate, baggage, and passenger manifest.
   - Provides native browser print capability (`window.print()`) with print-optimized CSS.
7. **Persistence & Lifecycle (`MyTrips.js` / `ManageBooking.js`)**:
   - Appends the new booking to the master `skyroute_bookings` array in `localStorage`.
   - Supports ticket inspection, check-in simulation, and persistent cancellation status updates across all views.

---

## 4. Data & Client Storage Architecture

SkyRoute runs entirely on client-side architecture. There are no external databases or backend server connections.

### LocalStorage Schema Map

| Key | Type | Description | Sample Structure |
| :--- | :--- | :--- | :--- |
| `skyroute_search` | `Object` | Active flight search criteria | `{"origin":"Ahmedabad (AMD)","destination":"Dubai (DXB)","tripType":"round-trip","passengers":1,"cabinClass":"Economy"}` |
| `skyroute_selected_flight` | `Object` | Flight currently selected in the booking pipeline | Full flight object (id, airline, flightNumber, times, price, etc.) |
| `skyroute_passengers` | `Array<Object>` | Active passenger manifest with contact details | `[{"id":1,"title":"Mr","firstName":"Rahul","lastName":"Sharma","email":"...","phone":"..."}]` |
| `skyroute_selected_seat` | `Object` | Selected seat assignment and tier | `{"id":"14A","row":14,"col":"A","type":"Window","price":450}` |
| `skyroute_current_booking` | `Object` | Most recently confirmed booking object | Complete booking snapshot with PNR, flight, seat, passengers, and payment breakdown |
| `skyroute_bookings` | `Array<Object>` | Master list of all historical confirmed bookings | Chronological array of confirmed and cancelled bookings |
| `skyroute_auth_user` | `Object` | Active authenticated demo user session | `{"email":"demo@skyroute.com","name":"Rahul Sharma","role":"Traveler"}` |

### Simulated vs. Real Components Clarification

| Feature | Implementation Reality | Notes |
| :--- | :--- | :--- |
| **Flight Search & Results** | Real Client-side Logic | Real-time filtering, sorting, and matching executed locally on in-memory mock datasets. |
| **Form Validation** | Real Client-side Logic | Real regex evaluation and instant DOM state validation. |
| **Date Picker Portal** | Real React Implementation | Custom lightweight calendar component rendered via React Portals directly into `document.body`. |
| **Booking Persistence** | Real Client Storage | Full persistence using browser `localStorage`. |
| **Payment Gateway** | **Simulated Demo** | UI-only simulation; no financial transactions or real credit card processing occurs. |
| **Airlines Reservation / PNR** | **Simulated Demo** | Generates pseudo-random PNR codes for client display; no real airline API / GDS connection. |
| **Authentication** | **Simulated Demo** | Client-side session management with local storage and Google OAuth mock flow. |

---

## 5. Project Directory Structure

```text
my-app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AirportInput.js         # Autocomplete airport search
│   │   ├── BaggageInfo.js          # Baggage allowance breakdown
│   │   ├── DatePickerField.js      # Portaled floating calendar widget
│   │   ├── FareSummary.js          # Itemized pricing calculator
│   │   ├── FlightCard.js           # Interactive flight search result card
│   │   ├── FlightFilters.js        # Multi-facet filter sidebar
│   │   ├── FlightItinerary.js      # Segment timeline visualization
│   │   ├── FlightSearchForm.js     # Master search query builder
│   │   ├── Header.js               # Responsive navigation with session dropdown
│   │   ├── Hero.js                 # Editorial hero section
│   │   ├── PassengerFormCard.js    # Controlled passenger inputs
│   │   ├── PassengerSelector.js    # Stepper for traveller & cabin counts
│   │   ├── SeatSelectionModal.js   # Interactive aircraft seat picker
│   │   └── Toast.js                # System notifications
│   ├── data/
│   │   ├── flights.js              # Enriched mock flight inventory
│   │   └── travelData.js           # Destination guides and categories
│   ├── pages/
│   │   ├── About.js                # Technical architecture & project overview
│   │   ├── BookingConfirmation.js  # Boarding pass & printable ticket
│   │   ├── FlightDetails.js        # Itinerary and baggage breakdown
│   │   ├── FlightResults.js        # Filterable flight search results
│   │   ├── FlightStatus.js         # Real-time origin/dest flight radar
│   │   ├── ManageBooking.js        # Rescheduling & cancellation workflow
│   │   ├── MyTrips.js              # Historical trips retrieved from localStorage
│   │   ├── PassengerDetails.js     # Traveller information collection
│   │   └── ReviewBooking.js        # Pre-checkout breakdown & simulated payment
│   ├── styles/
│   │   ├── global.scss             # Typography, central design tokens (3-color system), and reset
│   │   ├── Header.scss             # Deep Navy sticky navigation & brand bar
│   │   ├── Footer.scss             # Deep Navy footer & Clean White route cards
│   │   ├── Hero.scss               # Editorial hero section
│   │   ├── FlightSearch.scss       # Search widget & popover styling
│   │   ├── FlightResults.scss      # Filter and card styling
│   │   ├── BookingFlow.scss        # Checkout & confirmation styling
│   │   └── ...                     # Modular SCSS page-specific stylesheets
│   ├── App.js                      # Root router, state distributor, & storage sync
│   ├── App.test.js                 # Jest/RTL unit test suite
│   └── index.js                    # Application entry point
├── package.json
└── README.md
```

---

## 6. Running Locally

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation & Startup
```bash
# 1. Clone the repository
git clone https://github.com/patelmai48/skyroute-journeys.git
cd skyroute-journeys/my-app

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Run test suite
npm test -- --watchAll=false
```

---

## 7. License & Attribution

Developed by **Mahi Patel** as a modern frontend engineering demonstration.
Design system tokens inspired by **Skyscanner Backpack**.
All airline names, marks, and simulated data are used solely for educational demonstration purposes.
