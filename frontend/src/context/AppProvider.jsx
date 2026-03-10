import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMe } from '../api';
import { CURRENCIES } from '../constants';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Settings state
  const [currency, setCurrency] = useState('USD');

  // Initialize user and settings
  useEffect(() => {
    const token = localStorage.getItem('fintrack_token');
    
    // Initial global load
    const globalCurrency = localStorage.getItem('fintrack_currency');
    const globalLang = localStorage.getItem('fintrack_lang');
    if (globalCurrency) setCurrency(globalCurrency);
    if (globalLang) i18n.changeLanguage(globalLang);

    if (token) {
      getMe()
        .then(userData => {
          setUser(userData);
          // Load user-specific settings
          const uCurrency = localStorage.getItem(`fintrack_currency_${userData.id}`);
          const uLang = localStorage.getItem(`fintrack_lang_${userData.id}`);
          if (uCurrency) setCurrency(uCurrency);
          if (uLang) i18n.changeLanguage(uLang);
        })
        .catch(() => {
          localStorage.removeItem('fintrack_token');
          setUser(null);
        })
        .finally(() => setAuthLoading(false));
    } else {
      const timer = setTimeout(() => setAuthLoading(false), 0);
      return () => clearTimeout(timer);
    }
  }, [i18n]);

  const login = (userData, tokens) => {
    const { access_token, refresh_token } = tokens;
    localStorage.setItem('fintrack_token', access_token);
    localStorage.setItem('fintrack_refresh_token', refresh_token);
    setUser(userData);
    
    // Load user-specific settings on login
    const uCurrency = localStorage.getItem(`fintrack_currency_${userData.id}`);
    const uLang = localStorage.getItem(`fintrack_lang_${userData.id}`);
    if (uCurrency) setCurrency(uCurrency);
    if (uLang) i18n.changeLanguage(uLang);

    // Full page reload to ensure all axios instances and global states are fresh
    window.location.href = '/';
  };

  const logout = () => {
    // Clear all fintrack related localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('fintrack_')) {
        localStorage.removeItem(key);
      }
    });
    setUser(null);
    // Force reload to clean up all states
    window.location.href = '/login';
  };

  const changeCurrency = (curr) => {
    setCurrency(curr);
    const key = user ? `fintrack_currency_${user.id}` : 'fintrack_currency';
    localStorage.setItem(key, curr);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    const key = user ? `fintrack_lang_${user.id}` : 'fintrack_lang';
    localStorage.setItem(key, lang);
  };

  const formatAmount = (amount) => {
    const symbol = CURRENCIES[currency]?.symbol || '$';
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
    return `${symbol}${formattedNum}`;
  };

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      login,
      logout,
      currency,
      changeCurrency,
      changeLanguage,
      formatAmount
    }}>
      {children}
    </AppContext.Provider>
  );
};
