import React, { useState, useEffect } from 'react';
import { triggerGoogleAuth } from '../services/googleAuth';

const STORAGE_KEYS = {
  REMEMBERED_EMAIL: 'skyroute_remembered_email',
  AUTH_USER: 'skyroute_auth_user',
  PROFILE_INFO: 'skyroute_profile_info',
};

const Login = ({ onNavigate }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Status & Error States
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Load remembered email
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (e) {
      console.warn('Could not read remembered email:', e);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (authMode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Full name is required.';
      }
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
      if (!termsAccepted) {
        newErrors.terms = 'Please accept terms & conditions.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const displayName = authMode === 'signup' ? name.trim() : email.split('@')[0];
    const userObj = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: email.trim(),
      avatar: '👤',
      memberSince: '2026',
      tier: 'SkyRoute Gold Member',
      points: 2450
    };

    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
      }
    } catch (err) {
      console.warn('Auth storage error:', err);
    }

    setStatusMessage({
      type: 'success',
      text: authMode === 'signup' ? 'Account created successfully! Welcome to SkyRoute.' : 'Welcome back! Login successful.'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('/');
    }, 800);
  };

  const completeGoogleAuth = (googleUser) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(googleUser));
      const existingProfile = localStorage.getItem(STORAGE_KEYS.PROFILE_INFO);
      const parsed = existingProfile ? JSON.parse(existingProfile) : {};
      localStorage.setItem(
        STORAGE_KEYS.PROFILE_INFO,
        JSON.stringify({
          ...parsed,
          fullName: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.picture || googleUser.avatar,
          memberTier: 'SkyRoute Gold Member',
          points: 12450
        })
      );
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    setIsSubmitting(false);
    setStatusMessage({
      type: 'success',
      text: `Welcome, ${googleUser.name}! Successfully authenticated with Google (${googleUser.email}).`
    });
    setTimeout(() => onNavigate('/'), 800);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setStatusMessage({
      type: 'info',
      text: 'Opening Google authentication...'
    });

    triggerGoogleAuth({
      onSuccess: (googleUser) => {
        completeGoogleAuth(googleUser);
      },
      onCancel: () => {
        setIsSubmitting(false);
        setStatusMessage({
          type: 'info',
          text: 'Google sign-in was cancelled.'
        });
      },
      onError: (errorMessage) => {
        setIsSubmitting(false);
        setStatusMessage({
          type: 'error',
          text: errorMessage
        });
      }
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      setResetSent(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSent(false);
        setResetEmail('');
      }, 2500);
    }
  };

  return (
    <div className="SkyRoute-login-page">
      <div className="SkyRoute-login-container">
        {/* Brand Card */}
        <div className="SkyRoute-login-card SkyRoute-card">
          {/* Brand Header */}
          <div className="SkyRoute-login-brand-header">
            <div className="SkyRoute-login-logo-icon">✈</div>
            <h2 className="SkyRoute-login-card-title">
              {authMode === 'login' ? 'Welcome Back' : 'Create SkyRoute Account'}
            </h2>
            <p className="SkyRoute-login-card-sub">
              {authMode === 'login'
                ? 'Sign in to access your flight bookings, boarding passes, and saved travelers.'
                : 'Join thousands of travelers exploring the world with exclusive flight perks.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="SkyRoute-auth-tab-bar">
            <button
              type="button"
              className={`SkyRoute-auth-tab-btn ${authMode === 'login' ? 'SkyRoute-auth-tab-btn--active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setErrors({});
                setStatusMessage(null);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`SkyRoute-auth-tab-btn ${authMode === 'signup' ? 'SkyRoute-auth-tab-btn--active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
                setErrors({});
                setStatusMessage(null);
              }}
            >
              Create Account
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`SkyRoute-alert-banner SkyRoute-alert-banner--${statusMessage.type}`}>
              <span>{statusMessage.type === 'success' ? '✓' : statusMessage.type === 'error' ? '⚠️' : 'ℹ'}</span>
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Social Google Login Button */}
          <button
            type="button"
            className="SkyRoute-google-btn"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4A342A" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#7D5A44" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#B2967D" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#7D5A44" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="SkyRoute-auth-divider">
            <span>or sign in with email</span>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit} className="SkyRoute-auth-form" noValidate>
            {authMode === 'signup' && (
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Full Name *</label>
                <input
                  type="text"
                  className={`SkyRoute-text-input ${errors.name ? 'SkyRoute-text-input--error' : ''}`}
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="SkyRoute-error-msg">{errors.name}</span>}
              </div>
            )}

            <div className="SkyRoute-form-group">
              <label className="SkyRoute-field-label">Email Address *</label>
              <input
                type="email"
                className={`SkyRoute-text-input ${errors.email ? 'SkyRoute-text-input--error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="SkyRoute-error-msg">{errors.email}</span>}
            </div>

            <div className="SkyRoute-form-group">
              <div className="SkyRoute-field-label-row">
                <label className="SkyRoute-field-label">Password *</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    className="SkyRoute-forgot-link"
                    onClick={() => setForgotModalOpen(true)}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className={`SkyRoute-text-input ${errors.password ? 'SkyRoute-text-input--error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="SkyRoute-error-msg">{errors.password}</span>}
            </div>

            {authMode === 'signup' && (
              <div className="SkyRoute-form-group">
                <label className="SkyRoute-field-label">Confirm Password *</label>
                <input
                  type="password"
                  className={`SkyRoute-text-input ${errors.confirmPassword ? 'SkyRoute-text-input--error' : ''}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <span className="SkyRoute-error-msg">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {authMode === 'login' ? (
              <div className="SkyRoute-remember-row">
                <label className="SkyRoute-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember my email</span>
                </label>
              </div>
            ) : (
              <div className="SkyRoute-remember-row">
                <label className="SkyRoute-checkbox-label">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>I agree to SkyRoute Terms &amp; Privacy Policy</span>
                </label>
                {errors.terms && <span className="SkyRoute-error-msg">{errors.terms}</span>}
              </div>
            )}

            <button
              type="submit"
              className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg SkyRoute-btn--full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : authMode === 'login'
                ? 'Sign In to Account →'
                : 'Create Account & Continue →'}
            </button>
          </form>

          {/* Footer switch */}
          <div className="SkyRoute-auth-footer">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="SkyRoute-switch-mode-btn"
                  onClick={() => setAuthMode('signup')}
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="SkyRoute-switch-mode-btn"
                  onClick={() => setAuthMode('login')}
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotModalOpen && (
          <div className="SkyRoute-modal-overlay" onClick={() => setForgotModalOpen(false)}>
            <div className="SkyRoute-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="SkyRoute-modal__header">
                <h3 className="SkyRoute-modal__title">Reset Password</h3>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={() => setForgotModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <div className="SkyRoute-modal__body">
                {resetSent ? (
                  <div className="SkyRoute-alert-banner SkyRoute-alert-banner--success">
                    <span>✓</span>
                    <span>Password reset link sent! Check your inbox.</span>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="SkyRoute-auth-form">
                    <p style={{ fontSize: '0.9rem', color: 'var(--SkyRoute-text-secondary)', marginBottom: '1rem' }}>
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Email Address</label>
                      <input
                        type="email"
                        className="SkyRoute-text-input"
                        placeholder="name@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--full">
                      Send Reset Instructions
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
