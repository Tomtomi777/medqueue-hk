
export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  children,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>

        <div className="stat-icon">
          <Icon size={21} />
        </div>
      </div>

      <h2>{value}</h2>
      <p>{subtitle}</p>

      {children && (
        <div className="stat-card-action">
          {children}
        </div>
      )}
    </div>
  );
}
