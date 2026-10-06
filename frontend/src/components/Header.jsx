import React from 'react';
import { Truck, ShieldCheck, Video, Clock } from 'lucide-react';

export default function Header({ onOpenLoomGuide }) {
  return (
    <header className="glass-panel" style={{
      margin: '20px 24px',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
        }}>
          <Truck size={26} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            LogMaster <span className="gradient-text">ELD</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            FMCSA Compliant Dispatch &amp; Electronic Logging Engine (70h/8d)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          color: '#34d399',
          fontWeight: 600
        }}>
          <ShieldCheck size={16} />
          <span>FMCSA § 395.3 Verified</span>
        </div>
      </div>
    </header>
  );
}
