import React from 'react';
import { LayoutDashboard, Dumbbell, Utensils, BarChart3, User, Flame, Sparkles, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Calorie', icon: Utensils },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Targets', icon: User }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(11, 17, 30, 0.95)',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 28px 8px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#04111d',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
        }}>
          <Flame size={26} strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AuraFit
          </h1>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', letterSpacing: '0.05em' }}>PRO TRACKER</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))' : 'transparent',
                color: isActive ? '#34d399' : '#9ca3af',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent'
              }}
            >
              <Icon size={20} color={isActive ? '#10b981' : '#9ca3af'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          background: 'rgba(244, 63, 94, 0.1)',
          color: '#fb7185',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginTop: 'auto',
          transition: 'all 0.2s ease'
        }}
      >
        <LogOut size={18} />
        <span>Logout / Exit App</span>
      </button>
    </aside>
  );
}
