import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function PublicCourses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      } 
    }
  };

  return (
    <section id="courses" className="container mx-auto px-4 md:px-8 py-12 mb-5 overflow-hidden">
      {loading ? <p className="text-muted">Loading...</p> : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="initial"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -50px 0px" }}
          variants={staggerContainer}
        >
          {items.map(c => (
            <motion.div 
              key={c.id} 
              className="bg-white border border-border rounded-2xl p-4 shadow-sm"
              variants={fadeInUp}
            >
              <img src={c.coverImage} alt={c.title} className='' style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-muted mb-2 line-clamp-3">{c.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">{c.level} • {c.duration || '—'}</span>
                <span className="text-sm font-semibold">{c.price || 'Free'}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
