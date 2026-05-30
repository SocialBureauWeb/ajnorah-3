import { api } from '../api';

// Shared hook for admin API calls
export function getToken() {
  return localStorage.getItem('auth_token') || '';
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  try {
    const method = (options.method || 'get').toLowerCase();
    // If body is FormData, let axios handle headers
    const data = options.body instanceof FormData ? options.body : options.body || undefined;
    const res = await api.request({
      url: `/api/admin${path}`,
      method,
      data,
      headers,
      params: options.params,
    });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Request failed';
    throw new Error(message);
  }
}
