const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/cloudflare');
const { getDb, ObjectId } = require('../db');

const router = express.Router();

function toId(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

// ── All admin routes require admin JWT ───────────────────
router.use(adminAuth);

// ════════════════════════════════════════════════════════
// BLOGS
// ════════════════════════════════════════════════════════
router.get('/blogs', async (_req, res) => {
  try {
    const db = await getDb();
    const blogs = await db.collection('blogs').find().sort({ createdAt: -1 }).toArray();
    res.json(blogs.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/blogs', upload.single('coverImage'), async (req, res) => {
  const { title, slug, excerpt, content, tags, published } = req.body || {};
  const coverImage = (req.file && req.file.location) ? req.file.location : String(req.body.coverImage || '').slice(0, 500);
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });
  try {
    const db = await getDb();
    // normalize tags: accept array, comma-separated string, or JSON array string
    let tagsArr = [];
    if (Array.isArray(tags)) tagsArr = tags;
    else if (typeof tags === 'string') {
      try { const parsed = JSON.parse(tags); if (Array.isArray(parsed)) tagsArr = parsed; else tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean); } catch { tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean); }
    }

    const blog = {
      title: String(title).slice(0, 200),
      slug: (slug || String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).slice(0, 200),
      excerpt: String(excerpt || '').slice(0, 500),
      content: String(content).slice(0, 50000),
      coverImage: coverImage,
      tags: Array.isArray(tagsArr) ? tagsArr.slice(0, 10).map(t => String(t).slice(0, 50)) : [],
      published: Boolean(published),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('blogs').insertOne(blog);
    res.status(201).json(toId({ _id: result.insertedId, ...blog }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/blogs/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const db = await getDb();
    const { title, slug, excerpt, content, tags, published } = req.body || {};
    const incomingCover = (req.file && req.file.location) ? req.file.location : (req.body.coverImage);
    // normalize tags for update
    let tagsArr = undefined;
    if (tags !== undefined) {
      if (Array.isArray(tags)) tagsArr = tags;
      else if (typeof tags === 'string') {
        try { const parsed = JSON.parse(tags); tagsArr = Array.isArray(parsed) ? parsed : tags.split(',').map(t => t.trim()).filter(Boolean); } catch { tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean); }
      }
    }
    const update = {
      ...(title !== undefined && { title: String(title).slice(0, 200) }),
      ...(slug !== undefined && { slug: String(slug).slice(0, 200) }),
      ...(excerpt !== undefined && { excerpt: String(excerpt).slice(0, 500) }),
      ...(content !== undefined && { content: String(content).slice(0, 50000) }),
      ...(incomingCover !== undefined && { coverImage: String(incomingCover).slice(0, 500) }),
      ...(tagsArr !== undefined && { tags: Array.isArray(tagsArr) ? tagsArr.slice(0, 10).map(t => String(t).slice(0, 50)) : [] }),
      ...(published !== undefined && { published: Boolean(published) }),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('blogs').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    res.json(toId(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════
// COURSES
// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
// COURSES
// ════════════════════════════════════════════════════════
router.get('/courses', async (_req, res) => {
  try {
    const db = await getDb();
    const courses = await db.collection('courses').find().sort({ createdAt: -1 }).toArray();
    res.json(courses.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/courses', upload.single('coverImage'), async (req, res) => {
  const { title, description, duration, level, price, published } = req.body || {};
  const coverImage = (req.file && req.file.location) ? req.file.location : String(req.body.coverImage || '').slice(0, 500);
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required.' });
  try {
    const db = await getDb();
    const course = {
      title: String(title).slice(0, 200),
      description: String(description).slice(0, 5000),
      duration: String(duration || '').slice(0, 100),
      level: String(level || 'Beginner').slice(0, 50),
      price: String(price || '').slice(0, 50),
      coverImage: coverImage,
      published: Boolean(published),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('courses').insertOne(course);
    res.status(201).json(toId({ _id: result.insertedId, ...course }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/courses/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const db = await getDb();
    const { title, description, duration, level, price, published } = req.body || {};
    const incomingCover = (req.file && req.file.location) ? req.file.location : (req.body.coverImage);
    const update = {
      ...(title !== undefined && { title: String(title).slice(0, 200) }),
      ...(description !== undefined && { description: String(description).slice(0, 5000) }),
      ...(duration !== undefined && { duration: String(duration).slice(0, 100) }),
      ...(level !== undefined && { level: String(level).slice(0, 50) }),
      ...(price !== undefined && { price: String(price).slice(0, 50) }),
      ...(incomingCover !== undefined && { coverImage: String(incomingCover).slice(0, 500) }),
      ...(published !== undefined && { published: Boolean(published) }),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('courses').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Course not found' });
    res.json(toId(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('courses').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════
// LEADS
// ════════════════════════════════════════════════════════
router.get('/leads', async (_req, res) => {
  try {
    const db = await getDb();
    const leads = await db.collection('leads').find().sort({ createdAt: -1 }).toArray();
    res.json(leads.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/leads/:id/status', async (req, res) => {
  const { status } = req.body || {};
  const allowed = ['new', 'contacted', 'qualified', 'closed'];
  if (!allowed.includes(status)) return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  try {
    const db = await getDb();
    const result = await db.collection('leads').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Lead not found' });
    res.json(toId(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('leads').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════
// FAQS
// ════════════════════════════════════════════════════════
router.get('/faqs', async (_req, res) => {
  try {
    const db = await getDb();
    const faqs = await db.collection('faqs').find().sort({ order: 1 }).toArray();
    res.json(faqs.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/faqs', async (req, res) => {
  const { question, answer, category, order } = req.body || {};
  if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required.' });
  try {
    const db = await getDb();
    const count = await db.collection('faqs').countDocuments();
    const faq = {
      question: String(question).slice(0, 500),
      answer: String(answer).slice(0, 5000),
      category: String(category || 'General').slice(0, 100),
      order: parseInt(order) || count + 1,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('faqs').insertOne(faq);
    res.status(201).json(toId({ _id: result.insertedId, ...faq }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/faqs/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { question, answer, category, order } = req.body || {};
    const update = {
      ...(question !== undefined && { question: String(question).slice(0, 500) }),
      ...(answer !== undefined && { answer: String(answer).slice(0, 5000) }),
      ...(category !== undefined && { category: String(category).slice(0, 100) }),
      ...(order !== undefined && { order: parseInt(order) || 0 }),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('faqs').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'FAQ not found' });
    res.json(toId(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/faqs/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('faqs').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════
// TESTIMONIALS
// ════════════════════════════════════════════════════════
router.get('/testimonials', async (_req, res) => {
  try {
    const db = await getDb();
    const testimonials = await db.collection('testimonials').find().sort({ createdAt: -1 }).toArray();
    res.json(testimonials.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/testimonials', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { name, role, company, content, rating, published } = req.body || {};
  const files = req.files || {};
  const avatar = (files.avatar && files.avatar[0] && files.avatar[0].location) ? files.avatar[0].location : String(req.body.avatar || '').slice(0, 500);
  const video = (files.video && files.video[0] && files.video[0].location) ? files.video[0].location : String(req.body.video || '').slice(0, 500);
  if (!name || !content) return res.status(400).json({ error: 'Name and content are required.' });
  try {
    const db = await getDb();
    const t = {
      name: String(name).slice(0, 100),
      role: String(role || '').slice(0, 100),
      company: String(company || '').slice(0, 100),
      content: String(content).slice(0, 2000),
      rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
      avatar: avatar,
      video: video,
      published: Boolean(published),
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('testimonials').insertOne(t);
    res.status(201).json(toId({ _id: result.insertedId, ...t }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/testimonials/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const db = await getDb();
    const { name, role, company, content, rating, published } = req.body || {};
    const files = req.files || {};
    const incomingAvatar = (files.avatar && files.avatar[0] && files.avatar[0].location) ? files.avatar[0].location : (req.body.avatar);
    const incomingVideo = (files.video && files.video[0] && files.video[0].location) ? files.video[0].location : (req.body.video);
    const update = {
      ...(name !== undefined && { name: String(name).slice(0, 100) }),
      ...(role !== undefined && { role: String(role).slice(0, 100) }),
      ...(company !== undefined && { company: String(company).slice(0, 100) }),
      ...(content !== undefined && { content: String(content).slice(0, 2000) }),
      ...(rating !== undefined && { rating: Math.min(5, Math.max(1, parseInt(rating) || 5)) }),
      ...(incomingAvatar !== undefined && { avatar: String(incomingAvatar).slice(0, 500) }),
      ...(incomingVideo !== undefined && { video: String(incomingVideo).slice(0, 500) }),
      ...(published !== undefined && { published: Boolean(published) }),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('testimonials').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(toId(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('testimonials').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════
// SEO SETTINGS
// ════════════════════════════════════════════════════════
router.get('/seo', async (_req, res) => {
  try {
    const db = await getDb();
    const seo = await db.collection('seo').findOne({});
    res.json(seo ? toId(seo) : {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/seo', async (req, res) => {
  const { siteTitle, siteDescription, keywords, ogImage, twitterHandle, googleAnalyticsId, canonicalUrl, robotsTxt } = req.body || {};
  try {
    const db = await getDb();
    const update = {
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
    const result = await db.collection('seo').findOneAndUpdate(
      {},
      { $set: update },
      { upsert: true, returnDocument: 'after' }
    );
    res.json(toId(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════
// DASHBOARD STATS
// ════════════════════════════════════════════════════════
router.get('/stats', async (_req, res) => {
  try {
    const db = await getDb();
    const [leads, blogs, courses, faqCount, testimonials] = await Promise.all([
      db.collection('leads').find().toArray(),
      db.collection('blogs').find().toArray(),
      db.collection('courses').find().toArray(),
      db.collection('faqs').countDocuments(),
      db.collection('testimonials').find().toArray(),
    ]);
    res.json({
      leads: { total: leads.length, new: leads.filter(l => !l.status || l.status === 'new').length },
      blogs: { total: blogs.length, published: blogs.filter(b => b.published).length },
      courses: { total: courses.length, published: courses.filter(c => c.published).length },
      faqs: { total: faqCount },
      testimonials: { total: testimonials.length, published: testimonials.filter(t => t.published).length },
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
