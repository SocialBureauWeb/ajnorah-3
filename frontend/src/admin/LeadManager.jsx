import React, { useEffect, useState } from 'react';
import { apiFetch } from './useAdminApi';
import { ActionBtn, StatusBadge, Select } from './AdminUI';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'closed', label: 'Closed' },
];

export default function LeadManager() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => apiFetch('/leads').then(setLeads).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setLeads(l => l.map(x => x.id === id ? { ...x, status } : x));
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try { await apiFetch(`/leads/${id}`, { method: 'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => (l.status || 'new') === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Lead Management</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">Filter:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-lg text-sm bg-white"
          >
            <option value="all">All ({leads.length})</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label} ({leads.filter(l => (l.status || 'new') === s.value).length})</option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading ? <p className="text-muted">Loading...</p> : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr>
                {['Name', 'Email', 'Destination', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No leads found.</td></tr>
              )}
              {filtered.map(l => (
                <React.Fragment key={l.id}>
                  <tr className="border-b border-border last:border-0 hover:bg-bg-soft/50 cursor-pointer" onClick={() => setExpanded(expanded === l.id ? null : l.id)}>
                    <td className="px-4 py-3 font-medium text-dark">{l.name}</td>
                    <td className="px-4 py-3 text-muted">{l.email}</td>
                    <td className="px-4 py-3 text-muted">{l.destination || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={l.status || 'new'}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(l.id, e.target.value)}
                        className="px-2 py-1 border border-border rounded-lg text-xs bg-white"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted">{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <ActionBtn variant="danger" onClick={() => remove(l.id)}>Delete</ActionBtn>
                    </td>
                  </tr>
                  {expanded === l.id && (
                    <tr className="bg-blue-50/40">
                      <td colSpan={6} className="px-6 py-4">
                        <p className="text-sm font-medium text-dark mb-1">Message:</p>
                        <p className="text-sm text-muted whitespace-pre-wrap">{l.message || '(no message)'}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
