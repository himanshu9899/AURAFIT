import React, { useEffect } from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';

export default function CelebrationModal({ onClose, title, message }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      maxWidth: '420px',
      width: 'calc(100% - 48px)',
      background: 'linear-gradient(135deg, #064e3b, #0f172a)',
      border: '1px solid #10b981',
      borderRadius: '16px',
      padding: '16px 20px',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#04111d',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
      }}>
        <Trophy size={24} strokeWidth={2.5} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <Sparkles color="#f59e0b" size={14} />
          <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#34d399' }}>
            {title || "🎉 Congratulations!"}
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.4' }}>
          {message || "You have completed today's workout goal. Keep going! You're crushing it."}
        </p>
      </div>

      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px' }}>
        <X size={18} />
      </button>
    </div>
  );
}
