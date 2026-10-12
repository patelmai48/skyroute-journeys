require('dotenv').config();
const { createDb } = require('./db');
const { createApp } = require('./app');

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;

// Security check: Refuse to start without strong JWT_SECRET
if (!jwtSecret || jwtSecret.length < 16) {
  console.error('[FATAL] JWT_SECRET is missing or too short (use at least 16 characters). Set it in your environment or .env.');
  process.exit(1);
}

// Security check: Refuse to start without DATABASE_URL in production
if (isProduction && !databaseUrl) {
  console.error('[FATAL] DATABASE_URL is required in production. Please set your PostgreSQL connection string in the environment.');
  process.exit(1);
}

async function startServer() {
  const db = createDb({ connectionString: databaseUrl });

  try {
    // Run idempotent database migrations
    await db.init();
    console.log('[SkyRoute DB] PostgreSQL schema verified and ready.');
  } catch (err) {
    console.error('[SkyRoute DB] Migration failed:', err.message);
    process.exit(1);
  }

  const app = createApp({
    db,
    jwtSecret,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`SkyRoute API listening on port ${port} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL] Server failed to start:', err.message);
  process.exit(1);
});
