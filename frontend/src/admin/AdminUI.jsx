import React, { useState } from 'react';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg text-dark">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-dark text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

export function Input({ ...props }) {
  return (
    <input
      {...props}
      className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

export function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      rows={props.rows || 4}
      className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
    />
  );
}

export function Select({ options, ...props }) {
  return (
    <select
      {...props}
      className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
      <span className="text-sm text-muted">{label}</span>
    </label>
  );
}

export function StatusBadge({ status }) {
  const map = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
    published: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function ActionBtn({ onClick, variant = 'primary', children, disabled }) {
  const styles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'border border-border text-muted hover:text-dark',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
