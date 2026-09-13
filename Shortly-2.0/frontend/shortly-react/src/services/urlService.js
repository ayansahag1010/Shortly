const API_BASE = 'http://localhost:8080/api';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function createShortUrl(data, token) {
  const res = await fetch(`${API_BASE}/urls`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to shorten URL' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function getAllUrls(token) {
  const res = await fetch(`${API_BASE}/urls`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch URLs');
  return res.json();
}

export async function getUrlById(id, token) {
  const res = await fetch(`${API_BASE}/urls/${id}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('URL not found');
  return res.json();
}

export async function deleteUrl(id, token) {
  const res = await fetch(`${API_BASE}/urls/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete URL');
}

export async function getStats(token) {
  const res = await fetch(`${API_BASE}/urls/stats`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
