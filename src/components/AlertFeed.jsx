function dirLabel(dir) {
  if (dir === 'spike') return '▲ Spike';
  if (dir === 'drop')  return '▼ Drop';
  if (dir === 'above') return '▲ Above';
  if (dir === 'below') return '▼ Below';
  return dir;
}

export default function AlertFeed({ alerts }) {
  return (
    <aside className="sidebar">
      <div className="alerts-header">
        <div className="alerts-title-group">
          <span className="alerts-title">Alerts</span>
          <span className="alerts-subtitle">Real-time anomaly feed</span>
        </div>
        <span className="count-badge">{alerts.length}</span>
      </div>

      {alerts.length === 0 ? (
        <div className="alert-empty">
          <div className="alert-empty-icon">◎</div>
          <p>Watching for anomalies.<br />Nothing flagged yet.</p>
        </div>
      ) : (
        <ul className="alert-list">
          {alerts.map((a) => (
            <li key={a.alertRef} className={`alert-item dir-${a.direction}`}>
              <div className="alert-top">
                <span className="alert-symbol">{a.symbol}</span>
                <span className="alert-dir">{dirLabel(a.direction)}</span>
              </div>
              <div className="alert-reason">{a.reason}</div>
              <div className="alert-footer">
                <span className="alert-strategy">{a.strategy}</span>
                <span className="alert-time">
                  {new Date(a.detectedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
