import React, { useState } from 'react';
import { User, LogIn, Lock, Mail, Sparkles, X } from 'lucide-react';

export default function AuthModal({ onClose, onLogin, onRegister, onDemoLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Muscle Gain & Calorie Deficit');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isRegister) {
        await onRegister({ name, email, password, fitnessGoal });
      } else {
        await onLogin({ email, password });
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#04111d' }}>
            <LogIn size={26} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            {isRegister ? 'Create AuraFit Account' : 'Welcome Back to AuraFit'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegister ? 'Join thousands tracking workouts & nutrition' : 'Log in to sync your fitness analytics'}
          </p>
        </div>

        <div style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))', border: '1px solid var(--border-neon)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Instant Demo Mode
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore with pre-populated workout data</span>
          </div>
          <button onClick={() => { onDemoLogin(); onClose(); }} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Try Demo
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', color: '#fb7185', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input className="form-input" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input type="email" className="form-input" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Primary Goal</label>
              <select className="form-input" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                <option value="Muscle Gain & Calorie Deficit">Muscle Gain & Calorie Deficit</option>
                <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
                <option value="Endurance & Performance">Endurance & Performance</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center', marginTop: '6px' }}>
            {isRegister ? 'Register Account' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
            {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
