import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { useToast } from '../context/ToastContext';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const HOTELS_DATA = [
  {
    id: 'h1',
    name: 'The Taj Fort Aguada Resort & Spa',
    city: 'Goa',
    rating: 4.9,
    reviews: 1840,
    price: 14500,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    type: '5-Star Luxury Beach Resort',
    amenities: ['Private Beach Access', 'Infinity Pool', 'Complimentary Breakfast', 'Jiva Spa', 'Free High-Speed Wi-Fi'],
    location: 'Sinquerim Beach, North Goa',
    cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in (100% full refund).'
  },
  {
    id: 'h2',
    name: 'W Goa Vagator',
    city: 'Goa',
    rating: 4.8,
    reviews: 950,
    price: 18200,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    type: 'Boutique Lifestyle Resort',
    amenities: ['Rock Pool Sunset Lounge', 'Spa by Clarins', '24/7 In-Room Dining', 'Pet Friendly', 'Free Breakfast'],
    location: 'Vagator Beach, Goa',
    cancellationPolicy: 'Free cancellation up to 72 hours prior to check-in.'
  },
  {
    id: 'h3',
    name: 'Atlantis, The Palm',
    city: 'Dubai',
    rating: 4.9,
    reviews: 4200,
    price: 34000,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    type: 'World-Class Palm Jumeirah Resort',
    amenities: ['Aquaventure Waterpark Access', 'Lost Chambers Aquarium', 'Michelin-Star Dining', 'Private Beach', 'Luxury Spa'],
    location: 'Crescent Road, Palm Jumeirah, Dubai',
    cancellationPolicy: 'Free cancellation up to 5 days prior to arrival.'
  },
  {
    id: 'h4',
    name: 'The Imperial New Delhi',
    city: 'Delhi',
    rating: 4.9,
    reviews: 1620,
    price: 15500,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    type: 'Historic 5-Star Heritage Hotel',
    amenities: ['Heritage Art Collection', 'Outdoor Swimming Pool', 'Award-Winning Spice Route Restaurant', 'Ayurvedic Spa'],
    location: 'Janpath, Connaught Place, New Delhi',
    cancellationPolicy: 'Free cancellation up to 24 hours prior to check-in.'
  },
  {
    id: 'h5',
    name: 'Marina Bay Sands',
    city: 'Singapore',
    rating: 4.9,
    reviews: 5800,
    price: 38000,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    type: 'Iconic Marina Bay Luxury',
    amenities: ['World-Famous Rooftop Infinity Pool', 'SkyPark Observation Deck', 'Direct Mall & Casino Access', 'Fine Dining'],
    location: '10 Bayfront Avenue, Singapore',
    cancellationPolicy: 'Non-refundable discounted special rate. Rescheduling permitted.'
  },
  {
    id: 'h6',
    name: 'The Leela Palace Bengaluru',
    city: 'Bengaluru',
    rating: 4.9,
    reviews: 1350,
    price: 17500,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    type: 'Royal Palace Architecture',
    amenities: ['9 Acres of Lush Gardens', 'Heated Outdoor Pool', 'Spa by ESPA', 'Art Deco Rooms', 'Free Wi-Fi'],
    location: 'Old Airport Road, Bengaluru',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in.'
  }
];

const Hotels = ({ onNavigate }) => {
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('browse'); // browse | my-reservations
  const [savedReservations, setSavedReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_hotel_reservations');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'SR-HTL-948210',
          hotelName: 'The Taj Fort Aguada Resort & Spa',
          city: 'Goa',
          location: 'Sinquerim Beach, North Goa',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          guestName: 'Mahi Patel',
          roomType: 'Deluxe Ocean View King Room',
          checkIn: '12 Oct 2026',
          checkOut: '15 Oct 2026',
          guests: '2 Adults, 1 Room',
          nights: 3,
          nightlyPrice: 14500,
          taxes: 5220,
          totalAmount: 48720,
          cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in (100% full refund).',
          confirmedAt: '01/10/2026',
          status: 'Confirmed'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const { showSuccess } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('skyroute_hotel_reservations', JSON.stringify(savedReservations));
    } catch (e) {
      console.warn('Failed to persist hotel reservations:', e);
    }
  }, [savedReservations]);

  const filteredHotels = HOTELS_DATA.filter((h) =>
    destinationFilter === 'All' ? true : h.city === destinationFilter
  );

  const handleBookStay = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleCloseModal = () => {
    setSelectedHotel(null);
  };

  const handleConfirmStay = () => {
    if (!selectedHotel) return;
    const nightlyPrice = selectedHotel.price;
    const nights = 3;
    const taxes = Math.round(nightlyPrice * nights * 0.12);
    const totalAmount = nightlyPrice * nights + taxes;

    const newReservation = {
      id: `SR-HTL-${Math.floor(100000 + Math.random() * 900000)}`,
      hotelName: selectedHotel.name,
      city: selectedHotel.city,
      location: selectedHotel.location,
      image: selectedHotel.image,
      guestName: 'Mahi Patel',
      roomType: 'Deluxe Ocean View King Room',
      checkIn: '12 Oct 2026',
      checkOut: '15 Oct 2026',
      guests: '2 Adults, 1 Room',
      nights: 3,
      nightlyPrice,
      taxes,
      totalAmount,
      cancellationPolicy: selectedHotel.cancellationPolicy || 'Free cancellation up to 48 hours before check-in.',
      confirmedAt: new Date().toLocaleDateString('en-GB'),
      status: 'Confirmed'
    };

    setSavedReservations((prev) => [newReservation, ...prev]);
    setConfirmedBooking(newReservation);
    setSelectedHotel(null);
    if (showSuccess) showSuccess(`✓ Reservation confirmed for ${selectedHotel.name}!`);
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  return (
    <div className="SkyRoute-hotels-page">
      <div className="SkyRoute-container">
        {/* Header */}
        <div className="SkyRoute-section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <span className="SkyRoute-section-header__tag">HANDPICKED STAYS</span>
            <h1 className="SkyRoute-section-header__title" style={{ marginTop: '0.5rem' }}>
              Hotels &amp; Luxury Resorts
            </h1>
            <p className="SkyRoute-section-header__subtitle">
              Book handpicked beachfront resorts, boutique city hotels, and royal palace stays worldwide with instant confirmation vouchers.
            </p>
          </div>
        </div>

        {/* Top Navigation Tabs (Browse Hotels vs My Reservations) */}
        <div className="SkyRoute-hotels-nav-tabs">
          <button
            type="button"
            className={`SkyRoute-btn ${activeTab === 'browse' ? 'SkyRoute-btn--primary' : 'SkyRoute-btn--outline'}`}
            onClick={() => setActiveTab('browse')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Icon name="hotel" size={16} color={activeTab === 'browse' ? '#FFFFFF' : 'var(--primary)'} />
            <span>Browse Stays &amp; Resorts</span>
          </button>
          <button
            type="button"
            className={`SkyRoute-btn ${activeTab === 'my-reservations' ? 'SkyRoute-btn--primary' : 'SkyRoute-btn--outline'}`}
            onClick={() => setActiveTab('my-reservations')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Icon name="list" size={16} color={activeTab === 'my-reservations' ? '#FFFFFF' : 'var(--primary)'} />
            <span>My Hotel Reservations ({savedReservations.length})</span>
          </button>
        </div>

        {/* ============================================================
           CONFIRMED RESERVATION FULL DETAILS CARD (Screenshot / Flow Fix)
           ============================================================ */}
        {confirmedBooking && (
          <div className="SkyRoute-hotel-confirmed-banner SkyRoute-card">
            <div className="SkyRoute-hotel-confirmed-top-row">
              <div className="SkyRoute-hotel-confirmed-badge-group">
                <span className="SkyRoute-hotel-res-status-badge">RESERVATION CONFIRMED</span>
                <span className="SkyRoute-hotel-res-id-tag">ID: {confirmedBooking.id}</span>
              </div>
              <button
                type="button"
                className="SkyRoute-modal__close"
                onClick={() => setConfirmedBooking(null)}
                title="Dismiss"
              >
                &times;
              </button>
            </div>

            <div className="SkyRoute-hotel-confirmed-grid">
              <div className="SkyRoute-hotel-confirmed-col">
                <span className="SkyRoute-hotel-res-label">HOTEL &amp; LOCATION</span>
                <strong className="SkyRoute-hotel-res-val">{confirmedBooking.hotelName}</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--SkyRoute-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.15rem' }}>
                  <Icon name="mapPin" size={13} color="var(--SkyRoute-teal)" /> {confirmedBooking.location} ({confirmedBooking.city})
                </span>
              </div>

              <div className="SkyRoute-hotel-confirmed-col">
                <span className="SkyRoute-hotel-res-label">PRIMARY GUEST</span>
                <strong className="SkyRoute-hotel-res-val">{confirmedBooking.guestName}</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--SkyRoute-text-secondary)', display: 'block', marginTop: '0.15rem' }}>
                  {confirmedBooking.guests} &bull; {confirmedBooking.roomType}
                </span>
              </div>

              <div className="SkyRoute-hotel-confirmed-col">
                <span className="SkyRoute-hotel-res-label">DATES &amp; DURATION</span>
                <strong className="SkyRoute-hotel-res-val">
                  {confirmedBooking.checkIn} &rarr; {confirmedBooking.checkOut}
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--SkyRoute-text-secondary)', display: 'block', marginTop: '0.15rem' }}>
                  {confirmedBooking.nights} Nights Stay
                </span>
              </div>

              <div className="SkyRoute-hotel-confirmed-col">
                <span className="SkyRoute-hotel-res-label">TOTAL AMOUNT PAID</span>
                <strong className="SkyRoute-hotel-res-val" style={{ color: 'var(--SkyRoute-navy)', fontSize: '1.15rem' }}>
                  {formatINR(confirmedBooking.totalAmount)}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#1E5282', fontWeight: 600, display: 'block', marginTop: '0.15rem' }}>
                  Includes {formatINR(confirmedBooking.taxes)} GST &amp; fees
                </span>
              </div>
            </div>

            <div className="SkyRoute-hotel-confirmed-policy-box">
              <strong>Cancellation Policy:</strong> {confirmedBooking.cancellationPolicy}
            </div>

            <div className="SkyRoute-hotel-confirmed-actions-bar">
              <button
                type="button"
                className="SkyRoute-hotel-btn-voucher"
                onClick={() => setSelectedVoucher(confirmedBooking)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon name="fileText" size={15} />
                <span>View Official Voucher</span>
              </button>
              <button
                type="button"
                className="SkyRoute-hotel-btn-receipt"
                onClick={handlePrintConfirmation}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon name="printer" size={15} />
                <span>Download / Print Confirmation</span>
              </button>
              <button
                type="button"
                className="SkyRoute-hotel-btn-receipt"
                onClick={() => onNavigate('/my-trips')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon name="flight" size={15} />
                <span>Go to My Trips</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
           TAB 1: BROWSE HOTELS
           ============================================================ */}
        {activeTab === 'browse' && (
          <>
            {/* Quick Search & Filter Bar */}
            <div className="SkyRoute-hotels-filter-card SkyRoute-card">
              <div className="SkyRoute-hotels-filter-grid">
                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">Destination</label>
                  <select
                    className="SkyRoute-select-input"
                    value={destinationFilter}
                    onChange={(e) => setDestinationFilter(e.target.value)}
                  >
                    <option value="All">All Cities &amp; Escapes</option>
                    <option value="Goa">Goa</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>

                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">Check-in Date</label>
                  <input type="date" className="SkyRoute-text-input" defaultValue="2026-10-12" />
                </div>

                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">Check-out Date</label>
                  <input type="date" className="SkyRoute-text-input" defaultValue="2026-10-15" />
                </div>

                <div className="SkyRoute-form-group">
                  <label className="SkyRoute-field-label">Guests &amp; Rooms</label>
                  <select className="SkyRoute-select-input" defaultValue="2 Guests, 1 Room">
                    <option value="1 Guest, 1 Room">1 Guest, 1 Room</option>
                    <option value="2 Guests, 1 Room">2 Guests, 1 Room</option>
                    <option value="3 Guests, 2 Rooms">3 Guests, 2 Rooms</option>
                    <option value="4 Guests, 2 Rooms">4 Guests, 2 Rooms</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hotels Grid */}
            <div className="SkyRoute-hotels-grid">
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} className="SkyRoute-hotel-card SkyRoute-card">
                  <div className="SkyRoute-hotel-card__img-box">
                    <img src={hotel.image} alt={hotel.name} className="SkyRoute-hotel-card__img" loading="lazy" />
                    <span className="SkyRoute-hotel-card__city-badge">{hotel.city}</span>
                  </div>

                  <div className="SkyRoute-hotel-card__body">
                    <div className="SkyRoute-hotel-card__top">
                      <div>
                        <span className="SkyRoute-hotel-card__type">{hotel.type}</span>
                        <h3 className="SkyRoute-hotel-card__title">{hotel.name}</h3>
                        <span className="SkyRoute-hotel-card__loc" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="mapPin" size={13} color="var(--SkyRoute-teal)" /> {hotel.location}
                        </span>
                      </div>
                      <div className="SkyRoute-hotel-card__rating">
                        <Icon name="star" size={13} color="#D97706" /> {hotel.rating}
                        <span className="SkyRoute-hotel-reviews-count">({hotel.reviews})</span>
                      </div>
                    </div>

                    <div className="SkyRoute-hotel-amenities-tags">
                      {hotel.amenities.map((am, i) => (
                        <span key={i} className="SkyRoute-hotel-amenity-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="check" size={11} color="var(--SkyRoute-teal)" /> {am}
                        </span>
                      ))}
                    </div>

                    <div className="SkyRoute-hotel-card__footer">
                      <div>
                        <span className="SkyRoute-hotel-price-label">Price per night</span>
                        <strong className="SkyRoute-hotel-price-val">{formatINR(hotel.price)}</strong>
                        <span className="SkyRoute-hotel-tax-note">+ ₹1,200 taxes</span>
                      </div>

                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--primary"
                        onClick={() => handleBookStay(hotel)}
                      >
                        Book Stay &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============================================================
           TAB 2: MY SAVED RESERVATIONS (Persisted)
           ============================================================ */}
        {activeTab === 'my-reservations' && (
          <div className="SkyRoute-hotels-saved-list">
            {savedReservations.length === 0 ? (
              <div className="SkyRoute-card SkyRoute-empty-state">
                <div className="SkyRoute-empty-state__icon">
                  <Icon name="hotel" size={36} color="var(--primary)" />
                </div>
                <h3 className="SkyRoute-empty-state__title">No hotel reservations found</h3>
                <p className="SkyRoute-empty-state__text">
                  You have not booked any hotel stays yet. Explore our luxury resorts and boutique city hotels.
                </p>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary"
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Hotels &rarr;
                </button>
              </div>
            ) : (
              savedReservations.map((res) => (
                <div key={res.id} className="SkyRoute-hotel-res-item-card SkyRoute-card">
                  <div className="SkyRoute-hotel-res-item-card__img-box">
                    <img
                      src={res.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                      alt={res.hotelName}
                      className="SkyRoute-hotel-res-item-card__img"
                    />
                    <span className="SkyRoute-hotel-card__city-badge">{res.city}</span>
                  </div>

                  <div className="SkyRoute-hotel-res-item-card__body">
                    <div className="SkyRoute-hotel-res-item-card__top">
                      <div>
                        <div className="SkyRoute-hotel-res-pnr-row">
                          <span className="SkyRoute-hotel-res-status-badge">{res.status || 'Confirmed'}</span>
                          <span className="SkyRoute-hotel-res-id-tag">ID: {res.id}</span>
                        </div>
                        <h3 className="SkyRoute-hotel-res-title">{res.hotelName}</h3>
                        <span className="SkyRoute-hotel-res-loc" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="mapPin" size={13} color="var(--SkyRoute-teal)" /> {res.location}
                        </span>
                      </div>

                      <div className="SkyRoute-hotel-res-price-col">
                        <span className="SkyRoute-hotel-res-price-label">TOTAL FARE PAID</span>
                        <strong className="SkyRoute-hotel-res-price-val">{formatINR(res.totalAmount)}</strong>
                        <span className="SkyRoute-hotel-res-tax-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="check" size={11} /> GST &amp; Taxes Included
                        </span>
                      </div>
                    </div>

                    <div className="SkyRoute-hotel-res-meta-grid">
                      <div className="SkyRoute-hotel-res-meta-col">
                        <span className="SkyRoute-hotel-res-label">PRIMARY GUEST</span>
                        <strong className="SkyRoute-hotel-res-val">{res.guestName}</strong>
                      </div>
                      <div className="SkyRoute-hotel-res-meta-col">
                        <span className="SkyRoute-hotel-res-label">ROOM TYPE</span>
                        <strong className="SkyRoute-hotel-res-val">{res.roomType}</strong>
                      </div>
                      <div className="SkyRoute-hotel-res-meta-col">
                        <span className="SkyRoute-hotel-res-label">TRAVEL DATES</span>
                        <strong className="SkyRoute-hotel-res-val">{res.checkIn} &ndash; {res.checkOut} ({res.nights} Nights)</strong>
                      </div>
                      <div className="SkyRoute-hotel-res-meta-col">
                        <span className="SkyRoute-hotel-res-label">OCCUPANCY</span>
                        <strong className="SkyRoute-hotel-res-val">{res.guests}</strong>
                      </div>
                    </div>

                    <div className="SkyRoute-hotel-res-actions">
                      <button
                        type="button"
                        className="SkyRoute-hotel-btn-voucher"
                        onClick={() => setSelectedVoucher(res)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Icon name="fileText" size={15} />
                        <span>View Official Voucher</span>
                      </button>
                      <button
                        type="button"
                        className="SkyRoute-hotel-btn-receipt"
                        onClick={handlePrintConfirmation}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Icon name="printer" size={15} />
                        <span>Print Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal 1: Hotel Booking Confirmation Flow */}
        {selectedHotel && (
          <div className="SkyRoute-modal-overlay" onClick={handleCloseModal} role="dialog" aria-modal="true">
            <div className="SkyRoute-modal SkyRoute-hotel-modal" onClick={(e) => e.stopPropagation()}>
              <div className="SkyRoute-modal__header">
                <div>
                  <span className="SkyRoute-badge SkyRoute-badge--teal">CONFIRM HOTEL RESERVATION</span>
                  <h3 className="SkyRoute-modal__title" style={{ marginTop: '0.25rem' }}>
                    {selectedHotel.name}
                  </h3>
                </div>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              <div className="SkyRoute-modal__body">
                <div className="SkyRoute-hotel-modal-details">
                  <div className="SkyRoute-hotel-modal-meta">
                    <div className="SkyRoute-hotel-modal-meta__item">
                      <span className="SkyRoute-hotel-modal-meta__label">Address &amp; Location:</span>
                      <strong className="SkyRoute-hotel-modal-meta__val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Icon name="mapPin" size={14} color="var(--SkyRoute-teal)" /> {selectedHotel.location}, {selectedHotel.city}
                      </strong>
                    </div>
                    <div className="SkyRoute-hotel-modal-meta__item">
                      <span className="SkyRoute-hotel-modal-meta__label">Rating &amp; Category:</span>
                      <strong className="SkyRoute-hotel-modal-meta__val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Icon name="star" size={14} color="#D97706" /> {selectedHotel.rating} / 5.0 &bull; {selectedHotel.type}
                      </strong>
                    </div>
                  </div>

                  <div className="SkyRoute-hotel-modal-pricing SkyRoute-card">
                    <div className="SkyRoute-breakdown-row">
                      <span className="SkyRoute-breakdown-label">Guest Name:</span>
                      <strong className="SkyRoute-breakdown-val">Mahi Patel</strong>
                    </div>
                    <div className="SkyRoute-breakdown-row">
                      <span className="SkyRoute-breakdown-label">Room Type:</span>
                      <strong className="SkyRoute-breakdown-val">Deluxe Ocean View King Room</strong>
                    </div>
                    <div className="SkyRoute-breakdown-row">
                      <span className="SkyRoute-breakdown-label">Stay Duration:</span>
                      <strong className="SkyRoute-breakdown-val">3 Nights (12 Oct &ndash; 15 Oct 2026)</strong>
                    </div>
                    <div className="SkyRoute-breakdown-row">
                      <span className="SkyRoute-breakdown-label">Nightly Rate:</span>
                      <span className="SkyRoute-breakdown-val">{formatINR(selectedHotel.price)} &times; 3 Nights</span>
                    </div>
                    <div className="SkyRoute-breakdown-row">
                      <span className="SkyRoute-breakdown-label">Taxes &amp; Tourism GST:</span>
                      <span className="SkyRoute-breakdown-val">+ {formatINR(Math.round(selectedHotel.price * 3 * 0.12))}</span>
                    </div>
                    <div className="SkyRoute-breakdown-row SkyRoute-breakdown-row--total">
                      <span className="SkyRoute-breakdown-total-label">Total Payable (All GST Included):</span>
                      <strong className="SkyRoute-breakdown-total-val">
                        {formatINR(selectedHotel.price * 3 + Math.round(selectedHotel.price * 3 * 0.12))}
                      </strong>
                    </div>
                  </div>

                  <p className="SkyRoute-hotel-modal-perk">
                    ✓ {selectedHotel.cancellationPolicy}
                  </p>
                </div>
              </div>

              <div className="SkyRoute-modal__footer">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--lg"
                  onClick={handleConfirmStay}
                >
                  Confirm Reservation &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: View Hotel Voucher */}
        {selectedVoucher && (
          <div className="SkyRoute-modal-overlay" onClick={() => setSelectedVoucher(null)}>
            <div className="SkyRoute-modal" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
              <div className="SkyRoute-modal__header">
                <div>
                  <span className="SkyRoute-badge SkyRoute-badge--success">CONFIRMED VOUCHER</span>
                  <h3 className="SkyRoute-modal__title">{selectedVoucher.hotelName}</h3>
                </div>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={() => setSelectedVoucher(null)}
                >
                  &times;
                </button>
              </div>

              <div className="SkyRoute-modal__body">
                <div className="SkyRoute-hotel-voucher-content">
                  <div className="SkyRoute-voucher-row">
                    <span>Reservation Reference:</span>
                    <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--SkyRoute-navy)' }}>
                      {selectedVoucher.id}
                    </strong>
                  </div>
                  <div className="SkyRoute-voucher-row">
                    <span>Guest Name:</span>
                    <strong>{selectedVoucher.guestName}</strong>
                  </div>
                  <div className="SkyRoute-voucher-row">
                    <span>Room:</span>
                    <strong>{selectedVoucher.roomType}</strong>
                  </div>
                  <div className="SkyRoute-voucher-row">
                    <span>Check-in:</span>
                    <strong>{selectedVoucher.checkIn} (From 02:00 PM)</strong>
                  </div>
                  <div className="SkyRoute-voucher-row">
                    <span>Check-out:</span>
                    <strong>{selectedVoucher.checkOut} (Until 11:00 AM)</strong>
                  </div>
                  <div className="SkyRoute-voucher-row">
                    <span>Total Amount Paid:</span>
                    <strong style={{ color: 'var(--SkyRoute-navy)', fontSize: '1.2rem' }}>
                      {formatINR(selectedVoucher.totalAmount)}
                    </strong>
                  </div>
                  <div className="SkyRoute-voucher-row">
                    <span>Cancellation:</span>
                    <span style={{ fontSize: '0.85rem' }}>{selectedVoucher.cancellationPolicy}</span>
                  </div>
                </div>
              </div>

              <div className="SkyRoute-modal__footer">
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--outline"
                  onClick={() => setSelectedVoucher(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary"
                  onClick={handlePrintConfirmation}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Icon name="printer" size={15} color="#FFFFFF" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
