const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
function readFile(name) {
  try {
    const file = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) { return []; }
}
function readSingle(name) {
  try {
    const file = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) { return {}; }
}

// Public content endpoints (read-only)
router.get('/blogs', (_req, res) => {
  const blogs = readFile('blogs').sort((a,b) => (b.published - a.published) || new Date(b.createdAt) - new Date(a.createdAt));
  res.json(blogs);
});

router.get('/blogs/:slug', (req, res) => {
  const slug = req.params.slug;
  const blog = readFile('blogs').find(b => b.slug === slug || String(b.id) === slug);
  if (!blog) return res.status(404).json({ error: 'Not found' });
  res.json(blog);
});

router.get('/courses', (_req, res) => {
  const courses = readFile('courses').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(courses);
});

router.get('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = readFile('courses').find(c => c.id === id);
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json(course);
});

router.get('/faqs', (_req, res) => res.json(readFile('faqs')));
router.get('/testimonials', (_req, res) => res.json(readFile('testimonials')));
router.get('/seo', (_req, res) => res.json(readSingle('seo')));

// POST /leads endpoint to handle lead submissions
router.post('/leads', (req, res) => {
  const newLead = { ...req.body, id: Date.now(), createdAt: new Date() };
  fs.readFile(path.join(__dirname, '../leads.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read leads file' });
    const leads = JSON.parse(data);
    leads.push(newLead);
    fs.writeFile(path.join(__dirname, '../leads.json'), JSON.stringify(leads, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save lead' });
      res.status(201).json(newLead);
    });
  });
});

module.exports = router;
