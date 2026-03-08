import React, { useState, useEffect } from 'react'
import { getBudgets, createBudget, getMonthlyReport } from '../api'
import { toast } from 'react-toastify'
import { Wallet, Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAppContext } from '../hooks/useAppContext'
import { useTranslation } from 'react-i18next'

const CATEGORIES = ['FOOD', 'TRAVEL', 'BILLS', 'SHOPPING', 'ENTERTAINMENT', 'HEALTH', 'OTHERS']

const CAT_META = {
  FOOD:          { emoji: '🍔', color: '#F97316', bg: '#FFF7ED' },
  TRAVEL:        { emoji: '🚕', color: '#3B82F6', bg: '#EFF6FF' },
  SHOPPING:      { emoji: '🛍️', color: '#8B5CF6', bg: '#F5F3FF' },
  BILLS:         { emoji: '💡', color: '#EAB308', bg: '#FEFCE8' },
  HEALTH:        { emoji: '🏥', color: '#EF4444', bg: '#FEF2F2' },
  ENTERTAINMENT: { emoji: '🎬', color: '#EC4899', bg: '#FDF2F8' },
  OTHERS:        { emoji: '💼', color: '#6B7280', bg: '#F9FAFB' },
}

const BudgetManager = () => {
  const { t } = useTranslation()
  const { formatAmount: fmt } = useAppContext()
  const [budgets, setBudgets] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  
  const [form, setForm]       = useState({ category: 'FOOD', limit: '' })
  const [saving, setSaving]   = useState(false)

  const load = React.useCallback(async () => {
    setLoading(true)
    try { 
      const bData = await getBudgets(selectedMonth, selectedYear)
      setBudgets(bData)
      const hData = await getMonthlyReport()
      setHistory(hData.history)
    }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }, [selectedMonth, selectedYear])

  useEffect(() => { load() }, [selectedMonth, selectedYear, load])

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return;
    if (!form.limit || isNaN(parseFloat(form.limit))) {
      toast.error('Please enter a valid limit amount.')
      return
    }
    setSaving(true)
    try {
      await createBudget({ 
        category: form.category, 
        monthly_limit: parseFloat(form.limit),
        month: selectedMonth,
        year: selectedYear
      })
      const cat = CAT_META[form.category]
      toast.success(`${cat?.emoji || '✅'} ${t('toast.budget_set')}`)
      setForm({ ...form, limit: '' })
      load()
    } catch(e) {
      toast.error('Failed to set budget. Please try again.')
      console.error(e)
    } finally { setSaving(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
            {t('budget.title')} — {t(`months.${selectedMonth}`)} {selectedYear}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
            {t('budget.subtitle')}
          </p>
        </div>
        
        {/* Month / Year Filters */}
        <div style={{ display: 'flex', gap: 8 }}>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '8px 12px', height: 40 }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{t(`months.${m}`)}</option>
            ))}
          </select>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '8px 12px', height: 40 }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Set Budget Form */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wallet size={18} color="var(--primary)" /> {t('budget.set_budget')}
        </h3>

        {/* Category selector grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {CATEGORIES.map(cat => {
            const meta = CAT_META[cat]
            const active = form.category === cat
            const hasBudget = budgets.some(b => b.category === cat)
            return (
              <button
                key={cat} type="button"
                onClick={() => setForm({ ...form, category: cat })}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 6px', borderRadius: 12,
                  border: active ? `2px solid ${meta.color}` : '2px solid var(--border)',
                  background: active ? `color-mix(in srgb, ${meta.color} 12%, white)` : 'var(--bg-card)',
                  cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: active ? meta.color : 'var(--text-muted)' }}>
                  {cat}
                </span>
                {hasBudget && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: meta.color,
                  }} title="Budget set" />
                )}
              </button>
            )
          })}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">{t('budget.monthly_limit')} <strong>{form.category}</strong></label>
            <input type="number" placeholder="0.00" step="0.01" className="form-input"
              value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving || !form.limit} style={{ flexShrink: 0, height: 44 }}>
            <Plus size={15} /> {saving ? t('common.loading') : t('budget.set_budget')}
          </button>
        </form>
      </div>

      {/* Budget Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-light)', fontSize: '0.875rem' }}>{t('common.loading')}</div>
      ) : budgets.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><Wallet size={32} /></div>
          <h3>{t('budget.no_budgets')}</h3>
          <p>{t('budget.no_budgets_sub')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {budgets.map(b => {
            const meta = CAT_META[b.category] || CAT_META.OTHERS
            const pct = b.monthly_limit > 0 ? Math.min((b.current_spent / b.monthly_limit) * 100, 100) : 0
            const over = b.current_spent > b.monthly_limit
            const warn = pct >= 80 && !over
            let barColor = meta.color
            if (over) barColor = '#EF4444'
            else if (warn) barColor = '#F59E0B'

            return (
              <div key={b.id} className="budget-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {meta.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{b.category}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{t('budget.monthly')}</div>
                  </div>
                  {over
                    ? <span className="badge badge-red"><AlertTriangle size={11} /> {t('budget.over')}</span>
                    : <span className="badge badge-green"><CheckCircle size={11} /> {t('budget.ok')}</span>}
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8125rem' }}>
                  <span style={{ color: over ? '#EF4444' : 'var(--text-muted)', fontWeight: 600 }}>
                    {fmt(b.current_spent)} {t('budget.spent')}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>of {fmt(b.monthly_limit)}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: barColor, fontWeight: 700, marginTop: 4 }}>
                  {pct.toFixed(0)}% {t('budget.used')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Budget History Section */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {t('budget.history')}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>{t('budget.history_sub')}</p>
        
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-light)', fontSize: '0.875rem' }}>
            No history available yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 1fr 1fr 1fr', gap: 16, alignItems: 'center', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {t(`months.${h.month}`)} {h.year}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Income</div>
                  <div style={{ fontWeight: 600, color: '#22C55E' }}>+{fmt(h.total_credit)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expenses</div>
                  <div style={{ fontWeight: 600, color: '#EF4444' }}>-{fmt(h.total_debit)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Savings</div>
                  <div style={{ fontWeight: 700, color: h.savings >= 0 ? '#4F46E5' : '#EF4444' }}>
                    {h.savings >= 0 ? '+' : ''}{fmt(h.savings)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default BudgetManager
