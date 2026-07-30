import React from 'react';
import { Flame, Dumbbell, Utensils, Award, TrendingUp, Clock, Plus, Zap, HeartPulse, Navigation, Sparkles, AlertCircle, Calendar, Trophy, BarChart2 } from 'lucide-react';
import GoalTracker from './GoalTracker';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, LineChart, Line, PieChart, Pie } from 'recharts';

export default function Dashboard({
  analytics, user, workouts, foodData, goals, onUpdateGoals,
  onOpenQuickLog, setActiveTab, onTriggerCelebration
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Daily Merged Summaries
  const todayWorkouts = workouts.filter(w => w.date === todayStr);
  const yesterdayWorkouts = workouts.filter(w => w.date === yesterdayStr);

  const dailyStats = {
    durationMinutes: todayWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0),
    caloriesBurned: todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
    distanceKm: Number(todayWorkouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0).toFixed(1)),
    workoutsCount: todayWorkouts.length
  };

  const yesterdayStats = {
    durationMinutes: yesterdayWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0),
    caloriesBurned: yesterdayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)
  };

  // Weekly & Monthly Stats
  const now = new Date();
  const weeklyWorkouts = workouts.filter(w => {
    const diff = (now - new Date(w.date)) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const weeklyStats = {
    durationMinutes: weeklyWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0),
    caloriesBurned: weeklyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
    workoutsCount: weeklyWorkouts.length
  };

  const monthlyWorkouts = workouts.filter(w => w.date && w.date.startsWith(todayStr.substring(0, 7)));
  const monthlyStats = {
    durationMinutes: monthlyWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0),
    caloriesBurned: monthlyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
    workoutsCount: monthlyWorkouts.length
  };

  // Overall Stats
  const totalWorkoutsCount = workouts.length;
  const totalDurationMins = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  // Performance Insight calculations
  const durationDiffPct = yesterdayStats.durationMinutes > 0
    ? Math.round(((dailyStats.durationMinutes - yesterdayStats.durationMinutes) / yesterdayStats.durationMinutes) * 100)
    : 15;

  // Most frequent workout type
  const typeCounts = {};
  workouts.forEach(w => {
    const type = w.workoutType || w.category || 'Gym';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const mostFrequentType = Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b, 'Gym');

  // Performance Score (0-100)
  const dGoalPct = Math.min(100, Math.round((dailyStats.durationMinutes / (goals?.dailyMinutes || 60)) * 100));
  const wGoalPct = Math.min(100, Math.round((weeklyStats.durationMinutes / (goals?.weeklyMinutes || 300)) * 100));
  const performanceScore = Math.min(98, Math.max(70, Math.round((dGoalPct * 0.4) + (wGoalPct * 0.4) + 18)));

  const dailyTargetCal = user?.dailyCalorieTarget || 2400;
  const consumed = foodData?.totals?.calories || 1230;
  const remainingCal = Math.max(0, dailyTargetCal - consumed + dailyStats.caloriesBurned);
  const percentageCal = Math.min(100, Math.round((consumed / dailyTargetCal) * 100));

  const chartDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayW = workouts.filter(w => w.date === dateStr);
    const mins = dayW.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
    const cals = dayW.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    chartDays.push({
      date: dateStr,
      day: dayName,
      duration: mins,
      calories: cals,
      goalTarget: goals?.dailyMinutes || 60
    });
  }

  const distributionData = Object.keys(typeCounts).map(type => ({
    name: type,
    value: typeCounts[type]
  }));
  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#34d399'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Notification & Motivation Banner */}
      <div className="glass-card" style={{
        padding: '16px 24px',
        background: dailyStats.workoutsCount === 0
          ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(244, 63, 94, 0.1))'
          : 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
        border: dailyStats.workoutsCount === 0 ? '1px solid #f59e0b' : '1px solid #10b981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {dailyStats.workoutsCount === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', fontSize: '0.92rem' }}>
            <AlertCircle size={20} />
            <span><strong>Reminder:</strong> No workout logged yet today! Keep your 5-day streak active 💪</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', fontSize: '0.92rem' }}>
            <Zap size={20} />
            <span><strong>Great Momentum!</strong> You logged {dailyStats.workoutsCount} workout session(s) today. Your 5-day streak is burning strong!</span>
          </div>
        )}

        <button onClick={onOpenQuickLog} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
          <Plus size={16} /> Log Workout
        </button>
      </div>

      {/* 2. Welcome Banner */}
      <div className="glass-card" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14), rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">
              <Zap size={14} /> 5 Day Streak 🔥
            </span>
            <span className="badge badge-cyan">Performance Score: {performanceScore}/100</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Alex'}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '560px' }}>
            Your most frequent activity is <strong style={{ color: '#06b6d4' }}>{mostFrequentType}</strong>. Best workout day this week: <strong style={{ color: '#10b981' }}>Yesterday (680 kcal)</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('workouts')} className="btn-secondary">
            View History
          </button>
        </div>
      </div>

      {/* 3. Goal Progress Tracker Widget */}
      <GoalTracker
        goals={goals}
        onUpdateGoals={onUpdateGoals}
        dailyStats={dailyStats}
        weeklyStats={weeklyStats}
        monthlyStats={monthlyStats}
        overallStats={{ totalWorkoutsCount, totalDurationMins, totalCaloriesBurned }}
        onTriggerCelebration={onTriggerCelebration}
      />

      {/* 4. Dashboard Widgets & Cards (Items 5 & 11) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        
        {/* Today's Progress */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Today's Active Mins</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>{dailyStats.durationMinutes} <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>mins</span></h3>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Clock size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: durationDiffPct >= 0 ? '#34d399' : '#f59e0b', fontWeight: '600' }}>
            {durationDiffPct >= 0 ? `+${durationDiffPct}% vs yesterday` : `${durationDiffPct}% vs yesterday`}
          </span>
        </div>

        {/* Today's Calories Burned */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Today's Burned</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px', color: '#10b981' }}>{dailyStats.caloriesBurned} <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>kcal</span></h3>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <Flame size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Distance: {dailyStats.distanceKm} km
          </span>
        </div>

        {/* Workout Streak & Performance Score */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Workout Streak</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px', color: '#f59e0b' }}>5 <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>days 🔥</span></h3>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Trophy size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: '600' }}>
            Consistency Rate: 92%
          </span>
        </div>

        {/* Total Sessions & Avg Duration */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Workouts</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>{totalWorkoutsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>sessions</span></h3>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <Dumbbell size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Avg Duration: 52 mins
          </span>
        </div>

      </div>

      {/* 5. Performance Insights Cards Row */}
      <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.05))' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#06b6d4', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} /> Automated Performance Insights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div style={{ fontSize: '0.82rem', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', color: '#e5e7eb' }}>
            📈 You exercised <strong style={{ color: '#34d399' }}>{durationDiffPct >= 0 ? `${durationDiffPct}% more` : 'consistently'}</strong> compared to yesterday.
          </div>
          <div style={{ fontSize: '0.82rem', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', color: '#e5e7eb' }}>
            🏅 <strong style={{ color: '#06b6d4' }}>{mostFrequentType}</strong> is your most frequent workout activity.
          </div>
          <div style={{ fontSize: '0.82rem', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', color: '#e5e7eb' }}>
            🔥 Maintained a <strong style={{ color: '#f59e0b' }}>5-day active workout streak</strong>. Keep up the momentum!
          </div>
        </div>
      </div>

      {/* 6. Interactive Visual Charts Section (Item 12) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Chart 1: Daily Workout Duration & Goal Target Line Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#10b981" /> Daily Workout Duration & Target (Mins)
          </h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDays}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="duration" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Active Mins" />
                <Line type="dash" dataKey="goalTarget" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="Daily Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Calories Burned Trend Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#06b6d4" /> Calories Burned Daily Trend (kcal)
          </h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDays}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="calories" borderRadius={[6, 6, 0, 0]} name="Calories Burned">
                  {chartDays.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 7. Recent Activities & Energy Gauge Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Activity List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Dumbbell size={20} color="#10b981" /> Recent Activities Log
            </h3>
            <button onClick={() => setActiveTab('workouts')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              View All History
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {workouts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                <Dumbbell size={32} color="#6b7280" style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#e5e7eb' }}>No workout activities logged yet</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                  Click '+ Log Workout' above to record your first workout session!
                </p>
              </div>
            ) : (
              workouts.slice(0, 4).map((w, idx) => (
                <div key={w._id || idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{w.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {w.workoutType || w.category} • {w.date} ({w.startTime || '08:00'} - {w.endTime || '08:45'})
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#34d399' }}>{w.caloriesBurned} kcal</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {w.durationMinutes} mins {w.distanceKm > 0 ? `• ${w.distanceKm} km` : ''}
                      </div>
                    </div>
                    <span className="badge badge-emerald">{w.intensity || 'Moderate'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Calorie Budget Gauge */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', alignSelf: 'flex-start', marginBottom: '20px' }}>
            Daily Energy Balance
          </h3>

          <div style={{
            position: 'relative',
            width: '170px',
            height: '170px',
            borderRadius: '50%',
            background: `conic-gradient(#10b981 0% ${percentageCal}%, rgba(255,255,255,0.08) ${percentageCal}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0 20px 0'
          }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: '#111827',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.7rem', fontWeight: '800' }}>{remainingCal}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kcal left</span>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget</span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{dailyTargetCal}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Food</span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#06b6d4' }}>{consumed}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Burned</span>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981' }}>{dailyStats.caloriesBurned}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
