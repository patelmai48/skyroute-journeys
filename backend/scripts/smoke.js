#!/usr/bin/env node
/**
 * SkyRoute Production API Smoke Test Script
 * 
 * Verifies end-to-end API health:
 * 1. Health check (/api/health)
 * 2. Registration (/api/auth/register)
 * 3. Login (/api/auth/login)
 * 4. User profile verification (/api/auth/me)
 * 5. Flights inventory search (/api/flights)
 * 6. Create booking (/api/bookings)
 * 7. List user bookings (/api/bookings)
 * 8. Cancel booking (/api/bookings/:pnr/cancel)
 * 
 * Usage:
 *   node scripts/smoke.js [BASE_URL]
 *   Example: node scripts/smoke.js http://localhost:5000
 *   Example: node scripts/smoke.js https://skyroute-api.onrender.com
 */

const BASE_URL = (process.argv[2] || process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');

console.log(`\n========================================`);
console.log(`🚀 SkyRoute API Smoke Test Suite`);
console.log(`Target: ${BASE_URL}`);
console.log(`========================================\n`);

async function runStep(name, fn) {
  process.stdout.write(`• ${name}... `);
  try {
    const result = await fn();
    console.log(`✅ PASS`);
    return result;
  } catch (err) {
    console.log(`❌ FAIL`);
    console.error(`  Error: ${err.message}`);
    if (err.data) console.error(`  Details:`, JSON.stringify(err.data));
    process.exit(1);
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return { status: res.status, data };
}

async function main() {
  const timestamp = Date.now();
  const testUser = {
    name: 'Smoke Tester',
    email: `smoke_${timestamp}@example.com`,
    password: `TestP@ssword_${timestamp}`,
  };

  let token = null;
  let pnr = null;

  // Step 1: Health
  await runStep('GET /api/health', async () => {
    const res = await request('/api/health');
    if (res.data?.status !== 'ok') throw new Error('Health status is not ok');
  });

  // Step 2: Register
  await runStep('POST /api/auth/register', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: testUser,
    });
    if (!res.data?.token || !res.data?.user?.email) throw new Error('Invalid register response');
  });

  // Step 3: Login
  await runStep('POST /api/auth/login', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { email: testUser.email, password: testUser.password },
    });
    token = res.data?.token;
    if (!token) throw new Error('Missing token in login response');
  });

  // Step 4: /me
  await runStep('GET /api/auth/me', async () => {
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data?.user?.email !== testUser.email) throw new Error('Profile email mismatch');
  });

  // Step 5: Flights
  await runStep('GET /api/flights', async () => {
    const res = await request('/api/flights?origin=AMD&destination=BOM');
    if (!Array.isArray(res.data?.flights) || res.data.flights.length === 0) {
      throw new Error('No flights returned');
    }
  });

  // Step 6: Create Booking
  await runStep('POST /api/bookings', async () => {
    const bookingPayload = {
      flight: { airline: 'IndiGo', from: 'AMD', to: 'BOM', price: 3450 },
      passengers: [{ title: 'Mr', firstName: 'Smoke', lastName: 'Tester' }],
      seat: '14A',
      insurance: 'none',
    };

    const res = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: bookingPayload,
    });

    pnr = res.data?.booking?.pnr;
    if (!pnr || !res.data?.booking?.totalAmount) throw new Error('Invalid booking response');
  });

  // Step 7: List Bookings
  await runStep('GET /api/bookings', async () => {
    const res = await request('/api/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const found = res.data?.bookings?.some((b) => b.pnr === pnr);
    if (!found) throw new Error(`Created booking with PNR ${pnr} not found in user bookings`);
  });

  // Step 8: Cancel Booking
  await runStep(`POST /api/bookings/${pnr}/cancel`, async () => {
    const res = await request(`/api/bookings/${pnr}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data?.booking?.status !== 'CANCELLED') throw new Error('Booking status is not CANCELLED');
  });

  console.log(`\n🎉 All 8 smoke test steps passed successfully!\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal smoke test error:', err);
  process.exit(1);
});
