import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerUser } from '../services/authService';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ name: name.trim(), email: email.trim(), password });
      login(data.token);
      showToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="card card-glass" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 0.75rem', width: '48px', height: '48px', fontSize: '1.25rem' }}>
            <i className="fas fa-user-plus"></i>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create an Account</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Join Shortly to track clicks, save link history, and create custom aliases</p>
        </div>

        {error && (
          <div className="safety-banner mb-md" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}>
            <i className="fas fa-exclamation-circle" style={{ color: 'var(--danger)' }}></i>
            <span style={{ fontSize: '0.88rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-md">
            <label className="input-label" htmlFor="reg-name">Full Name</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="reg-name"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <i className="fas fa-user input-icon-left"></i>
            </div>
          </div>

          <div className="input-group mb-md">
            <label className="input-label" htmlFor="reg-email">Email Address</label>
            <div className="input-with-icon">
              <input
                type="email"
                id="reg-email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="fas fa-envelope input-icon-left"></i>
            </div>
          </div>

          <div className="input-group mb-md">
            <label className="input-label" htmlFor="reg-password">Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="reg-password"
                className="input-field"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="fas fa-key input-icon-left"></i>
            </div>
          </div>

          <div className="input-group mb-lg">
            <label className="input-label" htmlFor="reg-confirm">Confirm Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="reg-confirm"
                className="input-field"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i className="fas fa-check-double input-icon-left"></i>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="register-submit">
            <span className="btn-content">
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
              ) : (
                <><i className="fas fa-user-plus"></i> Sign Up</>
              )}
            </span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-3)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand-teal)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
