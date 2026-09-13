import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="main">
      <div className="page-header">
        <h1 className="page-title"><i className="fas fa-circle-info"></i> About Shortly 2.0</h1>
        <p className="page-sub">A high-performance, full-stack link management platform</p>
      </div>

      <div className="card card-glass mb-lg" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--brand-teal)' }}>
          The Next Generation of Link Shortening
        </h2>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
          Shortly 2.0 is a complete rebuild of the original Shortly shortener, upgraded from a client-side prototype into a scalable, enterprise-grade full-stack architecture powered by <strong>React</strong>, <strong>Spring Boot</strong>, and <strong>MySQL</strong>.
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>
          Key Technical Highlights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ background: 'var(--bg-card)', padding: '1.25rem' }}>
            <h4 style={{ color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <i className="fas fa-atom"></i> React 19 Frontend
            </h4>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              Vite-powered Single Page Application featuring responsive glassmorphism UI, light/dark themes, and instant client feedback.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--bg-card)', padding: '1.25rem' }}>
            <h4 style={{ color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <i className="fas fa-server"></i> Spring Boot 3 Backend
            </h4>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              Layered architecture with Spring MVC, Service layer, JPA repositories, Spring Security, and Base62 shortening algorithm.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--bg-card)', padding: '1.25rem' }}>
            <h4 style={{ color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <i className="fas fa-database"></i> Relational Persistence
            </h4>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              MySQL database with optimized indexing on short codes, user relations, expiration checks, and click metrics.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--bg-card)', padding: '1.25rem' }}>
            <h4 style={{ color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <i className="fas fa-shield-halved"></i> JWT Authentication
            </h4>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              Stateless token-based security protecting user dashboards, private link histories, and customized link aliases.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <span className="btn-content"><i className="fas fa-wand-magic-sparkles"></i> Try Shortly Now</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
