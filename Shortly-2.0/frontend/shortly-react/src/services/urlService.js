const API_BASE = 'http://localhost:8080/api';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Client-side fallback storage for standalone demo mode
function getLocalDemoUrls() {
  try {
    return JSON.parse(localStorage.getItem('shortly_demo_urls') || '[]');
  } catch {
    return [];
  }
}

function saveLocalDemoUrls(urls) {
  localStorage.setItem('shortly_demo_urls', JSON.stringify(urls));
}

function generateDemoCode() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createShortUrl(data, token) {
  try {
    const res = await fetch(`${API_BASE}/urls`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to shorten URL' }));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      // Standalone / GitHub Pages Demo Mode Fallback
      const urls = getLocalDemoUrls();
      const shortCode = data.customAlias && data.customAlias.trim() ? data.customAlias.trim() : generateDemoCode();
      
      if (urls.some(u => u.shortCode === shortCode)) {
        throw new Error(`Custom alias '${shortCode}' is already taken.`);
      }

      let expiresAt = null;
      if (data.expiresIn === 'ONE_DAY') expiresAt = new Date(Date.now() + 86400000).toISOString();
      else if (data.expiresIn === 'SEVEN_DAYS') expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      else if (data.expiresIn === 'THIRTY_DAYS') expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

      const newUrl = {
        id: Date.now(),
        originalUrl: data.originalUrl,
        shortCode: shortCode,
        shortUrl: `${window.location.origin}${window.location.pathname}#/${shortCode}`,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt,
        clickCount: 0,
      };

      urls.unshift(newUrl);
      saveLocalDemoUrls(urls);
      return newUrl;
    }
    throw error;
  }
}

export async function getAllUrls(token) {
  try {
    const res = await fetch(`${API_BASE}/urls`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch URLs');
    return await res.json();
  } catch {
    return getLocalDemoUrls();
  }
}

export async function getUrlById(id, token) {
  try {
    const res = await fetch(`${API_BASE}/urls/${id}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('URL not found');
    return await res.json();
  } catch {
    const urls = getLocalDemoUrls();
    const item = urls.find(u => u.id === Number(id));
    if (!item) throw new Error('URL not found');
    return item;
  }
}

export async function deleteUrl(id, token) {
  try {
    const res = await fetch(`${API_BASE}/urls/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete URL');
  } catch {
    const urls = getLocalDemoUrls().filter(u => u.id !== Number(id));
    saveLocalDemoUrls(urls);
  }
}

export async function getStats(token) {
  try {
    const res = await fetch(`${API_BASE}/urls/stats`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch {
    const urls = getLocalDemoUrls();
    const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);
    const mostUsed = urls.length > 0 ? urls.reduce((max, u) => (u.clickCount > (max?.clickCount || 0) ? u : max), urls[0]) : null;
    return {
      totalLinks: urls.length,
      totalClicks: totalClicks,
      mostUsedLink: mostUsed,
      recentLinks: urls.slice(0, 5),
    };
  }
}

