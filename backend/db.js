const { MongoClient, ObjectId } = require('mongodb');
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.warn('MONGO_URL not set — MongoDB auth will be disabled. Set MONGO_URL in .env');
}

let clientPromise = null;

async function getClient() {
  if (!MONGO_URL) throw new Error('MONGO_URL not configured');
  if (!clientPromise) {
    const client = new MongoClient(MONGO_URL, { connectTimeoutMS: 10000, maxPoolSize: 10 });
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  const dbName = client.s.options.dbName || (new URL(MONGO_URL).pathname || '').replace('/', '') || 'test';
  return client.db(dbName);
}

module.exports = { getClient, getDb, ObjectId };
