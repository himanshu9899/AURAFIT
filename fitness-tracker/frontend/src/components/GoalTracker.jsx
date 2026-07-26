import React, { useState } from 'react';
import { Target, Flame, Clock, Navigation, Dumbbell, Settings, Sparkles, CheckCircle2, AlertCircle, TrendingUp, Trophy, Calendar, Award, Zap } from 'lucide-react';

export default function GoalTracker({ goals, onUpdateGoals, dailyStats, weeklyStats, monthlyStats, overallStats, onTriggerCelebration }) {
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Goal Form State
  const [dailyMinutes, setDailyMinutes] = useState(goals?.dailyMinutes || 60);
  const [dailyCalories, setDailyCalories] = useState(goals?.dailyCalories || 500);
  const [dailyDistanceKm, setDailyDistanceKm] = useState(goals?.dailyDistanceKm || 5);
  const [dailyWorkoutsCount, setDailyWorkoutsCount] = useState(goals?.dailyWorkoutsCount || 1);

  const [weeklyMinutes, setWeeklyMinutes] = useState(goals?.weeklyMinutes || 300);
  const [weeklyCalories, setWeeklyCalories] = useState(goals?.weeklyCalories || 2500);
  const [weeklyDistanceKm, setWeeklyDistanceKm] = useState(goals?.weeklyDistanceKm || 25);
  const [weeklyWorkoutsCount, setWeeklyWorkoutsCount] = useState(goals?.weeklyWorkoutsCount || 5);

  const [monthlyMinutes, setMonthlyMinutes] = useState(goals?.monthlyMinutes || 1200);
  const [monthlyCalories, setMonthlyCalories] = useState(goals?.monthlyCalories || 10000);

  // Calculates percentages
  const getPercent = (actual, target) => Math.min(100, Math.round(((actual || 0) / (target || 1)) * 100));

  const dMinPct = getPercent(dailyStats?.durationMinutes, goals?.dailyMinutes || 60);
  const dCalPct = getPercent(dailyStats?.caloriesBurned, goals?.dailyCalories || 500);
  const dDistPct = getPercent(dailyStats?.distanceKm, goals?.dailyDistanceKm || 5);
  const dCntPct = getPercent(dailyStats?.workoutsCount, goals?.dailyWorkoutsCount || 1);

  const wMinPct = getPercent(weeklyStats?.durationMinutes, goals?.weeklyMinutes || 300);
  const wCalPct = getPercent(weeklyStats?.caloriesBurned, goals?.weeklyCalories || 2500);

  const mMinPct = getPercent(monthlyStats?.durationMinutes, goals?.monthlyMinutes || 1200);

  // Remaining calculation helpers
  const remMinutes = Math.max(0, (goals?.dailyMinutes || 60) - (dailyStats?.durationMinutes || 0));
  const remCalories = Math.max(0, (goals?.dailyCalories || 500) - (dailyStats?.caloriesBurned || 0));
  const remDistance = Math.max(0, ((goals?.dailyDistanceKm || 5) - (dailyStats?.distanceKm || 0)).toFixed(1));
  const remWorkouts = Math.max(0, (goals?.dailyWorkoutsCount || 1) - (dailyStats?.workoutsCount || 0));

  const isDailyCompleted = dMinPct >= 100 || dCalPct >= 100;
  const isWeeklyCompleted = wMinPct >= 100 || wCalPct >= 100;
  const isMonthlyCompleted = mMinPct >= 100;

  const handleSaveGoals = (e) => {
    e.preventDefault();
    onUpdateGoals({
      dailyMinutes: Number(dailyMinutes),
      dailyCalories: Number(dailyCalories),
      dailyDistanceKm: Number(dailyDistanceKm),
      dailyWorkoutsCount: Number(dailyWorkoutsCount),
      weeklyMinutes: Number(weeklyMinutes),
      weeklyCalories: Number(weeklyCalories),
      weeklyDistanceKm: Number(weeklyDistanceKm),
      weeklyWorkoutsCount: Number(weeklyWorkoutsCount),
      monthlyMinutes: Number(monthlyMinutes),
      monthlyCalories: Number(monthlyCalories)
    });
    setShowGoalModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={22} color="#10b981" /> Daily, Weekly & Monthly Goal Tracking
        </h3>
        <button onClick={() => setShowGoalModal(true)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
          <Settings size={14} /> Customize Goals
        </button>
      </div>

      {/* Remaining Target Callout Badges */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '14px',
        background: isDailyCompleted
          ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))'
          : 'rgba(255, 255, 255, 0.03)',
        border: isDailyCompleted ? '1px solid #10b981' : '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {isDailyCompleted ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', fontWeight: '700' }}>
            <Sparkles size={22} />
            <span>🎉 Congratulations! You achieved today's Daily Workout Goal. Keep up the phenomenal work!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Remaining Today:
            </span>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#f3f4f6' }}>
              {remMinutes > 0 && (
                <span>⏱️ You are only <strong style={{ color: '#06b6d4' }}>{remMinutes} minutes</strong> away from today's goal!</span>
              )}
              {remCalories > 0 && (
                <span>🔥 Burn <strong style={{ color: '#10b981' }}>{remCalories} more calories</strong> to complete today's target.</span>
              )}
              {remDistance > 0 && Number(remDistance) > 0 && (
                <span>🏃 <strong style={{ color: '#8b5cf6' }}>{remDistance} km remaining</strong>.</span>
              )}
            </div>
          </div>
        )}

        {/* Manual Celebration Trigger Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onTriggerCelebration('🎉 Daily Goal Completed!', 'You crushed today\'s workout target! Great effort.')}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#34d399' }}
          >
            <Trophy size={12} /> Celebrate Daily
          </button>
          <button
            onClick={() => onTriggerCelebration('🏆 Weekly Target Achieved!', 'Outstanding consistency this week! All weekly goals completed.')}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#22d3ee' }}
          >
            <Trophy size={12} /> Celebrate Weekly
          </button>
        </div>
      </div>

      {/* Goal Progress Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        
        {/* Today's Goal Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#10b981" /> Today's Goal (Daily)
            </span>
            <span className="badge badge-emerald">{dMinPct}% Completed</span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Duration Target</span>
              <span style={{ fontWeight: '700', color: '#10b981' }}>{dailyStats?.durationMinutes || 0} / {goals?.dailyMinutes || 60} mins</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${dMinPct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Active Calories</span>
              <span style={{ fontWeight: '700', color: '#06b6d4' }}>{dailyStats?.caloriesBurned || 0} / {goals?.dailyCalories || 500} kcal</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${dCalPct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Distance</span>
              <span style={{ fontWeight: '700', color: '#8b5cf6' }}>{dailyStats?.distanceKm || 0} / {goals?.dailyDistanceKm || 5} km</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${dDistPct}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Weekly Goal Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#06b6d4" /> Weekly Goal Target
            </span>
            <span className="badge badge-cyan">{wMinPct}% Completed</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Weekly Active Mins</span>
              <span style={{ fontWeight: '700', color: '#06b6d4' }}>{weeklyStats?.durationMinutes || 0} / {goals?.weeklyMinutes || 300} mins</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${wMinPct}%`, height: '100%', background: '#06b6d4', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Weekly Calories</span>
              <span style={{ fontWeight: '700', color: '#8b5cf6' }}>{weeklyStats?.caloriesBurned || 0} / {goals?.weeklyCalories || 2500} kcal</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${wCalPct}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Monthly Goal Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#8b5cf6" /> Monthly Goal Target
            </span>
            <span className="badge badge-violet">{mMinPct}% Completed</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Monthly Duration</span>
              <span style={{ fontWeight: '700', color: '#8b5cf6' }}>{monthlyStats?.durationMinutes || 0} / {goals?.monthlyMinutes || 1200} mins</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${mMinPct}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Monthly Calories</span>
              <span style={{ fontWeight: '700', color: '#f59e0b' }}>{monthlyStats?.caloriesBurned || 0} / {goals?.monthlyCalories || 10000} kcal</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${getPercent(monthlyStats?.caloriesBurned, goals?.monthlyCalories || 10000)}%`, height: '100%', background: '#f59e0b', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Goal Edit Modal */}
      {showGoalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>Customize Workout Goals</h3>
            <form onSubmit={handleSaveGoals} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: '700' }}>Daily Goal Targets</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Minutes</label>
                  <input type="number" className="form-input" value={dailyMinutes} onChange={(e) => setDailyMinutes(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Calories (kcal)</label>
                  <input type="number" className="form-input" value={dailyCalories} onChange={(e) => setDailyCalories(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Distance (km)</label>
                  <input type="number" step="0.5" className="form-input" value={dailyDistanceKm} onChange={(e) => setDailyDistanceKm(e.target.value)} required />
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', color: '#06b6d4', fontWeight: '700', marginTop: '6px' }}>Weekly Goal Targets</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Minutes</label>
                  <input type="number" className="form-input" value={weeklyMinutes} onChange={(e) => setWeeklyMinutes(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Calories (kcal)</label>
                  <input type="number" className="form-input" value={weeklyCalories} onChange={(e) => setWeeklyCalories(e.target.value)} required />
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', color: '#8b5cf6', fontWeight: '700', marginTop: '6px' }}>Monthly Goal Targets</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Minutes</label>
                  <input type="number" className="form-input" value={monthlyMinutes} onChange={(e) => setMonthlyMinutes(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Calories (kcal)</label>
                  <input type="number" className="form-input" value={monthlyCalories} onChange={(e) => setMonthlyCalories(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowGoalModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
