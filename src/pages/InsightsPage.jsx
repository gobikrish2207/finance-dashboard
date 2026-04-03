import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useFinanceData } from '../hooks/useFinanceData';
import {
  TrendingUp, Activity, ShieldCheck, Zap, ChevronRight, Target
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import { ChartSkeleton } from '../components/Common/Skeleton';
import '../features/insights/Insights.css';

const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontWeight: 600,
  boxShadow: 'var(--shadow-lg)'
};

export default function InsightsPage() {
  const { state, dispatch } = useApp();
  const { role, isLoading } = state;
  const { budgetData, income, expenses, formatCurrency } = useFinanceData();

  const totalExpense = expenses;
  const highestCategory = [...budgetData].sort((a, b) => b.actual - a.actual)[0] || { name: 'None', actual: 0 };
  const highestPercent = totalExpense > 0 ? ((highestCategory.actual / totalExpense) * 100).toFixed(1) : 0;

  const monthlyComparison = [
    { name: 'Feb', income: income * 0.85, expenses: expenses * 0.9 },
    { name: 'Mar', income: income * 0.92, expenses: expenses * 0.95 },
    { name: 'Apr', income: income, expenses: expenses },
  ];

  const handleRebalance = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), message: `Rebalancing initiated for ${highestCategory.name}`, type: 'info', timestamp: new Date().toISOString(), read: false }
    });
  };

  const handleDiversify = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), message: 'Diversification strategy queued for review', type: 'info', timestamp: new Date().toISOString(), read: false }
    });
  };

  if (isLoading) {
    return (
      <div className="insights-page">
        <div className="insights-header-pro">
          <div className="header-info">
            <h2 className="dashboard-v2-title">Insights</h2>
            <p className="dashboard-v2-subtitle">Intelligence Engine</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[1, 2, 3].map(i => <ChartSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="insights-page animate-slide-up">
      {/* Header */}
      <div className="insights-header-pro">
        <div className="header-info">
          <h2 className="dashboard-v2-title">Insights</h2>
          <p className="dashboard-v2-subtitle">Intelligence Engine · Predictive Analytics</p>
        </div>
        <div className="header-metrics flex gap-6">
          <div className="mini-metric">
            <span className="text-xs muted">Efficiency</span>
            <p className="text-sm font-bold text-success">94.2%</p>
          </div>
          <div className="mini-metric">
            <span className="text-xs muted">Risk Level</span>
            <p className="text-sm font-bold text-accent">Stable</p>
          </div>
        </div>
      </div>

      <div className="insights-main-grid">
        {/* Primary column */}
        <div className="insights-column-primary section-column">
          {/* Mini insight cards */}
          <div className="insights-row-group">
            {/* Top Spend Category */}
            <div className="insight-card-pro card card-hover">
              <div className="insight-pro-header">
                <div className="insight-pro-icon bg-emerald-pro">
                  <TrendingUp size={18} />
                </div>
                <div className="insight-pro-meta">
                  <span className="text-xs muted">Top Category</span>
                  <h4 className="text-sm font-bold">{highestCategory.name}</h4>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xl font-black" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatCurrency(highestCategory.actual)}
                  </p>
                  <span className="text-xs font-bold text-error">{highestPercent}% of spend</span>
                </div>
                <div className="pro-progress-container">
                  <div className="pro-progress-fill bg-emerald" style={{ width: `${highestPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="insight-card-pro card card-hover">
              <div className="insight-pro-header">
                <div className="insight-pro-icon bg-violet-pro">
                  <Activity size={18} />
                </div>
                <div className="insight-pro-meta">
                  <span className="text-xs muted">Capital Preserved</span>
                  <h4 className="text-sm font-bold">Net Surplus</h4>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xl font-black" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0}%
                  </p>
                  <span className="text-xs font-bold text-success">Optimized</span>
                </div>
                <p className="text-xs muted">
                  Surplus: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(income - expenses)}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Budget Calibration Chart */}
          <div className="insight-chart-card card">
            <div className="section-head">
              <h3 className="section-title">Budget vs. Actual</h3>
              <span className="badge-pro">Current Period</span>
            </div>
            <div className="chart-content" style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData.slice(0, 6)} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false} tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={(value, name) => [formatCurrency(value), name === 'budget' ? 'Budget' : 'Actual']}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value === 'budget' ? 'Budget' : 'Actual'}</span>}
                  />
                  <Bar dataKey="budget" name="budget" fill="var(--bg-elevated)" radius={[4,4,0,0]} barSize={16} />
                  <Bar dataKey="actual" name="actual" radius={[4,4,0,0]} barSize={16}>
                    {budgetData.slice(0, 6).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.actual > entry.budget ? 'var(--accent-rose)' : 'var(--accent-indigo)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="insight-chart-card card">
            <div className="section-head">
              <h3 className="section-title">Monthly Performance</h3>
              <span className="badge-pro">3-Month View</span>
            </div>
            <div className="chart-content" style={{ height: 220, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparison} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false} tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={(value, name) => [formatCurrency(value), name === 'income' ? 'Income' : 'Expenses']}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value === 'income' ? 'Income' : 'Expenses'}</span>}
                  />
                  <Bar dataKey="income" name="income" fill="var(--accent-emerald)" radius={[4,4,0,0]} barSize={20} />
                  <Bar dataKey="expenses" name="expenses" fill="var(--accent-rose)" radius={[4,4,0,0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="comparison-insights">
              <div className="comp-item">
                <span className="text-xs muted">Revenue MoM</span>
                <p className="text-sm font-bold text-success">↑ 8.7%</p>
              </div>
              <div className="comp-item">
                <span className="text-xs muted">Spend MoM</span>
                <p className="text-sm font-bold text-error">↑ 5.3%</p>
              </div>
              <div className="comp-item">
                <span className="text-xs muted">Net Trend</span>
                <p className="text-sm font-bold text-accent">↑ Improving</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary — Strategic Feed */}
        <div className="insights-column-secondary section-column">
          <div className="section-head">
            <h3 className="section-title">Strategic Feed</h3>
          </div>

          <div className="tips-list-pro">
            {/* Alert 1 */}
            <div className="tip-card-pro card">
              <div className="tip-header-pro">
                <Zap size={15} style={{ color: 'var(--accent-amber)' }} />
                <span className="text-xs font-bold uppercase" style={{ color: 'var(--accent-amber)', letterSpacing: '0.08em' }}>Threshold Alert</span>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2">{highestCategory.name} Overflow</h4>
                <p className="text-xs muted">Spending peaked at {highestPercent}% of total allocation. Consider rebalancing.</p>
              </div>
              {role === 'admin' && (
                <button className="btn btn-secondary btn-sm w-full" onClick={handleRebalance}>
                  Initiate Rebalance <ChevronRight size={13} />
                </button>
              )}
            </div>

            {/* Alert 2 */}
            <div className="tip-card-pro card">
              <div className="tip-header-pro">
                <ShieldCheck size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span className="text-xs font-bold uppercase" style={{ color: 'var(--accent-cyan)', letterSpacing: '0.08em' }}>Yield Opportunity</span>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2">Asset Optimization</h4>
                <p className="text-xs muted">
                  Redirect {formatCurrency(5000)} to a high-yield node for projected annual gain of {formatCurrency(220)}.
                </p>
              </div>
              {role === 'admin' && (
                <button className="btn btn-secondary btn-sm w-full" onClick={handleDiversify}>
                  Execute Strategy <ChevronRight size={13} />
                </button>
              )}
            </div>

            {/* Alert 3 */}
            <div className="tip-card-pro card">
              <div className="tip-header-pro">
                <Target size={15} style={{ color: 'var(--accent-emerald)' }} />
                <span className="text-xs font-bold uppercase" style={{ color: 'var(--accent-emerald)', letterSpacing: '0.08em' }}>On Track</span>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2">Savings Goal Progress</h4>
                <p className="text-xs muted">You are on track to meet your monthly savings target of {formatCurrency(2000)}.</p>
              </div>
              <div className="pro-progress-container">
                <div
                  className="pro-progress-fill"
                  style={{
                    width: `${Math.min(100, income > 0 ? ((income - expenses) / 2000 * 100) : 0)}%`,
                    background: 'var(--accent-emerald)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
