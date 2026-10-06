# SkyRoute Application Flow & Architecture

This document provides a technical walkthrough of the SkyRoute frontend architecture, user flow, component hierarchy, state propagation, and browser storage lifecycle.

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
       │   Passenger & Seats    │  ◄── [/passenger-details]
       └───────────┬────────────┘
                   │ onContinue(passengerData, selectedSeat)
                   ▼
       ┌────────────────────────┐
       │     Review Booking     │  ◄── [/review-booking]
       └───────────┬────────────┘
                   │ onConfirmBooking(booking)
                   ▼
       ┌────────────────────────┐
       │  Booking Confirmation  │  ◄── [/booking-confirmation]
       └───────────┬────────────┘
                   │ onNavigate('/my-trips')
                   ▼
       ┌────────────────────────┐
       │   My Trips & Manage    │  ◄── [/my-trips, /manage-booking]
       └────────────────────────┘
```

---

## 2. Step-by-Step Technical Execution

### Step 1: Home & Flight Search (`/`)
- **Components Involved**: [`App.js`](file:///src/App.js), [`Hero.js`](file:///src/components/Hero.js), [`FlightSearchForm.js`](file:///src/components/FlightSearchForm.js), [`AirportInput.js`](file:///src/components/AirportInput.js), [`DatePickerField.js`](file:///src/components/DatePickerField.js), [`PassengerSelector.js`](file:///src/components/PassengerSelector.js).
- **Information Collected**:
  - Origin airport & city with fuzzy autocomplete (e.g. `Ahmedabad (AMD)`)
  - Destination airport & city (e.g. `Dubai (DXB)`)
  - Trip type (`one-way`, `round-trip`, `multi-city`)
  - Departure date & return date (managed via portaled calendar dropdown directly rendered to `document.body`)
  - Passenger count (1–9 travellers)
  - Cabin Class (`Economy`, `Premium Economy`, `Business`, `First Class`)
- **State & Storage**:
  - Managed in root React state `searchData` in `App.js`.
  - Persisted to `localStorage` under key `skyroute_search`.
- **Navigation Target**: User clicks **"Search Flights"** → navigates to `/flights`.

---

### Step 2: Flight Results & Filtering (`/flights`)
- **Components Involved**: [`FlightResults.js`](file:///src/pages/FlightResults.js), [`SearchSummary.js`](file:///src/components/SearchSummary.js), [`FlightFilters.js`](file:///src/components/FlightFilters.js), [`FlightCard.js`](file:///src/components/FlightCard.js).
- **Processing & Logic**:
  - Reads in-memory inventory from [`data/flights.js`](file:///src/data/flights.js).
  - Matches route pair (`origin` and `destination`).
  - Executes multi-facet filtering:
    - **Stops**: Non-stop (0 stops), 1 Stop
    - **Airlines**: IndiGo, Air India, SpiceJet, Vistara, Air India Express
    - **Departure Time**: Morning (00:00–12:00), Afternoon (12:00–18:00), Evening (18:00–24:00)
    - **Price Range Slider**: Filters flights with `price <= maxPrice`
  - Dynamic Sorting: `cheapest` (price ascending), `fastest` (duration ascending), or `earliest` (departure time).
- **Navigation Target**:
  - User clicks **"Edit Search"** → navigates back to `/`.
  - User clicks **"Select Flight"** on any card → calls `handleSelectFlight(flight)` and navigates to `/flight-details`.

---

### Step 3: Flight Details (`/flight-details`)
- **Components Involved**: [`FlightDetails.js`](file:///src/pages/FlightDetails.js), [`FlightItinerary.js`](file:///src/components/FlightItinerary.js), [`BaggageInfo.js`](file:///src/components/BaggageInfo.js), [`FareSummary.js`](file:///src/components/FareSummary.js), [`FlightInformation.js`](file:///src/components/FlightInformation.js).
- **Information Displayed**:
  - Selected flight route, airline code, aircraft equipment, duration, and schedules.
  - Segment timeline with terminal information.
  - Baggage allowances (Cabin: 7 kg, Check-in: 15–25 kg based on airline).
  - Itemized fare breakdown based on passenger count.
- **State & Storage**:
  - Stored in React state `selectedFlight` in `App.js`.
  - Persisted to `localStorage` under key `skyroute_selected_flight`.
- **Navigation Target**:
  - User clicks **"Back to Results"** → navigates to `/flights`.
  - User clicks **"Continue to Passenger Details"** → navigates to `/passenger-details`.

---

### Step 4: Passenger Details & Seat Selection (`/passenger-details`)
- **Components Involved**: [`PassengerDetails.js`](file:///src/pages/PassengerDetails.js), [`PassengerFormCard.js`](file:///src/components/PassengerFormCard.js), [`SeatSelectionModal.js`](file:///src/components/SeatSelectionModal.js), [`FlightSidebarSummary.js`](file:///src/components/FlightSidebarSummary.js).
- **Information Collected**:
  - Dynamically renders $N$ passenger cards based on `searchData.passengers`.
  - Per passenger: Title (Mr, Ms, Mrs), First Name, Last Name, Gender, Date of Birth.
  - Primary contact: Email address, Phone number, and Emergency Contact.
  - Interactive Aircraft Seat Map: Allows selecting specific seats (e.g. `14A - Window`, `14B - Middle`, `14C - Aisle`, Extra Legroom `1A`).
- **Validation**:
  - Real-time regex verification for names, email format, and 10–14 digit phone numbers.
- **State & Storage**:
  - Stored in React state `passengerData` and `selectedSeat` in `App.js`.
  - Persisted to `localStorage` under `skyroute_passengers` and `skyroute_selected_seat`.
- **Navigation Target**:
  - User clicks **"Back to Flight Details"** → navigates to `/flight-details`.
  - User clicks **"Continue to Review"** → navigates to `/review-booking`.

---

### Step 5: Review Booking & Payment Simulation (`/review-booking`)
- **Components Involved**: [`ReviewBooking.js`](file:///src/pages/ReviewBooking.js).
- **Processing & Aggregation**:
  - Combines `selectedFlight`, `searchData`, `passengerData`, and `selectedSeat`.
  - Calculates detailed cost itemization:
    - Base fare: $\text{Price per person} \times \text{Passengers}$
    - Seat upgrade fee (e.g. ₹450 for Window seat)
    - Taxes & carrier surcharges (12% GST)
    - Promotional coupon discounts (e.g. `SKYDOM500` for ₹500 off, `FLYINTL2500` for ₹2,500 off)
  - Simulated payment method selection (Credit/Debit Card, UPI, Net Banking).
- **Validation**:
  - Validates legal terms acceptance before allowing booking creation.
- **Navigation Target**:
  - User clicks **"Back to Passenger Details"** → returns to `/passenger-details` without state loss.
  - User clicks **"Confirm & Pay"** → compiles booking payload, generates PNR code, and navigates to `/booking-confirmation`.

---

### Step 6: Booking Confirmation & Boarding Pass (`/booking-confirmation`)
- **Components Involved**: [`BookingConfirmation.js`](file:///src/pages/BookingConfirmation.js).
- **Processing & Storage**:
  - Generates unique 6-character PNR reference (`SR-` + 6 alphanumeric characters).
  - Compiles full booking snapshot with `status: "Confirmed"`.
  - Appends booking to master `skyroute_bookings` array in `localStorage`.
  - Updates `skyroute_current_booking` in `localStorage`.
- **Information Displayed**:
  - Boarding-pass style ticket view with printable barcode graphic and segment breakdown.
  - Quick action buttons: **"Print Ticket"** (`window.print()`), **"View My Trips"**, and **"Book Another Flight"**.
- **Navigation Target**:
  - User clicks **"View My Trips"** → navigates to `/my-trips`.
  - User clicks **"Book Another Flight"** → navigates to `/`.

---

### Step 7: My Trips & Manage Booking (`/my-trips`, `/manage-booking`)
- **Components Involved**: [`MyTrips.js`](file:///src/pages/MyTrips.js), [`ManageBooking.js`](file:///src/pages/ManageBooking.js).
- **Processing & Retrieval**:
  - Reads `localStorage.getItem('skyroute_bookings')`.
  - Displays all confirmed and historical trips.
  - Supports live cancellation with immediate state updates synchronized to the master `skyroute_bookings` array in `localStorage`.
  - Displays interactive boarding pass when selecting any previous trip.

---

## 3. Persistent Data Flow Summary

```text
[ User Inputs Search ] ──► localStorage['skyroute_search']
                                     │
[ Selects Itinerary ]  ──► localStorage['skyroute_selected_flight']
                                     │
[ Enters Passengers ]  ──► localStorage['skyroute_passengers']
                                     │
[ Selects Seat ]       ──► localStorage['skyroute_selected_seat']
                                     │
[ Confirms Booking ]   ──► localStorage['skyroute_current_booking']
                                     │
                                     ▼
                           localStorage['skyroute_bookings'] (Master History Array)
```
