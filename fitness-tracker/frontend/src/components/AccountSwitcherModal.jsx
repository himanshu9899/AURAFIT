import React from 'react';
import { Users, Check, Plus, X } from 'lucide-react';

export default function AccountSwitcherModal({ onClose, currentUser, demoAccounts, onSelectAccount, onOpenAuth }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative', maxWidth: '480px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            color: '#04111d',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            <Users size={26} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Switch Account</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Select an account profile to instantly switch metrics, workout history & diet plans.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {demoAccounts.map((acc) => {
            const isActive = currentUser?._id === acc._id || currentUser?.email === acc.email;
            return (
              <div
                key={acc._id}
                onClick={() => {
                  onSelectAccount(acc);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.08))' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid #10b981' : '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isActive ? 'linear-gradient(135deg, #10b981, #8b5cf6)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {acc.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: isActive ? '#34d399' : '#f3f4f6' }}>
                      {acc.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {acc.fitnessGoal} • {acc.weightKg} kg
                    </span>
                  </div>
                </div>

                {isActive ? (
                  <span className="badge badge-emerald">
                    <Check size={12} /> Active
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: '600' }}>
                    Switch
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
          >
            <Plus size={16} /> Add / Log In Account
          </button>
        </div>
      </div>
    </div>
  );
}
