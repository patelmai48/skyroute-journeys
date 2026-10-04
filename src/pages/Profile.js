import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import '../styles/Profile.scss';

const Profile = ({ onNavigate }) => {
  const { showSuccess, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState('personal'); // personal | travellers | preferences | payment
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // 1. Personal Info State
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const auth = localStorage.getItem('skyroute_auth_user');
      const authUser = auth ? JSON.parse(auth) : null;
      const saved = localStorage.getItem('skyroute_profile_info');
      const base = saved ? JSON.parse(saved) : {};

      if (authUser) {
        return {
          fullName: authUser.name || base.fullName || 'SkyRoute Traveler',
          email: authUser.email || base.email || 'traveler@skyroute.com',
          avatar: authUser.picture || authUser.avatar || base.avatar || '👤',
          phone: base.phone || '+91 98765 43210',
          dob: base.dob || '1998-05-14',
          nationality: base.nationality || 'Indian',
          passport: base.passport || 'Z9841203',
          memberTier: base.memberTier || 'SkyRoute Gold Member',
          points: base.points || 12450
        };
      }

      return {
        fullName: base.fullName || 'Kinjal Patel',
        email: base.email || 'kinjal.patel@example.com',
        avatar: base.avatar || '👤',
        phone: base.phone || '+91 98765 43210',
        dob: base.dob || '1998-05-14',
        nationality: base.nationality || 'Indian',
        passport: base.passport || 'Z9841203',
        memberTier: base.memberTier || 'SkyRoute Gold Member',
        points: base.points || 12450
      };
    } catch (e) {
      return {
        fullName: 'Kinjal Patel',
        email: 'kinjal.patel@example.com',
        avatar: '👤',
        phone: '+91 98765 43210',
        dob: '1998-05-14',
        nationality: 'Indian',
        passport: 'Z9841203',
        memberTier: 'SkyRoute Gold Member',
        points: 12450
      };
    }
  });

  // 2. Co-Travellers State
  const [savedTravellers, setSavedTravellers] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_saved_travellers');
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'st-1', name: 'Rahul Sharma', relation: 'Friend', gender: 'Male', dob: '1996-08-22', passport: 'T8492019' },
            { id: 'st-2', name: 'Sneha Patel', relation: 'Family', gender: 'Female', dob: '2001-11-05', passport: 'K2094812' }
          ];
    } catch (e) {
      return [
        { id: 'st-1', name: 'Rahul Sharma', relation: 'Friend', gender: 'Male', dob: '1996-08-22', passport: 'T8492019' },
        { id: 'st-2', name: 'Sneha Patel', relation: 'Family', gender: 'Female', dob: '2001-11-05', passport: 'K2094812' }
      ];
    }
  });

  // 3. Travel Preferences State
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_travel_prefs');
      return saved
        ? JSON.parse(saved)
        : {
            cabin: 'Economy',
            seat: 'Window',
            meal: 'Vegetarian Hindu Meal (HNML)',
            preferredAirlines: ['IndiGo', 'Air India', 'Vistara'],
            smsAlerts: true,
            emailAlerts: true,
            whatsappAlerts: true,
            autoWebCheckin: true
          };
    } catch (e) {
      return {
        cabin: 'Economy',
        seat: 'Window',
        meal: 'Vegetarian Hindu Meal (HNML)',
        preferredAirlines: ['IndiGo', 'Air India', 'Vistara'],
        smsAlerts: true,
        emailAlerts: true,
        whatsappAlerts: true,
        autoWebCheckin: true
      };
    }
  });

  // 4. Saved Payment Methods State
  const [paymentCards, setPaymentCards] = useState(() => {
    try {
      const saved = localStorage.getItem('skyroute_saved_cards');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'card-1',
              type: 'Credit Card',
              brand: 'HDFC Bank Millennia',
              network: 'Visa',
              lastFour: '8892',
              expiry: '08/28',
              holder: 'MAHI PATEL',
              isDefault: true,
              color: 'linear-gradient(135deg, #4A342A 0%, #7D5A44 100%)'
            },
            {
              id: 'card-2',
              type: 'Debit Card',
              brand: 'ICICI Coral Debit',
              network: 'Mastercard',
              lastFour: '4109',
              expiry: '11/29',
              holder: 'MAHI PATEL',
              isDefault: false,
              color: 'linear-gradient(135deg, #7D5A44 0%, #B2967D 100%)'
            }
          ];
    } catch (e) {
      return [];
    }
  });

  // Modals state
  const [showTravellerModal, setShowTravellerModal] = useState(false);
  const [editingTraveller, setEditingTraveller] = useState(null);
  const [travellerForm, setTravellerForm] = useState({
    name: '',
    relation: 'Friend',
    gender: 'Male',
    dob: '',
    passport: ''
  });

  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({
    brand: 'HDFC Bank',
    network: 'Visa',
    type: 'Credit Card',
    number: '',
    expiry: '',
    holder: 'MAHI PATEL'
  });

  // Save Effects
  useEffect(() => {
    try {
      localStorage.setItem('skyroute_saved_travellers', JSON.stringify(savedTravellers));
    } catch (e) {
      console.warn(e);
    }
  }, [savedTravellers]);

  useEffect(() => {
    try {
      localStorage.setItem('skyroute_travel_prefs', JSON.stringify(preferences));
    } catch (e) {
      console.warn(e);
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem('skyroute_saved_cards', JSON.stringify(paymentCards));
    } catch (e) {
      console.warn(e);
    }
  }, [paymentCards]);

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setIsSavingPersonal(true);
    try {
      localStorage.setItem('skyroute_profile_info', JSON.stringify(userInfo));
      const currentAuth = localStorage.getItem('skyroute_auth_user');
      if (currentAuth) {
        try {
          const parsed = JSON.parse(currentAuth);
          localStorage.setItem('skyroute_auth_user', JSON.stringify({
            ...parsed,
            name: userInfo.fullName,
            email: userInfo.email
          }));
        } catch (e) {}
      }
      if (showSuccess) showSuccess('✓ Changes saved successfully');
    } catch (err) {
      console.warn(err);
    }
    setTimeout(() => {
      setIsSavingPersonal(false);
    }, 600);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    try {
      localStorage.setItem('skyroute_travel_prefs', JSON.stringify(preferences));
      if (showSuccess) showSuccess('✓ Preferences saved successfully.');
    } catch (err) {
      console.warn(err);
    }
    setTimeout(() => {
      setIsSavingPrefs(false);
    }, 600);
  };

  // Co-Traveller Handlers
  const handleOpenAddTraveller = () => {
    setEditingTraveller(null);
    setTravellerForm({ name: '', relation: 'Friend', gender: 'Male', dob: '1998-01-01', passport: '' });
    setShowTravellerModal(true);
  };

  const handleOpenEditTraveller = (tr) => {
    setEditingTraveller(tr);
    setTravellerForm({
      name: tr.name,
      relation: tr.relation,
      gender: tr.gender,
      dob: tr.dob,
      passport: tr.passport || ''
    });
    setShowTravellerModal(true);
  };

  const handleSaveTraveller = (e) => {
    e.preventDefault();
    if (!travellerForm.name.trim()) return;

    if (editingTraveller) {
      setSavedTravellers((prev) =>
        prev.map((t) => (t.id === editingTraveller.id ? { ...t, ...travellerForm } : t))
      );
      if (showSuccess) showSuccess('✓ Co-Traveller details updated');
    } else {
      const newT = {
        id: `st-${Date.now()}`,
        ...travellerForm
      };
      setSavedTravellers((prev) => [...prev, newT]);
      if (showSuccess) showSuccess('✓ New Co-Traveller added');
    }
    setShowTravellerModal(false);
  };

  const handleDeleteTraveller = (id) => {
    setSavedTravellers((prev) => prev.filter((t) => t.id !== id));
    if (showInfo) showInfo('Co-Traveller removed');
  };

  // Payment Cards Handlers
  const handleSetDefaultCard = (id) => {
    setPaymentCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
    if (showSuccess) showSuccess('✓ Default payment card updated');
  };

  const handleDeleteCard = (id) => {
    setPaymentCards((prev) => prev.filter((c) => c.id !== id));
    if (showInfo) showInfo('Payment method removed');
  };

  const handleSaveNewCard = (e) => {
    e.preventDefault();
    const rawNumber = cardForm.number.replace(/\s+/g, '');
    const lastFour = rawNumber.slice(-4) || '1234';

    const newCard = {
      id: `card-${Date.now()}`,
      type: cardForm.type,
      brand: `${cardForm.brand} ${cardForm.type}`,
      network: cardForm.network,
      lastFour,
      expiry: cardForm.expiry || '12/28',
      holder: (cardForm.holder || userInfo.fullName).toUpperCase(),
      isDefault: paymentCards.length === 0,
      color: 'linear-gradient(135deg, #4A342A 0%, #7D5A44 100%)'
    };

    setPaymentCards((prev) => [...prev, newCard]);
    setShowCardModal(false);
    if (showSuccess) showSuccess('✓ New payment method added securely');
  };

  return (
    <div className="SkyRoute-profile-page">
      <div className="SkyRoute-container">
        {/* Profile Hero Header Card */}
        <div className="SkyRoute-profile-hero-card SkyRoute-card">
          <div className="SkyRoute-profile-avatar-box">
            {userInfo.avatar && typeof userInfo.avatar === 'string' && (userInfo.avatar.startsWith('http') || userInfo.avatar.startsWith('data:')) ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.fullName || 'User'}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'block';
                  }
                }}
              />
            ) : null}
            <span style={{ display: userInfo.avatar && typeof userInfo.avatar === 'string' && userInfo.avatar.startsWith('http') ? 'none' : 'block' }}>
              {userInfo.fullName ? userInfo.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'SK'}
            </span>
          </div>
          <div className="SkyRoute-profile-hero-meta">
            <div className="SkyRoute-profile-title-row">
              <h1 className="SkyRoute-profile-name">{userInfo.fullName}</h1>
              <span className="SkyRoute-badge SkyRoute-badge--success">{userInfo.memberTier}</span>
            </div>
            <p className="SkyRoute-profile-sub">
              {userInfo.email} &bull; {userInfo.phone} &bull; Nationality: {userInfo.nationality}
            </p>
          </div>
          <div className="SkyRoute-profile-points-box">
            <span className="SkyRoute-points-label">SkyMiles Balance</span>
            <strong className="SkyRoute-points-value">{userInfo.points.toLocaleString()} pts</strong>
          </div>
        </div>

        {/* 2-Column Settings Layout */}
        <div className="SkyRoute-profile-layout">
          {/* Left Navigation Sidebar */}
          <div className="SkyRoute-profile-nav-col">
            <div className="SkyRoute-profile-nav-menu SkyRoute-card">
              <button
                type="button"
                className={`SkyRoute-profile-nav-link ${activeTab === 'personal' ? 'SkyRoute-profile-nav-link--active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <span className="SkyRoute-profile-tab-icon">👤</span>
                <div className="SkyRoute-profile-tab-text">
                  <strong>Personal Information</strong>
                  <span>Name, email, passport &amp; contact</span>
                </div>
              </button>

              <button
                type="button"
                className={`SkyRoute-profile-nav-link ${activeTab === 'travellers' ? 'SkyRoute-profile-nav-link--active' : ''}`}
                onClick={() => setActiveTab('travellers')}
              >
                <span className="SkyRoute-profile-tab-icon">👥</span>
                <div className="SkyRoute-profile-tab-text">
                  <strong>Saved Co-Travellers</strong>
                  <span>Family &amp; frequent travel companions</span>
                </div>
              </button>

              <button
                type="button"
                className={`SkyRoute-profile-nav-link ${activeTab === 'preferences' ? 'SkyRoute-profile-nav-link--active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <span className="SkyRoute-profile-tab-icon">⚙️</span>
                <div className="SkyRoute-profile-tab-text">
                  <strong>Travel Preferences</strong>
                  <span>Cabin, meal, seat &amp; airline choices</span>
                </div>
              </button>

              <button
                type="button"
                className={`SkyRoute-profile-nav-link ${activeTab === 'payment' ? 'SkyRoute-profile-nav-link--active' : ''}`}
                onClick={() => setActiveTab('payment')}
              >
                <span className="SkyRoute-profile-tab-icon">💳</span>
                <div className="SkyRoute-profile-tab-text">
                  <strong>Saved Payment Methods</strong>
                  <span>Credit/debit cards &amp; UPI accounts</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="SkyRoute-profile-main-col">
            {/* ============================================================
               SECTION 1: PERSONAL INFORMATION
               ============================================================ */}
            {activeTab === 'personal' && (
              <div className="SkyRoute-profile-content-card SkyRoute-card">
                <div className="SkyRoute-profile-content-header">
                  <div>
                    <h2 className="SkyRoute-profile-section-title">Personal Information</h2>
                    <p className="SkyRoute-profile-section-desc">
                      Manage your official contact and identification details for seamless airline check-ins and bookings.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSavePersonalInfo}>
                  <div className="SkyRoute-profile-form-grid">
                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Full Name (as per Passport/ID) *</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        value={userInfo.fullName}
                        onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Email Address *</label>
                      <input
                        type="email"
                        className="SkyRoute-text-input"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="SkyRoute-text-input"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Date of Birth</label>
                      <input
                        type="date"
                        className="SkyRoute-text-input"
                        value={userInfo.dob}
                        onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Nationality</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        value={userInfo.nationality}
                        onChange={(e) => setUserInfo({ ...userInfo, nationality: e.target.value })}
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Passport / National ID Number</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        value={userInfo.passport}
                        onChange={(e) => setUserInfo({ ...userInfo, passport: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="SkyRoute-profile-form-actions">
                    <button
                      type="submit"
                      className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--md"
                      disabled={isSavingPersonal}
                    >
                      {isSavingPersonal ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================
               SECTION 2: SAVED CO-TRAVELLERS
               ============================================================ */}
            {activeTab === 'travellers' && (
              <div className="SkyRoute-profile-content-card SkyRoute-card">
                <div className="SkyRoute-profile-content-header">
                  <div>
                    <h2 className="SkyRoute-profile-section-title">Saved Co-Travellers</h2>
                    <p className="SkyRoute-profile-section-desc">
                      Add family, colleagues, and travel buddies to auto-fill their passenger details during checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                    onClick={handleOpenAddTraveller}
                  >
                    + Add Co-Traveller
                  </button>
                </div>

                <div className="SkyRoute-travellers-cards-grid">
                  {savedTravellers.length === 0 ? (
                    <div className="SkyRoute-empty-state" style={{ padding: '2rem' }}>
                      <p>No saved co-travellers yet. Click "+ Add Co-Traveller" to save frequent companions.</p>
                    </div>
                  ) : (
                    savedTravellers.map((tr) => (
                      <div key={tr.id} className="SkyRoute-traveller-card">
                        <div className="SkyRoute-traveller-card__header">
                          <div className="SkyRoute-traveller-card__avatar">
                            {tr.name ? tr.name[0].toUpperCase() : 'T'}
                          </div>
                          <div>
                            <strong className="SkyRoute-traveller-card__name">{tr.name}</strong>
                            <span className="SkyRoute-badge" style={{ marginTop: '2px', display: 'inline-block' }}>
                              {tr.relation}
                            </span>
                          </div>
                        </div>

                        <div className="SkyRoute-traveller-card__meta">
                          <div className="SkyRoute-tr-meta-row">
                            <span>Gender:</span>
                            <strong>{tr.gender}</strong>
                          </div>
                          <div className="SkyRoute-tr-meta-row">
                            <span>Date of Birth:</span>
                            <strong>{tr.dob || 'Not provided'}</strong>
                          </div>
                          {tr.passport && (
                            <div className="SkyRoute-tr-meta-row">
                              <span>Passport:</span>
                              <strong>{tr.passport}</strong>
                            </div>
                          )}
                        </div>

                        <div className="SkyRoute-traveller-card__actions">
                          <button
                            type="button"
                            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                            onClick={() => handleOpenEditTraveller(tr)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--sm"
                            style={{ borderColor: '#7D5A44', color: '#7D5A44' }}
                            onClick={() => handleDeleteTraveller(tr.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ============================================================
               SECTION 3: TRAVEL PREFERENCES
               ============================================================ */}
            {activeTab === 'preferences' && (
              <div className="SkyRoute-profile-content-card SkyRoute-card">
                <div className="SkyRoute-profile-content-header">
                  <div>
                    <h2 className="SkyRoute-profile-section-title">Travel Preferences</h2>
                    <p className="SkyRoute-profile-section-desc">
                      Customize your preferred in-flight dining, seating locations, and automated flight notification alerts.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSavePreferences}>
                  <div className="SkyRoute-profile-form-grid">
                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Preferred Cabin Class</label>
                      <select
                        className="SkyRoute-select-input"
                        value={preferences.cabin}
                        onChange={(e) => setPreferences({ ...preferences, cabin: e.target.value })}
                      >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business Class</option>
                        <option value="First Class">First Class</option>
                      </select>
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Preferred Seat Location</label>
                      <select
                        className="SkyRoute-select-input"
                        value={preferences.seat}
                        onChange={(e) => setPreferences({ ...preferences, seat: e.target.value })}
                      >
                        <option value="Window">Window Seat (Scenic View)</option>
                        <option value="Aisle">Aisle Seat (Easy Access)</option>
                        <option value="Extra Legroom">Extra Legroom Preferred</option>
                        <option value="Middle">No Preference</option>
                      </select>
                    </div>

                    <div className="SkyRoute-form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="SkyRoute-field-label">Special In-Flight Meal</label>
                      <select
                        className="SkyRoute-select-input"
                        value={preferences.meal}
                        onChange={(e) => setPreferences({ ...preferences, meal: e.target.value })}
                      >
                        <option value="Vegetarian Hindu Meal (HNML)">Vegetarian Hindu Meal (HNML)</option>
                        <option value="Jain Vegetarian Meal (VJML)">Jain Vegetarian Meal (VJML)</option>
                        <option value="Non-Vegetarian Standard">Non-Vegetarian Standard</option>
                        <option value="Gluten-Free Meal (GFML)">Gluten-Free Meal (GFML)</option>
                        <option value="Diabetic Meal (DBML)">Diabetic Meal (DBML)</option>
                        <option value="Vegan Meal (VGML)">Vegan Meal (VGML)</option>
                        <option value="Child Meal (CHML)">Child Meal (CHML)</option>
                      </select>
                    </div>
                  </div>

                  <div className="SkyRoute-pref-divider"></div>

                  <h3 className="SkyRoute-pref-subtitle">Flight Notifications &amp; Alerts</h3>
                  <div className="SkyRoute-notification-toggles-list">
                    <label className="SkyRoute-toggle-item">
                      <div>
                        <strong>SMS Departure &amp; Gate Updates</strong>
                        <span>Receive instant texts when gate or flight time changes</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.smsAlerts}
                        onChange={(e) => setPreferences({ ...preferences, smsAlerts: e.target.checked })}
                      />
                    </label>

                    <label className="SkyRoute-toggle-item">
                      <div>
                        <strong>Email E-Tickets &amp; Invoices</strong>
                        <span>Receive booking receipts, PDF boarding passes and tax invoices</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailAlerts}
                        onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
                      />
                    </label>

                    <label className="SkyRoute-toggle-item">
                      <div>
                        <strong>Automated Web Check-in Assistance</strong>
                        <span>Automatically auto-check-in 24 hours prior to scheduled departure</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.autoWebCheckin}
                        onChange={(e) => setPreferences({ ...preferences, autoWebCheckin: e.target.checked })}
                      />
                    </label>
                  </div>

                  <div className="SkyRoute-profile-form-actions">
                    <button
                      type="submit"
                      className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--md"
                      disabled={isSavingPrefs}
                    >
                      {isSavingPrefs ? 'Saving Preferences...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================
               SECTION 4: SAVED PAYMENT METHODS
               ============================================================ */}
            {activeTab === 'payment' && (
              <div className="SkyRoute-profile-content-card SkyRoute-card">
                <div className="SkyRoute-profile-content-header">
                  <div>
                    <h2 className="SkyRoute-profile-section-title">Saved Payment Methods</h2>
                    <p className="SkyRoute-profile-section-desc">
                      Manage stored credit cards, debit cards, and UPI identifiers for rapid 1-click checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--primary SkyRoute-btn--sm"
                    onClick={() => setShowCardModal(true)}
                  >
                    + Add Payment Method
                  </button>
                </div>

                <div className="SkyRoute-saved-cards-visual-grid">
                  {paymentCards.length === 0 ? (
                    <div className="SkyRoute-empty-state" style={{ padding: '2rem' }}>
                      <p>No saved payment cards. Click "+ Add Payment Method" to add one.</p>
                    </div>
                  ) : (
                    paymentCards.map((card) => (
                      <div key={card.id} className="SkyRoute-realistic-card" style={{ background: card.color }}>
                        <div className="SkyRoute-realistic-card__top">
                          <span className="SkyRoute-card-bank-name">{card.brand}</span>
                          <span className="SkyRoute-card-network-badge">{card.network}</span>
                        </div>

                        <div className="SkyRoute-realistic-card__chip"></div>

                        <div className="SkyRoute-realistic-card__number">
                          •••• •••• •••• {card.lastFour}
                        </div>

                        <div className="SkyRoute-realistic-card__bottom">
                          <div>
                            <span className="SkyRoute-card-sub-label">CARDHOLDER</span>
                            <strong className="SkyRoute-card-val">{card.holder}</strong>
                          </div>
                          <div>
                            <span className="SkyRoute-card-sub-label">EXPIRES</span>
                            <strong className="SkyRoute-card-val">{card.expiry}</strong>
                          </div>
                        </div>

                        <div className="SkyRoute-realistic-card__footer-actions">
                          {card.isDefault ? (
                            <span className="SkyRoute-badge SkyRoute-badge--success">DEFAULT METHOD</span>
                          ) : (
                            <button
                              type="button"
                              className="SkyRoute-btn SkyRoute-btn--outline SkyRoute-btn--xs"
                              style={{ color: '#F5F1EA', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }}
                              onClick={() => handleSetDefaultCard(card.id)}
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            type="button"
                            className="SkyRoute-card-remove-btn"
                            onClick={() => handleDeleteCard(card.id)}
                            title="Remove Card"
                          >
                            &times; Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Add/Edit Co-Traveller */}
        {showTravellerModal && (
          <div className="SkyRoute-modal-overlay" onClick={() => setShowTravellerModal(false)}>
            <div className="SkyRoute-modal" onClick={(e) => e.stopPropagation()}>
              <div className="SkyRoute-modal__header">
                <h3 className="SkyRoute-modal__title">
                  {editingTraveller ? 'Edit Co-Traveller' : 'Add New Co-Traveller'}
                </h3>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={() => setShowTravellerModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveTraveller}>
                <div className="SkyRoute-modal__body">
                  <div className="SkyRoute-form-grid">
                    <div className="SkyRoute-form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="SkyRoute-field-label">Full Name *</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        placeholder="e.g. Rahul Sharma"
                        value={travellerForm.name}
                        onChange={(e) => setTravellerForm({ ...travellerForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Relationship</label>
                      <select
                        className="SkyRoute-select-input"
                        value={travellerForm.relation}
                        onChange={(e) => setTravellerForm({ ...travellerForm, relation: e.target.value })}
                      >
                        <option value="Family">Family</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Spouse">Spouse</option>
                      </select>
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Gender</label>
                      <select
                        className="SkyRoute-select-input"
                        value={travellerForm.gender}
                        onChange={(e) => setTravellerForm({ ...travellerForm, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Date of Birth</label>
                      <input
                        type="date"
                        className="SkyRoute-text-input"
                        value={travellerForm.dob}
                        onChange={(e) => setTravellerForm({ ...travellerForm, dob: e.target.value })}
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Passport / ID Number</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        placeholder="Optional"
                        value={travellerForm.passport}
                        onChange={(e) => setTravellerForm({ ...travellerForm, passport: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="SkyRoute-modal__footer">
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--outline"
                    onClick={() => setShowTravellerModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary">
                    Save Co-Traveller
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Payment Card */}
        {showCardModal && (
          <div className="SkyRoute-modal-overlay" onClick={() => setShowCardModal(false)}>
            <div className="SkyRoute-modal" onClick={(e) => e.stopPropagation()}>
              <div className="SkyRoute-modal__header">
                <h3 className="SkyRoute-modal__title">Add Payment Method</h3>
                <button
                  type="button"
                  className="SkyRoute-modal__close"
                  onClick={() => setShowCardModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveNewCard}>
                <div className="SkyRoute-modal__body">
                  <div className="SkyRoute-form-grid">
                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Bank / Provider</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        placeholder="e.g. HDFC Bank, SBI"
                        value={cardForm.brand}
                        onChange={(e) => setCardForm({ ...cardForm, brand: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Network</label>
                      <select
                        className="SkyRoute-select-input"
                        value={cardForm.network}
                        onChange={(e) => setCardForm({ ...cardForm, network: e.target.value })}
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="RuPay">RuPay</option>
                        <option value="Amex">American Express</option>
                      </select>
                    </div>

                    <div className="SkyRoute-form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="SkyRoute-field-label">Card Number *</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        placeholder="•••• •••• •••• ••••"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        placeholder="12/28"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                        required
                      />
                    </div>

                    <div className="SkyRoute-form-group">
                      <label className="SkyRoute-field-label">Cardholder Name</label>
                      <input
                        type="text"
                        className="SkyRoute-text-input"
                        value={cardForm.holder}
                        onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="SkyRoute-modal__footer">
                  <button
                    type="button"
                    className="SkyRoute-btn SkyRoute-btn--outline"
                    onClick={() => setShowCardModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="SkyRoute-btn SkyRoute-btn--primary">
                    Save Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
