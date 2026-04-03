import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useFinanceData } from '../hooks/useFinanceData';
import { currencies } from '../data/mockData';
import CustomSelect from '../components/Common/CustomSelect';
import NotificationDropdown from './NotificationDropdown';
import { 
  Search, Bell, User, ShieldCheck,
  Wallet, Landmark, Coins, ChevronRight, Activity, 
  Tag, ArrowUpRight, X, Menu, Sliders
} from 'lucide-react';
import './Header.css';

export default function Header({ title }) {
  const { state, dispatch } = useApp();
  const { role, accounts, selectedAccount, currency, notifications } = state;

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const settingsRef = useRef(null);
  const inputRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleOptions = [
    { label: 'Admin Access', value: 'admin', icon: ShieldCheck },
    { label: 'Viewer Mode', value: 'viewer', icon: User }
  ];

  const accountOptions = accounts.map(acc => ({
    label: acc.name,
    value: acc.id,
    icon: acc.type === 'savings' ? Landmark : Wallet
  }));

  const currencyOptions = currencies.map(curr => ({
    label: `${curr.code} (${curr.symbol})`,
    value: curr.code,
    icon: Coins
  }));

  // Build suggestions from transactions + categories
  const suggestions = React.useMemo(() => {
    if (searchQuery.length < 1) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    // Match transactions
    state.transactions
      .filter(t => t.accountId === selectedAccount)
      .filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach(t => {
        results.push({
          type: 'transaction',
          label: t.description,
          sub: `${t.category} · ${t.date}`,
          value: t.description,
          category: t.category
        });
      });

    // Match categories
    const categories = [...new Set(state.transactions.map(t => t.category))];
    categories
      .filter(c => c.toLowerCase().includes(q) && !results.find(r => r.label === c))
      .slice(0, 3)
      .forEach(c => {
        results.push({
          type: 'category',
          label: c,
          sub: 'Filter by category',
          value: c,
          category: c
        });
      });

    return results.slice(0, 6);
  }, [searchQuery, state.transactions, selectedAccount]);

  const handleSuggestionClick = (suggestion) => {
    // Navigate to Transactions page and apply filter
    dispatch({ type: 'SET_PAGE', payload: 'transactions' });
    if (suggestion.type === 'category') {
      dispatch({ type: 'SET_FILTERS', payload: { search: '', category: suggestion.value } });
    } else {
      dispatch({ type: 'SET_FILTERS', payload: { search: suggestion.value, category: 'All' } });
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      dispatch({ type: 'SET_PAGE', payload: 'transactions' });
      dispatch({ type: 'SET_FILTERS', payload: { search: searchQuery, category: 'All' } });
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    dispatch({ type: 'SET_FILTERS', payload: { search: '', category: 'All' } });
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setIsMobileSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-pro glass-header">
      {/* Left: Mobile Menu & Title */}
      <div className="header-left-pro">
        <button 
          className="mobile-menu-trigger" 
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumb-pro desktop-only">
          <Activity size={12} className="text-accent" />
          <span className="breadcrumb-node">FinView</span>
          <ChevronRight size={10} style={{ color: 'var(--text-subtle)' }} />
        </div>
        <h1 className="header-title-pro truncate">{title}</h1>
      </div>

      {/* Center: Search */}
      <div className={`header-center-pro ${isMobileSearchOpen ? 'mobile-search-active' : ''}`}>
        <div className="search-envelope" ref={searchRef}>
          <div className="command-bar">
            <Search size={16} className="command-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSearchSubmit}
            />
            {isMobileSearchOpen && (
              <button 
                className="mobile-search-close" 
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <X size={18} />
              </button>
            )}
            {searchQuery && !isMobileSearchOpen && (
              <button onClick={clearSearch} style={{ color: 'var(--text-muted)', padding: '2px' }}>
                <X size={14} />
              </button>
            )}
            {!searchQuery && !isMobileSearchOpen && (
              <div className="command-hint desktop-only">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="command-suggestions-pro">
              <div className="suggestion-label">
                {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
              </div>
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className={`command-suggestion-item-pro ${s.type === 'category' ? 'is-category' : ''}`}
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.type === 'category'
                    ? <Tag size={14} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
                    : <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
                  </div>
                  <ChevronRight size={14} className="suggestion-arrow" />
                </div>
              ))}
            </div>
          )}

          {showSuggestions && searchQuery.length > 0 && suggestions.length === 0 && (
            <div className="command-suggestions-pro">
              <div style={{ padding: '20px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No results for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="header-right-pro">
        <div className="system-control-cluster">
          {/* Mobile Search Trigger */}
          <button 
            className="mobile-control-btn mobile-only" 
            onClick={() => {
              setIsMobileSearchOpen(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <Search size={18} />
          </button>

          {/* Currency (Desktop) */}
          <div className="control-node currency desktop-only">
            <CustomSelect
              options={currencyOptions}
              value={currency.code}
              onChange={(code) => {
                const newCurrency = currencies.find(c => c.code === code);
                dispatch({ type: 'SET_CURRENCY', payload: newCurrency });
              }}
              alignRight
            />
          </div>

          {/* Notifications */}
          <div className="control-node signal" ref={notifRef}>
            <button
              className={`signal-trigger ${isNotifOpen ? 'active' : ''}`}
              onClick={() => {
                setIsNotifOpen(prev => !prev);
                setIsMobileSettingsOpen(false);
              }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && <span className="signal-dot" />}
            </button>
            {isNotifOpen && (
              <div className="signal-portal">
                <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
              </div>
            )}
          </div>

          {/* Mobile Settings Toggle */}
          <div className="control-node settings mobile-only" ref={settingsRef}>
            <button 
              className={`signal-trigger ${isMobileSettingsOpen ? 'active' : ''}`}
              onClick={() => {
                setIsMobileSettingsOpen(prev => !prev);
                setIsNotifOpen(false);
              }}
            >
              <Sliders size={18} />
            </button>
            {isMobileSettingsOpen && (
              <div className="mobile-settings-overlay" onClick={() => setIsMobileSettingsOpen(false)}>
                <div className="mobile-settings-panel main-modal animate-slide-up" onClick={e => e.stopPropagation()}>
                  <div className="notif-header">
                    <div className="notif-header-left">
                      <Sliders size={16} className="notif-header-icon" />
                      <span className="notif-header-title">Settings</span>
                    </div>
                    <div className="notif-header-right">
                      <button className="notif-close-btn" onClick={() => setIsMobileSettingsOpen(false)} title="Close">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="settings-content">
                    <div className="settings-section">
                      <div className="settings-label">Currency</div>
                      <CustomSelect
                        options={currencyOptions}
                        value={currency.code}
                        onChange={(code) => {
                          const newCurrency = currencies.find(c => c.code === code);
                          dispatch({ type: 'SET_CURRENCY', payload: newCurrency });
                        }}
                        placeholder="Currency"
                      />
                    </div>
                    <div className="settings-section">
                      <div className="settings-label">Account</div>
                      <CustomSelect
                        options={accountOptions}
                        value={selectedAccount}
                        onChange={(id) => dispatch({ type: 'SWITCH_ACCOUNT', payload: id })}
                        placeholder="Account"
                      />
                    </div>
                    <div className="settings-section">
                      <div className="settings-label">Access Mode</div>
                      <CustomSelect
                        options={roleOptions}
                        value={role}
                        onChange={(val) => dispatch({ type: 'SET_ROLE', payload: val })}
                        icon={role === 'admin' ? ShieldCheck : User}
                        placeholder="Access Mode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account (Desktop) */}
          <div className="control-node account desktop-only">
            <CustomSelect
              options={accountOptions}
              value={selectedAccount}
              onChange={(id) => dispatch({ type: 'SWITCH_ACCOUNT', payload: id })}
              alignRight
            />
          </div>

          {/* Role (Desktop) */}
          <div className="control-node role desktop-only">
            <CustomSelect
              options={roleOptions}
              value={role}
              onChange={(val) => dispatch({ type: 'SET_ROLE', payload: val })}
              icon={role === 'admin' ? ShieldCheck : User}
              alignRight
            />
          </div>
        </div>
      </div>
    </header>
  );
}
