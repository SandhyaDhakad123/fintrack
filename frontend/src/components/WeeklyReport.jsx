import React, { useState, useEffect } from 'react'
import { getWeeklyReport } from '../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useAppContext } from '../hooks/useAppContext'
import { useTranslation } from 'react-i18next'

const CustomTooltip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '0.8125rem'
    }}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: p.fill }}>
          <span>{p.name}</span><span style={{ fontWeight: 700 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const WeeklyReport = ({ refreshTrigger }) => {
  const { t } = useTranslation()
  const { formatAmount: fmt } = useAppContext()
  const [report, setReport]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getWeeklyReport()
        const chartData = data.daily_summaries.map(d => ({
          name: format(parseISO(d.date), 'EEE'),
          Inflow: d.total_credit,
          Outflow: d.total_debit,
        }))
        setReport({ ...data, chartData })
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [refreshTrigger])

  return (
    <div className="card">
      <div className="section-header">
        <span className="section-title">Weekly Velocity</span>
        {report && (
          <span className={`badge ${report.net_total >= 0 ? 'badge-green' : 'badge-red'}`}>
            {report.net_total >= 0
              ? <><TrendingUp size={11} /> Surplus</>
              : <><TrendingDown size={11} /> Deficit</>}
            {' '}{fmt(Math.abs(report.net_total))}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>{t('common.loading')}</div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report?.chartData || []} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill: '#D1D5DB', fontSize: 10 }}
                tickFormatter={v => fmt(v)} />
              <Tooltip content={<CustomTooltip fmt={fmt} />} cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 6 }} />
              <Bar dataKey="Inflow" fill="#22C55E" radius={[6, 6, 0, 0]} barSize={18} />
              <Bar dataKey="Outflow" fill="#EF4444" radius={[6, 6, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default WeeklyReport
