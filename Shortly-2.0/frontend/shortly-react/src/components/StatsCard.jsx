export default function StatsCard({ icon, iconClass, value, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
