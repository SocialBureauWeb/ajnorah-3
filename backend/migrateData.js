require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/blogModel');
const Course = require('./models/courseModel');
const FAQ = require('./models/faqModel');
const SEO = require('./models/seoModel');
const Testimonial = require('./models/testimonialModel');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const migrateData = async () => {
  try {
    // Blogs
    const blogs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'blogs.json')));
    await Blog.deleteMany({});
    await Blog.insertMany(blogs);
    console.log('Blogs migrated');

    // Courses
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'courses.json')));
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('Courses migrated');

    // FAQs
    const faqs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'faqs.json')));
    await FAQ.deleteMany({});
    await FAQ.insertMany(faqs);
    console.log('FAQs migrated');

    // SEO
    const seoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'seo.json')));
    // seo.json may be an object or array; normalize to array and skip if empty
    const seoArray = Array.isArray(seoRaw) ? seoRaw : (seoRaw && Object.keys(seoRaw).length ? [seoRaw] : []);
    if (seoArray.length) {
      await SEO.deleteMany({});
      await SEO.insertMany(seoArray);
      console.log('SEO data migrated');
    } else {
      console.log('SEO data empty — skipping');
    }

    // Testimonials
    const testimonials = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'testimonials.json')));
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials migrated');

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Data migration error:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(migrateData);