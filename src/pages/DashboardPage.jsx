import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useFinanceData } from '../hooks/useFinanceData';
import SummaryCards from '../features/dashboard/SummaryCards';
import BalanceTrend from '../features/dashboard/BalanceTrend';
import SpendingBreakdown from '../features/dashboard/SpendingBreakdown';
import RecentTransactions from '../features/dashboard/RecentTransactions';
import { SummaryCardSkeleton, ChartSkeleton } from '../components/Common/Skeleton';
import { Download, Plus, RefreshCw, TrendingUp } from 'lucide-react';
import '../features/dashboard/Dashboard.css';

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const { role, isLoading } = state;
  const { accountTransactions, formatCurrency } = useFinanceData();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefresh = async () => {
    setIsSyncing(true);
    // Mimic an API re-fetch for current view
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSyncing(false);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), message: 'Dashboard data synchronized with secure ledger.', type: 'success', timestamp: new Date().toISOString(), read: false } });
  };

  const handleExport = () => {
    const headers = ['Date,Description,Category,Amount,Type,Account'];
    const rows = accountTransactions.map(t =>
      `${t.date},"${t.description}",${t.category},${t.amount},${t.type},${t.accountId}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finview_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), message: 'Report exported successfully', type: 'success', timestamp: new Date().toISOString(), read: false }
    });
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), message: 'Assets synchronized — all data up to date', type: 'success', timestamp: new Date().toISOString(), read: false }
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <div className="skeleton" style={{ width: 200, height: 40, borderRadius: 8 }} />
        </div>
        <div className="summary-grid">
          {[1, 2, 3, 4].map(i => <SummaryCardSkeleton key={i} />)}
        </div>
        <div className="dashboard-main-grid">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page animate-slide-up">
      <div className="dashboard-header-pro">
        <div className="header-pro-content">
          <h2 className="dashboard-v2-title">Overview</h2>
          <p className="dashboard-v2-subtitle">Financial Intelligence Dashboard</p>
        </div>
        <div className="dashboard-v2-actions desktop-only">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={14} />
            Export Report
          </button>
          {role === 'admin' && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleSync}
                style={{ opacity: isSyncing ? 0.6 : 1 }}
              >
                <RefreshCw size={14} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                {isSyncing ? 'Syncing...' : 'Sync Assets'}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => dispatch({ type: 'OPEN_DRAWER' })}>
                <Plus size={14} />
                New Entry
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="mobile-actions-panel mobile-only">
        <div className="actions-grid-pro">
          <button className="action-tile-pro secondary" onClick={handleExport}>
            <div className="tile-icon"><Download size={20} /></div>
            <span>Export</span>
          </button>
          {role === 'admin' && (
            <button className={`action-tile-pro secondary ${isSyncing ? 'syncing' : ''}`} onClick={handleSync}>
              <div className="tile-icon">
                <RefreshCw size={20} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              </div>
              <span>{isSyncing ? 'Syncing' : 'Sync'}</span>
            </button>
          )}
        </div>
        {role === 'admin' && (
          <button className="action-tile-pro primary highlight" onClick={() => dispatch({ type: 'OPEN_DRAWER' })}>
            <Plus size={20} />
            <span>New Transaction Entry</span>
          </button>
        )}
      </div>

      <SummaryCards />

      <div className="dashboard-main-grid">
        <div className="grid-column-primary section-column">
          <BalanceTrend />
          <RecentTransactions />
        </div>
        <div className="grid-column-secondary section-column">
          <SpendingBreakdown />
          <div className="pro-insights-mini card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="section-head" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} style={{ color: 'var(--accent-indigo)' }} />
                <span className="section-title">Risk Monitor</span>
              </div>
            </div>
            <div className="insight-item">
              <p className="text-xs muted" style={{ marginBottom: 4 }}>Liquidity Index</p>
              <p className="text-sm font-bold text-success">+14.2% Optimized</p>
            </div>
            <div className="insight-item">
              <p className="text-xs muted" style={{ marginBottom: 4 }}>Volatility Pulse</p>
              <p className="text-sm font-bold text-accent">Stable</p>
            </div>
            <div className="insight-item">
              <p className="text-xs muted" style={{ marginBottom: 4 }}>Budget Adherence</p>
              <p className="text-sm font-bold" style={{ color: 'var(--accent-amber)' }}>92% On Track</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
