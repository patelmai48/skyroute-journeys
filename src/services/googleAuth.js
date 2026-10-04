/**
 * SkyRoute Real Google OAuth 2.0 Authentication Service
 * 
 * Implements real Google Authentication using Google Identity Services (GIS).
 * Reads OAuth Client ID strictly from environment variables (NEVER hardcodes secrets).
 */

export const getGoogleClientId = () => {
  const id = (
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID ||
    ''
  ).trim();

  // Treat example placeholder as unconfigured
  if (!id || id.startsWith('your_') || id.includes('placeholder')) {
    return '';
  }
  return id;
};

/**
 * Safely decodes a Google JWT Credential string (ID Token)
 */
export const decodeGoogleJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse Google JWT payload:', err);
    return null;
  }
};

/**
 * Dynamically loads the official Google Identity Services script
 */
export const loadGoogleSdk = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      return resolve(window.google);
    }
    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      if (window.google?.accounts?.oauth2) {
        return resolve(window.google);
      }
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', (e) => reject(new Error('Failed to load Google Identity Services SDK')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) resolve(window.google);
      else reject(new Error('Google SDK loaded but window.google is undefined'));
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services SDK. Check your internet connection.'));
    document.head.appendChild(script);
  });
};

/**
 * Initiates the Real Google OAuth 2.0 Account Chooser / Login Flow
 * 
 * @param {Object} options
 * @param {Function} options.onSuccess - Called with verified Google user data { id, name, email, picture }
 * @param {Function} options.onError - Called with error message string
 * @param {Function} options.onCancel - Called when user dismisses the Google popup
 */
export const triggerGoogleAuth = async ({ onSuccess, onError, onCancel }) => {
  const clientId = getGoogleClientId();

  if (!clientId) {
    onError(
      'Google OAuth Client ID is not configured. Please add your real REACT_APP_GOOGLE_CLIENT_ID to the .env file from Google Cloud Console (APIs & Services > Credentials > OAuth 2.0 Client ID for Web).'
    );
    return;
  }

  try {
    const google = await loadGoogleSdk();

    if (!google?.accounts?.oauth2) {
      throw new Error('Google Identity Services client is unavailable in the current browser environment.');
    }

    // Initialize OAuth2 Token Client for interactive Google account picker
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          if (tokenResponse.error === 'access_denied' || tokenResponse.error === 'popup_closed_by_user') {
            if (onCancel) onCancel();
            else onError('Google sign-in was cancelled by user.');
            return;
          }
          onError(`Google Authentication Error: ${tokenResponse.error_description || tokenResponse.error}`);
          return;
        }

        if (!tokenResponse.access_token) {
          onError('Google did not return an access token.');
          return;
        }

        try {
          // Fetch real verified user profile from Google OAuth2 API
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Google UserInfo API returned HTTP ${res.status}`);
          }

          const profile = await res.json();

          const authUser = {
            id: profile.sub,
            name: profile.name || profile.given_name || 'Google User',
            email: profile.email,
            picture: profile.picture || null,
            avatar: profile.picture || '👤',
            provider: 'google',
            memberSince: '2026',
            tier: 'SkyRoute Gold Member',
            points: 2500,
            emailVerified: profile.email_verified || true,
            authenticatedAt: new Date().toISOString(),
          };

          onSuccess(authUser);
        } catch (fetchErr) {
          console.error('Error fetching Google User Info:', fetchErr);
          onError('Failed to fetch verified user profile from Google. Please try again.');
        }
      },
      error_callback: (error) => {
        console.warn('Google Token Client Error:', error);
        if (error.type === 'popup_closed' || error.type === 'popup_blocked_by_browser') {
          if (error.type === 'popup_blocked_by_browser') {
            onError('Google Sign-In popup was blocked by your browser. Please allow popups for this site.');
          } else if (onCancel) {
            onCancel();
          } else {
            onError('Google sign-in popup was closed.');
          }
        } else {
          onError(`Google OAuth Error: ${error.message || error.type || 'Authentication failed'}`);
        }
      },
    });

    // Request Access Token via official Google Popup
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    console.error('triggerGoogleAuth exception:', err);
    onError(err.message || 'An unexpected error occurred while launching Google Sign-In.');
  }
};

/**
 * Sign out from Google session
 */
export const signOutGoogle = (email) => {
  try {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  } catch (e) {
    console.warn('Google signOut warning:', e);
  }
};
