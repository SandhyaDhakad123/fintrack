import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { addTransaction } from '../api'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import {
  TrendingUp, TrendingDown,
  UtensilsCrossed, Car, ShoppingBag, Zap, HeartPulse, Clapperboard, Briefcase,
  CheckCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CATEGORIES = [
  { value: 'FOOD',          label: 'Food',          emoji: '🍔', color: '#F97316' },
  { value: 'TRAVEL',        label: 'Travel',        emoji: '🚕', color: '#3B82F6' },
  { value: 'SHOPPING',      label: 'Shopping',      emoji: '🛍️', color: '#8B5CF6' },
  { value: 'BILLS',         label: 'Bills',         emoji: '💡', color: '#EAB308' },
  { value: 'HEALTH',        label: 'Health',        emoji: '🏥', color: '#EF4444' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', emoji: '🎬', color: '#EC4899' },
  { value: 'OTHERS',        label: 'Others',        emoji: '💼', color: '#6B7280' },
]

const TransactionFormModal = ({ onTransactionAdded }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      amount:      '',
      type:        'DEBIT',
      category:    'OTHERS',
      date:        format(new Date(), 'yyyy-MM-dd'),
      description: '',
    },
    validationSchema: Yup.object({
      amount:   Yup.number().positive('Must be positive').required('Required'),
      type:     Yup.string().oneOf(['CREDIT', 'DEBIT']).required(),
      category: Yup.string().oneOf(CATEGORIES.map(c => c.value)).required(),
      date:     Yup.date().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (submitting) return;
      setSubmitting(true)
      try {
        await addTransaction(values)
        toast.success(t('toast.transaction_added') || 'Transaction added successfully! 🎉')
        resetForm()
        setTimeout(() => { if (onTransactionAdded) onTransactionAdded() }, 400)
      } catch (err) {
        toast.error(t('common.error'))
        console.error(err)
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Auto-categorize from description
  const handleDesc = (e) => {
    formik.handleChange(e)
    const lc = e.target.value.toLowerCase()
    if (/food|restaurant|swiggy|zomato|eat/.test(lc))             formik.setFieldValue('category', 'FOOD')
    else if (/uber|ola|flight|train|cab|taxi|travel/.test(lc))    formik.setFieldValue('category', 'TRAVEL')
    else if (/electricity|rent|water|bill|internet/.test(lc))     formik.setFieldValue('category', 'BILLS')
    else if (/amazon|flipkart|myntra|shop|buy/.test(lc))          formik.setFieldValue('category', 'SHOPPING')
    else if (/netflix|movie|prime|cinema|game/.test(lc))          formik.setFieldValue('category', 'ENTERTAINMENT')
    else if (/hospital|pharmacy|doctor|health|clinic/.test(lc))   formik.setFieldValue('category', 'HEALTH')
  }

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Type toggle */}
      <div className="form-group">
        <label className="form-label">{t('transactions.type') || 'Type'}</label>
        <div className="type-toggle">
          <button type="button" className={`type-btn credit ${formik.values.type === 'CREDIT' ? 'active' : ''}`}
            onClick={() => formik.setFieldValue('type', 'CREDIT')}>
            <TrendingUp size={16} /> {t('transactions.credit') || 'Credit'}
          </button>
          <button type="button" className={`type-btn debit ${formik.values.type === 'DEBIT' ? 'active' : ''}`}
            onClick={() => formik.setFieldValue('type', 'DEBIT')}>
            <TrendingDown size={16} /> {t('transactions.debit') || 'Debit'}
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="form-group">
        <label className="form-label">{t('transactions.amount') || 'Amount'}</label>
        <input
          name="amount" type="number" step="0.01" placeholder="0.00"
          className="form-input"
          style={{ fontSize: '1.25rem', fontWeight: 700 }}
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.amount}
        />
        {formik.touched.amount && formik.errors.amount && (
          <span style={{ fontSize: '0.75rem', color: 'var(--expense)' }}>{formik.errors.amount}</span>
        )}
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">{t('transactions.category') || 'Category'}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {CATEGORIES.map(({ value, label, emoji, color }) => (
            <button
              key={value} type="button"
              onClick={() => formik.setFieldValue('category', value)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 6px', borderRadius: 12,
                border: formik.values.category === value ? `2px solid ${color}` : '2px solid var(--border)',
                background: formik.values.category === value ? `color-mix(in srgb, ${color} 12%, white)` : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: formik.values.category === value ? color : 'var(--text-muted)' }}>
                {t(`categories.${value}`) || label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="form-group">
        <label className="form-label">{t('transactions.date') || 'Date'}</label>
        <input
          name="date" type="date"
          className="form-input"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.date}
        />
      </div>

      {/* Note */}
      <div className="form-group">
        <label className="form-label">{t('transactions.note') || 'Note'} <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({t('common.optional') || 'optional'})</span></label>
        <input
          name="description" type="text" placeholder="e.g. Dinner at restaurant"
          className="form-input"
          onChange={handleDesc} onBlur={formik.handleBlur} value={formik.values.description}
        />
        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Tip: typing keywords auto-selects the category</span>
      </div>

      <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ marginTop: 4 }}>
        {submitting ? t('common.loading') : (t('transactions.save') || 'Save Transaction')}
      </button>
    </form>
  )
}

export default TransactionFormModal
