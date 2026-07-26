import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';

export default function RestTimerModal({ onClose }) {
  const [seconds, setSeconds] = useState(90);
  const [initialSeconds, setInitialSeconds] = useState(90);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(sec => sec - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const selectPreset = (sec) => {
    setInitialSeconds(sec);
    setSeconds(sec);
    setIsActive(true);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((initialSeconds - seconds) / initialSeconds) * 100;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', position: 'relative', maxWidth: '420px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <Timer size={22} color="#06b6d4" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Active Rest Interval Timer</h3>
        </div>

        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `conic-gradient(#06b6d4 0% ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <div style={{
            width: '155px',
            height: '155px',
            borderRadius: '50%',
            background: '#111827',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'monospace', color: seconds === 0 ? '#10b981' : '#f3f4f6' }}>
              {formatTime(seconds)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {seconds === 0 ? 'REST COMPLETED! 🏋️' : isActive ? 'Counting Down' : 'Paused'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {[30, 60, 90, 120, 180].map(sec => (
            <button
              key={sec}
              onClick={() => selectPreset(sec)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: initialSeconds === sec ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                background: initialSeconds === sec ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
                color: initialSeconds === sec ? '#22d3ee' : '#9ca3af',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {sec}s
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button onClick={toggleTimer} className="btn-primary" style={{ padding: '12px 24px' }}>
            {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start Rest</>}
          </button>
          <button onClick={resetTimer} className="btn-secondary" style={{ padding: '12px 18px' }}>
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
