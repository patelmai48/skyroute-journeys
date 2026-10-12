require('dotenv').config();
const { createDb } = require('./db');
const { createApp } = require('./app');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 16) {
  console.error('JWT_SECRET is missing or too short (use at least 16 random characters). Copy .env.example to .env.');
  process.exit(1);
}

const app = createApp({
  db: createDb(),
  jwtSecret,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`SkyRoute API listening on http://localhost:${port}`));
