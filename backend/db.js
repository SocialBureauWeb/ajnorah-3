const { MongoClient, ObjectId } = require('mongodb');
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.warn('MONGO_URL not set — MongoDB auth will be disabled. Set MONGO_URL in .env');
}

let client = null;
let clientPromise = null;
let connected = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetries(attempts = 5) {
  if (!MONGO_URL) throw Object.assign(new Error('MONGO_URL not configured'), { status: 500 });

  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const options = { connectTimeoutMS: 20000, serverSelectionTimeoutMS: 5000, maxPoolSize: 10 };
      const c = new MongoClient(MONGO_URL, options);
      await c.connect();
      client = c;
      connected = true;
      return client;
    } catch (err) {
      lastErr = err;
      try { if (client && client.close) await client.close(); } catch (_) {}
      const backoff = (2 ** i) * 500; // exponential backoff: 500ms, 1s, 2s...
      await delay(backoff);
    }
  }
  const e = Object.assign(new Error('Could not connect to MongoDB: ' + (lastErr && lastErr.message)), { status: 503 });
  throw e;
}

function startConnecting() {
  if (!MONGO_URL) return null;
  if (!clientPromise) clientPromise = connectWithRetries();
  return clientPromise;
}

async function getClient() {
  if (!MONGO_URL) throw Object.assign(new Error('MONGO_URL not configured'), { status: 500 });
  if (!clientPromise) startConnecting();
  return clientPromise;
}

async function getDb({ timeoutMs = 5000 } = {}) {
  if (!MONGO_URL) throw Object.assign(new Error('MONGO_URL not configured'), { status: 500 });

  // Wait for client to be ready, but fail fast for request handlers
  const p = getClient();
  const timeout = new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('MongoDB not ready'), { status: 503 })), timeoutMs));
  const c = await Promise.race([p, timeout]);
  const dbName = c.s.options.dbName || (new URL(MONGO_URL).pathname || '').replace('/', '') || 'test';
  return c.db(dbName);
}

function isConnected() { return connected === true; }

module.exports = { startConnecting, getClient, getDb, isConnected, ObjectId };
