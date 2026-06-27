import { useEffect, useRef, useState } from 'react';
import socket from './socket';
import { fetchRecentAlerts } from './api';
import PriceChart from './components/PriceChart';
import AlertFeed from './components/AlertFeed';
import ConnectionBar from './components/ConnectionBar';
import TickerTape from './components/TickerTape';

export default function App() {
  const [connected, setConnected] = useState(socket.connected);
  const [symbols,   setSymbols]   = useState([]);
  const [alerts,    setAlerts]    = useState([]);
  const [apiKey,    setApiKey]    = useState(
    () => localStorage.getItem('apiKey') || import.meta.env.VITE_API_KEY || ''
  );
  const [error, setError] = useState('');
  const seen = useRef(new Set());

  useEffect(() => {
    const onConnect    = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect',    onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect',    onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    const onTick = (t) => {
      if (/-SIM\d+$/.test(t.symbol)) return;
      if (!seen.current.has(t.symbol)) {
        seen.current.add(t.symbol);
        setSymbols(Array.from(seen.current).sort());
      }
    };
    socket.on('tick', onTick);
    return () => socket.off('tick', onTick);
  }, []);

  useEffect(() => {
    const onAlert = (a) => setAlerts((prev) => [a, ...prev].slice(0, 50));
    socket.on('alert', onAlert);
    return () => socket.off('alert', onAlert);
  }, []);

  const loadRecent = async () => {
    setError('');
    localStorage.setItem('apiKey', apiKey);
    try {
      const recent = await fetchRecentAlerts(apiKey, 10);
      setAlerts(recent);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="app">
      <TickerTape />
      <ConnectionBar
        connected={connected}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onReload={loadRecent}
        error={error}
      />

      <div className="layout">
        <div className="charts-area">
          {symbols.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <h3>No symbols yet</h3>
              <p>Charts appear automatically as price ticks come in from the service.</p>
            </div>
          ) : (
            <div className="charts-grid">
              {symbols.map((s) => (
                <PriceChart key={s} symbol={s} />
              ))}
            </div>
          )}
        </div>

        <AlertFeed alerts={alerts} />
      </div>
    </div>
  );
}
