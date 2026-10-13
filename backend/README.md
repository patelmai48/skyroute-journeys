# SkyRoute Backend

Express + PostgreSQL API for SkyRoute: user authentication (JWT) and booking management.

## Run it

```bash
npm install
cp .env.example .env      # configure JWT_SECRET and DATABASE_URL (or runs with pg-mem in dev)
npm run dev               # http://localhost:5000
npm test                  # 15 automated API tests
npm run smoke             # End-to-end production smoke test suite
```

## API

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/api/health` | no | Health check |
| GET | `/api/flights` | no | Flight inventory search, filter by stops/airline/price, and sort |
| POST | `/api/auth/register` | no | `{name, email, password}` → `{user, token}` |
| POST | `/api/auth/login` | no | `{email, password}` → `{user, token}` |
| GET | `/api/auth/me` | yes | Current user profile |
| POST | `/api/bookings` | yes | Create booking with server-calculated price, returns 6-char PNR |
| GET | `/api/bookings` | yes | Your bookings, newest first (My Trips) |
| GET | `/api/bookings/:pnr` | yes | Specific booking details |
| POST | `/api/bookings/:pnr/cancel` | yes | Cancel a booking (once) |

Send the JWT token as `Authorization: Bearer <token>`.

Sample Booking Body:

```json
{
  "flight": { "airline": "Vistara", "from": "AMD", "to": "BOM", "price": 6850 },
  "passengers": [{ "firstName": "Mahi", "lastName": "Patel", "email": "mahi@example.com" }],
  "seat": "4A",
  "coupon": "SKYDOM500",
  "insurance": "none"
}
```

## What is in it

- PostgreSQL with `pg` connection pool and indexed tables for users and bookings
- In-memory PostgreSQL (`pg-mem`) for zero-dependency testing and dev fallback
- Passwords hashed with `bcryptjs` (configurable salt rounds); JWT expires in 7 days
- Input validation with `zod` schemas on every write route
- Server-side price calculation enforcing fares, taxes, seat add-ons, coupons, and repeat traveler discounts
- `helmet` security headers, `cors` limited to configured frontend origin, and `express-rate-limit`
- Strict access control: users can only view and cancel their own bookings
- 15 automated unit and integration tests (`node --test`) plus an 8-step smoke test script (`scripts/smoke.js`)
- Deployed on Render with health checks and environment configuration

## Connect the Frontend

1. Add `REACT_APP_API_URL=http://localhost:5000` (or Render API URL) to the React app's `.env`.
2. Auth tokens stored securely and passed via `Authorization: Bearer <token>`.
3. Flights loaded from `GET /api/flights` and bookings persisted to `POST /api/bookings`.
4. Trips dashboard populated directly from `GET /api/bookings`.

## Deployment

- **Backend**: Render web service configured via `render.yaml` with managed PostgreSQL.
- **Frontend**: React application deployed on Vercel configured via `vercel.json`.
