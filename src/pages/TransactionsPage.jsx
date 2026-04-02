import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useFinanceData } from '../hooks/useFinanceData';
import { mockCategories } from '../data/mockData';
import {
  Plus, Search, Download,
  Trash2, Edit2, ArrowUpDown,
  ListFilter, Activity,
  ShoppingCart, Coffee, Home, Car, Utensils,
  MoreHorizontal, Zap, Briefcase, TrendingUp, X
} from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import TransactionList from '../features/transactions/TransactionList';
import { downloadCSV } from '../utils/exportUtils';
import '../features/transactions/Transactions.css';

/**
 * Helper to group transactions by date for a better ledger view.
 */
const groupTransactions = (transactions) => {
  return transactions.reduce((groups, tx) => {
    const date = tx.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
    return groups;
  }, {});
};

/**
 * Human-readable date labels (Today, Yesterday, Date)
 */
const getDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const IconMap = {
  'Food & Dining': Utensils,
  'Shopping': ShoppingCart,
  'Entertainment': Coffee,
  'Housing': Home,
  'Transportation': Car,
  'Utilities': Zap,
  'Health & Fitness': Activity,
  'Income': Briefcase,
  'Savings/Investment': TrendingUp,
  'default': MoreHorizontal
};

const txColors = {
  'Food & Dining':      '#F59E0B',
  'Shopping':           '#06B6D4',
  'Entertainment':      '#8B5CF6',
  'Housing':            '#10B981',
  'Transportation':     '#6366F1',
  'Utilities':          '#64748B',
  'Health & Fitness':   '#F43F5E',
  'Income':             '#10B981',
  'Savings/Investment': '#6366F1',
  'default':            '#6366F1'
};

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const { role, filters, isLoading } = state;
  const { accountTransactions, formatCurrency } = useFinanceData();

  if (isLoading) {
    return (
      <div className="transactions-page">
        <div className="page-header-pro">
          <div className="header-info">
            <h2 className="dashboard-v2-title">Transactions</h2>
            <p className="dashboard-v2-subtitle">Asset Audit & Ledger</p>
          </div>
        </div>
        <div style={{ padding: '0 24px' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12, borderRadius: 12 }} />)}
        </div>
      </div>
    );
  }
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredTransactions = accountTransactions
    .filter(t => {
      const matchesSearch = !filters.search ||
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || t.category === filters.category;
      const matchesType = filters.type === 'All' || t.type === filters.type;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortDir === 'desc'
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      if (filters.sortBy === 'amount') {
        return filters.sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      return 0;
    });

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    downloadCSV(filteredTransactions, headers, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), message: `Exported ${filteredTransactions.length} transactions`, type: 'success', timestamp: new Date().toISOString(), read: false }
    });
  };

  const groupedData = filters.sortBy === 'date' ? groupTransactions(filteredTransactions) : null;

  const setFilter = (payload) => dispatch({ type: 'SET_FILTERS', payload });
  const toggleSort = (field) => setFilter({
    sortBy: field,
    sortDir: filters.sortBy === field && filters.sortDir === 'desc' ? 'asc' : 'desc'
  });

  const clearFilters = () => setFilter({ search: '', category: 'All', type: 'All' });
  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.type !== 'All';

  return (
    <div className="transactions-page animate-slide-up">
      {/* Page Header */}
      <div className="page-header-pro">
        <div className="header-info">
          <h2 className="dashboard-v2-title">Transactions</h2>
          <p className="dashboard-v2-subtitle">Asset Audit & Ledger</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={exportToCSV}>
            <Download size={14} />
            Export CSV
          </button>
          {role === 'admin' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => dispatch({ type: 'OPEN_DRAWER' })}
            >
              <Plus size={14} />
              New Entry
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="ledger-controls card">
        <div className="search-pro">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
          />
          {filters.search && (
            <button onClick={() => setFilter({ search: '' })} style={{ color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-pro-group">
          <div className="filter-item">
            <ListFilter size={13} />
            <select
              value={filters.category}
              onChange={(e) => setFilter({ category: e.target.value })}
            >
              <option value="All">All Categories</option>
              {mockCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <Activity size={13} />
            <select
              value={filters.type}
              onChange={(e) => setFilter({ type: e.target.value })}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Advanced Sort Dropdown (Visible on Mobile) */}
          <div className="filter-item mobile-sort">
            <ArrowUpDown size={13} />
            <select
              value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('-');
                setFilter({ sortBy: field, sortDir: dir });
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table / List Toggle */}
      <div className="ledger-table-wrapper card">
        {!isMobile ? (
          <table className="pro-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('date')}>
                  Date <ArrowUpDown size={12} />
                </th>
                <th>Description</th>
                <th>Category</th>
                <th onClick={() => toggleSort('amount')}>
                  Amount <ArrowUpDown size={12} />
                </th>
                <th>Status</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="empty-ledger">
                    {hasActiveFilters
                      ? `No transactions match your filters. Try adjusting your search.`
                      : 'No transactions yet. Click "New Entry" to add one.'}
                  </td>
                </tr>
              ) : groupedData ? (
                Object.keys(groupedData).map(date => (
                  <React.Fragment key={date}>
                    <tr className="group-header-row">
                      <td colSpan={role === 'admin' ? 6 : 5}>
                        <div className="group-header">
                          <span className="group-date">{getDateLabel(date)}</span>
                          <span className="group-count">{groupedData[date].length} txs</span>
                        </div>
                      </td>
                    </tr>
                    {groupedData[date].map((tx, idx) => {
                      const Icon = IconMap[tx.category] || IconMap['default'];
                      const color = txColors[tx.category] || txColors['default'];
                      return (
                        <tr key={tx.id} className="pro-row animate-fade-in">
                          <td className="timestamp-cell">{tx.date}</td>
                          <td>
                            <div className="entity-cell">
                              <div className="entity-icon" style={{ backgroundColor: `${color}18`, color }}>
                                <Icon size={15} />
                              </div>
                              <span className="entity-name">{tx.description}</span>
                            </div>
                          </td>
                          <td className="audit-cell">
                            <span className="pro-category-tag" style={{ color, borderColor: `${color}30` }}>
                              {tx.category}
                            </span>
                          </td>
                          <td className={`quantum-cell ${tx.type}`}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </td>
                          <td>
                            <span className="status-pill status-success">Verified</span>
                          </td>
                          {role === 'admin' && (
                            <td>
                              <div className="action-buttons-ledger">
                                <button className="item-btn-ledger edit" onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: tx })} title="Edit">
                                  <Edit2 size={14} />
                                </button>
                                <button className="op-btn delete" title="Delete" onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id });
                                }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))
              ) : (
                filteredTransactions.map((tx, idx) => {
                  const Icon = IconMap[tx.category] || IconMap['default'];
                  const color = txColors[tx.category] || txColors['default'];

                  return (
                    <tr
                      key={tx.id}
                      className="pro-row animate-fade-in"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="timestamp-cell">{tx.date}</td>
                      <td>
                        <div className="entity-cell">
                          <div className="entity-icon" style={{ backgroundColor: `${color}18`, color }}>
                            <Icon size={15} />
                          </div>
                          <span className="entity-name">{tx.description}</span>
                        </div>
                      </td>
                      <td className="audit-cell">
                        <span className="pro-category-tag" style={{ color, borderColor: `${color}30` }}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`quantum-cell ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td>
                        <span className="status-pill status-success">Verified</span>
                      </td>
                      {role === 'admin' && (
                        <td>
                          <div className="action-buttons-ledger">
                            <button
                              className="item-btn-ledger edit"
                              onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: tx })}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button className="op-btn delete" title="Delete" onClick={(e) => {
                              e.stopPropagation();
                              dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id });
                            }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            formatCurrency={formatCurrency}
            role={role}
            onEdit={(tx) => dispatch({ type: 'OPEN_DRAWER', payload: tx })}
            onDelete={(id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id })}
            grouped={!!groupedData}
          />
        )}
        <div className="results-summary">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} shown
          {hasActiveFilters && ` · Filtered`}
        </div>
      </div>
    </div>
  );
}
