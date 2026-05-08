import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';
import Modal, { Field, Input, Textarea, Toggle, ActionBtn, StatusBadge } from './AdminUI';

const EMPTY = { name: '', role: '', company: '', content: '', rating: 5, avatar: '', video: '', published: true };

export default function TestimonialManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => apiFetch('/testimonials').then(setItems).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); setError(''); };
  const openEdit = t => { setForm({ ...t }); setModal(t); setError(''); };
  const closeModal = () => setModal(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.content) { setError('Name and content are required.'); return; }
    setSaving(true); setError('');
    try {
      if (form.avatarFile || form.videoFile) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('role', form.role || '');
        fd.append('company', form.company || '');
        fd.append('content', form.content || '');
        fd.append('rating', String(form.rating || 5));
        fd.append('published', form.published ? 'true' : '');
        if (form.avatar) fd.append('avatar', form.avatar);
        if (form.video) fd.append('video', form.video);
        if (form.avatarFile) fd.append('avatar', form.avatarFile);
        if (form.videoFile) fd.append('video', form.videoFile);
        if (modal === 'add') await apiFetch('/testimonials', { method: 'POST', body: fd });
        else await apiFetch(`/testimonials/${modal.id}`, { method: 'PUT', body: fd });
      } else {
        if (modal === 'add') {
          await apiFetch('/testimonials', { method: 'POST', body: JSON.stringify(form) });
        } else {
          await apiFetch(`/testimonials/${modal.id}`, { method: 'PUT', body: JSON.stringify(form) });
        }
      }
      await load(); closeModal();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await apiFetch(`/testimonials/${id}`, { method: 'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  };

  const Stars = ({ n }) => (
    <span className="text-yellow-400 text-sm">{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Testimonial Management</h2>
        <ActionBtn onClick={openAdd}>+ New Testimonial</ActionBtn>
      </div>
      {error && !modal && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.length === 0 && <p className="text-muted text-sm">No testimonials yet.</p>}
          {items.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{t.name[0]}</div>
                  }
                  <div>
                    <p className="font-semibold text-dark text-sm">{t.name}</p>
                    <p className="text-xs text-muted">{[t.role, t.company].filter(Boolean).join(', ') || '—'}</p>
                  </div>
                </div>
                <StatusBadge status={t.published ? 'published' : 'draft'} />
              </div>
              <Stars n={t.rating || 5} />
              <p className="text-sm text-muted mt-2 line-clamp-3">{t.content}</p>
              {t.video && (
                <video
                  src={t.video}
                  controls
                  className="mt-3 w-full rounded-xl max-h-40 object-cover bg-black"
                />
              )}
              <div className="flex gap-2 mt-3">
                <ActionBtn variant="ghost" onClick={() => openEdit(t)}>Edit</ActionBtn>
                <ActionBtn variant="danger" onClick={() => remove(t.id)}>Delete</ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New Testimonial' : 'Edit Testimonial'} onClose={closeModal}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col gap-4">
            <Field label="Name *">
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Student name" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role / Title">
                <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Student" />
              </Field>
              <Field label="Company / University">
                <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. MIT" />
              </Field>
            </div>
            <Field label="Testimonial *">
              <Textarea rows={4} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Their experience..." />
            </Field>
            <Field label="Rating (1–5)">
              <div className="flex items-center gap-3">
                <input type="range" min={1} max={5} value={form.rating} onChange={e => set('rating', parseInt(e.target.value))} className="flex-1" />
                <span className="text-yellow-400 font-bold w-6 text-center">{form.rating}</span>
              </div>
            </Field>
            <Field label="Avatar URL (optional)">
              <Input value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Avatar File">
              <input type="file" accept="image/*" onChange={e => set('avatarFile', e.target.files && e.target.files[0])} />
            </Field>
            <Field label="Video URL (optional)">
              <Input value={form.video} onChange={e => set('video', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Video File (mp4, webm…)">
              <input type="file" accept="video/*" onChange={e => set('videoFile', e.target.files && e.target.files[0])} />
              {form.videoFile && (
                <video src={URL.createObjectURL(form.videoFile)} controls className="mt-2 w-full rounded-xl max-h-40 bg-black" />
              )}
              {!form.videoFile && form.video && (
                <video src={form.video} controls className="mt-2 w-full rounded-xl max-h-40 bg-black" />
              )}
            </Field>
            <Toggle label="Publish" checked={form.published} onChange={v => set('published', v)} />
            <div className="flex gap-3 pt-2">
              <ActionBtn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Testimonial'}</ActionBtn>
              <ActionBtn variant="ghost" onClick={closeModal}>Cancel</ActionBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
