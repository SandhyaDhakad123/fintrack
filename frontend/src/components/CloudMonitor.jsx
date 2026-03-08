import React, { useState, useEffect } from 'react'
import { Activity, Cpu, Database, Zap, RefreshCw } from 'lucide-react'

const CloudMonitor = () => {
  const [metrics, setMetrics] = useState(null)
  const [health, setHealth]   = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch_ = async () => {
    try {
      const [mr, hr] = await Promise.all([
        fetch('http://localhost:8000/metrics'),
        fetch('http://localhost:8000/health')
      ])
      setMetrics(await mr.json())
      setHealth(await hr.json())
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, 8000)
    return () => clearInterval(id)
  }, [])

  const isOnline = health?.status === 'healthy'

  return (
    <div className="card">
      <div className="section-header" style={{ marginBottom: 14 }}>
        <span className="section-title">
          <Activity size={16} color="var(--primary)" /> System
        </span>
        <span className={`badge ${isOnline ? 'badge-green' : 'badge-red'}`}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', marginRight: 4 }} />
          {loading ? 'Connecting…' : isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
          <RefreshCw size={14} /> Loading…
        </div>
      ) : (
        <div className="metric-grid">
          {[
            { label: 'Latency',  value: metrics?.api_latency,    Icon: Zap      },
            { label: 'CPU',      value: metrics?.cpu_usage,       Icon: Cpu      },
            { label: 'Memory',   value: metrics?.memory_usage,    Icon: Activity },
            { label: 'Database', value: health?.database,         Icon: Database },
          ].map((m) => {
            const MetricIcon = m.Icon;
            return (
              <div key={m.label} className="metric-item">
                <div className="metric-item-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MetricIcon size={11} /> {m.label}
                </div>
                <div className="metric-item-value">{m.value ?? '—'}</div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.75rem', color: 'var(--text-light)' }}>
          <span>Uptime: <strong style={{ color: 'var(--text-muted)' }}>{health?.uptime}</strong></span>
          <span>v{health?.version}</span>
        </div>
      )}
    </div>
  )
}

export default CloudMonitor
