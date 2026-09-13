import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAllUrls, deleteUrl } from '../services/urlService';
import UrlHistory from '../components/UrlHistory';

export default function History() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { token, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const data = await getAllUrls(token);
      setUrls(data);
    } catch (err) {
      showToast('Could not load URLs. Showing offline / empty data.', 'info');
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteUrl(id, token);
      setUrls(prev => prev.filter(u => u.id !== id));
      showToast('URL deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete URL', 'error');
    }
  };

  const filteredUrls = urls.filter(u =>
    (u.originalUrl && u.originalUrl.toLowerCase().includes(search.toLowerCase())) ||
    (u.shortCode && u.shortCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="main">
      <div className="page-header">
        <h1 className="page-title"><i className="fas fa-clock-rotate-left"></i> URL History</h1>
        <p className="page-sub">Manage and track all your shortened links in one place</p>
      </div>

      <div className="card card-glass mb-lg" style={{ padding: '1.25rem' }}>
        <div className="input-with-icon">
          <input
            type="text"
            className="input-field"
            placeholder="Search by URL or short code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="fas fa-search input-icon-left"></i>
        </div>
      </div>

      <UrlHistory urls={filteredUrls} onDelete={handleDelete} loading={loading} />
    </main>
  );
}
