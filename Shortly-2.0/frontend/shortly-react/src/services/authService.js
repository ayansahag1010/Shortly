const API_BASE = 'http://localhost:8080/api/auth';

export async function registerUser(data) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      // Demo mode fallback token
      const mockToken = 'demo-jwt-token-' + btoa(data.email);
      const user = { id: 1, name: data.name, email: data.email, token: mockToken };
      localStorage.setItem('shortly_demo_user', JSON.stringify(user));
      return { token: mockToken, type: 'Bearer', id: 1, name: data.name, email: data.email };
    }
    throw error;
  }
}

export async function loginUser(data) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      const mockToken = 'demo-jwt-token-' + btoa(data.email);
      const user = { id: 1, name: data.email.split('@')[0] || 'Demo User', email: data.email, token: mockToken };
      localStorage.setItem('shortly_demo_user', JSON.stringify(user));
      return { token: mockToken, type: 'Bearer', id: 1, name: user.name, email: data.email };
    }
    throw error;
  }
}

