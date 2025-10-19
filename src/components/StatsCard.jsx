 import './StatsCard.scss';

export default function StatsCard({ title, value, change, icon: Icon, gradient }) {
  return (
    
    <div className="stats-card">
      <div className="icon-wrapper">
        <div className="icon-box" style={{ background: gradient }}>
          <Icon size={22} />
        </div>
      </div>
      <div className="text-box">
        <p className="label">{title}</p>
        <p className="value">{value}</p>
        <p className="change">{change}</p>
      </div>
    </div>
    
  );
}
