import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, ShieldCheck, User, CreditCard, Coins } from 'lucide-react';
import './CustomSelect.css';

export default function CustomSelect({ options, value, onChange, icon: Icon, placeholder, alignRight = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderOptions = () => (
    <div className="custom-select-options">
      {options.map((option) => {
        const OptionIcon = option.icon;
        return (
          <div
            key={option.value}
            className={`custom-option ${value === option.value ? 'selected' : ''}`}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            <div className="option-content">
              {OptionIcon && <OptionIcon size={14} className="option-icon" />}
              <span>{option.label}</span>
            </div>
            {value === option.value && <Check size={13} className="selected-check" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={`custom-select-container ${alignRight ? 'align-right' : ''}`}
      ref={containerRef}
    >
      <div
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="trigger-content">
          {Icon && <Icon size={14} className="trigger-icon" />}
          <span>{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown size={13} className={`arrow-icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        isMobile ? (
          <div className="custom-picker-overlay" onClick={() => setIsOpen(false)}>
            <div className="custom-picker-modal animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="notif-header">
                <div className="notif-header-left">
                  {Icon ? <Icon size={16} className="notif-header-icon" /> : <ChevronDown size={16} className="notif-header-icon" />}
                  <span className="notif-header-title">{placeholder || 'Select Option'}</span>
                </div>
                <div className="notif-header-right">
                  <button className="notif-close-btn" onClick={() => setIsOpen(false)} title="Close">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="picker-content">
                {renderOptions()}
              </div>
            </div>
          </div>
        ) : renderOptions()
      )}
    </div>
  );
}
