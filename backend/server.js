require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const LEADS_FILE = path.join(__dirname, "leads.json");

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
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
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "10kb" }));

// ── Ensure leads file exists ───────────────────────────────
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf8");
}

// ── POST /api/contact ─────────────────────────────────────
app.post("/api/contact", (req, res) => {
  const { name, email, destination, message } = req.body;

  if (
    !name || typeof name !== "string" ||
    !email || typeof email !== "string" ||
    !message || typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const lead = {
    id: Date.now(),
    name: name.trim().slice(0, 100),
    email: email.trim().toLowerCase().slice(0, 254),
    destination: (destination || "Not specified").slice(0, 100),
    message: message.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf8"));
    leads.push(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save lead:", err);
    return res.status(500).json({ error: "Could not save your enquiry. Please try again." });
  }

  return res.status(201).json({ success: true, message: "Enquiry received successfully!" });
});

// ── GET /api/leads  (admin – protect in production) ───────
app.get("/api/leads", (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf8"));
    return res.json(leads);
  } catch {
    return res.json([]);
  }
});

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
