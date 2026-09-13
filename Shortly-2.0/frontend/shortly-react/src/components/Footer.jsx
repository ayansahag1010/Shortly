import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" className="brand">
          <div className="brand-icon" style={{ width: 28, height: 28, fontSize: '0.8rem' }}>
            <i className="fas fa-bolt"></i>
          </div>
          <span className="brand-name" style={{ fontSize: '1rem' }}>Shortly</span>
        </Link>

        <div className="footer-links">
          <Link to="/about" className="footer-link">About</Link>
          <a href="https://github.com/ayansahag1010/Shortly" target="_blank" rel="noopener noreferrer" className="footer-link">
            <i className="fab fa-github" style={{ marginRight: 4 }}></i> GitHub
          </a>
          <Link to="/history" className="footer-link">History</Link>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Shortly 2.0. Built with{' '}
          <i className="fas fa-heart" style={{ color: 'var(--accent)' }}></i>{' '}
          using React &amp; Spring Boot
        </p>
      </div>
    </footer>
  );
}
