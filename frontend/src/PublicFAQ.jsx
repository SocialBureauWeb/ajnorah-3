import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function PublicFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(d => setFaqs(Array.isArray(d) ? d : [])).catch(() => setFaqs([])).finally(() => setLoading(false));
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
    <section id="faqs" className="container mx-auto px-4 md:px-8 py-12 overflow-hidden">
      {loading ? <p className="text-muted">Loading...</p> : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="initial"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -50px 0px" }}
          variants={staggerContainer}
        >
          {faqs.map(f => (
            <motion.details 
              key={f.id} 
              className="bg-white border border-border rounded-2xl p-4"
              variants={fadeInUp}
            >
              <summary className="font-medium cursor-pointer">{f.question}</summary>
              <div className="mt-2 text-sm text-muted">{f.answer}</div>
            </motion.details>
          ))}
        </motion.div>
      )}
    </section>
  );
}
