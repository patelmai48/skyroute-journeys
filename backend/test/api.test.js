const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createDb } = require('../src/db');
const { createApp } = require('../src/app');

let server, base;
before(async () => {
  const db = createDb({ isTest: true });
  await db.init();
  const app = createApp({
    db,
    jwtSecret: 'test-secret-test-secret',
    bcryptRounds: 4,
    rateLimitEnabled: false,
    corsOrigin: 'https://skyroute-journeys-4ks3.vercel.app/ , http://localhost:3000/',
  });
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const call = async (method, path, body, token) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
};

const sampleBooking = {
  flight: { airline: 'Vistara', from: 'AMD', to: 'BOM', departure: '21:10', arrival: '22:45', price: 6850 },
  passengers: [{ title: 'Mr', firstName: 'Mahi', lastName: 'Patel', email: 'mahi@example.com', phone: '9999999999' }],
  seat: '4A',
  totalAmount: 17947,
};

let tokenA, tokenB, pnr;

test('health check', async () => {
  const r = await call('GET', '/api/health');
  assert.equal(r.status, 200);
});

test('flights API returns inventory with origin and destination', async () => {
  const r = await call('GET', '/api/flights?origin=Ahmedabad%20(AMD)&destination=Mumbai%20(BOM)');
  assert.equal(r.status, 200);
  assert.ok(Array.isArray(r.data.flights));
  assert.ok(r.data.flights.length > 0);
  assert.equal(r.data.flights[0].originCode, 'AMD');
  assert.equal(r.data.flights[0].destinationCode, 'BOM');
});

test('flights API filtering by stops, airline, price, departureTime, and sorting', async () => {
  const nonStop = await call('GET', '/api/flights?stops=non-stop');
  assert.equal(nonStop.status, 200);
  assert.ok(nonStop.data.flights.every((f) => f.stops === 0));

  const indigoOnly = await call('GET', '/api/flights?airline=IndiGo');
  assert.equal(indigoOnly.status, 200);
  assert.ok(indigoOnly.data.flights.every((f) => f.airline === 'IndiGo'));

  const priceFiltered = await call('GET', '/api/flights?priceFilter=under-5000');
  assert.equal(priceFiltered.status, 200);
  assert.ok(priceFiltered.data.flights.every((f) => f.price < 5000));

  const sortedCheapest = await call('GET', '/api/flights?sortBy=cheapest');
  assert.equal(sortedCheapest.status, 200);
  for (let i = 1; i < sortedCheapest.data.flights.length; i++) {
    assert.ok(sortedCheapest.data.flights[i].price >= sortedCheapest.data.flights[i - 1].price);
  }
});

test('register creates a user and returns a token', async () => {
  const r = await call('POST', '/api/auth/register', { name: 'Mahi', email: 'Mahi@Example.com', password: 'strongpass1' });
  assert.equal(r.status, 201);
  assert.equal(r.data.user.email, 'mahi@example.com');
  assert.ok(r.data.token);
  assert.equal(r.data.user.password_hash, undefined);
  tokenA = r.data.token;
});

test('register rejects duplicate email and weak password', async () => {
  const dup = await call('POST', '/api/auth/register', { name: 'Mahi', email: 'mahi@example.com', password: 'strongpass1' });
  assert.equal(dup.status, 409);
  const weak = await call('POST', '/api/auth/register', { name: 'X Y', email: 'x@example.com', password: 'short' });
  assert.equal(weak.status, 400);
});

test('login works and rejects a wrong password', async () => {
  const ok = await call('POST', '/api/auth/login', { email: 'mahi@example.com', password: 'strongpass1' });
  assert.equal(ok.status, 200);
  const bad = await call('POST', '/api/auth/login', { email: 'mahi@example.com', password: 'wrongpass' });
  assert.equal(bad.status, 401);
});

test('google auth endpoint creates or signs in user and returns token', async () => {
  const r = await call('POST', '/api/auth/google', { email: 'googleuser@example.com', name: 'Google User' });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.email, 'googleuser@example.com');
  assert.ok(r.data.token);

  // Subsequent call returns same user
  const r2 = await call('POST', '/api/auth/google', { email: 'googleuser@example.com', name: 'Google User' });
  assert.equal(r2.status, 200);
  assert.equal(r2.data.user.id, r.data.user.id);
});

test('/me requires a valid token', async () => {
  assert.equal((await call('GET', '/api/auth/me')).status, 401);
  assert.equal((await call('GET', '/api/auth/me', null, 'garbage')).status, 401);
  const r = await call('GET', '/api/auth/me', null, tokenA);
  assert.equal(r.status, 200);
  assert.equal(r.data.user.name, 'Mahi');
});

test('bookings require login', async () => {
  assert.equal((await call('GET', '/api/bookings')).status, 401);
  assert.equal((await call('POST', '/api/bookings', sampleBooking)).status, 401);
});

test('create a booking and recomputes server-side price ignoring client-sent total', async () => {
  // Client attempts to tamper with totalAmount = 1
  const tamperedBooking = {
    ...sampleBooking,
    totalAmount: 1,
    coupon: 'SKYDOM500',
    insurance: 'comprehensive'
  };
  const r = await call('POST', '/api/bookings', tamperedBooking, tokenA);
  assert.equal(r.status, 201);
  assert.match(r.data.booking.pnr, /^[A-Z2-9]{6}$/);
  assert.equal(r.data.booking.status, 'CONFIRMED');
  assert.equal(r.data.booking.flight.airline, 'Vistara');

  // Verify server recomputed: base: 6850, tax: 822 (12%), seat: 450, ins: 449, coupon: -500
  // Expected total: 6850 + 822 + 450 + 449 - 500 = 8071
  assert.notEqual(r.data.booking.totalAmount, 1);
  assert.equal(r.data.booking.totalAmount, 8071);
  pnr = r.data.booking.pnr;
});

test('subsequent booking receives repeat traveller discount on server', async () => {
  const secondBooking = {
    ...sampleBooking,
    flight: { airline: 'IndiGo', from: 'AMD', to: 'BOM', price: 3450 },
    seat: { id: '7B', price: 300 },
    insurance: 'none',
    coupon: 'none'
  };
  // Base: 3450, Tax: 414, Seat: 300, Ins: 0, Repeat discount: -500
  // Total: 3450 + 414 + 300 - 500 = 3664
  const r = await call('POST', '/api/bookings', secondBooking, tokenA);
  assert.equal(r.status, 201);
  assert.equal(r.data.booking.totalAmount, 3664);
});

test('booking validation rejects bad input', async () => {
  const noPax = await call('POST', '/api/bookings', { ...sampleBooking, passengers: [] }, tokenA);
  assert.equal(noPax.status, 400);
});

test('list and fetch own bookings', async () => {
  const list = await call('GET', '/api/bookings', null, tokenA);
  assert.equal(list.data.bookings.length, 2);
  const one = await call('GET', `/api/bookings/${pnr.toLowerCase()}`, null, tokenA);
  assert.equal(one.status, 200);
  assert.equal(one.data.booking.pnr, pnr);
});

test("another user cannot see or cancel someone else's booking", async () => {
  const reg = await call('POST', '/api/auth/register', { name: 'Other User', email: 'other@example.com', password: 'strongpass2' });
  tokenB = reg.data.token;
  assert.equal((await call('GET', `/api/bookings/${pnr}`, null, tokenB)).status, 404);
  assert.equal((await call('POST', `/api/bookings/${pnr}/cancel`, null, tokenB)).status, 404);
  assert.equal((await call('GET', '/api/bookings', null, tokenB)).data.bookings.length, 0);
});

test('cancel a booking once, then reject a second cancel', async () => {
  const c = await call('POST', `/api/bookings/${pnr}/cancel`, null, tokenA);
  assert.equal(c.status, 200);
  assert.equal(c.data.booking.status, 'CANCELLED');
  assert.ok(c.data.booking.cancelledAt);
  assert.equal((await call('POST', `/api/bookings/${pnr}/cancel`, null, tokenA)).status, 409);
});

test('unknown route returns 404 JSON', async () => {
  const r = await call('GET', '/api/nope');
  assert.equal(r.status, 404);
});

test('request with Origin https://skyroute-journeys-4ks3.vercel.app gets the right Access-Control-Allow-Origin header and preflight works', async () => {
  // Test OPTIONS preflight for POST /api/bookings
  const preflightRes = await fetch(`${base}/api/bookings`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://skyroute-journeys-4ks3.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization',
    },
  });
  assert.equal(preflightRes.status, 204);
  assert.equal(preflightRes.headers.get('access-control-allow-origin'), 'https://skyroute-journeys-4ks3.vercel.app');
  assert.ok(preflightRes.headers.get('access-control-allow-headers').includes('Authorization'));
  assert.ok(preflightRes.headers.get('access-control-allow-headers').includes('Content-Type'));

  // Test request with Origin gets the right header
  const getRes = await fetch(`${base}/api/health`, {
    method: 'GET',
    headers: {
      Origin: 'https://skyroute-journeys-4ks3.vercel.app',
    },
  });
  assert.equal(getRes.status, 200);
  assert.equal(getRes.headers.get('access-control-allow-origin'), 'https://skyroute-journeys-4ks3.vercel.app');
});

test('POST a booking using exactly the frontend payload shape and expect 201, then GET /api/bookings and expect it to be listed', async () => {
  const frontendPayload = {
    flight: { airline: 'Air India', from: 'AMD', to: 'BOM', departure: '07:15', arrival: '08:45', price: 4200 },
    passengers: [
      {
        title: 'Mr',
        firstName: 'Kinjal',
        lastName: 'Patel',
        email: 'kinjal@example.com',
        phone: '9876543210',
        dateOfBirth: '1995-05-15',
      },
      {
        title: 'Ms',
        firstName: 'Priya',
        lastName: 'Patel',
        // email, phone, dateOfBirth omitted when empty
      },
    ],
    seat: '14A',
    insurance: 'none',
    coupon: 'SKYDOM500',
    currency: 'INR',
  };

  const createRes = await call('POST', '/api/bookings', frontendPayload, tokenA);
  assert.equal(createRes.status, 201);
  assert.ok(createRes.data.booking);
  assert.match(createRes.data.booking.pnr, /^[A-Z2-9]{6}$/);
  const createdPnr = createRes.data.booking.pnr;

  // Verify listed in GET /api/bookings
  const listRes = await call('GET', '/api/bookings', null, tokenA);
  assert.equal(listRes.status, 200);
  assert.ok(Array.isArray(listRes.data.bookings));
  const listed = listRes.data.bookings.find((b) => b.pnr === createdPnr);
  assert.ok(listed, `Booking with PNR ${createdPnr} should be listed in bookings`);
  assert.equal(listed.pnr, createdPnr);
});

