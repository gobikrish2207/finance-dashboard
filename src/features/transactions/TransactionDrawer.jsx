import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { useFinanceData } from '../../hooks/useFinanceData';
import { mockCategories } from '../../data/mockData';
import CustomSelect from '../../components/Common/CustomSelect';
import { X, Save, Plus, Coins, Calendar, Tag, CreditCard, Eye } from 'lucide-react';
import './TransactionDrawer.css';

export default function TransactionDrawer({ transaction, onClose }) {
  const { state, dispatch } = useApp();
  const { role } = state;
  const { currency } = useFinanceData();

  const [formData, setFormData] = useState(transaction || {
    description: '',
    amount: '',
    category: 'Shopping',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    accountId: state.selectedAccount
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const t = requestAnimationFrame(() => setIsAnimating(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const validate = () => {
    const e = {};
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!formData.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: transaction ? transaction.id : Date.now()
    };

    dispatch({ type: transaction ? 'UPDATE_TRANSACTION' : 'ADD_TRANSACTION', payload });
    handleClose();
  };

  const isViewer = role === 'viewer';

  return createPortal(
    <div className={`drawer-overlay ${isAnimating ? 'active' : ''}`} onClick={handleClose}>
      <div
        className={`drawer-content ${isAnimating ? 'active' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="drawer-inner">
          {/* Header */}
          <div className="drawer-header">
            <div className="header-title-group">
              <h2 className="dashboard-v2-title" style={{ fontSize: '1.5rem' }}>
                {isViewer ? 'View Entry' : (transaction ? 'Edit Entry' : 'New Entry')}
              </h2>
              <p className="dashboard-v2-subtitle">
                {isViewer ? 'Read-only · Viewer mode' : 'Manual Ledger Recording'}
              </p>
            </div>
            <button className="close-portal-btn" onClick={handleClose}>
              <X size={18} />
            </button>
          </div>

          {/* Viewer notice */}
          {isViewer && (
            <div className="viewer-notice">
              <Eye size={16} />
              <span>You are in viewer mode. Editing is disabled.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-form">
            <fieldset disabled={isViewer} style={{ border: 'none', padding: 0, margin: 0 }}>
              <div className="form-grid">
                {/* Section 1: Basics */}
                <div className="form-section">
                  <span className="section-label">Transaction Details</span>

                  <div className="form-group">
                    <label><Tag size={12} /> Description</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Monthly groceries"
                      className="enterprise-input"
                      value={formData.description}
                      onChange={e => {
                        setFormData({ ...formData, description: e.target.value });
                        if (errors.description) setErrors({ ...errors, description: null });
                      }}
                    />
                    {errors.description && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.description}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label><Coins size={12} /> Amount</label>
                      <div className="amount-input-wrapper">
                        <span className="currency-prefix">{state.currency.symbol}</span>
                        <input
                          required
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="enterprise-input"
                          value={formData.amount}
                          onChange={e => {
                            setFormData({ ...formData, amount: e.target.value });
                            if (errors.amount) setErrors({ ...errors, amount: null });
                          }}
                        />
                      </div>
                      {errors.amount && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.amount}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label><Calendar size={12} /> Date</label>
                      <input
                        required
                        type="date"
                        className="enterprise-input"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Classification */}
                <div className="form-section">
                  <span className="section-label">Classification</span>

                  <div className="form-group">
                    <label>Type</label>
                    <div className="type-toggle-enterprise">
                      <button
                        type="button"
                        className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                      >
                        ↑ Income
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                      >
                        ↓ Expense
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label><Tag size={12} /> Category</label>
                    <CustomSelect
                      options={mockCategories.map(c => ({ label: c, value: c }))}
                      value={formData.category}
                      onChange={val => setFormData({ ...formData, category: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label><CreditCard size={12} /> Account</label>
                    <CustomSelect
                      options={state.accounts.map(acc => ({ label: acc.name, value: acc.id }))}
                      value={formData.accountId}
                      onChange={val => setFormData({ ...formData, accountId: val })}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Footer */}
            <div className="portal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose} style={{ flex: 1 }}>
                {isViewer ? 'Close' : 'Cancel'}
              </button>
              {!isViewer && (
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {transaction
                    ? <><Save size={15} /> Save Changes</>
                    : <><Plus size={15} /> Post to Ledger</>
                  }
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
