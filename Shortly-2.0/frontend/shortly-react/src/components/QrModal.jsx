import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrModal({ url, onClose }) {
  const [fgColor, setFgColor] = useState('#0D9488');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(250);
  const canvasRef = useRef(null);

  if (!url) return null;

  const handleDownload = () => {
    const container = canvasRef.current;
    if (!container) return;
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'shortly-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={`modal-overlay ${url ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-dialog card card-glass">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-xmark"></i>
        </button>

        <h3 className="modal-heading">
          <i className="fas fa-qrcode"></i> QR Code
        </h3>

        <div className="qr-canvas" ref={canvasRef}>
          <QRCodeCanvas
            value={url}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            includeMargin
            style={{ borderRadius: 'var(--r-md)' }}
          />
        </div>

        <p className="qr-label">{url}</p>

        <div className="qr-controls">
          <div className="qr-field">
            <label htmlFor="qr-color">Color</label>
            <input type="color" id="qr-color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
          </div>
          <div className="qr-field">
            <label htmlFor="qr-bg">Background</label>
            <input type="color" id="qr-bg" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>
          <div className="qr-field full">
            <label htmlFor="qr-size">Size: {size}px</label>
            <input type="range" id="qr-size" min="100" max="500" value={size} step="10" onChange={(e) => setSize(Number(e.target.value))} />
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleDownload} id="download-qr-btn">
          <span className="btn-content">
            <i className="fas fa-download"></i> Download QR Code
          </span>
        </button>
      </div>
    </div>
  );
}
