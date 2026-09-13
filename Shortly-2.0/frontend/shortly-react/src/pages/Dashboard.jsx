import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getStats, getAllUrls } from '../services/urlService';
import StatsCard from '../components/StatsCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    mostUsedLink: null,
    recentLinks: [],
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getStats(token);
        setStats(data);
      } catch (err) {
        // Fallback calculation from getAllUrls or offline state
        try {
          const urls = await getAllUrls(token);
          const totalLinks = urls.length;
          const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);
          const sorted = [...urls].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
          setStats({
            totalLinks,
            totalClicks,
            mostUsedLink: sorted[0] || null,
            recentLinks: urls.slice(0, 5),
          });
        } catch {
          setStats({
            totalLinks: 0,
            totalClicks: 0,
            mostUsedLink: null,
            recentLinks: [],
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const avgClicks = stats.totalLinks > 0 ? (stats.totalClicks / stats.totalLinks).toFixed(1) : 0;

  return (
    <main className="main">
      <div className="page-header">
        <h1 className="page-title"><i className="fas fa-chart-pie"></i> Analytics Dashboard</h1>
        <p className="page-sub">Comprehensive real-time metrics for all your shortened links</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          icon="fa-link"
          iconClass="primary"
          value={loading ? '...' : stats.totalLinks}
          label="Total Links"
        />
        <StatsCard
          icon="fa-arrow-pointer"
          iconClass="accent"
          value={loading ? '...' : stats.totalClicks}
          label="Total Clicks"
        />
        <StatsCard
          icon="fa-chart-line"
          iconClass="success"
          value={loading ? '...' : avgClicks}
          label="Avg Clicks / Link"
        />
        <StatsCard
          icon="fa-fire"
          iconClass="warning"
          value={loading ? '...' : (stats.mostUsedLink ? stats.mostUsedLink.clickCount : 0)}
          label="Top Link Clicks"
        />
      </div>

      {stats.mostUsedLink && (
        <div className="card card-glass mb-lg">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--brand-teal)' }}>
            <i className="fas fa-crown"></i> Top Performing Link
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <a
                href={stats.mostUsedLink.shortUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 600, color: 'var(--brand-teal)', fontSize: '1.05rem' }}
              >
                {stats.mostUsedLink.shortUrl}
              </a>
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                {stats.mostUsedLink.originalUrl}
              </p>
            </div>
            <div className="badge badge-success" style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>
              <i className="fas fa-eye"></i> {stats.mostUsedLink.clickCount} clicks
            </div>
          </div>
        </div>
      )}

      <div className="card card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0 }}><i className="fas fa-clock-rotate-left"></i> Recent Activity</h3>
          <Link to="/history" className="btn btn-ghost btn-sm">
            View All History <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : stats.recentLinks && stats.recentLinks.length > 0 ? (
          <div className="table-responsive">
            <table className="url-table">
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Short Link</th>
                  <th>Clicks</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLinks.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="url-original" title={item.originalUrl}>
                        {item.originalUrl}
                      </span>
                    </td>
                    <td>
                      <a href={item.shortUrl} target="_blank" rel="noreferrer" className="url-short">
                        {item.shortUrl}
                      </a>
                    </td>
                    <td>
                      <span className="click-count"><i className="fas fa-eye"></i> {item.clickCount || 0}</span>
                    </td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-chart-simple"></i></div>
            <h3 className="empty-title">No analytics yet</h3>
            <p className="empty-text">Create and share your short links to start tracking live analytics.</p>
          </div>
        )}
      </div>
    </main>
  );
}
