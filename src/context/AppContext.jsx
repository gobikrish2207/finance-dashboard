import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';
import { api } from '../services/api';

const AppContext = createContext();

const initialBudgets = {
  'Food & Dining': 500,
  'Shopping': 300,
  'Entertainment': 200,
  'Transportation': 150,
  'Housing': 2000,
  'Utilities': 250,
  'Health & Fitness': 100,
};

const initialAccounts = [
  { id: 'acc_1', name: 'Main Savings', balance: 12500, type: 'savings' },
  { id: 'acc_2', name: 'Digital Wallet', balance: 850, type: 'checking' },
  { id: 'acc_3', name: 'Investment Port', balance: 45000, type: 'investment' },
];

const initialState = {
  isLoading: true,
  transactions: [],
  budgets: initialBudgets,
  accounts: initialAccounts,
  selectedAccount: localStorage.getItem('finance_selected_account') || 'acc_1',
  currency: JSON.parse(localStorage.getItem('finance_currency')) || { code: 'USD', symbol: '$', rate: 1 },
  role: localStorage.getItem('finance_role') || 'admin',
  theme: localStorage.getItem('finance_theme') || 'dark',
  activePage: localStorage.getItem('finance_active_page') || 'dashboard',
  filters: {
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'date',
    sortDir: 'desc'
  },
  notifications: JSON.parse(localStorage.getItem('finance_notifications')) || [
    { id: 1, message: 'Welcome back, Zorvyn!', type: 'info', timestamp: new Date().toISOString(), read: false },
    { id: 2, message: 'Monthly budget reset for Housing', type: 'success', timestamp: new Date().toISOString(), read: true }
  ],
  activeToastId: null,
  isTransactionDrawerOpen: false,
  editingTransaction: null,
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'default' // default, warning, danger
  },
  isMobileMenuOpen: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'FETCH_DATA_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        transactions: action.payload.transactions || mockTransactions,
        budgets: action.payload.budgets || initialBudgets,
        accounts: action.payload.accounts || initialAccounts
      };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_PAGE':
      return { ...state, activePage: action.payload, isMobileMenuOpen: false };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case 'CLOSE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: false };
    case 'SET_CURRENCY':

      return { 
        ...state, 
        currency: action.payload,
        notifications: [{ id: Date.now(), message: `Currency changed to ${action.payload.code}`, type: 'info', timestamp: new Date().toISOString(), read: false }, ...state.notifications],
        activeToastId: Date.now()
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_TRANSACTION':
      const newTxId = Date.now();
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions],
        notifications: [{ id: newTxId, message: `Transaction added: ${action.payload.description}`, type: 'success', timestamp: new Date().toISOString(), read: false }, ...state.notifications],
        activeToastId: newTxId
      };
    case 'UPDATE_TRANSACTION':
      const updateId = Date.now();
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
        notifications: [{ id: updateId, message: 'Transaction updated', type: 'success', timestamp: new Date().toISOString(), read: false }, ...state.notifications],
        activeToastId: updateId
      };
    case 'DELETE_TRANSACTION':
      const deleteId = Date.now();
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        notifications: [{ id: deleteId, message: 'Transaction deleted', type: 'info', timestamp: new Date().toISOString(), read: false }, ...state.notifications],
        activeToastId: deleteId
      };
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.category]: action.payload.amount },
        notifications: [{ id: Date.now(), message: `Budget updated for ${action.payload.category}`, type: 'success', timestamp: new Date().toISOString(), read: false }, ...state.notifications]
      };
    case 'SWITCH_ACCOUNT':
      return { 
        ...state, 
        selectedAccount: action.payload,
        notifications: [{ id: Date.now(), message: 'Switched account view', type: 'info', timestamp: new Date().toISOString(), read: false }, ...state.notifications]
      };
    case 'CLEAR_TOAST':
      return { ...state, activeToastId: null };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'OPEN_DRAWER':
      return { ...state, isTransactionDrawerOpen: true, editingTransaction: action.payload || null };
    case 'CLOSE_DRAWER':
      return { ...state, isTransactionDrawerOpen: false, editingTransaction: null };
    case 'ADD_NOTIFICATION': {
      const notifId = action.payload.id || Date.now();
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        activeToastId: notifId
      };
    }
    case 'RESET_STORAGE': {
      const currentTheme = state.theme;
      // Define keys to clear while preserving theme
      const keysToClear = [
        'finance_transactions', 
        'finance_budgets', 
        'finance_accounts', 
        'finance_selected_account', 
        'finance_notifications',
        'finance_currency'
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      
      return {
        ...initialState,
        theme: currentTheme,
        transactions: [],
        accounts: state.accounts.map(acc => ({ ...acc, balance: 0 })),
        budgets: Object.keys(state.budgets).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
        notifications: [
          { id: Date.now(), message: 'System Cleared: Theme Preserved.', type: 'info', timestamp: new Date().toISOString(), read: false }
        ]
      };
    }
    case 'SEED_DATA':
      return {
        ...state,
        transactions: mockTransactions,
        accounts: initialAccounts,
        budgets: initialBudgets,
        notifications: [
          { id: Date.now(), message: 'Sample Data Seeded Successfully', type: 'success', timestamp: new Date().toISOString(), read: false }
        ],
        activeToastId: Date.now()
      };
    case 'OPEN_CONFIRM':
      return {
        ...state,
        confirmModal: {
          ...state.confirmModal,
          ...action.payload,
          isOpen: true
        }
      };
    case 'CLOSE_CONFIRM':
      return {
        ...state,
        confirmModal: {
          ...state.confirmModal,
          isOpen: false
        }
      };
    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        accounts: state.accounts.map(acc => 
          acc.id === action.payload.accountId 
            ? { ...acc, balance: parseFloat(action.payload.balance) } 
            : acc
        ),
        notifications: [
          { id: Date.now(), message: `Balance updated for ${state.accounts.find(a => a.id === action.payload.accountId)?.name}`, type: 'success', timestamp: new Date().toISOString(), read: false }
        ],
        activeToastId: Date.now()
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initial Fetch: Simulated Mock API call
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const data = await api.getInitialData();
      if (isMounted) {
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('finance_transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions, state.isLoading]);

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(state.budgets));
  }, [state.budgets]);

  useEffect(() => {
    localStorage.setItem('finance_notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  useEffect(() => {
    localStorage.setItem('finance_currency', JSON.stringify(state.currency));
  }, [state.currency]);

  useEffect(() => {
    localStorage.setItem('finance_role', state.role);
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem('finance_selected_account', state.selectedAccount);
  }, [state.selectedAccount]);

  useEffect(() => {
    localStorage.setItem('finance_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Handle active toast auto-clear
  useEffect(() => {
    if (state.activeToastId) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_TOAST' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.activeToastId]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}


export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

