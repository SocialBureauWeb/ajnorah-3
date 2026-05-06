import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';

const stats = [
  { key: 'leads',        label: 'Total Leads',       sub: 'new',       color: 'bg-blue-50 text-blue-700',   icon: '📥' },
  { key: 'blogs',        label: 'Blog Posts',         sub: 'published', color: 'bg-purple-50 text-purple-700', icon: '📝' },
  { key: 'courses',      label: 'Courses',            sub: 'published', color: 'bg-green-50 text-green-700',  icon: '🎓' },
  { key: 'faqs',         label: 'FAQs',               sub: null,        color: 'bg-yellow-50 text-yellow-700', icon: '❓' },
  { key: 'testimonials', label: 'Testimonials',       sub: 'published', color: 'bg-pink-50 text-pink-700',   icon: '⭐' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/stats').then(setData).catch(e => setError(e.message));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Dashboard Overview</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map(s => {
          const d = data?.[s.key] || {};
          return (
            <div key={s.key} className="bg-white rounded-2xl shadow-sm border border-border p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-dark">{data ? d.total ?? 0 : '—'}</p>
                <p className="text-sm text-muted">{s.label}</p>
                {s.sub && data && (
                  <p className="text-xs text-muted mt-0.5">{d[s.sub] ?? 0} {s.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-dark mb-3">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-muted list-disc list-inside">
          <li>Use the <strong>Blog Manager</strong> to publish articles and update your content.</li>
          <li>Add <strong>Courses</strong> to showcase your offerings.</li>
          <li>Review <strong>Leads</strong> regularly and update their status.</li>
          <li>Keep your <strong>SEO settings</strong> up to date for better search visibility.</li>
        </ul>
      </div>
    </div>
  );
}
