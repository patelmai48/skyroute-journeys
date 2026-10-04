# SkyRoute — Flight Booking Demo

SkyRoute is a responsive frontend flight-booking demonstration built with React and JavaScript. It simulates the complete journey from searching for a flight to reviewing and confirming a booking.

---

## Features

- **Flight Search**: Search flights across popular domestic and international routes with instant airport autocomplete.
- **Trip Types**: Support for both round-trip and one-way journey configurations.
- **Date Selection**: Interactive date picking powered by Backpack Calendar with departure and return date syncing.
- **Passenger Selection**: Dynamic counter for adult, child, and infant travellers with cabin class selection (Economy, Premium Economy, Business, First).
- **Flight Results**: Real-time display of matching flights with airline branding, departure/arrival schedules, stops, and pricing.
- **Flight Filtering**: Multi-parameter filter panel for stops (Non-stop, 1 Stop), airlines (IndiGo, Air India, SpiceJet, Vistara), departure times, and price range.
- **Flight Sorting**: Sort flights by Cheapest First, Fastest Flight, or Earliest Departure.
- **Flight Details**: Comprehensive overview of the selected flight with full segment itinerary, baggage allowance, and fare breakdown.
- **Passenger Details**: Dynamic passenger forms with validation for names, emails, phone numbers, and title selections.
- **Form Validation**: Real-time input checking and inline field validation messages without disruptive browser alert popups.
- **Booking Review**: Complete pre-checkout review screen displaying traveller details, baggage, flight breakdown, and legal acknowledgement.
- **Simulated Booking Confirmation**: Automated booking reference code generation with interactive boarding-pass style itinerary, print capability, and summary details.
- **My Bookings**: Dedicated portal to retrieve, inspect, and manage previously confirmed bookings stored locally.
- **LocalStorage Persistence**: Browser storage integration for active search criteria, selected itineraries, traveller information, and booking history.
- **Demo Login**: Frontend-only demo authentication flow with input validation, password toggle, and "Remember me" email support.
- **Responsive Design**: Pixel-perfect layout optimization across desktop (1440px/1200px), tablet (1024px/768px), and mobile (390px/375px) viewports with zero horizontal overflow.

---

## Tech Stack

The application is built strictly using the following verified technologies:

- **React 17.0.2**: Core library for UI rendering and component-based architecture.
- **JavaScript (ES6+)**: Application logic, state management, and data transformations.
- **Backpack Design System**:
  - `@skyscanner/backpack-web` (^15.1.0)
  - `bpk-component-calendar` (^15.1.0)
  - `bpk-mixins` (^36.1.1)
  - `bpk-stylesheets` (^7.2.16)
- **Modular SCSS**: Custom styling, CSS Grid, Flexbox layouts, and design tokens without external CSS frameworks like Tailwind.
- **HTML5 History API**: Client-side single-page routing (`window.history.pushState` & `popstate`).
- **Browser LocalStorage API**: Client-side persistence for searches, passenger data, and confirmed bookings.

---

## Project Structure

```text
my-app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AirportInput.js
│   │   ├── BaggageInfo.js
│   │   ├── DatePickerField.js
│   │   ├── FareSummary.js
│   │   ├── FlightCard.js
│   │   ├── FlightFilters.js
│   │   ├── FlightInformation.js
│   │   ├── FlightItinerary.js
│   │   ├── FlightSearchForm.js
│   │   ├── FlightSidebarSummary.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── PassengerFormCard.js
│   │   ├── PassengerSelector.js
│   │   └── SearchSummary.js
│   ├── data/
│   │   └── flights.js
│   ├── pages/
│   │   ├── About.js
│   │   ├── BookingConfirmation.js
│   │   ├── FlightDetails.js
│   │   ├── FlightResults.js
│   │   ├── Login.js
│   │   ├── MyBookings.js
│   │   ├── PassengerDetails.js
│   │   └── ReviewBooking.js
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── About.scss
│   │   ├── BookingFlow.scss
│   │   ├── FlightDetails.scss
│   │   ├── FlightResults.scss
│   │   ├── FlightSearch.scss
│   │   ├── Footer.scss
│   │   ├── Header.scss
│   │   ├── Hero.scss
│   │   ├── Login.scss
│   │   ├── PassengerDetails.scss
│   │   └── global.scss
│   ├── App.js
│   ├── App.scss
│   ├── App.test.js
│   └── index.js
├── .env
├── .gitignore
├── DECISIONS.md
├── FLOW.md
├── PROJECT-DIARY.md
├── README.md
├── package.json
├── package-lock.json
└── sass-custom-loader.js
```

---

## User Flow

```text
Home (Flight Search)
      ↓
Flight Results (Filter & Sort)
      ↓
Flight Details (Itinerary & Baggage)
      ↓
Passenger Details (Traveller Information & Validation)
      ↓
Review Booking (Fare Summary & Confirmation Checkbox)
      ↓
Booking Confirmation (Boarding Pass & Booking Reference)
      ↓
My Bookings (Historical Itineraries & LocalStorage Retrieval)
```

---

## Getting Started

### Prerequisites
- Node.js (v14+ or higher recommended)
- npm (v6+ or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mahipatel/skyroute-flight-booking.git
   cd skyroute-flight-booking/my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Demo Limitation

> [!NOTE]
> **SkyRoute is a frontend demonstration project.** Flight availability, pricing, booking confirmation, payment and authentication are simulated. No real airline reservation or payment is processed.

---

## Learning Outcomes

This project demonstrates core modern frontend engineering principles:
- **React Component Architecture**: Breaking complex UIs into clean, modular, and reusable components.
- **Client-Side State Management**: Synchronizing user interactions across forms, modals, filter sidebars, and multi-page flows.
- **Form Handling & Validation**: Custom input validation with immediate feedback and error state handling.
- **Complex Array Operations**: Multi-criteria filtering, sorting algorithms, and data mapping.
- **Browser Persistence**: Utilizing `localStorage` to retain state across sessions and build persistent flows.
- **Responsive SCSS Design**: Crafting custom grid and flex layouts that adapt gracefully without third-party utility frameworks.

---

## Author

**Mahi Patel**
