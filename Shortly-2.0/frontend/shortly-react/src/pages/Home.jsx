import { useState } from 'react';
import Hero from '../components/Hero';
import UrlForm from '../components/UrlForm';
import UrlResult from '../components/UrlResult';
import FeatureCard from '../components/FeatureCard';
import QrModal from '../components/QrModal';

export default function Home() {
  const [result, setResult] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  const features = [
    { icon: 'fa-bolt', title: 'Lightning Fast', description: 'Shorten any URL in milliseconds with optimized backend routing.' },
    { icon: 'fa-shield-halved', title: 'Safety Checks', description: 'Real-time protection with malicious URL blocking.' },
    { icon: 'fa-palette', title: 'Custom QR Codes', description: 'Generate high-res QR codes with customizable colors and sizes.' },
    { icon: 'fa-tag', title: 'Custom Aliases', description: 'Create branded, memorable links with custom aliases.' },
    { icon: 'fa-clock', title: 'URL Expiration', description: 'Set temporary links that automatically expire after 1, 7, or 30 days.' },
    { icon: 'fa-chart-pie', title: 'Click Analytics', description: 'Track real-time click counts and top-performing links.' },
  ];

  return (
    <main className="main">
      <Hero />
      <UrlForm onResult={(data) => setResult(data)} />
      {result && <UrlResult result={result} onShowQr={(url) => setQrUrl(url)} />}

      <section className="features">
        <h2 className="features-heading">Everything you need</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </section>

      {qrUrl && <QrModal url={qrUrl} onClose={() => setQrUrl(null)} />}
    </main>
  );
}
