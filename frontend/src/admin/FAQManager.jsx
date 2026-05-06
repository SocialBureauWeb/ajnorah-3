import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';
import Modal, { Field, Input, Textarea, ActionBtn } from './AdminUI';

const EMPTY = { question: '', answer: '', category: 'General', order: '' };

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => apiFetch('/faqs').then(f => setFaqs(f.sort((a, b) => (a.order || 0) - (b.order || 0)))).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ ...EMPTY, order: faqs.length + 1 }); setModal('add'); setError(''); };
  const openEdit = f => { setForm({ ...f }); setModal(f); setError(''); };
  const closeModal = () => setModal(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.question || !form.answer) { setError('Question and answer are required.'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'add') {
        await apiFetch('/faqs', { method: 'POST', body: JSON.stringify(form) });
      } else {
        await apiFetch(`/faqs/${modal.id}`, { method: 'PUT', body: JSON.stringify(form) });
      }
      await load(); closeModal();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try { await apiFetch(`/faqs/${id}`, { method: 'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">FAQ Management</h2>
        <ActionBtn onClick={openAdd}>+ New FAQ</ActionBtn>
      </div>
      {error && !modal && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="flex flex-col gap-3">
          {faqs.length === 0 && <p className="text-muted text-sm">No FAQs yet.</p>}
          {faqs.map(f => (
            <div key={f.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{f.category}</span>
                    <span className="text-xs text-muted">#{f.order}</span>
                  </div>
                  <p className="font-semibold text-dark">{f.question}</p>
                  <p className="text-sm text-muted mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <ActionBtn variant="ghost" onClick={() => openEdit(f)}>Edit</ActionBtn>
                  <ActionBtn variant="danger" onClick={() => remove(f.id)}>Delete</ActionBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New FAQ' : 'Edit FAQ'} onClose={closeModal}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col gap-4">
            <Field label="Question *">
              <Input value={form.question} onChange={e => set('question', e.target.value)} placeholder="What is...?" />
            </Field>
            <Field label="Answer *">
              <Textarea rows={5} value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="The answer..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Input value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Visa, General" />
              </Field>
              <Field label="Display Order">
                <Input type="number" value={form.order} onChange={e => set('order', e.target.value)} placeholder="1" />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <ActionBtn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save FAQ'}</ActionBtn>
              <ActionBtn variant="ghost" onClick={closeModal}>Cancel</ActionBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
