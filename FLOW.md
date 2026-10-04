# SkyRoute Application Flow

This document provides a technical walkthrough of the SkyRoute frontend architecture, user flow, component hierarchy, and data propagation lifecycle.

---

## 1. Flow Diagram

```text
       ┌────────────────────────┐
       │   Home (Search Form)   │  ◄── [/]
       └───────────┬────────────┘
                   │ onSearch(searchData)
                   ▼
       ┌────────────────────────┐
       │     Flight Results     │  ◄── [/flights]
       └───────────┬────────────┘
                   │ onSelectFlight(flight)
                   ▼
       ┌────────────────────────┐
       │     Flight Details     │  ◄── [/flight-details]
       └───────────┬────────────┘
                   │ onContinue()
                   ▼
       ┌────────────────────────┐
       │   Passenger Details    │  ◄── [/passenger-details]
       └───────────┬────────────┘
                   │ onContinue(passengerData)
                   ▼
       ┌────────────────────────┐
       │     Review Booking     │  ◄── [/review-booking]
       └───────────┬────────────┘
                   │ onConfirmBooking(booking)
                   ▼
       ┌────────────────────────┐
       │  Booking Confirmation  │  ◄── [/booking-confirmation]
       └───────────┬────────────┘
                   │ onNavigateMyBookings()
                   ▼
       ┌────────────────────────┐
       │      My Bookings       │  ◄── [/my-bookings]
       └────────────────────────┘
```

---

## 2. Step-by-Step Technical Execution

### Step 1: Home & Flight Search (`/`)
- **Components Involved**: [`App.js`](file:///src/App.js), [`Hero.js`](file:///src/components/Hero.js), [`FlightSearchForm.js`](file:///src/components/FlightSearchForm.js), [`AirportInput.js`](file:///src/components/AirportInput.js), [`DatePickerField.js`](file:///src/components/DatePickerField.js), [`PassengerSelector.js`](file:///src/components/PassengerSelector.js).
- **Information Collected**:
  - Origin airport & city (e.g., `Ahmedabad (AMD)`)
  - Destination airport & city (e.g., `Mumbai (BOM)`)
  - Trip type (`round-trip` or `one-way`)
  - Departure date & return date (managed via Backpack Calendar)
  - Passenger breakdown (Adults, Children, Infants)
  - Cabin Class (Economy, Premium Economy, Business, First)
- **State & Storage**:
  - Stored in React state `searchData` in `App.js`.
  - Persisted to `localStorage` under key `skyroute_search`.
- **Navigation Target**: User clicks **"Search Flights"** → navigates to `/flights`.

---

### Step 2: Flight Results & Filtering (`/flights`)
- **Components Involved**: [`FlightResults.js`](file:///src/pages/FlightResults.js), [`SearchSummary.js`](file:///src/components/SearchSummary.js), [`FlightFilters.js`](file:///src/components/FlightFilters.js), [`FlightCard.js`](file:///src/components/FlightCard.js).
- **Processing & Logic**:
  - Retrieves mock flight dataset from [`data/flights.js`](file:///src/data/flights.js).
  - Matches route pair (`origin` and `destination`); falls back to available demo flights if exact route is not in the mock dataset.
  - Applies active filter conditions:
    - **Stops**: Non-stop, 1 Stop
    - **Airlines**: IndiGo, Air India, SpiceJet, Vistara
    - **Departure Time**: Morning (00:00–12:00), Afternoon (12:00–18:00), Evening (18:00–24:00)
    - **Price Range Slider**: Filters flights with `price <= maxPrice`
  - Applies active sorting: `cheapest` (price ascending), `fastest` (duration ascending), or `earliest` (departure time).
- **Navigation Target**:
  - User clicks **"Edit Search"** → navigates back to `/`.
  - User clicks **"Select Flight"** on any card → calls `handleSelectFlight(flight)` and navigates to `/flight-details`.

---

### Step 3: Flight Details (`/flight-details`)
- **Components Involved**: [`FlightDetails.js`](file:///src/pages/FlightDetails.js), [`FlightItinerary.js`](file:///src/components/FlightItinerary.js), [`BaggageInfo.js`](file:///src/components/BaggageInfo.js), [`FareSummary.js`](file:///src/components/FareSummary.js), [`FlightInformation.js`](file:///src/components/FlightInformation.js).
- **Information Displayed**:
  - Selected flight route, airline code, aircraft type, duration, and departure/arrival times.
  - Detailed segment timeline with airport terminal information.
  - Baggage allowances (Cabin: 7 kg, Check-in: 15–20 kg based on airline).
  - Fare breakdown calculation based on passenger count.
- **State & Storage**:
  - Stored in React state `selectedFlight` in `App.js`.
  - Persisted to `localStorage` under key `skyroute_selected_flight`.
  - Fallback check: If no flight is selected, displays an empty state with a `"Back to Flights"` button.
- **Navigation Target**:
  - User clicks **"Back to Results"** → navigates to `/flights`.
  - User clicks **"Continue to Passenger Details"** → navigates to `/passenger-details`.

---

### Step 4: Passenger Details (`/passenger-details`)
- **Components Involved**: [`PassengerDetails.js`](file:///src/pages/PassengerDetails.js), [`PassengerFormCard.js`](file:///src/components/PassengerFormCard.js), [`FlightSidebarSummary.js`](file:///src/components/FlightSidebarSummary.js).
- **Information Collected**:
  - Dynamically renders $N$ passenger cards based on `searchData.passengers`.
  - Per passenger: Title (Mr, Ms, Mrs), First Name, Last Name, Gender, Date of Birth.
  - Primary contact: Email address, Phone number, and Emergency Contact details.
- **Validation**:
  - Validates required fields, valid email structure (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), and minimum 10-digit phone format.
  - Shows clear inline validation messages without native browser popups.
- **State & Storage**:
  - Stored in React state `passengerData` in `App.js`.
  - Persisted to `localStorage` under key `skyroute_passengers`.
- **Navigation Target**:
  - User clicks **"Back to Flight Details"** → navigates to `/flight-details`.
  - User clicks **"Continue to Review"** → navigates to `/review-booking`.

---

### Step 5: Review Booking (`/review-booking`)
- **Components Involved**: [`ReviewBooking.js`](file:///src/pages/ReviewBooking.js).
- **Processing & Aggregation**:
  - Combines `selectedFlight`, `searchData`, and `passengerData`.
  - Calculates detailed cost itemization:
    - Base fare: $\text{Price per person} \times \text{Passengers}$
    - Taxes & carrier surcharges (12%)
    - Passenger service fees & airport charges
    - Total gross booking price
  - Interactive terms and conditions confirmation checkbox.
- **Validation**:
  - Ensures the acknowledgement checkbox is checked before enabling booking confirmation.
- **Navigation Target**:
  - User clicks **"Back to Passenger Details"** → navigates to `/passenger-details` without losing form inputs.
  - User clicks **"Confirm Booking"** → compiles booking payload, creates unique reference ID, and navigates to `/booking-confirmation`.

---

### Step 6: Booking Confirmation (`/booking-confirmation`)
- **Components Involved**: [`BookingConfirmation.js`](file:///src/pages/BookingConfirmation.js).
- **Processing & Storage**:
  - Generates a simulated booking object:
    - `bookingId`: Unique alphanumeric code (e.g. `SKR-BOM-98214`)
    - `bookingDate`: Current ISO timestamp
    - `status`: `"Confirmed"`
    - Full flight, traveller, and fare snapshots
  - Updates `skyroute_bookings` array in `localStorage` (prepending the new booking).
  - Sets `skyroute_current_booking` in `localStorage`.
- **Information Displayed**:
  - Boarding-pass style ticket view with scannable barcode graphic.
  - Flight times, terminals, baggage allowance, passenger seat allocations.
  - Quick action buttons: **"Print Ticket"** (triggers `window.print()`), **"View My Bookings"**, and **"Book Another Flight"**.
- **Navigation Target**:
  - User clicks **"View My Bookings"** → navigates to `/my-bookings`.
  - User clicks **"Book Another Flight"** → navigates to `/`.

---

### Step 7: My Bookings (`/my-bookings`)
- **Components Involved**: [`MyBookings.js`](file:///src/pages/MyBookings.js).
- **Processing & Retrieval**:
  - Reads `localStorage.getItem('skyroute_bookings')`.
  - Renders a list of all historical confirmed bookings with filter/search tabs.
  - Empty state with a `"Search Flights"` CTA if no previous bookings exist.
- **Interactive Actions**:
  - Clicking any booking card loads its snapshot into `currentBooking` and opens the full ticket view on `/booking-confirmation`.
  - Provides a demo cancellation option to remove a booking from local storage.

---

## 3. Persistent Data Flow Summary

```text
[ User Inputs Search ] ──► localStorage['skyroute_search']
                                     │
[ Selects Itinerary ]  ──► localStorage['skyroute_selected_flight']
                                     │
[ Enters Passengers ]  ──► localStorage['skyroute_passengers']
                                     │
[ Confirms Booking ]   ──► localStorage['skyroute_current_booking']
                                     │
                                     ▼
                           localStorage['skyroute_bookings'] (Array of all bookings)
```
