import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: 'fa-home' },
    { to: '/history', label: 'History', icon: 'fa-clock-rotate-left' },
    { to: '/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { to: '/about', label: 'About', icon: 'fa-info-circle' },
  ];

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <div className="brand-icon"><i className="fas fa-bolt"></i></div>
            <span className="brand-name">Shortly</span>
          </Link>

          <nav className="nav-links">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            {isAuthenticated ? (
              <button className="btn btn-ghost btn-sm" onClick={logout}>
                <span className="btn-content">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </span>
              </button>
            ) : (
              <NavLink to="/login" className="nav-link nav-link-cta">
                Login
              </NavLink>
            )}

            <button
              className="hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`mobile-nav ${mobileOpen ? 'open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false); }}
      >
        <div className="mobile-nav-panel">
          <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
            <i className="fas fa-xmark"></i>
          </button>

          {isAuthenticated && (
            <div style={{ padding: '0 var(--md)', marginBottom: 'var(--md)' }}>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{user?.email}</p>
            </div>
          )}

          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              end={item.to === '/'}
            >
              <i className={`fas ${item.icon}`} style={{ width: 20, textAlign: 'center', marginRight: 8 }}></i>
              {item.label}
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 'var(--lg)' }}>
            {isAuthenticated ? (
              <button className="btn btn-ghost btn-full" onClick={() => { logout(); setMobileOpen(false); }}>
                <span className="btn-content"><i className="fas fa-sign-out-alt"></i> Logout</span>
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>
                  <span className="btn-content">Login</span>
                </NavLink>
                <NavLink to="/register" className="btn btn-outline btn-full mt-sm" onClick={() => setMobileOpen(false)} style={{ textAlign: 'center' }}>
                  <span className="btn-content">Register</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
