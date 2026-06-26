import { useEffect, useRef } from 'react';
import { createChart, AreaSeries } from 'lightweight-charts';
import socket from '../socket';

export default function PriceChart({ symbol }) {
  const containerRef = useRef(null);
  const lastTimeRef  = useRef(0);

  useEffect(() => {
    const chart = createChart(containerRef.current, {
      height: 200,
      layout: {
        background: { color: 'transparent' },
        textColor: '#6e7590',
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1e2230' },
        horzLines: { color: '#1e2230' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: '#2a2e3d',
        tickMarkFormatter: (t) => {
          const d = new Date(t * 1000);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
      },
      rightPriceScale: { borderColor: '#2a2e3d' },
      crosshair: { mode: 1 },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor:   '#3ecf8e',
      topColor:    'rgba(62,207,142,0.15)',
      bottomColor: 'rgba(62,207,142,0.0)',
      lineWidth: 1.5,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    const onTick = (tick) => {
      if (tick.symbol !== symbol) return;
      let time = Math.floor((tick.ts ?? Date.now()) / 1000);
      if (time <= lastTimeRef.current) time = lastTimeRef.current + 1;
      lastTimeRef.current = time;
      series.update({ time, value: tick.price });
    };

    socket.on('tick', onTick);

    const onResize = () =>
      chart.applyOptions({ width: containerRef.current?.clientWidth ?? 600 });
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      socket.off('tick', onTick);
      window.removeEventListener('resize', onResize);
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-symbol">{symbol}</span>
        <span className="chart-badge">
          <span className="chart-badge-dot" />
          live
        </span>
      </div>
      <div ref={containerRef} className="chart-canvas" />
    </div>
  );
}
