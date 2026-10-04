import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import Login from './pages/Login';
import { THEME_TOKENS } from './context/ThemeContext';
import * as googleAuthService from './services/googleAuth';

const APPROVED_PALETTE = ['#F5F1EA', '#D7C9B8', '#B2967D', '#7D5A44', '#4A342A'];

describe('App & SkyRoute Permanent Light/Day Theme System', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
  });

  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
    localStorage.clear();
  });

  it('renders without crashing', () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });
    expect(container.innerHTML).not.toBe('');
  });

  it('applies permanent light/day theme attributes and root CSS variables', () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-mode')).toBe('day');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-bg')).toBe('#F5F1EA');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-primary')).toBe('#4A342A');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-card-secondary')).toBe('#D7C9B8');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-border')).toBe('#B2967D');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-secondary')).toBe('#7D5A44');
  });

  it('verifies all theme tokens strictly match the 5-color palette or valid transparencies', () => {
    Object.entries(THEME_TOKENS).forEach(([token, val]) => {
      if (val.startsWith('#')) {
        expect(APPROVED_PALETTE).toContain(val.toUpperCase());
      } else if (val.startsWith('rgba(')) {
        expect(val).toMatch(/rgba\((?:74,\s*52,\s*42|125,\s*90,\s*68|178,\s*150,\s*125|215,\s*201,\s*184|245,\s*241,\s*234)/);
      }
    });
  });

  it('strictly ensures NO theme toggle or switch button exists in the DOM', () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    const switchBtn = container.querySelector('button[role="switch"]');
    expect(switchBtn).toBeNull();

    const themeButtons = Array.from(container.querySelectorAll('button')).filter((b) => {
      const text = (b.textContent || '').toLowerCase();
      const label = (b.getAttribute('aria-label') || '').toLowerCase();
      return (
        text.includes('dark mode') ||
        text.includes('night mode') ||
        text.includes('light mode') ||
        label.includes('switch to dark') ||
        label.includes('switch to light') ||
        label.includes('theme')
      );
    });
    expect(themeButtons.length).toBe(0);
  });

  it('maintains permanent light theme across route navigation', () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Click on nav links (e.g. Flights, Hotels, Explore)
    const navLinks = container.querySelectorAll('.SkyRoute-nav-btn');
    if (navLinks.length > 0) {
      act(() => {
        navLinks[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    }

    // Still light theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-bg')).toBe('#F5F1EA');
  });
});

describe('Google OAuth 2.0 Authentication Integration', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
  });

  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
    localStorage.clear();
  });

  it('renders Google sign-in button with professional styling and icon', () => {
    act(() => {
      ReactDOM.render(<Login onNavigate={() => {}} />, container);
    });

    const googleBtn = container.querySelector('.SkyRoute-google-btn');
    expect(googleBtn).not.toBeNull();
    expect(googleBtn.textContent).toContain('Continue with Google');
  });

  it('triggers real triggerGoogleAuth when Continue with Google is clicked', () => {
    const triggerSpy = jest.spyOn(googleAuthService, 'triggerGoogleAuth').mockImplementation(({ onError }) => {
      onError('Google OAuth Client ID is not configured.');
    });

    act(() => {
      ReactDOM.render(<Login onNavigate={() => {}} />, container);
    });

    const googleBtn = container.querySelector('.SkyRoute-google-btn');
    act(() => {
      googleBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(triggerSpy).toHaveBeenCalled();
    expect(container.textContent).toContain('Google OAuth Client ID is not configured.');

    triggerSpy.mockRestore();
  });

  it('authenticates and persists session upon successful Google OAuth response', () => {
    const mockNavigate = jest.fn();
    const mockGoogleUser = {
      id: 'google-sub-12345',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      picture: 'https://lh3.googleusercontent.com/a/sample-photo',
      provider: 'google',
      tier: 'SkyRoute Gold Member',
      points: 2500
    };

    const triggerSpy = jest.spyOn(googleAuthService, 'triggerGoogleAuth').mockImplementation(({ onSuccess }) => {
      onSuccess(mockGoogleUser);
    });

    act(() => {
      ReactDOM.render(<Login onNavigate={mockNavigate} />, container);
    });

    const googleBtn = container.querySelector('.SkyRoute-google-btn');
    act(() => {
      googleBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const savedAuth = JSON.parse(localStorage.getItem('skyroute_auth_user'));
    expect(savedAuth).not.toBeNull();
    expect(savedAuth.email).toBe('priya.sharma@gmail.com');
    expect(savedAuth.name).toBe('Priya Sharma');
    expect(savedAuth.provider).toBe('google');

    triggerSpy.mockRestore();
  });
});