import React, { useEffect, useState, useRef } from 'react';

export default function PublicTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d.filter(t => t.published) : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  // Add provided external video testimonials as fallback/additional items
  const externalVideos = [
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/1.mp4',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/2.mp4',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/3.mp4',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/4.mp4',
  ].map((v, i) => ({ id: `ext-${i+1}`, video: v, name: ``, published: true }));

  const displayed = [...items, ...externalVideos];

  const [modalItem, setModalItem] = useState(null);
  const modalRef = useRef(null);

  const openVideo = (item, e) => {
    e?.preventDefault();
    setModalItem(item);
  };

  const closeModal = () => setModalItem(null);

  useEffect(() => {
    const onKey = (ev) => { if (ev.key === 'Escape') closeModal(); };
    if (modalItem) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalItem]);

  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    let interval = null;
    const step = () => {
      if (!el) return;
      const item = el.querySelector('.testimonial-item');
      const delta = (item ? item.offsetWidth : 300) + 16;
      el.scrollBy({ left: delta, behavior: 'smooth' });
      // loop back
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      }
    };
    if (!isPaused) interval = setInterval(step, 4500);
    return () => clearInterval(interval);
  }, [isPaused, displayed.length]);

  const scrollBy = (dir = 1) => {
    const el = containerRef.current;
    if (!el) return;
    const item = el.querySelector('.testimonial-item');
    const delta = ((item ? item.offsetWidth : 300) + 16) * dir;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id="testimonials" className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">What Students Say?</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => { setIsPaused(true); scrollBy(-1); }} className="btn-secondary">◀</button>
          <button onClick={() => { setIsPaused(true); scrollBy(1); }} className="btn-secondary">▶</button>
        </div>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : (
        <div
          ref={containerRef}
          className="testimonials-scroller"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="testimonials-track">
            {[...displayed, ...displayed].map(t => (
              <div key={t.id + Math.random()} className="testimonial-item flex-shrink-0 w-[calc(100vw-2rem)] md:w-[320px]">
                <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                  {t.video && (
                    <button onClick={(e) => openVideo(t, e)} className="w-full rounded-xl mb-4 block overflow-hidden">
                      <video src={t.video} className="w-full rounded-xl max-h-80 object-cover bg-black" muted playsInline />
                    </button>
                  )}
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
                      <span key={i} className={`text-yellow-500 ${i < t.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalItem && (
        <div ref={modalRef} className={`media-modal fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4`} onClick={closeModal} role="dialog" aria-modal="true">
          <div className="media-content max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <video controls autoPlay className="max-w-full max-h-full">
              <source src={modalItem.video} type="video/mp4" />
            </video>
          </div>
          <button onClick={closeModal} className="media-close absolute top-6 right-6 text-white bg-black/30 rounded-full p-2">✕</button>
        </div>
      )}
    </section>
  );
}
