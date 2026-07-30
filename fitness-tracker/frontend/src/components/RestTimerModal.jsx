import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Clock, Settings2 } from 'lucide-react';

export default function RestTimerModal({ onClose }) {
  const [seconds, setSeconds] = useState(90);
  const [initialSeconds, setInitialSeconds] = useState(90);
  const [isActive, setIsActive] = useState(false);

  // Custom Input State (Minutes & Seconds up to 60 mins / 1 Hour)
  const [customMins, setCustomMins] = useState(1);
  const [customSecs, setCustomSecs] = useState(30);
  const [showCustomInput, setShowCustomInput] = useState(false);

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
    setShowCustomInput(false);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const mins = Math.min(60, Math.max(0, Number(customMins) || 0));
    const secs = Math.min(59, Math.max(0, Number(customSecs) || 0));
    let totalSec = mins * 60 + secs;
    if (totalSec > 3600) totalSec = 3600; // Cap at 1 Hour (3600s)
    if (totalSec <= 0) totalSec = 30; // Minimum 30s

    setInitialSeconds(totalSec);
    setSeconds(totalSec);
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

  const progressPercent = initialSeconds > 0 ? ((initialSeconds - seconds) / initialSeconds) * 100 : 0;

  const presets = [
    { label: '30s', sec: 30 },
    { label: '60s', sec: 60 },
    { label: '90s', sec: 90 },
    { label: '3m', sec: 180 },
    { label: '5m', sec: 300 },
    { label: '10m', sec: 600 },
    { label: '15m', sec: 900 },
    { label: '30m', sec: 1800 },
    { label: '60m (1 hr)', sec: 3600 }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', position: 'relative', maxWidth: '460px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <Timer size={22} color="#06b6d4" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Active Rest & Interval Timer</h3>
        </div>

        {/* Circular Countdown Gauge */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `conic-gradient(#06b6d4 0% ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
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
              {seconds === 0 ? 'INTERVAL COMPLETED! 🏋️' : isActive ? 'Counting Down' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Quick Presets Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
          {presets.map(item => (
            <button
              key={item.sec}
              onClick={() => selectPreset(item.sec)}
              style={{
                padding: '5px 10px',
                borderRadius: '12px',
                border: initialSeconds === item.sec && !showCustomInput ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                background: initialSeconds === item.sec && !showCustomInput ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
                color: initialSeconds === item.sec && !showCustomInput ? '#22d3ee' : '#9ca3af',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Custom Timer Input Option */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#06b6d4',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings2 size={14} /> {showCustomInput ? 'Hide Custom Input' : '⚙️ Custom Time (up to 1 Hour)'}
          </button>

          {showCustomInput && (
            <form onSubmit={handleApplyCustom} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Minutes (0-60)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  className="form-input"
                  style={{ width: '75px', textAlign: 'center', padding: '6px', fontSize: '0.9rem' }}
                  value={customMins}
                  onChange={(e) => setCustomMins(e.target.value)}
                />
              </div>

              <span style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '14px', color: '#06b6d4' }}>:</span>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Seconds (0-59)</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-input"
                  style={{ width: '75px', textAlign: 'center', padding: '6px', fontSize: '0.9rem' }}
                  value={customSecs}
                  onChange={(e) => setCustomSecs(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem', marginTop: '14px' }}>
                Set Timer
              </button>
            </form>
          )}
        </div>

        {/* Play/Pause & Reset Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button onClick={toggleTimer} className="btn-primary" style={{ padding: '10px 24px' }}>
            {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start Timer</>}
          </button>
          <button onClick={resetTimer} className="btn-secondary" style={{ padding: '10px 18px' }}>
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
