import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';
import Modal, { Field, Input, Textarea, Toggle, ActionBtn, StatusBadge } from './AdminUI';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', published: false };

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | {blog}
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => apiFetch('/blogs').then(setBlogs).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); setError(''); };
  const openEdit = b => { setForm({ ...b, tags: Array.isArray(b.tags) ? b.tags.join(', ') : '' }); setModal(b); setError(''); };
  const closeModal = () => setModal(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.content) { setError('Title and content are required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (modal === 'add') {
        await apiFetch('/blogs', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/blogs/${modal.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      await load();
      closeModal();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try { await apiFetch(`/blogs/${id}`, { method: 'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Blog Management</h2>
        <ActionBtn onClick={openAdd}>+ New Post</ActionBtn>
      </div>
      {error && !modal && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr>
                {['Title', 'Slug', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No blog posts yet.</td></tr>
              )}
              {blogs.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-bg-soft/50">
                  <td className="px-4 py-3 font-medium text-dark max-w-[200px] truncate">{b.title}</td>
                  <td className="px-4 py-3 text-muted max-w-[150px] truncate">{b.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.published ? 'published' : 'draft'} /></td>
                  <td className="px-4 py-3 text-muted">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <ActionBtn variant="ghost" onClick={() => openEdit(b)}>Edit</ActionBtn>
                    <ActionBtn variant="danger" onClick={() => remove(b.id)}>Delete</ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New Blog Post' : 'Edit Blog Post'} onClose={closeModal}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col gap-4">
            <Field label="Title *">
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title" />
            </Field>
            <Field label="Slug">
              <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated-from-title" />
            </Field>
            <Field label="Excerpt">
              <Textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short summary..." />
            </Field>
            <Field label="Content *">
              <Textarea rows={8} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Full blog content..." />
            </Field>
            <Field label="Cover Image URL">
              <Input value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Tags (comma-separated)">
              <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="study abroad, visa, tips" />
            </Field>
            <Toggle label="Published" checked={form.published} onChange={v => set('published', v)} />
            <div className="flex gap-3 pt-2">
              <ActionBtn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Post'}</ActionBtn>
              <ActionBtn variant="ghost" onClick={closeModal}>Cancel</ActionBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
