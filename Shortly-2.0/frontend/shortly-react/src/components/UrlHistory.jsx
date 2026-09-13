import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function UrlHistory({ urls, onDelete, loading }) {
  const [confirmId, setConfirmId] = useState(null);
  const { showToast } = useToast();

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDelete = (id) => {
    onDelete(id);
    setConfirmId(null);
    showToast('URL deleted', 'success');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading history...</p>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><i className="fas fa-link-slash"></i></div>
        <h3 className="empty-title">No URLs yet</h3>
        <p className="empty-text">Start shortening URLs to see them here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short URL</th>
              <th>Created</th>
              <th>Clicks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map(url => (
              <tr key={url.id}>
                <td className="url-cell" title={url.originalUrl}>{url.originalUrl}</td>
                <td>
                  <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="short-cell">
                    {url.shortCode}
                  </a>
                </td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                  {formatDate(url.createdAt)}
                </td>
                <td>
                  <span className="click-badge">
                    <i className="fas fa-chart-simple"></i> {url.clickCount || 0}
                  </span>
                </td>
                <td>
                  <div className="history-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleCopy(url.shortUrl)} title="Copy">
                      <i className="fas fa-copy"></i>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => window.open(url.shortUrl, '_blank')} title="Open">
                      <i className="fas fa-arrow-up-right-from-square"></i>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(url.id)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="modal-overlay open" onClick={() => setConfirmId(null)}>
          <div className="modal-backdrop"></div>
          <div className="modal-dialog card card-glass" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-heading">
              <i className="fas fa-exclamation-triangle" style={{ color: 'var(--error)' }}></i> Confirm Delete
            </h3>
            <div className="confirm-modal-body">
              <p>Are you sure you want to delete this shortened URL? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>
                  <span className="btn-content">Cancel</span>
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmId)}>
                  <span className="btn-content"><i className="fas fa-trash"></i> Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
