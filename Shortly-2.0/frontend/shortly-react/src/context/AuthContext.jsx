import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shortly-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const userData = parseToken(token);
      if (userData) {
        setUser(userData);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const parseToken = (jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) return null;
      return { name: payload.name, email: payload.sub };
    } catch {
      return null;
    }
  };

  const login = (jwt) => {
    localStorage.setItem('shortly-token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('shortly-token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
