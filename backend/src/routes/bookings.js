const express = require('express');
const crypto = require('crypto');
const { z } = require('zod');
const { requireAuth } = require('../auth');

const passengerSchema = z.object({
  title: z.string().trim().max(10).optional(),
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(120).optional(),
  phone: z.string().trim().max(20).optional(),
  dateOfBirth: z.string().trim().max(20).optional(),
});

const bookingSchema = z.object({
  flight: z.record(z.any()).refine((f) => Object.keys(f).length > 0, 'flight is required'),
  passengers: z.array(passengerSchema).min(1).max(9),
  seat: z.union([z.string().trim().max(10), z.record(z.any())]).optional(),
  insurance: z.string().optional(),
  coupon: z.string().optional(),
  totalAmount: z.number().optional(), // Client may send it, but server recomputes
  currency: z.string().trim().length(3).default('INR'),
});

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid mix-ups
function makePnr() {
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

async function calculateServerPrice({ flight, passengers, seat, insurance, coupon, db, userId }) {
  const paxCount = Math.max(1, Array.isArray(passengers) ? passengers.length : 1);
  const flightPrice = Number(flight?.price) || 3800;
  const baseFare = flightPrice * paxCount;
  const taxes = Math.round(baseFare * 0.12);

  let seatFee = 0;
  if (seat) {
    if (typeof seat === 'object' && seat.price !== undefined) {
      seatFee = Number(seat.price) || 0;
    } else if (typeof seat === 'string' && seat.trim()) {
      seatFee = 450;
    }
  }

  const insuranceFee = (insurance && insurance !== 'none') ? 449 : 0;

  let couponDiscount = 0;
  const code = (coupon || '').trim().toUpperCase();
  if (code === 'SKYDOM500') couponDiscount = 500;
  else if (code === 'FLYINTL2500') couponDiscount = 2500;
  else if (code === 'STUDENTSKY') couponDiscount = Math.round(baseFare * 0.1);

  let repeatDiscount = 0;
  if (db && userId) {
    try {
      const past = await db.query("SELECT COUNT(*) as count FROM bookings WHERE user_id = $1 AND status = 'CONFIRMED'", [userId]);
      if (past && past.rows.length > 0 && Number(past.rows[0].count) > 0) {
        repeatDiscount = 500;
      }
    } catch {
      // ignore
    }
  }

  const total = Math.max(0, baseFare + taxes + seatFee + insuranceFee - couponDiscount - repeatDiscount);

  return {
    baseFare,
    taxes,
    seatFee,
    insuranceFee,
    couponDiscount,
    repeatDiscount,
    total
  };
}

const toBooking = (row) => ({
  pnr: row.pnr,
  status: row.status,
  flight: typeof row.flight_json === 'string' ? JSON.parse(row.flight_json) : row.flight_json,
  passengers: typeof row.passengers_json === 'string' ? JSON.parse(row.passengers_json) : row.passengers_json,
  seat: row.seat ? (typeof row.seat === 'string' && row.seat.startsWith('{') ? JSON.parse(row.seat) : row.seat) : null,
  totalAmount: Number(row.total_amount),
  currency: row.currency,
  createdAt: row.created_at,
  cancelledAt: row.cancelled_at,
});

module.exports = function bookingRoutes({ db, jwtSecret }) {
  const router = express.Router();
  router.use(requireAuth(jwtSecret));

  router.post('/', async (req, res, next) => {
    try {
      const parsed = bookingSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
      const b = parsed.data;

      // Server-side price recomputation (ignores any client-sent total)
      const pricing = await calculateServerPrice({
        flight: b.flight,
        passengers: b.passengers,
        seat: b.seat,
        insurance: b.insurance,
        coupon: b.coupon,
        db,
        userId: req.user.id
      });
      const finalAmount = pricing.total;

      const seatToStore = typeof b.seat === 'object' ? JSON.stringify(b.seat) : (b.seat ?? null);

      for (let i = 0; i < 5; i++) {
        const pnr = makePnr();
        try {
          const insertRes = await db.query(
            `INSERT INTO bookings
             (pnr, user_id, flight_json, passengers_json, seat, total_amount, currency)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [pnr, req.user.id, JSON.stringify(b.flight), JSON.stringify(b.passengers), seatToStore, finalAmount, b.currency]
          );
          const booking = toBooking(insertRes.rows[0]);
          booking.pricingBreakdown = pricing;
          return res.status(201).json({ booking });
        } catch (err) {
          if (!String(err.message).includes('UNIQUE') && !String(err.message).includes('duplicate key')) {
            throw err;
          }
        }
      }
      res.status(500).json({ error: 'Could not generate a booking reference, please retry' });
    } catch (err) {
      next(err);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const result = await db.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
      res.json({ bookings: result.rows.map(toBooking) });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:pnr', async (req, res, next) => {
    try {
      const result = await db.query('SELECT * FROM bookings WHERE pnr = $1 AND user_id = $2', [req.params.pnr.toUpperCase(), req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
      res.json({ booking: toBooking(result.rows[0]) });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:pnr/cancel', async (req, res, next) => {
    try {
      const pnr = req.params.pnr.toUpperCase();
      const result = await db.query('SELECT * FROM bookings WHERE pnr = $1 AND user_id = $2', [pnr, req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
      const row = result.rows[0];
      if (row.status === 'CANCELLED') return res.status(409).json({ error: 'Booking is already cancelled' });

      const updateRes = await db.query(
        "UPDATE bookings SET status = 'CANCELLED', cancelled_at = NOW() WHERE id = $1 RETURNING *",
        [row.id]
      );
      res.json({ booking: toBooking(updateRes.rows[0]) });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
