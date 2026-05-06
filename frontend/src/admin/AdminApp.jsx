import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import BlogManager from './BlogManager';
import CourseManager from './CourseManager';
import LeadManager from './LeadManager';
import FAQManager from './FAQManager';
import TestimonialManager from './TestimonialManager';
import SEOManager from './SEOManager';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',     icon: '▦' },
  { id: 'blogs',        label: 'Blog',          icon: '📝' },
  { id: 'courses',      label: 'Courses',       icon: '🎓' },
  { id: 'leads',        label: 'Leads',         icon: '📥' },
  { id: 'faqs',         label: 'FAQs',          icon: '❓' },
  { id: 'testimonials', label: 'Testimonials',  icon: '⭐' },
  { id: 'seo',          label: 'SEO',           icon: '🔍' },
];

const SECTIONS = {
  dashboard:    Dashboard,
  blogs:        BlogManager,
  courses:      CourseManager,
  leads:        LeadManager,
  faqs:         FAQManager,
  testimonials: TestimonialManager,
  seo:          SEOManager,
};

export default function AdminApp({ user, onLogout }) {
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync section with hash fragment like #/admin/blogs
  useEffect(() => {
    const parse = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/admin\/([a-z]+)/);
      if (match && SECTIONS[match[1]]) setSection(match[1]);
    };
    parse();
    window.addEventListener('hashchange', parse);
    return () => window.removeEventListener('hashchange', parse);
  }, []);

  const navigate = (id) => {
    setSection(id);
    window.location.hash = `#/admin/${id}`;
  };

  const Section = SECTIONS[section] || Dashboard;

  return (
    <div className="min-h-screen bg-bg-soft flex font-sans">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? 'w-56' : 'w-16'} shrink-0 bg-white border-r border-border flex flex-col transition-all duration-200`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-dark text-sm leading-tight">Ajinorah</p>
              <p className="text-xs text-muted leading-tight">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              title={!sidebarOpen ? n.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left
                ${section === n.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:bg-bg-soft hover:text-dark'
                }`}
            >
              <span className="text-base shrink-0">{n.icon}</span>
              {sidebarOpen && <span className="truncate">{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="m-2 p-2 rounded-xl text-muted hover:bg-bg-soft text-sm"
          title={sidebarOpen ? 'Collapse' : 'Expand'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-sm font-semibold text-dark capitalize">
            {NAV.find(n => n.id === section)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted hidden sm:block">
              {user?.name || user?.email}
            </span>
            <button
              onClick={() => { if (window.confirm('Log out?')) onLogout(); }}
              className="text-sm text-muted hover:text-dark border border-border rounded-lg px-3 py-1.5"
            >
              Logout
            </button>
            <a
              href="/#"
              className="text-sm text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5"
              onClick={() => { window.location.hash = ''; }}
            >
              ← Site
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Section />
        </main>
      </div>
    </div>
  );
}
