import React, { useEffect, useState, useRef } from 'react';
import { API_BASE_URL } from './api';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function PublicTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d.filter(t => t.published) : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const externalVideos = [
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/1.mp4',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/2.mp4',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/3.mp4',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Student%20Testimonials/4.mp4',
  ].map((v, i) => ({
    id: `ext-${i + 1}`,
    video: v,
    name: `Student ${i + 1}`,
    role: 'Satisfied Student',
    company: 'Ajinorah',
    content: 'Amazing experience with Ajinorah Maharashtra! They helped me every step of the way.',
    rating: 5,
    published: true
  }));

  const displayed = [...items, ...externalVideos];

  const [modalItem, setModalItem] = useState(null);
  const openVideo = (item, e) => { e?.preventDefault(); setModalItem(item); };
  const closeModal = () => setModalItem(null);

  useEffect(() => {
    const onKey = (ev) => { if (ev.key === 'Escape') closeModal(); };
    if (modalItem) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalItem]);

  // Auto-scroll logic with native swiping support
  const [activeScroll, setActiveScroll] = useState(true);
  
  useEffect(() => {
    let animationId;
    const scroll = () => {
      if (activeScroll && !isPaused && scrollerRef.current) {
        const el = scrollerRef.current;
        el.scrollLeft += 0.8; // Adjust speed here
        
        // Loop back when we reach halfway (since we doubled the items)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [activeScroll, isPaused]);

  // Manual next/prev
  const manualScrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = 320 + 16;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    
    // Pause auto-scroll briefly after manual interaction
    setActiveScroll(false);
    setTimeout(() => setActiveScroll(true), 5000);
  };

  return (
    <section id="testimonials" className="py-10 px-0 md:px-16 overflow-hidden">
      <div className="container mx-auto px-8 md:px-0">
        <motion.div
          className="flex flex-row items-center justify-between mb-6 md:mb-8"
          initial="initial"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-[24px] sm:text-[28px] md:text-5xl font-extrabold text-dark text-left whitespace-nowrap mb-0">What Students Say?</h2>
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={() => manualScrollBy(-1)} className="btn-secondary">◀</button>
            <button onClick={() => manualScrollBy(1)} className="btn-secondary">▶</button>
          </div>
        </motion.div>
      </div>

      {loading ? <p className="text-muted text-center">Loading...</p> : (
        <div
          ref={scrollerRef}
          className="testimonials-scroller-native"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
        >
          <div ref={trackRef} className="testimonials-track-native">
            {/* Render twice for seamless infinite loop */}
            {[...displayed, ...displayed].map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="testimonial-item w-[calc(100vw-64px)] sm:w-[320px] md:w-[340px]"
              >
                <div className="bg-white border border-border rounded-2xl p-4 shadow-sm h-full mx-2">
                  {t.video && (
                    <button
                      onClick={(e) => openVideo(t, e)}
                      className="w-full rounded-xl mb-4 block overflow-hidden relative group"
                    >
                      <video
                        src={t.video}
                        className="w-full rounded-xl max-h-64 object-cover bg-black"
                        muted
                        playsInline
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B47DC"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                      </div>
                    </button>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    {t.avatar
                      ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{t.name?.[0]}</div>
                    }
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted">{t.role}{t.company ? ` • ${t.company}` : ''}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted">{t.content}</p>
                  <div className="flex items-center mt-3 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < t.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalItem && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <video controls autoPlay className="max-w-full max-h-[90vh] rounded-xl">
              <source src={modalItem.video} type="video/mp4" />
            </video>
          </div>
          <button onClick={closeModal} className="absolute top-6 right-6 text-white bg-black/40 rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-black/60 transition-colors">✕</button>
        </div>
      )}
    </section>
  );
}
