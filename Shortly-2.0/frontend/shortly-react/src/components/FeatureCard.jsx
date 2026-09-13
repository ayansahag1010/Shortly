export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="fcard">
      <div className="fcard-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
