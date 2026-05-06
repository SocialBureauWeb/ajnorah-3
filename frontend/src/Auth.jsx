import React, { useState } from "react";

export default function Auth({ open = true, onClose = () => {} }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const saveAuth = (data) => {
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("authChange"));
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setLoading(true); setError("");
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : { name: form.name, email: form.email, password: form.password };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      saveAuth(data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[94%] max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{mode === "login" ? "Login" : "Register"}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="text-sm text-primary underline">{mode === "login" ? "Create account" : "Have an account?"}</button>
            <button onClick={onClose} className="text-sm text-muted">Close</button>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="px-3 py-2 border rounded-lg" required />
          )}
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="px-3 py-2 border rounded-lg" required />
          <div className="relative">
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type={showPassword ? "text" : "password"} className="px-3 py-2 border rounded-lg w-full" required />
            <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted">
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.1-2.31 2.78-4.16 4.78-5.39"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button type="submit" disabled={loading} className="mt-2 bg-primary text-white py-2 rounded-lg font-semibold">{loading ? "Please wait..." : (mode === "login" ? "Login" : "Register")}</button>
        </form>
      </div>
    </div>
  );
}
