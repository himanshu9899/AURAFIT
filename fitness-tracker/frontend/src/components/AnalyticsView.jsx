import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Flame, Dumbbell, Award, Target } from 'lucide-react';

export default function AnalyticsView({ analytics, user, workouts = [], foodData = {} }) {
  // 1. Calculate 7-Day Calorie Intake vs Burned strictly from user's logged data
  const calorieTrend = [];
  let totalIntake7Days = 0;
  let totalBurned7Days = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayWorkouts = (workouts || []).filter(w => w.date === dateStr);
    const dayFoodLogs = (foodData?.logs || []).filter(f => f.date === dateStr);

    const burned = dayWorkouts.reduce((sum, w) => sum + Number(w.caloriesBurned || 0), 0);
    const intake = dayFoodLogs.reduce((sum, f) => sum + Number(f.calories || 0), 0);

    totalIntake7Days += intake;
    totalBurned7Days += burned;

    calorieTrend.push({
      day: dayName,
      date: dateStr,
      intake,
      burned
    });
  }

  // 2. Weight Trend
  const currentWeight = Number(user?.weightKg || 70);
  const targetWeight = Number(user?.targetWeightKg || currentWeight);
  const weightDiff = Number((currentWeight - targetWeight).toFixed(1));
  const weightTrend = [
    { week: 'Week 1', weight: currentWeight, target: targetWeight },
    { week: 'Week 2', weight: currentWeight, target: targetWeight },
    { week: 'Week 3', weight: currentWeight, target: targetWeight },
    { week: 'Current', weight: currentWeight, target: targetWeight }
  ];

  // 3. Muscle Group / Activity Split strictly from user workouts
  const typeCounts = {};
  (workouts || []).forEach(w => {
    const type = w.workoutType || w.category || 'Gym';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const distribution = Object.keys(typeCounts).map(type => ({
    name: type,
    count: typeCounts[type]
  }));

  // 4. Calculate total volume lifted
  const totalVolumeLifted = (workouts || []).reduce((sum, w) => {
    let vol = 0;
    if (w.exercises && Array.isArray(w.exercises)) {
      w.exercises.forEach(ex => {
        if (ex.sets && Array.isArray(ex.sets)) {
          ex.sets.forEach(s => {
            vol += (Number(s.reps || 0) * Number(s.weightKg || 0));
          });
        }
      });
    }
    return sum + vol;
  }, 0);

  const avgDailyDeficit = Math.round((totalIntake7Days - totalBurned7Days) / 7);
  const workoutCount = (workouts || []).length;
  const consistencyPct = Math.min(100, Math.round((workoutCount / 7) * 100));

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#34d399'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Visual Analytics & Performance</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time data visualization calculated dynamically from your logged workouts & meals.</p>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Daily Deficit</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
            {avgDailyDeficit === 0 ? '0 kcal' : `${avgDailyDeficit} kcal`}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={12} /> {avgDailyDeficit < 0 ? 'Calorie Deficit Active' : 'Energy Balance Baseline'}
          </span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Volume Lifted</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#06b6d4', marginTop: '4px' }}>
            {totalVolumeLifted.toLocaleString()} kg
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Based on logged gym sets</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Weight Distance</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>
            {weightDiff > 0 ? `+${weightDiff} kg` : `${weightDiff} kg`}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Current: {currentWeight} kg | Target: {targetWeight} kg</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workout Consistency</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>{consistencyPct}%</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{workoutCount} sessions logged</span>
        </div>
      </div>

      {/* Chart 1: 7-Day Calorie Intake vs Burned */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={20} color="#10b981" /> 7-Day Calorie Intake vs Burned
        </h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calorieTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="intake" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIntake)" name="Calories Consumed" />
              <Area type="monotone" dataKey="burned" stroke="#10b981" fillOpacity={1} fill="url(#colorBurned)" name="Active Burned" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Row: Weight Trend & Muscle Group Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="#8b5cf6" /> Weight Trend (kg)
          </h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} name="Actual Weight" />
                <Line type="dash" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target Weight" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={18} color="#06b6d4" /> Muscle Group & Activity Split
          </h3>
          <div style={{ width: '100%', height: '240px' }}>
            {distribution.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <Dumbbell size={32} color="#6b7280" style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>No activity split data yet</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Log workouts to populate your activity split chart!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" borderRadius={[6, 6, 0, 0]} name="Sessions">
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
