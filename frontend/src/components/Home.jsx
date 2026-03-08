import React, { useState, useEffect } from 'react'
import { getTransactions, getMonthlySummary } from '../api'
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Receipt, Plus } from 'lucide-react'
import WeeklyReport from './WeeklyReport'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../hooks/useAppContext'

const CATEGORY_META = {
  FOOD:          { emoji: '🍔', color: '#F97316', bg: '#FFF7ED' },
  TRAVEL:        { emoji: '🚕', color: '#3B82F6', bg: '#EFF6FF' },
  SHOPPING:      { emoji: '🛍️', color: '#8B5CF6', bg: '#F5F3FF' },
  BILLS:         { emoji: '💡', color: '#EAB308', bg: '#FEFCE8' },
  HEALTH:        { emoji: '🏥', color: '#EF4444', bg: '#FEF2F2' },
  ENTERTAINMENT: { emoji: '🎬', color: '#EC4899', bg: '#FDF2F8' },
  OTHERS:        { emoji: '💼', color: '#6B7280', bg: '#F9FAFB' },
}

const Home = ({ refreshTrigger, onAddClick }) => {
  const { t } = useTranslation()
  const { formatAmount: fmt } = useAppContext()
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear]   = useState(today.getFullYear());

  const [transactions, setTransactions] = useState([])
  const [summaryData, setSummaryData]   = useState({
    income: 0, expenses: 0, savings: 0, balance: 0
  })
  const [loading, setLoading]           = useState(true)

  const MONTHS = [
    { value: 1, label: t('months.jan', 'January') }, { value: 2, label: t('months.feb', 'February') },
    { value: 3, label: t('months.mar', 'March') }, { value: 4, label: t('months.apr', 'April') },
    { value: 5, label: t('months.may', 'May') }, { value: 6, label: t('months.jun', 'June') },
    { value: 7, label: t('months.jul', 'July') }, { value: 8, label: t('months.aug', 'August') },
    { value: 9, label: t('months.sep', 'September') }, { value: 10, label: t('months.oct', 'October') },
    { value: 11, label: t('months.nov', 'November') }, { value: 12, label: t('months.dec', 'December') }
  ]

  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({length: 5}, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Calculate start and end date of the selected month to filter transactions
        const startDate = format(new Date(selectedYear, selectedMonth - 1, 1), 'yyyy-MM-dd')
        const endDate = format(new Date(selectedYear, selectedMonth, 0), 'yyyy-MM-dd')
        
        const [txData, summaryRes] = await Promise.all([
          getTransactions({ start_date: startDate, end_date: endDate }),
          getMonthlySummary(selectedMonth, selectedYear)
        ])
        setTransactions(txData)
        setSummaryData(summaryRes)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [refreshTrigger, selectedMonth, selectedYear])

  const recent = [...transactions].slice(0, 8)
  
  const monthName = MONTHS.find(m => m.value === selectedMonth)?.label;
  const periodLabel = `${monthName} ${selectedYear}`;

  const SUMMARY = [
    { label: t('home.balance'),  value: fmt(summaryData.balance),       Icon: Wallet,       iconBg: '#EEF2FF', iconColor: '#4F46E5', sub: `${periodLabel} balance` },
    { label: t('home.income'),   value: fmt(summaryData.income),   Icon: TrendingUp,   iconBg: '#F0FDF4', iconColor: '#22C55E', sub: `${periodLabel} credits` },
    { label: t('home.expenses'), value: fmt(summaryData.expenses), Icon: TrendingDown, iconBg: '#FEF2F2', iconColor: '#EF4444', sub: `${periodLabel} debits` },
    { label: t('home.savings'),  value: fmt(summaryData.savings),       Icon: PiggyBank,    iconBg: '#F5F3FF', iconColor: '#8B5CF6', sub: `${periodLabel} savings` },
  ]

  return (
    <div>
      {/* Greeting and Filters */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
            {getGreeting(t)} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
            {t('home.subtitle')}
          </p>
        </div>
        
        {/* Month/Year Filter */}
        <div style={{ display: 'flex', gap: 12 }}>
          <select 
            className="input-field" 
            style={{ width: 140, marginBottom: 0, padding: '8px 12px' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select 
            className="input-field" 
            style={{ width: 100, marginBottom: 0, padding: '8px 12px' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {SUMMARY.map((s) => {
          const SummaryIcon = s.Icon;
          return (
            <div key={s.label} className="summary-card">
              <div className="card-icon" style={{ background: s.iconBg }}>
                <SummaryIcon size={20} color={s.iconColor} />
              </div>
              <div>
                <div className="card-label">{s.label}</div>
                <div className="card-value" style={{ fontSize: loading ? '1rem' : undefined }}>
                  {loading ? '—' : s.value}
                </div>
                <div className="card-sub">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-col layout: recent txns + weekly report */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, minWidth: 0 }}>
        {/* Recent Transactions */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="section-header" style={{ padding: '20px 20px 0' }}>
            <span className="section-title"><Receipt size={16} /> {t('home.recent_transactions')}</span>
          </div>
          <div className="divider" style={{ margin: '12px 0 0' }} />
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
              {t('common.loading')}
            </div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Receipt size={32} /></div>
              <h3>{t('home.no_transactions')}</h3>
              <p>{t('home.no_transactions_sub')}</p>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={onAddClick}>
                <Plus size={15} /> {t('home.add_transaction')}
              </button>
            </div>
          ) : (
            <div className="tx-list" style={{ padding: '8px 8px 12px' }}>
              {recent.map(t => {
                const meta = CATEGORY_META[t.category] || CATEGORY_META.OTHERS
                const isCredit = t.type === 'CREDIT'
                return (
                  <div key={t.id} className="tx-row">
                    <div className="tx-icon" style={{ background: meta.bg }}>
                      <span>{meta.emoji}</span>
                    </div>
                    <div className="tx-info">
                      <div className="tx-name">{t.description || t.category}</div>
                      <div className="tx-date">{format(parseISO(t.date), 'MMM d, yyyy')}</div>
                    </div>
                    <span className={`tx-amount ${isCredit ? 'income' : 'expense'}`}>
                      {isCredit ? '+' : '−'}{fmt(t.amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Weekly Report */}
          <WeeklyReport refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}

function getGreeting(t) {
  const h = new Date().getHours()
  if (h < 12) return t('home.greeting_morning')
  if (h < 17) return t('home.greeting_afternoon')
  return t('home.greeting_evening')
}

export default Home
