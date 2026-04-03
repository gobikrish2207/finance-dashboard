import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinanceData } from '../../hooks/useFinanceData';
import { categoryColors } from '../../data/mockData';
import './DashboardComponents.css';

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

export default function SpendingBreakdown() {
  const { categoryTotals, formatCurrency } = useFinanceData();

  const data = Object.keys(categoryTotals).map(name => ({
    name,
    value: categoryTotals[name]
  }));

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="spending-breakdown-pro section-column glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="section-head mb-4">
        <h3 className="section-title">Expense Allocation</h3>
        <span className="badge-pro">Real-time Asset Analysis</span>
      </div>

      <div className="breakdown-donut-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={75}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cy="50%"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={txColors[entry.name] || txColors['default']} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Total Exposure']}
              contentStyle={{ 
                backgroundColor: 'rgba(18, 20, 24, 0.95)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="breakdown-center-stats">
          <p className="breakdown-total-label">Gross Burn</p>
          <p className="breakdown-total-value">{formatCurrency(total)}</p>
        </div>
      </div>

      <div className="custom-legend mt-4">
        {data.sort((a,b) => b.value - a.value).slice(0, 4).map((entry, idx) => (
          <div key={idx} className="legend-item flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="dot" style={{ background: txColors[entry.name] || txColors['default'] }}></span>
              <span className="text-xs muted">{entry.name}</span>
            </div>
            <span className="text-xs font-bold">{total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
