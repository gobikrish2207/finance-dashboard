import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ReceiptText, TrendingUp, Settings, LogOut, Sun, Moon, ShieldCheck, RefreshCw, Plus, X } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activePage, setActivePage }) {
  const { state, dispatch } = useApp();
  const { isMobileMenuOpen } = state;

  const toggleTheme = () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    
    if (!document.startViewTransition) {
      dispatch({ type: 'SET_THEME', payload: newTheme });
      return;
    }

    // Set transition direction for CSS
    document.documentElement.dataset.themeTransition = newTheme === 'dark' ? 'to-dark' : 'to-light';

    const transition = document.startViewTransition(() => {
      dispatch({ type: 'SET_THEME', payload: newTheme });
    });

    // Cleanup after transition
    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeTransition;
    });
  };

  const closeMobileMenu = () => {
    dispatch({ type: 'CLOSE_MOBILE_MENU' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'visible' : ''}`} 
        onClick={closeMobileMenu}
      />
      <aside className={`sidebar glass-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4H19L5 20H19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1 className="brand-name">FinView</h1>
            {/* <span className="brand-status">Financial Intelligence</span> */}
          </div>
          <button className="mobile-close-btn" onClick={closeMobileMenu}>
            <X size={20} />
          </button>
        </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Main Menu</div>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="pro-banner">
          <div className="pro-icon"><ShieldCheck size={16} /></div>
          <div className="pro-info">
            <p className="pro-title">Enterprise Shield</p>
            <p className="pro-desc">Active Protection</p>
          </div>
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          <div style={{ 
            display: 'flex', 
            transition: 'transform 0.5s var(--ease-spring)',
            transform: `rotate(${state.theme === 'dark' ? '0deg' : '180deg'})` 
          }}>
            {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </div>
          <span>{state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button 
          className="theme-toggle-btn" 
          style={{ color: 'var(--accent-emerald)', marginTop: '4px' }}
          onClick={() => {
            dispatch({ type: 'SEED_DATA' });
          }}
        >
          <Plus size={18} />
          <span>Load Samples</span>
        </button>

        <button 
          className="theme-toggle-btn" 
          style={{ color: 'var(--accent-rose)', marginTop: '4px' }}
          onClick={() => {
            dispatch({
              type: 'OPEN_CONFIRM',
              payload: {
                title: 'Reset System',
                message: 'This will permanently delete all transaction data and reset the system. Proceed?',
                confirmText: 'Reset Data',
                type: 'danger',
                onConfirm: () => {
                  dispatch({ type: 'RESET_STORAGE' });
                  window.location.reload();
                }
              }
            });
          }}
        >
          <RefreshCw size={18} />
          <span>Reset System</span>
        </button>
        
        <div className="user-profile-mini">
          <div className="user-avatar-premium">
            <span className="avatar-text">ZU</span>
            <div className="premium-ring"></div>
          </div>
          <div className="user-details">
            <p className="user-displayName">Zorvyn User</p>
            <p className="user-badge">{state.role.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  </>
);
}
