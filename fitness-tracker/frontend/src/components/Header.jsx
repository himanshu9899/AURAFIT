import React from 'react';
import { User, LogIn, Timer, PlusCircle, Calendar, Users, ChevronDown, LogOut } from 'lucide-react';

export default function Header({ user, onOpenAuth, onOpenTimer, onOpenQuickLog, onOpenAccountSwitcher, onLogout }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header style={{
      height: '72px',
      background: 'rgba(11, 17, 30, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      sticky: 'top',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Calendar size={18} color="#10b981" />
        <span style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: '500' }}>
          {currentDate}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={onOpenTimer} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <Timer size={16} color="#06b6d4" />
          <span>Rest Timer</span>
        </button>

        <button onClick={onOpenQuickLog} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <PlusCircle size={16} />
          <span>Quick Log</span>
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />

        <button
          onClick={onOpenAccountSwitcher}
          className="btn-secondary"
          style={{
            padding: '6px 12px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.8rem',
            color: '#fff'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f3f4f6' }}>
              {user?.name?.split(' ')[0] || 'Alex'}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '600' }}>
              Switch Account
            </span>
          </div>
          <ChevronDown size={14} color="#9ca3af" />
        </button>

        <button
          onClick={onLogout}
          className="btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          title="Logout / Return to Welcome & Login"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
