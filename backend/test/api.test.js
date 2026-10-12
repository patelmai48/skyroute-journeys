const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createDb } = require('../src/db');
const { createApp } = require('../src/app');

let server, base;
before(async () => {
  const app = createApp({ db: createDb(':memory:'), jwtSecret: 'test-secret-test-secret', bcryptRounds: 4, rateLimitEnabled: false });
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
  flight: { airline: 'Vistara', from: 'AMD', to: 'BOM', departure: '21:10', arrival: '22:45' },
  passengers: [{ title: 'Mr', firstName: 'Mahi', lastName: 'Patel', email: 'mahi@example.com', phone: '9999999999' }],
  seat: '4A',
  totalAmount: 17947,
};

let tokenA, tokenB, pnr;

test('health check', async () => {
  const r = await call('GET', '/api/health');
  assert.equal(r.status, 200);
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

test('create a booking and get a PNR', async () => {
  const r = await call('POST', '/api/bookings', sampleBooking, tokenA);
  assert.equal(r.status, 201);
  assert.match(r.data.booking.pnr, /^[A-Z2-9]{6}$/);
  assert.equal(r.data.booking.status, 'CONFIRMED');
  assert.equal(r.data.booking.flight.airline, 'Vistara');
  pnr = r.data.booking.pnr;
});

test('booking validation rejects bad input', async () => {
  const noPax = await call('POST', '/api/bookings', { ...sampleBooking, passengers: [] }, tokenA);
  assert.equal(noPax.status, 400);
  const badAmount = await call('POST', '/api/bookings', { ...sampleBooking, totalAmount: -5 }, tokenA);
  assert.equal(badAmount.status, 400);
});

test('list and fetch own bookings', async () => {
  const list = await call('GET', '/api/bookings', null, tokenA);
  assert.equal(list.data.bookings.length, 1);
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
