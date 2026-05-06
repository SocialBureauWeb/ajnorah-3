const express = require('express');
const fs = require('fs');
const path = require('path');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// ── Helper ────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readFile(name) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]), 'utf8');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function readSingle(name) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}), 'utf8');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}

function writeFile(name, data) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2), 'utf8');
}

function nextId(arr) {
  return arr.length > 0 ? Math.max(...arr.map(i => i.id || 0)) + 1 : 1;
}

// ── All admin routes require admin JWT ───────────────────
router.use(adminAuth);

// ════════════════════════════════════════════════════════
// BLOGS
// ════════════════════════════════════════════════════════
router.get('/blogs', (_req, res) => res.json(readFile('blogs')));

router.post('/blogs', (req, res) => {
  const { title, slug, excerpt, content, coverImage, tags, published } = req.body || {};
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });
  const blogs = readFile('blogs');
  const blog = {
    id: nextId(blogs),
    title: String(title).slice(0, 200),
    slug: (slug || String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).slice(0, 200),
    excerpt: String(excerpt || '').slice(0, 500),
    content: String(content).slice(0, 50000),
    coverImage: String(coverImage || '').slice(0, 500),
    tags: Array.isArray(tags) ? tags.slice(0, 10).map(t => String(t).slice(0, 50)) : [],
    published: Boolean(published),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  blogs.push(blog);
  writeFile('blogs', blogs);
  res.status(201).json(blog);
});

router.put('/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const blogs = readFile('blogs');
  const idx = blogs.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });
  const { title, slug, excerpt, content, coverImage, tags, published } = req.body || {};
  blogs[idx] = {
    ...blogs[idx],
    ...(title !== undefined && { title: String(title).slice(0, 200) }),
    ...(slug !== undefined && { slug: String(slug).slice(0, 200) }),
    ...(excerpt !== undefined && { excerpt: String(excerpt).slice(0, 500) }),
    ...(content !== undefined && { content: String(content).slice(0, 50000) }),
    ...(coverImage !== undefined && { coverImage: String(coverImage).slice(0, 500) }),
    ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.slice(0, 10).map(t => String(t).slice(0, 50)) : [] }),
    ...(published !== undefined && { published: Boolean(published) }),
    updatedAt: new Date().toISOString(),
  };
  writeFile('blogs', blogs);
  res.json(blogs[idx]);
});

router.delete('/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const blogs = readFile('blogs');
  const filtered = blogs.filter(b => b.id !== id);
  if (filtered.length === blogs.length) return res.status(404).json({ error: 'Blog not found' });
  writeFile('blogs', filtered);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════
// COURSES
// ════════════════════════════════════════════════════════
router.get('/courses', (_req, res) => res.json(readFile('courses')));

router.post('/courses', (req, res) => {
  const { title, description, duration, level, price, coverImage, published } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required.' });
  const courses = readFile('courses');
  const course = {
    id: nextId(courses),
    title: String(title).slice(0, 200),
    description: String(description).slice(0, 5000),
    duration: String(duration || '').slice(0, 100),
    level: String(level || 'Beginner').slice(0, 50),
    price: String(price || '').slice(0, 50),
    coverImage: String(coverImage || '').slice(0, 500),
    published: Boolean(published),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  courses.push(course);
  writeFile('courses', courses);
  res.status(201).json(course);
});

router.put('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const courses = readFile('courses');
  const idx = courses.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  const { title, description, duration, level, price, coverImage, published } = req.body || {};
  courses[idx] = {
    ...courses[idx],
    ...(title !== undefined && { title: String(title).slice(0, 200) }),
    ...(description !== undefined && { description: String(description).slice(0, 5000) }),
    ...(duration !== undefined && { duration: String(duration).slice(0, 100) }),
    ...(level !== undefined && { level: String(level).slice(0, 50) }),
    ...(price !== undefined && { price: String(price).slice(0, 50) }),
    ...(coverImage !== undefined && { coverImage: String(coverImage).slice(0, 500) }),
    ...(published !== undefined && { published: Boolean(published) }),
    updatedAt: new Date().toISOString(),
  };
  writeFile('courses', courses);
  res.json(courses[idx]);
});

router.delete('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const courses = readFile('courses');
  const filtered = courses.filter(c => c.id !== id);
  if (filtered.length === courses.length) return res.status(404).json({ error: 'Course not found' });
  writeFile('courses', filtered);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════
// LEADS
// ════════════════════════════════════════════════════════
const LEADS_FILE = path.join(__dirname, '..', 'leads.json');

function readLeads() {
  try { return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { return []; }
}
function writeLeads(leads) { fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8'); }

router.get('/leads', (_req, res) => res.json(readLeads()));

router.patch('/leads/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body || {};
  const allowed = ['new', 'contacted', 'qualified', 'closed'];
  if (!allowed.includes(status)) return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  leads[idx].status = status;
  leads[idx].updatedAt = new Date().toISOString();
  writeLeads(leads);
  res.json(leads[idx]);
});

router.delete('/leads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const leads = readLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return res.status(404).json({ error: 'Lead not found' });
  writeLeads(filtered);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════
// FAQS
// ════════════════════════════════════════════════════════
router.get('/faqs', (_req, res) => res.json(readFile('faqs')));

router.post('/faqs', (req, res) => {
  const { question, answer, category, order } = req.body || {};
  if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required.' });
  const faqs = readFile('faqs');
  const faq = {
    id: nextId(faqs),
    question: String(question).slice(0, 500),
    answer: String(answer).slice(0, 5000),
    category: String(category || 'General').slice(0, 100),
    order: parseInt(order) || faqs.length + 1,
    createdAt: new Date().toISOString(),
  };
  faqs.push(faq);
  writeFile('faqs', faqs);
  res.status(201).json(faq);
});

router.put('/faqs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const faqs = readFile('faqs');
  const idx = faqs.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ error: 'FAQ not found' });
  const { question, answer, category, order } = req.body || {};
  faqs[idx] = {
    ...faqs[idx],
    ...(question !== undefined && { question: String(question).slice(0, 500) }),
    ...(answer !== undefined && { answer: String(answer).slice(0, 5000) }),
    ...(category !== undefined && { category: String(category).slice(0, 100) }),
    ...(order !== undefined && { order: parseInt(order) || faqs[idx].order }),
    updatedAt: new Date().toISOString(),
  };
  writeFile('faqs', faqs);
  res.json(faqs[idx]);
});

router.delete('/faqs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const faqs = readFile('faqs');
  const filtered = faqs.filter(f => f.id !== id);
  if (filtered.length === faqs.length) return res.status(404).json({ error: 'FAQ not found' });
  writeFile('faqs', filtered);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════
// TESTIMONIALS
// ════════════════════════════════════════════════════════
router.get('/testimonials', (_req, res) => res.json(readFile('testimonials')));

router.post('/testimonials', (req, res) => {
  const { name, role, company, content, rating, avatar, published } = req.body || {};
  if (!name || !content) return res.status(400).json({ error: 'Name and content are required.' });
  const testimonials = readFile('testimonials');
  const t = {
    id: nextId(testimonials),
    name: String(name).slice(0, 100),
    role: String(role || '').slice(0, 100),
    company: String(company || '').slice(0, 100),
    content: String(content).slice(0, 2000),
    rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
    avatar: String(avatar || '').slice(0, 500),
    published: Boolean(published),
    createdAt: new Date().toISOString(),
  };
  testimonials.push(t);
  writeFile('testimonials', testimonials);
  res.status(201).json(t);
});

router.put('/testimonials/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const testimonials = readFile('testimonials');
  const idx = testimonials.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });
  const { name, role, company, content, rating, avatar, published } = req.body || {};
  testimonials[idx] = {
    ...testimonials[idx],
    ...(name !== undefined && { name: String(name).slice(0, 100) }),
    ...(role !== undefined && { role: String(role).slice(0, 100) }),
    ...(company !== undefined && { company: String(company).slice(0, 100) }),
    ...(content !== undefined && { content: String(content).slice(0, 2000) }),
    ...(rating !== undefined && { rating: Math.min(5, Math.max(1, parseInt(rating) || 5)) }),
    ...(avatar !== undefined && { avatar: String(avatar).slice(0, 500) }),
    ...(published !== undefined && { published: Boolean(published) }),
    updatedAt: new Date().toISOString(),
  };
  writeFile('testimonials', testimonials);
  res.json(testimonials[idx]);
});

router.delete('/testimonials/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const testimonials = readFile('testimonials');
  const filtered = testimonials.filter(t => t.id !== id);
  if (filtered.length === testimonials.length) return res.status(404).json({ error: 'Testimonial not found' });
  writeFile('testimonials', filtered);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════
// SEO SETTINGS
// ════════════════════════════════════════════════════════
router.get('/seo', (_req, res) => res.json(readSingle('seo')));

router.put('/seo', (req, res) => {
  const { siteTitle, siteDescription, keywords, ogImage, twitterHandle, googleAnalyticsId, canonicalUrl, robotsTxt } = req.body || {};
  const current = readSingle('seo');
  const seo = {
    ...current,
    ...(siteTitle !== undefined && { siteTitle: String(siteTitle).slice(0, 200) }),
    ...(siteDescription !== undefined && { siteDescription: String(siteDescription).slice(0, 500) }),
    ...(keywords !== undefined && { keywords: String(keywords).slice(0, 500) }),
    ...(ogImage !== undefined && { ogImage: String(ogImage).slice(0, 500) }),
    ...(twitterHandle !== undefined && { twitterHandle: String(twitterHandle).slice(0, 50) }),
    ...(googleAnalyticsId !== undefined && { googleAnalyticsId: String(googleAnalyticsId).slice(0, 50) }),
    ...(canonicalUrl !== undefined && { canonicalUrl: String(canonicalUrl).slice(0, 300) }),
    ...(robotsTxt !== undefined && { robotsTxt: String(robotsTxt).slice(0, 2000) }),
    updatedAt: new Date().toISOString(),
  };
  writeFile('seo', seo);
  res.json(seo);
});

// ════════════════════════════════════════════════════════
// DASHBOARD STATS
// ════════════════════════════════════════════════════════
router.get('/stats', (_req, res) => {
  const leads = readLeads();
  const blogs = readFile('blogs');
  const courses = readFile('courses');
  const faqs = readFile('faqs');
  const testimonials = readFile('testimonials');
  res.json({
    leads: { total: leads.length, new: leads.filter(l => !l.status || l.status === 'new').length },
    blogs: { total: blogs.length, published: blogs.filter(b => b.published).length },
    courses: { total: courses.length, published: courses.filter(c => c.published).length },
    faqs: { total: faqs.length },
    testimonials: { total: testimonials.length, published: testimonials.filter(t => t.published).length },
  });
});

module.exports = router;
