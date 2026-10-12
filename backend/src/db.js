const fs = require('fs');
const path = require('path');

let SQLiteDriver;
try {
  SQLiteDriver = require('better-sqlite3');
} catch {
  const { DatabaseSync } = require('node:sqlite');
  SQLiteDriver = DatabaseSync;
}

function createDb(file = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'skyroute.db')) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new SQLiteDriver(file);

  if (typeof db.pragma === 'function') {
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  } else {
    try {
      db.exec('PRAGMA journal_mode = WAL;');
      db.exec('PRAGMA foreign_keys = ON;');
    } catch (e) {
      // Memory DB or non-WAL
    }
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      pnr            TEXT NOT NULL UNIQUE,
      user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status         TEXT NOT NULL DEFAULT 'CONFIRMED',
      flight_json    TEXT NOT NULL,
      passengers_json TEXT NOT NULL,
      seat           TEXT,
      total_amount   INTEGER NOT NULL,
      currency       TEXT NOT NULL DEFAULT 'INR',
      created_at     TEXT NOT NULL DEFAULT (datetime('now')),
      cancelled_at   TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
  `);
  return db;
}

module.exports = { createDb };
