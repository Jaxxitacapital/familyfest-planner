export default function StatCard({label,value,sub,tone=""}) {
  return <div className={`stat-card ${tone}`}>
    <span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}
  </div>
}
