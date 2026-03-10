import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet } from 'lucide-react';
import { loginUser } from '../api';
import { useAppContext } from '../hooks/useAppContext';
import { toast } from 'react-toastify';

const SignIn = ({ onSwitchToSignUp }) => {
  const { t } = useTranslation();
  const { login } = useAppContext();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login({ id: data.user_id, name: data.name, email: data.email }, { access_token: data.access_token, refresh_token: data.refresh_token });
      toast.success(t('toast.login_success'));
    } catch (err) {
      toast.error(err.response?.data?.detail || t('toast.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '40px 32px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div className="brand-icon" style={{ width: 48, height: 48, marginBottom: 16 }}>
            <Wallet size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            {t('auth.signin')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 8 }}>
            Welcome back to FinTrack
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full" 
            style={{ marginTop: 8, height: 44 }}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.signin_btn')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {t('auth.no_account')} {' '}
          <button 
            onClick={onSwitchToSignUp}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {t('auth.signup')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
