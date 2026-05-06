import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';
import { Field, Input, Textarea, ActionBtn } from './AdminUI';

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml`;

export default function SEOManager() {
  const [form, setForm] = useState({
    siteTitle: '',
    siteDescription: '',
    keywords: '',
    ogImage: '',
    twitterHandle: '',
    googleAnalyticsId: '',
    canonicalUrl: '',
    robotsTxt: DEFAULT_ROBOTS,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    apiFetch('/seo').then(data => {
      setForm(f => ({ ...f, ...data }));
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      await apiFetch('/seo', { method: 'PUT', body: JSON.stringify(form) });
      setSuccess('SEO settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">SEO Management</h2>
        <ActionBtn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</ActionBtn>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4 font-medium">{success}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Meta */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-4">Basic Meta Tags</h3>
          <div className="flex flex-col gap-4">
            <Field label="Site Title">
              <Input value={form.siteTitle} onChange={e => set('siteTitle', e.target.value)} placeholder="Ajinorah - Study Abroad Experts" />
              <p className="text-xs text-muted mt-1">Appears in browser tab and search results. Recommended: 50–60 chars.</p>
            </Field>
            <Field label="Meta Description">
              <Textarea rows={3} value={form.siteDescription} onChange={e => set('siteDescription', e.target.value)} placeholder="We help students achieve their dream of studying abroad..." />
              <p className="text-xs text-muted mt-1">Recommended: 150–160 characters. Currently: {form.siteDescription.length}</p>
            </Field>
            <Field label="Keywords (comma-separated)">
              <Input value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="study abroad, university admission, visa assistance" />
            </Field>
            <Field label="Canonical URL">
              <Input value={form.canonicalUrl} onChange={e => set('canonicalUrl', e.target.value)} placeholder="https://www.yourdomain.com" />
            </Field>
          </div>
        </div>

        {/* Social & OG */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-4">Social / Open Graph</h3>
          <div className="flex flex-col gap-4">
            <Field label="OG Image URL">
              <Input value={form.ogImage} onChange={e => set('ogImage', e.target.value)} placeholder="https://yourdomain.com/og-image.jpg" />
              <p className="text-xs text-muted mt-1">Recommended size: 1200×630px. Shown when shared on social media.</p>
            </Field>
            {form.ogImage && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={form.ogImage} alt="OG Preview" className="w-full h-32 object-cover" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <Field label="Twitter Handle">
              <Input value={form.twitterHandle} onChange={e => set('twitterHandle', e.target.value)} placeholder="@ajinorah" />
            </Field>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-4">Analytics</h3>
          <div className="flex flex-col gap-4">
            <Field label="Google Analytics ID">
              <Input value={form.googleAnalyticsId} onChange={e => set('googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X" />
              <p className="text-xs text-muted mt-1">Your GA4 Measurement ID.</p>
            </Field>
          </div>
        </div>

        {/* Robots.txt */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-4">Robots.txt Content</h3>
          <Textarea rows={6} value={form.robotsTxt} onChange={e => set('robotsTxt', e.target.value)} className="font-mono text-xs" />
          <p className="text-xs text-muted mt-2">Manually deploy this content to <code>/robots.txt</code> on your server.</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <ActionBtn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save All SEO Settings'}</ActionBtn>
      </div>
    </div>
  );
}
