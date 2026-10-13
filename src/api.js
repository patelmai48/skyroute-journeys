/**
 * SkyRoute Central API Client
 * Connects to Express + SQLite backend with loading, error states,
 * and resilient friendly error handling when the server is unreachable.
 */

const isProduction = process.env.NODE_ENV === 'production';
const configuredApiUrl = process.env.REACT_APP_API_URL;

if (isProduction && !configuredApiUrl) {
  console.error(
    '[SkyRoute API Error] REACT_APP_API_URL is missing in production environment. Backend requests will fail instead of calling localhost.'
  );
}

const API_BASE = configuredApiUrl || (!isProduction ? 'http://localhost:5000' : '');

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  if (isProduction && !configuredApiUrl) {
    console.error(
      `[SkyRoute API Error] Cannot reach server: REACT_APP_API_URL is missing in production build. Call to ${path} aborted.`
    );
    const configError = new Error('Cannot reach server: API URL is not configured.');
    configError.isConfigurationError = true;
    configError.isNetworkError = true;
    throw configError;
  }

  const token = localStorage.getItem('skyroute_token');
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const errorMsg = data?.error || (data?.details ? JSON.stringify(data.details) : `Request failed with status ${res.status}`);
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    // Network error / offline / server not running
    const friendlyError = new Error('Server is currently unreachable. Operating with local fallback data.');
    friendlyError.isNetworkError = true;
    friendlyError.original = err;
    throw friendlyError;
  }
}

// Flights API
export async function fetchFlights(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  const queryString = query.toString();
  const path = `/api/flights${queryString ? `?${queryString}` : ''}`;
  return api(path);
}

// Authentication APIs
export async function registerUser({ name, email, password }) {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
  if (data?.token) {
    localStorage.setItem('skyroute_token', data.token);
  }
  return data;
}

export async function loginUser({ email, password }) {
  const data = await api('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  if (data?.token) {
    localStorage.setItem('skyroute_token', data.token);
  }
  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('skyroute_token');
  if (!token) return null;
  try {
    const data = await api('/api/auth/me');
    return data?.user || null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem('skyroute_token');
  localStorage.removeItem('skyroute_auth_user');
}

// Bookings APIs
export async function createBooking(bookingPayload) {
  return api('/api/bookings', {
    method: 'POST',
    body: bookingPayload,
  });
}

export async function fetchBookings() {
  const data = await api('/api/bookings');
  return data?.bookings || (Array.isArray(data) ? data : []);
}

export async function fetchBooking(pnr) {
  return api(`/api/bookings/${pnr}`);
}

export async function cancelBooking(pnr) {
  return api(`/api/bookings/${pnr}/cancel`, {
    method: 'POST',
  });
}
