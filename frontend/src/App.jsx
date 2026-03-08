import { useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LayoutDashboard, ArrowLeftRight, Target, Wallet, User as UserIcon, Plus, X, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AppProvider } from './context/AppProvider'
import { useAppContext } from './hooks/useAppContext'

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './components/Home'
import TransactionHistory from './components/TransactionHistory'
import BudgetManager from './components/BudgetManager'
import SavingGoals from './components/SavingGoals'
import Profile from './components/Profile'
import Admin from './components/Admin'
import TransactionFormModal from './components/TransactionFormModal'

const MainApp = () => {
  const { t } = useTranslation();
  const { user, authLoading } = useAppContext();
  
  const [activeTab, setActiveTab]     = useState('home')
  const [showModal, setShowModal]     = useState(false)
  const [refreshTrigger, setRefresh]  = useState(0)
  
  // Auth view state (if not logged in)
  const [showSignUp, setShowSignUp] = useState(false)

  if (authLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{t('common.loading')}</div>;
  }

  if (!user) {
    return showSignUp 
      ? <SignUp onSwitchToSignIn={() => setShowSignUp(false)} /> 
      : <SignIn onSwitchToSignUp={() => setShowSignUp(true)} />;
  }

  const TABS = [
    { id: 'home',         label: t('nav.home'),         Icon: LayoutDashboard },
    { id: 'transactions', label: t('nav.transactions'), Icon: ArrowLeftRight   },
    { id: 'budget',       label: t('nav.budget'),       Icon: Wallet           },
    { id: 'goals',        label: t('nav.goals'),        Icon: Target           },
    { id: 'profile',      label: t('nav.profile'),      Icon: UserIcon         },
    { id: 'admin',        label: 'Admin',               Icon: Settings         },
  ]

  const handleAdded = () => {
    setShowModal(false)
    setRefresh(prev => prev + 1)
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':         return <Home refreshTrigger={refreshTrigger} onAddClick={() => setShowModal(true)} />
      case 'transactions': return <TransactionHistory refreshTrigger={refreshTrigger} />
      case 'budget':       return <BudgetManager />
      case 'goals':        return <SavingGoals />
      case 'profile':      return <Profile />
      case 'admin':        return <Admin />
      default:             return null
    }
  }

  return (
    <div className="app-layout">
      {/* Top Nav */}
      <nav className="topnav">
        <div className="topnav-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon"><Wallet size={18} /></div>
          <span className="brand-name">FinTrack</span>
        </div>

        <ul className="topnav-links">
          {TABS.map((tab) => {
            const TabIcon = tab.Icon;
            return (
              <li key={tab.id}>
                <button
                  className={`topnav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon size={15} />
                  <span className="nav-label">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div 
          className="topnav-profile" 
          title="Profile" 
          onClick={() => setActiveTab('profile')}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </nav>

      {/* Page */}
      <main className="page-content">
        {renderPage()}
      </main>

      {/* FAB */}
      {activeTab !== 'profile' && (
        <button className="fab" onClick={() => setShowModal(true)} title={t('home.add_transaction')}>
          <Plus size={24} strokeWidth={2.5} />
        </button>
      )}

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">{t('home.add_transaction')}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <TransactionFormModal onTransactionAdded={handleAdded} />
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <MainApp />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </AppProvider>
  )
}

export default App
