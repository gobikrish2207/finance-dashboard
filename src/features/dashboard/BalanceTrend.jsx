import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceData } from '../../hooks/useFinanceData';

export default function BalanceTrend() {
  const { currency, formatCurrency } = useFinanceData();

  const chartData = useMemo(() => {
    const rawData = [
      { name: 'Oct', balance: 12000 },
      { name: 'Nov', balance: 13500 },
      { name: 'Dec', balance: 11800 },
      { name: 'Jan', balance: 14200 },
      { name: 'Feb', balance: 15100 },
      { name: 'Mar', balance: 16800 },
    ];

    return rawData.map(item => ({
      ...item,
      // Keep balance raw for consistency, formatCurrency handles conversion
      displayBalance: formatCurrency(item.balance)
    }));
  }, [currency, formatCurrency]);

  return (
    <div className="balance-trend-pro glass-card animate-slide-up" style={{ padding: '24px' }}>
      <div className="section-head mb-6">
        <div className="head-info">
          <h3 className="section-title">Institutional Liquidity Trend</h3>
          <p className="text-xs muted">Rolling 6-Month Adjusted Ledger</p>
        </div>
        <div className="section-actions">
          <button className="mini-btn active">6 Months</button>
          <button className="mini-btn">1 Year</button>
        </div>
      </div>
      
      <div className="chart-content" style={{ height: 320, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalancePro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => {
                const converted = value * currency.rate;
                if (converted >= 1000) return `${currency.symbol}${(converted/1000).toFixed(1)}k`;
                return `${currency.symbol}${converted.toFixed(0)}`;
              }}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Institutional Balance']}
              contentStyle={{ 
                backgroundColor: 'rgba(18, 20, 24, 0.95)', 
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="var(--accent-primary)" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorBalancePro)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
