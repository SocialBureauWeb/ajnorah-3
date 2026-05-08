import React, { useEffect, useState } from 'react';

export default function PublicCourses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  return (
    <section id="courses" className="container mx-auto px-4 md:px-8 py-12 mb-5">
      <h2 className="text-2xl font-bold mb-4">Our Courses</h2>
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(c => (
            <div key={c.id} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
              <img src={c.coverImage} alt={c.title} className='' style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-muted mb-2 line-clamp-3">{c.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">{c.level} • {c.duration || '—'}</span>
                <span className="text-sm font-semibold">{c.price || 'Free'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
