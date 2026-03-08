import React from 'react';
import CloudMonitor from './CloudMonitor';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

const Admin = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={28} /> Admin & Debug
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>
          System monitoring and developer tools
        </p>
      </div>
      
      <div style={{ maxWidth: '800px' }}>
        <CloudMonitor />
      </div>
    </div>
  );
};

export default Admin;
