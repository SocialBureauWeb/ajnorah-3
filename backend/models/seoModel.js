const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  page: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SEO', seoSchema);