import { useState } from 'react';

export default function ConnectionBar({ connected, apiKey, setApiKey, onReload, error }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-logo">TV</div>
        <span className="brand-name">TealVue</span>
      </div>

      <div className="brand-divider" />
      <span className="brand-sub">Anomaly Dashboard</span>

      <div
        className={`conn-pill ${connected ? 'live' : 'offline'}`}
        title={connected ? 'WebSocket connected' : 'Disconnected — waiting to reconnect'}
      >
        <span className="conn-dot" />
        {connected ? 'Live' : 'Offline'}
      </div>

      <div className="controls">
        <div className="key-wrap">
          <input
            className="key-input"
            type={showKey ? 'text' : 'password'}
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onReload()}
          />
          <button
            className="eye-btn"
            onClick={() => setShowKey((v) => !v)}
            title={showKey ? 'Hide key' : 'Show key'}
            type="button"
          >
            {showKey ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <button className="btn btn-primary" onClick={onReload}>
          Load history
        </button>
        {error && <span className="err-msg" title={error}>{error}</span>}
      </div>
    </div>
  );
}
