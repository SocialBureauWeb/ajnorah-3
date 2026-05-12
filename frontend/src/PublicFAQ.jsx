import React, { useEffect, useState } from 'react';

export default function PublicFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(d => setFaqs(Array.isArray(d) ? d : [])).catch(() => setFaqs([])).finally(() => setLoading(false));
  }, []);

  return (
    <section id="faqs" className="container mx-auto px-4 md:px-8 py-12">
      {/* <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2> */}
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map(f => (
            <details key={f.id} className="bg-white border border-border rounded-2xl p-4">
              <summary className="font-medium cursor-pointer">{f.question}</summary>
              <div className="mt-2 text-sm text-muted">{f.answer}</div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
