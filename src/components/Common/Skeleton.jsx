import React, { useState, useEffect } from 'react';
import './Skeleton.css';

export function Skeleton({ width, height, borderRadius = '12px' }) {
  return (
    <div 
      className="skeleton-base" 
      style={{ width, height, borderRadius }}
    />
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="summary-card glass-card">
      <div className="card-header">
        <Skeleton width="48px" height="48px" borderRadius="12px" />
        <Skeleton width="40px" height="20px" borderRadius="20px" />
      </div>
      <div className="card-body" style={{ marginTop: '1rem' }}>
        <Skeleton width="100px" height="14px" />
        <Skeleton width="150px" height="32px" style={{ marginTop: '0.5rem' }} />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="chart-wrapper glass-card">
      <div className="chart-header">
        <Skeleton width="150px" height="24px" />
        <Skeleton width="100px" height="32px" />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Skeleton width="100%" height="250px" />
      </div>
    </div>
  );
}
