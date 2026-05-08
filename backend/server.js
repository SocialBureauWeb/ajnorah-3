require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://www.ajinorahworldwide.com",
  "https://ajinorahworldwide.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, same-origin in production)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json({ limit: "10kb" }));

const USERS_FILE = path.join(__dirname, "users.json");

// Use MongoDB-backed auth controllers if MONGO_URL is provided
if (process.env.MONGO_URL) {
  const { register, login, me } = require('./controllers/authController');
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/me', me);
} else {
  // fallback: simple file-based auth (kept for compatibility)
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }

  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

  function readUsers() {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { return []; }
  }
  function writeUsers(users) { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8'); }

  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' });
    const users = readUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(400).json({ error: 'Email already registered.' });
    const hash = await bcrypt.hash(password, 10);
    const role = users.length === 0 ? 'admin' : 'user';
    const user = { id: Date.now(), name: String(name).slice(0,100), email: String(email).toLowerCase().slice(0,254), passwordHash: hash, role, createdAt: new Date().toISOString() };
    users.push(user);
    try { writeUsers(users); const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' }); return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }); } catch (err) { console.error(err); return res.status(500).json({ error: 'Could not create user.' }); }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const users = readUsers();
    const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });
    const ok = await bcrypt.compare(password, user.passwordHash || ''); if (!ok) return res.status(400).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get('/api/auth/me', (req, res) => {
    const auth = req.headers.authorization || ''; const parts = auth.split(' '); if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Unauthorized' });
    try { const decoded = jwt.verify(parts[1], JWT_SECRET); const users = readUsers(); const user = users.find(u => u.id === decoded.id); if (!user) return res.status(404).json({ error: 'User not found' }); return res.json({ id: user.id, name: user.name, email: user.email, role: user.role }); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
  });
}

// ── POST /api/contact ─────────────────────────────────────
const { getDb } = require('./db');

app.post("/api/contact", async (req, res) => {
  const { name, email, destination, message } = req.body || {};

  if (
    !name || typeof name !== "string" ||
    !email || typeof email !== "string" ||
    !message || typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const db = await getDb();
    const lead = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 254),
      destination: (destination || "Not specified").slice(0, 100),
      message: message.trim().slice(0, 2000),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    await db.collection("leads").insertOne(lead);
    return res.status(201).json({ success: true, message: "Enquiry received successfully!" });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return res.status(500).json({ error: "Could not save your enquiry. Please try again." });
  }
});

// ── Admin routes ─────────────────────────────────────────
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

// ── Public content routes (read-only)
const publicRouter = require('./routes/public');
app.use('/api', publicRouter);

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start (when run directly) ─────────────────────────────
// If this file is executed directly (e.g. `node server.js`) start
// a listening HTTP server. When imported (serverless platforms)
// the exported `app` can be used without starting a listener.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
}

// Required for Vercel serverless
module.exports = app;