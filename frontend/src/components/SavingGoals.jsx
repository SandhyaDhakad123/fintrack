import React, { useState, useEffect } from 'react'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../api'
import { toast } from 'react-toastify'
import { format, parseISO, differenceInDays } from 'date-fns'
import { Target, Plus, Clock, Pencil, Trash2, X, Save } from 'lucide-react'
import { useAppContext } from '../hooks/useAppContext'
import { useTranslation } from 'react-i18next'
const GOAL_COLORS = ['#4F46E5', '#22C55E', '#F97316', '#EC4899', '#3B82F6', '#8B5CF6']

// ── Confirm Delete Dialog ────────────────────────────────────
const ConfirmDialog = ({ goal, onConfirm, onCancel, t }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
    <div className="modal-panel" style={{ maxWidth: 380 }}>
      <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Trash2 size={24} color="#EF4444" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
          {t('goals.delete_title')}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 24px' }}>
          {t('goals.delete_confirm')} <strong>"{goal.name}"</strong>? {t('goals.delete_warning')}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-full" onClick={onCancel} style={{ flex: 1 }}>{t('common.cancel')}</button>
          <button
            className="btn btn-full"
            onClick={onConfirm}
            style={{ flex: 1, background: '#EF4444', color: 'white', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
          >
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  </div>
)

// ── Edit Goal Modal ──────────────────────────────────────────
const EditGoalModal = ({ goal, onSave, onClose, t }) => {
  const [form, setForm] = useState({
    name:           goal.name,
    target_amount:  goal.target_amount,
    current_amount: goal.current_amount,
    deadline:       goal.deadline,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name || !form.target_amount || !form.deadline) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSaving(true)
    try {
      await onSave(goal.id, {
        name:           form.name,
        target_amount:  parseFloat(form.target_amount),
        current_amount: parseFloat(form.current_amount) || 0,
        deadline:       form.deadline,
      })
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 className="modal-title"><Pencil size={16} /> {t('goals.edit_goal')}</h2>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">{t('goals.goal_name')}</label>
            <input type="text" className="form-input" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">{t('goals.target')}</label>
              <input type="number" step="0.01" className="form-input" value={form.target_amount}
                onChange={e => setForm({ ...form, target_amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('goals.current_saved')}</label>
              <input type="number" step="0.01" className="form-input" value={form.current_amount}
                onChange={e => setForm({ ...form, current_amount: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('goals.deadline')}</label>
            <input type="date" className="form-input" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-ghost btn-full" onClick={onClose}>{t('common.cancel')}</button>
            <button className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
              <Save size={15} /> {saving ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────
const SavingGoals = () => {
  const { t } = useTranslation()
  const { formatAmount: fmt } = useAppContext()
  const [goals, setGoals]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [form, setForm]           = useState({ name: '', target: '', deadline: '' })
  const [saving, setSaving]       = useState(false)
  const [editGoal, setEditGoal]   = useState(null)   // goal being edited
  const [deleteTarget, setDeleteTarget] = useState(null) // goal pending delete confirm

  const load = async () => {
    try { const d = await getGoals(); setGoals(d) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return;
    setSaving(true)
    try {
      await createGoal({ name: form.name, target_amount: parseFloat(form.target), deadline: form.deadline })
      toast.success(`🎯 ${t('toast.goal_created')}`)
      setForm({ name: '', target: '', deadline: '' })
      load()
    } catch(e) {
      toast.error(t('common.error'))
      console.error(e)
    } finally { setSaving(false) }
  }

  const handleEdit = async (id, data) => {
    try {
      await updateGoal(id, data)
      toast.success(t('toast.goal_updated'))
      setEditGoal(null)
      load()
    } catch(e) {
      toast.error(t('common.error'))
      console.error(e)
    }
  }

  const handleDelete = async () => {
    const goal = deleteTarget
    setDeleteTarget(null)
    try {
      await deleteGoal(goal.id)
      toast.success(`🗑️ ${t('toast.goal_deleted')}`)
      load()
    } catch(e) {
      toast.error(t('common.error'))
      console.error(e)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
          {t('goals.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
          {t('goals.subtitle')}
        </p>
      </div>

      {/* Create Form */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={18} color="var(--primary)" /> {t('goals.create')}
        </h3>
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group">
            <label className="form-label">{t('goals.goal_name')}</label>
            <input type="text" placeholder="e.g. New Car" className="form-input"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('goals.target')}</label>
            <input type="number" placeholder="0.00" step="0.01" className="form-input"
              value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('goals.deadline')}</label>
            <input type="date" className="form-input"
              value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving} style={{ height: 44 }}>
            <Plus size={15} /> {saving ? t('common.loading') : t('common.create')}
          </button>
        </form>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-light)', fontSize: '0.875rem' }}>{t('common.loading')}</div>
      ) : goals.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><Target size={32} /></div>
          <h3>{t('goals.no_goals')}</h3>
          <p>{t('goals.no_goals_sub')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {goals.map((g, i) => {
            const pct      = Math.min((g.current_amount / g.target_amount) * 100, 100)
            const daysLeft = differenceInDays(parseISO(g.deadline), new Date())
            const color    = GOAL_COLORS[i % GOAL_COLORS.length]
            const done     = pct >= 100

            return (
              <div key={g.id} className="goal-card">
                {/* Top accent bar */}
                <div style={{ height: 4, background: color, borderRadius: '4px 4px 0 0', margin: '-20px -20px 16px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Clock size={11} />
                      {daysLeft > 0 ? `${daysLeft} ${t('goals.days_left')}` : t('goals.deadline_passed')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {done
                      ? <span className="badge badge-green">🎉 {t('goals.done')}</span>
                      : <span className="badge badge-indigo">{pct.toFixed(0)}%</span>}
                    {/* Edit button */}
                    <button
                      onClick={() => setEditGoal(g)}
                      title="Edit goal"
                      style={{
                        width: 28, height: 28, borderRadius: 8, border: '1.5px solid var(--border)',
                        background: 'var(--bg-card)', color: 'var(--text-muted)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = 'var(--primary)' }}
                      onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      <Pencil size={13} />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteTarget(g)}
                      title="Delete goal"
                      style={{
                        width: 28, height: 28, borderRadius: 8, border: '1.5px solid var(--border)',
                        background: 'var(--bg-card)', color: 'var(--text-muted)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444' }}
                      onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color }}>{fmt(g.current_amount)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>of {fmt(g.target_amount)}</span>
                </div>

                <div className="progress-bar-track">
                  <div className="progress-bar-fill"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 6 }}>
                  {format(parseISO(g.deadline), 'MMM d, yyyy')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editGoal && (
        <EditGoalModal
          goal={editGoal}
          onSave={handleEdit}
          onClose={() => setEditGoal(null)}
          t={t}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          goal={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          t={t}
        />
      )}
    </div>
  )
}

export default SavingGoals
