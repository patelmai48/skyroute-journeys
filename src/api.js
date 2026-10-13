/**
 * SkyRoute Central API Client
 * Connects to Express + SQLite backend with loading, error states,
 * and resilient friendly error handling when the server is unreachable.
 */

const isProduction = process.env.NODE_ENV === 'production';
const PROD_API_FALLBACK = 'https://skyroute-journeys.onrender.com';
const configuredApiUrl = process.env.REACT_APP_API_URL || (isProduction ? PROD_API_FALLBACK : '');

const API_BASE = configuredApiUrl || (!isProduction ? 'http://localhost:5000' : PROD_API_FALLBACK);

function getApiOrigin() {
  try {
    if (API_BASE) {
      return new URL(API_BASE, typeof window !== 'undefined' ? window.location?.href : 'http://localhost').origin;
    }
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
  } catch {
    // fallback
  }
  return API_BASE || 'unknown';
}

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const apiOrigin = getApiOrigin();

  if (isProduction && !configuredApiUrl) {
    console.error(
      `[SkyRoute API Error] Cannot reach server: REACT_APP_API_URL is missing in production build. Call to ${path} aborted.`
    );
    const configError = new Error(`network or CORS error reaching ${apiOrigin}: REACT_APP_API_URL is not configured`);
    configError.isConfigurationError = true;
    configError.isNetworkError = true;
    configError.origin = apiOrigin;
    configError.shortReason = `network or CORS error reaching ${apiOrigin}`;
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
      const serverMsg = data?.error || `Request failed with status ${res.status}`;
      let fieldDetail = '';
      if (data?.details) {
        if (data.details.fieldErrors && typeof data.details.fieldErrors === 'object') {
          const fields = Object.keys(data.details.fieldErrors);
          if (fields.length > 0) {
            fieldDetail = `, field: ${fields.join(', ')}`;
          }
        } else if (typeof data.details === 'string') {
          fieldDetail = `, details: ${data.details}`;
        } else {
          fieldDetail = `, details: ${JSON.stringify(data.details)}`;
        }
      }

      const shortReason = `HTTP ${res.status}: ${serverMsg}${fieldDetail}`;
      const fullMessage = `${shortReason} (origin: ${apiOrigin})`;

      const err = new Error(fullMessage);
      err.status = res.status;
      err.serverError = serverMsg;
      err.details = data?.details;
      err.data = data;
      err.origin = apiOrigin;
      err.shortReason = shortReason;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    // Network or CORS failure
    const networkReason = `network or CORS error reaching ${apiOrigin}`;
    const friendlyError = new Error(networkReason);
    friendlyError.isNetworkError = true;
    friendlyError.isNetworkOrCors = true;
    friendlyError.origin = apiOrigin;
    friendlyError.shortReason = networkReason;
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
