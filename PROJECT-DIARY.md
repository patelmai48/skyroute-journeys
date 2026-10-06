# SkyRoute Project Diary

A detailed technical log documenting the conception, implementation phases, challenges encountered, and architectural evolution of the SkyRoute flight-booking application.

---

## 1. Project Idea

The objective of SkyRoute was to create a modern, realistic, and highly polished flight-booking web application. The goal was to build a comprehensive frontend simulation that models the complete user journey—from discovering flights to reviewing fares, entering passenger details, and generating booking confirmations—with production-grade aesthetics and UX standards.

---

## 2. Initial Project & Foundation

The project began from a foundational Skyscanner Backpack setup containing early calendar and flight schedule components. While the component libraries (`@skyscanner/backpack-web`, `bpk-component-calendar`) provided base building blocks, the initial interface was unstyled and lacked end-to-end booking flow capabilities. 

The first step was establishing a unified design system in SCSS:
- Deep Navy primary tones (`#143F67`), Warm Gold accents (`#E4B46C`), and Clean White backgrounds (`#FAFBFC` / `#FFFFFF`).
- Reusable elevation shadows, card containers, and standard button variants.
- Global reset and responsive typography standards.

---

## 3. Building the Home & Flight Search Page

The Home page was built around the core `FlightSearchForm` component:
- **Airport Selection**: Created `AirportInput` with instant suggestions for major hubs (Ahmedabad, Mumbai, Delhi, Bengaluru, London, Paris, etc.).
- **Trip Types**: Added tabbed toggles for `Round Trip` vs `One Way` configurations.
- **Backpack Calendar Integration**: Integrated `bpk-component-calendar` within a popover date picker field (`DatePickerField`) that manages departure and return date selection.
- **Passenger Counter**: Implemented `PassengerSelector` allowing users to configure adult, child, and infant passenger counts along with cabin class selection.

---

## 4. Building Flight Results

The flight search results view (`/flights`) was engineered to display and filter matching flights:
- **Mock Flight Dataset**: Created a comprehensive dataset in `src/data/flights.js` with realistic airline codes (IndiGo `6E`, Air India `AI`, SpiceJet `SG`, Vistara `UK`), departure/arrival schedules, durations, stops, and pricing.
- **`FlightCard` Component**: Designed flight cards displaying airline logos, departure and arrival times, flight duration badges, stop indicators, and transparent pricing.
- **Filtering System (`FlightFilters`)**: Enabled multi-criteria filtering:
  - Stops: Non-stop, 1 Stop
  - Airlines: IndiGo, Air India, SpiceJet, Vistara
  - Departure Time Slots: Morning, Afternoon, Evening
  - Price Slider: Dynamic maximum budget filtering
- **Sorting System**: Added options to sort by Cheapest, Fastest, and Earliest departure.
- **Rendering with `.map()`**: Dynamically mapped filtered flight items with zero-state handling when no flights match the criteria.

---

## 5. Flight Details

The `/flight-details` page was built to provide transparency before proceeding to traveller information:
- Displayed the chosen itinerary timeline with departure/arrival terminals.
- Included `BaggageInfo` outlining hand baggage (7 kg) and check-in baggage allowances (15–20 kg).
- Included `FareSummary` detailing base fares, carrier surcharges, and total calculation.
- Added graceful fallback handling for cases where a user navigates directly to `/flight-details` without selecting a flight.

---

## 6. Passenger Details

The `/passenger-details` page handles complex multi-passenger data collection:
- **Dynamic Form Generation**: Rendered individual `PassengerFormCard` sections based on the number of passengers selected during search.
- **Validation**:
  - Required fields (First name, Last name, Title, Gender, Date of Birth).
  - Regular expression format checks for primary contact email and phone number.
- **State Management**: Form inputs update an active array of passenger objects in React state while syncing to `localStorage`.

---

## 7. Review Booking

The `/review-booking` page serves as the pre-confirmation gateway:
- Aggregated flight details, passenger lists, and fare itemization onto a clean two-column review card.
- Implemented an interactive legal terms checkbox required to enable the **Confirm Booking** action.
- Added a non-destructive `"← Back to Passenger Details"` navigation link that preserves all entered inputs.

---

## 8. Booking Confirmation

The `/booking-confirmation` page provides realistic feedback upon successful booking:
- Generated a unique booking reference code (e.g. `SKR-AMD-64821`).
- Designed a digital boarding pass ticket view with barcode graphics, flight route badges, and passenger seat assignments.
- Implemented `window.print()` integration for the `"Print Ticket"` action.
- Persisted confirmed bookings into the persistent `skyroute_bookings` collection in `localStorage`.

---

## 9. My Bookings

The `/my-bookings` portal allows users to review previously confirmed bookings:
- Reads historical booking objects directly from `localStorage`.
- Allows clicking any past booking card to inspect the full boarding pass on `/booking-confirmation`.
- Implemented a clean empty state with a direct CTA to search flights when no bookings exist.

---

## 10. About & Login Pages

- **About Page (`/about`)**: Created a dedicated portfolio and overview page highlighting SkyRoute's purpose, a 4-step user journey, 6 feature cards, an accurate technology stack, and an explicit demo disclaimer.
- **Login Page (`/login`)**: Built a frontend demo authentication page featuring email/password input validation, show/hide password toggle, "Remember me" email persistence, and demo notice cards.

---

## 11. Responsive Design

All pages were tested and optimized across standard screen breakpoints (1440px, 1200px, 1024px, 768px, 390px, 375px):
- Desktop multi-column grid layouts automatically collapse to single-column flex stacks on smaller screens.
- Form inputs, buttons, and filter drawers adapt to 100% viewport width on mobile devices.
- Prevented horizontal overflow through responsive container max-widths and flex-wrap properties.

---

## 12. Real Problems Encountered & Fixes Applied

During development, several technical challenges were identified and resolved:
1. **SASS Compiler & Deprecations**:
   - *Problem*: Modern `sass` package threw deprecation warnings and import resolution conflicts with legacy Backpack SASS mixins.
   - *Fix*: Configured a custom Webpack loader (`sass-custom-loader.js`) and silenced legacy deprecations for clean compilation.
2. **Booking Confirmation Responsive Clipping**:
   - *Problem*: On mobile viewports (< 500px), the left edge of the confirmation ticket was partially clipped due to fixed container widths.
   - *Fix*: Refactored container rules in `BookingFlow.scss` to use `width: 100%`, `box-sizing: border-box`, and replaced fixed pixel offsets with flexible flexbox alignment.
3. **State Loss on Direct Page Access**:
   - *Problem*: Refreshing `/flight-details` or `/review-booking` previously wiped in-memory component state.
   - *Fix*: Implemented `localStorage` hydration hooks that automatically restore `searchData`, `selectedFlight`, `passengerData`, and `currentBooking` on initial component mount.
4. **Active Route Indication**:
   - *Problem*: Header links did not consistently reflect active sub-routes (e.g. `/about` or `/login`).
   - *Fix*: Centralized route state tracking in `App.js` and passed `currentRoute` to the `Header` component to dynamically apply active indicator classes.

---

## 13. What I Learned

Key frontend engineering takeaways from building SkyRoute:
- Structuring scalable React applications with clean separation between pages, reusable components, and stylesheets.
- Managing multi-step form workflows with localized validation and persistent browser storage.
- Implementing complex array filtering and sorting pipelines efficiently in client-side JavaScript.
- Developing modular SCSS systems without relying on third-party utility frameworks.

---

## 14. Future Improvements

Potential future enhancements for future versions:
- **Backend API Integration**: Node.js/Express or Python/Flask backend service to handle flight search endpoints.
- **Database Storage**: MongoDB or PostgreSQL database for persistent multi-user accounts.
- **Authentication**: Secure JWT or OAuth-based user login and registration.
- **Live Flight API**: Connecting to external flight schedule APIs (Amadeus, AviationStack, or Skyscanner).
- **Payment Gateway**: Simulated or sandbox Stripe/Razorpay checkout integration.
