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

## 4. Data & Backend Storage Architecture

SkyRoute operates a hybrid production architecture:
- **Backend API (`/backend`)**: Node.js/Express service with persistent PostgreSQL database support (configured via `DATABASE_URL` with SSL in production). Migrated from SQLite to guarantee data durability on containerized and serverless hosts (Render, Railway, Fly.io) where ephemeral disk resets wipe SQLite files.
- **Automated Schema Provisioning**: Idempotent schema migrations (`initSchema`) run automatically at server startup to ensure `users` and `bookings` tables and indexes exist without manual SQL execution.
- **Frontend Fallback**: In development mode, the React frontend can gracefully fall back to local mock data if the backend server is offline. In **production mode**, it presents an honest, clear "Server unavailable, please try again" status to ensure users are aware when live reservation transactions cannot be processed.

### LocalStorage Schema Map (Client-Side State)

| Key | Type | Description | Sample Structure |
| :--- | :--- | :--- | :--- |
| `skyroute_token` | `String` | JWT authentication bearer token | Standard signed JWT |
| `skyroute_auth_user` | `Object` | Active authenticated user profile | `{"id":1,"email":"user@example.com","name":"Mahi Patel"}` |
| `skyroute_search` | `Object` | Active flight search criteria | `{"origin":"Ahmedabad (AMD)","destination":"Dubai (DXB)","tripType":"round-trip","passengers":1,"cabinClass":"Economy"}` |
| `skyroute_selected_flight` | `Object` | Flight currently selected in the booking pipeline | Full flight object (id, airline, flightNumber, times, price, etc.) |
| `skyroute_passengers` | `Array<Object>` | Active passenger manifest with contact details | `[{"id":1,"title":"Mr","firstName":"Rahul","lastName":"Sharma","email":"...","phone":"..."}]` |
| `skyroute_selected_seat` | `Object` | Selected seat assignment and tier | `{"id":"14A","row":14,"col":"A","type":"Window","price":450}` |
| `skyroute_current_booking` | `Object` | Most recently confirmed booking object | Complete booking snapshot with PNR, flight, seat, passengers, and payment breakdown |
| `skyroute_bookings` | `Array<Object>` | Master list of all historical confirmed bookings | Chronological array of confirmed and cancelled bookings |

### Simulated vs. Real Components Clarification

| Feature | Implementation Reality | Notes |
| :--- | :--- | :--- |
| **Flight Search & Results** | Real Full-Stack API / Database | Queryable via `GET /api/flights` with real-time route, airline, and price filtering. In dev, falls back to local data if backend is offline. |
| **Authentication & Users** | Real PostgreSQL + JWT Auth | User registration and login persisted in PostgreSQL with `bcryptjs` password hashing and signed JWT sessions. |
| **Bookings & PNR Records** | Real PostgreSQL Persistence | Confirmed bookings and cancellations stored in PostgreSQL with unique PNR indexing and user authorization scoping. |
| **Payment Gateway** | **Simulated Demo** | UI-only simulation; no financial transactions or real credit card processing occurs. Payment UI explicitly states simulation. |
| **Airlines Reservation / GDS** | **Simulated Demo** | Generates pseudo-random PNR codes for SkyRoute demonstration; not connected to live Sabre/Amadeus GDS. |

---

## 5. Project Directory Structure

```text
my-app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/                 # Atomic UI components
│   ├── data/                       # Fallback datasets and travel guides
│   ├── pages/                      # Page route controllers (FlightResults, Login, ReviewBooking, MyTrips)
│   ├── services/
│   │   ├── api.js                  # Frontend API client
│   │   └── googleAuth.js           # Google Identity Services OAuth helper
│   ├── styles/                     # Modular SCSS stylesheets & brand design tokens
│   ├── App.js                      # Root router, state distributor, & storage sync
│   ├── App.test.js                 # Frontend unit test suite (12 tests)
│   ├── api.js                      # Centralized resilient API client
│   └── index.js                    # Application entry point
├── backend/
│   ├── scripts/
│   │   └── smoke.js                # Full lifecycle 8-step smoke testing script
│   ├── src/
│   │   ├── app.js                  # Express application with Helmet, CORS, and trust-proxy
│   │   ├── auth.js                 # JWT & bcrypt authentication
│   │   ├── db.js                   # PostgreSQL connection pool & idempotent migrations
│   │   ├── server.js               # Entry point (port 5000, startup sanity checks)
│   │   ├── data/flights.js         # Flight inventory data & query helpers
│   │   └── routes/
│   │       ├── auth.js             # /api/auth (register, login, me)
│   │       ├── bookings.js         # /api/bookings (create, list, cancel)
│   │       └── flights.js          # /api/flights (search, filters, sort)
│   ├── test/api.test.js            # Automated backend API test suite (15 tests via in-memory Postgres)
│   ├── render.yaml                 # Render Blueprint specification
│   ├── .env.example
│   └── package.json
├── render.yaml                     # Root Render Blueprint specification
├── vercel.json                     # Vercel SPA rewrite & build configuration
├── package.json
└── README.md
```

---

## 6. Environment Variables

### Backend (`my-app/backend/.env`)
| Variable | Required? | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `5000` | HTTP port for Express server. |
| `NODE_ENV` | Required in prod | `production` / `development` | Enables production hardening (strict secrets check, SSL for DB, CORS restrictions). |
| `DATABASE_URL` | **Required in prod** | `postgresql://user:pass@host:5432/skyroute?sslmode=require` | PostgreSQL connection string (Neon, Supabase, RDS, or local). |
| `JWT_SECRET` | **Required in prod** | Random 32+ character string | Secret key for signing and verifying JWT tokens (minimum 16 characters). |
| `CORS_ORIGIN` | Required in prod | `https://your-frontend.vercel.app` | Whitelist of allowed frontend origins (comma-separated if multiple). |

### Frontend (`my-app/.env`)
| Variable | Required? | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `REACT_APP_API_URL` | Required in prod | `https://your-backend.onrender.com` | Base URL of deployed backend Express API (**must be set before building bundle**). |
| `REACT_APP_GOOGLE_CLIENT_ID` | Optional | `xyz.apps.googleusercontent.com` | Google OAuth 2.0 Web Client ID from Google Cloud Console. |
| `PORT` | Optional | `3000` | Local development port. |
| `GENERATE_SOURCEMAP` | Optional | `false` | Disables production sourcemaps for privacy and bundle size optimization. |

---

## 7. Running Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- PostgreSQL (optional for local dev if testing against live DB; tests use in-memory `pg-mem`)

### Setup & Startup

```bash
# 1. Clone repository
git clone https://github.com/patelmai48/skyroute-journeys.git
cd skyroute-journeys/my-app

# 2. Install dependencies for both frontend and backend
npm install
npm --prefix backend install

# 3. Configure local environment files
cp .env.example .env
cp backend/.env.example backend/.env

# 4. Run automated test suites
npm test -- --watchAll=false       # Frontend Jest test suite (12 tests)
npm run server:test                 # Backend Node.js test suite (15 tests via in-memory Postgres)

# 5. Start development servers
npm run server:dev                  # Terminal 1: Starts Express backend on http://localhost:5000
npm start                           # Terminal 2: Starts React frontend on http://localhost:3000
```

### Running the End-to-End Smoke Test

Run the automated smoke test script against any running SkyRoute backend:
```bash
# Against local server
npm run server:smoke

# Or against custom URL / staging / production
node backend/scripts/smoke.js http://localhost:5000
node backend/scripts/smoke.js https://skyroute-api.onrender.com
```

---

## 8. Step-by-Step Production Deployment Guide

Deploying SkyRoute for free requires three external platforms: **Neon** (PostgreSQL database), **Render** (Node.js backend API), and **Vercel** (React single-page application).

### Step 1: Provision Managed PostgreSQL (Neon / Supabase)
1. Go to [Neon.tech](https://neon.tech) and sign up for a free account.
2. Click **Create Project**, choose a region close to your users, and create a database named `skyroute` (or default `neondb`).
3. Under the project dashboard, copy the **Connection string** (Direct connection or Pooled connection). It looks like:
   ```text
   postgresql://alex:AbCdEf1234@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. *Note on migrations*: You do **not** need to manually run SQL scripts. When the SkyRoute backend starts, it automatically executes idempotent migrations (`initSchema`) to create `users` and `bookings` tables and indexes.

### Step 2: Deploy Backend API on Render
1. Go to [Render Dashboard](https://dashboard.render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`skyroute-journeys`).
3. Configure the service settings:
   - **Name**: `skyroute-api`
   - **Root Directory**: `my-app/backend` (or leave blank if repository root is `/backend`)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: `Free`
4. Expand **Advanced** -> **Health Check Path** and set:
   - `/api/health`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Paste your Neon connection string from Step 1)*
   - `JWT_SECRET`: *(Generate a secure random string of 32+ characters)*
   - `CORS_ORIGIN`: `http://localhost:3000` *(Temporary placeholder; will be updated after Vercel deployment)*
6. Click **Deploy Web Service**.
7. Once deployed, test the health check in your browser: `https://<your-render-subdomain>.onrender.com/api/health`. It should return:
   ```json
   {"status":"ok","database":"connected","time":"..."}
   ```
8. Copy your Render service URL (e.g., `https://skyroute-api.onrender.com`).

### Step 3: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click edit and select `my-app`
4. Expand **Environment Variables** (**CRITICAL**: Create React App embeds `REACT_APP_*` variables at compile time, so these must be set before the build runs):
   - `REACT_APP_API_URL`: `https://<your-render-subdomain>.onrender.com`
   - `REACT_APP_GOOGLE_CLIENT_ID`: *(Your Google OAuth client ID, if configured)*
5. Click **Deploy**.
6. When the build completes, Vercel will assign a production domain (e.g. `https://skyroute-journeys.vercel.app`).
   - Client-side routes (e.g. `/results`, `/my-trips`, `/flight-details`) will not 404 on refresh thanks to `vercel.json` rewrite routing.

### Step 4: Link CORS Origin in Render
1. Return to the **Render Dashboard** -> Open your `skyroute-api` service.
2. Go to **Environment** tab.
3. Update `CORS_ORIGIN` to your exact live Vercel domain:
   ```text
   https://skyroute-journeys.vercel.app
   ```
   *(If you want to support both localhost and production, separate them with a comma: `https://skyroute-journeys.vercel.app,http://localhost:3000`)*
4. Click **Save Changes**. Render will automatically redeploy the backend service.

### Step 5: Configure Google OAuth (Google Cloud Console)
If you enable Google Sign-In with `REACT_APP_GOOGLE_CLIENT_ID`:
1. Open [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
2. Click on your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local development)
   - `https://<your-actual-subdomain>.vercel.app` (for production)
4. Under **Authorized redirect URIs**:
   - SkyRoute uses Google Identity Services popup/token authorization (`google.accounts.oauth2.initTokenClient`), so redirect URIs are typically not required. If requested by Google Cloud Console or using redirect flow, add:
     - `http://localhost:3000`
     - `https://<your-actual-subdomain>.vercel.app`
5. Save the OAuth client configuration.

### Step 6: Verify Deployment with the Smoke Test
Run the smoke test script against your live Render API:
```bash
node backend/scripts/smoke.js https://skyroute-api.onrender.com
```
All 8 steps (Health, Register, Login, Auth Verification, Flight Search, Create Booking, List Bookings, Cancel Booking) should print `[PASS]`.

---

## 8. License & Attribution

Developed by **Mahi Patel** as a modern full-stack engineering demonstration.
Design system tokens inspired by **Skyscanner Backpack**.
All airline names, marks, and simulated data are used solely for educational demonstration purposes.
