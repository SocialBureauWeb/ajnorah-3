import React, { useEffect, useState } from 'react';

export default function PublicTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d.filter(t => t.published) : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  return (
    <section id="testimonials" className="container mx-auto px-4 md:px-8 py-12">
      <h2 className="text-2xl font-bold mb-4">What Students Say</h2>
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(t => (
            <div key={t.id} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                {t.avatar ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{t.name?.[0]}</div>}
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted">{t.role} {t.company ? `• ${t.company}` : ''}</div>
                </div>
              </div>
              <p className="text-sm text-muted">{t.content}</p>
              <div className="flex items-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-yellow-500 ${i < t.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
