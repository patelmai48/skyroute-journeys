# SkyRoute Backend

Express + SQLite API for SkyRoute: user accounts (JWT) and bookings. Phase 1 of adding a real backend to the React frontend.

## Run it

```bash
npm install
cp .env.example .env      # then set JWT_SECRET (command is inside the file)
npm run dev               # http://localhost:5000
npm test                  # 12 automated API tests
```

## API

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/api/health` | no | Health check |
| POST | `/api/auth/register` | no | `{name, email, password}` → `{user, token}` |
| POST | `/api/auth/login` | no | `{email, password}` → `{user, token}` |
| GET | `/api/auth/me` | yes | Current user |
| POST | `/api/bookings` | yes | Create a booking, returns a generated 6-character PNR |
| GET | `/api/bookings` | yes | Your bookings, newest first (My Trips) |
| GET | `/api/bookings/:pnr` | yes | One of your bookings |
| POST | `/api/bookings/:pnr/cancel` | yes | Cancel a booking (once) |

Send the token as `Authorization: Bearer <token>`.

Booking body:

```json
{
  "flight": { "airline": "Vistara", "from": "AMD", "to": "BOM" },
  "passengers": [{ "firstName": "Mahi", "lastName": "Patel", "email": "a@b.com" }],
  "seat": "4A",
  "totalAmount": 17947
}
```

## What is in it

- Passwords hashed with bcrypt; JWT expires in 7 days
- Input validation with zod on every write route
- helmet security headers, CORS limited to your frontend origin, rate limit on login/register
- Users can only read or cancel their own bookings
- The server refuses to start without a strong `JWT_SECRET`

## Connect the frontend (next step)

1. Add `REACT_APP_API_URL=http://localhost:5000` to the React app's `.env`.
2. Replace the demo login (`skyroute_auth_user` in LocalStorage) with calls to `/api/auth/login` and `/register`. Keep only the token in LocalStorage.
3. On booking confirmation, `POST /api/bookings` and show the PNR the server returns instead of a generated one.
4. Load My Trips from `GET /api/bookings` instead of `skyroute_bookings`.

```js
const API = process.env.REACT_APP_API_URL;
export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('skyroute_token');
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
```

## Known limits (honest list)

- `totalAmount` comes from the client. Phase 2 should compute price on the server from flight data.
- Flights are still served from the frontend. Phase 2: `GET /api/flights` with filters and sorting.
- SQLite is for development and small deployments. For production, move to PostgreSQL.
- Payment is still simulated.

## Roadmap

1. Auth + bookings (done, this repo)
2. Flights API + server-side pricing
3. Connect the React app, deploy API (Render) and update `CORS_ORIGIN` with the Vercel URL
4. PostgreSQL, seat availability, email confirmation
