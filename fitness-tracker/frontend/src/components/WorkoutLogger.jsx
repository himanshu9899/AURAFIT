import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, Clock, Flame, Award, Filter, Edit3, Search, Calendar, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

// MET values for auto-calorie calculations
const MET_VALUES = {
  'Running': 9.8,
  'Walking': 3.8,
  'Cycling': 8.5,
  'Swimming': 8.0,
  'Yoga': 3.0,
  'Gym': 6.0,
  'HIIT': 11.0,
  'Pilates': 4.0,
  'Boxing': 9.0,
  'Rowing': 7.0,
  'Hiking': 6.5,
  'Full Body': 6.0
};

export default function WorkoutLogger({ workouts, onAddWorkout, onEditWorkout, onDeleteWorkout, onOpenTimer, userWeightKg = 75 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [workoutType, setWorkoutType] = useState('Gym');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [distanceKm, setDistanceKm] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(350);
  const [autoCalorie, setAutoCalorie] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:45');
  const [intensity, setIntensity] = useState('High');
  const [notes, setNotes] = useState('');

  // Auto-calculate calories based on MET formula: Calories = MET * weight(kg) * duration(hours)
  const calculateCalories = (type, hrs, mins) => {
    const totalHours = (Number(hrs) || 0) + (Number(mins) || 0) / 60;
    const met = MET_VALUES[type] || 6.0;
    return Math.round(met * (userWeightKg || 75) * totalHours);
  };

  const handleTypeOrDurationChange = (newType, newHrs, newMins) => {
    if (autoCalorie) {
      setCaloriesBurned(calculateCalories(newType, newHrs, newMins));
    }
  };

  const handleOpenAdd = (defaultDate = null) => {
    setEditingWorkout(null);
    setTitle('');
    setWorkoutType('Gym');
    setDurationHours(0);
    setDurationMinutes(45);
    setDistanceKm(0);
    setCaloriesBurned(calculateCalories('Gym', 0, 45));
    setAutoCalorie(true);
    setDate(defaultDate || selectedDateFilter || new Date().toISOString().split('T')[0]);
    setStartTime('08:00');
    setEndTime('08:45');
    setIntensity('High');
    setNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (w) => {
    setEditingWorkout(w);
    setTitle(w.title || '');
    setWorkoutType(w.workoutType || w.category || 'Gym');
    setDurationHours(w.durationHours || Math.floor((w.durationMinutes || 45) / 60));
    setDurationMinutes((w.durationMinutes || 45) % 60);
    setDistanceKm(w.distanceKm || 0);
    setCaloriesBurned(w.caloriesBurned || 300);
    setAutoCalorie(false);
    setDate(w.date || new Date().toISOString().split('T')[0]);
    setStartTime(w.startTime || '08:00');
    setEndTime(w.endTime || '08:45');
    setIntensity(w.intensity || 'Moderate');
    setNotes(w.notes || '');
    setShowAddModal(true);
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    if (!title) return;

    const payload = {
      title,
      workoutType,
      category: workoutType,
      date,
      startTime,
      endTime,
      durationHours: Number(durationHours),
      durationMinutes: (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0),
      distanceKm: Number(distanceKm),
      caloriesBurned: Number(caloriesBurned),
      intensity,
      notes
    };

    if (editingWorkout) {
      onEditWorkout(editingWorkout._id, payload);
    } else {
      onAddWorkout(payload);
    }
    setShowAddModal(false);
  };

  // Date Filtering logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredWorkouts = workouts.filter(w => {
    // Exact Date filter override if selected
    if (selectedDateFilter && w.date !== selectedDateFilter) {
      return false;
    }

    // Search query match
    const matchesSearch = !searchQuery || 
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.workoutType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.date || '').includes(searchQuery);

    if (!matchesSearch) return false;

    // Period filter
    if (filterPeriod === 'Today') return w.date === todayStr;
    if (filterPeriod === 'Last 7 Days') {
      const diff = (now - new Date(w.date)) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    }
    if (filterPeriod === 'Last 30 Days') {
      const diff = (now - new Date(w.date)) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    }
    if (filterPeriod === 'This Month') {
      return w.date && w.date.startsWith(todayStr.substring(0, 7));
    }
    return true;
  });

  // Group workouts DATE-WISE
  const groupedByDate = {};
  filteredWorkouts.forEach(w => {
    const d = w.date || todayStr;
    if (!groupedByDate[d]) groupedByDate[d] = [];
    groupedByDate[d].push(w);
  });

  // Sort dates descending (newest dates first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Date-Wise Workout Logger & History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Log workouts for any date, filter by specific day, and view daily session totals.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onOpenTimer} className="btn-secondary">
            <Clock size={16} color="#06b6d4" /> Active Rest Timer
          </button>
          <button onClick={() => handleOpenAdd()} className="btn-primary">
            <Plus size={18} /> Add Workout
          </button>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-input"
            placeholder="Search workouts by title, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Exact Date Picker Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#10b981" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Filter Date:</span>
          <input
            type="date"
            className="form-input"
            value={selectedDateFilter}
            onChange={(e) => {
              setSelectedDateFilter(e.target.value);
              if (e.target.value) setFilterPeriod('All');
            }}
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
          />
          {selectedDateFilter && (
            <button onClick={() => setSelectedDateFilter('')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
              Clear Date
            </button>
          )}
        </div>

        {/* Filter Period Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month'].map(period => (
            <button
              key={period}
              onClick={() => {
                setFilterPeriod(period);
                setSelectedDateFilter('');
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: filterPeriod === period && !selectedDateFilter ? '1px solid #10b981' : '1px solid var(--border-glass)',
                background: filterPeriod === period && !selectedDateFilter ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                color: filterPeriod === period && !selectedDateFilter ? '#34d399' : 'var(--text-muted)',
                fontWeight: filterPeriod === period && !selectedDateFilter ? '700' : '500',
                cursor: 'pointer',
                fontSize: '0.82rem',
                whiteSpace: 'nowrap'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Date-Wise Workouts Sections */}
      {sortedDates.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No workout sessions found for the selected date or filter. Click <strong style={{ color: '#10b981' }}>+ Add Workout</strong> to log a session!
        </div>
      ) : (
        sortedDates.map(dateKey => {
          const dayWorkouts = groupedByDate[dateKey];
          const totalMins = dayWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
          const totalCals = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
          const totalDist = Number(dayWorkouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0).toFixed(1));

          // Format Date Header Label (e.g. "Friday, Jul 24, 2026")
          const dObj = new Date(dateKey + 'T00:00:00');
          const dateLabel = isNaN(dObj.getTime())
            ? dateKey
            : dObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

          const isToday = dateKey === todayStr;

          return (
            <div key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Date Group Header Bar */}
              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                borderRadius: '12px',
                background: isToday ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.1))' : 'rgba(255, 255, 255, 0.03)',
                border: isToday ? '1px solid #10b981' : '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color={isToday ? '#10b981' : '#06b6d4'} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: isToday ? '#34d399' : '#f3f4f6' }}>
                    {dateLabel} {isToday && <span className="badge badge-emerald" style={{ marginLeft: '8px' }}>TODAY</span>}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#fff' }}>{dayWorkouts.length}</strong> {dayWorkouts.length === 1 ? 'workout' : 'workouts'}
                  </span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>{totalMins} mins</span>
                  <span style={{ color: '#06b6d4', fontWeight: '700' }}>{totalCals} kcal</span>
                  {totalDist > 0 && <span style={{ color: '#8b5cf6', fontWeight: '700' }}>{totalDist} km</span>}

                  <button
                    onClick={() => handleOpenAdd(dateKey)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', marginLeft: '6px' }}
                  >
                    + Add to Date
                  </button>
                </div>
              </div>

              {/* Workouts Cards Grid for this specific Date */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                {dayWorkouts.map((w, idx) => (
                  <div key={w._id || idx} className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <span className="badge badge-emerald">{w.workoutType || w.category || 'Gym'}</span>
                          <span className="badge badge-cyan">{w.intensity || 'Moderate'}</span>
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{w.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Clock size={12} /> {w.startTime || '08:00'} - {w.endTime || '08:45'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleOpenEdit(w)} className="btn-secondary" style={{ padding: '6px' }}>
                          <Edit3 size={15} color="#06b6d4" />
                        </button>
                        <button onClick={() => onDeleteWorkout(w._id)} className="btn-danger" style={{ padding: '6px' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: w.distanceKm > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration</span>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{w.durationMinutes} mins</div>
                      </div>

                      {w.distanceKm > 0 && (
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance</span>
                          <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#06b6d4' }}>{w.distanceKm} km</div>
                        </div>
                      )}

                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Burned</span>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#10b981' }}>{w.caloriesBurned} kcal</div>
                      </div>
                    </div>

                    {w.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border-glass)', paddingTop: '8px' }}>
                        "{w.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          );
        })
      )}

      {/* Add / Edit Workout Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>
              {editingWorkout ? 'Edit Workout Session' : 'Add Workout Session'}
            </h3>
            <form onSubmit={handleSaveWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Workout Title</label>
                <input className="form-input" placeholder="e.g. Morning 5K Speed Run" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Workout Type</label>
                  <select
                    className="form-input"
                    value={workoutType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setWorkoutType(newType);
                      handleTypeOrDurationChange(newType, durationHours, durationMinutes);
                    }}
                  >
                    {Object.keys(MET_VALUES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Intensity</label>
                  <select className="form-input" value={intensity} onChange={(e) => setIntensity(e.target.value)}>
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              {/* Duration split: Hours & Minutes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Duration (Hrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    className="form-input"
                    value={durationHours}
                    onChange={(e) => {
                      const hrs = e.target.value;
                      setDurationHours(hrs);
                      handleTypeOrDurationChange(workoutType, hrs, durationMinutes);
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Duration (Mins)</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="form-input"
                    value={durationMinutes}
                    onChange={(e) => {
                      const mins = e.target.value;
                      setDurationMinutes(mins);
                      handleTypeOrDurationChange(workoutType, durationHours, mins);
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                  />
                </div>
              </div>

              {/* Date & Start/End Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📅 Workout Date</label>
                  <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Start Time</label>
                  <input type="time" className="form-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>End Time</label>
                  <input type="time" className="form-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              {/* Calories burned with MET auto calculation indicator */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Est. Calories Burned (kcal)</label>
                  <label style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={autoCalorie}
                      onChange={(e) => {
                        setAutoCalorie(e.target.checked);
                        if (e.target.checked) setCaloriesBurned(calculateCalories(workoutType, durationHours, durationMinutes));
                      }}
                    /> Auto MET Calculate
                  </label>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={caloriesBurned}
                  onChange={(e) => {
                    setAutoCalorie(false);
                    setCaloriesBurned(e.target.value);
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Notes (Optional)</label>
                <textarea className="form-input" placeholder="Notes on pace, resistance, or energy level..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editingWorkout ? 'Update Workout' : 'Save Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
