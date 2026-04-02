import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ToastContainer from './layout/Toast';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import TransactionDrawer from './features/transactions/TransactionDrawer';
import ConfirmationModal from './components/Common/ConfirmationModal';
import './App.css';

function AppContent() {
  const { state, dispatch } = useApp();
  const { activePage } = state;

  const setActivePage = (page) => dispatch({ type: 'SET_PAGE', payload: page });

  const renderPage = () => {

    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'transactions': return <TransactionsPage />;
      case 'insights': return <InsightsPage />;
      default: return <DashboardPage />;
    }
  };

  const getTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Financial Overview';
      case 'transactions': return 'Recent Transactions';
      case 'insights': return 'Financial Insights';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Header title={getTitle()} />
        <main className="page-content">
          <div key={activePage} className="animate-page-enter">
            {renderPage()}
          </div>
        </main>
      </div>
      <ToastContainer />
      <ConfirmationModal />
      {state.isTransactionDrawerOpen && (
        <TransactionDrawer
          transaction={state.editingTransaction}
          onClose={() => dispatch({ type: 'CLOSE_DRAWER' })}
        />
      )}
    </div>
  );
}


function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
