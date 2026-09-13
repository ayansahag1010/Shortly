import { Link } from 'react-router-dom';

export default function Expired() {
  return (
    <main className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <div className="card card-glass text-center" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', color: 'var(--warning)', marginBottom: '1rem' }}>
          <i className="fas fa-hourglass-end"></i>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Link Expired</h1>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '1rem' }}>
          This shortened URL is no longer active
        </h2>
        <p style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>
          The creator set an expiration date for this short link, and it has now expired.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <span className="btn-content"><i className="fas fa-wand-magic-sparkles"></i> Shorten a New URL</span>
        </Link>
      </div>
    </main>
  );
}
