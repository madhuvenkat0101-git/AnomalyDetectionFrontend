import { useEffect, useRef, useState } from 'react';
import socket from '../socket';

// Signature element: a continuously scrolling strip of live last-prices,
// like a real exchange ticker board. Ticks can arrive fast during the burst,
// so we don't re-render on every one — prices are written into a ref, and a
// slow 1s interval triggers the redraw that actually moves the tape.
export default function TickerTape() {
  const pricesRef = useRef({});
  const [, forceRedraw] = useState(0);

  useEffect(() => {
    const onTick = (t) => {
      if (/-SIM\d+$/.test(t.symbol)) return; // ignore synthetic scale-test symbols
      pricesRef.current[t.symbol] = t.price;
    };
    socket.on('tick', onTick);

    const interval = setInterval(() => forceRedraw((n) => n + 1), 1000);
    return () => {
      socket.off('tick', onTick);
      clearInterval(interval);
    };
  }, []);

  const entries = Object.entries(pricesRef.current).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return (
      <div className="ticker-tape idle">
        <div className="ticker-track">
          <span className="ticker-item">
            <span className="ticker-sym">connecting to the live tape…</span>
          </span>
        </div>
      </div>
    );
  }

  const row = entries.map(([sym, price]) => (
    <span className="ticker-item" key={sym}>
      <span className="ticker-sym">{sym}</span>
      <span className="ticker-price">{price.toFixed(2)}</span>
    </span>
  ));

  // Duplicated once so translateX(-50%) loops with no visible seam.
  return (
    <div className="ticker-tape">
      <div className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}
