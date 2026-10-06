/**
 * SkyRoute Loyalty & SkyPoints Service
 * Handles repeat user tracking, points accrual, and loyalty discounts
 * based on client-side localStorage architecture (Demo Mode).
 */

const STORAGE_KEYS = {
  BOOKINGS: 'skyroute_bookings',
  PROFILE: 'skyroute_profile_info',
  SKYPOINTS: 'skyroute_skypoints',
};

// Base starter balance for demo users if none stored
const DEFAULT_INITIAL_POINTS = 2450;
const REPEAT_DISCOUNT_AMOUNT = 500; // Flat ₹500 repeat traveller reward

/**
 * Get all confirmed bookings from localStorage
 */
export const getStoredBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse skyroute_bookings:', err);
    return [];
  }
};

/**
 * Check if the current user is a repeat traveler
 * A user is recognized as a repeat customer if they have at least 1 booking on record
 */
export const isRepeatCustomer = () => {
  const bookings = getStoredBookings();
  if (bookings.length > 0) return true;

  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.points && parsed.points > 3000) return true;
    }
  } catch (e) {}

  return false;
};

/**
 * Get repeat traveler discount amount in INR
 */
export const getRepeatTravelerDiscount = () => {
  return isRepeatCustomer() ? REPEAT_DISCOUNT_AMOUNT : 0;
};

/**
 * Calculate SkyPoints earned from a booking total
 * Earn rate: 10% of payable amount (1 SkyPoint per ₹10 spent)
 */
export const calculateEarnedPoints = (bookingTotal = 0) => {
  const num = Number(bookingTotal) || 0;
  return Math.max(0, Math.round(num * 0.1));
};

/**
 * Get total accumulated SkyPoints balance
 */
export const getSkyPointsBalance = () => {
  try {
    const direct = localStorage.getItem(STORAGE_KEYS.SKYPOINTS);
    if (direct !== null) {
      const parsed = Number(direct);
      if (!isNaN(parsed)) return parsed;
    }

    // Check profile info
    const profileRaw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (profileRaw) {
      const profile = JSON.parse(profileRaw);
      if (typeof profile.points === 'number') {
        localStorage.setItem(STORAGE_KEYS.SKYPOINTS, String(profile.points));
        return profile.points;
      }
    }

    // Calculate from bookings + default starter points
    const bookings = getStoredBookings();
    const pointsFromBookings = bookings.reduce((sum, b) => sum + (b.pointsEarned || calculateEarnedPoints(b.total || 0)), 0);
    const total = DEFAULT_INITIAL_POINTS + pointsFromBookings;
    localStorage.setItem(STORAGE_KEYS.SKYPOINTS, String(total));
    return total;
  } catch (e) {
    return DEFAULT_INITIAL_POINTS;
  }
};

/**
 * Award points after a successful booking and persist to localStorage
 */
export const awardBookingSkyPoints = (bookingTotal = 0) => {
  const earned = calculateEarnedPoints(bookingTotal);
  const current = getSkyPointsBalance();
  const updated = current + earned;

  try {
    localStorage.setItem(STORAGE_KEYS.SKYPOINTS, String(updated));

    // Also sync to profile info if it exists
    const profileRaw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (profileRaw) {
      const profile = JSON.parse(profileRaw);
      profile.points = updated;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  } catch (err) {
    console.warn('Failed to update SkyPoints in localStorage:', err);
  }

  return { earned, newBalance: updated };
};

/**
 * Determine member tier based on bookings and points
 */
export const getMemberTierInfo = (bookingsCount = 0, points = 0) => {
  if (bookingsCount >= 3 || points >= 10000) {
    return {
      tier: 'SkyRoute Gold Member',
      badgeClass: 'SkyRoute-badge--success',
      perk: '₹500 Repeat Discount • Priority Boarding • 1.2x Points',
      color: '#173F3A'
    };
  }
  if (bookingsCount >= 1 || points >= 3000) {
    return {
      tier: 'SkyRoute Silver Member',
      badgeClass: 'SkyRoute-badge--teal',
      perk: '₹500 Repeat Discount • Free Seat Selection Perk',
      color: '#4F7C73'
    };
  }
  return {
    tier: 'SkyRoute Explorer',
    badgeClass: 'SkyRoute-badge--secondary',
    perk: 'Earn 10% SkyPoints on every flight booking',
    color: '#8FAFA6'
  };
};

/**
 * Get comprehensive loyalty overview object
 */
export const getLoyaltySummary = () => {
  const bookings = getStoredBookings();
  const isRepeat = isRepeatCustomer();
  const points = getSkyPointsBalance();
  const tierInfo = getMemberTierInfo(bookings.length, points);
  const discount = getRepeatTravelerDiscount();

  return {
    isRepeat,
    bookingsCount: bookings.length,
    pointsBalance: points,
    discountAmount: discount,
    tier: tierInfo.tier,
    tierBadgeClass: tierInfo.badgeClass,
    tierPerk: tierInfo.perk,
    tierColor: tierInfo.color,
    earningRateText: '10 SkyPoints per ₹100 spent',
  };
};
