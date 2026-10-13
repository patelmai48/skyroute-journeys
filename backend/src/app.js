const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const flightRoutes = require('./routes/flights');

function createApp({ db, jwtSecret, corsOrigin = '*', bcryptRounds = 10, rateLimitEnabled = true }) {
  const app = express();

  // Trust first proxy for correct client IP detection behind Render / reverse proxies
  app.set('trust proxy', 1);

  app.disable('x-powered-by');
  app.use(helmet());

  // Strict CORS configuration: supports comma-separated list, trims spaces & trailing slashes
  const originsList = (corsOrigin || '*')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const isWildcard = corsOrigin === '*' || originsList.includes('*');

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || isWildcard) return callback(null, true);
      const normalized = origin.trim().replace(/\/+$/, '');
      if (
        originsList.includes(normalized) ||
        /^https:\/\/skyroute-journeys(?:-[a-z0-9]+)?\.vercel\.app$/.test(normalized)
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  app.use(express.json({ limit: '100kb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'skyroute-backend',
      timestamp: new Date().toISOString(),
    });
  });

  const authLimiter = rateLimitEnabled
    ? rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 30,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many attempts, try again later' },
      })
    : (req, res, next) => next();

  app.use('/api/auth', authLimiter, authRoutes({ db, jwtSecret, bcryptRounds }));
  app.use('/api/bookings', bookingRoutes({ db, jwtSecret }));
  app.use('/api/flights', flightRoutes());

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  // Safe global error handler (never leaks internal stack or secrets)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
      console.error('[SkyRoute API Error]:', err.message);
    }
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
