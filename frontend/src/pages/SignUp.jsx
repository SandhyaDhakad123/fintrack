import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet } from 'lucide-react';
import { registerUser } from '../api';
import { useAppContext } from '../hooks/useAppContext';
import { toast } from 'react-toastify';

const SignUp = ({ onSwitchToSignIn }) => {
  const { t } = useTranslation();
  const { login } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(formData.name, formData.email, formData.password);
      login({ id: data.user_id, name: data.name, email: data.email }, { access_token: data.access_token, refresh_token: data.refresh_token });
      toast.success(t('toast.register_success'));
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
            {t('auth.signup')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 8 }}>
            Create your FinTrack account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">{t('auth.name')}</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.confirm_password')}</label>
            <input 
              type="password" 
              name="confirmPassword"
              className="form-input" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full" 
            style={{ marginTop: 8, height: 44 }}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.signup_btn')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {t('auth.have_account')} {' '}
          <button 
            onClick={onSwitchToSignIn}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {t('auth.signin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
