const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser, findById, countUsers } = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' });

  const existing = await findByEmail(email);
  if (existing) return res.status(400).json({ error: 'Email already registered.' });

  const hash = await bcrypt.hash(password, 10);
  // make first user admin
  const total = await countUsers();
  const role = total === 0 ? 'admin' : 'user';
  const user = await createUser({ name, email, passwordHash: hash, role });
  const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const user = await findByEmail(email);
  if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(400).json({ error: 'Invalid email or password.' });

  const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

async function me(req, res) {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    const user = await findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { register, login, me };
