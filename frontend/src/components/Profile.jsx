import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCircle, Globe, DollarSign, LogOut } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { CURRENCIES } from '../constants';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout, currency, changeCurrency, changeLanguage } = useAppContext();
  
  const currentLang = localStorage.getItem('fintrack_lang') || 'en';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600, margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
          {t('profile.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
          {t('profile.preferences')} & {t('profile.account')}
        </p>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EEF2FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserCircle size={36} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
            {user?.name || 'User'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {user?.email || 'email@example.com'}
          </p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Currency Setting */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign size={18} color="var(--primary)" /> {t('profile.currency')}
          </h3>
          <div className="form-group">
            <select 
              className="form-input" 
              value={currency} 
              onChange={(e) => changeCurrency(e.target.value)}
            >
              {Object.keys(CURRENCIES).map(c => (
                <option key={c} value={c}>{c} ({CURRENCIES[c].symbol})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divider" style={{ margin: 0 }} />

        {/* Language Setting */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="var(--primary)" /> {t('profile.language')}
          </h3>
          <div className="form-group">
            <select 
              className="form-input" 
              value={currentLang} 
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

      </div>

      <div className="card" style={{ padding: 16 }}>
        <button 
          onClick={logout}
          className="btn btn-full"
          style={{ 
            background: '#FEF2F2', 
            color: '#EF4444', 
            border: '1.5px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 44
          }}
        >
          <LogOut size={16} /> {t('auth.logout')}
        </button>
      </div>

    </div>
  );
};

export default Profile;
