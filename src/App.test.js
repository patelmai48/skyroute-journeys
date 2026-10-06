import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import Login from './pages/Login';
import { THEME_TOKENS } from './context/ThemeContext';
import * as googleAuthService from './services/googleAuth';

const APPROVED_PALETTE = [
  '#143F67',
  '#103456',
  '#1E5282',
  '#E4B46C',
  '#D39F52',
  '#FBF3E4',
  '#FAFBFC',
  '#FFFFFF',
  '#E2E8F0',
  '#CBD5E1',
  '#94A3B8',
  '#64748B',
  '#16A34A',
  '#DC2626',
  '#FEE2E2',
  '#DCFCE7'
];

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
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-bg')).toBe('#FAFBFC');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-primary')).toBe('#E4B46C');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-card-secondary')).toBe('#FAFBFC');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-border')).toBe('#E2E8F0');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-secondary')).toBe('#143F67');
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-gold')).toBe('#E4B46C');
  });

  it('verifies all theme tokens strictly match the 3-color palette or valid transparencies', () => {
    Object.entries(THEME_TOKENS).forEach(([token, val]) => {
      if (val.startsWith('#')) {
        expect(APPROVED_PALETTE).toContain(val.toUpperCase());
      } else if (val.startsWith('rgba(')) {
        expect(val).toMatch(/rgba\((?:20,\s*63,\s*103|228,\s*180,\s*108|251,\s*243,\s*228|255,\s*255,\s*255|250,\s*251,\s*252)/);
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
    expect(document.documentElement.style.getPropertyValue('--SkyRoute-bg')).toBe('#FAFBFC');
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

describe('SkyRoute Loyalty, SkyPoints & Repeat User Rewards System', () => {
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

  it('recognizes a first-time user and displays loyalty points accrual preview without repeat discount', () => {
    // 0 bookings in localStorage
    localStorage.setItem('skyroute_bookings', JSON.stringify([]));

    const loyaltyService = require('./services/loyaltyService');
    expect(loyaltyService.isRepeatCustomer()).toBe(false);
    expect(loyaltyService.getRepeatTravelerDiscount()).toBe(0);

    const ReviewBooking = require('./pages/ReviewBooking').default;
    const mockFlight = {
      id: 'fl-1',
      airline: 'IndiGo',
      price: 4000,
      departureTime: '10:00 AM',
      arrivalTime: '12:00 PM',
      originCode: 'AMD',
      destinationCode: 'BOM',
      stops: 0
    };

    act(() => {
      ReactDOM.render(
        <ReviewBooking
          selectedFlight={mockFlight}
          searchData={{ passengers: 1 }}
          passengerData={[{ name: 'Kinjal Patel' }]}
          onConfirmBooking={() => {}}
        />,
        container
      );
    });

    // Contains welcome / unlock repeat perks message
    expect(container.textContent).toContain('First Flight with SkyRoute?');
    expect(container.textContent).toContain('Repeat Traveler Rewards');
    // Does NOT show repeat discount applied
    expect(container.textContent).not.toContain('Repeat Traveler Reward Applied');
  });

  it('recognizes a repeat customer and applies the ₹500 discount consistently in Review and Fare breakdown', () => {
    // 1 completed booking in localStorage
    const pastBooking = {
      bookingId: 'BK-111111',
      pnr: 'SKY99P',
      total: 4200,
      status: 'Confirmed'
    };
    localStorage.setItem('skyroute_bookings', JSON.stringify([pastBooking]));

    const loyaltyService = require('./services/loyaltyService');
    expect(loyaltyService.isRepeatCustomer()).toBe(true);
    expect(loyaltyService.getRepeatTravelerDiscount()).toBe(500);

    const ReviewBooking = require('./pages/ReviewBooking').default;
    const mockFlight = {
      id: 'fl-2',
      airline: 'Air India',
      price: 5000,
      departureTime: '06:00 AM',
      arrivalTime: '08:00 AM',
      originCode: 'DEL',
      destinationCode: 'BLR',
      stops: 0
    };

    act(() => {
      ReactDOM.render(
        <ReviewBooking
          selectedFlight={mockFlight}
          searchData={{ passengers: 1 }}
          passengerData={[{ name: 'Kinjal Patel' }]}
          onConfirmBooking={() => {}}
        />,
        container
      );
    });

    // Shows repeat reward applied badge & banner
    expect(container.textContent).toContain('Repeat Traveler Reward Applied');
    expect(container.textContent).toContain('SAVE ₹500');
    expect(container.textContent).toContain('Repeat Traveler Reward');
    expect(container.textContent).toContain('-₹500');
  });

  it('accrues 10% SkyPoints and persists points correctly in localStorage upon booking confirmation', () => {
    const loyaltyService = require('./services/loyaltyService');
    const initialBalance = loyaltyService.getSkyPointsBalance();

    const bookingTotal = 4500;
    const result = loyaltyService.awardBookingSkyPoints(bookingTotal);

    expect(result.earned).toBe(450); // 10% of 4500
    expect(result.newBalance).toBe(initialBalance + 450);
    expect(Number(localStorage.getItem('skyroute_skypoints'))).toBe(initialBalance + 450);
  });

  it('renders loyalty tier, SkyPoints balance, and repeat discount in Profile and My Trips', () => {
    const pastBooking = {
      bookingId: 'BK-222222',
      pnr: 'SKY77T',
      total: 5000,
      status: 'Confirmed'
    };
    localStorage.setItem('skyroute_bookings', JSON.stringify([pastBooking]));
    localStorage.setItem('skyroute_skypoints', '3500');

    const Profile = require('./pages/Profile').default;
    act(() => {
      ReactDOM.render(<Profile onNavigate={() => {}} />, container);
    });

    expect(container.textContent).toContain('SkyPoints Balance');
    expect(container.textContent).toContain('3,500 pts');
    expect(container.textContent).toContain('Repeat Traveler');

    const MyTrips = require('./pages/MyTrips').default;
    act(() => {
      ReactDOM.render(<MyTrips onNavigate={() => {}} />, container);
    });

    expect(container.textContent).toContain('SkyRoute Rewards');
    expect(container.textContent).toContain('3,500 SkyPoints');
    expect(container.textContent).toContain('REPEAT DISCOUNT ACTIVE');
  });
});