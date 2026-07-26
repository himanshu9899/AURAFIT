import React, { useState } from 'react';
import { Flame, Dumbbell, Utensils, BarChart3, Users, Zap, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, HeartPulse } from 'lucide-react';

export default function LoginPage({ onLogin, onRegister, onDemoLogin, onSelectAccount, demoAccounts, onEnterApp }) {
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
      onEnterApp();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Try Demo Access below!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '10%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <header style={{
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-glass)',
        backdropFilter: 'blur(12px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#04111d',
            boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
          }}>
            <Flame size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AuraFit
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', letterSpacing: '0.05em' }}>NEXT-GEN HEALTH TECH</span>
          </div>
        </div>

        <button onClick={onEnterApp} className="btn-secondary" style={{ fontSize: '0.9rem' }}>
          Sign In / Launch Demo →
        </button>
      </header>

      <main style={{
        flex: 1,
        maxWidth: '1320px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '48px',
        alignItems: 'center',
        zIndex: 5
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '14px', fontSize: '0.82rem', padding: '6px 14px' }}>
              <Sparkles size={14} /> Welcome to AuraFit Ecosystem
            </span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '16px', background: 'linear-gradient(135deg, #ffffff 40%, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Elevate Your Fitness & Vitality Aura.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
              <strong style={{ color: '#34d399' }}>AuraFit</strong> is an all-in-one health tech and data analytics platform engineered for workout tracking, intelligent calorie & macro budgeting, interactive performance charts, and live biometric calculations.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.04))' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✨ Why is this Fitness Tracker named "AuraFit"?
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#e5e7eb', lineHeight: '1.55' }}>
              The word <strong style={{ color: '#06b6d4' }}>"Aura"</strong> signifies radiant vitality, energy resonance, and inner confidence. Combined with <strong style={{ color: '#10b981' }}>"Fit"</strong>, AuraFit represents transforming your physical conditioning and daily nutrition into an undeniable, high-energy lifestyle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', flexShrink: 0 }}>
                <Dumbbell size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Workout Logging</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sets, reps, weight resistance, and personal records.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', flexShrink: 0 }}>
                <Utensils size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Diet & Calorie Budget</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protein, Carbs, Fats breakdown with preset diet plans.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', flexShrink: 0 }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Visual Recharts Analytics</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7-day calorie balance, weight trends & volume splits.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', flexShrink: 0 }}>
                <HeartPulse size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>BMI / BMR / TDEE</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time Mifflin-St Jeor metabolic calculations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                {isRegister ? 'Join AuraFit Today' : 'Sign In to AuraFit'}
              </h3>
              <span className="badge badge-cyan">MERN Auth</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isRegister ? 'Create your profile to start tracking metrics' : 'Access your personalized fitness analytics and logs'}
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '14px', background: 'rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Zap size={14} /> 1-Click Instant Demo Profiles:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {demoAccounts.slice(0, 3).map(acc => (
                <button
                  key={acc._id}
                  onClick={() => {
                    onSelectAccount(acc);
                    onEnterApp();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-glass)',
                    color: '#f3f4f6',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: '#000', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                      {acc.name[0]}
                    </div>
                    <div>
                      <strong style={{ color: '#fff' }}>{acc.name}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '6px' }}>({acc.fitnessGoal})</span>
                    </div>
                  </div>
                  <span style={{ color: '#06b6d4', fontWeight: '600' }}>Launch →</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>OR LOGIN WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', color: '#fb7185', borderRadius: '8px', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input className="form-input" placeholder="e.g. Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input type="email" className="form-input" placeholder="alex.fitness@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                  <option value="Body Recomposition">Body Recomposition</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center', marginTop: '4px', fontSize: '0.95rem' }}>
              {isRegister ? 'Create Account & Enter' : 'Sign In to AuraFit'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
              {isRegister ? 'Already have an account? Sign in' : "New to AuraFit? Create your account"}
            </button>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '20px 40px',
        borderTop: '1px solid var(--border-glass)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-subtle)',
        marginTop: 'auto'
      }}>
        © 2026 AuraFit Health Tech. Engineered for Workout Tracking, Nutrition Budgeting & Performance Visual Analytics.
      </footer>
    </div>
  );
}
