const { getDb, ObjectId } = require('../db');

async function findByEmail(email) {
  const db = await getDb();
  return db.collection('users').findOne({ email: String(email).toLowerCase() });
}

async function findById(id) {
  const db = await getDb();
  try { return await db.collection('users').findOne({ _id: new ObjectId(id) }); } catch { return null; }
}

async function countUsers() {
  const db = await getDb();
  return db.collection('users').countDocuments();
}

async function createUser({ name, email, passwordHash, role = 'user' }) {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection('users').insertOne({ name: String(name).slice(0,100), email: String(email).toLowerCase().slice(0,254), passwordHash, role, createdAt: now });
  return { _id: result.insertedId, name, email, role, createdAt: now };
}

module.exports = { findByEmail, findById, createUser, countUsers };
