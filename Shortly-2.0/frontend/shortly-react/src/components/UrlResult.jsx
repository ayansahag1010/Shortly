import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function UrlResult({ result, onShowQr }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!result) return null;

  const { originalUrl, shortUrl, shortCode } = result;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleOpen = () => {
    window.open(shortUrl, '_blank');
  };

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shortUrl);
    const text = encodeURIComponent('Check this out!');
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="result-card card card-glass" id="result-card">
      <div className="result-badge">
        <i className="fas fa-check-circle"></i> Link created successfully
      </div>

      <div className="result-url-row">
        <span className="result-label">Original</span>
        <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-2)', wordBreak: 'break-all' }}>
          {originalUrl.length > 60 ? originalUrl.substring(0, 60) + '...' : originalUrl}
        </span>
      </div>

      <div className="result-url-row">
        <span className="result-label">Short URL</span>
        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="result-link" id="short-link">
          {shortUrl}
        </a>
      </div>

      <div className="result-actions">
        <button className={`btn ${copied ? 'btn-success' : 'btn-primary'}`} onClick={handleCopy} id="copy-btn">
          <span className="btn-content">
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>
        <button className="btn btn-ghost" onClick={handleOpen} id="open-btn">
          <span className="btn-content">
            <i className="fas fa-arrow-up-right-from-square"></i> Open
          </span>
        </button>
        <button className="btn btn-warning" onClick={() => onShowQr(shortUrl)} id="qr-btn">
          <span className="btn-content">
            <i className="fas fa-qrcode"></i> QR Code
          </span>
        </button>
      </div>

      <div className="share-row">
        <span className="share-label">Share</span>
        <div className="share-icons">
          <button className="share-icon whatsapp" onClick={() => handleShare('whatsapp')} title="WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </button>
          <button className="share-icon twitter" onClick={() => handleShare('twitter')} title="X / Twitter">
            <i className="fab fa-x-twitter"></i>
          </button>
          <button className="share-icon telegram" onClick={() => handleShare('telegram')} title="Telegram">
            <i className="fab fa-telegram-plane"></i>
          </button>
          <button className="share-icon linkedin" onClick={() => handleShare('linkedin')} title="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
