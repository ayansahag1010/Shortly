import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { createShortUrl } from '../services/urlService';

export default function UrlForm({ onResult }) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresIn, setExpiresIn] = useState('NEVER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { token } = useAuth();

  const validateUrl = (value) => {
    if (!value.trim()) return 'Please enter a URL';
    try {
      const parsed = new URL(value.startsWith('http') ? value : `https://${value}`);
      if (!['http:', 'https:'].includes(parsed.protocol)) return 'URL must start with http:// or https://';
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const urlToShorten = url.startsWith('http') ? url : `https://${url}`;
    const validationError = validateUrl(urlToShorten);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (customAlias && !/^[a-zA-Z0-9-]{3,20}$/.test(customAlias)) {
      setError('Alias must be 3-20 alphanumeric characters or hyphens');
      return;
    }

    setLoading(true);
    try {
      const payload = { originalUrl: urlToShorten };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (expiresIn !== 'NEVER') payload.expiresIn = expiresIn;

      const result = await createShortUrl(payload, token);
      onResult(result);
      showToast('Link created successfully!', 'success');
      setUrl('');
      setCustomAlias('');
      setExpiresIn('NEVER');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="input-section">
      <div className="card card-glass url-form-card">
        <form onSubmit={handleSubmit}>
          <div className="url-main-input">
            <div className="input-with-icon" style={{ flex: 1 }}>
              <input
                type="text"
                className={`input-field ${error ? 'error' : ''}`}
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                autoComplete="off"
                id="url-input"
              />
              <i className="fas fa-globe input-icon-left"></i>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="shorten-btn">
              <span className="btn-content">
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Shortening...</>
                ) : (
                  <><i className="fas fa-wand-magic-sparkles"></i> Shorten</>
                )}
              </span>
            </button>
          </div>

          {error && <p className="input-error mt-sm"><i className="fas fa-exclamation-circle"></i> {error}</p>}

          <div className="url-options">
            <div className="input-group">
              <label className="input-label" htmlFor="custom-alias">Custom Alias (optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. my-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                id="custom-alias"
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="expires-in">Expiration</label>
              <select
                className="input-field"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                id="expires-in"
              >
                <option value="NEVER">Never</option>
                <option value="ONE_DAY">1 Day</option>
                <option value="SEVEN_DAYS">7 Days</option>
                <option value="THIRTY_DAYS">30 Days</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
