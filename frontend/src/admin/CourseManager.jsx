import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';
import Modal, { Field, Input, Textarea, Select, Toggle, ActionBtn, StatusBadge } from './AdminUI';

const LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];
const EMPTY = { title: '', description: '', duration: '', level: 'Beginner', price: '', coverImage: '', published: false };

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => apiFetch('/courses').then(setCourses).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); setError(''); };
  const openEdit = c => { setForm({ ...c }); setModal(c); setError(''); };
  const closeModal = () => setModal(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.description) { setError('Title and description are required.'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'add') {
        await apiFetch('/courses', { method: 'POST', body: JSON.stringify(form) });
      } else {
        await apiFetch(`/courses/${modal.id}`, { method: 'PUT', body: JSON.stringify(form) });
      }
      await load(); closeModal();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await apiFetch(`/courses/${id}`, { method: 'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Course Management</h2>
        <ActionBtn onClick={openAdd}>+ New Course</ActionBtn>
      </div>
      {error && !modal && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr>
                {['Title', 'Level', 'Duration', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No courses yet.</td></tr>
              )}
              {courses.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-bg-soft/50">
                  <td className="px-4 py-3 font-medium text-dark max-w-[200px] truncate">{c.title}</td>
                  <td className="px-4 py-3 text-muted">{c.level}</td>
                  <td className="px-4 py-3 text-muted">{c.duration || '—'}</td>
                  <td className="px-4 py-3 text-muted">{c.price || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.published ? 'published' : 'draft'} /></td>
                  <td className="px-4 py-3 flex gap-2">
                    <ActionBtn variant="ghost" onClick={() => openEdit(c)}>Edit</ActionBtn>
                    <ActionBtn variant="danger" onClick={() => remove(c.id)}>Delete</ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New Course' : 'Edit Course'} onClose={closeModal}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col gap-4">
            <Field label="Title *">
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Course title" />
            </Field>
            <Field label="Description *">
              <Textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Course description..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration">
                <Input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 6 months" />
              </Field>
              <Field label="Level">
                <Select options={LEVELS} value={form.level} onChange={e => set('level', e.target.value)} />
              </Field>
            </div>
            <Field label="Price">
              <Input value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. ₹25,000 or Free" />
            </Field>
            <Field label="Cover Image URL">
              <Input value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
            </Field>
            <Toggle label="Published" checked={form.published} onChange={v => set('published', v)} />
            <div className="flex gap-3 pt-2">
              <ActionBtn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Course'}</ActionBtn>
              <ActionBtn variant="ghost" onClick={closeModal}>Cancel</ActionBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
