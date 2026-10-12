const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('skyroute_token');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || (data.details ? JSON.stringify(data.details) : 'Request failed');
    throw new Error(errorMsg);
  }
  return data;
}

export async function registerUser({ name, email, password }) {
  try {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });
    if (data.token) localStorage.setItem('skyroute_token', data.token);
    return data;
  } catch (err) {
    console.warn('Backend register error (falling back to client session if offline):', err.message);
    throw err;
  }
}

export async function loginUser({ email, password }) {
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (data.token) localStorage.setItem('skyroute_token', data.token);
    return data;
  } catch (err) {
    console.warn('Backend login error:', err.message);
    throw err;
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem('skyroute_token');
  if (!token) return null;
  try {
    const data = await api('/api/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

export async function postBookingToServer(bookingData) {
  const token = localStorage.getItem('skyroute_token');
  if (!token) return null;

  try {
    const flightPayload = {
      airline: bookingData.flight?.airline || 'SkyRoute Partner Airline',
      from: bookingData.flight?.originCode || bookingData.flight?.from || 'AMD',
      to: bookingData.flight?.destinationCode || bookingData.flight?.to || 'BOM',
      flightNumber: bookingData.flight?.flightNumber || 'SR-101',
      departure: bookingData.flight?.departureTime || '08:00',
      arrival: bookingData.flight?.arrivalTime || '10:00'
    };

    const passengersPayload = Array.isArray(bookingData.passengers) && bookingData.passengers.length > 0
      ? bookingData.passengers.map((p) => ({
          title: p.title || 'Mr',
          firstName: p.firstName || 'Traveler',
          lastName: p.lastName || 'Guest',
          email: p.email || 'traveler@example.com',
          phone: p.phone || '9876543210'
        }))
      : [{ firstName: 'Traveler', lastName: 'Guest' }];

    const payload = {
      flight: flightPayload,
      passengers: passengersPayload,
      seat: typeof bookingData.seat === 'string' ? bookingData.seat : (bookingData.seat?.id || '4A'),
      totalAmount: Math.max(1, Math.round(bookingData.total || bookingData.totalAmount || 1000)),
      currency: 'INR'
    };

    const result = await api('/api/bookings', {
      method: 'POST',
      body: payload
    });
    return result.booking;
  } catch (err) {
    console.warn('Backend booking submission error:', err.message);
    return null;
  }
}

export async function fetchServerBookings() {
  const token = localStorage.getItem('skyroute_token');
  if (!token) return null;
  try {
    const data = await api('/api/bookings');
    return data.bookings;
  } catch (err) {
    console.warn('Failed to fetch server bookings:', err.message);
    return null;
  }
}

export async function cancelServerBooking(pnr) {
  const token = localStorage.getItem('skyroute_token');
  if (!token) return null;
  try {
    const data = await api(`/api/bookings/${pnr}/cancel`, { method: 'POST' });
    return data.booking;
  } catch (err) {
    console.warn('Failed to cancel server booking:', err.message);
    throw err;
  }
}
