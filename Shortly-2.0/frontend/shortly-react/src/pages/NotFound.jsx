import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="card card-glass text-center" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', color: 'var(--brand-teal)', marginBottom: '1rem' }}>
          <i className="fas fa-compass"></i>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '1rem' }}>
          Page or Link Not Found
        </h2>
        <p style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>
          The link you followed doesn't exist, was deleted, or the address was mistyped.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <span className="btn-content"><i className="fas fa-home"></i> Back to Safety</span>
        </Link>
      </div>
    </main>
  );
}
