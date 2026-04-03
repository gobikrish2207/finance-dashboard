/**
 * Simulated Enterprise API Service
 * Wraps localStorage access in Promise-based functions with simulated network latency.
 */

const LATENCY = 600; // 600ms simulated network delay

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch all initial dashboard data
   */
  async getInitialData() {
    await delay(LATENCY);
    const transactions = JSON.parse(localStorage.getItem('finance_transactions')) || null;
    const budgets = JSON.parse(localStorage.getItem('finance_budgets')) || null;
    const accounts = JSON.parse(localStorage.getItem('finance_accounts')) || null;
    
    return { transactions, budgets, accounts };
  },

  /**
   * Post a new transaction to the ledger
   */
  async addTransaction(transaction) {
    await delay(LATENCY);
    const existing = JSON.parse(localStorage.getItem('finance_transactions')) || [];
    const updated = [transaction, ...existing];
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
    return transaction;
  },

  /**
   * Update an existing transaction
   */
  async updateTransaction(transaction) {
    await delay(LATENCY);
    const existing = JSON.parse(localStorage.getItem('finance_transactions')) || [];
    const updated = existing.map(t => t.id === transaction.id ? transaction : t);
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
    return transaction;
  },

  /**
   * Remove a transaction from the ledger
   */
  async deleteTransaction(id) {
    await delay(LATENCY);
    const existing = JSON.parse(localStorage.getItem('finance_transactions')) || [];
    const updated = existing.filter(t => t.id !== id);
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
    return id;
  },

  /**
   * Update category budget
   */
  async updateBudget(category, amount) {
    await delay(LATENCY);
    const existing = JSON.parse(localStorage.getItem('finance_budgets')) || {};
    const updated = { ...existing, [category]: amount };
    localStorage.setItem('finance_budgets', JSON.stringify(updated));
    return { category, amount };
  }
};
