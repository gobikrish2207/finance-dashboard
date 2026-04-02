import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useFinanceData } from '../../hooks/useFinanceData';
import { TrendingUp, TrendingDown, Coins, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Edit2, Check, X } from 'lucide-react';
import './DashboardComponents.css';

export default function SummaryCards() {
  const { dispatch } = useApp();
  const { income, expenses, balance, savingsRate, currentAccount, formatCurrency } = useFinanceData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentAccount.balance);

  const handleUpdateBalance = () => {
    dispatch({
      type: 'UPDATE_ACCOUNT_BALANCE',
      payload: { accountId: currentAccount.id, balance: editValue }
    });
    setIsEditing(false);
  };

  const cards = [
    { 
      title: `${currentAccount.name}`, 
      label: 'Portfolio Balance',
      amount: formatCurrency(currentAccount.balance), 
      icon: Activity, 
      color: 'var(--accent-primary)',
      trend: '+2.5%',
      isUp: true,
      editable: true
    },
    { 
      title: 'Current Period', 
      label: 'Consolidated Income',
      amount: formatCurrency(income), 
      icon: TrendingUp, 
      color: 'var(--accent-success)',
      trend: '+12%',
      isUp: true
    },
    { 
      title: 'Monthly Burn', 
      label: 'Operational Expenses',
      amount: formatCurrency(expenses), 
      icon: TrendingDown, 
      color: 'var(--accent-error)',
      trend: '-4%',
      isUp: false
    },
    { 
      title: 'Efficiency', 
      label: 'Savings Multiplier',
      amount: `${savingsRate}%`, 
      icon: CreditCard, 
      color: 'var(--accent-secondary)',
      trend: '+0.8%',
      isUp: true
    }
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.isUp ? ArrowUpRight : ArrowDownRight;
        
        return (
          <div 
            key={index} 
            className={`summary-card glass-card animate-slide-up ${card.editable ? 'editable-card' : ''}`} 
            style={{ 
              animationDelay: `${index * 0.1}s`,
              '--card-accent': card.color 
            }}
          >
            <div className="card-header">
              <div className="card-icon-container">
                <Icon size={20} />
              </div>
              <div className="card-metadata">
                {card.editable && !isEditing && (
                  <button className="card-edit-trigger" onClick={() => setIsEditing(true)}>
                    <Edit2 size={12} />
                  </button>
                )}
                <div className={`card-trend-pill ${card.isUp ? 'up' : 'down'}`}>
                  <TrendIcon size={12} />
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>
            <div className="card-info">
              <span className="card-label">{card.label}</span>
              {card.editable && isEditing ? (
                <div className="card-edit-field animate-fade-in">
                  <input 
                    type="number" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="balance-input-mini"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button onClick={handleUpdateBalance} className="edit-save"><Check size={14} /></button>
                    <button onClick={() => setIsEditing(false)} className="edit-cancel"><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <h3 className="card-value">{card.amount}</h3>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
