const express = require('express');
const { getDb, ObjectId } = require('../db');

const router = express.Router();

function toId(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

// Public content endpoints (read-only)
router.get('/blogs', async (_req, res) => {
  try {
    const db = await getDb();
    const blogs = await db.collection('blogs').find().sort({ published: -1, createdAt: -1 }).toArray();
    res.json(blogs.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/blogs/:slug', async (req, res) => {
  try {
    const db = await getDb();
    const slug = req.params.slug;
    let blog = await db.collection('blogs').findOne({ slug });
    if (!blog) {
      try { blog = await db.collection('blogs').findOne({ _id: new ObjectId(slug) }); } catch {}
    }
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.json(toId(blog));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/courses', async (_req, res) => {
  try {
    const db = await getDb();
    const courses = await db.collection('courses').find().sort({ createdAt: -1 }).toArray();
    res.json(courses.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const db = await getDb();
    const course = await db.collection('courses').findOne({ _id: new ObjectId(req.params.id) });
    if (!course) return res.status(404).json({ error: 'Not found' });
    res.json(toId(course));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/faqs', async (_req, res) => {
  try {
    const db = await getDb();
    const faqs = await db.collection('faqs').find().sort({ order: 1 }).toArray();
    res.json(faqs.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/testimonials', async (_req, res) => {
  try {
    const db = await getDb();
    const testimonials = await db.collection('testimonials').find({ published: true }).sort({ createdAt: -1 }).toArray();
    res.json(testimonials.map(toId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/seo', async (_req, res) => {
  try {
    const db = await getDb();
    const seo = await db.collection('seo').findOne({});
    res.json(seo ? toId(seo) : {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
