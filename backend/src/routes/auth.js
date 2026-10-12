const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { signToken, requireAuth } = require('../auth');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(8).max(100),
});
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

module.exports = function authRoutes({ db, jwtSecret, bcryptRounds }) {
  const router = express.Router();

  router.post('/register', async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors });
      const { name, email, password } = parsed.data;

      const existing = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const hash = await bcrypt.hash(password, bcryptRounds);
      const insertResult = await db.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hash]
      );
      const user = insertResult.rows[0];
      res.status(201).json({ user: publicUser(user), token: signToken(user, jwtSecret) });
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
      const { email, password } = parsed.data;

      const userRes = await db.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
      const user = userRes.rows[0];

      // Same message for unknown email and wrong password, so accounts cannot be probed
      const ok = user && (await bcrypt.compare(password, user.password_hash));
      if (!ok) return res.status(401).json({ error: 'Incorrect email or password' });
      res.json({ user: publicUser(user), token: signToken(user, jwtSecret) });
    } catch (err) {
      next(err);
    }
  });

  router.get('/me', requireAuth(jwtSecret), async (req, res, next) => {
    try {
      const userRes = await db.query('SELECT id, name, email FROM users WHERE id = $1', [req.user.id]);
      const user = userRes.rows[0];
      if (!user) return res.status(401).json({ error: 'Account no longer exists' });
      res.json({ user: publicUser(user) });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
