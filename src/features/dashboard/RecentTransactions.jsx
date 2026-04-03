import React from 'react';
import { useApp } from '../../context/AppContext';
import { useFinanceData } from '../../hooks/useFinanceData';
import { 
  ArrowRight, ShoppingCart, Coffee, Home, Car, Utensils, 
  MoreHorizontal, Zap, Activity, Briefcase, ChevronRight 
} from 'lucide-react';
import './DashboardComponents.css';

const IconMap = {
  'Food & Dining': Utensils,
  'Shopping': ShoppingCart,
  'Entertainment': Coffee,
  'Housing': Home,
  'Transportation': Car,
  'Utilities': Zap,
  'Health & Fitness': Activity,
  'Income': Briefcase,
  'Savings/Investment': Activity,
  'default': MoreHorizontal
};

const txColors = {
  'Food & Dining': 'hsl(45, 100%, 50%)',
  'Shopping': 'hsl(199, 89%, 48%)',
  'Entertainment': 'hsl(260, 100%, 62%)',
  'Housing': 'hsl(160, 100%, 44%)',
  'Transportation': 'hsl(190, 100%, 50%)',
  'Utilities': 'hsl(222, 10%, 60%)',
  'Health & Fitness': 'hsl(355, 100%, 61%)',
  'Income': 'hsl(160, 100%, 44%)',
  'Savings/Investment': 'hsl(199, 89%, 48%)',
  'default': 'var(--accent-primary)'
};

export default function RecentTransactions() {
  const { dispatch } = useApp();
  const data = useFinanceData();
  const { accountTransactions, formatCurrency } = data || { accountTransactions: [], formatCurrency: (v) => v };

  const handleViewAll = () => {
    dispatch({ type: 'SET_PAGE', payload: 'transactions' });
  };

  const recent = [...(accountTransactions || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="recent-transactions-pro section-column glass-card animate-slide-up">
      <div className="section-head">
        <h3 className="section-title">Ledger Activity</h3>
        <button className="mini-btn view-all-link" onClick={handleViewAll}>
          View Comprehensive Report <ChevronRight size={14} />
        </button>
      </div>

      <div className="data-grid-pro mt-6">
        {recent.length === 0 ? (
          <div className="empty-state-pro">No recent ledger activity detected.</div>
        ) : (
          recent.map((tx, idx) => {
            const Icon = IconMap[tx.category] || IconMap['default'];
            const color = txColors[tx.category] || txColors['default'];
            
            return (
              <div 
                key={tx.id} 
                className="grid-row animate-fade-in" 
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="row-icon" style={{ backgroundColor: `${color}15`, color: color }}>
                  <Icon size={18} />
                </div>
                <div className="row-main">
                  <p className="row-title">{tx.description}</p>
                  <p className="row-sub">{tx.category} • {tx.date}</p>
                </div>
                <div className={`row-value ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
