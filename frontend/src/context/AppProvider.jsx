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
  const [currency, setCurrency] = useState(localStorage.getItem('fintrack_currency') || 'USD');
  
  // Initialize user
  useEffect(() => {
    const token = localStorage.getItem('fintrack_token');
    if (token) {
      getMe()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('fintrack_token');
          setUser(null);
        })
        .finally(() => setAuthLoading(false));
    } else {
      const timer = setTimeout(() => setAuthLoading(false), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('fintrack_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    setUser(null);
  };

  const changeCurrency = (curr) => {
    setCurrency(curr);
    localStorage.setItem('fintrack_currency', curr);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('fintrack_lang', lang);
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
