import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

export default function PublicBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(d => { setPosts(Array.isArray(d) ? d : []); }).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  return (
    <section id="blogs" className="container mx-auto px-4 md:px-8 py-12">
      <motion.h2 
        initial="initial"
        whileInView="visible"
        variants={fadeInUp}
        className="text-2xl font-bold mb-4"
      >
        Latest Articles
      </motion.h2>
      {loading ? <p className="text-muted">Loading...</p> : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          whileInView="visible"
          variants={staggerContainer}
        >
          {posts.map(p => (
            <motion.article 
              key={p.id} 
              variants={fadeInUp}
              className="bg-white border border-border rounded-2xl p-4 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-lg truncate">{p.title}</h3>
                <p className="text-xs text-muted mt-1">{new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-muted line-clamp-3 mb-3">{p.excerpt}</p>
              <div className="flex items-center justify-between">
                <button onClick={() => setActive(p)} className="text-primary text-sm font-medium">Read</button>
                <span className="text-xs text-muted">{p.tags?.slice(0,2).join(', ')}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {active && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">{active.title}</h3>
            <p className="text-xs text-muted mb-4">{new Date(active.createdAt).toLocaleDateString()}</p>
            <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: active.content }} />
            <div className="mt-4 text-right"><button onClick={() => setActive(null)} className="text-sm text-primary">Close</button></div>
          </div>
        </div>
      )}
    </section>
  );
}
