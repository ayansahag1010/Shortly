import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.token);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="card card-glass" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 0.75rem', width: '48px', height: '48px', fontSize: '1.25rem' }}>
            <i className="fas fa-lock"></i>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Log in to access your shortened links and analytics</p>
        </div>

        {error && (
          <div className="safety-banner mb-md" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}>
            <i className="fas fa-exclamation-circle" style={{ color: 'var(--danger)' }}></i>
            <span style={{ fontSize: '0.88rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-md">
            <label className="input-label" htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <input
                type="email"
                id="login-email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="fas fa-envelope input-icon-left"></i>
            </div>
          </div>

          <div className="input-group mb-lg">
            <label className="input-label" htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="login-password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="fas fa-key input-icon-left"></i>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="login-submit">
            <span className="btn-content">
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
              ) : (
                <><i className="fas fa-arrow-right-to-bracket"></i> Sign In</>
              )}
            </span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-3)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand-teal)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
