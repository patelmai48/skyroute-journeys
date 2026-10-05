import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

const INITIAL_PACKING_ITEMS = [
  { id: 'p-1', label: 'Passport & Government ID', category: 'Documents', completed: true },
  { id: 'p-2', label: 'Digital Boarding Pass', category: 'Documents', completed: true },
  { id: 'p-3', label: 'Phone & Laptop Charger', category: 'Electronics', completed: true },
  { id: 'p-4', label: 'Light Cotton Clothing', category: 'Clothing', completed: true },
  { id: 'p-5', label: 'Personal Prescription Medicine', category: 'Health', completed: true },
  { id: 'p-6', label: 'UV Sunglasses', category: 'Essentials', completed: true },
  { id: 'p-7', label: 'Beachwear & Swimsuit', category: 'Clothing', completed: false },
  { id: 'p-8', label: 'Noise-Cancelling Headphones', category: 'Electronics', completed: false },
  { id: 'p-9', label: 'Memory Foam Travel Pillow', category: 'Essentials', completed: false },
  { id: 'p-10', label: 'Reusable Water Bottle', category: 'Essentials', completed: false },
];

const INITIAL_GROUP_EXPENSES = [
  { id: 'exp-1', title: 'Roundtrip Flights (AMD ⇄ GOI)', amount: 8400, paidBy: 'You', category: 'Flight' },
  { id: 'exp-2', title: 'Beachfront Resort Stay (3 Nights)', amount: 6500, paidBy: 'Rahul Sharma', category: 'Stay' },
  { id: 'exp-3', title: 'Seafood Dinner at Thalassa', amount: 3000, paidBy: 'Sneha Patel', category: 'Food' },
  { id: 'exp-4', title: 'Self-Drive SUV Rental', amount: 2000, paidBy: 'You', category: 'Transport' },
];

const MyTrips = ({ onNavigate, onSelectBooking }) => {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | timeline | packing | group | budget
  const [bookings, setBookings] = useState([]);
  const { showToast } = useToast();

  // Smart Packing List State
  const [packingList, setPackingList] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_packing_list');
      return saved ? JSON.parse(saved) : INITIAL_PACKING_ITEMS;
    } catch (e) {
      return INITIAL_PACKING_ITEMS;
    }
  });
  const [newItemText, setNewItemText] = useState('');

  // Auto-detect category from item text (e.g. "cloths" -> "Clothing")
  const detectCategory = (text) => {
    const lower = text.toLowerCase();
    if (/cloth|shirt|pant|dress|t-shirt|tshirt|short|jacket|swim|hoodie|sock|shoe|jeans|skirt|sari|kurta|towel|hat|cap|sandal|trouser/i.test(lower)) {
      return 'Clothing';
    }
    if (/passport|id|visa|ticket|pass|license|licence|doc|insurance|card|aadhar|voter|pan|paper|voucher/i.test(lower)) {
      return 'Documents';
    }
    if (/phone|laptop|charger|power|battery|camera|headphone|earphone|airpod|ipad|tablet|cable|adapter|plug|gadget|kindle/i.test(lower)) {
      return 'Electronics';
    }
    if (/medicine|sunscreen|sanitizer|first aid|tablet|pill|ointment|cream|mask|bandaid|bandage|brush|paste|soap|shampoo|lotion|spray/i.test(lower)) {
      return 'Health';
    }
    return 'Essentials';
  };

  // Group Trip Expenses State
  const [groupExpenses, setGroupExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_group_expenses');
      return saved ? JSON.parse(saved) : INITIAL_GROUP_EXPENSES;
    } catch (e) {
      return INITIAL_GROUP_EXPENSES;
    }
  });
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpPaidBy, setNewExpPaidBy] = useState('You');
  const [groupMembers] = useState(['You', 'Rahul Sharma', 'Sneha Patel']);

  // Budget Tracker State
  const [tripBudget] = useState(25000);
  const [budgetCategories] = useState([
    { name: 'Flights', amount: 8400, icon: '✈️', color: 'var(--SkyRoute-navy)' },
    { name: 'Hotels & Stay', amount: 6500, icon: '🏨', color: 'var(--SkyRoute-teal)' },
    { name: 'Food & Dining', amount: 3000, icon: '🍜', color: 'var(--SkyRoute-rose)' },
    { name: 'Local Transport', amount: 2000, icon: '🚕', color: '#7D5A44' },
    { name: 'Sightseeing & Activities', amount: 2500, icon: '🏖️', color: '#B2967D' }
  ]);

  // Load bookings from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('skyroute_bookings') || '[]');
      if (saved.length === 0) {
        const sampleTrip = {
          bookingId: 'BK-789012',
          pnr: 'X7K29P',
          bookingDate: '2026-10-12',
          flight: {
            airline: 'IndiGo',
            airlineCode: '6E',
            flightNumber: '6E 201',
            originCity: 'Ahmedabad',
            originCode: 'AMD',
            destinationCity: 'Goa',
            destinationCode: 'GOI',
            departureTime: '08:00 AM',
            arrivalTime: '09:45 AM',
            durationText: '1h 45m',
            cabin: 'Economy',
            baggage: '15kg Check-in + 7kg Cabin'
          },
          seat: { id: '14A', type: 'Window' },
          gate: 'B12',
          terminal: 'T1',
          total: 4269,
          status: 'Confirmed'
        };
        setBookings([sampleTrip]);
      } else {
        setBookings(saved);
      }
    } catch (e) {
      setBookings([]);
    }
  }, []);

  // Save Packing list
  useEffect(() => {
    try {
      localStorage.setItem('skyroute_packing_list', JSON.stringify(packingList));
    } catch (e) {
      console.warn('Failed to save packing list:', e);
    }
  }, [packingList]);

  // Save Group Expenses
  useEffect(() => {
    try {
      localStorage.setItem('skyroute_group_expenses', JSON.stringify(groupExpenses));
    } catch (e) {
      console.warn('Failed to save group expenses:', e);
    }
  }, [groupExpenses]);

  // Packing Progress Calculation
  const packingTotal = packingList.length;
  const packingCompleted = packingList.filter((p) => p.completed).length;
  const packingPercent = packingTotal > 0 ? Math.round((packingCompleted / packingTotal) * 100) : 0;

  const handleTogglePacking = (id) => {
    setPackingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddPackingItem = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) {
      showToast('Please type an item name (e.g. Clothes, Sunglasses, Charger) first.', 'error');
      return;
    }
    const detectedCategory = detectCategory(trimmed);
    setPackingList((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        label: trimmed,
        category: detectedCategory,
        completed: false
      }
    ]);
    setNewItemText('');
    showToast(`"${trimmed}" added to ${detectedCategory} list.`, 'success');
  };

  const handleDeletePackingItem = (id) => {
    setPackingList((prev) => prev.filter((item) => item.id !== id));
    showToast('Packing item removed.', 'info');
  };

  // Group Expenses Calculations
  const groupTotalExpense = groupExpenses.reduce((sum, item) => sum + item.amount, 0);
  const perPersonSplit = Math.round(groupTotalExpense / groupMembers.length);

  const handleAddGroupExpense = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmedTitle = newExpTitle.trim();
    if (!trimmedTitle) {
      showToast('Please enter an expense description.', 'error');
      return;
    }
    const numAmount = Number(newExpAmount);
    if (!numAmount || numAmount <= 0) {
      showToast('Please enter a valid expense amount in ₹.', 'error');
      return;
    }
    setGroupExpenses((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        title: trimmedTitle,
        amount: numAmount,
        paidBy: newExpPaidBy || 'You',
        category: 'General'
      }
    ]);
    setNewExpTitle('');
    setNewExpAmount('');
    showToast(`Expense "${trimmedTitle}" (₹${numAmount.toLocaleString('en-IN')}) added.`, 'success');
  };

  const handleDeleteGroupExpense = (id) => {
    setGroupExpenses((prev) => prev.filter((item) => item.id !== id));
    showToast('Expense removed.', 'info');
  };

  // Total Budget Spent
  const totalBudgetSpent = budgetCategories.reduce((sum, c) => sum + c.amount, 0);
  const budgetRemaining = tripBudget - totalBudgetSpent;
  const budgetSpentPercent = Math.min(100, Math.round((totalBudgetSpent / tripBudget) * 100));

  return (
    <div className="SkyRoute-mytrips-page">
      <div className="SkyRoute-container">
        {/* Header Title */}
        <div className="SkyRoute-section-header">
          <div className="SkyRoute-section-header__left">
            <span className="SkyRoute-badge SkyRoute-badge--teal">TRAVEL MANAGEMENT</span>
            <h1 className="SkyRoute-section-header__title" style={{ marginTop: '0.5rem' }}>
              My Trips &amp; Travel Suite
            </h1>
            <p className="SkyRoute-section-header__subtitle">
              Manage your upcoming reservations, live journey timelines, packing checklists, and shared expenses.
            </p>
          </div>
          <button
            type="button"
            className="SkyRoute-btn SkyRoute-btn--primary"
            onClick={() => onNavigate('/flights')}
          >
            + Book New Flight
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="SkyRoute-trips-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            className={`SkyRoute-trips-tab ${activeTab === 'upcoming' ? 'SkyRoute-trips-tab--active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span>✈️</span>
            <span>Upcoming Trips ({bookings.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'timeline'}
            className={`SkyRoute-trips-tab ${activeTab === 'timeline' ? 'SkyRoute-trips-tab--active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <span>⏱️</span>
            <span>Journey Timeline</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'packing'}
            className={`SkyRoute-trips-tab ${activeTab === 'packing' ? 'SkyRoute-trips-tab--active' : ''}`}
            onClick={() => setActiveTab('packing')}
          >
            <span>🎒</span>
            <span>Packing List ({packingPercent}%)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'group'}
            className={`SkyRoute-trips-tab ${activeTab === 'group' ? 'SkyRoute-trips-tab--active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <span>👥</span>
            <span>Group Trip Split</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'budget'}
            className={`SkyRoute-trips-tab ${activeTab === 'budget' ? 'SkyRoute-trips-tab--active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <span>💰</span>
            <span>Trip Budget</span>
          </button>
        </div>

        {/* Tab 1: Upcoming Trips */}
        {activeTab === 'upcoming' && (
          <div className="SkyRoute-trips-content-block">
            {bookings.length === 0 ? (
              <div className="SkyRoute-empty-state SkyRoute-card">
                <span className="SkyRoute-empty-state__icon">✈️</span>
                <h3 className="SkyRoute-empty-state__title">No Upcoming Bookings Found</h3>
                <p className="SkyRoute-empty-state__subtitle">
                  You don't have any confirmed flights right now. Ready to start your next adventure?
                </p>
                <button
                  type="button"
                  className="SkyRoute-btn SkyRoute-btn--primary"
                  onClick={() => onNavigate('/flights')}
                >
                  Search Flights Now
                </button>
              </div>
            ) : (
              <div className="SkyRoute-trips-list">
                {bookings.map((booking) => (
                  <div key={booking.bookingId || booking.pnr} className="SkyRoute-trip-card SkyRoute-card">
                    <div className="SkyRoute-trip-card__header">
                      <div className="SkyRoute-trip-card__badges">
                        <span className="SkyRoute-badge SkyRoute-badge--success">CONFIRMED</span>
                        <span className="SkyRoute-badge">PNR: {booking.pnr}</span>
                      </div>
                      <span className="SkyRoute-trip-card__date">
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '12 Oct 2026'}
                      </span>
                    </div>

                    <div className="SkyRoute-trip-card__body">
                      <div className="SkyRoute-trip-card__route-row">
                        <div>
                          <strong className="SkyRoute-trip-card__city">
                            {booking.flight?.originCity || 'Ahmedabad'} ({booking.flight?.originCode || 'AMD'})
                          </strong>
                          <span className="SkyRoute-trip-card__time">{booking.flight?.departureTime || '08:00 AM'}</span>
                        </div>

                        <div className="SkyRoute-trip-card__vector">
                          <span className="SkyRoute-trip-card__airline-info">
                            {booking.flight?.airline || 'IndiGo'} &bull; {booking.flight?.flightNumber || '6E 201'}
                          </span>
                          <div className="SkyRoute-trip-card__vector-line">✈</div>
                          <span className="SkyRoute-trip-card__duration">{booking.flight?.durationText || '1h 45m'}</span>
                        </div>

                        <div>
                          <strong className="SkyRoute-trip-card__city">
                            {booking.flight?.destinationCity || 'Goa'} ({booking.flight?.destinationCode || 'GOI'})
                          </strong>
                          <span className="SkyRoute-trip-card__time">{booking.flight?.arrivalTime || '09:45 AM'}</span>
                        </div>
                      </div>

                      <div className="SkyRoute-trip-card__meta-strip">
                        <div className="SkyRoute-trip-meta-item">
                          <span>SEAT</span>
                          <strong>{booking.seat?.id || '14A'}</strong>
                        </div>
                        <div className="SkyRoute-trip-meta-item">
                          <span>BAGGAGE</span>
                          <strong>{booking.flight?.baggage || '15kg Check-in'}</strong>
                        </div>
                        <div className="SkyRoute-trip-meta-item">
                          <span>GATE</span>
                          <strong>{booking.gate || 'B12'} (Terminal {booking.terminal || 'T1'})</strong>
                        </div>
                        <div className="SkyRoute-trip-meta-item">
                          <span>TOTAL FARE</span>
                          <strong>{formatINR(booking.total || 4269)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="SkyRoute-trip-card__footer">
                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                        onClick={() => {
                          if (onSelectBooking) onSelectBooking(booking);
                          onNavigate('/booking-confirmation');
                        }}
                      >
                        View Boarding Pass &rarr;
                      </button>

                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                        onClick={() => onNavigate('/manage-booking')}
                      >
                        Manage Booking
                      </button>

                      <button
                        type="button"
                        className="SkyRoute-btn SkyRoute-btn--secondary SkyRoute-btn--sm"
                        onClick={() => onNavigate('/flight-status')}
                      >
                        Live Flight Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Journey Timeline (8 Milestones) */}
        {activeTab === 'timeline' && (
          <div className="SkyRoute-timeline-block SkyRoute-card">
            <div className="SkyRoute-timeline-header">
              <span className="SkyRoute-badge SkyRoute-badge--teal">Flight 6E 201 &bull; PNR: X7K29P</span>
              <h3 className="SkyRoute-timeline-title">Journey Day Vertical Timeline</h3>
              <p className="SkyRoute-timeline-subtitle">
                Complete travel step-by-step guidance from airport arrival to baggage claim.
              </p>
            </div>

            <div className="SkyRoute-journey-timeline">
              {[
                { time: '10:00 AM', title: 'Airport Arrival', status: 'Completed', desc: 'Arrived at Terminal 1 departures entrance.', icon: '🏢', completed: true },
                { time: '10:45 AM', title: 'Baggage Drop', status: 'Completed', desc: 'Checked in 15kg bag at IndiGo Counter 4.', icon: '🧳', completed: true },
                { time: '11:30 AM', title: 'Security Clearance', status: 'Completed', desc: 'Cleared security frisking and baggage x-ray scan.', icon: '🛡️', completed: true },
                { time: '12:00 PM', title: 'Gate Entry', status: 'Completed', desc: 'Reached Gate B12 waiting lounge area.', icon: '🚪', completed: true },
                { time: '12:10 PM', title: 'Boarding Call', status: 'Now Boarding', desc: 'Zone 1 & Zone 2 priority boarding in progress.', icon: '✈️', active: true },
                { time: '12:40 PM', title: 'Pushback & Takeoff', status: 'Scheduled', desc: 'Runway taxi and scheduled takeoff for Goa (GOI).', icon: '🛫', active: false },
                { time: '02:15 PM', title: 'Touchdown & Landing', status: 'Scheduled', desc: 'Expected on-time landing at Dabolim Airport.', icon: '🛬', active: false },
                { time: '02:35 PM', title: 'Baggage Claim', status: 'Scheduled', desc: 'Collect check-in luggage from Carousel Belt 3.', icon: '🏁', active: false }
              ].map((step, index) => (
                <div
                  key={index}
                  className={`SkyRoute-timeline-step ${step.completed ? 'SkyRoute-timeline-step--done' : ''} ${step.active ? 'SkyRoute-timeline-step--active' : ''}`}
                >
                  <div className="SkyRoute-timeline-time-col">
                    <strong>{step.time}</strong>
                    <span className="SkyRoute-timeline-step-status">{step.status}</span>
                  </div>
                  <div className="SkyRoute-timeline-node">
                    <span className="SkyRoute-timeline-icon">{step.icon}</span>
                    {index < 7 && <div className="SkyRoute-timeline-line"></div>}
                  </div>
                  <div className="SkyRoute-timeline-content-col">
                    <strong className="SkyRoute-timeline-step-title">{step.title}</strong>
                    <p className="SkyRoute-timeline-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Smart Packing List (3-Column Responsive Checklist) */}
        {activeTab === 'packing' && (
          <div className="SkyRoute-packing-block SkyRoute-card">
            <div className="SkyRoute-packing-header">
              <div className="SkyRoute-packing-header__left">
                <span className="SkyRoute-badge SkyRoute-badge--teal">Packing for Goa 🌴</span>
                <h3 className="SkyRoute-packing-title">Smart Packing Checklist</h3>
                <p className="SkyRoute-packing-subtitle">
                  Never leave essentials behind. Check off items as you pack your bags.
                </p>
              </div>

              {/* Progress Card */}
              <div className="SkyRoute-packing-progress-box">
                <div className="SkyRoute-packing-progress-top">
                  <span>Packing Progress</span>
                  <strong>{packingPercent}% Packed</strong>
                </div>
                <div className="SkyRoute-progress-track">
                  <div className="SkyRoute-progress-fill" style={{ width: `${packingPercent}%` }}></div>
                </div>
                <span className="SkyRoute-packing-counts">
                  {packingCompleted} of {packingTotal} items packed
                </span>
              </div>
            </div>

            {/* Add New Item Form - Single Search Input & Add Item Button */}
            <form className="SkyRoute-packing-add-form" onSubmit={handleAddPackingItem}>
              <div className="SkyRoute-packing-input-wrap">
                <span className="SkyRoute-packing-input-icon">🔍</span>
                <input
                  type="text"
                  className="SkyRoute-text-input SkyRoute-packing-search-input"
                  placeholder="Type packing item (e.g. Clothes, Sunglasses, Passport)..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                />
              </div>
              <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-packing-submit-btn">
                + Add Item
              </button>
            </form>

            {/* 3-Column Checklist Grid */}
            <div className="SkyRoute-packing-items-grid">
              {packingList.map((item) => (
                <div
                  key={item.id}
                  className={`SkyRoute-packing-item-card ${item.completed ? 'SkyRoute-packing-item-card--done' : ''}`}
                >
                  <label className="SkyRoute-packing-checkbox-label">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleTogglePacking(item.id)}
                    />
                    <div className="SkyRoute-packing-item-text-wrapper">
                      <span className="SkyRoute-packing-item-title">{item.label}</span>
                      <span className="SkyRoute-packing-item-category">{item.category}</span>
                    </div>
                  </label>
                  <button
                    type="button"
                    className="SkyRoute-packing-delete-btn"
                    onClick={() => handleDeletePackingItem(item.id)}
                    title="Delete item"
                    aria-label={`Delete ${item.label}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Group Trip Expense Splitter */}
        {activeTab === 'group' && (
          <div className="SkyRoute-group-block SkyRoute-card">
            <div className="SkyRoute-group-header">
              <div>
                <span className="SkyRoute-badge SkyRoute-badge--teal">Goa Trip 🌴</span>
                <h3 className="SkyRoute-group-title">Group Expense Splitter</h3>
                <p className="SkyRoute-group-subtitle">
                  Members: {groupMembers.join(', ')} ({groupMembers.length} Travellers)
                </p>
              </div>

              <div className="SkyRoute-group-split-summary-box">
                <div className="SkyRoute-group-stat">
                  <span>Total Expenses</span>
                  <strong className="SkyRoute-group-total-val">{formatINR(groupTotalExpense)}</strong>
                </div>
                <div className="SkyRoute-group-stat">
                  <span>Per Person Split</span>
                  <strong className="SkyRoute-group-split-val" style={{ color: 'var(--SkyRoute-navy)' }}>
                    {formatINR(perPersonSplit)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Settlement Status Overview Cards */}
            <div className="SkyRoute-group-owe-strip">
              <div className="SkyRoute-group-owe-card">
                <span>You Owe</span>
                <strong style={{ color: '#7D5A44' }}>₹0</strong>
              </div>
              <div className="SkyRoute-group-owe-card">
                <span>You Are Owed</span>
                <strong style={{ color: 'var(--SkyRoute-navy)' }}>₹1,450</strong>
              </div>
              <div className="SkyRoute-group-owe-card">
                <span>Settled</span>
                <strong style={{ color: 'var(--SkyRoute-teal)' }}>₹8,400</strong>
              </div>
            </div>

            {/* Add Expense Form */}
            <form className="SkyRoute-group-add-form" onSubmit={handleAddGroupExpense}>
              <input
                type="text"
                className="SkyRoute-text-input"
                placeholder="Expense description (e.g. Scuba Diving at Grand Island)..."
                value={newExpTitle}
                onChange={(e) => setNewExpTitle(e.target.value)}
              />
              <input
                type="number"
                className="SkyRoute-text-input"
                placeholder="Amount (₹)"
                value={newExpAmount}
                onChange={(e) => setNewExpAmount(e.target.value)}
              />
              <select
                className="SkyRoute-select-input"
                value={newExpPaidBy}
                onChange={(e) => setNewExpPaidBy(e.target.value)}
              >
                {groupMembers.map((m) => (
                  <option key={m} value={m}>
                    Paid by {m}
                  </option>
                ))}
              </select>
              <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary">
                + Add Expense
              </button>
            </form>

            {/* Expense Cards Grid */}
            <div className="SkyRoute-group-expenses-list">
              {groupExpenses.map((exp) => (
                <div key={exp.id} className="SkyRoute-group-expense-item">
                  <div className="SkyRoute-group-exp-left">
                    <span className="SkyRoute-group-exp-icon">💳</span>
                    <div>
                      <strong className="SkyRoute-group-exp-title">{exp.title}</strong>
                      <span className="SkyRoute-group-exp-paid">Paid by {exp.paidBy} &bull; Split 3 ways</span>
                    </div>
                  </div>
                  <div className="SkyRoute-group-exp-right">
                    <strong className="SkyRoute-group-exp-amount">{formatINR(exp.amount)}</strong>
                    <button
                      type="button"
                      className="SkyRoute-packing-delete-btn"
                      onClick={() => handleDeleteGroupExpense(exp.id)}
                      title="Remove expense"
                      aria-label={`Remove ${exp.title}`}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Trip Budget Tracker */}
        {activeTab === 'budget' && (
          <div className="SkyRoute-budget-block SkyRoute-card">
            <div className="SkyRoute-budget-header">
              <div>
                <span className="SkyRoute-badge SkyRoute-badge--teal">GOA TRIP BUDGET</span>
                <h3 className="SkyRoute-budget-title">Trip Budget Tracker</h3>
                <p className="SkyRoute-budget-subtitle">
                  Visual breakdown of estimated holiday budget vs actual expenses.
                </p>
              </div>

              <div className="SkyRoute-budget-overview-pill">
                <div className="SkyRoute-budget-overview-item">
                  <span>Target Budget</span>
                  <strong>{formatINR(tripBudget)}</strong>
                </div>
                <div className="SkyRoute-budget-overview-item">
                  <span>Total Spent</span>
                  <strong>{formatINR(totalBudgetSpent)}</strong>
                </div>
                <div className="SkyRoute-budget-overview-item">
                  <span>Remaining</span>
                  <strong style={{ color: budgetRemaining >= 0 ? '#7D5A44' : '#7D5A44' }}>
                    {formatINR(budgetRemaining)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Visual Budget Meter */}
            <div className="SkyRoute-budget-meter-container">
              <div className="SkyRoute-budget-meter-labels">
                <span>Budget Used: {budgetSpentPercent}%</span>
                <span>Remaining: {formatINR(budgetRemaining)}</span>
              </div>
              <div className="SkyRoute-budget-meter-bar">
                <div
                  className="SkyRoute-budget-meter-fill"
                  style={{
                    width: `${budgetSpentPercent}%`,
                    backgroundColor: budgetSpentPercent > 90 ? '#7D5A44' : 'var(--SkyRoute-navy)'
                  }}
                ></div>
              </div>
            </div>

            {/* Category Breakdown Cards */}
            <div className="SkyRoute-budget-categories-grid">
              {budgetCategories.map((cat, index) => (
                <div key={index} className="SkyRoute-budget-cat-card">
                  <div className="SkyRoute-budget-cat-card__top">
                    <span className="SkyRoute-budget-cat-icon">{cat.icon}</span>
                    <strong className="SkyRoute-budget-cat-name">{cat.name}</strong>
                  </div>
                  <div className="SkyRoute-budget-cat-amount">{formatINR(cat.amount)}</div>
                  <div className="SkyRoute-budget-cat-progress">
                    <div
                      className="SkyRoute-budget-cat-progress-fill"
                      style={{
                        width: `${Math.round((cat.amount / totalBudgetSpent) * 100)}%`,
                        backgroundColor: cat.color
                      }}
                    ></div>
                  </div>
                  <span className="SkyRoute-budget-cat-percent">
                    {Math.round((cat.amount / totalBudgetSpent) * 100)}% of total spent
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
