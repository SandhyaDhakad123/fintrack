import React, { useState, useEffect } from 'react'
import { getTransactions } from '../api'
import { format, parseISO } from 'date-fns'
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import { useAppContext } from '../hooks/useAppContext'
import { useTranslation } from 'react-i18next'

const CATEGORIES = ['ALL', 'FOOD', 'TRAVEL', 'BILLS', 'SHOPPING', 'ENTERTAINMENT', 'HEALTH', 'OTHERS']

const CATEGORY_META = {
  FOOD:          { emoji: '🍔', color: '#F97316', bg: '#FFF7ED' },
  TRAVEL:        { emoji: '🚕', color: '#3B82F6', bg: '#EFF6FF' },
  SHOPPING:      { emoji: '🛍️', color: '#8B5CF6', bg: '#F5F3FF' },
  BILLS:         { emoji: '💡', color: '#EAB308', bg: '#FEFCE8' },
  HEALTH:        { emoji: '🏥', color: '#EF4444', bg: '#FEF2F2' },
  ENTERTAINMENT: { emoji: '🎬', color: '#EC4899', bg: '#FDF2F8' },
  OTHERS:        { emoji: '💼', color: '#6B7280', bg: '#F9FAFB' },
}

const TransactionHistory = ({ refreshTrigger }) => {
  const { t } = useTranslation()
  const { formatAmount: fmt } = useAppContext()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [filters, setFilters]           = useState({ category: 'ALL', search: '', startDate: '', endDate: '' })

  const fetch_ = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.category !== 'ALL') params.category = filters.category
      if (filters.search)    params.search     = filters.search
      if (filters.startDate) params.start_date = filters.startDate
      if (filters.endDate)   params.end_date   = filters.endDate
      const data = await getTransactions(params)
      setTransactions(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetch_() }, [filters, refreshTrigger, fetch_])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
          {t('transactions.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
          {transactions.length} {t('transactions.found')}
        </p>
      </div>

      {/* Filters */}
      <div className="card card-sm" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text" placeholder={t('transactions.search')} className="form-input"
            style={{ paddingLeft: 36 }}
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        {/* Category */}
        <div style={{ position: 'relative', minWidth: 140 }}>
          <SlidersHorizontal size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
          <select className="form-input" style={{ paddingLeft: 36 }}
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'ALL' ? t('transactions.all_categories') : c}</option>)}
          </select>
        </div>
        {/* Dates */}
        <input type="date" className="form-input" style={{ minWidth: 140, flex: '0 0 auto' }}
          value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" className="form-input" style={{ minWidth: 140, flex: '0 0 auto' }}
          value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>{t('common.loading')}</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Receipt size={32} /></div>
            <h3>{t('transactions.no_transactions')}</h3>
            <p>{t('transactions.no_transactions_sub')}</p>
          </div>
        ) : (
          <div className="tx-list" style={{ padding: '8px 8px 12px' }}>
            {transactions.map(t => {
              const meta = CATEGORY_META[t.category] || CATEGORY_META.OTHERS
              const isCredit = t.type === 'CREDIT'
              return (
                <div key={t.id} className="tx-row">
                  <div className="tx-icon" style={{ background: meta.bg }}>
                    <span style={{ fontSize: '1.1rem' }}>{meta.emoji}</span>
                  </div>
                  <div className="tx-info">
                    <div className="tx-name">{t.description || t.category}</div>
                    <div className="tx-date">{format(parseISO(t.date), 'MMM d, yyyy')} · {t.category}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`tx-amount ${isCredit ? 'income' : 'expense'}`}>
                      {isCredit ? '+' : '−'}{fmt(t.amount)}
                    </span>
                    <span className={`tx-badge ${isCredit ? 'income' : 'expense'}`}>
                      {isCredit ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {isCredit ? 'Credit' : 'Debit'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory
