const { Pool } = require('pg');

async function initSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      pnr VARCHAR(10) NOT NULL UNIQUE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
      flight_json TEXT NOT NULL,
      passengers_json TEXT NOT NULL,
      seat TEXT,
      total_amount INTEGER NOT NULL,
      currency VARCHAR(5) NOT NULL DEFAULT 'INR',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      cancelled_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
  `);
}

function createDb({ connectionString = process.env.DATABASE_URL, isTest = false } = {}) {
  let pool;

  // In testing, or when running locally in development without a live PostgreSQL instance
  if (isTest || (!connectionString && process.env.NODE_ENV !== 'production')) {
    const { newDb } = require('pg-mem');
    const mem = newDb();
    const pgAdapter = mem.adapters.createPg();
    pool = new pgAdapter.Pool();
  } else {
    const isProduction = process.env.NODE_ENV === 'production';
    pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    });
  }

  // Attach idempotent schema initializer
  pool.init = async () => {
    await initSchema(pool);
    return pool;
  };

  return pool;
}

module.exports = {
  createDb,
  initSchema
};
