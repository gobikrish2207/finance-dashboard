import React from 'react';
import { 
  Edit2, Trash2, ShoppingCart, Coffee, Home, Car, Utensils, 
  MoreHorizontal, Zap, Briefcase, TrendingUp, Activity, ChevronRight 
} from 'lucide-react';

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

export default function TransactionList({ transactions, formatCurrency, onEdit, onDelete, role, grouped = false }) {
  if (transactions.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No transactions found matching your criteria.
      </div>
    );
  }

  return (
    <div className="transaction-mobile-list">
      {transactions.map((tx, idx) => {
        const Icon = IconMap[tx.category] || IconMap['default'];
        const color = txColors[tx.category] || txColors['default'];
        
        // Group Header Logic
        const showHeader = grouped && (idx === 0 || transactions[idx - 1].date !== tx.date);

        return (
          <React.Fragment key={tx.id}>
            {showHeader && (
              <div className="mobile-group-header animate-fade-in">
                {getDateLabel(tx.date)}
              </div>
            )}
            <div 
              className="mobile-tx-card glass-card animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="tx-card-header">
                <div className="tx-icon-box" style={{ backgroundColor: `${color}18`, color }}>
                  <Icon size={18} />
                </div>
                <div className="tx-info-box">
                  <div className="tx-description truncate">{tx.description}</div>
                  <div className="tx-meta">
                    <span className="tx-date">{tx.date}</span>
                    <span className="tx-dot"></span>
                    <span className="tx-category" style={{ color }}>{tx.category}</span>
                  </div>
                </div>
                <div className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
              
              {role === 'admin' && (
                <div className="tx-card-actions">
                  <button className="mobile-action-btn edit" onClick={() => onEdit(tx)}>
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button className="mobile-action-btn delete" onClick={() => onDelete(tx.id)}>
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
