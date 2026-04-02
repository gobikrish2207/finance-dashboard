import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, Check } from 'lucide-react';
import './ConfirmationModal.css';

export default function ConfirmationModal() {
  const { state, dispatch } = useApp();
  const { isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, type } = state.confirmModal;

  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content glass-card animate-scale-up">
        <button className="modal-close-btn" onClick={handleCancel}>
          <X size={20} />
        </button>
        
        <div className="modal-body">
          <div className={`modal-icon-container ${type}`}>
            <AlertTriangle size={32} />
          </div>
          
          <div className="modal-text">
            <h2 className="modal-title">{title}</h2>
            <p className="modal-message">{message}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn secondary" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className={`modal-btn primary ${type}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
