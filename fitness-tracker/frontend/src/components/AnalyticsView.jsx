import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import { BarChart3, TrendingUp, Flame, Dumbbell, Award, Target } from 'lucide-react';

export default function AnalyticsView({ analytics, user }) {
  const calorieTrend = analytics?.calorieTrend || [
    { day: 'Mon', intake: 2100, burned: 450 },
    { day: 'Tue', intake: 2350, burned: 520 },
    { day: 'Wed', intake: 1950, burned: 380 },
    { day: 'Thu', intake: 2400, burned: 600 },
    { day: 'Fri', intake: 2200, burned: 490 },
    { day: 'Sat', intake: 2500, burned: 650 },
    { day: 'Sun', intake: 2150, burned: 420 }
  ];

  const weightTrend = analytics?.weightTrend || [
    { week: 'Week 1', weight: 77.2, target: 72.0 },
    { week: 'Week 2', weight: 76.5, target: 72.0 },
    { week: 'Week 3', weight: 75.9, target: 72.0 },
    { week: 'Current', weight: 75.5, target: 72.0 }
  ];

  const distribution = analytics?.workoutDistribution || [
    { name: 'Chest', count: 5 },
    { name: 'Back', count: 4 },
    { name: 'Legs', count: 6 },
    { name: 'Cardio', count: 3 },
    { name: 'Arms', count: 4 }
  ];

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Visual Analytics & Performance</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time data visualization for calorie balances, weight trends, and volume distribution.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Daily Deficit</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>-340 kcal</h3>
          <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={12} /> Fat loss pace optimal
          </span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Volume Lifted</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#06b6d4', marginTop: '4px' }}>14,250 kg</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>+8% vs last month</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weight Change</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>-1.7 kg</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>3.5 kg remaining to goal</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workout Consistency</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>92%</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>5 sessions / week</span>
        </div>
      </div>

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
            <Dumbbell size={18} color="#06b6d4" /> Muscle Group Split
          </h3>
          <div style={{ width: '100%', height: '240px' }}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
