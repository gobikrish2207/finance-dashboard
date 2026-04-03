import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useFinanceData() {
  const { state } = useApp();
  const { transactions, budgets, accounts, selectedAccount, currency } = state;

  const stats = useMemo(() => {
    // 1. Filter transactions by selected account
    const accountTransactions = transactions.filter(t => t.accountId === selectedAccount);

    // 2. Conversion helper
    const convert = (amount) => amount * currency.rate;

    // 3. Formatting helper
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
      }).format(convert(amount));
    };

    const rawIncome = accountTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const rawExpenses = accountTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const income = rawIncome;
    const expenses = rawExpenses;
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;

    // Category-wise totals (Raw)
    const categoryTotals = accountTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Chart Data (Raw)
    const budgetData = Object.keys(budgets).map(category => {
      const budget = budgets[category];
      const actual = categoryTotals[category] || 0;
      return {
        name: category,
        budget,
        actual: parseFloat(actual.toFixed(2)),
        percentage: budget > 0 ? ((actual / budget) * 100).toFixed(1) : 0
      };
    });

    const currentAccount = accounts.find(a => a.id === selectedAccount) || accounts[0];

    return {
      income,
      expenses,
      balance,
      savingsRate,
      categoryTotals,
      budgetData,
      currentAccount,
      formatCurrency,
      convert,
      currency,
      accountTransactions
    };
  }, [transactions, budgets, accounts, selectedAccount, currency]);

  return stats;
}

