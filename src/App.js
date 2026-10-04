import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import DestinationDetails from './pages/DestinationDetails';
import FlightResults from './pages/FlightResults';
import FlightDetails from './pages/FlightDetails';
import PassengerDetails from './pages/PassengerDetails';
import ReviewBooking from './pages/ReviewBooking';
import BookingConfirmation from './pages/BookingConfirmation';
import MyTrips from './pages/MyTrips';
import AiTripPlanner from './pages/AiTripPlanner';
import PriceAlerts from './pages/PriceAlerts';
import FlightStatus from './pages/FlightStatus';
import ManageBooking from './pages/ManageBooking';
import Offers from './pages/Offers';
import Hotels from './pages/Hotels';
import TravelInsurance from './pages/TravelInsurance';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import { DESTINATIONS } from './data/travelData';
import './App.scss';

const STORAGE_KEYS = {
  SEARCH: 'skyroute_search',
  SELECTED_FLIGHT: 'skyroute_selected_flight',
  PASSENGERS: 'skyroute_passengers',
  BOOKINGS: 'skyroute_bookings',
  CURRENT_BOOKING: 'skyroute_current_booking',
  SELECTED_DEST: 'skyroute_selected_dest',
  SELECTED_SEAT: 'skyroute_selected_seat',
};

const AppContent = () => {

  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    return path || '/';
  });

  // Search Criteria State
  const [searchData, setSearchData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEARCH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          departureDate: parsed.departureDate ? new Date(parsed.departureDate) : new Date(),
          returnDate: parsed.returnDate ? new Date(parsed.returnDate) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        };
      }
    } catch (e) {
      console.warn('Could not parse saved search data:', e);
    }
    return {
      origin: 'Ahmedabad (AMD)',
      destination: 'Mumbai (BOM)',
      tripType: 'round-trip',
      departureDate: new Date(),
      returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      passengers: 1,
      cabinClass: 'Economy',
    };
  });

  // Selected Flight for Booking Flow
  const [selectedFlight, setSelectedFlight] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_FLIGHT);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Passenger Information
  const [passengerData, setPassengerData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSENGERS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Active Confirmed Booking
  const [currentBooking, setCurrentBooking] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_BOOKING);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Active Selected Destination for Details
  const [selectedDestination, setSelectedDestination] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DEST);
      return saved ? JSON.parse(saved) : DESTINATIONS[0];
    } catch (e) {
      return DESTINATIONS[0];
    }
  });

  // Sync browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateSearchData = (data) => {
    setSearchData(data);
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save searchData:', e);
    }
  };

  const updateSelectedFlight = (flight) => {
    setSelectedFlight(flight);
    try {
      if (flight) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_FLIGHT, JSON.stringify(flight));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_FLIGHT);
      }
    } catch (e) {
      console.warn('Failed to save selectedFlight:', e);
    }
  };

  const updatePassengerData = (passengers) => {
    setPassengerData(passengers);
    try {
      localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(passengers));
    } catch (e) {
      console.warn('Failed to save passengerData:', e);
    }
  };

  // Selected Aircraft Seat
  const [selectedSeat, setSelectedSeat] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_SEAT);
      return saved ? JSON.parse(saved) : { id: '14A', row: 14, col: 'A', type: 'Window', category: 'Standard Window', price: 450 };
    } catch (e) {
      return { id: '14A', row: 14, col: 'A', type: 'Window', category: 'Standard Window', price: 450 };
    }
  });

  const updateSelectedSeat = (seat) => {
    setSelectedSeat(seat);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SEAT, JSON.stringify(seat));
    } catch (e) {
      console.warn('Failed to save selectedSeat:', e);
    }
  };

  const updateSelectedDestination = (dest) => {
    setSelectedDestination(dest);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_DEST, JSON.stringify(dest));
    } catch (e) {
      console.warn('Failed to save selectedDestination:', e);
    }
  };

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch (e) {
      // Safe fallback
    }
  };

  const handleSearch = (data) => {
    updateSearchData(data);
    navigateTo('/flights');
  };

  const handleSelectFlight = (flight) => {
    updateSelectedFlight(flight);
    navigateTo('/flight-details');
  };

  const handleConfirmBooking = (booking) => {
    setCurrentBooking(booking);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_BOOKING, JSON.stringify(booking));

      // Append to historical bookings
      const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const list = savedBookings ? JSON.parse(savedBookings) : [];
      list.unshift(booking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save confirmed booking:', e);
    }
    navigateTo('/booking-confirmation');
  };

  const handleSelectHistoricalBooking = (booking) => {
    setCurrentBooking(booking);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_BOOKING, JSON.stringify(booking));
    } catch (e) {
      console.warn('Failed to save currentBooking:', e);
    }
    navigateTo('/booking-confirmation');
  };

  // Route Resolver
  const renderCurrentPage = () => {
    // 1. Destination Details Dynamic Route: /destination/:id
    if (currentRoute.startsWith('/destination/')) {
      const destId = currentRoute.replace('/destination/', '').toLowerCase();
      const matched = DESTINATIONS.find((d) => d.id === destId) || selectedDestination;
      return (
        <DestinationDetails
          destination={matched}
          destinationId={destId}
          onNavigate={navigateTo}
          onSearch={handleSearch}
          onSelectFlight={handleSelectFlight}
        />
      );
    }

    // 2. Exact Path Routes
    switch (currentRoute) {
      case '/explore':
        return (
          <Explore
            onNavigate={navigateTo}
            onSearch={handleSearch}
            onSelectDestination={updateSelectedDestination}
          />
        );

      case '/ai-planner':
      case '/ai-trip-planner':
        return (
          <AiTripPlanner
            onNavigate={navigateTo}
            onSearch={handleSearch}
          />
        );

      case '/my-trips':
      case '/my-bookings':
      case '/dashboard/trips':
      case '/dashboard/bookings':
        return (
          <MyTrips
            onNavigate={navigateTo}
            onSearch={handleSearch}
            currentBooking={currentBooking}
            onSelectBooking={handleSelectHistoricalBooking}
          />
        );

      case '/price-alerts':
        return (
          <PriceAlerts
            onNavigate={navigateTo}
            onSearch={handleSearch}
          />
        );

      case '/offers':
        return (
          <Offers
            onNavigate={navigateTo}
            onSearch={handleSearch}
          />
        );

      case '/hotels':
        return (
          <Hotels
            onNavigate={navigateTo}
          />
        );

      case '/flight-status':
        return (
          <FlightStatus
            onNavigate={navigateTo}
          />
        );

      case '/manage-booking':
        return (
          <ManageBooking
            onNavigate={navigateTo}
            currentBooking={currentBooking}
            onSelectBooking={handleSelectHistoricalBooking}
          />
        );

      case '/insurance':
      case '/travel-insurance':
        return (
          <TravelInsurance
            onNavigate={navigateTo}
          />
        );

      case '/profile':
      case '/dashboard/profile':
        return (
          <Profile
            onNavigate={navigateTo}
          />
        );

      case '/notifications':
        return (
          <Notifications
            onNavigate={navigateTo}
          />
        );

      case '/flights':
      case '/dashboard/flights':
        return (
          <FlightResults
            searchData={searchData}
            onSelectFlight={handleSelectFlight}
            onEditSearch={() => navigateTo('/')}
            onSearchChange={updateSearchData}
          />
        );

      case '/flight-details':
        return (
          <FlightDetails
            selectedFlight={selectedFlight}
            searchData={searchData}
            onBackToResults={() => navigateTo('/flights')}
            onContinue={() => navigateTo('/passenger-details')}
          />
        );

      case '/passenger-details':
        return (
          <PassengerDetails
            selectedFlight={selectedFlight}
            searchData={searchData}
            passengerData={passengerData}
            setPassengerData={updatePassengerData}
            selectedSeat={selectedSeat}
            setSelectedSeat={updateSelectedSeat}
            onBackToDetails={() => navigateTo('/flight-details')}
            onContinue={() => navigateTo('/review-booking')}
          />
        );

      case '/review-booking':
        return (
          <ReviewBooking
            selectedFlight={selectedFlight}
            searchData={searchData}
            passengerData={passengerData}
            selectedSeat={selectedSeat}
            onBackToPassengerDetails={() => navigateTo('/passenger-details')}
            onConfirmBooking={handleConfirmBooking}
          />
        );

      case '/booking-confirmation':
      case '/boarding-pass':
      case '/dashboard/boarding-pass':
        return (
          <BookingConfirmation
            currentBooking={currentBooking}
            onNavigateHome={() => navigateTo('/')}
            onNavigateMyBookings={() => navigateTo('/my-trips')}
          />
        );

      case '/about':
      case '/dashboard/about':
        return (
          <About onNavigate={navigateTo} />
        );

      case '/login':
        return (
          <Login onNavigate={navigateTo} />
        );

      case '/dashboard':
        return (
          <Dashboard
            onNavigate={navigateTo}
            onSelectBooking={handleSelectHistoricalBooking}
          />
        );

      case '/':
      default:
        return (
          <Home
            onSearch={handleSearch}
            searchData={searchData}
            onNavigate={navigateTo}
            onSelectDestination={updateSelectedDestination}
          />
        );
    }
  };

  return (
    <div className="SkyRoute-app">
      {/* Universal Top Header Navigation */}
      <Header
        onNavigate={navigateTo}
        currentRoute={currentRoute}
      />

      {/* Main Page Area */}
      <main className="SkyRoute-main">
        {renderCurrentPage()}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </ThemeProvider>
);

export default App;
