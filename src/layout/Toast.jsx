import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Info, X, Bell } from 'lucide-react';
import './Toast.css';

export default function ToastContainer() {
  const { state, dispatch } = useApp();
  const { notifications, activeToastId } = state;

  const activeToast = activeToastId
    ? notifications.find(n => n.id === activeToastId)
    : null;

  if (!activeToast) return null;

  const icons = {
    success: <CheckCircle2 size={16} />,
    error: <XCircle size={16} />,
    info: <Info size={16} />,
  };

  return (
    <div className="toast-container">
      <div className={`toast ${activeToast.type}`}>
        <div className={`toast-icon ${activeToast.type}`}>
          {icons[activeToast.type] || <Bell size={16} />}
        </div>
        <div className="toast-message">{activeToast.message}</div>
        <button
          className="toast-close"
          onClick={() => dispatch({ type: 'CLEAR_TOAST' })}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
