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
  seat: z.string().trim().max(5).optional(),
  totalAmount: z.number().int().positive().max(100000000),
  currency: z.string().trim().length(3).default('INR'),
});

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid mix-ups
function makePnr() {
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

const toBooking = (row) => ({
  pnr: row.pnr,
  status: row.status,
  flight: JSON.parse(row.flight_json),
  passengers: JSON.parse(row.passengers_json),
  seat: row.seat,
  totalAmount: row.total_amount,
  currency: row.currency,
  createdAt: row.created_at,
  cancelledAt: row.cancelled_at,
});

module.exports = function bookingRoutes({ db, jwtSecret }) {
  const router = express.Router();
  router.use(requireAuth(jwtSecret));

  router.post('/', (req, res) => {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    const b = parsed.data;

    const insert = db.prepare(`INSERT INTO bookings
      (pnr, user_id, flight_json, passengers_json, seat, total_amount, currency)
      VALUES (?, ?, ?, ?, ?, ?, ?)`);
    let pnr;
    for (let i = 0; i < 5; i++) {
      pnr = makePnr();
      try {
        insert.run(pnr, req.user.id, JSON.stringify(b.flight), JSON.stringify(b.passengers), b.seat ?? null, b.totalAmount, b.currency);
        const row = db.prepare('SELECT * FROM bookings WHERE pnr = ?').get(pnr);
        return res.status(201).json({ booking: toBooking(row) });
      } catch (err) {
        if (!String(err.message).includes('UNIQUE')) throw err; // retry only on PNR collision
      }
    }
    res.status(500).json({ error: 'Could not generate a booking reference, please retry' });
  });

  router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
    res.json({ bookings: rows.map(toBooking) });
  });

  router.get('/:pnr', (req, res) => {
    const row = db.prepare('SELECT * FROM bookings WHERE pnr = ? AND user_id = ?').get(req.params.pnr.toUpperCase(), req.user.id);
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking: toBooking(row) });
  });

  router.post('/:pnr/cancel', (req, res) => {
    const pnr = req.params.pnr.toUpperCase();
    const row = db.prepare('SELECT * FROM bookings WHERE pnr = ? AND user_id = ?').get(pnr, req.user.id);
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    if (row.status === 'CANCELLED') return res.status(409).json({ error: 'Booking is already cancelled' });
    db.prepare("UPDATE bookings SET status = 'CANCELLED', cancelled_at = datetime('now') WHERE id = ?").run(row.id);
    res.json({ booking: toBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(row.id)) });
  });

  return router;
};
